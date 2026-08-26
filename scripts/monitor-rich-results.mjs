#!/usr/bin/env node
/**
 * MONITORAMENTO DIÁRIO DE RICH RESULTS (Google Search Console)
 *
 * Para cada URL comercial curada (fonte: scripts/lib/comercial-onda2.mjs) lê,
 * via URL Inspection (somente leitura), quais Rich Results o Google detectou e
 * compara com o baseline do dia anterior. Alerta quando:
 *
 *   - um tipo esperado (FAQPage / LocalBusiness / Service) some da URL;
 *   - a contagem de itens detectados cai em relação ao baseline;
 *   - surgem itens com severidade ERROR.
 *
 * Uso:
 *   node scripts/monitor-rich-results.mjs           # relatório
 *   node scripts/monitor-rich-results.mjs --alert   # sai 1 se houver queda
 *   node scripts/monitor-rich-results.mjs --save    # grava novo baseline
 *
 * Saídas: reports/rich-results.json · reports/rich-results.md
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { BASE_URL, COMERCIAL_ONDA2 } from "./lib/comercial-onda2.mjs";
import { resolveSite, inspectRichResults } from "./lib/gsc-client.mjs";

const ALERT = process.argv.includes("--alert");
const SAVE = process.argv.includes("--save");
const BASELINE = "reports/rich-results-baseline.json";

/** Schema declarado → rótulos possíveis no Search Console. */
const APELIDOS = {
  FAQPage: ["faq", "perguntas frequentes"],
  LocalBusiness: ["local business", "empresa local", "negócios locais", "local businesses"],
  Service: ["service", "serviço", "servicos"],
  Product: ["product", "produto"],
  BreadcrumbList: ["breadcrumb"],
};

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Encontra, entre os tipos retornados pelo GSC, o que corresponde ao schema. */
function acharTipo(tipos, schema) {
  const alvos = [schema, ...(APELIDOS[schema] ?? [])].map(norm);
  const chave = Object.keys(tipos).find((k) => alvos.some((a) => norm(k).includes(a) || a.includes(norm(k))));
  return chave ? { chave, ...tipos[chave] } : null;
}

mkdirSync("reports", { recursive: true });

const alvo = `${BASE_URL}/`;
const site = await resolveSite(alvo);
console.log(`Propriedade: ${site} · ${COMERCIAL_ONDA2.length} URLs comerciais`);

const anterior = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : null;
const antesPorPath = new Map((anterior?.results ?? []).map((r) => [r.path, r]));

const results = [];
const quedas = [];
const erros = [];
const avisos = [];

for (const page of COMERCIAL_ONDA2) {
  const url = `${BASE_URL}${page.path}`;
  let row = { path: page.path, url, esperados: page.schemas, tipos: {}, verdict: "ERROR", error: null };
  try {
    const state = await inspectRichResults(site, url);
    row = { ...row, ...state, error: null };
  } catch (e) {
    row.error = e.message;
    erros.push(`${page.path}: ${e.message}`);
    results.push(row);
    continue;
  }

  const antes = antesPorPath.get(page.path);
  row.detalhes = page.schemas.map((schema) => {
    const atual = acharTipo(row.tipos, schema);
    const previo = antes ? (antes.detalhes ?? []).find((d) => d.schema === schema) : null;
    const detectados = atual?.detectados ?? 0;
    const status =
      detectados === 0
        ? previo && previo.detectados > 0
          ? "sumiu"
          : "ausente"
        : previo && detectados < previo.detectados
          ? "caiu"
          : "ok";
    if (status === "sumiu" || status === "caiu") {
      quedas.push(`${page.path} · ${schema}: ${previo?.detectados ?? 0} → ${detectados}`);
    }
    if (atual?.comErro) quedas.push(`${page.path} · ${schema}: ${atual.comErro} item(ns) com ERROR`);
    if (atual?.comAviso) avisos.push(`${page.path} · ${schema}: ${atual.comAviso} item(ns) com WARNING`);
    const diff = {
      detectados: { antes: previo?.detectados ?? null, depois: detectados },
      erros: { antes: previo?.comErro ?? null, depois: atual?.comErro ?? 0 },
      avisos: { antes: previo?.comAviso ?? null, depois: atual?.comAviso ?? 0 },
      status,
    };
    return { schema, detectados, comErro: atual?.comErro ?? 0, comAviso: atual?.comAviso ?? 0, status, diff };
  });

  results.push(row);
}

const cobertos = results.filter((r) => (r.detalhes ?? []).every((d) => d.detectados > 0)).length;
const report = {
  generatedAt: new Date().toISOString(),
  site,
  total: results.length,
  comTodosOsSchemas: cobertos,
  quedas,
  avisos,
  erros,
  results,
};

writeFileSync("reports/rich-results.json", `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  "reports/rich-results.md",
  [
    "# Rich Results — URLs comerciais curadas",
    "",
    `- Propriedade: \`${site}\``,
    `- Gerado em: ${report.generatedAt}`,
    `- URLs com todos os schemas esperados detectados: **${cobertos}/${results.length}**`,
    "",
    "| URL | Verdict | FAQPage | LocalBusiness | Service | Observação |",
    "| --- | --- | --- | --- | --- | --- |",
    ...results.map((r) => {
      const cel = (schema) => {
        const d = (r.detalhes ?? []).find((x) => x.schema === schema);
        if (!d) return "—";
        return `${d.detectados}${d.comErro ? ` (⚠️${d.comErro})` : ""} ${d.status === "ok" ? "" : `· ${d.status}`}`.trim();
      };
      return `| ${r.path} | ${r.richVerdict ?? "—"} | ${cel("FAQPage")} | ${cel("LocalBusiness")} | ${cel("Service")} | ${r.error ?? "-"} |`;
    }),
    "",
    quedas.length ? `## ⚠️ Quedas/ERROR detectados\n\n${quedas.map((q) => `- ${q}`).join("\n")}` : "Sem quedas ou ERROR em relação ao baseline.",
    avisos.length ? `\n## ⚠️ WARNING detectados\n\n${avisos.map((q) => `- ${q}`).join("\n")}` : "",
    "",
  ].join("\n"),
);

if (SAVE) writeFileSync(BASELINE, `${JSON.stringify(report, null, 2)}\n`);

console.log(`rich results: ${cobertos}/${results.length} completos · ${quedas.length} quedas · ${erros.length} erros`);
for (const q of quedas) console.log(`  QUEDA ${q}`);
if (ALERT && (quedas.length || avisos.length || erros.length)) process.exit(1);
