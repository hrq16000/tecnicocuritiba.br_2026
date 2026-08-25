#!/usr/bin/env node
/**
 * ============================================================================
 * RELATÓRIO FORMAL DE MARCO (D14, D30, …) — SOMENTE LEITURA
 * ============================================================================
 * Gera `docs/relatorio-monitoramento-<marco>.md` a partir das evidências já
 * congeladas — nada é recalculado a partir da rede e nada é escrito no site.
 *
 * Fontes:
 *   reports/operacao-marcos.json          (marcos versionados)
 *   public/monitoramento-analise.json     (analista D7/D14)
 *   reports/diff-marcos.json              (identidade de SERP)
 *   reports/operational-alerts-state.json (alertas + limiares)
 *   reports/job-runs.json                 (execuções de job)
 *   public/snapshot-index.json            (reindexação/verificação)
 *
 * Uso:
 *   node scripts/gerar-relatorio-marco.mjs               # marco mais recente
 *   node scripts/gerar-relatorio-marco.mjs --marco=D14
 *   node scripts/gerar-relatorio-marco.mjs --marco=D30 --gate
 *
 * Com --gate o script falha (exit 2) quando o marco pedido não está
 * registrado: relatório sem coleta não é emitido (fail-closed).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const arg = (n, d = null) => {
  const hit = args.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const GATE = args.includes("--gate");
const NA = "N/A";
const lerJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};
const fmt = (v) => (v === null || v === undefined || v === "" ? NA : String(v));
const pct = (v) => (v === null || v === undefined ? NA : `${v}%`);

const ORDEM = ["D0", "D7", "D14", "D30"];
const historico = lerJson("reports/operacao-marcos.json") ?? { marcos: [] };
const marcos = historico.marcos
  .slice()
  .sort((a, b) => ORDEM.indexOf(a.marco) - ORDEM.indexOf(b.marco));
const get = (m) => marcos.find((x) => x.marco === m) ?? null;

const MARCO = (arg("marco") || marcos[marcos.length - 1]?.marco || "D14").toUpperCase();
const alvo = get(MARCO);
const anteriorChave = ORDEM[Math.max(0, ORDEM.indexOf(MARCO) - 1)];
const anterior = get(anteriorChave);
const D0 = get("D0");

if (!alvo) {
  const msg = `marco ${MARCO} ainda não registrado em reports/operacao-marcos.json`;
  if (GATE) {
    console.error(`✖ relatório não emitido: ${msg}.`);
    console.error("  Rode a coleta (npm run snapshot:marco -- --marco=" + MARCO + ") antes do relatório.");
    process.exit(2);
  }
  console.warn(`⚠ ${msg} — relatório será emitido com "N/A" nas seções dependentes.`);
}

const analise = lerJson("public/monitoramento-analise.json");
const diff = lerJson("reports/diff-marcos.json");
const alertas = lerJson("reports/operational-alerts-state.json");
const jobs = lerJson("reports/job-runs.json");
const indice = lerJson("public/snapshot-index.json");
const bloqueio = lerJson("reports/marco-janela-bloqueio.json");

const PAINEL = "/admin/monitoramento";
const link = (rotulo, hash) => `[${rotulo}](${PAINEL}${hash})`;

const funil = (m) =>
  m
    ? `unknown ${m.google.unknown} · discovered ${m.google.discovered} · crawled-not-indexed ${m.google.crawled_not_indexed} · indexed ${m.google.indexed}`
    : `${NA} — marco não registrado`;

const tierA = (m) => m?.tiers?.find((t) => t.chave === "A") ?? null;
const delta = (a, b) => (a === null || a === undefined || b === null || b === undefined ? NA : `${b - a > 0 ? "+" : ""}${Math.round((b - a) * 100) / 100}`);

const decisao =
  MARCO === "D7" ? analise?.decisaoD7 : MARCO === "D14" ? analise?.decisaoD14 : analise?.[`decisao${MARCO}`] ?? null;

const clusters = alvo?.clusters ?? [];
const tiers = alvo?.tiers ?? [];
const tierANaoIndexadas = analise?.tierANaoIndexadas ?? [];
const quickWins = analise?.quickWins ?? [];
const queries = (analise?.queries ?? []).slice(0, 15);

const md = [
  `# Relatório de monitoramento — marco ${MARCO}`,
  "",
  `Gerado em ${new Date().toISOString()} · projeto tecnico.curitiba.br.`,
  `Registro do marco: ${fmt(alvo?.registradoEm)} · commit \`${fmt(alvo?.commit)}\` · denominador ${fmt(alvo?.denominador?.curadas)} URLs curadas.`,
  "",
  "> Documento de **medição**. Nenhuma rota, sitemap, canonical, redirect, conteúdo ou disparo",
  "> de IndexNow foi alterado para produzi-lo. Dado ausente aparece como `N/A` — nunca estimativa.",
  "",
  "## 1. Sumário executivo",
  "",
  `- Decisão do marco: **${fmt(decisao?.valor)}** — ${fmt(decisao?.justificativa)}`,
  `- Indexadas: ${fmt(alvo?.google?.indexed)} de ${fmt(alvo?.denominador?.curadas)} (Δ vs ${anteriorChave}: ${delta(anterior?.google?.indexed, alvo?.google?.indexed)})`,
  `- Tier A: ${pct(tierA(alvo)?.taxaIndexacao)} (Δ vs D0: ${delta(tierA(D0)?.taxaIndexacao, tierA(alvo)?.taxaIndexacao)})`,
  `- Search performance 28d: ${fmt(alvo?.google?.impressoes28d)} impressões · ${fmt(alvo?.google?.cliques28d)} cliques · CTR ${pct(alvo?.google?.ctr28d)} · posição média ${fmt(alvo?.google?.posicaoMedia28d)}`,
  `- Alertas ativos: ${fmt(alertas?.alertas?.length ?? 0)} · assinatura \`${(alertas?.assinatura ?? "").slice(0, 12) || NA}\``,
  bloqueio ? `- ⚠ Última coleta bloqueada por janela temporal: ${fmt(bloqueio.motivo)}` : "- Janela temporal do marco: válida.",
  "",
  `Evidências no painel: ${link("visão do marco", "")} · ${link("drilldown por URL", "#drilldown")} · ${link("comparação entre marcos", "#comparacao")} · ${link("tendências", "#tendencias")} · ${link("execução de jobs", "#jobs")} · ${link("alertas classificados", "#alertas")}.`,
  "",
  "## 2. Funil de indexação",
  "",
  "| Marco | Funil | Impressões 28d | Cliques 28d |",
  "| --- | --- | --- | --- |",
  ...ORDEM.map((k) => {
    const m = get(k);
    return `| ${k} | ${funil(m)} | ${fmt(m?.google?.impressoes28d)} | ${fmt(m?.google?.cliques28d)} |`;
  }),
  "",
  `Δ ${anteriorChave} → ${MARCO}: indexed ${delta(anterior?.google?.indexed, alvo?.google?.indexed)} · unknown ${delta(anterior?.google?.unknown, alvo?.google?.unknown)} · discovered ${delta(anterior?.google?.discovered, alvo?.google?.discovered)} · crawled-not-indexed ${delta(anterior?.google?.crawled_not_indexed, alvo?.google?.crawled_not_indexed)}.`,
  "",
  "## 3. Tiers",
  "",
  "| Tier | Total | Indexadas | Taxa | Impressões | Cliques |",
  "| --- | --- | --- | --- | --- | --- |",
  ...(tiers.length
    ? tiers.map((t) => `| ${t.chave} | ${t.total} | ${t.indexadas} | ${pct(t.taxaIndexacao)} | ${t.impressoes} | ${t.cliques} |`)
    : [`| ${NA} | | | | | |`]),
  "",
  "## 4. Clusters",
  "",
  "| Cluster | Total | Indexadas | Unknown | Discovered | Crawled n/i | Taxa | Impressões | Cliques |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...(clusters.length
    ? clusters.map(
        (c) =>
          `| ${c.chave} | ${c.total} | ${c.indexadas} | ${c.unknown} | ${c.discovered} | ${c.crawledNaoIndexadas} | ${pct(c.taxaIndexacao)} | ${c.impressoes} | ${c.cliques} |`,
      )
    : [`| ${NA} | | | | | | | | |`]),
  "",
  `Drilldown por cluster: ${link("abrir no painel", "?cluster=SERVICO#drilldown")} (troque o parâmetro `.concat("`cluster`", ")."),
  "",
  "## 5. Tier A não indexadas — diagnóstico individual",
  "",
  tierANaoIndexadas.length
    ? [
        "| URL | Cluster | Estado | Último crawl | Inbound | Prof. | Quality | Impr. | Classificação |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
        ...tierANaoIndexadas.map(
          (t) =>
            `| ${t.url} | ${fmt(t.cluster)} | ${fmt(t.estadoAtual)} | ${fmt(t.ultimoCrawl)} | ${fmt(t.inbound)} | ${fmt(t.profundidade)} | ${fmt(t.qualityScore)} | ${fmt(t.impressoes)} | ${fmt(t.decisao)} |`,
        ),
      ].join("\n")
    : "Nenhuma URL Tier A fora do índice neste marco.",
  "",
  "## 6. Identidade de SERP (diff entre marcos)",
  "",
  diff
    ? `Comparação ${fmt(diff.de)} × ${fmt(diff.para)}: ${fmt(diff.totalMudancas ?? diff.mudancas?.length ?? 0)} mudança(s) — alta ${fmt(diff.severidade?.alta ?? 0)}, média ${fmt(diff.severidade?.media ?? 0)}. Detalhe: ${link("diff no painel", "#diff")}.`
    : `${NA} — rode \`npm run report:diff-marcos\`.`,
  "",
  "## 7. Quick wins elegíveis",
  "",
  quickWins.length
    ? [
        "| URL | Impressões | Cliques | Posição | CTR | Problema |",
        "| --- | --- | --- | --- | --- | --- |",
        ...quickWins.map((q) => `| ${q.url} | ${q.impressoes} | ${q.cliques} | ${q.posicao} | ${q.ctr}% | ${q.problema} |`),
      ].join("\n")
    : "Nenhum quick win elegível (limite de governança: 5 ativos, liberados a partir de D14).",
  "",
  `Backlog gerenciável: ${link("quick wins no painel", "#quick-wins")}.`,
  "",
  "## 8. Consultas (top 15 por impressões)",
  "",
  queries.length
    ? [
        "| Query | Impressões | Cliques | Posição | Tipo |",
        "| --- | --- | --- | --- | --- |",
        ...queries.map((q) => `| ${q.query} | ${q.impressoes} | ${q.cliques} | ${fmt(q.posicao)} | ${q.tipo} |`),
      ].join("\n")
    : `${NA} — sem snapshot de queries para este marco.`,
  "",
  "## 9. Saúde técnica e governança",
  "",
  `- Grafo interno: ${fmt(alvo?.grafo?.urls)} URLs · órfãs ${fmt(alvo?.grafo?.orfas)} · links para consolidadas ${fmt(alvo?.grafo?.linksParaRedirect)}`,
  `- Doorway (risco alto): ${fmt(alvo?.doorway?.alto)}`,
  `- Consolidação 301: ${fmt(alvo?.consolidacao?.pass)}/${fmt(alvo?.consolidacao?.total)} ok · falhas ${fmt(alvo?.consolidacao?.falhas)}`,
  `- IndexNow: ${fmt(alvo?.indexnow?.submitted)} enviadas em ${fmt(alvo?.indexnow?.executadoEm)}`,
  `- Reindexação de snapshots: ${fmt(indice?.verificacao?.status)} · ${fmt(indice?.verificacao?.totalEntradas)} artefatos · amostragem ${fmt(indice?.verificacao?.amostragem?.conferidas)}`,
  `- Jobs registrados: ${fmt(jobs?.execucoes?.length ?? jobs?.length ?? 0)} — ${link("ver execuções", "#jobs")}`,
  "",
  "## 10. Alertas",
  "",
  (alertas?.alertas ?? []).length
    ? [
        "| Alerta | Severidade | Mensagem |",
        "| --- | --- | --- |",
        ...alertas.alertas.map((a) => `| ${a.id} | ${a.severidade} | ${a.mensagem} |`),
      ].join("\n")
    : "Nenhum alerta ativo — operação dentro dos limiares.",
  "",
  `Classificação de cada alerta como verdadeiro ou falso positivo (com justificativa e cluster/URL afetado): ${link("painel de alertas", "#alertas")}.`,
  "",
  "## 11. Decisão e próximo passo",
  "",
  `Decisão registrada: **${fmt(decisao?.valor)}**.`,
  "",
  "- **A / WAIT** — não alterar o site; próxima leitura no marco seguinte.",
  "- **B / QUICK WINS** — abrir no máximo 5 itens no backlog, um por URL.",
  `- **C / INVESTIGATE** — planejar experimento controlado (test group × control group, mudança única, métrica de sucesso): ${link("tela de experimentos", "#experimentos")}.`,
  "- **D / REGRESSION** — correção técnica mínima autorizada, registrada como job.",
  "",
  `Próximo marco: ${ORDEM[Math.min(ORDEM.length - 1, ORDEM.indexOf(MARCO) + 1)]} — coleta agendada com o mesmo fail-closed de janela temporal.`,
  "",
].join("\n");

mkdirSync("docs", { recursive: true });
const saida = `docs/relatorio-monitoramento-${MARCO.toLowerCase()}.md`;
writeFileSync(saida, `${md}\n`);
console.log(`✓ ${saida} gerado (marco ${MARCO}${alvo ? "" : " — não registrado, seções em N/A"}).`);
