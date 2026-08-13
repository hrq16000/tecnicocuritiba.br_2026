#!/usr/bin/env node
/**
 * GATE — REDE DE PARCEIROS (mesma régua de prova do resto do portal).
 *
 * Regras fail-closed:
 *   • toda rota /parceiros/<slug> presente no sitemap curado precisa existir
 *     em src/lib/parceirosData.ts e estar sem pendências;
 *   • todo parceiro marcado como aprovado precisa ter suas fotos realmente
 *     existindo em public/ e com peso mínimo (nada de placeholder);
 *   • parceiro com pendência não pode estar no sitemap (fica noindex).
 *
 * Uso: node scripts/check-parceiros.mjs [--report]
 */
import { existsSync, statSync, readFileSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";

const REPORT_ONLY = process.argv.includes("--report");
const MIN_BYTES = 15 * 1024;
const SRC = "src/lib/parceirosData.ts";

const curated = new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)));
const noSitemap = [...curated].filter((p) => p.startsWith("/parceiros/"));

const src = readFileSync(path.resolve(SRC), "utf8");
const errors = [];

// Leitura leve do registro: extrai slugs, status, fotos e contagens.
const registroVazio = /export const PARCEIROS: Parceiro\[\] = \[\];/.test(src);
const slugs = [...src.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
const fotos = [...src.matchAll(/src:\s*"(\/[^"]+)"/g)].map((m) => m[1]);

if (registroVazio && noSitemap.length) {
  errors.push(
    `sitemap declara ${noSitemap.length} rota(s) /parceiros/* mas PARCEIROS está vazio em ${SRC}: ${noSitemap.join(", ")}`,
  );
}

for (const rota of noSitemap) {
  const slug = rota.replace("/parceiros/", "");
  if (!slugs.includes(slug)) errors.push(`${rota} está no sitemap sem entrada correspondente em ${SRC}`);
}

for (const foto of fotos) {
  const file = path.resolve("public", foto.replace(/^\//, ""));
  if (/placeholder|og-image|logo|favicon/i.test(foto)) {
    errors.push(`foto de branding/placeholder usada como prova de parceiro: ${foto}`);
    continue;
  }
  if (!existsSync(file)) {
    errors.push(`foto de parceiro inexistente em public/: ${foto}`);
    continue;
  }
  if (statSync(file).size < MIN_BYTES) {
    errors.push(`foto de parceiro pequena demais (< ${MIN_BYTES / 1024} KB): ${foto}`);
  }
}

// Garantias estruturais do registro (fail-closed no código, não só nos dados).
for (const guard of [
  /export function pendenciasDoParceiro/,
  /export function isParceiroIndexavel/,
  /MIN_FOTOS = \d+/,
]) {
  if (!guard.test(src)) errors.push(`${SRC} perdeu a validação fail-closed esperada (${guard})`);
}

console.log(
  `parceiros: ${slugs.length} no registro · ${noSitemap.length} rota(s) /parceiros/* no sitemap` +
    (registroVazio ? " · registro vazio (nenhum parceiro publicado)" : ""),
);

if (errors.length) {
  console[REPORT_ONLY ? "warn" : "error"](`\n${REPORT_ONLY ? "AVISO" : "BLOQUEADO"}: ${errors.length} problema(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(REPORT_ONLY ? 0 : 1);
}
console.log("OK: rede de parceiros consistente com a régua de prova.");
