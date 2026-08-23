#!/usr/bin/env node
/**
 * ============================================================================
 * VERIFICAÇÃO DE LINKS INTERNOS + INTEGRIDADE DO SITEMAP
 * ============================================================================
 * Roda no build/CI (sem servidor). Detecta antes do publish:
 *
 *  1. URLs do sitemap que não correspondem a nenhuma rota declarada
 *     (404 garantido em produção).
 *  2. Links internos no código (`to="/x"` / `href="/x"`) que apontam para
 *     rotas inexistentes (link quebrado).
 *  3. Páginas órfãs: URLs indexáveis no sitemap sem nenhum link interno
 *     apontando para elas.
 *  4. Domínio incorreto dentro dos <loc> (deve ser sempre o canônico).
 *
 * Uso:  node scripts/check-internal-links.mjs [--strict]
 *       --strict → órfãs também derrubam o build.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { tanstackRouteIndex } from "./lib/tanstack-routes.mjs";

const ROOT = process.cwd();
const CANONICAL = "https://tecnico.curitiba.br";
const STRICT = process.argv.includes("--strict");

// ── 1. Rotas declaradas ──────────────────────────────────────────────────────
const { staticRoutes, dynamicRoutes } = tanstackRouteIndex(ROOT);

const isKnownRoute = (path) => {
  const clean = (path.split("#")[0].split("?")[0].replace(/\/$/, "") || "/");
  if (existsSync(join(ROOT, "public", clean.replace(/^\//, "")))) return true;
  if (staticRoutes.has(clean)) return true;
  return dynamicRoutes.some((re) => re.test(clean));
};

// ── 2. URLs do sitemap ───────────────────────────────────────────────────────
const sitemapFiles = readdirSync(join(ROOT, "public")).filter(
  (f) => f.startsWith("sitemap") && f.endsWith(".xml") && f !== "sitemap-index.xml",
);

const sitemapUrls = [];
for (const f of sitemapFiles) {
  const xml = readFileSync(join(ROOT, "public", f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    sitemapUrls.push({ file: f, url: m[1].trim() });
  }
}

// ── 3. Links internos no código ──────────────────────────────────────────────
const SRC_EXT = new Set([".ts", ".tsx"]);
const internalLinks = new Map(); // path → Set(arquivos de origem)
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) { walk(full); continue; }
    if (!SRC_EXT.has(extname(entry))) continue;
    if (/\.(test|spec)\.tsx?$/.test(entry) || entry.endsWith(".gen.ts")) continue;
    const code = readFileSync(full, "utf8");
    const rel = full.replace(`${ROOT}/`, "");
    for (const m of code.matchAll(/(?:to|href)=["'](\/[^"'`{}\s]*)["']/g)) {
      const path = m[1].split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
      if (!internalLinks.has(path)) internalLinks.set(path, new Set());
      internalLinks.get(path).add(rel);
    }
    // links montados por template (`/servicos/${slug}`) → registra o prefixo
    for (const m of code.matchAll(/(?:to|href)=\{`(\/[^`$]*)\$\{/g)) {
      const prefix = m[1].replace(/\/$/, "");
      if (!prefix) continue;
      const key = `${prefix}/*`;
      if (!internalLinks.has(key)) internalLinks.set(key, new Set());
      internalLinks.get(key).add(rel);
    }
    // arrays de dados: { to: "/x" } / { url: "/x" } / path: "/x"
    for (const m of code.matchAll(/(?:to|url|path|href)\s*:\s*["'](\/[^"'`\s]*)["']/g)) {
      const path = m[1].split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
      if (!internalLinks.has(path)) internalLinks.set(path, new Set());
      internalLinks.get(path).add(rel);
    }
  }
};
walk(join(ROOT, "src"));

const isLinked = (path) => {
  if (internalLinks.has(path)) return true;
  for (const key of internalLinks.keys()) {
    if (key.endsWith("/*") && path.startsWith(key.slice(0, -1))) return true;
  }
  return false;
};

// ── 4. Diagnóstico ───────────────────────────────────────────────────────────
const errors = [];
const warnings = [];

for (const { file, url } of sitemapUrls) {
  // Entradas de sitemap-index apontam para outros .xml, não para rotas.
  if (url.endsWith(".xml")) continue;
  if (!url.startsWith(CANONICAL)) {
    errors.push(`[${file}] domínio não canônico: ${url}`);
    continue;
  }
  const path = url.slice(CANONICAL.length) || "/";
  if (!isKnownRoute(path)) {
    errors.push(`[${file}] URL sem rota correspondente (404): ${path}`);
    continue;
  }
  if (!isLinked(path) && path !== "/") {
    warnings.push(`[${file}] página órfã (nenhum link interno aponta para ela): ${path}`);
  }
}

const IGNORED_PREFIXES = ["/admin", "/api", "/assets", "/#"];
// Arquivos estáticos servidos de public/ não são rotas do app.
const STATIC_FILES = new Set(["/ads.txt", "/robots.txt", "/llms.txt", "/llms-full.txt"]);
const isStaticAsset = (p) => STATIC_FILES.has(p) || /\.(xml|txt|json|pdf|webmanifest)$/i.test(p);
for (const [path, sources] of internalLinks) {
  if (path.endsWith("/*")) continue;
  if (IGNORED_PREFIXES.some((p) => path.startsWith(p))) continue;
  if (isStaticAsset(path)) {
    if (!existsSync(`public${path}`)) {
      errors.push(`arquivo estático ausente em public${path} (em ${[...sources].slice(0, 3).join(", ")})`);
    }
    continue;
  }
  if (!isKnownRoute(path)) {
    errors.push(
      `link interno quebrado → ${path} (em ${[...sources].slice(0, 3).join(", ")})`,
    );
  }
}

// ── 5. Saída ─────────────────────────────────────────────────────────────────
console.log("── Verificação de links internos e sitemap ──");
console.log(`Rotas estáticas declaradas: ${staticRoutes.size}`);
console.log(`Rotas dinâmicas declaradas: ${dynamicRoutes.length}`);
console.log(`URLs no sitemap: ${sitemapUrls.length}`);
console.log(`Destinos internos únicos: ${internalLinks.size}`);

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} aviso(s):`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}

if (errors.length) {
  console.log(`\n✖ ${errors.length} erro(s):`);
  errors.forEach((e) => console.log(`  - ${e}`));
  process.exit(1);
}

if (STRICT && warnings.length) {
  console.log("\n✖ modo --strict: avisos tratados como erro.");
  process.exit(1);
}

console.log("\n✔ Nenhum link quebrado nem URL de sitemap inválida.");
