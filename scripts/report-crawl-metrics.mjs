#!/usr/bin/env node
/**
 * MÉTRICAS DE RASTREAMENTO (GSC) — páginas rastreadas e tempo de descoberta
 *
 * Para cada rota curada (amostrável) lê no Search Console:
 *   - se a URL já foi rastreada (lastCrawlTime) e o veredito de indexação
 *   - o tempo de descoberta: horas entre a primeira vez que a rota apareceu no
 *     manifesto curado (registrado no histórico local) e o primeiro rastreio
 *
 * Mantém histórico acumulado por ambiente e branch, consumido pelo dashboard
 * de CI e pelo painel administrativo.
 *
 * Uso:
 *   node scripts/report-crawl-metrics.mjs --env=producao --branch=main --limit=60
 *
 * Saídas:
 *   reports/crawl-metrics.json          (execução atual)
 *   reports/crawl-metrics-history.json  (últimas 100 execuções por env/branch)
 *   reports/crawl-metrics.md            (painel)
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { BASE_URL, CURATED_PATHS } from "./lib/curated-urls.mjs";
import { resolveSite, inspectUrl } from "./lib/gsc-client.mjs";

const arg = (n, d = null) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=") ?? d;
const ambiente = arg("env", process.env.DEPLOY_ENV ?? "producao");
const branch = arg("branch", process.env.GITHUB_REF_NAME ?? "local");
const commit = (arg("commit", process.env.GITHUB_SHA ?? "")).slice(0, 8) || "—";
const LIMIT = Number(arg("limit", 0));

const HISTORY = "reports/crawl-metrics-history.json";
const FIRST_SEEN = "reports/crawl-first-seen.json";

mkdirSync("reports", { recursive: true });
const agora = new Date();
const paths = [...new Set(CURATED_PATHS)];
const alvo = LIMIT > 0 ? paths.slice(0, LIMIT) : paths;

// Registro local de quando cada rota entrou no manifesto curado (base do
// "tempo de descoberta" — o Google não expõe a data de publicação).
const firstSeen = existsSync(FIRST_SEEN) ? JSON.parse(readFileSync(FIRST_SEEN, "utf8")) : {};
let novas = 0;
for (const p of paths) {
  if (!firstSeen[p]) {
    firstSeen[p] = agora.toISOString();
    novas++;
  }
}
writeFileSync(FIRST_SEEN, `${JSON.stringify(firstSeen, null, 2)}\n`);

const site = await resolveSite(`${BASE_URL}/`);
const rows = [];
for (const p of alvo) {
  try {
    const state = await inspectUrl(site, `${BASE_URL}${p}`);
    const crawl = state.lastCrawlTime ? new Date(state.lastCrawlTime) : null;
    const desde = new Date(firstSeen[p]);
    rows.push({
      path: p,
      verdict: state.verdict,
      coverageState: state.coverageState,
      crawled: Boolean(crawl),
      lastCrawlTime: state.lastCrawlTime,
      discoveryHours: crawl ? Number(((crawl - desde) / 36e5).toFixed(1)) : null,
      pendingHours: crawl ? null : Number(((agora - desde) / 36e5).toFixed(1)),
    });
  } catch (e) {
    rows.push({ path: p, verdict: "ERROR", error: e.message, crawled: false, discoveryHours: null });
  }
}

const rastreadas = rows.filter((r) => r.crawled);
const tempos = rastreadas.map((r) => r.discoveryHours).filter((h) => h !== null && h >= 0).sort((a, b) => a - b);
const mediana = tempos.length ? tempos[Math.floor(tempos.length / 2)] : null;
const media = tempos.length ? Number((tempos.reduce((a, b) => a + b, 0) / tempos.length).toFixed(1)) : null;

const run = {
  generatedAt: agora.toISOString(),
  ambiente,
  branch,
  commit,
  site,
  curadas: paths.length,
  amostradas: rows.length,
  rastreadas: rastreadas.length,
  cobertura: rows.length ? Number(((rastreadas.length / rows.length) * 100).toFixed(1)) : 0,
  descobertaMedianaHoras: mediana,
  descobertaMediaHoras: media,
  rotasNovasNoManifesto: novas,
  rows,
};

writeFileSync("reports/crawl-metrics.json", `${JSON.stringify(run, null, 2)}\n`);

const history = existsSync(HISTORY) ? JSON.parse(readFileSync(HISTORY, "utf8")) : [];
history.unshift({ ...run, rows: undefined });
writeFileSync(HISTORY, `${JSON.stringify(history.slice(0, 100), null, 2)}\n`);

const naoRastreadas = rows.filter((r) => !r.crawled).sort((a, b) => (b.pendingHours ?? 0) - (a.pendingHours ?? 0));
writeFileSync(
  "reports/crawl-metrics.md",
  [
    "# Rastreamento e tempo de descoberta (GSC)",
    "",
    `- Propriedade: \`${site}\` · ambiente **${ambiente}** · branch **${branch}** · commit \`${commit}\``,
    `- Gerado em: ${run.generatedAt}`,
    `- Rastreadas: **${rastreadas.length}/${rows.length}** (${run.cobertura}%) de ${paths.length} rotas curadas`,
    `- Tempo de descoberta: mediana **${mediana ?? "—"} h** · média ${media ?? "—"} h`,
    "",
    "## Histórico por ambiente/branch",
    "",
    "| Data | Ambiente | Branch | Commit | Rastreadas | Cobertura | Descoberta (mediana) |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...history
      .slice(0, 20)
      .map(
        (h) =>
          `| ${h.generatedAt?.slice(0, 16).replace("T", " ")} | ${h.ambiente} | ${h.branch} | ${h.commit} | ${h.rastreadas}/${h.amostradas} | ${h.cobertura}% | ${h.descobertaMedianaHoras ?? "—"} h |`,
      ),
    "",
    "## Rotas ainda não rastreadas (maior espera primeiro)",
    "",
    naoRastreadas.length
      ? ["| Rota | Horas no manifesto | Estado |", "| --- | --- | --- |", ...naoRastreadas.slice(0, 40).map((r) => `| ${r.path} | ${r.pendingHours ?? "—"} | ${r.coverageState ?? r.error ?? "—"} |`)].join("\n")
      : "_todas as rotas amostradas já foram rastreadas_",
    "",
  ].join("\n"),
);

console.log(
  `crawl metrics: ${rastreadas.length}/${rows.length} rastreadas (${run.cobertura}%) · descoberta mediana ${mediana ?? "—"}h · ${novas} rota(s) nova(s)`,
);
