#!/usr/bin/env node
/**
 * Gate de assets de mídia.
 *  - og:image padrão (PageSEO) e og:image do index.html apontam para arquivo real em public/.
 *  - Mídia kit em PDF existe, não está vazio e é um PDF válido.
 *  - Todo asset público referenciado no código (/algo.png|jpg|jpeg|webp|avif|svg|pdf)
 *    existe em public/ — evita 404 em og:image e downloads.
 */
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const errors = [];
const info = [];

const publicPath = (url) => join("public", url.replace(/^https?:\/\/[^/]+/, "").split("?")[0]);

// 1) og:image padrão do PageSEO
const seo = readFileSync("src/components/PageSEO.tsx", "utf8");
const defaultOg = seo.match(/DEFAULT_OG_IMAGE\s*=\s*"([^"]+)"/)?.[1];
if (!defaultOg) errors.push("DEFAULT_OG_IMAGE não encontrado em src/components/PageSEO.tsx");
else if (!existsSync(publicPath(defaultOg))) errors.push(`og:image padrão ausente em public/: ${defaultOg}`);
else info.push(`og:image padrão OK: ${defaultOg}`);

// 2) og:image do documento raiz (TanStack Start: head() da rota __root)
const ROOT_DOC = existsSync("index.html") ? "index.html" : "src/routes/__root.tsx";
const html = readFileSync(ROOT_DOC, "utf8");
for (const m of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|og:image:secure_url|twitter:image)["'][^>]*content=["']([^"']+)["']/gi)) {
  const url = m[1];
  if (/^https?:\/\//.test(url) && !url.includes("tecnico.curitiba.br")) continue; // externo
  if (!existsSync(publicPath(url))) errors.push(`${ROOT_DOC} referencia imagem inexistente: ${url}`);
  else info.push(`${ROOT_DOC} og/twitter image OK: ${url}`);
}

// 3) Mídia kit em PDF
const KIT = "public/midia-kit-tecnico-curitiba.pdf";
if (!existsSync(KIT)) {
  errors.push("Mídia kit ausente: public/midia-kit-tecnico-curitiba.pdf");
} else {
  const buf = readFileSync(KIT);
  if (!buf.subarray(0, 5).toString("latin1").startsWith("%PDF-")) errors.push("Mídia kit não é um PDF válido");
  else if (statSync(KIT).size < 5000) errors.push("Mídia kit suspeito: arquivo menor que 5 KB");
  else info.push(`Mídia kit OK: ${(statSync(KIT).size / 1024).toFixed(0)} KB`);
}

// 4) Assets públicos referenciados no código
const EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg", ".pdf", ".ico"]);
const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?|html)$/.test(e.name)) files.push(p);
  }
};
walk("src");
if (existsSync("index.html")) files.push("index.html");

const missing = new Set();
for (const file of files) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/["'`](\/[A-Za-z0-9._/-]+\.[a-z0-9]{2,5})["'`]/g)) {
    const url = m[1];
    if (!EXT.has(extname(url))) continue;
    if (url.startsWith("/src/") || url.startsWith("/assets/")) continue; // bundler
    if (url.startsWith("/casos/")) continue; // exemplos de importação de provas (upload manual)
    if (!existsSync(join("public", url))) missing.add(`${url} (referenciado em ${file})`);
  }
}
for (const m of missing) errors.push(`Asset público ausente: ${m}`);
if (!missing.size) info.push("Nenhuma referência a asset público inexistente");

console.log("\nGate de assets de mídia (og:image, mídia kit e arquivos públicos)");
for (const i of info) console.log(` ✅ ${i}`);
for (const e of errors) console.log(` ❌ ${e}`);
console.log("");

if (errors.length) process.exit(1);
