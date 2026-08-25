#!/usr/bin/env node
/**
 * ============================================================================
 * ALERTAS OPERACIONAIS COM LIMIAR — RESUMO SÓ QUANDO MUDA
 * ============================================================================
 * Lê os relatórios que os gates já produzem e dispara alerta apenas quando um
 * limiar é rompido. O estado anterior fica em
 * `reports/operational-alerts-state.json`: se a assinatura do conjunto de
 * alertas for igual à da execução passada, nada é notificado (silêncio é o
 * comportamento correto em dia normal).
 *
 * Uso:
 *   node scripts/monitor-operational-alerts.mjs             avalia e imprime
 *   node scripts/monitor-operational-alerts.mjs --notify    envia webhook se mudou
 *   node scripts/monitor-operational-alerts.mjs --gate      exit 1 em severidade alta
 *
 * Webhook opcional: SEO_ALERTS_WEBHOOK (Slack-compatível).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const notify = args.includes("--notify");
const gate = args.includes("--gate");
const STATE = "reports/operational-alerts-state.json";

const lerJson = (p) => {
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
  } catch {
    return null;
  }
};

/** Limiares explícitos — mudança aqui é decisão de governança, não de código. */
export const LIMIARES = {
  quedaTierAPp: 5, // pontos percentuais de queda tolerados
  doorwayAltoBaseline: 2,
  sitemapNoindex: 0,
  canonicalMismatch: 0,
  linksParaRedirect: 0,
  crawlErros: 0,
  indexnowReenvioPct: 30, // % do conjunto curado; acima disso é ruído
};

const inventario = lerJson("reports/indexation-inventory.json");
const qualidade = lerJson("reports/local-page-quality.json");
const grafo = lerJson("reports/internal-graph.json");
const sitemap = lerJson("reports/sitemap-inclusions.json");
const indexnow = lerJson("reports/indexnow-last-run.json");
const entidade = lerJson("reports/entity-consistency.json");
const serp = lerJson("reports/serp-signals-baseline.json");
const d30 = lerJson("reports/operacao-d30.json");
const estadoAnterior = lerJson(STATE);

const urls = inventario?.urls ?? [];
const curadas = urls.filter((u) => u.sitemap);
const tierA = curadas.filter((u) => u.tier === "A");
const tierAIndexadas = tierA.filter((u) => (u.gscStatus ?? "").toLowerCase().includes("index") &&
  !(u.gscStatus ?? "").toLowerCase().includes("not"));
const tierARate = tierA.length ? Math.round((tierAIndexadas.length / tierA.length) * 1000) / 10 : null;
const tierAAnterior = estadoAnterior?.metricas?.tierARate ?? null;

const alertas = [];
const add = (id, severidade, mensagem, evidencia) =>
  alertas.push({ id, severidade, mensagem, evidencia });

// 1. Tier A saindo do índice
if (tierARate !== null && tierAAnterior !== null && tierAAnterior - tierARate > LIMIARES.quedaTierAPp) {
  add(
    "tier-a-queda",
    "alta",
    `Tier A caiu de ${tierAAnterior}% para ${tierARate}% (limiar ${LIMIARES.quedaTierAPp}pp).`,
    { antes: tierAAnterior, depois: tierARate },
  );
}

// 2. Sitemap com noindex / redirect / 404
const noindexNoSitemap = curadas.filter((u) => u.noindex);
if (noindexNoSitemap.length > LIMIARES.sitemapNoindex)
  add("sitemap-noindex", "alta", `${noindexNoSitemap.length} URL(s) noindex dentro do sitemap.`, noindexNoSitemap.slice(0, 10).map((u) => u.path));

const redirectNoSitemap = curadas.filter((u) => [301, 302, 307, 308].includes(u.http));
if (redirectNoSitemap.length)
  add("sitemap-redirect", "alta", `${redirectNoSitemap.length} redirect(s) no sitemap.`, redirectNoSitemap.slice(0, 10).map((u) => u.path));

const erros = curadas.filter((u) => u.http >= 400);
if (erros.length > LIMIARES.crawlErros)
  add("crawl-erros", "alta", `${erros.length} URL(s) curada(s) com HTTP >= 400.`, erros.slice(0, 10).map((u) => `${u.path} ${u.http}`));

// 3. Canonical mismatch
const canonicalRuim = curadas.filter((u) => u.canonicalSelf === false);
if (canonicalRuim.length > LIMIARES.canonicalMismatch)
  add("canonical-mismatch", "alta", `${canonicalRuim.length} URL(s) sem canonical self.`, canonicalRuim.slice(0, 10).map((u) => u.path));

// 4. Doorway HIGH
const doorwayAlto = qualidade?.resumo?.alto ?? null;
if (doorwayAlto !== null && doorwayAlto > LIMIARES.doorwayAltoBaseline)
  add("doorway-alto", "alta", `Doorway HIGH em ${doorwayAlto} (baseline ${LIMIARES.doorwayAltoBaseline}).`, { doorwayAlto });

