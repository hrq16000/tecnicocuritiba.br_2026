#!/usr/bin/env node
/**
 * ============================================================================
 * AUDITORIA DE `noindex` EM PRODUÇÃO (resposta a relatórios do Search Console)
 * ============================================================================
 * O Search Console reporta "Excluída pela tag noindex" com atraso de dias ou
 * semanas. Antes de mexer em qualquer registro de indexação, este script
 * confere o estado REAL de cada URL curada na produção:
 *
 *   • status HTTP
 *   • header X-Robots-Tag
 *   • meta robots renderizado no HTML servido
 *   • canonical
 *
 * Saída: reports/auditoria-noindex-live.json
 * Falha (exit 1) apenas quando uma URL CURADA está realmente bloqueada.
 *
 * Uso: node scripts/auditar-noindex-live.mjs [--base https://tecnico.curitiba.br]
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { CURATED_PATHS, BASE_URL } from "./lib/curated-urls.mjs";

const argBase = process.argv.find((a) => a.startsWith("--base="));
const base = argBase ? argBase.split("=")[1] : BASE_URL;
const extras = process.argv.slice(2)
  .filter((a) => a.startsWith("/"))
  .map((a) => a.trim());

const alvos = [...new Set([...CURATED_PATHS, ...extras])];

const meta = (html, nome) => {
  const re = new RegExp(`<meta[^>]+name=["']${nome}["'][^>]+content=["']([^"']*)["']`, "i");
  return html.match(re)?.[1] ?? null;
};

async function auditar(path) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const html = res.status < 400 ? await res.text() : "";
    const xRobots = res.headers.get("x-robots-tag");
    const robots = meta(html, "robots");
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? null;
    const bloqueado =
      /noindex/i.test(xRobots ?? "") || /noindex/i.test(robots ?? "") || res.status !== 200;
    return { path, status: res.status, xRobots, robots, canonical, bloqueado };
  } catch (e) {
    return { path, status: 0, erro: String(e), bloqueado: true };
  }
}

const resultados = [];
for (let i = 0; i < alvos.length; i += 8) {
  const lote = alvos.slice(i, i + 8);
  resultados.push(...(await Promise.all(lote.map(auditar))));
}

const bloqueadas = resultados.filter((r) => r.bloqueado);
mkdirSync("reports", { recursive: true });
writeFileSync(
  "reports/auditoria-noindex-live.json",
  JSON.stringify(
    { base, geradoEm: new Date().toISOString(), total: resultados.length, bloqueadas: bloqueadas.length, resultados },
    null,
    2,
  ),
);

console.log(`Auditoria noindex: ${resultados.length} URLs · ${bloqueadas.length} bloqueada(s)`);
for (const r of bloqueadas) {
  console.log(`  ✗ ${r.path} — HTTP ${r.status} · x-robots=${r.xRobots ?? "-"} · robots=${r.robots ?? "-"}`);
}
process.exit(bloqueadas.length > 0 ? 1 : 0);
