#!/usr/bin/env node
/**
 * FASE 4 — Diagnóstico: cruza indexação real (URL Inspection) com desempenho
 * (Search Analytics) e hipóteses externas (AnswerThePublic).
 * Não altera o site. Só gera artefatos de governança em reports/.
 */
import { readFileSync, writeFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const BASE = "https://tecnico.curitiba.br";

const cov = read("reports/gsc/index-coverage.json");
const pages = read("reports/gsc/pages-90d.json").rows;
const queries = read("reports/gsc/queries-90d.json").rows;
const pq = read("reports/gsc/page-query-90d.json").rows;
const janela = read("reports/gsc/pages-90d.json").janela;
const sitemaps = read("reports/gsc/sitemaps.json").sitemap ?? [];

const norm = (u) => {
  try {
    const x = new URL(u);
    return x.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return u;
  }
};

// ---------- FASE 4: clusters (arquitetura real do projeto) ----------
function cluster(p) {
  if (p === "/") return "HOME";
  if (/^\/servicos\/[^/]+\/[^/]+$/.test(p)) return "SERVICO x BAIRRO";
  if (p.startsWith("/servicos")) return "SERVICO";
  if (p.startsWith("/problemas")) return "PROBLEMA";
  if (p.startsWith("/bairros")) return "BAIRRO";
  if (/^\/tecnico-informatica-/.test(p) || p.startsWith("/arrumar-pc")) return "CIDADE";
  if (p === "/blog") return "BLOG INDEX";
  if (p.startsWith("/blog/")) return "ARTIGO";
  if (p.startsWith("/empresa") || p.includes("empresarial") || p.startsWith("/servicos-empresariais")) return "EMPRESAS / B2B";
  if (p.startsWith("/precos")) return "PRECOS";
  if (p.startsWith("/areas-atendidas")) return "AREAS ATENDIDAS";
  if (p.startsWith("/anuncie") || p.startsWith("/publicidade") || p.startsWith("/patrocin")) return "ANUNCIE";
  return "OUTRO";
}

// ---------- desempenho por path ----------
const perf = new Map();
for (const r of pages) {
  const p = norm(r.keys[0]);
  perf.set(p, { clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position });
}

const urls = cov.results.map((r) => ({
  path: r.path,
  cluster: cluster(r.path),
  indexada: r.indexed,
  estado: r.coverageState,
  ultimoRastreio: r.lastCrawlTime,
  canonicalGoogle: r.googleCanonical,
  profundidade: r.path === "/" ? 0 : r.path.split("/").filter(Boolean).length,
  ...(perf.get(r.path) ?? { clicks: 0, impressions: 0, ctr: 0, position: null }),
}));

// URLs com desempenho fora do sitemap curado
const curadas = new Set(urls.map((u) => u.path));
const foraDoSitemap = pages
  .map((r) => ({ path: norm(r.keys[0]), clicks: r.clicks, impressions: r.impressions, position: r.position }))
  .filter((r) => !curadas.has(r.path));

// ---------- FASE 5/6: agregados ----------
const totals = {
  urlsCuradas: urls.length,
  indexadas: urls.filter((u) => u.indexada).length,
  naoIndexadas: urls.filter((u) => !u.indexada).length,
  impressions: pages.reduce((a, r) => a + r.impressions, 0),
  clicks: pages.reduce((a, r) => a + r.clicks, 0),
};
totals.taxaIndexacao = Number(((totals.indexadas / totals.urlsCuradas) * 100).toFixed(1));

const motivos = {};
for (const u of urls) motivos[u.estado] = (motivos[u.estado] ?? 0) + 1;

const porCluster = {};
for (const u of urls) {
  const c = (porCluster[u.cluster] ??= { total: 0, indexadas: 0, impressions: 0, clicks: 0, posSoma: 0, posPeso: 0 });
  c.total++;
  if (u.indexada) c.indexadas++;
  c.impressions += u.impressions;
  c.clicks += u.clicks;
  if (u.position != null) {
    c.posSoma += u.position * Math.max(1, u.impressions);
    c.posPeso += Math.max(1, u.impressions);
  }
}
const clustersTab = Object.entries(porCluster)
  .map(([nome, c]) => ({
    cluster: nome,
    total: c.total,
    indexadas: c.indexadas,
    pct: Number(((c.indexadas / c.total) * 100).toFixed(1)),
    impressions: c.impressions,
    clicks: c.clicks,
    posicaoMedia: c.posPeso ? Number((c.posSoma / c.posPeso).toFixed(1)) : null,
  }))
  .sort((a, b) => b.impressions - a.impressions || b.total - a.total);

// ---------- FASE 7: sinais internos (proxy: profundidade) ----------
const media = (arr) => (arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : null);
const sinais = {
  profundidadeMediaIndexadas: media(urls.filter((u) => u.indexada).map((u) => u.profundidade)),
  profundidadeMediaNaoIndexadas: media(urls.filter((u) => !u.indexada).map((u) => u.profundidade)),
  observacao:
    "Grafo interno completo exige build prerenderizado; nesta execução usou-se profundidade de URL como proxy. Gate audit:internal-graph estava verde na fase anterior (órfãs=0).",
};

// ---------- FASE 8: classes de desempenho por página ----------
const classePagina = (u) => {
  if (!u.indexada) return "E";
  if (!u.impressions) return "D";
  if (u.position != null && u.position <= 10 && u.impressions >= 10) return "A";
  if (u.position != null && u.position > 3 && u.position <= 20) return "B";
  if (u.position != null && u.position > 20 && u.position <= 50) return "C";
  return "D";
};
for (const u of urls) u.classe = classePagina(u);

// ---------- FASE 9/10: queries e canibalização ----------
const queryRows = queries.map((r) => ({
  query: r.keys[0],
  clicks: r.clicks,
  impressions: r.impressions,
  ctr: Number((r.ctr * 100).toFixed(2)),
  position: Number(r.position.toFixed(1)),
}));

const porQuery = new Map();
for (const r of pq) {
  const [page, query] = r.keys;
  const acc = porQuery.get(query) ?? [];
  acc.push({ path: norm(page), clicks: r.clicks, impressions: r.impressions, position: Number(r.position.toFixed(1)) });
  porQuery.set(query, acc);
}
const canibalizacao = [...porQuery.entries()]
  .filter(([, ps]) => ps.filter((p) => p.impressions >= 2).length >= 2)
  .map(([query, ps]) => ({
    query,
    urls: ps.sort((a, b) => b.impressions - a.impressions),
    clustersEnvolvidos: [...new Set(ps.map((p) => cluster(p.path)))],
    veredito:
      new Set(ps.map((p) => cluster(p.path))).size === 1 ? "CANIBALIZACAO REAL (mesmo cluster)" : "COBERTURA DE INTENCOES RELACIONADAS",
  }));

// ---------- FASE 13: opportunity score ----------
const maxImp = Math.max(1, ...queryRows.map((q) => q.impressions));
const COMERCIAL = /(curitiba|assist|conserto|manuten|t[eé]cnico|suporte|formata|recupera|upgrade|empresa|pre[cç]o)/i;
const SERVICO_REAL = /(notebook|computador|pc|tv|monitor|placa|hd|ssd|dados|wifi|wi-fi|rede|nobreak|servidor|v[ií]rus|informatica|inform[áa]tica|ti)/i;
const ATP = {
  "assistência técnica notebook curitiba": 337,
  "notebook desligando sozinho": 3000,
  "notebook superaquecendo": 203,
  "pasta térmica notebook": 1100,
  "trocar hd por ssd": 452,
  "ssd vale a pena": 118,
  "upgrade ssd notebook": 31,
  "empresa de ti curitiba": 580,
  "formatação windows 11": 63,
  "quando formatar o pc": 50,
  "recuperação de dados curitiba": 60,
  "recuperar arquivos hd com defeito": 8,
  "wi-fi lento em casa como resolver": null,
  "wifi caindo toda hora": null,
  "computador com vírus sintomas": null,
  "técnico a domicílio curitiba": null,
};

const oportunidades = queryRows.map((q) => {
  const alvo = (porQuery.get(q.query) ?? []).sort((a, b) => b.impressions - a.impressions)[0] ?? null;
  const url = alvo?.path ?? null;
  const urlInfo = url ? urls.find((u) => u.path === url) : null;
  const canib = canibalizacao.find((c) => c.query === q.query);

  let score = 0;
  score += 30 * (Math.log10(q.impressions + 1) / Math.log10(maxImp + 1)); // impressões
  score += q.position <= 3 ? 4 : q.position <= 10 ? 20 : q.position <= 20 ? 16 : q.position <= 40 ? 9 : 3; // posição
  score += COMERCIAL.test(q.query) ? 20 : 8; // valor comercial
  score += SERVICO_REAL.test(q.query) ? 15 : 4; // aderência a serviço real
  const externo = Object.entries(ATP).find(([k]) => k.split(" ").every((w) => q.query.includes(w.replace(/[áéíóúç]/g, (c) => c))));
  score += externo?.[1] ? 10 : 0;
  score += url && urlInfo?.indexada ? 5 : 0; // melhoria sem nova URL
  if (canib?.veredito.startsWith("CANIBAL")) score -= 12;
  if (!url) score -= 5;
  score = Math.max(0, Math.min(100, Math.round(score)));

  let acao = "INVESTIGATE";
  if (url && urlInfo?.indexada && q.position >= 5 && q.position <= 20) acao = "OPTIMIZE_EXISTING";
  else if (url && urlInfo?.indexada && q.position > 20) acao = "OPTIMIZE_EXISTING";
  else if (url && urlInfo && !urlInfo.indexada) acao = "INVESTIGATE";
  else if (!url) acao = "INVESTIGATE";
  if (canib?.veredito.startsWith("CANIBAL")) acao = "MERGE_INTENT";
  if (q.impressions <= 1 && q.position > 40) acao = "NO_ACTION";

  return {
    keyword: q.query,
    cluster: url ? cluster(url) : "SEM URL MAPEADA",
    intencao: /^(como|o que|quando|por que|note não liga|notebook nao liga)/i.test(q.query) || /(como|sintomas|vale a pena)/i.test(q.query) ? "INFORMACIONAL" : "COMERCIAL",
    volumeExterno: externo?.[1] ?? null,
    impressions: q.impressions,
    clicks: q.clicks,
    ctr: q.ctr,
    position: q.position,
    urlAtual: url ? `${BASE}${url}` : null,
    indexada: urlInfo?.indexada ?? null,
    riscoCanibalizacao: canib?.veredito ?? "nenhum",
    score,
    acao,
  };
});
oportunidades.sort((a, b) => b.score - a.score);

// ---------- FASE 14/15/16 ----------
const quickWins = oportunidades.filter((o) => o.position >= 5 && o.position <= 20 && o.impressions >= 2).slice(0, 12);
const posBuckets = new Map();
for (const o of oportunidades) {
  const b = Math.min(5, Math.floor(o.position / 10));
  const acc = posBuckets.get(b) ?? [];
  acc.push(o.ctr);
  posBuckets.set(b, acc);
}
const ctrOportunidade = oportunidades
  .filter((o) => o.impressions >= 3 && o.position <= 20)
  .map((o) => {
    const pares = posBuckets.get(Math.min(5, Math.floor(o.position / 10))) ?? [];
    const medio = pares.reduce((a, b) => a + b, 0) / Math.max(1, pares.length);
    return { ...o, ctrMedioFaixa: Number(medio.toFixed(2)) };
  })
  .filter((o) => o.ctr <= o.ctrMedioFaixa)
  .slice(0, 15);
const zeroCliques = oportunidades
  .filter((o) => o.clicks === 0 && o.impressions >= 3)
  .map((o) => ({ ...o, faixa: o.position <= 10 ? "alta" : o.position <= 30 ? "media" : "baixa" }));

// ---------- FASE 25: backlog ----------
const backlog = {
  P0_QUICK_WINS: quickWins.map((q) => ({ keyword: q.keyword, url: q.urlAtual, impressions: q.impressions, position: q.position, score: q.score })),
  P1_IMPORTANT_OPTIMIZATION: oportunidades
    .filter((o) => o.acao === "OPTIMIZE_EXISTING" && o.position > 20 && o.impressions >= 3)
    .map((o) => ({ keyword: o.keyword, url: o.urlAtual, impressions: o.impressions, position: o.position, score: o.score })),
  P2_FUTURE_CONTENT_GAP: [],
  P3_DO_NOT_PURSUE: oportunidades.filter((o) => o.acao === "NO_ACTION").map((o) => o.keyword),
};

// ---------- FASE 26: indexação prioritária ----------
const indexacaoPrioritaria = urls
  .filter((u) => !u.indexada && u.estado !== "Excluded by ‘noindex’ tag")
  .map((u) => {
    const imp = u.impressions;
    const prioridade =
      ["HOME", "SERVICO", "EMPRESAS / B2B", "PRECOS", "PROBLEMA"].includes(u.cluster) && u.profundidade <= 2 ? "alta" : imp > 0 ? "media" : "baixa";
    return { url: `${BASE}${u.path}`, cluster: u.cluster, motivo: u.estado, prioridade, evidencia: `impressões 90d: ${imp}` };
  })
  .filter((u) => u.prioridade !== "baixa")
  .slice(0, 40);

const noindexNoSitemap = urls.filter((u) => u.estado === "Excluded by ‘noindex’ tag").map((u) => u.path);

// ---------- artefatos ----------
const payload = {
  geradoEm: new Date().toISOString(),
  propriedade: cov.site,
  janela,
  totals,
  motivosIndexacao: motivos,
  clusters: clustersTab,
  sinaisInternos: sinais,
  oportunidades,
  quickWins,
  ctrOportunidade,
  zeroCliques,
  canibalizacao,
  backlog,
  indexacaoPrioritaria,
  noindexNoSitemap,
  foraDoSitemapComDesempenho: foraDoSitemap,
};
writeFileSync("reports/gsc-opportunities.json", `${JSON.stringify(payload, null, 2)}\n`);

writeFileSync(
  "reports/keyword-intent-map.json",
  `${JSON.stringify(
    {
      geradoEm: payload.geradoEm,
      fonte: "Google Search Console (evidência) + AnswerThePublic (hipótese externa)",
      janela,
      keywords: oportunidades.map((o) => ({
        keyword: o.keyword,
        cluster: o.cluster,
        intencao: o.intencao,
        volumeExterno: o.volumeExterno,
        gsc: { impressions: o.impressions, clicks: o.clicks, ctr: o.ctr, position: o.position },
        urlAtual: o.urlAtual,
        indexada: o.indexada,
        riscoCanibalizacao: o.riscoCanibalizacao,
        score: o.score,
        acao: o.acao,
      })),
    },
    null,
    2,
  )}\n`,
);

const tab = (h, rows) => [`| ${h.join(" | ")} |`, `| ${h.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");

writeFileSync(
  "reports/gsc-clusters.md",
  [
    "# Clusters — indexação e desempenho (evidência GSC)",
    "",
    `Propriedade: \`${cov.site}\` · Janela: ${janela.startDate} → ${janela.endDate} · Gerado em ${payload.geradoEm}`,
    "",
    tab(
      ["Cluster", "URLs", "Indexadas", "%", "Impressions", "Clicks", "Posição média"],
      clustersTab.map((c) => [c.cluster, c.total, c.indexadas, `${c.pct}%`, c.impressions, c.clicks, c.posicaoMedia ?? "—"]),
    ),
    "",
    "## Motivos de não indexação (URL Inspection, leitura)",
    "",
    tab(["Estado", "URLs"], Object.entries(motivos).map(([k, v]) => [k, v])),
    "",
    "## URLs com desempenho fora do sitemap curado",
    "",
    foraDoSitemap.length
      ? tab(["URL", "Clicks", "Impressions", "Posição"], foraDoSitemap.map((f) => [f.path, f.clicks, f.impressions, f.position.toFixed(1)]))
      : "Nenhuma.",
    "",
    "## Sitemaps registrados no Search Console",
    "",
    tab(
      ["Sitemap", "Última leitura", "Enviadas", "Indexadas (contagem GSC)", "Erros", "Avisos"],
      sitemaps.map((s) => [
        s.path.replace(BASE, ""),
        s.lastDownloaded ?? "—",
        (s.contents ?? []).reduce((a, c) => a + Number(c.submitted ?? 0), 0),
        (s.contents ?? []).reduce((a, c) => a + Number(c.indexed ?? 0), 0),
        s.errors ?? 0,
        s.warnings ?? 0,
      ]),
    ),
  ].join("\n") + "\n",
);