// 5. Link interno para redirect / URL consolidada
const linksRedirect =
  grafo?.linksParaRedirect ?? grafo?.paraRedirect ?? grafo?.resumo?.linksParaRedirect ?? 0;
if ((Array.isArray(linksRedirect) ? linksRedirect.length : linksRedirect) > LIMIARES.linksParaRedirect)
  add("link-redirect", "alta", `Link(s) interno(s) apontando para redirect/URL consolidada.`, linksRedirect);

// 6. Entity consistency
const entidadeFalhas = entidade?.falhas?.length ?? entidade?.erros?.length ?? 0;
if (entidadeFalhas)
  add("entity-inconsistency", "alta", `${entidadeFalhas} inconsistência(s) de entidade (Organization/NAP/author).`, (entidade?.falhas ?? entidade?.erros ?? []).slice(0, 8));

// 7. Schema duplicado / instável (SERP signals)
const serpRegressoes = lerJson("reports/serp-signals.json")?.regressoes?.length ?? 0;
if (serpRegressoes)
  add("serp-signals", "alta", `${serpRegressoes} regressão(ões) de title/H1/canonical/JSON-LD após deploy.`, { serpRegressoes });

// 8. IndexNow reenviando demais
const enviadas = indexnow?.enviadas ?? indexnow?.submitted ?? 0;
const limiteEnvio = Math.ceil((curadas.length || 130) * (LIMIARES.indexnowReenvioPct / 100));
if (enviadas > limiteEnvio)
  add(
    "indexnow-ruido",
    "media",
    `IndexNow enviou ${enviadas} URL(s) (> ${LIMIARES.indexnowReenvioPct}% do conjunto curado). Suspeita de reenvio sem mudança real.`,
    { enviadas, limite: limiteEnvio },
  );

const metricas = {
  tierARate,
  curadas: curadas.length,
  doorwayAlto,
  indexnowEnviadas: enviadas,
  serpBaselineEm: serp?.geradoEm ?? null,
  decisaoD30: d30?.decisao ?? null,
  sitemapTotal: sitemap?.total ?? sitemap?.incluidas?.length ?? curadas.length,
};

const assinatura = createHash("sha1")
  .update(JSON.stringify(alertas.map((a) => `${a.id}:${a.severidade}:${a.mensagem}`).sort()))
  .digest("hex");
const mudou = assinatura !== estadoAnterior?.assinatura;

mkdirSync("reports", { recursive: true });
writeFileSync(
  STATE,
  JSON.stringify({ avaliadoEm: new Date().toISOString(), assinatura, alertas, metricas }, null, 2),
);
writeFileSync(
  "reports/operational-alerts.md",
  [
    "# Alertas operacionais",
    "",
    `Avaliado em ${new Date().toISOString()} · assinatura \`${assinatura.slice(0, 12)}\` · ${mudou ? "**mudou desde a última execução**" : "sem mudança desde a última execução"}`,
    "",
    `Tier A: ${tierARate ?? "N/A"}% · curadas: ${metricas.curadas} · doorway ALTO: ${doorwayAlto ?? "N/A"} · IndexNow enviadas: ${enviadas}`,
    "",
    alertas.length
      ? ["| Alerta | Severidade | Mensagem |", "| --- | --- | --- |", ...alertas.map((a) => `| ${a.id} | ${a.severidade} | ${a.mensagem} |`)].join("\n")
      : "Nenhum alerta ativo. Operação dentro dos limiares.",
    "",
    "## Limiares",
    "",
    ...Object.entries(LIMIARES).map(([k, v]) => `- \`${k}\`: ${v}`),
  ].join("\n"),
);

console.log(`── Alertas operacionais (${alertas.length} ativo(s), ${mudou ? "mudou" : "sem mudança"})`);
for (const a of alertas) console.log(`  [${a.severidade}] ${a.id} — ${a.mensagem}`);
if (!alertas.length) console.log("  ✔ tudo dentro do limiar.");

if (notify && mudou && alertas.length) {
  const webhook = process.env.SEO_ALERTS_WEBHOOK;
  if (!webhook) console.warn("  ⚠ SEO_ALERTS_WEBHOOK ausente — resumo não enviado.");
  else {
    const texto = [
      `*tecnico.curitiba.br — ${alertas.length} alerta(s) operacional(is)*`,
      ...alertas.map((a) => `• [${a.severidade}] ${a.mensagem}`),
      `Tier A ${tierARate ?? "N/A"}% · curadas ${metricas.curadas} · doorway ALTO ${doorwayAlto ?? "N/A"}`,
    ].join("\n");
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: texto }),
    });
    console.log(`  webhook: ${res.status}`);
  }
} else if (notify) {
  console.log("  (sem envio: nada mudou ou nenhum alerta ativo)");
}

if (gate && alertas.some((a) => a.severidade === "alta")) {
  console.error("\n✖ alerta(s) de severidade alta — operação em NO-GO.");
  process.exit(1);
}
