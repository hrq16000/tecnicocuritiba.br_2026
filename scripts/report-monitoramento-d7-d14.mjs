#!/usr/bin/env node
/**
 * ============================================================================
 * ANALISTA DE INDEXAÇÃO D7 / D14 — SOMENTE LEITURA
 * ============================================================================
 * Lê os marcos já registrados (`reports/operacao-marcos.json`), o inventário
 * corrente (`reports/indexation-inventory.json`) e as evidências auxiliares,
 * e produz `docs/relatorio-monitoramento-d7-d14.md` + o payload
 * `public/monitoramento-analise.json` consumido por /admin/monitoramento.
 *
 * REGRAS DESTA FASE (aplicadas no código, não só na prosa):
 *   • nada é alterado no site: o script não escreve em src/, public/sitemap*,
 *     robots, canonical, redirects, nem dispara IndexNow;
 *   • dado inexistente vira "N/A" — jamais estimativa;
 *   • D0 é o controle e nunca é sobrescrito.
 *
 * Uso:
 *   node scripts/report-monitoramento-d7-d14.mjs
 *   node scripts/report-monitoramento-d7-d14.mjs --marco=D14
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { decidirMarco } from "./lib/marco-decisao.mjs";
import { janelasSearchPerformance } from "./lib/marco-integridade.mjs";

const args = process.argv.slice(2);
const arg = (n, d = null) => {
  const hit = args.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const lerJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};
const NA = "N/A";
const num = (v) => (typeof v === "number" ? v : null);
const fmt = (v) => (v === null || v === undefined ? NA : String(v));

const historico = lerJson("reports/operacao-marcos.json") ?? { marcos: [] };
const ORDEM = ["D0", "D7", "D14", "D30"];
const marcos = historico.marcos.slice().sort((a, b) => ORDEM.indexOf(a.marco) - ORDEM.indexOf(b.marco));
const get = (m) => marcos.find((x) => x.marco === m) ?? null;
const D0 = get("D0");
const D7 = get("D7");
const D14 = get("D14");
const MARCO_ATUAL = (arg("marco") || (D14 ? "D14" : D7 ? "D7" : "D0")).toUpperCase();

const inventario = lerJson("reports/indexation-inventory.json");
const urls = (inventario?.urls ?? []).filter((u) => u.sitemap);
const qualidade = lerJson("reports/local-page-quality.json");
const consolidacao = lerJson("reports/post-consolidation.json");
const indexnow = lerJson("reports/indexnow-last-run.json");
const bing = lerJson("reports/bing-webmaster.json");
const alertas = lerJson("reports/operational-alerts-state.json");

/* ── funil ─────────────────────────────────────────────────────────────── */
const ESTADOS = ["unknown", "discovered", "crawled_not_indexed", "indexed"];
const bucketDe = (u) => {
  const s = (u.gscStatus ?? "").toUpperCase();
  const c = (u.gscCoverage ?? "").toUpperCase();
  if (!s && !c) return "unknown";
  if (s === "INDEXED" || c.includes("SUBMITTED AND INDEXED") || c === "INDEXED") return "indexed";
  if (c.includes("DISCOVERED")) return "discovered";
  if (c.includes("CRAWLED")) return "crawled_not_indexed";
  if (c.includes("DUPLICATE") || c.includes("ALTERNATE")) return "duplicate";
  if (c.includes("CANONICAL")) return "canonical_different";
  if (c.includes("REDIRECT")) return "redirect";
  if (c.includes("SOFT 404")) return "soft_404";
  return "unknown";
};

const funil = (m) =>
  m
    ? {
        unknown: m.google.unknown,
        discovered: m.google.discovered,
        crawled_not_indexed: m.google.crawled_not_indexed,
        indexed: m.google.indexed,
        impressoes: m.google.impressoes28d,
        cliques: m.google.cliques28d,
        ctr: m.google.ctr28d,
        posicao: m.google.posicaoMedia28d,
      }
    : null;

