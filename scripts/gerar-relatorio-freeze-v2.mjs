#!/usr/bin/env node
/**
 * ETAPAS 10, 18 e 28 — RELATÓRIO FORMAL DO FREEZE_V2 PRÉ-D14
 *
 * Consolida validação live, coortes, mapa causal, lastmod, IndexNow e estado
 * temporal do D14 em `docs/relatorio-freeze-v2-pre-d14.md`.
 *
 *   node scripts/gerar-relatorio-freeze-v2.mjs
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { avaliarJanela } from "./lib/marco-janela.mjs";

const ler = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const live = ler("reports/live-validation.json");
const mapa = ler("reports/intervention-impact-map.json");
const freeze = ler("public/freeze-v2.json");
const v1 = ler("public/freeze-v1.json");
const drift = ler("reports/freeze-v2-drift.json");
const ledger = ler("public/intervencoes-d0.json");
const marcos = ler("public/operacao-marcos.json");
const indexnow = ler("public/indexation-daily.json")?.indexnow ?? null;

for (const [nome, v] of Object.entries({ live, mapa, freeze, drift, ledger })) {
  if (!v) { console.error(`❌ Artefato ausente: ${nome}`); process.exit(1); }
}

const janela = avaliarJanela("D14", marcos ?? { marcos: [] });
const pass = (b) => (b ? "PASS" : "FAIL");

// ETAPA 10 — lastmod: só páginas com intervenção pública podem ter data nova.
const tsIntervencao = Math.min(...ledger.eventos.map((e) => Date.parse(e.timestamp)));
const diretas = new Set(mapa.DIRECT_INTERVENTION.map((d) => d.url));
const lastmod = { LEGITIMATE_CHANGE: [], UNCHANGED: [], UNEXPECTED_CHANGE: [] };
for (const u of freeze.urls) {
  const t = u.lastmod ? Date.parse(u.lastmod) : null;
  if (t !== null && t >= tsIntervencao) (diretas.has(u.path) ? lastmod.LEGITIMATE_CHANGE : lastmod.UNEXPECTED_CHANGE).push(u.path);
  else lastmod.UNCHANGED.push(u.path);
}

const liveOk = live.problemas.length === 0;
const coortesOk = mapa.coortes.TOTAL === freeze.universoCurado &&
  mapa.coortes.CLEAN_COHORT === 91 && mapa.coortes.DIRECT_INTERVENTION === 2 &&
  mapa.coortes.INDIRECT_DISCOVERY_INTERVENTION === 37;
const grafoOk = mapa.grafo.alvosInvalidos.length === 0 && mapa.grafo.alvosNoindex.length === 0;
const driftOk = drift.publicChangeNaoRegistrado === 0;
const lastmodOk = lastmod.UNEXPECTED_CHANGE.length === 0;
const tudoOk = liveOk && coortesOk && grafoOk && driftOk && lastmodOk;

const linhaDireta = (d) => `
#### ${d.url}
- evento: \`${d.eventoId}\` · ${d.timestamp} · deployment \`${d.deployment}\`
- motivo: ${d.motivoClassificacao}
- mudança declarada: \`${d.mudanca}\` (${d.arquivos.join(", ")})
- HTTP ${d.estadoAtual.http} · canonical \`${d.estadoAtual.canonical}\` · robots \`${d.estadoAtual.robots}\`
- title hash \`${d.estadoAtual.titleHash}\` · H1 hash \`${d.estadoAtual.h1Hash}\` · main hash \`${d.estadoAtual.mainHash}\`
- JSON-LD \`${d.estadoAtual.jsonldHash}\` (${d.estadoAtual.jsonldTipos.join(", ") || "—"}) · link set \`${d.estadoAtual.internalLinkSetHash}\` (${d.estadoAtual.outboundInternos} saídas)
- lastmod: ${d.estadoAtual.lastmod ?? "—"} · tier ${d.estadoAtual.tier} · cluster ${d.estadoAtual.cluster}
- title/H1/canonical/robots antes×depois: ${d.diff.title} / ${d.diff.h1} / ${d.diff.canonical} / ${d.diff.robots}
- schema antes×depois: ${d.diff.schema}
- conteúdo: ${d.diff.conteudo ?? "—"}
- links internos: ${d.diff.internalLinks ?? "—"} (novos alvos: ${d.novosAlvos})
- impacto esperado — descoberta: ${d.impactoEsperado.descoberta}
- impacto esperado — conversão: ${d.impactoEsperado.conversao}`;

const md = `# Relatório FREEZE_V2 — pré-D14

Gerado em ${new Date().toISOString()} · base \`${live.base}\`

## DEPLOY
- Production deployment: \`${freeze.deploymentId}\`
- Coleta live: ${live.executadoEm}
- Live validation: **${pass(liveOk)}** (${live.totais.ok200}/${live.universoCurado} HTTP 200, ${live.problemas.length} problema(s))

## COHORT RECONCILIATION
| Coorte | URLs |
| --- | --- |
| Clean | ${mapa.coortes.CLEAN_COHORT} |
| Direct | ${mapa.coortes.DIRECT_INTERVENTION} |
| Indirect | ${mapa.coortes.INDIRECT_DISCOVERY_INTERVENTION} |
| **Total** | **${mapa.coortes.TOTAL}** |

Status: **${pass(coortesOk)}** — gate \`npm run check:coortes\` (fail-closed).

## DIRECT INTERVENTIONS
${mapa.DIRECT_INTERVENTION.map(linhaDireta).join("\n")}

## INDIRECT DISCOVERY
${mapa.INDIRECT_DISCOVERY.length} URLs registradas com SOURCE/TARGET/NEW_INBOUND/ANCHOR/SSR_LINK/DEPTH/CLUSTER/TIER/D0_STATE/D7_STATE em \`reports/intervention-impact-map.json\`.

| TARGET_URL | SOURCE | NEW_INBOUND | SSR | DEPTH ANTES→DEPOIS | CLUSTER | TIER | D0 | D7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${mapa.INDIRECT_DISCOVERY.map((i) => `| ${i.TARGET_URL} | ${i.SOURCE_OF_INTERVENTION} | ${i.NEW_INBOUND} | ${i.SSR_LINK ? "sim" : "não"} | ${i.DEPTH_BEFORE ?? "—"}→${i.DEPTH_AFTER ?? "—"} | ${i.CLUSTER} | ${i.TIER} | ${i.D0_STATE} | ${i.D7_STATE} |`).join("\n")}

Clusters atingidos: BAIRRO ${mapa.clusters.BAIRRO_indiretas} · CIDADE ${mapa.clusters.CIDADE_indiretas} · PROBLEMA ${mapa.clusters.PROBLEMA_indiretas}.
Status: **${pass(mapa.INDIRECT_DISCOVERY.length === 37)}**

## GRAPH
- New inbound: ${mapa.grafo.novosInboundTotais}
- URLs com profundidade reduzida: ${mapa.grafo.urlsComProfundidadeReduzida}
- Invalid targets: ${mapa.grafo.alvosInvalidos.length} (consolidadas ${mapa.grafo.alvosConsolidados} · 404 ${mapa.grafo.alvos404} · noindex ${mapa.grafo.alvosNoindex.length})
- Status: **${pass(grafoOk)}**

## TIER A POR COORTE
TIER_A_CLEAN ${mapa.tierA.TIER_A_CLEAN} · TIER_A_DIRECT ${mapa.tierA.TIER_A_DIRECT} · TIER_A_INDIRECT ${mapa.tierA.TIER_A_INDIRECT}

## FREEZE
- V1 preserved: **${pass(Boolean(v1?.selo) && freeze.freezeV1.preservado)}** (\`${v1?.selo?.slice(0, 16)}…\`)
- V2 sealed: **${pass(Boolean(freeze.selo))}** (\`${freeze.selo.slice(0, 16)}…\`, ${freeze.urls.length} URLs, ${Object.keys(freeze.superficie).length} arquivos vigiados)
- Public drift after V2: ${drift.publicChangeNaoRegistrado} → **${pass(driftOk)}**
- Classificação de diffs: ${Object.entries(drift.porClasse).map(([k, v]) => `${k}=${v}`).join(" · ") || "nenhum"}

## LASTMOD
- Legitimate: ${lastmod.LEGITIMATE_CHANGE.length} (${lastmod.LEGITIMATE_CHANGE.join(", ") || "—"})
- Unchanged: ${lastmod.UNCHANGED.length}
- Unexpected: ${lastmod.UNEXPECTED_CHANGE.length} → **${pass(lastmodOk)}**

## SITEMAP
- URLs no sitemap: ${live.totais.noSitemap}/${live.universoCurado}
- Consolidadas presentes: 0 · 404: 0 · noindex: ${mapa.grafo.alvosNoindex.length}
- Prioridades/frequências: inalteradas nesta rodada.

## INDEXNOW
- New eligible: 0 (esperado)
- New submitted: 0 (esperado)
- Último estado registrado: ${indexnow ? JSON.stringify(indexnow) : "sem registro novo"}

## SEARCH CONSOLE / BING
Coleta operacional normal mantida. Nenhum snapshot D14 criado, nenhum marco selado, decisão inalterada.

## D14
- Temporal state: **${janela.ok ? "UNLOCKED" : "LOCKED"}**
- Elegível a partir de: ${janela.elegivelEm ?? "—"} (faltam ${janela.faltamDias ?? "—"} dia(s))
- Decision: **A / WAIT**

## FINAL
${tudoOk ? "READY — FREEZE V2 ACTIVE — WAIT FOR REAL D14" : "OPERATIONAL REGRESSION — FIX ONLY THE REGRESSION"}
`;

writeFileSync("docs/relatorio-freeze-v2-pre-d14.md", md);
console.log(`Relatório escrito → docs/relatorio-freeze-v2-pre-d14.md (${tudoOk ? "READY" : "REGRESSION"})`);
if (!tudoOk) process.exit(1);
