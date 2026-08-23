// Exporta, a partir das fontes reais de dados do app, os slugs válidos das
// rotas dinâmicas que não são pré-renderizadas (/marcas/:slug, /problemas/:slug,
// /procedimentos/:slug). Sem isso, qualquer slug inventado responderia 200
// (soft-404). Executado com tsx no postbuild.
//
// Uso: tsx scripts/dump-dynamic-slugs.ts dist/dynamic-slugs.json

import { writeFileSync } from "node:fs";
import { brandsData } from "../src/lib/brandsData";
import { getAllProblemaSlugs } from "../src/lib/problemaPagesData";

const out = process.argv[2] || "dist/dynamic-slugs.json";

const brandSlugs = brandsData.map((b) => `/marcas/${b.slug}`);

const slugs = getAllProblemaSlugs();
const problemaSlugs = slugs.map((slug) => `/problemas/${slug}`);
const procedimentoSlugs = slugs.map((slug) => `/procedimentos/${slug}`);

const paths = [...new Set([...brandSlugs, ...problemaSlugs, ...procedimentoSlugs])].sort();
writeFileSync(out, `${JSON.stringify({ generatedAt: new Date().toISOString(), paths }, null, 2)}\n`);
console.log(`[dynamic-slugs] ${paths.length} rotas dinâmicas válidas → ${out}`);
