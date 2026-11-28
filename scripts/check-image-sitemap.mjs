#!/usr/bin/env node
/**
 * GATE — Integridade do image sitemap (dist/sitemap-images.xml).
 *
 * Valida:
 *   • o arquivo existe e é XML de urlset com namespace image;
 *   • toda <image:loc> aponta para um asset que existe no dist;
 *   • nenhuma <image:loc> duplicada dentro da mesma <url>, nem <loc> repetido;
 *   • toda página listada é indexável (sem noindex) e existe no build;
 *   • <lastmod> presente, em formato ISO e consistente com o mtime do asset
 *     mais recente da página (nunca a data de geração do sitemap).
 *
 * Uso: node scripts/check-image-sitemap.mjs [dist]
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const BUILD_ROOT = path.resolve(process.argv[2] || "dist");
// TanStack Start entrega HTML e assets em client/. Um build legado plano
// continua aceito, mas nunca trate "client" como segmento público da URL.
const DIST = existsSync(path.join(BUILD_ROOT, "client")) ? path.join(BUILD_ROOT, "client") : BUILD_ROOT;
const SITE = "https://tecnico.curitiba.br";
const FILE = path.join(DIST, "sitemap-images.xml");

if (!existsSync(FILE)) {
  console.error(`BLOQUEADO: ${FILE} não existe — rode "node scripts/generate-image-sitemap.mjs" após o build.`);
  process.exit(1);
}

const xml = readFileSync(FILE, "utf8");
const errors = [];

if (!xml.includes("http://www.google.com/schemas/sitemap-image/1.1"))
  errors.push("namespace image ausente no <urlset>");

const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
const seenPages = new Set();
let images = 0;

for (const block of blocks) {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
  if (!loc) { errors.push("bloco <url> sem <loc>"); continue; }
  if (seenPages.has(loc)) errors.push(`<loc> duplicado: ${loc}`);
  seenPages.add(loc);

  if (!loc.startsWith(SITE)) errors.push(`${loc}: fora do domínio canônico`);
  const route = loc.slice(SITE.length) || "/";
  const pageFile = path.join(DIST, route, "index.html");
  if (!existsSync(pageFile)) {
    errors.push(`${loc}: página inexistente no build`);
  } else {
    const html = readFileSync(pageFile, "utf8");
    const robotsTag = html.match(/<meta\b[^>]*\bname="robots"[^>]*>/i)?.[0] ?? "";
    const robots = robotsTag.match(/\bcontent="([^"]*)"/i)?.[1] ?? "";
    if (/noindex/i.test(robots)) errors.push(`${loc}: página noindex não pode entrar no image sitemap`);
  }

  if (!lastmod) errors.push(`${loc}: <lastmod> ausente`);
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) errors.push(`${loc}: <lastmod>=${lastmod} fora do formato ISO`);

  const imgs = [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]);
  if (!imgs.length) errors.push(`${loc}: <url> sem imagens`);
  const seenImgs = new Set();
  let newest = 0;
  for (const raw of imgs) {
    images++;
    const url = raw.replace(/&amp;/g, "&");
    if (seenImgs.has(url)) errors.push(`${loc}: imagem duplicada ${url}`);
    seenImgs.add(url);
    if (!url.startsWith(SITE)) { errors.push(`${loc}: imagem fora do domínio — ${url}`); continue; }
    const assetPath = path.join(DIST, url.slice(SITE.length).split("?")[0]);
    if (!existsSync(assetPath)) { errors.push(`${loc}: asset inexistente — ${url}`); continue; }
    newest = Math.max(newest, statSync(assetPath).mtime.getTime());
  }
  if (lastmod && newest) {
    const expected = new Date(newest).toISOString().slice(0, 10);
    if (expected !== lastmod)
      errors.push(`${loc}: <lastmod>=${lastmod} inconsistente com o asset mais recente (${expected})`);
  }
}

if (!blocks.length) errors.push("nenhuma <url> no image sitemap");

if (errors.length) {
  console.error(`BLOQUEADO — ${errors.length} problema(s) no image sitemap:`);
  errors.slice(0, 40).forEach((e) => console.error(`  • ${e}`));
  if (errors.length > 40) console.error(`  … +${errors.length - 40}`);
  process.exit(1);
}

console.log(`OK — image sitemap com ${blocks.length} página(s) e ${images} imagem(ns), todas existentes no build.`);
