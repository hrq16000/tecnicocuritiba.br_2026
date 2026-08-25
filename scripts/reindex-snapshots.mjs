#!/usr/bin/env node
/**
 * ============================================================================
 * REINDEXAÇÃO + VERIFICAÇÃO DE MEMÓRIAS E SNAPSHOTS OPERACIONAIS
 * ============================================================================
 * Sempre que um marco (D0/D7/D14/D30) é registrado, este job reconstrói o
 * índice dos artefatos que sustentam a fase de operação:
 *
 *   • memórias do projeto     .lovable/memory/**.md
 *   • marcos versionados      reports/operacao-marcos.json
 *   • resumos de marco        reports/operacao-<marco>.md
 *   • snapshots de SERP       reports/serp-signals-<marco>.json
 *   • snapshots de queries    reports/queries-<marco>.json
 *   • inventário do marco     reports/indexation-inventory.json
 *
 * Depois da reindexação roda uma VERIFICAÇÃO independente:
 *   1. contagem — todo marco registrado tem resumo, SERP snapshot e entrada;
 *   2. paridade — public/operacao-marcos.json == reports/operacao-marcos.json;
 *   3. amostragem — N entradas sorteadas são relidas e re-hashadas do disco;
 *   4. cobertura de URLs — o marco atual cobre todas as URLs curadas.
 *
 * Saídas: public/snapshot-index.json (consumido por /admin/monitoramento) e
 * reports/snapshot-index-verificacao.json.
 *
 * Uso:
 *   node scripts/reindex-snapshots.mjs
 *   node scripts/reindex-snapshots.mjs --strict     # falha o job se a verificação reprovar
 *   node scripts/reindex-snapshots.mjs --amostra=8
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { registrarJob } from "./lib/job-log.mjs";

const INICIO_JOB = Date.now();

const args = process.argv.slice(2);
const STRICT = args.includes("--strict");
const AMOSTRA = Number(args.find((a) => a.startsWith("--amostra="))?.split("=")[1] ?? 5);

const sha1 = (buf) => createHash("sha1").update(buf).digest("hex");
const lerJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};
const entrada = (tipo, path, extra = {}) => {
  if (!existsSync(path)) return null;
  const raw = readFileSync(path);
  return {
    tipo,
    path,
    bytes: raw.length,
    hash: sha1(raw),
    modificadoEm: statSync(path).mtime.toISOString(),
    ...extra,
  };
};

/* ── coleta ────────────────────────────────────────────────────────────── */
const itens = [];

// Memórias do projeto (markdown), recursivo.
const MEM = ".lovable/memory";
const varrer = (dir) => {
  if (!existsSync(dir)) return;
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) varrer(p);
    else if (nome.endsWith(".md")) itens.push(entrada("memoria", p));
  }
};
varrer(MEM);

const historico = lerJson("reports/operacao-marcos.json") ?? { marcos: [] };
const marcos = historico.marcos ?? [];

itens.push(entrada("historico", "reports/operacao-marcos.json", { marcos: marcos.map((m) => m.marco) }));
itens.push(entrada("inventario", "reports/indexation-inventory.json", { urls: (lerJson("reports/indexation-inventory.json")?.urls ?? []).length }));

for (const m of marcos) {
  const slug = m.marco.toLowerCase();
  itens.push(entrada("marco-resumo", `reports/operacao-${slug}.md`, { marco: m.marco }));
  itens.push(entrada("marco-serp", `reports/serp-signals-${slug}.json`, { marco: m.marco }));
  itens.push(entrada("marco-queries", `reports/queries-${slug}.json`, { marco: m.marco }));
}

const indice = itens.filter(Boolean);

/* ── verificação ───────────────────────────────────────────────────────── */
const falhas = [];
const avisos = [];

// 1. contagem por marco
for (const m of marcos) {
  const slug = m.marco.toLowerCase();
  const tem = (tipo) => indice.some((i) => i.tipo === tipo && i.marco === m.marco);
  if (!tem("marco-resumo")) falhas.push(`${m.marco}: resumo reports/operacao-${slug}.md ausente`);
  if (!tem("marco-serp")) falhas.push(`${m.marco}: snapshot de SERP reports/serp-signals-${slug}.json ausente`);
  if (!tem("marco-queries")) avisos.push(`${m.marco}: snapshot de queries ausente (N/A — sem coleta GSC de queries neste marco)`);
}

