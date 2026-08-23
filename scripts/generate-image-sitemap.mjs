#!/usr/bin/env node
/**
 * Gera dist/sitemap-images.xml a partir das imagens realmente referenciadas
 * pelas páginas indexáveis do build, incluindo variantes WebP/AVIF quando
 * existirem no dist. Sem URLs duplicadas e com lastmod derivado do mtime real
 * do arquivo servido (nunca a data do build).
 *
 * Uso: node scripts/generate-image-sitemap.mjs [dist]
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.argv[2] || "dist");
const SITE = "https://tecnico.curitiba.br";
const VARIANTS = [".avif", ".webp"];

if (!existsSync(DIST)) {
  console.error(`BLOQUEADO: ${DIST} não existe — rode "npm run build" antes.`);
  process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const full = path.join(dir, e);
    if (statSync(full).isDirectory()) walk(full);
    else if (e === "index.html") htmlFiles.push(full);
  }
})(DIST);

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const isIndexable = (html) => {
  const robots = html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? "";
  return !/noindex/i.test(robots);
};

/** caminho absoluto no dist para uma URL /caminho/arquivo.ext (ou undefined) */
const distPathOf = (url) => {
  if (!url.startsWith("/")) return undefined;
  const clean = url.split("?")[0].split("#")[0];
  const full = path.join(DIST, clean);
  return existsSync(full) && statSync(full).isFile() ? full : undefined;
};

const entries = new Map(); // pageUrl -> { lastmod, images:Map(url->{caption}) }

for (const file of htmlFiles.sort()) {
  const html = readFileSync(file, "utf8");
  if (!isIndexable(html)) continue;
  const route = ("/" + path.relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/")).replace(/\/$/, "") || "/";
  const pageUrl = `${SITE}${route === "/" ? "/" : route}`;

  const found = new Map();
  const push = (url, caption) => {
    const abs = distPathOf(url);
    if (!abs) return;
    if (!found.has(url)) found.set(url, { caption: caption || "", mtime: statSync(abs).mtime });
    // variantes modernas do mesmo asset
    const ext = path.extname(url);
    for (const v of VARIANTS) {
      const alt = url.slice(0, -ext.length) + v;
      const altAbs = distPathOf(alt);
      if (altAbs && !found.has(alt)) found.set(alt, { caption: caption || "", mtime: statSync(altAbs).mtime });
    }
  };

  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
    const alt = tag.match(/\salt="([^"]*)"/i)?.[1];
    if (src) push(src, alt);
    const srcset = tag.match(/\ssrcset="([^"]+)"/i)?.[1];
    if (srcset) srcset.split(",").forEach((p) => push(p.trim().split(/\s+/)[0], alt));
  }
  for (const m of html.matchAll(/<source\b[^>]*srcset="([^"]+)"/gi)) {
    m[1].split(",").forEach((p) => push(p.trim().split(/\s+/)[0], ""));
  }
  const og = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];
  if (og) push(og.replace(SITE, "").split("?")[0], "");

  if (!found.size) continue;
  const lastmod = new Date(Math.max(...[...found.values()].map((v) => v.mtime.getTime())))
    .toISOString()
    .slice(0, 10);
  entries.set(pageUrl, { lastmod, images: found });
}

const body = [...entries.entries()]
  .map(([pageUrl, { lastmod, images }]) => {
    const imgs = [...images.entries()]
      .map(([url, { caption }]) =>
        `    <image:image><image:loc>${esc(SITE + url)}</image:loc>` +
        (caption ? `<image:caption>${esc(caption)}</image:caption>` : "") +
        `</image:image>`,
      )
      .join("\n");
    return `  <url>\n    <loc>${esc(pageUrl)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${imgs}\n  </url>`;
  })
  .join("\n");

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  `${body}\n</urlset>\n`;

writeFileSync(path.join(DIST, "sitemap-images.xml"), xml);
// O diretório realmente servido é `dist/client` (TanStack Start). Sem esta
// cópia, o Sitemap declarado no robots.txt respondia 404 para os crawlers.
if (existsSync(path.join(DIST, "client"))) {
  writeFileSync(path.join(DIST, "client", "sitemap-images.xml"), xml);
}


const total = [...entries.values()].reduce((n, e) => n + e.images.size, 0);
console.log(`OK — sitemap-images.xml gerado com ${entries.size} página(s) e ${total} imagem(ns).`);
