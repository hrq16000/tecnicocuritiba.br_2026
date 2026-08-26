#!/usr/bin/env node
/**
 * Gera o inventário das rotas dinâmicas sem inicializar o grafo completo do
 * aplicativo. O utilitário anterior usava tsx e importava todos os módulos
 * de conteúdo; em ambientes limitados isso podia falhar no uv_os_get_passwd
 * antes mesmo de processar os artefatos.
 */
import { readFileSync, writeFileSync } from "node:fs";

const out = process.argv[2] || "dist/dynamic-slugs.json";
const slugsFrom = (file) => {
  const source = readFileSync(file, "utf8");
  return [...source.matchAll(/\bslug\s*:\s*["']([^"']+)["']/g)].map((m) => m[1]);
};

const brandSlugs = slugsFrom("src/lib/brandsData.ts").map((slug) => `/marcas/${slug}`);
const problemaSlugs = slugsFrom("src/lib/problemaPagesData.ts");
const paths = [
  ...brandSlugs,
  ...problemaSlugs.map((slug) => `/problemas/${slug}`),
  ...problemaSlugs.map((slug) => `/procedimentos/${slug}`),
].filter((path, index, all) => all.indexOf(path) === index).sort();

writeFileSync(out, `${JSON.stringify({ generatedAt: new Date().toISOString(), paths }, null, 2)}\n`);
console.log(`[dynamic-slugs] ${paths.length} rotas dinâmicas válidas → ${out}`);