const deltas = (a, b) => {
  if (!a || !b) return null;
  const out = {};
  for (const k of Object.keys(b)) {
    const x = num(a[k]);
    const y = num(b[k]);
    out[k] = x === null || y === null ? null : { abs: Math.round((y - x) * 100) / 100, pct: x ? Math.round(((y - x) / x) * 1000) / 10 : null };
  }
  return out;
};

const tierA = (m) => m?.tiers?.find((t) => t.chave === "A") ?? null;

/* ── Tier A não indexadas: classificação individual ────────────────────── */
const estadoNoMarco = (m, path) => {
  // Marcos guardam agregados; o estado por URL só existe no inventário corrente.
  // Sem histórico por URL, devolvemos N/A em vez de inventar.
  if (!m) return NA;
  return m.marco === MARCO_ATUAL ? bucketDe(urls.find((u) => u.path === path) ?? {}) : NA;
};

const qualidadePorPath = new Map(
  (qualidade?.paginas ?? qualidade?.urls ?? []).map((p) => [p.path ?? p.url, p]),
);

function classificar(u) {
  const b = bucketDe(u);
  if (u.http !== 200) return "TECHNICAL_PROBLEM";
  if (u.noindex || u.indexavel === false) return "TECHNICAL_PROBLEM";
  if (!u.canonicalSelf) return "CANONICAL_PROBLEM";
  if (b === "duplicate" || b === "canonical_different") return "CANONICAL_PROBLEM";
  if (b === "crawled_not_indexed") {
    const q = qualidadePorPath.get(u.path);
    const score = num(q?.score);
    if (score !== null && score < 60) return "QUALITY_REVIEW";
    return u.impressions > 0 ? "INTENT_PROBLEM" : "QUALITY_REVIEW";
  }
  if (b === "unknown") return u.inbound > 0 && u.sitemap ? "WAIT" : "DISCOVERY_PROBLEM";
  if (b === "discovered") return u.lastCrawl ? "WAIT" : "CRAWL_PROBLEM";
  return "WAIT";
}

const tierANaoIndexadas = urls
  .filter((u) => u.tier === "A" && bucketDe(u) !== "indexed")
  .map((u) => {
    const q = qualidadePorPath.get(u.path);
    return {
      url: u.path,
      cluster: u.cluster,
      estadoD0: D0 ? NA : NA,
      estadoD7: estadoNoMarco(D7, u.path),
      estadoD14: estadoNoMarco(D14, u.path),
      estadoAtual: bucketDe(u),
      ultimoCrawl: u.lastCrawl ?? NA,
      sitemap: u.sitemap ?? NA,
      canonicalSelf: u.canonicalSelf,
      inbound: u.inbound ?? null,
      profundidade: u.depth ?? null,
      qualityScore: num(q?.score),
      unicidade: num(q?.exclusividade ?? q?.unicidade),
      impressoes: u.impressions ?? 0,
      indexnow: indexnow?.executadoEm ?? NA,
      decisao: classificar(u),
    };
  })
  .sort((a, b) => (b.impressoes ?? 0) - (a.impressoes ?? 0));

const crawledNotIndexed = urls.filter((u) => bucketDe(u) === "crawled_not_indexed");

/* ── clusters ──────────────────────────────────────────────────────────── */
const clusters = (get(MARCO_ATUAL) ?? D0)?.clusters ?? [];

