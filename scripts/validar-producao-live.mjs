#!/usr/bin/env node
/**
 * ETAPAS 1, 2, 10, 11 e 13 — VALIDAÇÃO DA PRODUÇÃO REAL
 *
 * Busca as URLs curadas em produção e mede o estado público observável:
 * HTTP, canonical, robots, title/H1/main/JSON-LD, malha interna, sitemap e
 * lastmod. Não corrige nada e não altera conteúdo: apenas observa e falha
 * quando encontra regressão objetiva.
 *
 *   node scripts/validar-producao-live.mjs            # observa e grava relatório
 *   node scripts/validar-producao-live.mjs --gate     # falha o processo em regressão
 *   node scripts/validar-producao-live.mjs --base=http://localhost:8080
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";
import { CONSOLIDATED_LOCAL_URLS } from "./lib/consolidated-local-urls.mjs";
import { clusterOf, tierOf } from "./lib/indexation-tiers.mjs";

const GATE = process.argv.includes("--gate");
const BASE = (process.argv.find((a) => a.startsWith("--base="))?.slice(7) ?? "https://tecnico.curitiba.br").replace(/\/+$/, "");
const OUT = path.resolve("reports/live-validation.json");
const CONCORRENCIA = 8;

const sha = (v) => createHash("sha256").update(v ?? "").digest("hex").slice(0, 32);
const texto = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const CONSOLIDADAS = new Set(CONSOLIDATED_LOCAL_URLS.map((r) => r.from));
const CURADAS = new Set(CURATED_PATHS);

/** lastmod declarado nos sitemaps versionados em public/. */
function lerSitemaps() {
  const dir = path.resolve("public");
  const membros = new Map();
  for (const f of readdirSync(dir).filter((f) => /^sitemap.*\.xml$/.test(f))) {
    const xml = readFileSync(path.join(dir, f), "utf8");
    for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
      if (!loc) continue;
      const lastmod = m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null;
      const p = new URL(loc).pathname.replace(/\/+$/, "") || "/";
      membros.set(p, { lastmod, sitemap: f });
    }
  }
  return membros;
}

function extrair(html) {
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? null;
  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)?.[1] ?? null;
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? null;
  const h1 = texto(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "") || null;
  const main = texto(html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "") || texto(html);
  const jsonld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1].trim());
  const tipos = [];
  for (const bloco of jsonld) {
    try {
      const dados = JSON.parse(bloco);
      const nos = Array.isArray(dados) ? dados : dados["@graph"] ?? [dados];
      for (const n of nos) if (n && n["@type"]) tipos.push(String(n["@type"]));
    } catch { tipos.push("INVALID_JSON_LD"); }
  }
  const links = [...new Set(
    [...html.matchAll(/<a[^>]+href="(\/[^"#?]*)"/gi)]
      .map((m) => (m[1].replace(/\/+$/, "") || "/"))
      .filter((p) => !p.startsWith("/api")),
  )].sort();
  return { canonical, robots, title, h1, main, tipos: tipos.sort(), links, jsonldBlocos: jsonld.length };
}

async function coletar(p) {
  const url = `${BASE}${p === "/" ? "/" : p}`;
  try {
    const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "tecnico-curitiba-live-audit" } });
    const status = res.status;
    if (status >= 300 && status < 400) {
      return { path: p, status, location: res.headers.get("location"), erro: "REDIRECT" };
    }
    const html = await res.text();
    const e = extrair(html);
    return {
      path: p,
      status,
      canonical: e.canonical,
      robots: e.robots,
      titleHash: sha(e.title ?? ""),
      title: e.title,
      h1Hash: sha(e.h1 ?? ""),
      h1: e.h1,
      mainHash: sha(e.main),
      mainChars: e.main.length,
      jsonldHash: sha(e.tipos.join("|")),
      jsonldTipos: e.tipos,
      jsonldBlocos: e.jsonldBlocos,
      internalLinks: e.links,
      internalLinkSetHash: sha(e.links.join("\n")),
      inboundNoDoc: e.links.length,
    };
  } catch (err) {
    return { path: p, status: 0, erro: String(err?.message ?? err) };
  }
}

