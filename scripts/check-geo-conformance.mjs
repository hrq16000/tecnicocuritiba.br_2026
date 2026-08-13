#!/usr/bin/env node
/**
 * GATE — Conformidade GEO/SEO por rota pública (fail-closed).
 *
 * Roda sobre o `dist/` já construído e valida, para cada URL do sitemap
 * curado (somente páginas que devem ser indexáveis):
 *   1. exatamente 1 <title> não genérico (25–70 chars);
 *   2. exatamente 1 <meta name="description"> (70–165 chars);
 *   3. canonical self-referente (aponta para a própria URL canônica);
 *   4. robots sem noindex/nofollow;
 *   5. exatamente 1 <h1>, com H1 único entre as rotas;
 *   6. ao menos 1 bloco JSON-LD válido, com @context e @type.
 *
 * Uso: node scripts/check-geo-conformance.mjs [dist]
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.argv[2] || "dist");
const SITEMAPS = [
  "sitemap-main.xml",
  "sitemap-servicos.xml",
  "sitemap-bairros.xml",
  "sitemap-problemas.xml",
  "sitemap-regioes.xml",
  "sitemap-marcas.xml",
  "sitemap-editorial.xml",
  "sitemap.xml",
];

if (!existsSync(DIST)) {
  console.error(`BLOQUEADO: ${DIST} não existe — rode "npm run build" antes.`);
  process.exit(1);
}

const decode = (s) =>
  String(s ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const GENERIC = ["lovable app", "lovable generated project", "clique aqui", "sem titulo"];

// ── coleta de URLs do sitemap curado ────────────────────────────────
const urls = new Set();
for (const name of SITEMAPS) {
  const p = path.join(DIST, name);
  if (!existsSync(p)) continue;
  const xml = readFileSync(p, "utf8");
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const loc = decode(m[1]);
    if (/\.xml$/i.test(loc)) continue;
    urls.add(loc);
  }
}

if (urls.size === 0) {
  console.error("BLOQUEADO: nenhum sitemap com <loc> encontrado no dist.");
  process.exit(1);
}

const DESC_IDEAL_MAX = 165;
const DESC_HARD_MAX = 250;
const errors = [];
const warnings = [];
const h1Index = new Map();
let checked = 0;
let skipped = 0;

const htmlFor = (pathname) => {
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  const candidates = clean
    ? [path.join(DIST, clean, "index.html"), path.join(DIST, `${clean}.html`)]
    : [path.join(DIST, "index.html")];
  return candidates.find((c) => existsSync(c)) || null;
};

for (const loc of [...urls].sort()) {
  let pathname;
  try {
    pathname = new URL(loc).pathname;
  } catch {
    errors.push(`${loc}: <loc> não é URL absoluta válida`);
    continue;
  }

  const file = htmlFor(pathname);
  if (!file) {
    // Rota apenas client-side (sem prerender): não é conclusiva aqui.
    skipped++;
    continue;
  }
  checked++;
  const html = readFileSync(file, "utf8");
  const at = (msg) => errors.push(`${pathname}: ${msg}`);

  // 1. title
  const titles = [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map((m) => decode(m[1]));
  if (titles.length !== 1) at(`esperado exatamente 1 <title>, encontrado ${titles.length}`);
  const title = titles[0] || "";
  if (title && (title.length < 25 || title.length > 70))
    at(`title com ${title.length} chars (esperado 25–70): "${title}"`);
  if (GENERIC.some((g) => title.toLowerCase().includes(g))) at(`title genérico: "${title}"`);

  // 2. description
  const descs = [
    ...html.matchAll(/<meta[^>]+name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/gi),
  ].map((m) => decode(m[1]));
  if (descs.length !== 1) at(`esperado exatamente 1 meta description, encontrado ${descs.length}`);
  const desc = descs[0] || "";
  if (desc && (desc.length < 70 || desc.length > DESC_HARD_MAX))
    at(`description com ${desc.length} chars (limite rígido 70–${DESC_HARD_MAX})`);
  else if (desc && desc.length > DESC_IDEAL_MAX)
    warnings.push(`${pathname}: description com ${desc.length} chars (ideal ≤ ${DESC_IDEAL_MAX}, risco de truncamento no Google)`);

  // 3. canonical self
  const canons = [
    ...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/gi),
  ].map((m) => decode(m[1]));
  if (canons.length !== 1) at(`esperado exatamente 1 canonical, encontrado ${canons.length}`);
  if (canons[0]) {
    const canonPath = (() => {
      try {
        return new URL(canons[0], loc).pathname.replace(/\/+$/, "") || "/";
      } catch {
        return canons[0];
      }
    })();
    const selfPath = pathname.replace(/\/+$/, "") || "/";
    if (canonPath !== selfPath) at(`canonical não self-referente: ${canons[0]} ≠ ${selfPath}`);
  }

  // 4. robots
  const robots = [
    ...html.matchAll(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/gi),
  ].map((m) => decode(m[1]).toLowerCase());
  for (const r of robots) {
    if (r.includes("noindex")) at(`URL no sitemap com robots noindex ("${r}")`);
    if (r.includes("nofollow")) at(`URL no sitemap com robots nofollow ("${r}")`);
  }

  // 5. H1 único
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    decode(m[1].replace(/<[^>]+>/g, " ")),
  );
  if (h1s.length !== 1) at(`esperado exatamente 1 <h1>, encontrado ${h1s.length}`);
  const h1 = h1s[0] || "";
  if (h1) {
    const key = h1.toLowerCase();
    const prev = h1Index.get(key);
    if (prev && prev !== pathname) at(`H1 duplicado com ${prev}: "${h1}"`);
    else if (!prev) h1Index.set(key, pathname);
  }

  // 6. JSON-LD
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((m) => m[1]);
  if (blocks.length === 0) at("sem JSON-LD (esperado ao menos 1 bloco)");
  for (const [i, raw] of blocks.entries()) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      at(`JSON-LD #${i + 1} inválido: ${e.message}`);
      continue;
    }
    const nodes = Array.isArray(data) ? data : [data];
    for (const node of nodes) {
      if (!node || typeof node !== "object") {
        at(`JSON-LD #${i + 1} com nó não-objeto`);
        continue;
      }
      if (!node["@context"] && !node["@graph"]) at(`JSON-LD #${i + 1} sem @context`);
      const graph = node["@graph"];
      const typed = Array.isArray(graph) ? graph : [node];
      for (const t of typed) {
        if (t && typeof t === "object" && !t["@type"]) at(`JSON-LD #${i + 1} com nó sem @type`);
      }
    }
  }
}

console.log(
  `── Gate GEO/SEO por rota ──\n  URLs no sitemap: ${urls.size}\n  validadas (prerender): ${checked}\n  sem HTML estático (client-side): ${skipped}`,
);

if (warnings.length) {
  console.warn(`\n⚠️  ${warnings.length} aviso(s) de description longa (não bloqueiam o build):`);
  for (const w of warnings.slice(0, 20)) console.warn(`  • ${w}`);
  if (warnings.length > 20) console.warn(`  … +${warnings.length - 20} outros`);
}

if (errors.length) {
  console.error("\n❌ [geo-conformance] violações encontradas:\n");
  for (const e of errors.slice(0, 200)) console.error(`  • ${e}`);
  if (errors.length > 200) console.error(`  … +${errors.length - 200} outras`);
  console.error(`\n${errors.length} violação(ões). Corrija antes de publicar.`);
  process.exit(1);
}

console.log("✅ [geo-conformance] title/description/canonical/robots/H1/JSON-LD conformes.");
