#!/usr/bin/env node
/**
 * GATE DE HIERARQUIA LOCAL — Rodada 4D
 *
 * Impede que as páginas locais (bairros e cidades) briguem entre si ou com a
 * página-mãe /tecnico-informatica-curitiba. Falha quando:
 *
 *  1. URL noindex está no sitemap.
 *  2. URL de redirect (alias) está no sitemap.
 *  3. Página local no sitemap não tem rota canônica declarada no router.
 *  4. Duas páginas locais declaram o mesmo title ou a mesma description.
 *  5. Página de bairro/cidade usa o title da página-mãe (intenção genérica
 *     "técnico de informática Curitiba" sem qualificador local).
 *  6. Bloco de links locais repete a MESMA anchor para destinos diferentes,
 *     ou usa a fórmula "Técnico de Informática em X" em todos os links.
 *
 * Uso: node scripts/check-local-hierarchy.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROUTER = existsSync("src/LegacyApp.tsx") ? "src/LegacyApp.tsx" : "src/routeTree.gen.ts";
const SITEMAPS = ["public/sitemap-bairros.xml", "public/sitemap-regioes.xml", "public/sitemap-main.xml"];
const MOTHER = "/tecnico-informatica-curitiba";
const BASE = "https://tecnico.curitiba.br";

const errors = [];
const warnings = [];
const notes = [];

// ── 1. Rotas do router: canônicas x redirects ────────────────────────────
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
notes.push(`rotas canônicas: ${canonicalRoutes.size} · redirects: ${redirectRoutes.size}`);

// ── 2. Páginas locais: dados curados ─────────────────────────────────────
function readMeta(file) {
  if (!existsSync(file)) return null;
  const src = readFileSync(file, "utf8");
  return src;
}

/** Extrai pares metaTitle/metaDescription dos arquivos de dados curados. */
function collectCuratedMeta(file, kind) {
  const src = readMeta(file);
  if (!src) return [];
  const out = [];
  const slugRe = /slug:\s*"([^"]+)"/g;
  let m;
  const positions = [];
  while ((m = slugRe.exec(src))) positions.push({ slug: m[1], at: m.index });
  positions.forEach((p, i) => {
    const chunk = src.slice(p.at, positions[i + 1]?.at ?? src.length);
    const title = (chunk.match(/metaTitle:\s*\n?\s*"([^"]+)"/) || chunk.match(/metaTitle:\s*"([^"]+)"/) || [])[1];
    const desc = (chunk.match(/metaDescription:\s*\n?\s*"([^"]+)"/) || [])[1];
    const h1 = (chunk.match(/h1:\s*\n?\s*"([^"]+)"/) || [])[1];
    out.push({ kind, slug: p.slug, title, desc, h1 });
  });
  return out;
}

const locals = [
  ...collectCuratedMeta("src/lib/bairrosData.ts", "bairro"),
  ...collectCuratedMeta("src/lib/cidadesData.ts", "cidade"),
];
notes.push(`páginas locais curadas inspecionadas: ${locals.length}`);

// ── 3. Sitemap: noindex, redirect e rota inexistente ─────────────────────
const sitemapUrls = [];
for (const f of SITEMAPS) {
  if (!existsSync(f)) continue;
  for (const m of readFileSync(f, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    sitemapUrls.push({ file: f, url: m[1], path: m[1].replace(BASE, "") || "/" });
  }
}
notes.push(`URLs nos sitemaps locais/main: ${sitemapUrls.length}`);

// páginas com PageSEO noindex
const noindexPaths = new Set();
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}
for (const file of walk("src/pages").filter((f) => f.endsWith(".tsx"))) {
  const src = readFileSync(file, "utf8");
  if (!/\bnoindex\b/.test(src)) continue;
  for (const m of src.matchAll(/path="(\/[^"]*)"/g)) {
    // apenas o path do próprio PageSEO noindex
    const idx = src.indexOf(m[0]);
    const before = src.slice(Math.max(0, idx - 400), idx);
    if (/<PageSEO[^>]*\bnoindex\b/.test(before)) noindexPaths.add(m[1]);
  }
}
notes.push(`rotas com PageSEO noindex detectadas: ${noindexPaths.size}`);

