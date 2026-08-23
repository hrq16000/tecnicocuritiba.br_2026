#!/usr/bin/env node
/**
 * ALERTAS DE SEO/PERFORMANCE — Slack (Incoming Webhook) e/ou e-mail (Resend).
 *
 * Lê os artefatos já produzidos pelo job semanal e dispara alerta quando:
 *   - Core Web Vitals (LCP/INP/CLS) regridem ou estouram o orçamento
 *     → reports/web-vitals.json (campo `alerts`)
 *   - o rank WoW piora nas consultas locais monitoradas
 *     → reports/rank-tracking.json (quedas de posição)
 *   - uma URL prioritária perde indexação → reports/gsc-indexing.json
 *
 * Variáveis de ambiente:
 *   SLACK_WEBHOOK_URL      opcional — canal de alerta
 *   ALERT_EMAIL_TO         opcional — destinatário do alerta por e-mail
 *   RESEND_API_KEY         obrigatório junto com ALERT_EMAIL_TO
 *   ALERT_EMAIL_FROM       remetente verificado (padrão: alertas@tecnico.curitiba.br)
 *
 * Nunca falha o build: o bloqueio é responsabilidade dos gates.
 * Uso: node scripts/notify-seo-alerts.mjs [--always] [--rank-drop=3]
 */
import { readFileSync, existsSync } from "node:fs";
import { exitIfLocalMode } from "./lib/local-mode.mjs";

// Ambiente local/offline: nao chama servicos externos.
exitIfLocalMode("Slack/Resend", "alertas de SEO");

const args = process.argv.slice(2);
const ALWAYS = args.includes("--always");
const RANK_DROP = Number(args.find((a) => a.startsWith("--rank-drop="))?.split("=")[1] ?? 3);

const read = (file) => {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
};

const vitals = read("reports/web-vitals.json");
const rank = read("reports/rank-tracking.json");
const indexing = read("reports/gsc-indexing.json");

const alerts = [];

for (const a of vitals?.alerts ?? []) alerts.push({ kind: "Core Web Vitals", detail: a });

const rankRows = rank?.queries ?? rank?.rows ?? [];
for (const r of rankRows) {
  // positionWow positivo = ganho; negativo = queda de posição.
  const wow = r.positionWow ?? r.deltaPosition ?? null;
  if (wow != null && wow <= -RANK_DROP) {
    alerts.push({
      kind: "Rank WoW",
      detail: `"${r.query}"${r.path ? ` (${r.path})` : ""} caiu ${Math.abs(wow)} posições (agora ${r.position ?? "—"})`,
    });
  }
}

for (const u of indexing?.urls ?? []) {
  if (u.indexed === false || u.verdict === "NOT_INDEXED") {
    alerts.push({ kind: "Indexação", detail: `${u.path ?? u.url} não indexada no Search Console` });
  }
}

const repo = process.env.GITHUB_REPOSITORY ?? "tecnico.curitiba.br";
const runUrl =
  process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null;
const runbookUrl = process.env.GITHUB_SERVER_URL
  ? `${process.env.GITHUB_SERVER_URL}/${repo}/blob/main/docs/runbook-deploy.md`
  : "docs/runbook-deploy.md";
const artifactsLine = (runUrl
  ? `Artefatos do relatório: ${runUrl}#artifacts (web-vitals.md, rank-tracking.md, weekly-seo.md)`
  : "Artefatos locais em reports/ (web-vitals.md, rank-tracking.md, weekly-seo.md).") +
  `\nRunbook de deploy/rollback: ${runbookUrl}`;

if (!alerts.length && !ALWAYS) {
  console.log("[alertas] nenhuma regressão de Web Vitals, rank ou indexação — nada a notificar.");
  process.exit(0);
}

const title = alerts.length
  ? `🚨 ${alerts.length} alerta(s) de SEO/performance — ${repo}`
  : `✅ Sem regressões de SEO/performance — ${repo}`;
const body = alerts.length
  ? alerts.map((a) => `• [${a.kind}] ${a.detail}`).join("\n")
  : "Web Vitals, rank WoW e indexação dentro do esperado.";

console.log(title);
console.log(body);

let delivered = 0;

const webhook = process.env.SLACK_WEBHOOK_URL;
if (webhook) {
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: title,
        blocks: [
          { type: "header", text: { type: "plain_text", text: title.slice(0, 150) } },
          { type: "section", text: { type: "mrkdwn", text: body.slice(0, 2800) } },
          { type: "context", elements: [{ type: "mrkdwn", text: artifactsLine }] },
        ],
      }),
    });
    if (!res.ok) console.error(`[slack] falhou [${res.status}]: ${(await res.text()).slice(0, 300)}`);
    else delivered += 1;
  } catch (e) {
    console.error(`[slack] erro de rede: ${e.message}`);
  }
} else {
  console.log("[slack] SLACK_WEBHOOK_URL não configurado — pulando.");
}

const to = process.env.ALERT_EMAIL_TO;
const resendKey = process.env.RESEND_API_KEY;
if (to && resendKey) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ALERT_EMAIL_FROM ?? "alertas@tecnico.curitiba.br",
        to: to.split(",").map((s) => s.trim()),
        subject: title,
        text: `${body}\n\n${artifactsLine}`,
      }),
    });
    if (!res.ok) console.error(`[email] falhou [${res.status}]: ${(await res.text()).slice(0, 300)}`);
    else delivered += 1;
  } catch (e) {
    console.error(`[email] erro de rede: ${e.message}`);
  }
} else if (to && !resendKey) {
  console.log("[email] ALERT_EMAIL_TO definido sem RESEND_API_KEY — pulando.");
}

console.log(`[alertas] ${delivered} canal(is) notificado(s).`);
