#!/usr/bin/env node
/**
 * GATE: CNPJ nunca visível — no texto renderizado, nos METADADOS ou nos ASSETS.
 *
 * Varre o build (`dist` por padrão) em três camadas:
 *   1. TEXTO VISÍVEL dos HTMLs (sem <script>/<style>/tags);
 *   2. METADADOS dos HTMLs — <title>, meta[content], og/twitter, alt,
 *      aria-label, JSON-LD (incluindo campos taxID/vatID/legalName);
 *   3. ASSETS do build — .js, .css, .json, .xml, .txt, .svg, .webmanifest.
 *
 * Falha se encontrar a palavra "CNPJ" ou um número no formato
 * 00.000.000/0000-00 (ou 14 dígitos seguidos em contexto de CNPJ).
 *
 * Uso: node scripts/check-cnpj-dom.mjs [dist]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const DIR = process.argv[2] || "dist";

const HTML_EXT = new Set([".html"]);
const ASSET_EXT = new Set([".js", ".mjs", ".css", ".json", ".xml", ".txt", ".svg", ".webmanifest"]);

const html = [];
const assets = [];
const walk = (p) => {
  let st;
  try { st = statSync(p); } catch { return; }
  if (st.isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  const ext = extname(p);
  if (HTML_EXT.has(ext)) html.push(p);
  else if (ASSET_EXT.has(ext)) assets.push(p);
};
walk(DIR);

if (!html.length) {
  console.error(`❌ Nenhum HTML encontrado em "${DIR}". Rode o build antes do gate.`);
  process.exit(1);
}

const FORMATADO = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/;
const PALAVRA = /\bCNPJ\b/i;
const CAMPO_FISCAL = /"(taxID|vatID|leiCode|registrationNumber)"\s*:/i;

const visibleText = (src) =>
  src
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ");

/** Extrai só os metadados relevantes (título, metas, alt, aria-label, JSON-LD). */
const metadataText = (src) => {
  const parts = [];
  for (const m of src.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)) parts.push(m[1]);
  for (const m of src.matchAll(/<meta[^>]*content="([^"]*)"[^>]*>/gi)) parts.push(m[1]);
  for (const m of src.matchAll(/\salt="([^"]*)"/gi)) parts.push(m[1]);
  for (const m of src.matchAll(/\saria-label="([^"]*)"/gi)) parts.push(m[1]);
  for (const m of src.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) parts.push(m[1]);
  return parts.join("\n");
};

const hit = (text) => PALAVRA.test(text) || FORMATADO.test(text) || CAMPO_FISCAL.test(text);
const snippetOf = (text) => {
  const idx = Math.max(text.search(FORMATADO), text.search(PALAVRA), text.search(CAMPO_FISCAL), 0);
  return text.slice(Math.max(0, idx - 60), idx + 100).replace(/\s+/g, " ").trim();
};

const findings = [];
for (const file of html) {
  const src = readFileSync(file, "utf8");
  const visivel = visibleText(src);
  if (hit(visivel)) findings.push({ file, camada: "texto visível", snippet: snippetOf(visivel) });
  const meta = metadataText(src);
  if (hit(meta)) findings.push({ file, camada: "metadados", snippet: snippetOf(meta) });
}
for (const file of assets) {
  const src = readFileSync(file, "utf8");
  if (hit(src)) findings.push({ file, camada: "asset", snippet: snippetOf(src) });
}

if (findings.length) {
  console.error(`\n❌ CNPJ encontrado em ${findings.length} ocorrência(s):\n`);
  for (const f of findings) console.error(`  [${f.camada}] ${f.file}\n      ${f.snippet}`);
  console.error("\nO CNPJ não pode aparecer em texto, metadados, JSON-LD ou bundles do build.");
  process.exit(1);
}

console.log(
  `✅ Sem CNPJ: ${html.length} HTML(s) (texto + metadados) e ${assets.length} asset(s) limpos.`,
);
