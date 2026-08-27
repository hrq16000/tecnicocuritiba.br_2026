#!/usr/bin/env node
/**
 * GATE — Unicidade e qualidade de <title> / <meta description>.
 *
 * Roda sobre o dist/ nas famílias programáticas (serviço × cidade/bairro e
 * blog) e falha o build quando encontra:
 *   • títulos ou descrições duplicados entre rotas;
 *   • tamanho fora da janela (title 25–70, description 70–165);
 *   • padrões genéricos ("Lovable App", "página", "clique aqui", etc.);
 *   • title/description ausentes ou iguais entre si.
 *
 * Uso: node scripts/check-meta-uniqueness.mjs [dist]
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { TITLE_MIN, TITLE_MAX, DESC_MIN, DESC_MAX } from "./lib/seo-meta.mjs";

const DIST = path.resolve(process.argv[2] || "dist");
if (!existsSync(DIST)) {
  console.error(`BLOQUEADO: ${DIST} não existe — rode "npm run build" antes.`);
  process.exit(1);
}

const FAMILIES = [
  /^\/conserto-(tv|som|videogame|celular)\/[a-z0-9-]+$/,
  /^\/blog\/[a-z0-9-]+$/,
];

const GENERIC = [
  "lovable app",
  "lovable generated project",
  "sem titulo",
  "clique aqui",
  "saiba mais sobre nossa pagina",
  "melhor empresa do brasil",
];

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const full = path.join(dir, e);
    if (statSync(full).isDirectory()) walk(full);
    else if (e === "index.html") files.push(full);
  }
})(DIST);

const decode = (s) =>
  String(s ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const fold = (s) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const errors = [];
const titles = new Map();
const descs = new Map();
// Varredura global (todas as rotas do dist): duplicidade de title/description
// é penalizada em todo o site, não só nas famílias programáticas.
const globalTitles = new Map();
const globalDescs = new Map();
const globalDupes = [];
// Rotas fora do índice não competem no SERP e não entram na varredura global.
const GLOBAL_SKIP = /^\/(admin|lovable|ordem-de-servico|status|funil-indisponivel)(\/|$)/;
let checked = 0;
let globalChecked = 0;

for (const file of files.sort()) {
  const route = ("/" + path.relative(DIST, file).replace(/index\.html$/, "").replace(/\\/g, "/")).replace(/\/$/, "") || "/";
  const html = readFileSync(file, "utf8");
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/i)?.[1]);

  const indexavel = !/<meta name="robots" content="[^"]*noindex/i.test(html);
  if (indexavel && !GLOBAL_SKIP.test(route)) {
    globalChecked++;
    if (title) {
      const gk = fold(title);
      if (globalTitles.has(gk)) globalDupes.push(`title duplicado: ${route} == ${globalTitles.get(gk)} — "${title}"`);
      else globalTitles.set(gk, route);
    }
    if (desc) {
      const gd = fold(desc);
      if (globalDescs.has(gd)) globalDupes.push(`description duplicada: ${route} == ${globalDescs.get(gd)}`);
      else globalDescs.set(gd, route);
    }
  }

  if (!FAMILIES.some((re) => re.test(route))) continue;
  checked++;

  if (!title) { errors.push(`${route}: <title> ausente`); continue; }
  if (!desc) { errors.push(`${route}: meta description ausente`); continue; }
  if (fold(title) === fold(desc)) errors.push(`${route}: title idêntico à description`);

  if (title.length < TITLE_MIN || title.length > TITLE_MAX)
    errors.push(`${route}: title com ${title.length} chars (limite ${TITLE_MIN}-${TITLE_MAX}) — "${title}"`);
  if (desc.length < DESC_MIN || desc.length > DESC_MAX)
    errors.push(`${route}: description com ${desc.length} chars (limite ${DESC_MIN}-${DESC_MAX})`);

  for (const g of GENERIC) {
    if (fold(title).includes(g)) errors.push(`${route}: title com padrão genérico "${g}"`);
    if (fold(desc).includes(g)) errors.push(`${route}: description com padrão genérico "${g}"`);
  }

  const tk = fold(title);
  const dk = fold(desc);
  if (titles.has(tk)) errors.push(`${route}: title duplicado (também em ${titles.get(tk)})`);
  else titles.set(tk, route);
  if (descs.has(dk)) errors.push(`${route}: description duplicada (também em ${descs.get(dk)})`);
  else descs.set(dk, route);
}

errors.push(...globalDupes);

if (errors.length) {
  console.error(`BLOQUEADO — ${errors.length} problema(s) de title/description:`);
  errors.slice(0, 40).forEach((e) => console.error(`  • ${e}`));
  if (errors.length > 40) console.error(`  … +${errors.length - 40}`);
  process.exit(1);
}

console.log(`OK — ${globalChecked} rotas indexáveis sem title/description duplicados no site.`);
console.log(`OK — ${checked} rotas programáticas com title/description únicos e dentro dos limites.`);
