#!/usr/bin/env node
/**
 * GATE — DIFERENCIAÇÃO POR ROTA (título, meta, H1 e corpo).
 *
 * Complementa `check-originality.mjs`: além do corpo, compara ENTRE TODAS as
 * rotas curadas do domínio:
 *   • title            — não pode repetir (normalizado, sem sufixo de marca);
 *   • meta description — não pode repetir;
 *   • H1               — não pode repetir;
 *   • trechos do corpo — Jaccard de shingles de 5 palavras acima do teto.
 *
 * Rota com baixa diferenciação é marcada como BLOQUEADA para indexação.
 *
 * Saída: reports/route-differentiation.json
 *
 * Uso:
 *   node scripts/check-route-differentiation.mjs dist            # gate
 *   node scripts/check-route-differentiation.mjs dist --report   # relatório
 */
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";

const args = process.argv.slice(2);
const REPORT_ONLY = args.includes("--report");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) || "dist");

const MAX_JACCARD = 0.55;
const SHINGLE = 5;

const norm = (s) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const semMarca = (t) => norm(t).replace(/\s*(tecnico em curitiba|tecnico curitiba)\s*$/, "").trim();

function readHtml(routePath) {
  const rel = routePath === "/" ? "index.html" : `${routePath.replace(/^\//, "")}/index.html`;
  const file = path.join(DIST, rel);
  if (existsSync(file)) return readFileSync(file, "utf8");
  const flat = path.join(DIST, `${routePath.replace(/^\//, "")}.html`);
  return existsSync(flat) ? readFileSync(flat, "utf8") : null;
}

const pick = (html, re) => html.match(re)?.[1]?.trim() ?? "";

function bodyText(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  return norm(
    main
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

function shingles(text) {
  const w = text.split(" ").filter(Boolean);
  const s = new Set();
  for (let i = 0; i + SHINGLE <= w.length; i += 1) s.add(w.slice(i, i + SHINGLE).join(" "));
  return s;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  return inter / (a.size + b.size - inter);
}

const curated = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();
const rotas = [];

for (const p of curated) {
  const html = readHtml(p);
  if (!html) continue;
  const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const desc = pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " ");
  const corpo = bodyText(html);
  rotas.push({
    path: p,
    title,
    description: desc,
    h1: h1.replace(/\s+/g, " ").trim(),
    words: corpo.split(" ").filter(Boolean).length,
    _t: semMarca(title),
    _d: norm(desc),
    _h: norm(h1),
    _sh: shingles(corpo),
  });
}

const grupos = (key) => {
  const map = new Map();
  for (const r of rotas) {
    const v = r[key];
    if (!v) continue;
    map.set(v, [...(map.get(v) ?? []), r.path]);
  }
  return [...map.values()].filter((paths) => paths.length > 1);
};

const problemas = new Map();
const add = (p, msg) => problemas.set(p, [...(problemas.get(p) ?? []), msg]);

for (const [key, label] of [["_t", "title"], ["_d", "meta description"], ["_h", "H1"]]) {
  for (const paths of grupos(key)) {
    for (const p of paths) add(p, `${label} idêntico a: ${paths.filter((x) => x !== p).join(", ")}`);
  }
}

const pares = [];
for (let i = 0; i < rotas.length; i += 1) {
  for (let j = i + 1; j < rotas.length; j += 1) {
    const score = jaccard(rotas[i]._sh, rotas[j]._sh);
    if (score < MAX_JACCARD) continue;
    pares.push({ a: rotas[i].path, b: rotas[j].path, jaccard: Number(score.toFixed(3)) });
    add(rotas[i].path, `corpo ${Math.round(score * 100)}% similar a ${rotas[j].path}`);
    add(rotas[j].path, `corpo ${Math.round(score * 100)}% similar a ${rotas[i].path}`);
  }
}

const payload = {
  generatedAt: new Date().toISOString(),
  regras: { maxJaccard: MAX_JACCARD, shingle: SHINGLE },
  rotas: rotas.map((r) => ({
    path: r.path,
    title: r.title,
    description: r.description,
    h1: r.h1,
    words: r.words,
    problems: problemas.get(r.path) ?? [],
  })),
  pares,
  blocked: [...problemas.keys()].sort(),
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/route-differentiation.json", `${JSON.stringify(payload, null, 2)}\n`);

console.log("── check:route-differentiation ──");
console.log(`  rotas avaliadas : ${rotas.length}`);
console.log(`  pares similares : ${pares.length}`);
console.log(`  rotas bloqueadas: ${payload.blocked.length}`);

if (payload.blocked.length && !REPORT_ONLY) {
  console.error("\n✗ Baixa diferenciação (não indexar):");
  for (const p of payload.blocked) console.error(`  ✗ ${p}\n      ${problemas.get(p).join("\n      ")}`);
  process.exit(1);
}
if (!payload.blocked.length) console.log("\n✓ todas as rotas curadas têm diferenciação suficiente");
