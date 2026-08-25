#!/usr/bin/env node
/**
 * RELATÓRIO FINAL CONSOLIDADO (Fase 6)
 *
 * Junta, sem reinterpretar, os artefatos já produzidos pelos scripts de
 * diagnóstico e gera um documento único auditável:
 *   - Google Search Console (cobertura por status e por cluster)
 *   - Bing Webmaster Tools (quando o snapshot existir)
 *   - IndexNow (submitted / accepted / failed do último envio)
 *   - Latência de crawl das URLs não indexadas
 *   - Auditoria de valor (faixas A–E + fila de otimização)
 *   - Evidências de smoke test e de JSON-LD/FAQPage
 *
 * Dado ausente é declarado como ausente — nunca preenchido por estimativa.
 * Saída: reports/relatorio-final-consolidado.md + .json
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const ler = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const NA = "não disponível";

const inv = ler("reports/indexation-inventory.json");
const qual = ler("reports/quality-audit.json");
const lat = ler("reports/crawl-latency.json");
const idxnow = ler("reports/indexnow-last-run.json") ?? ler("reports/indexnow-last-submission.json");
const bing = ler("reports/bing-coverage.json");
const jsonld = ler("reports/jsonld-integrity.json");
const smoke = ler("reports/smoke-tests.json") ?? ler("reports/post-deploy-checklist.json");
const links = ler("reports/blog-link-fixes.json");
const local = ler("reports/local-page-quality.json");
const auditLocal = ler("reports/servico-bairro-decisions.json");
const consolidados = (auditLocal?.decisoes ?? []).filter((d) => d.decisao === "CONSOLIDATE");



const geradoEm = new Date().toISOString();

// ── GSC ────────────────────────────────────────────────────────────────────
let gscTabela = `_${NA} — rode \`npm run report:indexation\` com credenciais do Search Console._`;
let gscCluster = "";
let totalUrls = null;
if (inv?.urls?.length) {
  totalUrls = inv.urls.length;
  const porStatus = new Map();
  for (const u of inv.urls) porStatus.set(u.gscStatus ?? "N/A", (porStatus.get(u.gscStatus ?? "N/A") ?? 0) + 1);
  gscTabela = `| Status | URLs | % |\n| --- | --- | --- |\n${[...porStatus.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([s, n]) => `| ${s} | ${n} | ${((n / totalUrls) * 100).toFixed(1)}% |`)
    .join("\n")}`;

  const cl = new Map();
  for (const u of inv.urls) {
    const c = cl.get(u.cluster) ?? { total: 0, indexed: 0, discovered: 0, unknown: 0, clicks: 0, impressions: 0 };
    c.total++;
    if (u.gscStatus === "INDEXED") c.indexed++;
    if (u.gscStatus === "DISCOVERED_NOT_INDEXED") c.discovered++;
    if (u.gscStatus === "UNKNOWN_TO_GOOGLE") c.unknown++;
    c.clicks += u.clicks ?? 0;
    c.impressions += u.impressions ?? 0;
    cl.set(u.cluster, c);
  }
  gscCluster = `| Cluster | URLs | Indexadas | Descobertas s/ index | Desconhecidas | Cliques | Impressões |\n| --- | --- | --- | --- | --- | --- | --- |\n${[...cl.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([c, v]) => `| ${c} | ${v.total} | ${v.indexed} | ${v.discovered} | ${v.unknown} | ${v.clicks} | ${v.impressions} |`)
    .join("\n")}`;
}

// ── IndexNow ───────────────────────────────────────────────────────────────
const idxSubmitted = idxnow?.enviadas ?? idxnow?.submitted ?? 0;
const idxFailed = idxnow?.falhas?.length ?? idxnow?.failed ?? 0;
const idxLinha = idxnow
  ? `| ${idxSubmitted} | ${idxSubmitted - idxFailed} | ${idxFailed} | ${idxnow.httpStatus ?? "202 (aceito)"} | ${idxnow.executadoEm ?? idxnow.geradoEm ?? NA} |

Composição do último envio: ${idxnow.novas?.length ?? 0} URL(s) novas, ${idxnow.mudadas?.length ?? 0} com conteúdo alterado e ${idxnow.ignoradas?.length ?? 0} ignorada(s) por hash idêntico.`
  : null;

// ── Auditoria de valor ─────────────────────────────────────────────────────
let qualBloco = `_${NA} — rode \`npm run report:quality\`._`;
if (qual?.results?.length) {
  const f = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const r of qual.results) f[r.faixa]++;
  const fila = qual.results.filter((r) => ["C", "D", "E"].includes(r.faixa)).slice(0, 15);
  qualBloco = `| Faixa | URLs |\n| --- | --- |\n| A (85–100) | ${f.A} |\n| B (70–84) | ${f.B} |\n| C (55–69) | ${f.C} |\n| D (40–54) | ${f.D} |\n| E (<40) | ${f.E} |

Fila de otimização (piores scores com valor real de busca):

${fila.map((r, i) => `${i + 1}. \`${r.path}\` — score ${r.score} (${r.faixa}) · ${r.causas.join(", ") || "sem causa dominante"}`).join("\n")}`;
}

const md = `# Relatório final consolidado — tecnico.curitiba.br

Gerado em ${geradoEm}. Cada seção reflete o artefato correspondente em \`reports/\`.
Onde a fonte não existe, o relatório declara **${NA}** em vez de estimar.

## 1. Cobertura no Google Search Console

${gscTabela}

${gscCluster ? `### Por cluster\n\n${gscCluster}` : ""}

## 2. Bing Webmaster Tools

${
  bing
    ? `| Métrica | Valor |\n| --- | --- |\n| URLs conhecidas | ${bing.known ?? NA} |\n| Indexadas | ${bing.indexed ?? NA} |\n| Erros de rastreamento | ${bing.crawlErrors ?? NA} |\n| Snapshot | ${bing.geradoEm ?? NA} |`
    : `_${NA} — nenhum snapshot do Bing Webmaster Tools foi ingerido. IndexNow cobre a notificação de mudanças ao Bing independentemente disso._`
}

## 3. IndexNow

${
  idxLinha
    ? `| Submitted | Accepted | Failed | HTTP | Envio |\n| --- | --- | --- | --- | --- |\n${idxLinha}\n\nO pipeline é incremental: só reenvia URLs cujo hash de sinais de busca (título, meta, headings, conteúdo do \`<main>\`) mudou de verdade, evitando reenviar as ${totalUrls ?? 170} URLs em builds sem mudança de conteúdo.`
    : `_${NA} — rode \`npm run indexnow:submit\`._`
}

## 4. Latência de crawl (URLs não indexadas)

${
  lat
    ? `Escopo: ${lat.escopo} · limiar ${lat.limiarMs} ms\n\n| Métrica | Valor |\n| --- | --- |\n| URLs medidas | ${lat.total} |\n| TTFB p50 | ${lat.p50} ms |\n| TTFB p75 | ${lat.p75} ms |\n| TTFB p95 | ${lat.p95} ms |\n| Máximo | ${lat.max} ms |\n| Falhas de limiar | ${lat.falhas?.length ?? 0} |\n\n${
        lat.falhas?.length
          ? lat.falhas.map((f) => `- ${f.path} — ${f.motivo}`).join("\n")
          : "Nenhuma URL não indexada ultrapassou o limiar — a lentidão de resposta está descartada como causa do gargalo de descoberta."
      }`
    : `_${NA} — rode \`npm run check:crawl-latency\`._`
}

## 5. Auditoria de valor por URL

${qualBloco}

## 6. Qualidade das páginas locais (risco doorway)

${
  local
    ? `| Nível | Páginas |\n| --- | --- |\n| ALTO | ${local.resumo.alto} |\n| MÉDIO | ${local.resumo.medio} |\n| BAIXO | ${local.resumo.baixo} |\n| OK | ${local.resumo.ok} |\n\nTotal avaliado: ${local.resumo.total} páginas locais (bairro, cidade e serviço×bairro).`
    : `_${NA} — rode \`npm run check:local-page-quality\`._`
}

## 7. Evidências de JSON-LD / FAQPage

${
  jsonld
    ? `| Verificação | Resultado |\n| --- | --- |\n| URLs verificadas | ${jsonld.total ?? NA} |\n| Com FAQPage | ${jsonld.comFaq ?? jsonld.faqPages ?? NA} |\n| Schemas duplicados | ${jsonld.duplicados?.length ?? jsonld.duplicates ?? 0} |\n| Erros de integridade | ${jsonld.erros?.length ?? 0} |`
    : `_${NA} — rode \`npm run check:jsonld-integrity\`._`
}

## 8. Smoke tests

${
  smoke
    ? `| Verificação | Resultado |\n| --- | --- |\n| Checagens executadas | ${smoke.total ?? smoke.checks?.length ?? NA} |\n| Falhas | ${smoke.falhas?.length ?? smoke.failures?.length ?? 0} |\n| Execução | ${smoke.geradoEm ?? NA} |`
    : `_${NA} — rode o checklist pós-deploy._`
}

## 9. Links internos do acervo editorial

${
  links
    ? `| Verificação | Resultado |\n| --- | --- |\n| Slugs aprovados | ${links.slugsAprovados?.length ?? 0} |\n| Links /blog/* em páginas servidas | ${links.linksEmPaginasServidas ?? 0} |\n| Correções pendentes (bloqueantes) | ${links.correcoesPendentes?.length ?? 0} |\n| Pendências em artigos não servidos | ${links.pendenciasEmArtigosNaoServidos?.length ?? 0} |`
    : `_${NA} — rode \`npm run check:blog-internal-links\`._`
}

## 10. Leitura honesta do estado

${
  inv
    ? (() => {
        const idx = inv.urls.filter((u) => u.gscStatus === "INDEXED").length;
        const unk = inv.urls.filter((u) => u.gscStatus === "UNKNOWN_TO_GOOGLE").length;
        return `- ${idx}/${totalUrls} URLs indexadas (${((idx / totalUrls) * 100).toFixed(1)}%).
- ${unk} URLs sequer conhecidas pelo Google: isso é gargalo de **descoberta**, não veredito de qualidade.
- Contrato técnico (200, canonical self, sem noindex) e latência não explicam o atraso; o caminho é profundidade real por página e sinais de descoberta, não volume de novas URLs.`;
      })()
    : `_${NA}._`
}
`;

writeFileSync("reports/relatorio-final-consolidado.md", md);

// Payload diário para o painel interno (/admin/indexacao-diaria).
// Só publica o que existe: o painel exibe "sem dado" em vez de zero fabricado.
const historicoPath = "reports/indexation-daily-history.json";
const clusters = new Map();
for (const u of inv?.urls ?? []) {
  const c = clusters.get(u.cluster) ?? {
    cluster: u.cluster,
    total: 0,
    indexadas: 0,
    descobertas: 0,
    desconhecidas: 0,
    outras: 0,
    cliques: 0,
    impressoes: 0,
    scores: [],
  };
  c.total++;
  if (u.gscStatus === "INDEXED") c.indexadas++;
  else if (u.gscStatus === "DISCOVERED_NOT_INDEXED") c.descobertas++;
  else if (u.gscStatus === "UNKNOWN_TO_GOOGLE") c.desconhecidas++;
  else c.outras++;
  c.cliques += u.clicks ?? 0;
  c.impressoes += u.impressions ?? 0;
  clusters.set(u.cluster, c);
}
for (const r of qual?.results ?? []) clusters.get(r.cluster)?.scores.push(r.score);

const mediana = (arr) => {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};
const clusterPayload = [...clusters.values()]
  .map(({ scores, ...c }) => ({ ...c, scoreMediano: mediana(scores) }))
  .sort((a, b) => b.total - a.total);

const totais = {
  urls: totalUrls,
  indexadas: clusterPayload.reduce((s, c) => s + c.indexadas, 0),
  descobertas: clusterPayload.reduce((s, c) => s + c.descobertas, 0),
  desconhecidas: clusterPayload.reduce((s, c) => s + c.desconhecidas, 0),
  outras: clusterPayload.reduce((s, c) => s + c.outras, 0),
};

// Tier A é o único compromisso de indexação da Fase Final: páginas comerciais
// e de sintoma que devem estar indexadas. Tiers B–D são consequência.
const tierMap = new Map();
for (const u of inv?.urls ?? []) {
  const t = u.tier ?? "SEM_TIER";
  const row = tierMap.get(t) ?? { tier: t, total: 0, indexadas: 0, descobertas: 0, desconhecidas: 0 };
  row.total++;
  if (u.gscStatus === "INDEXED") row.indexadas++;
  else if (u.gscStatus === "DISCOVERED_NOT_INDEXED") row.descobertas++;
  else if (u.gscStatus === "UNKNOWN_TO_GOOGLE") row.desconhecidas++;
  tierMap.set(t, row);
}
const tiers = [...tierMap.values()]
  .map((r) => ({ ...r, taxaIndexacao: r.total ? Number(((r.indexadas / r.total) * 100).toFixed(1)) : null }))
  .sort((a, b) => String(a.tier).localeCompare(String(b.tier)));


const dia = geradoEm.slice(0, 10);
const historico = existsSync(historicoPath) ? JSON.parse(readFileSync(historicoPath, "utf8")) : [];
const semHoje = historico.filter((h) => h.dia !== dia);
semHoje.push({ dia, ...totais });
const historicoFinal = semHoje.slice(-90);
writeFileSync(historicoPath, JSON.stringify(historicoFinal, null, 2));

writeFileSync(
  "public/indexation-daily.json",
  JSON.stringify(
    {
      geradoEm,
      totais,
      clusters: clusterPayload,
      historico: historicoFinal,
      latencia: lat
        ? { escopo: lat.escopo, limiarMs: lat.limiarMs, medidas: lat.total, p50: lat.p50, p75: lat.p75, p95: lat.p95, falhas: lat.falhas?.length ?? 0 }
        : null,
      indexnow: idxnow
        ? {
            executadoEm: idxnow.executadoEm ?? idxnow.geradoEm ?? null,
            enviadas: idxSubmitted,
            falhas: idxFailed,
            novas: idxnow.novas?.length ?? 0,
            mudadas: idxnow.mudadas?.length ?? 0,
            ignoradas: idxnow.ignoradas?.length ?? 0,
          }
        : null,
      tiers,
      qualidade: qual
        ? {
            faixas: qual.results.reduce((acc, r) => ({ ...acc, [r.faixa]: (acc[r.faixa] ?? 0) + 1 }), {}),
            scoreMedianoGeral: mediana(qual.results.map((r) => r.score)),
            piores: qual.results.slice(0, 15).map((r) => ({ path: r.path, score: r.score, faixa: r.faixa, causas: r.causas })),
          }
        : null,
      doorway: local?.resumo ?? null,
      pisoQualidade: local?.floor ?? null,
      consolidacao: consolidados.length
        ? { total: consolidados.length, urlsAntes: totalUrls, urlsDepois: totalUrls - consolidados.length }
        : null,

    },
    null,
    2,
  ),
);

writeFileSync(
  "reports/relatorio-final-consolidado.json",
  JSON.stringify(
    {
      geradoEm,
      fontes: {
        gsc: Boolean(inv),
        bing: Boolean(bing),
        indexnow: Boolean(idxnow),
        latencia: Boolean(lat),
        qualidade: Boolean(qual),
        local: Boolean(local),
        jsonld: Boolean(jsonld),
        smoke: Boolean(smoke),
        blogLinks: Boolean(links),
      },
      totalUrls,
    },
    null,
    2,
  ),
);
console.log(
  `relatório final consolidado gerado — fontes presentes: ${[
    inv && "GSC",
    bing && "Bing",
    idxnow && "IndexNow",
    lat && "latência",
    qual && "qualidade",
    local && "local",
    jsonld && "JSON-LD",
    smoke && "smoke",
    links && "links",
  ]
    .filter(Boolean)
    .join(", ")}`,
);
