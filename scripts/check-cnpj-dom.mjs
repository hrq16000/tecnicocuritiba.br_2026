#!/usr/bin/env node
/**
 * GATE: CNPJ nunca visível no HTML renderizado.
 *
 * Varre os HTMLs de `dist` (ou do diretório passado), remove <script>/<style>
 * e todas as tags, e falha se sobrar no TEXTO VISÍVEL a palavra "CNPJ" ou um
 * número no formato 00.000.000/0000-00 (ou 14 dígitos seguidos).
 *
 * Uso: node scripts/check-cnpj-dom.mjs [dist]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const DIR = process.argv[2] || "dist";

const files = [];
const walk = (p) => {
  let st;
  try { st = statSync(p); } catch { return; }
  if (st.isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  if (extname(p) === ".html") files.push(p);
};
walk(DIR);

if (!files.length) {
  console.error(`❌ Nenhum HTML encontrado em "${DIR}". Rode o build antes do gate.`);
  process.exit(1);
}

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ");

const FORMATADO = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/;
const PALAVRA = /\bCNPJ\b/i;

const findings = [];
for (const file of files) {
  const text = visibleText(readFileSync(file, "utf8"));
  if (PALAVRA.test(text) || FORMATADO.test(text)) {
    findings.push({ file, snippet: text.replace(/\s+/g, " ").trim().slice(0, 160) });
  }
}

if (findings.length) {
  console.error(`\n❌ CNPJ visível em ${findings.length} página(s):\n`);
  for (const f of findings) console.error(`  ${f.file}\n      ${f.snippet}`);
  process.exit(1);
}

console.log(`✅ Sem CNPJ visível: ${files.length} HTML(s) limpos.`);
