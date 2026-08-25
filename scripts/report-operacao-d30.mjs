#!/usr/bin/env node
/**
 * ============================================================================
 * RELATÓRIO DE OPERAÇÃO D30 — EVIDÊNCIA, NÃO OPINIÃO
 * ============================================================================
 * Consolida em um único documento o que aconteceu nos últimos 30 dias sobre o
 * universo CURADO ATUAL (nunca o denominador antigo de 170):
 *
 *   - curadoria: total indexável, por cluster e por Tier
 *   - cobertura Google: indexed / unknown / discovered / crawled not indexed
 *   - desempenho: cliques, impressões, CTR e posição média (28-30 dias)
 *   - Bing: known/indexed/erros/IndexNow (N/A quando não há acesso)
 *   - decisão A/B/C/D baseada em limiares explícitos
 *
 * Uso: node scripts/report-operacao-d30.mjs [--dias 30]
 * Saídas: reports/operacao-d30.json · reports/operacao-d30.md
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { CURATED_PATHS, BASE_URL } from "./lib/curated-urls.mjs";
import { clusterOf, tierOf } from "./lib/indexation-tiers.mjs";

const args = process.argv.slice(2);
const DIAS = Number(args[args.indexOf("--dias") + 1]) || 30;

const lerJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const pct = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : 0);

const curadas = [...new Set(CURATED_PATHS)].sort();
const inventario = lerJson("reports/indexation-inventory.json");
const qualidade = lerJson("reports/local-page-quality.json");
const historico = lerJson("reports/indexation-daily-history.json") ?? [];

/** Métricas por URL: usa GSC quando houver credencial; senão, o inventário. */
let site = null;
let perf = null;
let gscErro = null;
const porUrl = new Map(
  (inventario?.urls ?? []).map((u) => [u.path, { ...u }]),
);

if (process.env.LOVABLE_API_KEY && process.env.GOOGLE_SEARCH_CONSOLE_API_KEY) {
  try {
    const { resolveSite, searchAnalytics, dayOffset } = await import("./lib/gsc-client.mjs");
    site = await resolveSite(`${BASE_URL}/`);
    const data = await searchAnalytics(site, {
      startDate: dayOffset(DIAS + 2),
      endDate: dayOffset(2),
      dimensions: ["page"],
      rowLimit: 1000,
    });
    perf = { clicks: 0, impressions: 0, position: 0, rows: data.rows?.length ?? 0 };
    let peso = 0;
    for (const row of data.rows ?? []) {
      const path = row.keys[0].replace(BASE_URL, "") || "/";
      const reg = porUrl.get(path) ?? {};
      reg.clicks = row.clicks;
      reg.impressions = row.impressions;
      reg.position = row.position;
      porUrl.set(path, reg);
      perf.clicks += row.clicks;
      perf.impressions += row.impressions;
      perf.position += row.position * row.impressions;
      peso += row.impressions;
    }
    perf.position = peso ? Math.round((perf.position / peso) * 10) / 10 : 0;
    perf.ctr = perf.impressions ? Math.round((perf.clicks / perf.impressions) * 10000) / 100 : 0;
  } catch (e) {
    gscErro = String(e.message ?? e).slice(0, 200);
  }
} else {
  gscErro = "sem credenciais GSC no ambiente (LOVABLE_API_KEY / GOOGLE_SEARCH_CONSOLE_API_KEY)";
}

/** Cobertura por estado, restrita ao universo curado. */
const estados = { indexed: 0, unknown: 0, discovered: 0, crawled_not_indexed: 0, duplicate: 0, outros: 0 };
const tiers = {};
for (const path of curadas) {
  const reg = porUrl.get(path) ?? {};
  const tier = reg.tier ?? tierOf(path, reg);
  tiers[tier] ??= { total: 0, indexadas: 0, impressoes: 0, cliques: 0 };
  tiers[tier].total += 1;
  tiers[tier].impressoes += reg.impressions ?? 0;
  tiers[tier].cliques += reg.clicks ?? 0;
  const s = (reg.gscStatus ?? reg.gscCoverage ?? "unknown").toLowerCase();
  if (s.includes("index") && !s.includes("not") && !s.includes("crawled")) {
    estados.indexed += 1;
    tiers[tier].indexadas += 1;
  } else if (s.includes("crawled")) estados.crawled_not_indexed += 1;
  else if (s.includes("discover")) estados.discovered += 1;
  else if (s.includes("duplicate") || s.includes("canonical")) estados.duplicate += 1;
  else if (s.includes("unknown")) estados.unknown += 1;
  else estados.outros += 1;
}

const tierA = tiers.A ?? { total: 0, indexadas: 0 };
const tierARate = pct(tierA.indexadas, tierA.total);

/** Bing: só reporta o que existe. Nada é inferido. */
const bingLast = lerJson("reports/indexnow-last-run.json");
const bing = {
  known: process.env.BING_KNOWN_URLS ? Number(process.env.BING_KNOWN_URLS) : "N/A",
  indexed: process.env.BING_INDEXED_URLS ? Number(process.env.BING_INDEXED_URLS) : "N/A",
  erros: process.env.BING_ERRORS ? Number(process.env.BING_ERRORS) : "N/A",
  indexnowUltimaExecucao: bingLast?.executadoEm ?? "N/A",
  indexnowEnviadas: bingLast?.enviadas ?? bingLast?.submitted ?? "N/A",
};