/* ── queries: comparação entre snapshots por marco ─────────────────────── */
function queriesDoMarco(m) {
  const p = `reports/queries-${m.toLowerCase()}.json`;
  const j = lerJson(p) ?? (m === MARCO_ATUAL ? lerJson("reports/gsc/queries-28d.json") : null);
  const rows = j?.rows ?? j ?? [];
  const mapa = new Map();
  for (const r of Array.isArray(rows) ? rows : []) {
    const q = r.keys?.[0] ?? r.query;
    if (!q) continue;
    mapa.set(q, { impressoes: r.impressions ?? 0, cliques: r.clicks ?? 0, posicao: r.position ?? null, ctr: r.ctr ?? null });
  }
  return mapa;
}
const qAtual = queriesDoMarco(MARCO_ATUAL);
const qBase = queriesDoMarco("D0");
const queries = [];
for (const [q, cur] of qAtual) {
  const ant = qBase.get(q);
  let tipo = "STABLE";
  if (!ant) tipo = "NEW_QUERY";
  else if (cur.impressoes > ant.impressoes * 1.2) tipo = "GROWING_QUERY";
  else if (cur.impressoes < ant.impressoes * 0.8) tipo = "DECLINING_QUERY";
  const pos = cur.posicao;
  const faixa = pos === null ? null : pos <= 20 && pos >= 5 ? "POSITION_5_20" : pos > 20 && pos <= 50 ? "POSITION_20_50" : null;
  const lowCtr = cur.impressoes >= 30 && (cur.ctr ?? 0) < 0.01 ? "HIGH_IMPRESSION_LOW_CTR" : null;
  queries.push({ query: q, ...cur, tipo, faixa, sinal: lowCtr });
}
queries.sort((a, b) => b.impressoes - a.impressoes);

/* ── quick wins (só no D14, no máximo 5) ───────────────────────────────── */
const quickWins =
  MARCO_ATUAL === "D14"
    ? urls
        .filter((u) => bucketDe(u) === "indexed" && u.impressions > 0 && num(u.position) !== null && u.position >= 5 && u.position <= 20)
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 5)
        .map((u) => ({
          url: u.path,
          impressoes: u.impressions,
          cliques: u.clicks,
          posicao: Math.round(u.position * 100) / 100,
          ctr: u.impressions ? Math.round((u.clicks / u.impressions) * 10000) / 100 : 0,
          problema: u.clicks === 0 ? "impressões sem clique — título/description não vencem a SERP" : "posição fora do top 5",
          acao: "OPTIMIZE_EXISTING (backlog — não executar nesta fase)",
        }))
    : [];

/* ── decisões ──────────────────────────────────────────────────────────────
 * A regra vive em scripts/lib/marco-decisao.mjs (função pura, testada com
 * fixtures sintéticas). Aqui só montamos a entrada e traduzimos a saída.
 */
const urlsDoMarco = (m) =>
  (m?.urls ?? []).map((u) => ({
    path: u.path,
    estado: u.estado,
    tier: u.tier,
    cluster: u.cluster,
    impressions: u.impressions ?? 0,
    clicks: u.clicks ?? 0,
    position: typeof u.position === "number" ? u.position : null,
  }));

const serpDiff = lerJson("reports/diff-marcos.json");

function decidir(marcoAlvo, anteriorMarco) {
  if (!marcoAlvo) return { valor: "PENDENTE", justificativa: `Marco ${marcoAlvo?.marco ?? ""} ainda não registrado.`.trim(), severidade: "informativa" };
  const r = decidirMarco({
    d0: D0,
    anterior: anteriorMarco,
    atual: marcoAlvo,
    urls: urlsDoMarco(marcoAlvo),
    serpDiff,
  });
  return {
    valor: marcoAlvo.marco === "D7" ? (r.decisao === "A" ? "WAIT" : r.decisao === "C" ? "INVESTIGATE" : r.decisao === "D" ? "REGRESSION" : "QUICK_WINS") : r.decisao,
    decisao: r.decisao,
    rotulo: r.rotulo,
    severidade: r.severidade,
    alerta: r.alerta,
    justificativa: r.justificativa,
    regressoes: r.regressoes,
    sinais: r.sinais,
  };
}
const decisaoD7 = () => decidir(D7, D0);
const decisaoD14 = () => decidir(D14, D7 ?? D0);


