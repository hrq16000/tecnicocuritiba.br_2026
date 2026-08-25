#!/usr/bin/env node
/**
 * GATE — CONTRATO DE INDEXABILIDADE DO SITEMAP
 *
 * Regra dura: URL no sitemap ⇒ URL indexável.
 * Falha se qualquer URL declarada no sitemap curado tiver:
 *   - meta robots/X-Robots-Tag com noindex
 *   - canonical divergente (não self-referente)
 *   - HTTP diferente de 200 (redirect, 404, 5xx)
 *   - duplicidade entre sub-sitemaps
 *
 * Modos:
 *   node scripts/check-indexability-contract.mjs dist   # HTML pré-renderizado
 *   node scripts/check-indexability-contract.mjs --live # produção real
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const BASE = "https://tecnico.curitiba.br";
const args = process.argv.slice(2);
const live = args.includes("--live");
const distDir = args.find((a) => !a.startsWith("--")) ?? "dist";

const publicDir = resolve("public");
const files = readdirSync(publicDir).filter(
  (f) => f.startsWith("sitemap-") && f.endsWith(".xml") && !["sitemap-index.xml", "sitemap-images.xml"].includes(f),
);

const seen = new Map();
const dupes = [];
for (const file of files) {
  const xml = readFileSync(resolve(publicDir, file), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = m[1].trim();
    const path = loc.replace(BASE, "") || "/";
    if (seen.has(path)) dupes.push(`${path} (${seen.get(path)} + ${file})`);
    else seen.set(path, file);
  }
}
const paths = [...seen.keys()];
const problemas = dupes.map((d) => `DUPLICADA no sitemap: ${d}`);

function analisar(path, html, http, xRobots) {
  const robots = html.match(/name="robots"\s+content="([^"]+)"/)?.[1] ?? "";
  const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1] ?? null;
  const esperado = path === "/" ? `${BASE}/` : `${BASE}${path}`;
  if (http !== 200) problemas.push(`HTTP ${http}: ${path}`);
  if (/noindex/i.test(robots) || /noindex/i.test(xRobots ?? ""))
    problemas.push(`noindex no sitemap: ${path} (${robots || xRobots})`);
  if (!canonical) problemas.push(`canonical ausente: ${path}`);
  else if (canonical !== esperado && canonical !== esperado.replace(/\/$/, ""))
    problemas.push(`canonical divergente: ${path} → ${canonical}`);
}

if (live) {
  const queue = [...paths];
  async function worker() {
    while (queue.length) {
      const path = queue.shift();
      try {
        const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
        const html = res.status === 200 ? await res.text() : "";
        analisar(path, html, res.status, res.headers.get("x-robots-tag"));
      } catch (e) {
        problemas.push(`falha de rede: ${path} — ${String(e).slice(0, 100)}`);
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
} else {
  const root = existsSync(resolve(distDir, "client")) ? resolve(distDir, "client") : resolve(distDir);
  let ausentes = 0;
  for (const path of paths) {
    const file = path === "/" ? resolve(root, "index.html") : resolve(root, `.${path}`, "index.html");
    const alt = resolve(root, `.${path}.html`);
    const target = existsSync(file) ? file : existsSync(alt) ? alt : null;
    if (!target) {
      ausentes++;
      continue; // rota SSR sem prerender: validada no modo --live
    }
    analisar(path, readFileSync(target, "utf8"), 200, null);
  }
  if (ausentes) console.log(`aviso: ${ausentes} URL(s) sem HTML pré-renderizado — validar com --live.`);
}

if (problemas.length) {
  console.error(`check:indexability-contract FALHOU — ${problemas.length} problema(s):`);
  for (const p of problemas.slice(0, 40)) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`check:indexability-contract OK — ${paths.length} URL(s) do sitemap com contrato válido.`);
