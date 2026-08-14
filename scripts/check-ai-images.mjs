#!/usr/bin/env node
/**
 * GATE — INDÍCIOS DE IMAGEM GERADA POR IA (fail-closed antes de indexar).
 *
 * Toda página das famílias que dependem de prova visual real precisa ter
 * fotos REAIS. Este gate procura indícios de geração por IA nos arquivos de
 * `public/` referenciados como prova visual no HTML do dist:
 *
 *   1. MARCADOR   — assinatura de gerador nos bytes do arquivo (XMP/C2PA/EXIF):
 *                   midjourney, dall-e, stable diffusion, firefly, flux,
 *                   imagen/gemini, sora, "AI generated", c2pa/contentcredentials.
 *   2. DIMENSÃO   — resolução idêntica a presets clássicos de gerador
 *                   (1024x1024, 1024x1536, 1536x1024, 1408x768, 1920x1920…)
 *                   sem registro de origem real.
 *   3. NOME       — arquivo com nome típico de geração (ai-, generated-,
 *                   midjourney, dalle, sd-, render-...).
 *
 * Provas de origem real ficam em `scripts/real-photos-allowlist.json`
 * (lista de caminhos públicos fotografados na operação). Um arquivo
 * suspeito só é aceito quando está nessa lista.
 *
 * Saída: reports/ai-images.json
 *
 * Uso:
 *   node scripts/check-ai-images.mjs dist            # gate (falha o build)
 *   node scripts/check-ai-images.mjs dist --report   # relatório (exit 0)
 */
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";

const args = process.argv.slice(2);
const REPORT_ONLY = args.includes("--report");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");
const PUBLIC = path.resolve("public");

const GATED = [/^\/bairros?\//, /^\/servicos\/(redes-wifi|manutencao-tv)\//, /^\/problemas\/[^/]+$/];
const NAO_E_PROVA = /(placeholder|og-image|logo|favicon|apple-touch|icon-|sprite|1x1|pixel)/i;

const GENERATOR_MARKERS = [
  "midjourney",
  "dall-e",
  "dalle",
  "stable diffusion",
  "stablediffusion",
  "adobe firefly",
  "firefly",
  "black-forest-labs",
  "flux.1",
  "imagen",
  "gemini image",
  "openai",
  "ai generated",
  "aigenerated",
  "generativeai",
  "c2pa",
  "contentcredentials",
];

const AI_PRESET_SIZES = new Set([
  "1024x1024",
  "1024x1536",
  "1536x1024",
  "1408x768",
  "768x1408",
  "1920x1920",
  "1024x768x0", // nunca casa; placeholder para clareza
]);

const AI_NAME = /(^|[/_-])(ai|ia|gen|generated|render|midjourney|dalle|sd|sdxl|flux)[-_.]/i;

const ALLOWLIST_FILE = "scripts/real-photos-allowlist.json";
const allowlist = new Set(
  existsSync(ALLOWLIST_FILE) ? (JSON.parse(readFileSync(ALLOWLIST_FILE, "utf8")).real ?? []) : [],
);

/** Dimensões via cabeçalho (PNG/JPEG/WebP) sem dependências externas. */
function dimensions(buf) {
  try {
    if (buf.slice(0, 8).toString("hex") === "89504e470d0a1a0a") {
      return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    }
    if (buf.slice(0, 2).toString("hex") === "ffd8") {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i += 1; continue; }
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
    }
    if (buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP") {
      const fmt = buf.slice(12, 16).toString("ascii");
      if (fmt === "VP8X") return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
      if (fmt === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
      if (fmt === "VP8L") {
        const b = buf.readUInt32LE(21);
        return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
      }
    }
  } catch { /* header inesperado */ }
  return { w: null, h: null };
}

function readHtml(routePath) {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  if (existsSync(file)) return readFileSync(file, "utf8");
  const flat = path.join(DIST, `${routePath.replace(/^\//, "")}.html`);
  return existsSync(flat) ? readFileSync(flat, "utf8") : null;
}

function localImages(html) {
  const out = new Set();
  for (const m of html.matchAll(/(?:src|srcset|content)=["']([^"']+)["']/g)) {
    for (const raw of m[1].split(",")) {
      const src = raw.trim().split(/\s+/)[0];
      if (!src || !/^\/[^/]/.test(src)) continue;
      if (!/\.(png|jpe?g|webp|avif)$/i.test(src)) continue;
      if (NAO_E_PROVA.test(src)) continue;
      out.add(src.split("?")[0]);
    }
  }
  return [...out];
}

/** Avalia um arquivo público e devolve os indícios encontrados. */
function inspect(src) {
  const file = path.join(PUBLIC, src.replace(/^\//, ""));
  if (!existsSync(file)) return { src, existe: false, indicios: ["arquivo ausente em public/"] };
  const buf = readFileSync(file);
  const head = buf.slice(0, 200 * 1024).toString("latin1").toLowerCase();
  const { w, h } = dimensions(buf);
  const indicios = [];
  for (const marker of GENERATOR_MARKERS) {
    if (head.includes(marker)) indicios.push(`marcador de gerador: ${marker}`);
  }
  if (w && h && AI_PRESET_SIZES.has(`${w}x${h}`)) indicios.push(`resolução de preset de IA (${w}x${h})`);
  if (AI_NAME.test(src)) indicios.push("nome de arquivo típico de geração");
  const liberado = allowlist.has(src);
  return { src, existe: true, width: w, height: h, indicios, liberado, suspeita: indicios.length > 0 && !liberado };
}

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();
const cache = new Map();
const pages = [];

for (const p of curated) {
  if (!GATED.some((re) => re.test(p))) continue;
  const html = readHtml(p);
  if (!html) continue;
  const imgs = localImages(html);
  const detalhes = imgs.map((src) => {
    if (!cache.has(src)) cache.set(src, inspect(src));
    return cache.get(src);
  });
  const suspeitas = detalhes.filter((d) => d.suspeita);
  const reais = detalhes.filter((d) => d.existe && !d.suspeita);
  const problems = [];
  for (const s of suspeitas) problems.push(`${s.src}: ${s.indicios.join("; ")}`);
  if (detalhes.length > 0 && reais.length === 0) problems.push("nenhuma foto real comprovada na página");
  pages.push({ path: p, imagens: detalhes.length, reais: reais.length, suspeitas: suspeitas.length, problems });
}

const bloqueadas = pages.filter((p) => p.problems.length > 0);
mkdirSync("reports", { recursive: true });
writeFileSync(
  "reports/ai-images.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), pages, blocked: bloqueadas.map((p) => p.path) }, null, 2)}\n`,
);

console.log("── check:ai-images ──");
console.log(`  páginas avaliadas : ${pages.length}`);
console.log(`  arquivos únicos   : ${cache.size}`);
console.log(`  páginas bloqueadas: ${bloqueadas.length}`);

if (bloqueadas.length && !REPORT_ONLY) {
  console.error("\n✗ Indícios de imagem gerada por IA (ou ausência de foto real):");
  for (const p of bloqueadas) console.error(`  ✗ ${p.path}\n      ${p.problems.join("\n      ")}`);
  console.error(`\nRegistre fotos reais em ${ALLOWLIST_FILE} apenas quando forem da operação.`);
  process.exit(1);
}
if (!bloqueadas.length) console.log("\n✓ nenhuma prova visual com indício de IA");