/** Tendência: primeiro e último ponto do histórico dentro da janela. */
const janela = historico.slice(-DIAS);
const inicio = janela[0] ?? null;
const fim = janela[janela.length - 1] ?? null;
const deltaIndexadas = inicio && fim ? (fim.indexadas ?? 0) - (inicio.indexadas ?? 0) : null;

const doorwayAlto = qualidade?.resumo?.alto ?? null;

/**
 * Decisão por evidência:
 *  A — indexação e desempenho subindo: manter operação, sem reforma.
 *  B — indexação estável e desempenho subindo: melhorar só onde há impressão.
 *  C — indexação estagnada: atacar descoberta/qualidade das URLs unknown.
 *  D — regressão: parar publicação e diagnosticar.
 */
let decisao = "C";
let justificativa = "";
if (deltaIndexadas !== null && deltaIndexadas < -2) {
  decisao = "D";
  justificativa = `Indexadas caíram ${Math.abs(deltaIndexadas)} no período.`;
} else if (doorwayAlto !== null && doorwayAlto > 2) {
  decisao = "D";
  justificativa = `Doorway HIGH subiu para ${doorwayAlto} (baseline 2).`;
} else if (tierARate >= 70 && (perf?.clicks ?? 0) > 0) {
  decisao = "A";
  justificativa = `Tier A em ${tierARate}% com cliques reais no período.`;
} else if ((deltaIndexadas ?? 0) >= 0 && (perf?.impressions ?? 0) > 0) {
  decisao = "B";
  justificativa = `Indexação estável e ${perf.impressions} impressão(ões) no período — otimizar onde já há demanda.`;
} else {
  justificativa = `Indexação estagnada (${estados.unknown} URL(s) unknown, ${estados.discovered} descobertas não indexadas) — foco em descoberta e valor incremental.`;
}

const relatorio = {
  geradoEm: new Date().toISOString(),
  janelaDias: DIAS,
  site,
  gscErro,
  curadoria: {
    total: curadas.length,
    porCluster: curadas.reduce((acc, p) => {
      const c = clusterOf(p);
      acc[c] = (acc[c] ?? 0) + 1;
      return acc;
    }, {}),
    porTier: tiers,
  },
  cobertura: estados,
  tierA: { total: tierA.total, indexadas: tierA.indexadas, taxa: tierARate },
  desempenho: perf ?? "N/A",
  bing,
  qualidade: qualidade?.resumo ?? "N/A",
  tendencia: { inicio, fim, deltaIndexadas },
  decisao,
  justificativa,
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/operacao-d30.json", JSON.stringify(relatorio, null, 2));
writeFileSync(
  "reports/operacao-d30.md",
  [
    `# Operação D${DIAS} — ${new Date().toISOString().slice(0, 10)}`,
    "",
    `Universo avaliado: **conjunto curado atual (${curadas.length} URLs)**. O denominador antigo de 170 URLs não é comparável — 40 foram consolidadas via 301.`,
    "",
    "## Curadoria",
    "",
    "| Cluster | URLs |",
    "| --- | --- |",
    ...Object.entries(relatorio.curadoria.porCluster).map(([c, n]) => `| ${c} | ${n} |`),
    "",
    "| Tier | URLs | Indexadas | Taxa | Impressões | Cliques |",
    "| --- | --- | --- | --- | --- | --- |",
    ...Object.entries(tiers)
      .sort()
      .map(
        ([t, v]) =>
          `| ${t} | ${v.total} | ${v.indexadas} | ${pct(v.indexadas, v.total)}% | ${v.impressoes} | ${v.cliques} |`,
      ),
    "",
    "## Cobertura Google",
    "",
    "| Estado | URLs |",
    "| --- | --- |",
    ...Object.entries(estados).map(([k, v]) => `| ${k} | ${v} |`),
    "",
    gscErro ? `> Search Console: ${gscErro}\n` : "",
    "## Desempenho (janela)",
    "",
    perf
      ? `Cliques **${perf.clicks}** · impressões **${perf.impressions}** · CTR **${perf.ctr}%** · posição média **${perf.position}**`
      : "N/A — sem dados de Search Console nesta execução.",
    "",
    "## Bing",
    "",
    `Known: ${bing.known} · Indexed: ${bing.indexed} · Erros: ${bing.erros}`,
    `IndexNow — última execução: ${bing.indexnowUltimaExecucao} · enviadas: ${bing.indexnowEnviadas}`,
    "",
    "## Qualidade",
    "",
    typeof relatorio.qualidade === "object"
      ? `Doorway ALTO **${relatorio.qualidade.alto}** · MÉDIO ${relatorio.qualidade.medio} · BAIXO ${relatorio.qualidade.baixo} · OK ${relatorio.qualidade.ok}`
      : "N/A",
    "",
    "## Decisão",
    "",
    `**${decisao}** — ${justificativa}`,
    "",
    "| Decisão | Significado |",
    "| --- | --- |",
    "| A | Indexação e desempenho subindo — manter operação, nenhuma reforma |",
    "| B | Estável com demanda — melhorar apenas URLs com impressão real |",
    "| C | Estagnado — atacar descoberta e valor incremental das unknown |",
    "| D | Regressão — parar publicação e diagnosticar |",
  ].join("\n"),
);

console.log(`── Operação D${DIAS}`);
console.log(`  curadas: ${curadas.length} · Tier A: ${tierA.indexadas}/${tierA.total} (${tierARate}%)`);
console.log(`  cobertura: ${JSON.stringify(estados)}`);
console.log(`  decisão: ${decisao} — ${justificativa}`);
console.log("  → reports/operacao-d30.md");
