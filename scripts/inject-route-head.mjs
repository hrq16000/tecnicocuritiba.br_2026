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
  const re = new RegExp(`${START.trim()}[\\s\\S]*?${END.trim()}\\n?`, "");
  out = out.replace(re, "");
  if (!out.includes('from "@/lib/seo/routeHead"')) {
    out = out.replace(
      /(^import[^\n]*\n)/,
      `$1import { seoHead } from "@/lib/seo/routeHead";\n`,
    );
  }
  const anchor = out.match(/createFileRoute\([^)]*\)\(\{\n/);
  if (!anchor) return null;
  const at = out.indexOf(anchor[0]) + anchor[0].length;
  return `${out.slice(0, at)}${block(route)}\n${out.slice(at)}`;
}

const index = routeFileIndex();
const missing = [];
const stale = [];
let written = 0;

for (const route of CURATED_ROUTES) {
  const id = route.path.replace(/\/$/, "") || "/";
  const file = index.get(id);
  if (!file) { missing.push(route.path); continue; }
  const src = readFileSync(file, "utf8");
  const next = apply(src, route);
  if (!next) { missing.push(`${route.path} (createFileRoute não reconhecido)`); continue; }
  if (next === src) continue;
  if (CHECK) { stale.push(route.path); continue; }
  writeFileSync(file, next);
  written += 1;
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

console.log(`[route-head] ok — ${CURATED_ROUTES.length} rotas curadas, ${written} arquivo(s) atualizado(s)`);