async function emLotes(itens, fn, n) {
  const out = [];
  for (let i = 0; i < itens.length; i += n) out.push(...(await Promise.all(itens.slice(i, i + n).map(fn))));
  return out;
}

const sitemap = lerSitemaps();
const paginas = await emLotes(CURATED_PATHS, coletar, CONCORRENCIA);

const problemas = [];
const inbound = new Map(CURATED_PATHS.map((p) => [p, 0]));

for (const pg of paginas) {
  const rotulo = pg.path;
  if (pg.status !== 200) problemas.push(`${rotulo}: HTTP ${pg.status}${pg.erro ? ` (${pg.erro})` : ""}`);
  if (pg.status !== 200) continue;

  const esperado = `${BASE}${pg.path === "/" ? "/" : pg.path}`;
  if (!pg.canonical) problemas.push(`${rotulo}: sem canonical`);
  else if (pg.canonical.replace(/\/+$/, "") !== esperado.replace(/\/+$/, ""))
    problemas.push(`${rotulo}: canonical divergente → ${pg.canonical}`);
  if (pg.canonical && CONSOLIDADAS.has(new URL(pg.canonical).pathname))
    problemas.push(`${rotulo}: canonical aponta para URL consolidada`);
  if (/noindex/i.test(pg.robots ?? "")) problemas.push(`${rotulo}: noindex indevido em URL curada`);
  if (!pg.h1) problemas.push(`${rotulo}: sem H1 no HTML servido`);
  if (pg.mainChars < 400) problemas.push(`${rotulo}: SSR pobre (${pg.mainChars} chars de texto)`);
  if (pg.jsonldTipos.includes("INVALID_JSON_LD")) problemas.push(`${rotulo}: JSON-LD inválido`);
  if (!sitemap.has(pg.path)) problemas.push(`${rotulo}: ausente do sitemap`);

  for (const alvo of pg.internalLinks) {
    if (CONSOLIDADAS.has(alvo)) problemas.push(`${rotulo}: link interno para URL consolidada → ${alvo}`);
    if (inbound.has(alvo)) inbound.set(alvo, inbound.get(alvo) + 1);
  }
  pg.sitemap = sitemap.get(pg.path) ?? null;
  pg.cluster = clusterOf(pg.path);
  pg.tier = tierOf(pg.path);
}

// Sitemap não pode conter consolidada, 404 ou URL fora do conjunto curado.
for (const [p] of sitemap) {
  if (CONSOLIDADAS.has(p)) problemas.push(`sitemap: contém URL consolidada → ${p}`);
  else if (!CURADAS.has(p)) problemas.push(`sitemap: contém URL fora do conjunto curado → ${p}`);
}

const relatorio = {
  schema: "live-validation/1.0",
  base: BASE,
  executadoEm: new Date().toISOString(),
  universoCurado: CURATED_PATHS.length,
  totais: {
    ok200: paginas.filter((p) => p.status === 200).length,
    falhas: paginas.filter((p) => p.status !== 200).length,
    noSitemap: paginas.filter((p) => sitemap.has(p.path)).length,
    problemas: problemas.length,
  },
  inbound: Object.fromEntries([...inbound.entries()].sort()),
  problemas,
  paginas: paginas.map(({ internalLinks, ...resto }) => ({ ...resto, internalLinks })),
};

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(relatorio, null, 2)}\n`);

console.log(`Produção auditada em ${BASE}`);
console.log(`  URLs curadas:  ${CURATED_PATHS.length}`);
console.log(`  HTTP 200:      ${relatorio.totais.ok200}`);
console.log(`  no sitemap:    ${relatorio.totais.noSitemap}`);
console.log(`  problemas:     ${problemas.length}`);
for (const p of problemas.slice(0, 25)) console.log(`   • ${p}`);
if (problemas.length > 25) console.log(`   … +${problemas.length - 25}`);

if (GATE && problemas.length) {
  console.error("\n❌ Regressão objetiva em produção — corrigir apenas a regressão.");
  process.exit(1);
}
