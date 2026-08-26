#!/usr/bin/env node
/**
 * GATE DE INTERLINKING LOCAL
 *
 * Valida, no HTML estático gerado (dist/), que cada página de bairro/cidade
 * indexável:
 *   1. aponta para a página-mãe /tecnico-informatica-curitiba;
 *   2. aponta para pelo menos um serviço canônico (/servicos ou /servicos/<slug>);
 *   3. NÃO aponta para rota de redirect (<Navigate>) nem para rota noindex;
 *   4. NÃO aponta para uma URL fora do conjunto de rotas canônicas do router.
 *
 * A página-mãe também é verificada: precisa apontar de volta para bairros e
 * cidades indexáveis (hierarquia bidirecional).
 *
 * Uso: node scripts/check-local-interlinking.mjs [dist]
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "dist";
const ROUTER = existsSync("src/LegacyApp.tsx") ? "src/LegacyApp.tsx" : "src/routeTree.gen.ts";
const MOTHER = "/tecnico-informatica-curitiba";
const BASE = "https://tecnico.curitiba.br";
const SITEMAPS = ["public/sitemap-bairros.xml", "public/sitemap-regioes.xml"];

const errors = [];
const notes = [];

if (!existsSync(DIST)) {
  console.error(`✖ ${DIST}/ ausente — rode "npm run build" antes do gate.`);
  process.exit(1);
}

// ── rotas do router ───────────────────────────────────────────────────────
const router = readFileSync(ROUTER, "utf8");
const canonicalRoutes = new Set();
const redirectRoutes = new Set();
for (const m of router.matchAll(/<Route\s+path="([^"]+)"\s+element=\{([^}]*)\}/g)) {
  const [, path, element] = m;
  if (/<Navigate\b/.test(element)) redirectRoutes.add(path);
  else canonicalRoutes.add(path);
}
if (!canonicalRoutes.size && ROUTER.endsWith("routeTree.gen.ts")) {
  for (const m of router.matchAll(/path:\s*'([^']+)'/g)) canonicalRoutes.add(m[1]);
}
const dynamicRoutes = [...canonicalRoutes].filter((r) => r.includes(":"));
const isCanonical = (p) =>
  p === "/" ||
  canonicalRoutes.has(p) ||
  dynamicRoutes.some((r) => new RegExp("^" + r.replace(/:[^/]+/g, "[^/]+") + "$").test(p));

// ── rotas noindex ─────────────────────────────────────────────────────────
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
const noindexPaths = new Set();
for (const file of walk("src/pages").filter((f) => f.endsWith(".tsx"))) {
  const src = readFileSync(file, "utf8");
  if (!/\bnoindex\b/.test(src)) continue;
  for (const m of src.matchAll(/path="(\/[^"]*)"/g)) {
    const before = src.slice(Math.max(0, src.indexOf(m[0]) - 400), src.indexOf(m[0]));
    if (/<PageSEO[^>]*\bnoindex\b/.test(before)) noindexPaths.add(m[1]);
  }
}

// ── páginas locais indexáveis (fonte: sitemaps) ───────────────────────────
const localPaths = [];
for (const f of SITEMAPS) {
  if (!existsSync(f)) continue;
  for (const m of readFileSync(f, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const p = m[1].replace(BASE, "") || "/";
    if (p !== MOTHER) localPaths.push(p);
  }
}
notes.push(`páginas locais indexáveis: ${localPaths.length}`);

const IGNORE = /\.(png|jpe?g|webp|svg|css|js|json|xml|txt|pdf|ico|woff2?)$/i;

function linksOf(path) {
  // TanStack/Nitro builds emit the static client tree under dist/client;
  // retain compatibility with callers that provide a flat dist directory.
  const candidates = [
    join(DIST, path.replace(/^\//, ""), "index.html"),
    join(DIST, "client", path.replace(/^\//, ""), "index.html"),
  ];
  const file = candidates.find((candidate) => existsSync(candidate));
  if (!file) return null;
  const html = readFileSync(file, "utf8");
  const body = html.slice(html.indexOf("<body"));
  const set = new Set();
  for (const m of body.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1].replace(/\/$/, "") || "/";
    if (!IGNORE.test(href)) set.add(href);
  }
  return [...set];
}

const rows = [];
for (const path of [MOTHER, ...localPaths]) {
  const links = linksOf(path);
  if (!links) {
    errors.push(`${path}: HTML estático ausente em ${DIST} — rota não pré-renderizada`);
    continue;
  }
  const toMother = links.includes(MOTHER);
  const servicos = links.filter((l) => l === "/servicos" || l.startsWith("/servicos/"));
  const badRedirect = links.filter((l) => redirectRoutes.has(l));
  const badNoindex = links.filter((l) => noindexPaths.has(l));
  const badUnknown = links.filter((l) => !isCanonical(l) && !redirectRoutes.has(l));

  if (path !== MOTHER) {
    if (!toMother) errors.push(`${path}: não aponta para a página-mãe ${MOTHER}`);
    if (servicos.length === 0) errors.push(`${path}: não aponta para nenhum serviço canônico`);
  } else {
    const bairros = links.filter((l) => l.startsWith("/bairros/"));
    const cidades = links.filter((l) => l.startsWith("/tecnico-informatica-") && l !== MOTHER);
    if (bairros.length === 0) errors.push(`${MOTHER}: página-mãe não aponta para nenhum bairro`);
    if (cidades.length === 0) errors.push(`${MOTHER}: página-mãe não aponta para nenhuma cidade`);
    notes.push(`${MOTHER}: ${bairros.length} bairro(s) e ${cidades.length} cidade(s) linkadas`);
  }
  for (const l of badRedirect) errors.push(`${path}: link para rota de redirect ${l}`);
  for (const l of badNoindex) errors.push(`${path}: link para rota noindex ${l}`);
  for (const l of badUnknown) errors.push(`${path}: link para rota não canônica ${l}`);

  rows.push({ path, links: links.length, mother: toMother, servicos: servicos.length, ok: !badRedirect.length && !badNoindex.length && !badUnknown.length });
}

console.log("── Gate de interlinking local ──");
for (const n of notes) console.log(`  · ${n}`);
for (const r of rows) {
  console.log(
    `  ${r.ok && (r.path === MOTHER || (r.mother && r.servicos)) ? "✓" : "✗"} ${r.path} — ${r.links} link(s), mãe=${r.mother ? "sim" : "não"}, serviços=${r.servicos}`,
  );
}
if (errors.length) {
  console.error(`\n✖ ${errors.length} problema(s) de interlinking local:`);
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
console.log("\n✔ Interlinking local íntegro: mãe ⇄ bairros/cidades, serviços canônicos, sem redirect/noindex.");
