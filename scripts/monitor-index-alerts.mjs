#!/usr/bin/env node
/**
 * MONITOR PÓS-DEPLOY — URLs aprovadas que ainda não aparecem no Google.
 *
 * Entrada:
 *   • reports/content-approval.json  (URLs que passaram no gate de originalidade)
 *   • sitemap curado (ACTIVE_SITEMAPS) — o que realmente foi submetido
 *   • reports/index-state.json       (histórico local, opcional)
 *
 * Verificação de indexação:
 *   • se GSC_ACCESS_TOKEN e GSC_SITE_URL estiverem no ambiente, usa a
 *     URL Inspection API (leitura do estado no índice do Google);
 *   • sem credenciais, roda em modo "pendências por prazo": alerta toda URL
 *     aprovada há mais de ALERT_AFTER_DAYS dias sem confirmação de indexação.
 *
 * NUNCA inventa status: sem evidência, marca `desconhecido`.
 *
 * Uso: node scripts/monitor-index-alerts.mjs [--days=7]
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";
import { siteConfigBaseUrl } from "./lib/site-base-url.mjs";

const ALERT_AFTER_DAYS = Number((process.argv.find((a) => a.startsWith("--days=")) || "--days=7").split("=")[1]);
const STATE = "reports/index-state.json";
const token = process.env.GSC_ACCESS_TOKEN;
const siteUrl = process.env.GSC_SITE_URL;

const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const approval = readJson("reports/content-approval.json");
const prev = readJson(STATE) ?? { urls: {} };

const curated = new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)));
const aprovadas = (approval?.approved ?? []).filter((p) => curated.has(p));

if (!aprovadas.length) {
  console.log("monitor-index: nenhuma URL aprovada no sitemap — rode o gate de originalidade primeiro.");
  process.exit(0);
}

const hoje = new Date().toISOString().slice(0, 10);
const base = siteConfigBaseUrl();

async function inspect(loc) {
  if (!token || !siteUrl) return { verdict: "desconhecido", detail: "sem credenciais GSC" };
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inspectionUrl: loc, siteUrl }),
  });
  if (!res.ok) return { verdict: "erro", detail: `HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` };
  const json = await res.json();
  const idx = json?.inspectionResult?.indexStatusResult ?? {};
  return {
    verdict: idx.verdict === "PASS" ? "indexada" : (idx.coverageState ?? "desconhecido"),
    detail: idx.coverageState ?? null,
    lastCrawl: idx.lastCrawlTime ?? null,
  };
}

const urls = {};
const alertas = [];

for (const p of aprovadas) {
  const anterior = prev.urls?.[p] ?? {};
  const aprovadaEm = anterior.aprovadaEm ?? hoje;
  const estado = await inspect(`${base}${p}`);

  const diasDesdeAprovacao = Math.floor((Date.now() - new Date(aprovadaEm).getTime()) / 86_400_000);
  const indexada = estado.verdict === "indexada";

  urls[p] = {
    aprovadaEm,
    verdict: estado.verdict,
    detail: estado.detail ?? null,
    lastCrawl: estado.lastCrawl ?? anterior.lastCrawl ?? null,
    indexadaEm: indexada ? (anterior.indexadaEm ?? hoje) : (anterior.indexadaEm ?? null),
    checadaEm: hoje,
  };

  if (!urls[p].indexadaEm && diasDesdeAprovacao >= ALERT_AFTER_DAYS) {
    alertas.push(
      `${p} — aprovada há ${diasDesdeAprovacao} dia(s), status "${estado.verdict}"${estado.detail ? ` (${estado.detail})` : ""}`,
    );
  }
}

mkdirSync("reports", { recursive: true });
writeFileSync(
  path.resolve(STATE),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), base, fonte: token ? "gsc-url-inspection" : "prazo", alertAfterDays: ALERT_AFTER_DAYS, urls }, null, 2)}\n`,
);

const indexadas = Object.values(urls).filter((u) => u.indexadaEm).length;
console.log(
  `monitor-index: ${aprovadas.length} URL(s) aprovada(s) no sitemap · ${indexadas} com indexação confirmada · ${alertas.length} alerta(s)` +
    (token ? "" : " (modo prazo: sem credenciais GSC, indexação não confirmada)"),
);
for (const a of alertas) console.log(`  ⚠ ${a}`);
