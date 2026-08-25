#!/usr/bin/env node
/**
 * AUDITORIA DE VALOR URL POR URL (Fase 6, Etapas 1–3 e 18)
 *
 * Baixa o HTML servido de cada URL do sitemap curado, extrai sinais reais
 * (estrutura, utilidade prática, confiança, FAQ/schema, links internos),
 * compara cada página com as demais do MESMO cluster por shingles e produz:
 *
 *   reports/quality-audit.json    — score, faixa, causas e motivos por URL
 *   reports/quality-audit.md      — leitura humana + priorização
 *   public/quality-audit.json     — payload enxuto para o painel interno
 *
 * Não altera nenhuma página. Não normaliza o score para "ficar bonito".
 *
 * Uso: node scripts/report-quality-audit.mjs [--limit N]
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { clusterOf, tierOf } from "./lib/indexation-tiers.mjs";
import { extractSignals, jaccard, scorePage, shingles } from "./lib/page-quality.mjs";

const BASE = "https://tecnico.curitiba.br";
const args = process.argv.slice(2);
const limit = Number(args[args.indexOf("--limit") + 1]) || Infinity;

// URLs = sitemap curado servido em produção.
const publicDir = resolve("public");
const paths = new Set();
for (const f of readdirSync(publicDir).filter(
  (x) => x.startsWith("sitemap-") && x.endsWith(".xml") && !["sitemap-index.xml", "sitemap-images.xml"].includes(x),
)) {
  const xml = readFileSync(resolve(publicDir, f), "utf8");
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) paths.add(m[1].trim().replace(BASE, "") || "/");
}
const lista = [...paths].sort().slice(0, limit);

// Contexto do inventário (GSC + malha interna), quando disponível.
const inv = existsSync("reports/indexation-inventory.json")
  ? JSON.parse(readFileSync("reports/indexation-inventory.json", "utf8"))
  : { urls: [] };
const ctx = new Map(inv.urls.map((u) => [u.path, u]));

console.log(`auditando ${lista.length} URL(s)…`);
const pages = new Map();
const queue = [...lista];
let done = 0;
async function worker() {
  while (queue.length) {
    const path = queue.shift();
    try {
      const res = await fetch(`${BASE}${path}`, { headers: { "user-agent": "tecnico-quality-audit" } });
      const html = res.status === 200 ? await res.text() : "";
      pages.set(path, { http: res.status, signals: html ? extractSignals(html) : null });
    } catch (e) {
      pages.set(path, { http: 0, erro: String(e).slice(0, 120), signals: null });
    }
    if (++done % 25 === 0) console.log(`  ${done}/${lista.length}`);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

// Shingles por página e comparação intra-cluster.
const shingleOf = new Map();
for (const [path, p] of pages) if (p.signals) shingleOf.set(path, shingles(p.signals.text));

const porCluster = new Map();
for (const path of lista) {
  const c = clusterOf(path);
  porCluster.set(c, [...(porCluster.get(c) ?? []), path]);
}

const results = [];
for (const path of lista) {
  const p = pages.get(path);
  const cluster = clusterOf(path);
  if (!p?.signals) {
    results.push({ path, url: `${BASE}${path}`, cluster, http: p?.http ?? 0, score: 0, faixa: "E", causas: ["THIN_INFORMATION"], motivos: [`HTML indisponível (HTTP ${p?.http ?? 0})`] });
    continue;
  }
  const mine = shingleOf.get(path);
  let similaridadeMax = 0;
  let parMaisParecido = null;
  const compartilhados = new Set();
  for (const outro of porCluster.get(cluster) ?? []) {
    if (outro === path) continue;
    const seu = shingleOf.get(outro);
    if (!seu) continue;
    const j = jaccard(mine, seu);
    if (j > similaridadeMax) {
      similaridadeMax = j;
      parMaisParecido = outro;
    }
    for (const s of mine) if (seu.has(s)) compartilhados.add(s);
  }
  const textoExclusivoRatio = mine.size ? 1 - compartilhados.size / mine.size : 0;
  const info = ctx.get(path) ?? {};
  const avaliacao = scorePage({
    path,
    cluster,
    signals: p.signals,
    similaridadeMax,
    textoExclusivoRatio,
    inboundContextual: info.inboundContextual ?? 0,
  });
  results.push({
    path,
    url: `${BASE}${path}`,
    cluster,
    tier: tierOf(path, info),
    http: p.http,
    palavras: p.signals.wordCount,
    h2: p.signals.h2s.length,
    tabelas: p.signals.tables,
    schemaTypes: p.signals.schemaTypes,
    faqSchema: p.signals.faqSchemaQuestions.length,
    similaridadeMax: Number(similaridadeMax.toFixed(3)),
    parMaisParecido,
    textoExclusivoRatio: Number(textoExclusivoRatio.toFixed(3)),
    gscStatus: info.gscStatus ?? "N/A",
    impressions: info.impressions ?? 0,
    clicks: info.clicks ?? 0,
    inbound: info.inbound ?? 0,
    ...avaliacao,
  });
}

results.sort((a, b) => a.score - b.score);
const geradoEm = new Date().toISOString();
mkdirSync("reports", { recursive: true });
writeFileSync(
  "reports/quality-audit.json",
  JSON.stringify({ geradoEm, base: BASE, total: results.length, results }, null, 2),
);

const faixas = { A: 0, B: 0, C: 0, D: 0, E: 0 };
for (const r of results) faixas[r.faixa]++;
const causasCount = new Map();
for (const r of results) for (const c of r.causas ?? []) causasCount.set(c, (causasCount.get(c) ?? 0) + 1);

// Priorização (Etapa 3): no máximo 15 URLs, cruzando score baixo com valor real.
const prioridade = results
  .filter((r) => r.faixa === "C" || r.faixa === "D" || r.faixa === "E")
  .map((r) => ({
    ...r,
    peso:
      (r.impressions > 0 ? 40 : 0) +
      (r.tier === "A" ? 30 : r.tier === "B" ? 12 : 0) +
      (["HUB", "HOME", "SERVICO", "PROBLEMA", "BLOG_HUB"].includes(r.cluster) ? 15 : 0) +
      Math.max(0, 70 - r.score) / 4,
  }))
  .sort((a, b) => b.peso - a.peso)
  .slice(0, 15);

const clusterMed = () => {
  const m = new Map();
  for (const r of results) m.set(r.cluster, [...(m.get(r.cluster) ?? []), r.score]);
  return [...m.entries()]
    .map(([c, arr]) => {
      const s = [...arr].sort((a, b) => a - b);
      return [c, arr.length, s[Math.floor(s.length / 2)], Math.min(...s), Math.max(...s)];
    })
    .sort((a, b) => a[2] - b[2]);
};

const md = `# Auditoria de valor — ${results.length} URLs

Gerada em ${geradoEm}. Score 0–100 pela rubrica da Fase 6
(intenção 25 · valor incremental 20 · utilidade 20 · confiança 15 · semântica 10 · originalidade 10,
menos penalidade por linguagem publicitária sem evidência).

## Distribuição

| Faixa | Critério | URLs |
| --- | --- | --- |
| A — excelente | 85–100 | ${faixas.A} |
| B — forte | 70–84 | ${faixas.B} |
| C — aceitável | 55–69 | ${faixas.C} |
| D — fraca | 40–54 | ${faixas.D} |
| E — redundante/questionável | < 40 | ${faixas.E} |

## Causas dominantes

| Causa | URLs |
| --- | --- |
${[...causasCount.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => `| ${c} | ${n} |`).join("\n")}

## Score por cluster

| Cluster | URLs | Mediana | Mín | Máx |
| --- | --- | --- | --- | --- |
${clusterMed().map(([c, n, med, mi, ma]) => `| ${c} | ${n} | ${med} | ${mi} | ${ma} |`).join("\n")}

## Fila de otimização (máx. 15 · Etapa 3)

| # | URL | Score | Faixa | Tier | GSC | Impr. | Causas |
| --- | --- | --- | --- | --- | --- | --- | --- |
${prioridade.map((r, i) => `| ${i + 1} | ${r.path} | ${r.score} | ${r.faixa} | ${r.tier} | ${r.gscStatus} | ${r.impressions} | ${r.causas.join(", ") || "—"} |`).join("\n")}

## 25 menores scores (diagnóstico bruto)

${results
  .slice(0, 25)
  .map((r) => `- **${r.path}** — ${r.score} (${r.faixa}, ${r.cluster}, sim. máx ${r.similaridadeMax})\n  - ${r.motivos.slice(0, 4).join("\n  - ")}`)
  .join("\n")}
`;
writeFileSync("reports/quality-audit.md", md);

writeFileSync(
  "public/quality-audit.json",
  JSON.stringify(
    {
      geradoEm,
      faixas,
      total: results.length,
      prioridade: prioridade.map((r) => ({ path: r.path, score: r.score, causas: r.causas })),
      urls: results.map((r) => ({
        path: r.path,
        cluster: r.cluster,
        tier: r.tier,
        score: r.score,
        faixa: r.faixa,
        similaridadeMax: r.similaridadeMax,
        textoExclusivoRatio: r.textoExclusivoRatio,
        palavras: r.palavras,
        gscStatus: r.gscStatus,
        impressions: r.impressions,
        causas: r.causas,
      })),
    },
    null,
    2,
  ),
);

console.log(
  `auditoria: A ${faixas.A} · B ${faixas.B} · C ${faixas.C} · D ${faixas.D} · E ${faixas.E} — reports/quality-audit.md`,
);