/* ── payload + markdown ────────────────────────────────────────────────── */
const analise = {
  geradoEm: new Date().toISOString(),
  marcoAtual: MARCO_ATUAL,
  funil: { D0: funil(D0), D7: funil(D7), D14: funil(D14) },
  deltas: { "D0→D7": deltas(funil(D0), funil(D7)), "D7→D14": deltas(funil(D7), funil(D14)), "D0→D14": deltas(funil(D0), funil(D14)) },
  // Janelas móveis de 28d se sobrepõem entre marcos: o relatório mostra o
  // overlap em vez de tratar os períodos como independentes.
  janelasSearchPerformance: {
    "D0→D7": janelasSearchPerformance(D0, D7),
    "D7→D14": janelasSearchPerformance(D7, D14),
    "D0→D14": janelasSearchPerformance(D0, D14),
  },
  integridade: {
    D0: D0?.integridade ?? null,
    D7: D7?.integridade ?? null,
    D14: D14?.integridade ?? null,
  },
  tierA: { D0: tierA(D0), D7: tierA(D7), D14: tierA(D14) },
  clusters,
  tierANaoIndexadas,
  crawledNotIndexed: crawledNotIndexed.map((u) => ({ url: u.path, cluster: u.cluster, tier: u.tier, impressoes: u.impressions ?? 0 })),
  consolidadas: consolidacao ? { total: consolidacao.total ?? 40, ok: consolidacao.pass ?? null, falhas: consolidacao.falhas?.length ?? consolidacao.falhas ?? 0 } : null,
  queries: queries.slice(0, 50),
  quickWins,
  bing: bing ?? null,
  indexnow: indexnow ? { executadoEm: indexnow.executadoEm, eligible: indexnow.eligible, submitted: indexnow.submitted, accepted: indexnow.accepted, failed: indexnow.failed } : null,
  alertas: alertas ? { assinatura: alertas.assinatura ?? null, disparadosEm: alertas.atualizadoEm ?? null, ativos: alertas.alertas?.length ?? 0 } : null,
  decisaoD7: decisaoD7(),
  decisaoD14: decisaoD14(),
};

mkdirSync("public", { recursive: true });
mkdirSync("docs", { recursive: true });
writeFileSync("public/monitoramento-analise.json", `${JSON.stringify(analise, null, 2)}\n`);

const linhaFunil = (rot, f) =>
  f
    ? `${rot}: unknown ${f.unknown} · discovered ${f.discovered} · crawled-not-indexed ${f.crawled_not_indexed} · indexed ${f.indexed}`
    : `${rot}: ${NA} — marco não registrado`;