for (const u of sitemapUrls) {
  if (noindexPaths.has(u.path)) errors.push(`sitemap contém rota noindex: ${u.path} (${u.file})`);
  if (redirectRoutes.has(u.path)) errors.push(`sitemap contém rota de redirect: ${u.path} (${u.file})`);
  const isDynamic = [...canonicalRoutes].some((r) => r.includes(":") && new RegExp("^" + r.replace(/:[^/]+/g, "[^/]+") + "$").test(u.path));
  if (!canonicalRoutes.has(u.path) && !isDynamic && u.path !== "/")
    errors.push(`sitemap aponta para rota sem componente canônico: ${u.path} (${u.file})`);
}

// ── 4. Title/description duplicados entre páginas locais ─────────────────
const byTitle = new Map();
const byDesc = new Map();
for (const l of locals) {
  if (l.title) (byTitle.get(l.title) ?? byTitle.set(l.title, []).get(l.title)).push(l.slug);
  if (l.desc) (byDesc.get(l.desc) ?? byDesc.set(l.desc, []).get(l.desc)).push(l.slug);
}
for (const [t, slugs] of byTitle) if (slugs.length > 1) errors.push(`title duplicado entre páginas locais (${slugs.join(", ")}): "${t}"`);
for (const [d, slugs] of byDesc) if (slugs.length > 1) errors.push(`description duplicada entre páginas locais (${slugs.join(", ")}): "${d.slice(0, 70)}…"`);

// ── 5. Página local disputando a intenção genérica da página-mãe ─────────
const GENERIC = /t[eé]cnico de inform[aá]tica (em )?curitiba/i;
for (const l of locals) {
  if (l.slug === "curitiba") continue;
  for (const [field, value] of [["title", l.title], ["h1", l.h1]]) {
    if (!value) continue;
    // permitido citar Curitiba como qualificador ("no Batel – Curitiba"),
    // proibido usar a fórmula genérica exata da página-mãe.
    const stripped = value.replace(/[–—|(),]/g, " ").replace(/\s+/g, " ");
    if (GENERIC.test(stripped) && !new RegExp(l.slug.split("-")[0], "i").test(stripped))
      errors.push(`${l.kind} "${l.slug}" disputa a intenção genérica da página-mãe no ${field}: "${value}"`);
  }
}

// ── 6. Anchors dos blocos locais ─────────────────────────────────────────
const LINK_BLOCK_FILES = [
  "src/pages/TecnicoInformaticaCuritiba.tsx",
  "src/components/home/HomeSections.tsx",
];
for (const file of LINK_BLOCK_FILES) {
  if (!existsSync(file)) continue;
  const src = readFileSync(file, "utf8");
  const pairs = [
    ...src.matchAll(/\{\s*(?:to|href):\s*"(\/(?:bairros|tecnico-informatica)[^"]*)",\s*label:\s*"([^"]+)"/g),
  ].map((m) => ({ to: m[1], label: m[2] }));
  if (pairs.length === 0) continue;
  const seen = new Map();
  for (const p of pairs) {
    const prev = seen.get(p.label);
    if (prev && prev !== p.to) errors.push(`${file}: anchor repetida "${p.label}" para destinos diferentes (${prev}, ${p.to})`);
    seen.set(p.label, p.to);
  }
  const formulaic = pairs.filter((p) => /^t[eé]cnico de inform[aá]tica em /i.test(p.label));
  if (pairs.length >= 3 && formulaic.length / pairs.length > 0.5)
    errors.push(`${file}: ${formulaic.length}/${pairs.length} anchors locais usam a fórmula "Técnico de Informática em X" — varie os textos`);
  for (const p of pairs) {
    if (redirectRoutes.has(p.to)) errors.push(`${file}: link interno aponta para rota de redirect ${p.to}`);
    if (noindexPaths.has(p.to)) errors.push(`${file}: link interno destaca rota noindex ${p.to}`);
  }
  notes.push(`${file}: ${pairs.length} link(s) local(is), ${new Set(pairs.map((p) => p.label)).size} anchor(s) distintas`);
}

// ── 7. Bairro precisa apontar para a página-mãe ──────────────────────────
const layout = readMeta("src/components/bairro/BairroLocalLayout.tsx") ?? "";
if (!layout.includes(MOTHER)) errors.push(`BairroLocalLayout não referencia a página-mãe ${MOTHER}`);

// ── Saída ────────────────────────────────────────────────────────────────
console.log("── Gate de hierarquia local (Rodada 4D) ──");
for (const n of notes) console.log(`  · ${n}`);
for (const w of warnings) console.warn(`  ! ${w}`);
if (errors.length) {
  console.error(`\n✖ ${errors.length} violação(ões) de hierarquia local:`);
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
console.log("\n✔ Hierarquia local íntegra: sem noindex/redirect no sitemap, sem títulos duplicados, anchors variadas.");
