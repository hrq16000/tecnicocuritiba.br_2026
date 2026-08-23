#!/usr/bin/env node
/**
 * Injeta `head()` SSR nas rotas curadas (title, description, canonical, OG e
 * JSON-LD LocalBusiness/FAQ), usando `scripts/curated-routes-meta.mjs` como
 * fonte única de verdade.
 *
 * Uso:
 *   node scripts/inject-route-head.mjs          # escreve
 *   node scripts/inject-route-head.mjs --check  # falha se estiver defasado
 *
 * O bloco gerado fica entre marcadores, então a execução é idempotente.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { CURATED_ROUTES } from "./curated-routes-meta.mjs";

/**
 * Gate de prova visual real: bairro sem foto real e sem aprovação explícita em
 * `src/lib/bairroPhotos.ts` recebe `noindex` automaticamente no build.
 */
const photosSrc = readFileSync(resolve(import.meta.dirname, "../src/lib/bairroPhotos.ts"), "utf8");
const comFoto = new Set(
  [...photosSrc.matchAll(/BAIRRO_PHOTOS[^=]*=\s*\{([\s\S]*?)\n\};/g)]
    .flatMap((m) => [...m[1].matchAll(/"?([a-z0-9-]+)"?:\s*\[/g)].map((x) => x[1])),
);
const aprovadosSemFoto = new Set(
  [...(/BAIRROS_SEM_FOTO_APROVADOS\s*=\s*\[([\s\S]*?)\]/.exec(photosSrc)?.[1] ?? "")
    .matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]),
);

function bairroNoindex(path) {
  const m = /^\/bairros\/([a-z0-9-]+)$/.exec(path);
  if (!m) return false;
  return !comFoto.has(m[1]) && !aprovadosSemFoto.has(m[1]);
}

const CHECK = process.argv.includes("--check");
const ROOT = resolve(import.meta.dirname, "..");
const ROUTES_DIR = join(ROOT, "src/routes");
const START = "  /* seo:auto-start */";
const END = "  /* seo:auto-end */";

/** Mapa path da URL -> arquivo de rota, lendo o `createFileRoute("...")`. */
function routeFileIndex() {
  const map = new Map();
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!/\.tsx?$/.test(entry.name)) continue;
      const src = readFileSync(full, "utf8");
      const m = src.match(/createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/);
      if (!m) continue;
      const id = m[1].replace(/\/$/, "") || "/";
      if (!map.has(id)) map.set(id, full);
    }
  };
  walk(ROUTES_DIR);
  return map;
}

const normalizeFaq = (faq) =>
  (faq ?? [])
    .map((f) => ({
      question: f.question ?? f.pergunta ?? "",
      answer: f.answer ?? f.resposta ?? "",
    }))
    .filter((f) => f.question && f.answer);

const block = (route) => {
  const faq = normalizeFaq(route.faq);
  const payload = {
    path: route.path,
    title: route.title,
    description: route.description,
    ...(faq.length ? { faq } : {}),
    ...(route.localBusiness === false ? { localBusiness: false } : {}),
    ...(bairroNoindex(route.path) ? { noindex: true } : {}),
  };

  return [
    START,
    `  head: () => seoHead(${JSON.stringify(payload, null, 2).replace(/\n/g, "\n  ")}),`,
    END,
  ].join("\n");
};

function apply(src, route) {
  let out = src;
  // Remove bloco anterior.
  const esc = (v) => v.trim().replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const re = new RegExp(`[ \\t]*${esc(START)}[\\s\\S]*?${esc(END)}(?:\\r?\\n){1,2}`, "g");
  out = out.replace(re, "");
  if (!out.includes('from "@/lib/seo/routeHead"')) {
    out = out.replace(
      /(^import[^\n]*\n)/,
      `$1import { seoHead } from "@/lib/seo/routeHead";\n`,
    );
  }
  const anchor = out.match(/createFileRoute\([^)]*\)\(\{\r?\n/);
  if (!anchor) return null;
  const at = out.indexOf(anchor[0]) + anchor[0].length;
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  const insertion = `${block(route)}\n`.replace(/\n/g, eol);
  return `${out.slice(0, at)}${insertion}${out.slice(at)}`;
}

const index = routeFileIndex();
const missing = [];
const stale = [];
let written = 0;

const dynamic = [];

for (const route of CURATED_ROUTES) {
  const id = route.path.replace(/\/$/, "") || "/";
  const file = index.get(id);
  if (!file) {
    // Rotas cobertas por segmentos dinâmicos (ex.: /servicos/$servico/$cidade)
    // recebem o head a partir do mapa gerado abaixo.
    dynamic.push(route);
    continue;
  }
  const src = readFileSync(file, "utf8");
  const next = apply(src, route);
  if (!next) { missing.push(`${route.path} (createFileRoute não reconhecido)`); continue; }
  if (next === src) continue;
  if (CHECK) { stale.push(route.path); continue; }
  writeFileSync(file, next);
  written += 1;
}

// Mapa para rotas dinâmicas.
const generated = `/* eslint-disable */
// GERADO por scripts/inject-route-head.mjs — não editar à mão.
import type { RouteHeadInput } from "@/lib/seo/routeHead";

export const CURATED_DYNAMIC_HEAD: Record<string, RouteHeadInput> = ${JSON.stringify(
  Object.fromEntries(
    dynamic.map((r) => {
      const faq = normalizeFaq(r.faq);
      return [
        r.path,
        { path: r.path, title: r.title, description: r.description, ...(faq.length ? { faq } : {}) },
      ];
    }),
  ),
  null,
  2,
)};
`;
const generatedPath = join(ROOT, "src/lib/seo/curatedDynamicHead.generated.ts");
const current = (() => { try { return readFileSync(generatedPath, "utf8"); } catch { return ""; } })();
if (current.replace(/\r\n/g, "\n") !== generated) {
  if (CHECK) stale.push("src/lib/seo/curatedDynamicHead.generated.ts");
  else writeFileSync(generatedPath, generated);
}

if (missing.length) {
  console.error(`[route-head] rotas curadas sem arquivo em src/routes:\n  ${missing.join("\n  ")}`);
}
if (CHECK && stale.length) {
  console.error(
    `[route-head] head() defasado em ${stale.length} rota(s). Rode: node scripts/inject-route-head.mjs\n  ${stale.slice(0, 15).join("\n  ")}`,
  );
  process.exit(1);
}
if (missing.length) process.exit(1);

console.log(
  `[route-head] ok — ${CURATED_ROUTES.length} rotas curadas (${dynamic.length} dinâmicas), ${written} arquivo(s) atualizado(s)`,
);