const md = [
  "# Monitoramento D7 / D14 — tecnico.curitiba.br",
  "",
  `Gerado em ${analise.geradoEm} · marco de referência **${MARCO_ATUAL}**.`,
  "Relatório de medição: nenhuma alteração de conteúdo, sitemap, canonical, redirect ou IndexNow foi feita para produzi-lo.",
  "",
  "## FUNIL",
  "",
  linhaFunil("D0", funil(D0)),
  linhaFunil("D7", funil(D7)),
  linhaFunil("D14", funil(D14)),
  "",
  "## TIER A",
  "",
  `D0: ${fmt(tierA(D0)?.taxaIndexacao)}% (${fmt(tierA(D0)?.indexadas)}/${fmt(tierA(D0)?.total)})`,
  `D7: ${fmt(tierA(D7)?.taxaIndexacao)}%`,
  `D14: ${fmt(tierA(D14)?.taxaIndexacao)}%`,
  "",
  "## SEARCH PERFORMANCE",
  "",
  ...(() => {
    const linhas = [];
    for (const [rot, j] of Object.entries(analise.janelasSearchPerformance)) {
      if (!j) { linhas.push(`${rot}: ${NA} — marco não registrado.`); continue; }
      linhas.push(
        `${rot}: janela A ${j.a.inicio} → ${j.a.fim} · janela B ${j.b.inicio} → ${j.b.fim} · overlap ${j.overlapDias}d (${j.overlapPct}%) · período exclusivo ${j.naoSobreposto.dias}d.`,
      );
    }
    return linhas.length ? [...linhas, ""] : [];
  })(),
  `D0 baseline: ${fmt(funil(D0)?.impressoes)} impressões / ${fmt(funil(D0)?.cliques)} cliques em 28d`,
  `D7: ${D7 ? `${funil(D7).impressoes} impressões / ${funil(D7).cliques} cliques` : NA}`,
  `D14: ${D14 ? `${funil(D14).impressoes} impressões / ${funil(D14).cliques} cliques` : NA}`,
  "",
  "## CLUSTERS",
  "",
  "| Cluster | Total | Indexed | Unknown | Discovered | Crawled-not-indexed | Indexation % | Impressions | Clicks |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...clusters.map(
    (c) =>
      `| ${c.chave} | ${c.total} | ${c.indexadas} | ${c.unknown} | ${c.discovered} | ${c.crawledNaoIndexadas} | ${fmt(c.taxaIndexacao)}% | ${c.impressoes} | ${c.cliques} |`,
  ),
  "",
  "## MOVIMENTAÇÕES",
  "",
  ...ESTADOS.map((e) => {
    const d = analise.deltas["D0→D14"] ?? analise.deltas["D0→D7"];
    return `${e}: Δ ${d?.[e] ? `${d[e].abs > 0 ? "+" : ""}${d[e].abs}` : NA}`;
  }),
  "",
  "## CRAWLED NOT INDEXED",
  "",
  crawledNotIndexed.length
    ? crawledNotIndexed.map((u) => `- ${u.path} (${u.cluster}, tier ${u.tier}, ${u.impressions ?? 0} impressões)`).join("\n")
    : "Nenhuma URL curada neste estado — sinal positivo registrado.",
  "",
  "## TIER A NÃO INDEXADAS",
  "",
  "| URL | Cluster | Estado | Último crawl | Inbound | Prof. | Quality | Impr. | Decisão |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...tierANaoIndexadas.map(
    (t) =>
      `| ${t.url} | ${t.cluster} | ${t.estadoAtual} | ${t.ultimoCrawl} | ${fmt(t.inbound)} | ${fmt(t.profundidade)} | ${fmt(t.qualityScore)} | ${t.impressoes} | ${t.decisao} |`,
  ),
  "",
  "## CONSOLIDADAS",
  "",
  analise.consolidadas
    ? `${fmt(analise.consolidadas.ok)}/${fmt(analise.consolidadas.total)} redirects 301 corretos · ${fmt(analise.consolidadas.falhas)} falha(s).`
    : `${NA} — evidência de consolidação ausente nesta execução.`,
  "",
  "## GOOGLE OPPORTUNITIES",
  "",
  quickWins.length
    ? quickWins.map((q) => `- ${q.url} — ${q.impressoes} impr. / ${q.cliques} cliques / pos ${q.posicao} / CTR ${q.ctr}% → ${q.problema}`).join("\n")
    : "Nenhuma no marco atual (quick wins só são abertos no D14).",
  "",
  "## BING",
  "",
  bing ? `known ${fmt(bing.known)} · indexed ${fmt(bing.indexed)} · sitemap ${fmt(bing.sitemapStatus)}` : `Known: ${NA} · Indexed: ${NA} — sem acesso ao Bing Webmaster Tools.`,
  "",
  "## ALERTAS",
  "",
  analise.alertas ? `Ativos: ${analise.alertas.ativos} · última assinatura ${fmt(analise.alertas.disparadosEm)}` : `${NA} — nenhum estado de alerta registrado.`,
  "",
  "## DECISÃO D7",
  "",
  `**${analise.decisaoD7.valor}** — ${analise.decisaoD7.justificativa}`,
  "",
  "## DECISÃO D14",
  "",
  `**${analise.decisaoD14.valor}** — ${analise.decisaoD14.justificativa}`,
  "",
].join("\n");

writeFileSync("docs/relatorio-monitoramento-d7-d14.md", `${md}\n`);
console.log(
  `[analise ${MARCO_ATUAL}] tierA-nao-indexadas=${tierANaoIndexadas.length} crawled-not-indexed=${crawledNotIndexed.length} decisaoD7=${analise.decisaoD7.valor} decisaoD14=${analise.decisaoD14.valor}`,
);
console.log("  → docs/relatorio-monitoramento-d7-d14.md · public/monitoramento-analise.json");
