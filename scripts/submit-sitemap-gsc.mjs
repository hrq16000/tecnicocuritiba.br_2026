#!/usr/bin/env node
/**
 * SUBMISSÃO / PING DO SITEMAP NO GOOGLE SEARCH CONSOLE (Rodada 1)
 *
 * Fluxo obrigatório: lista as propriedades verificadas, resolve a que cobre
 * o domínio canônico e só então envia (PUT) e lê o status do sitemap.
 *
 * Uso:
 *   node scripts/submit-sitemap-gsc.mjs                 # submete + lê status
 *   node scripts/submit-sitemap-gsc.mjs --status-only   # só leitura
 *
 * Saída: reports/sitemap-submissions.json (histórico append-only)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { gsc, resolveSite } from "./lib/gsc-client.mjs";
import { exitIfLocalMode } from "./lib/local-mode.mjs";

exitIfLocalMode("Search Console", "submissão de sitemap");

const BASE = process.env.SITE_BASE_URL || "https://tecnico.curitiba.br";
const SITEMAP = `${BASE}/sitemap-index.xml`;
const STATUS_ONLY = process.argv.includes("--status-only");
const LEDGER = resolve("reports/sitemap-submissions.json");

const site = await resolveSite(BASE);
const encoded = `${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(SITEMAP)}`;

if (!STATUS_ONLY) {
  await gsc(`/webmasters/v3/sites/${encoded}`, { method: "PUT" });
  console.log(`sitemap submetido: ${SITEMAP} → ${site}`);
}

const status = await gsc(`/webmasters/v3/sites/${encoded}`);
const entry = {
  at: new Date().toISOString(),
  site,
  sitemap: SITEMAP,
  submitted: !STATUS_ONLY,
  lastSubmitted: status.lastSubmitted ?? null,
  lastDownloaded: status.lastDownloaded ?? null,
  isPending: status.isPending ?? null,
  errors: Number(status.errors ?? 0),
  warnings: Number(status.warnings ?? 0),
  urlsSubmitted: Number(status.contents?.[0]?.submitted ?? 0),
  urlsIndexed: Number(status.contents?.[0]?.indexed ?? 0),
};

mkdirSync("reports", { recursive: true });
const history = existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, "utf8")) : [];
history.push(entry);
writeFileSync(LEDGER, `${JSON.stringify(history.slice(-200), null, 2)}\n`);

console.log(JSON.stringify(entry, null, 2));
// Contagens de erro do GSC são contagens, não causas: sinalizamos sem adivinhar.
if (entry.errors > 0) console.warn(`ATENÇÃO: Search Console reporta ${entry.errors} erro(s) no sitemap (causa não informada pela API).`);
