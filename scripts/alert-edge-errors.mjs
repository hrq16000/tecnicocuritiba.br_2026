#!/usr/bin/env node
/**
 * ALERTAS DE BORDA — taxa de 404 e erros 5xx acima do limite.
 *
 * Fontes:
 *   1. reports/edge-smoke.json        — smoke sintético pós-deploy
 *   2. Cloudflare GraphQL Analytics   — tráfego real das últimas 24h
 *      (opcional: CLOUDFLARE_API_TOKEN + CLOUDFLARE_ZONE_ID)
 *
 * Dispara alerta quando, no tráfego real:
 *   - taxa de 404 > --max-404 (padrão 5%)
 *   - taxa de 5xx > --max-5xx (padrão 1%)
 * ou quando o smoke sintético apresenta qualquer falha.
 *
 * Canais: SLACK_WEBHOOK_URL e/ou ALERT_EMAIL_TO + RESEND_API_KEY.
 * Nunca falha o build salvo com --strict.
 *
 * Uso: node scripts/alert-edge-errors.mjs [--max-404=5] [--max-5xx=1] [--strict] [--dry-run]
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { exitIfLocalMode } from "./lib/local-mode.mjs";

// Ambiente local/offline: nao chama servicos externos.
exitIfLocalMode("Cloudflare/Slack/Resend", "alertas de borda");

const args = process.argv.slice(2);
const num = (n, d) => Number(args.find((a) => a.startsWith(`--${n}=`))?.split("=")[1] ?? d);
const DRY = args.includes("--dry-run");
const STRICT = args.includes("--strict");
const MAX_404 = num("max-404", 5);
const MAX_5XX = num("max-5xx", 1);

const SITE = "https://tecnico.curitiba.br";
const REPO_DOCS = "docs/relatorio-smoke-edge.md";

const read = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null);
const smoke = read("reports/edge-smoke.json");
const coverage = read("reports/redirect-coverage.json");

const alerts = [];

if (smoke?.failures?.length) {
  alerts.push({
    kind: "Smoke de borda",
    detail: `${smoke.failures.length} falha(s) no smoke sintético (${smoke.base})`,
    samples: smoke.failures.slice(0, 5),
  });
}
if (coverage && coverage.coberturaAliasPct < 100) {
  alerts.push({
    kind: "Cobertura de redirects",
    detail: `apenas ${coverage.coberturaAliasPct}% dos aliases respondem 301 correto`,
    samples: (coverage.divergences ?? []).slice(0, 5).map((d) => `${d.from} → ${d.observado}`),
  });
}

/** Tráfego real via Cloudflare GraphQL (opcional). */
async function edgeTraffic() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID;
  if (!token || !zone) return null;
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const query = `query($zone:String!,$since:Time!){viewer{zones(filter:{zoneTag:$zone}){httpRequestsAdaptiveGroups(limit:200,filter:{datetime_geq:$since}){count dimensions{edgeResponseStatus}}}}}`;
  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ query, variables: { zone, since } }),
  });
  if (!res.ok) {
    console.warn(`[alert-edge] Cloudflare analytics indisponível [${res.status}]`);
    return null;
  }
  const json = await res.json();
  const groups = json?.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups ?? [];
  if (!groups.length) return null;
  let total = 0;
  let c404 = 0;
  let c5xx = 0;
  for (const g of groups) {
    const status = Number(g.dimensions?.edgeResponseStatus ?? 0);
    total += g.count;
    if (status === 404) c404 += g.count;
    if (status >= 500) c5xx += g.count;
  }
  const pct = (v) => (total ? Math.round((v / total) * 10000) / 100 : 0);
  return { total, c404, c5xx, pct404: pct(c404), pct5xx: pct(c5xx), windowHours: 24 };
}

const traffic = await edgeTraffic();
if (traffic) {
  if (traffic.pct404 > MAX_404) {
    alerts.push({ kind: "Taxa de 404 no edge", detail: `${traffic.pct404}% em 24h (limite ${MAX_404}%) — ${traffic.c404}/${traffic.total} requests` });
  }
  if (traffic.pct5xx > MAX_5XX) {
    alerts.push({ kind: "Erros 5xx no edge", detail: `${traffic.pct5xx}% em 24h (limite ${MAX_5XX}%) — ${traffic.c5xx}/${traffic.total} requests` });
  }
}

const payload = {
  geradoEm: new Date().toISOString(),
  limites: { max404Pct: MAX_404, max5xxPct: MAX_5XX },
  trafegoReal: traffic,
  alertas: alerts,
  artefatos: {
    smoke: "reports/edge-smoke.json",
    smokeMd: REPO_DOCS,
    cobertura: "reports/redirect-coverage.json",
    coberturaMd: "docs/relatorio-cobertura-redirects.md",
    healthCheck: `${SITE}/__edge/health`,
  },
};
mkdirSync("reports", { recursive: true });
writeFileSync("reports/edge-alerts.json", JSON.stringify(payload, null, 2));

if (!alerts.length) {
  console.log("✔ [alert-edge] sem alertas — 404/5xx dentro do limite e smoke verde.");
  process.exit(0);
}

const lines = [
  `*Alertas de borda — ${SITE}*`,
  ...alerts.map((a) => `• *${a.kind}*: ${a.detail}${a.samples?.length ? `\n   - ${a.samples.join("\n   - ")}` : ""}`),
  "",
  `Artefatos: \`${REPO_DOCS}\`, \`docs/relatorio-cobertura-redirects.md\`, health: ${SITE}/__edge/health`,
].join("\n");

console.log(lines);

if (DRY) process.exit(STRICT ? 1 : 0);

const webhook = process.env.SLACK_WEBHOOK_URL;
if (webhook) {
  const r = await fetch(webhook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: lines }) });
  console.log(`[alert-edge] slack → ${r.status}`);
}

const to = process.env.ALERT_EMAIL_TO;
const resend = process.env.RESEND_API_KEY;
if (to && resend) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${resend}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.ALERT_EMAIL_FROM ?? "alertas@tecnico.curitiba.br",
      to: [to],
      subject: `[edge] ${alerts.length} alerta(s) em ${SITE}`,
      text: lines,
    }),
  });
  console.log(`[alert-edge] e-mail → ${r.status}`);
}

if (STRICT) process.exitCode = 1;
