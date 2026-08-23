#!/usr/bin/env node
/**
 * GATE — Sitemap × HTTP × canonical.
 *
 * Para cada <loc> dos sitemaps publicados valida:
 *   • existe HTML estático no build (equivale a 200 servido pelo edge);
 *   • <link rel="canonical"> presente, ABSOLUTO e self-referente;
 *   • ausência de robots noindex;
 *   • <title> e <meta description> presentes;
 *   • ausência de <loc> duplicado entre sitemaps;
 *   • ausência de title/description duplicados entre URLs distintas.
 *
 * Modo opcional --live <base>: além do build, faz HEAD/GET real em cada URL
 * e exige 200 (usado no workflow pós-deploy, nunca no build offline).
 *
 * Uso:
 *   node scripts/audit-sitemap-http.mjs [dist]
 *   node scripts/audit-sitemap-http.mjs dist --live https://tecnico.curitiba.br
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const DIST = resolve(process.argv[2]?.startsWith("--") ? "dist" : (process.argv[2] ?? "dist"));
const CLIENT = existsSync(join(DIST, "client")) ? join(DIST, "client") : DIST;
const liveIdx = process.argv.indexOf("--live");
const LIVE = liveIdx > -1 ? process.argv[liveIdx + 1]?.replace(/\/$/, "") : null;

if (!existsSync(CLIENT)) {
  console.error(`[sitemap-http] BLOQUEADO: ${CLIENT} não existe — rode "npm run build".`);
  process.exit(1);
}

const sitemaps = readdirSync(CLIENT).filter((f) => /^sitemap.*\.xml$/.test(f));
const locsBySitemap = new Map();
for (const file of sitemaps) {
  const xml = readFileSync(join(CLIENT, file), "utf8");
  if (/<sitemapindex/i.test(xml)) continue; // índice: só aponta para os demais
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]);
  if (locs.length) locsBySitemap.set(file, locs);
}

const errors = [];
const seenLoc = new Map();
const titles = new Map();
const descriptions = new Map();
let checked = 0;

const htmlPathFor = (pathname) =>
  pathname === "/" ? join(CLIENT, "index.html") : join(CLIENT, pathname.replace(/^\/|\/$/g, ""), "index.html");

for (const [file, locs] of locsBySitemap) {
  for (const loc of locs) {
    if (!/^https:\/\//.test(loc)) {
      errors.push(`${file}: <loc> não absoluto/https → ${loc}`);
      continue;
    }
    const prev = seenLoc.get(loc);
    if (prev) errors.push(`URL duplicada entre sitemaps (${prev} e ${file}) → ${loc}`);
    else seenLoc.set(loc, file);

    const pathname = new URL(loc).pathname;
    // Sitemaps de imagens/news podem apontar para assets — só auditamos rotas.
    const htmlFile = htmlPathFor(pathname);
    if (!existsSync(htmlFile)) {
      errors.push(`${loc}: sem HTML estático (${htmlFile.replace(CLIENT, "")}) — risco de 404/soft-404`);
      continue;
    }
    checked++;
    const html = readFileSync(htmlFile, "utf8");

    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] ?? "";
    const href = canonical.match(/href=["']([^"']+)["']/i)?.[1];
    if (!href) errors.push(`${loc}: sem <link rel="canonical">`);
    else if (!/^https:\/\//.test(href)) errors.push(`${loc}: canonical relativo → ${href}`);
    else if (href.replace(/\/$/, "") !== loc.replace(/\/$/, ""))
      errors.push(`${loc}: canonical aponta para ${href} (não é self-referente)`);

    const robots = [...html.matchAll(/<meta[^>]+name=["']robots["'][^>]*>/gi)].map((m) => m[0]).join(" ");
    if (/noindex/i.test(robots)) errors.push(`${loc}: está no sitemap mas tem robots noindex`);

    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
    if (title.length < 15) errors.push(`${loc}: <title> ausente ou curto ("${title}")`);
    else {
      const dupe = titles.get(title);
      if (dupe) errors.push(`title duplicado entre ${dupe} e ${loc} → "${title}"`);
      else titles.set(title, loc);
    }

    const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() ?? "";
    if (desc.length < 50) errors.push(`${loc}: meta description ausente ou curta (${desc.length} chars)`);
    else {
      const dupe = descriptions.get(desc);
      if (dupe) errors.push(`description duplicada entre ${dupe} e ${loc}`);
      else descriptions.set(desc, loc);
    }
  }
}

if (LIVE) {
  for (const loc of seenLoc.keys()) {
    const url = LIVE + new URL(loc).pathname;
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status !== 200) errors.push(`live ${url}: HTTP ${res.status}`);
    } catch (e) {
      errors.push(`live ${url}: falha de rede (${e.message})`);
    }
  }
}

if (errors.length) {
  console.error(`[sitemap-http] BLOQUEADO — ${errors.length} problema(s):`);
  errors.slice(0, 60).forEach((e) => console.error(`  • ${e}`));
  if (errors.length > 60) console.error(`  … +${errors.length - 60}`);
  process.exit(1);
}

console.log(
  `[sitemap-http] ok — ${checked} URL(s) de ${locsBySitemap.size} sitemap(s) com HTML, canonical absoluto self-referente, indexáveis e metadados únicos${LIVE ? " (+ HTTP 200 ao vivo)" : ""}.`,
);
