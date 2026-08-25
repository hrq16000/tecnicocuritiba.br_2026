#!/usr/bin/env node
/**
 * GATE FAIL-CLOSED — Fase 1 do pipeline de enriquecimento.
 *
 * Toda rota /bairros/<slug> que NÃO pertence ao conjunto curado (indexável,
 * aprovado por originalidade + prova visual) precisa emitir `noindex` no SSR,
 * via `head: () => seoHead({ ..., noindex: true })`.
 *
 * Sem esse selo explícito a rota herda o head da raiz e nasce `index, follow` —
 * exatamente o vazamento de conteúdo raso que a bairro-pruning-policy proíbe.
 *
 * Uso: node scripts/check-bairros-noindex.mjs [--fix]
 * Com --fix, injeta o head baseline derivado do metaTitle/metaDescription da
 * página correspondente.
 */
import fs from "node:fs";
import path from "node:path";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";

const FIX = process.argv.includes("--fix");
const ROUTES_DIR = "src/routes";
const PAGES_DIR = "src/pages/bairros";
const curado = new Set(CURATED_PATHS);

const routeFiles = fs
  .readdirSync(ROUTES_DIR)
  .filter((f) => /^bairros\.[a-z0-9-]+\.tsx$/.test(f))
  .sort();

const extrair = (src, chave) => {
  const m = src.match(new RegExp(`${chave}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? m[1] : null;
};

const pageFileFor = (routeSrc) => {
  const m = routeSrc.match(/from "@\/pages\/bairros\/([A-Za-z0-9_]+)"/);
  return m ? path.join(PAGES_DIR, `${m[1]}.tsx`) : null;
};

const faltando = [];
const corrigidos = [];

for (const file of routeFiles) {
  const slug = file.replace(/^bairros\./, "").replace(/\.tsx$/, "");
  const routePath = `/bairros/${slug}`;
  if (curado.has(routePath)) continue;

  const full = path.join(ROUTES_DIR, file);
  let src = fs.readFileSync(full, "utf8");
  if (/noindex:\s*true/.test(src)) continue;

  if (!FIX) {
    faltando.push(routePath);
    continue;
  }

  const pageFile = pageFileFor(src);
  if (!pageFile || !fs.existsSync(pageFile)) {
    faltando.push(`${routePath} (página não encontrada)`);
    continue;
  }
  const pageSrc = fs.readFileSync(pageFile, "utf8");
  const title = extrair(pageSrc, "metaTitle");
  const description = extrair(pageSrc, "metaDescription");
  if (!title || !description) {
    faltando.push(`${routePath} (metaTitle/metaDescription ausentes)`);
    continue;
  }

  if (!src.includes('from "@/lib/seo/routeHead"')) {
    src = src.replace(
      /^(import { createFileRoute } from "@tanstack\/react-router";\n)/m,
      `$1import { seoHead } from "@/lib/seo/routeHead";\n`,
    );
  }
  src = src.replace(
    /(createFileRoute\("[^"]+"\)\(\{\n)/,
    `$1  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.\n  head: () => seoHead({ path: "${routePath}", title: ${JSON.stringify(title)}, description: ${JSON.stringify(description)}, noindex: true }),\n`,
  );
  fs.writeFileSync(full, src);
  corrigidos.push(routePath);
}

console.log(`\nRotas de bairro analisadas: ${routeFiles.length}`);
if (corrigidos.length) console.log(`Head baseline injetado em ${corrigidos.length} rota(s).`);

if (faltando.length) {
  console.error(`\n❌ ${faltando.length} rota(s) baseline sem noindex explícito:`);
  faltando.slice(0, 40).forEach((u) => console.error(`  • ${u}`));
  if (faltando.length > 40) console.error(`  … +${faltando.length - 40}`);
  process.exit(1);
}
console.log("✅ Toda rota baseline emite noindex no SSR.");
