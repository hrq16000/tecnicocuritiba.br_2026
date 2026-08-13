/**
 * Helper compartilhado — leitura do DOM RENDERIZADO do dist/.
 *
 * Sobe scripts/serve-dist.mjs, abre cada rota no Chromium (Playwright) e
 * devolve o resultado de um extrator executado dentro da página. É o único
 * modo confiável de medir conteúdo/imagens deste app (SPA hidratado): o HTML
 * pré-renderizado carrega apenas o shell em boa parte das rotas.
 *
 * Fail-closed: quando o navegador não está disponível, lança — o script
 * chamador decide se falha o build ou degrada para modo estático.
 */
import { existsSync } from "node:fs";
import path from "node:path";

export async function withRenderedPages({ dist, paths, port = 4188, extractor, onPage }) {
  const { spawn, spawnSync } = await import("node:child_process");
  const { chromium } = await import("playwright");

  if (!existsSync(path.join(dist, "route-manifest.json"))) {
    spawnSync(process.execPath, ["scripts/generate-route-manifest.mjs", dist], { stdio: "ignore" });
  }
  const server = spawn(process.execPath, ["scripts/serve-dist.mjs", String(port), dist], { stdio: "ignore" });
  const base = `http://127.0.0.1:${port}`;

  const ready = async () => {
    for (let i = 0; i < 40; i++) {
      try {
        if ((await fetch(`${base}/`)).ok) return true;
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    return false;
  };
  if (!(await ready())) {
    server.kill("SIGKILL");
    throw new Error("servidor de paridade (serve-dist) não subiu");
  }

  let browser;
  try {
    browser = await chromium.launch();
  } catch (err) {
    server.kill("SIGKILL");
    throw new Error(
      `navegador do Playwright indisponível (${String(err).split("\n")[0]}). ` +
        `Rode "npx playwright install --with-deps chromium".`,
    );
  }

  const results = new Map();
  const missing = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
  try {
    for (const routePath of paths) {
      const res = await page.goto(`${base}${routePath}`, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => null);
      if (!res || res.status() >= 400) {
        missing.push(routePath);
        continue;
      }
      await page.waitForSelector("main", { timeout: 15000 }).catch(() => null);
      const data = await page.evaluate(extractor).catch(() => null);
      if (data == null) {
        missing.push(routePath);
        continue;
      }
      results.set(routePath, data);
      onPage?.(routePath, data);
    }
  } finally {
    await browser.close();
    server.kill("SIGKILL");
  }
  return { results, missing };
}
