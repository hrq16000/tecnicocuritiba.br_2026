#!/usr/bin/env node
/**
 * PRIORIZAÇÃO SEO POR URL — indexação × desempenho no Google.
 *
 * Junta em um único arquivo o que hoje está espalhado em relatórios:
 *   • reports/index-state.json  → status de indexação (GSC URL Inspection)
 *   • reports/rank-daily.json   → cliques, impressões, CTR e posição média
 *   • reports/content-approval.json → URLs aprovadas no gate de originalidade
 *
 * Saída: public/seo-priority.json — consumido por /admin/vitals para cruzar
 * Core Web Vitals com o impacto real de cada página na busca.
 *
 * Score de prioridade (0–100): impressões perdidas por posição fraca +
 * penalidade por CTR baixo + penalidade por URL aprovada e não indexada.
 *
 * Uso: node scripts/generate-seo-priority.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);

const indexState = readJson("reports/index-state.json");
const rank = readJson("reports/rank-daily.json");
const approval = readJson("reports/content-approval.json");

const normalizar = (u) => {
  if (!u) return null;
  try {
    return new URL(u).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return u.split("?")[0].replace(/\/+$/, "") || "/";
  }
};

/** path → agregado de desempenho */
const perf = new Map();
for (const r of rank?.rows ?? []) {
  const p = normalizar(r.url);
  if (!p) continue;
  const acc = perf.get(p) ?? { clicks: 0, impressions: 0, posSoma: 0, posPeso: 0, queries: [] };
  acc.clicks += r.clicks ?? 0;
  acc.impressions += r.impressions ?? 0;
  if (r.position != null) {
    acc.posSoma += r.position * Math.max(1, r.impressions ?? 1);
    acc.posPeso += Math.max(1, r.impressions ?? 1);
  }
  acc.queries.push({ query: r.query, position: r.position ?? null, impressions: r.impressions ?? 0, ctr: r.ctr ?? 0 });
  perf.set(p, acc);
}

const aprovadas = new Set(approval?.approved ?? []);
const estados = indexState?.urls ?? {};

const paths = [...new Set([...perf.keys(), ...Object.keys(estados), ...aprovadas])].sort();

const urls = paths.map((path) => {
  const a = perf.get(path);
  const idx = estados[path];
  const impressions = a?.impressions ?? 0;
  const clicks = a?.clicks ?? 0;
  const ctr = impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : null;
  const position = a?.posPeso ? Number((a.posSoma / a.posPeso).toFixed(1)) : null;

  const indexacao = idx
    ? idx.indexadaEm
      ? "indexada"
      : (idx.verdict ?? "desconhecida")
    : aprovadas.has(path)
      ? "aprovada-sem-checagem"
      : "fora-do-monitoramento";

  // Score: quanto maior, mais essa URL trava resultado no Google.
  let score = 0;
  if (impressions) score += Math.min(45, Math.log10(impressions + 1) * 18);
  if (position != null && position > 3) score += Math.min(25, (position - 3) * 2);
  if (ctr != null && position != null && position <= 10 && ctr < 2) score += 15;
  if (indexacao !== "indexada" && aprovadas.has(path)) score += 20;

  const motivos = [];
  if (indexacao !== "indexada" && aprovadas.has(path)) motivos.push("aprovada e ainda sem indexação confirmada");
  if (position != null && position > 10) motivos.push(`posição média ${position} (fora da primeira página)`);
  else if (position != null && position > 3) motivos.push(`posição média ${position} (fora do top 3)`);
  if (ctr != null && ctr < 2 && impressions > 50) motivos.push(`CTR ${ctr}% com ${impressions} impressões`);

  return {
    path,
    indexacao,
    ultimaChecagem: idx?.checadaEm ?? null,
    aprovada: aprovadas.has(path),
    clicks,
    impressions,
    ctr,
    position,
    topQueries: (a?.queries ?? []).sort((x, y) => y.impressions - x.impressions).slice(0, 3),
    score: Math.round(score),
    motivos,
  };
});

urls.sort((a, b) => b.score - a.score);

mkdirSync("public", { recursive: true });
const payload = {
  generatedAt: new Date().toISOString(),
  fontes: {
    indexState: indexState ? (indexState.generatedAt ?? true) : null,
    rankDaily: rank ? (rank.generatedAt ?? true) : null,
    contentApproval: approval ? true : null,
  },
  janela: rank?.janela ?? null,
  totals: {
    urls: urls.length,
    indexadas: urls.filter((u) => u.indexacao === "indexada").length,
    semIndexacao: urls.filter((u) => u.aprovada && u.indexacao !== "indexada").length,
    comTrafego: urls.filter((u) => u.impressions > 0).length,
  },
  urls,
};
writeFileSync("public/seo-priority.json", `${JSON.stringify(payload, null, 2)}\n`);
console.log(
  `seo-priority: ${payload.totals.urls} URL(s) — ${payload.totals.indexadas} indexada(s), ` +
    `${payload.totals.semIndexacao} aprovada(s) sem indexação → public/seo-priority.json`,
);