writeFileSync(
  "reports/gsc-baseline.md",
  [
    "# Baseline Search Console — Fase 4 (medição, sem alterações no site)",
    "",
    `Propriedade: \`${cov.site}\` · Janela: **${janela.startDate} → ${janela.endDate}** · Gerado em ${payload.geradoEm}`,
    "",
    "## Desempenho",
    "",
    tab(
      ["Clicks", "Impressions", "CTR", "Posição média"],
      [[totals.clicks, totals.impressions, `${((totals.clicks / Math.max(1, totals.impressions)) * 100).toFixed(2)}%`, (queryRows.reduce((a, q) => a + q.position * q.impressions, 0) / Math.max(1, queryRows.reduce((a, q) => a + q.impressions, 0))).toFixed(1)]],
    ),
    "",
    "## Indexação (URL Inspection nas 170 URLs curadas)",
    "",
    tab(
      ["URLs no sitemap curado", "Indexadas", "Não indexadas", "Taxa"],
      [[totals.urlsCuradas, totals.indexadas, totals.naoIndexadas, `${totals.taxaIndexacao}%`]],
    ),
    "",
    tab(["Estado reportado pelo Google", "URLs"], Object.entries(motivos).map(([k, v]) => [k, v])),
    "",
    "## Top 20 queries por impressões",
    "",
    tab(
      ["Query", "Impr.", "Clicks", "CTR", "Posição"],
      [...queryRows].sort((a, b) => b.impressions - a.impressions).slice(0, 20).map((q) => [q.query, q.impressions, q.clicks, `${q.ctr}%`, q.position]),
    ),
    "",
    "## Top 10 quick wins (posição 5–20 com impressões)",
    "",
    quickWins.length
      ? tab(
          ["Query", "URL", "Impr.", "Clicks", "CTR", "Posição", "Score"],
          quickWins.slice(0, 10).map((q) => [q.keyword, q.urlAtual ?? "—", q.impressions, q.clicks, `${q.ctr}%`, q.position, q.score]),
        )
      : "Nenhum caso com massa crítica.",
    "",
    "## Páginas com impressões e zero cliques (≥3 impressões)",
    "",
    zeroCliques.length
      ? tab(["Query", "URL", "Impr.", "Posição", "Faixa"], zeroCliques.slice(0, 20).map((z) => [z.keyword, z.urlAtual ?? "—", z.impressions, z.position, z.faixa]))
      : "Nenhuma.",
    "",
    "## Canibalização",
    "",
    canibalizacao.length
      ? tab(["Query", "URLs", "Veredito"], canibalizacao.map((c) => [c.query, c.urls.map((u) => `${u.path} (${u.impressions})`).join("<br>"), c.veredito]))
      : "Nenhum caso com ≥2 URLs e impressões significativas na mesma query.",
    "",
    "## Sinais internos vs indexação (proxy)",
    "",
    `- Profundidade média das indexadas: ${sinais.profundidadeMediaIndexadas}`,
    `- Profundidade média das não indexadas: ${sinais.profundidadeMediaNaoIndexadas}`,
    `- ${sinais.observacao}`,
    "",
    "## Alertas factuais",
    "",
    noindexNoSitemap.length ? `- URLs no sitemap curado que o Google lê como \`noindex\`: ${noindexNoSitemap.join(", ")}` : "- Nenhuma URL do sitemap com noindex.",
    `- URLs desconhecidas do Google (nunca descobertas): ${motivos["URL is unknown to Google"] ?? 0}`,
    `- URLs descobertas e não indexadas: ${motivos["Discovered - currently not indexed"] ?? 0}`,
    `- URLs rastreadas e rejeitadas (\"Crawled - currently not indexed\"): ${motivos["Crawled - currently not indexed"] ?? 0}`,
  ].join("\n") + "\n",
);

console.log(
  `Relatórios gerados · indexação ${totals.taxaIndexacao}% (${totals.indexadas}/${totals.urlsCuradas}) · ` +
    `${totals.impressions} impressões · ${totals.clicks} cliques · ${quickWins.length} quick win(s) · ${canibalizacao.length} caso(s) de canibalização`,
);
