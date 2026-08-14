#!/usr/bin/env node
/**
 * DASHBOARD DE CI — post-deploy-checklist + Lighthouse por ambiente/branch
 *
 * Consolida em um único painel (com histórico) os resultados de:
 *   - reports/post-deploy-checklist.md   (checklist pós-deploy)
 *   - reports/lighthouse-summary.json    (ou .lighthouseci/*.json)
 *
 * Uso:
 *   node scripts/report-ci-dashboard.mjs --env=producao --branch=main \
 *        --run-url=https://github.com/org/repo/actions/runs/123
 *
 * Saídas:
 *   reports/ci-dashboard-history.json  (histórico acumulado, últimas 100 execuções)
 *   reports/ci-dashboard.md            (painel com links diretos aos artefatos)
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const arg = (n, d = null) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=") ?? d;

const ambiente = arg("env", process.env.DEPLOY_ENV ?? "local");
const branch = arg("branch", process.env.GITHUB_REF_NAME ?? "local");
const commit = (arg("commit", process.env.GITHUB_SHA ?? "")).slice(0, 8) || "—";
const runUrl =
  arg("run-url") ??
  (process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null);

/* ── post-deploy checklist ─────────────────────────────────────────── */
function lerChecklist() {
  const md = "reports/post-deploy-checklist.md";
  if (!existsSync(md)) return { status: "ausente", falhas: null, avisos: null };
  const texto = readFileSync(md, "utf8");
  const n = (re) => Number(texto.match(re)?.[1] ?? NaN);
  const falhas = n(/(\d+)\s+falhas?/i);
  const avisos = n(/(\d+)\s+avisos?/i);
  const temFalha = Number.isFinite(falhas) ? falhas > 0 : /✖|FALHA/.test(texto);
  return {
    status: temFalha ? "falhou" : "ok",
    falhas: Number.isFinite(falhas) ? falhas : null,
    avisos: Number.isFinite(avisos) ? avisos : null,
    artefato: md,
  };
}

/* ── lighthouse ────────────────────────────────────────────────────── */
function lerLighthouse() {
  const resumo = "reports/lighthouse-summary.json";
  if (existsSync(resumo)) {
    try {
      const data = JSON.parse(readFileSync(resumo, "utf8"));
      const rows = Array.isArray(data) ? data : (data.rows ?? []);
      if (rows.length) return agregar(rows);
    } catch {
      /* segue para os JSONs crus */
    }
  }
  const rows = [];
  for (const dir of [".lighthouseci", ".lighthouseci-mobile", ".lighthouseci-empresas"]) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
      try {
        const r = JSON.parse(readFileSync(join(dir, f), "utf8"));
        if (!r.categories) continue;
        rows.push({
          url: r.finalUrl ?? r.requestedUrl ?? f,
          performance: r.categories.performance?.score ?? null,
          accessibility: r.categories.accessibility?.score ?? null,
          seo: r.categories.seo?.score ?? null,
        });
      } catch {
        /* ignora relatório ilegível */
      }
    }
  }
  return rows.length ? agregar(rows) : { status: "ausente" };
}

const media = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
function agregar(rows) {
  const pick = (k) => media(rows.map((r) => r[k]).filter((v) => typeof v === "number"));
  return {
    status: "ok",
    paginas: rows.length,
    performance: pick("performance"),
    accessibility: pick("accessibility"),
    seo: pick("seo"),
    artefato: "reports/lighthouse-summary.md",
  };
}

/* ── registro + histórico ──────────────────────────────────────────── */
mkdirSync("reports", { recursive: true });
const HIST = "reports/ci-dashboard-history.json";
const historico = existsSync(HIST) ? JSON.parse(readFileSync(HIST, "utf8")) : { execucoes: [] };

const execucao = {
  data: new Date().toISOString(),
  ambiente,
  branch,
  commit,
  runUrl,
  checklist: lerChecklist(),
  lighthouse: lerLighthouse(),
};
historico.execucoes.unshift(execucao);
historico.execucoes = historico.execucoes.slice(0, 100);
writeFileSync(HIST, JSON.stringify(historico, null, 2));

const pct = (v) => (typeof v === "number" ? `${Math.round(v * 100)}` : "—");
const link = (e, arquivo) => (e.runUrl ? `[${arquivo}](${e.runUrl})` : arquivo);

const porAmbiente = [...new Set(historico.execucoes.map((e) => `${e.ambiente} · ${e.branch}`))];

writeFileSync(
  "reports/ci-dashboard.md",
  [
    "# Dashboard de CI — pós-deploy + Lighthouse",
    "",
    `Atualizado em ${execucao.data} · ambientes/branches monitorados: ${porAmbiente.join(", ")}`,
    "",
    "| Data | Ambiente | Branch | Commit | Checklist | Falhas | LH perf | LH a11y | LH SEO | Artefatos |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...historico.execucoes
      .slice(0, 30)
      .map(
        (e) =>
          `| ${e.data.slice(0, 16).replace("T", " ")} | ${e.ambiente} | ${e.branch} | ${e.commit} | ${e.checklist.status} | ${e.checklist.falhas ?? "—"} | ${pct(e.lighthouse.performance)} | ${pct(e.lighthouse.accessibility)} | ${pct(e.lighthouse.seo)} | ${link(e, "post-deploy")} · ${link(e, "lighthouse")} |`,
      ),
    "",
    "Histórico completo (100 execuções): `reports/ci-dashboard-history.json`.",
  ].join("\n"),
);

console.log(
  `dashboard CI: ${ambiente}/${branch} · checklist=${execucao.checklist.status} · LH perf=${pct(execucao.lighthouse.performance)} → reports/ci-dashboard.md`,
);
