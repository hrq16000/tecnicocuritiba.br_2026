#!/usr/bin/env node
/**
 * ALERTAS DE SITEMAP/INDEXNOW — dispara quando o status fica degraded/unhealthy.
 *
 * Fonte: reports/sitemap-status.json (gerado por check-sitemap-status.mjs).
 *
 * Canais (todos opcionais, ativados por variável de ambiente):
 *   • Slack     — SLACK_WEBHOOK_URL
 *   • E-mail    — ALERT_EMAIL_TO + RESEND_API_KEY (+ ALERT_EMAIL_FROM)
 *   • PagerDuty — PAGERDUTY_ROUTING_KEY (Events API v2)
 *
 * Uso: node scripts/alert-sitemap-status.mjs [--dry-run] [--strict]
 * Nunca falha o build, salvo com --strict.
 */
import { readFileSync, existsSync } from "node:fs";
import { exitIfLocalMode } from "./lib/local-mode.mjs";

// Ambiente local/offline: nao chama servicos externos.
exitIfLocalMode("Slack/Resend/PagerDuty", "alertas de sitemap");

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const STRICT = args.includes("--strict");
const FILE = "reports/sitemap-status.json";

if (!existsSync(FILE)) {
  console.warn(`[alert-sitemap] ${FILE} ausente — rode check:sitemap-status antes.`);
  process.exit(STRICT ? 1 : 0);
}

const r = JSON.parse(readFileSync(FILE, "utf8"));
if (r.status === "healthy") {
  console.log("[alert-sitemap] status healthy — nenhum alerta disparado.");
  process.exit(0);
}

const severity = r.status === "unhealthy" ? "critical" : "warning";
const linhas = [
  ...r.problems.map((p) => `• [erro] ${p}`),
  ...r.warnings.map((w) => `• [aviso] ${w}`),
];
const titulo = `Sitemap/IndexNow ${r.status.toUpperCase()} — ${r.base}`;
const corpo = [
  titulo,
  `IndexNow: chave ${r.indexNow.key ?? "ausente"} · HTTP ${r.indexNow.remoteStatus ?? "n/d"}`,
  `Sitemap: ${r.sitemap.files} arquivo(s), ${r.sitemap.urls} URL(s) · HTTP ${r.sitemap.remoteStatus ?? "n/d"}`,
  "",
  ...linhas,
].join("\n");

console.log(corpo);
if (DRY) {
  console.log("[alert-sitemap] --dry-run: nada enviado.");
  process.exit(0);
}

const enviados = [];
const falhas = [];

async function post(nome, url, body, headers = {}) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      falhas.push(`${nome} [${res.status}]: ${txt.slice(0, 200)}`);
    } else {
      enviados.push(nome);
    }
  } catch (e) {
    falhas.push(`${nome}: ${e.message}`);
  }
}

// Slack
if (process.env.SLACK_WEBHOOK_URL) {
  await post("slack", process.env.SLACK_WEBHOOK_URL, {
    text: `${severity === "critical" ? ":rotating_light:" : ":warning:"} ${titulo}`,
    blocks: [
      { type: "header", text: { type: "plain_text", text: titulo } },
      { type: "section", text: { type: "mrkdwn", text: linhas.join("\n") || "sem detalhes" } },
    ],
  });
}

// E-mail via Resend
if (process.env.ALERT_EMAIL_TO && process.env.RESEND_API_KEY) {
  await post(
    "email",
    "https://api.resend.com/emails",
    {
      from: process.env.ALERT_EMAIL_FROM || "alertas@tecnico.curitiba.br",
      to: process.env.ALERT_EMAIL_TO.split(",").map((s) => s.trim()),
      subject: titulo,
      text: corpo,
    },
    { authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  );
}

// PagerDuty Events API v2
if (process.env.PAGERDUTY_ROUTING_KEY) {
  await post("pagerduty", "https://events.pagerduty.com/v2/enqueue", {
    routing_key: process.env.PAGERDUTY_ROUTING_KEY,
    event_action: "trigger",
    dedup_key: `sitemap-status-${r.status}`,
    payload: {
      summary: titulo,
      severity,
      source: r.base,
      component: "sitemap-indexnow",
      custom_details: {
        problems: r.problems,
        warnings: r.warnings,
        indexNow: r.indexNow,
        sitemap: r.sitemap,
      },
    },
  });
}

if (enviados.length === 0 && falhas.length === 0) {
  console.warn("[alert-sitemap] nenhum canal configurado (SLACK_WEBHOOK_URL / ALERT_EMAIL_TO+RESEND_API_KEY / PAGERDUTY_ROUTING_KEY).");
} else {
  console.log(`[alert-sitemap] enviados: ${enviados.join(", ") || "nenhum"}`);
  falhas.forEach((f) => console.error("[alert-sitemap] falha:", f));
}

if (STRICT && (r.status === "unhealthy" || falhas.length)) process.exit(1);