// 2. paridade entre o histórico e o payload público
const publico = lerJson("public/operacao-marcos.json");
if (!publico) falhas.push("public/operacao-marcos.json ausente — painel ficaria sem dado");
else if (JSON.stringify(publico) !== JSON.stringify(historico)) falhas.push("public/operacao-marcos.json divergente do histórico em reports/");

// 3. amostragem verificável (re-leitura + re-hash)
const sorteio = [...indice].sort(() => Math.random() - 0.5).slice(0, Math.min(AMOSTRA, indice.length));
const amostras = sorteio.map((i) => {
  const ok = existsSync(i.path) && sha1(readFileSync(i.path)) === i.hash;
  if (!ok) falhas.push(`amostra divergente: ${i.path}`);
  return { path: i.path, tipo: i.tipo, hash: i.hash, conferido: ok };
});

// 4. cobertura de URLs do marco atual
const inv = lerJson("reports/indexation-inventory.json");
const curadas = (inv?.urls ?? []).filter((u) => u.sitemap).length;
const atual = marcos[marcos.length - 1] ?? null;
if (atual && curadas && atual.denominador?.curadas !== curadas)
  falhas.push(`cobertura: marco ${atual.marco} registrou ${atual.denominador?.curadas} URLs e o inventário atual tem ${curadas}`);

const verificacao = {
  executadoEm: new Date().toISOString(),
  marcos: marcos.map((m) => m.marco),
  totalEntradas: indice.length,
  memorias: indice.filter((i) => i.tipo === "memoria").length,
  urlsCuradas: curadas || null,
  urlsNoMarcoAtual: atual?.denominador?.curadas ?? null,
  amostragem: { solicitada: AMOSTRA, conferidas: amostras.length, ok: amostras.every((a) => a.conferido), itens: amostras },
  falhas,
  avisos,
  status: falhas.length === 0 ? "ok" : "falhou",
};

mkdirSync("reports", { recursive: true });
mkdirSync("public", { recursive: true });
writeFileSync("reports/snapshot-index-verificacao.json", `${JSON.stringify(verificacao, null, 2)}\n`);
writeFileSync(
  "public/snapshot-index.json",
  `${JSON.stringify({ geradoEm: verificacao.executadoEm, verificacao: { ...verificacao, itens: undefined }, itens: indice }, null, 2)}\n`,
);

console.log(`[reindex] ${indice.length} artefato(s) · ${verificacao.memorias} memória(s) · marcos: ${verificacao.marcos.join(", ") || "nenhum"}`);
for (const a of avisos) console.log(`  · aviso ${a}`);
for (const f of falhas) console.log(`  ✖ ${f}`);
console.log(`[verificacao] status=${verificacao.status} amostras=${amostras.length} ok=${verificacao.amostragem.ok}`);
console.log("  → public/snapshot-index.json · reports/snapshot-index-verificacao.json");

registrarJob({
  job: "reindex:snapshots",
  marco: atual?.marco ?? null,
  duracaoMs: Date.now() - INICIO_JOB,
  status: verificacao.status === "ok" ? (avisos.length ? "aviso" : "ok") : "falhou",
  failClosed: verificacao.status === "ok",
  contagens: {
    artefatos: indice.length,
    memorias: verificacao.memorias,
    urlsCuradas: curadas || null,
    amostrasConferidas: amostras.filter((a) => a.conferido).length,
  },
  logs: [
    `marcos: ${verificacao.marcos.join(", ") || "nenhum"}`,
    ...amostras.map((a) => `amostra ${a.conferido ? "ok" : "DIVERGENTE"} · ${a.path}`),
    ...avisos.map((a) => `aviso · ${a}`),
    ...falhas.map((f) => `falha · ${f}`),
  ],
});

if (STRICT && falhas.length) process.exit(1);
