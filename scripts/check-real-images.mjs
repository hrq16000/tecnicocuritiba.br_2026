#!/usr/bin/env node
/**
 * GATE — PROVA VISUAL REAL POR PÁGINA (fail-closed antes de liberar índice).
 *
 * Para cada URL curada das famílias sensíveis (bairros, hubs Wi-Fi/TV por
 * bairro e páginas de sintoma em /problemas) valida, no HTML do dist:
 *
 *   1. PRESENÇA   — ao menos MIN_FOTOS imagens locais (servidas de public/);
 *   2. TAMANHO    — cada arquivo com no mínimo MIN_BYTES (evita ícone/1px);
 *   3. SEM PLACEHOLDER — nada de placeholder.svg, og-image, logo ou favicon
 *                        contando como prova visual;
 *   4. EXCLUSIVIDADE — a mesma foto (hash sha1 do arquivo) não pode ser
 *                      reutilizada em mais de MAX_REUSO páginas gated.
 *
 * Saída: reports/real-images.json
 *
 * Uso:
 *   node scripts/check-real-images.mjs dist            # gate (falha o build)
 *   node scripts/check-real-images.mjs dist --report    # relatório (exit 0)
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";

const args = process.argv.slice(2);
const REPORT_ONLY = args.includes("--report");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");
const PUBLIC = path.resolve("public");

export const MIN_FOTOS = 2;
export const MIN_BYTES = 15 * 1024;
export const MAX_REUSO = 3;

/** Famílias que exigem prova visual real para indexar. */
const GATED = [
  { id: "bairro", test: /^\/bairros?\// },
  { id: "wifi-tv-bairro", test: /^\/servicos\/(redes-wifi|manutencao-tv)\// },
  { id: "problemas", test: /^\/problemas\/[^/]+$/ },
];

/** Nunca contam como prova visual (branding, ícones, placeholders). */
const NAO_E_PROVA =
  /(placeholder|og-image|logo|favicon|apple-touch|icon-|sprite|avatar-default|1x1|pixel)/i;

const familyOf = (p) => GATED.find((f) => f.test.test(p))?.id ?? null;

function readHtml(routePath) {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  if (existsSync(file)) return readFileSync(file, "utf8");
  const flat = path.join(DIST, `${routePath.replace(/^\//, "")}.html`);
  return existsSync(flat) ? readFileSync(flat, "utf8") : null;
}

/** Coleta srcs locais de <img>, srcset e og:image do HTML estático. */
function localImages(html) {
  const found = new Set();
  const push = (raw) => {
    if (!raw) return;
    const url = raw.trim().split(/\s+/)[0].replace(/^https:\/\/[^/]+/, "");
    if (url.startsWith("/") && /\.(jpe?g|png|webp|avif)$/i.test(url)) found.add(url.split("?")[0]);
  };
  for (const m of html.matchAll(/<img[^>]+>/gi)) {
    const tag = m[0];
    push(tag.match(/\ssrc="([^"]+)"/i)?.[1]);
    const srcset = tag.match(/\ssrcset="([^"]+)"/i)?.[1];
    if (srcset) for (const cand of srcset.split(",")) push(cand);
  }
  for (const m of html.matchAll(/<source[^>]+srcset="([^"]+)"/gi)) {
    for (const cand of m[1].split(",")) push(cand);
  }
  return [...found];
}

const fileInfo = new Map();
function inspect(url) {
  if (fileInfo.has(url)) return fileInfo.get(url);
  const file = path.join(PUBLIC, url.replace(/^\//, ""));
  let info;
  if (!existsSync(file)) {
    info = { url, exists: false, bytes: 0, hash: null };
  } else {
    const bytes = statSync(file).size;
    const hash = createHash("sha1").update(readFileSync(file)).digest("hex");
    info = { url, exists: true, bytes, hash };
  }
  fileInfo.set(url, info);
  return info;
}

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();

if (!existsSync(DIST)) {
  const msg = `dist ausente em ${DIST} — rode "npm run build" antes do gate de prova visual.`;
  console[REPORT_ONLY ? "warn" : "error"](`${REPORT_ONLY ? "AVISO" : "BLOQUEADO"}: ${msg}`);
  process.exit(REPORT_ONLY ? 0 : 1);
}

const pages = [];
const errors = [];
const usoPorHash = new Map();

for (const routePath of curated) {
  const family = familyOf(routePath);
  if (!family) continue;
  const html = readHtml(routePath);
  if (!html) {
    errors.push(`${routePath}: sem HTML estático no dist (rode o prerender antes do gate)`);
    pages.push({ path: routePath, family, provas: [], problems: ["sem HTML estático"] });
    continue;
  }

  const problems = [];
  const provas = [];
  for (const url of localImages(html)) {
    if (NAO_E_PROVA.test(url)) continue;
    const info = inspect(url);
    if (!info.exists) {
      problems.push(`imagem inexistente em public/: ${url}`);
      continue;
    }
    if (info.bytes < MIN_BYTES) {
      problems.push(`imagem pequena demais (${Math.round(info.bytes / 1024)} KB < ${MIN_BYTES / 1024} KB): ${url}`);
      continue;
    }
    provas.push(info);
    const uso = usoPorHash.get(info.hash) ?? [];
    if (!uso.includes(routePath)) uso.push(routePath);
    usoPorHash.set(info.hash, uso);
  }

  if (provas.length < MIN_FOTOS) {
    problems.push(`${provas.length} foto(s) real(is) válida(s) — mínimo ${MIN_FOTOS}`);
  }

  pages.push({
    path: routePath,
    family,
    provas: provas.map((p) => ({ url: p.url, kb: Math.round(p.bytes / 1024), hash: p.hash.slice(0, 12) })),
    problems,
  });
  for (const p of problems) errors.push(`${routePath}: ${p}`);
}

// Exclusividade: mesma foto reaproveitada em páginas demais.
for (const [hash, rotas] of usoPorHash) {
  if (rotas.length > MAX_REUSO) {
    const url = [...fileInfo.values()].find((f) => f.hash === hash)?.url ?? hash;
    errors.push(`foto reutilizada em ${rotas.length} páginas (máximo ${MAX_REUSO}): ${url} → ${rotas.slice(0, 5).join(", ")}…`);
  }
}

const aprovadas = pages.filter((p) => p.problems.length === 0);
mkdirSync("reports", { recursive: true });
writeFileSync(
  "reports/real-images.json",
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      rules: { MIN_FOTOS, MIN_BYTES, MAX_REUSO },
      totals: { avaliadas: pages.length, aprovadas: aprovadas.length, bloqueadas: pages.length - aprovadas.length },
      approved: aprovadas.map((p) => p.path),
      pages,
      errors,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `prova visual real: ${aprovadas.length}/${pages.length} páginas aprovadas (bairros, Wi-Fi/TV e /problemas)`,
);

if (errors.length) {
  console[REPORT_ONLY ? "warn" : "error"](
    `\n${REPORT_ONLY ? "AVISO" : "BLOQUEADO"}: ${errors.length} pendência(s) de prova visual:`,
  );
  for (const e of errors.slice(0, 40)) console.error(`  ✗ ${e}`);
  if (errors.length > 40) console.error(`  … +${errors.length - 40} (ver reports/real-images.json)`);
  process.exit(REPORT_ONLY ? 0 : 1);
}
console.log("OK: toda página gated tem prova visual real, exclusiva e com peso mínimo.");
