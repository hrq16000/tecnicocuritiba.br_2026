#!/usr/bin/env node
/**
 * FASE 4 — Ingestão bruta do Google Search Console (somente leitura).
 * Salva datasets crus em reports/gsc/ para diagnóstico posterior.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { gsc, resolveSite, searchAnalytics, dayOffset } from "./lib/gsc-client.mjs";

const site = process.env.GSC_SITE_URL || (await resolveSite("https://tecnico.curitiba.br/"));
mkdirSync("reports/gsc", { recursive: true });

const janelas = {
  "90d": { startDate: dayOffset(-92), endDate: dayOffset(-2) },
  "28d": { startDate: dayOffset(-30), endDate: dayOffset(-2) },
};

const out = { site, geradoEm: new Date().toISOString(), janelas, datasets: {} };

async function q(nome, janela, dimensions, extra = {}) {
  const rows = await searchAnalytics(site, {
    ...janelas[janela],
    dimensions,
    rowLimit: 25000,
    dataState: "all",
    ...extra,
  });
  out.datasets[nome] = { janela, dimensions, rows: rows.length };
  writeFileSync(`reports/gsc/${nome}.json`, JSON.stringify({ site, janela: janelas[janela], dimensions, rows }, null, 2));
  console.log(`${nome}: ${rows.length} linha(s)`);
  return rows;
}

await q("queries-90d", "90d", ["query"]);
await q("queries-28d", "28d", ["query"]);
await q("pages-90d", "90d", ["page"]);
await q("pages-28d", "28d", ["page"]);
await q("page-query-90d", "90d", ["page", "query"]);
await q("device-90d", "90d", ["device"]);
await q("appearance-90d", "90d", ["searchAppearance"]);
await q("date-90d", "90d", ["date"]);

// Sitemaps
try {
  const sm = await gsc(`/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps`);
  writeFileSync("reports/gsc/sitemaps.json", JSON.stringify(sm, null, 2));
  console.log(`sitemaps: ${(sm.sitemap ?? []).length}`);
  out.datasets.sitemaps = (sm.sitemap ?? []).length;
} catch (e) {
  console.log(`sitemaps: indisponível — ${e.message}`);
  out.datasets.sitemaps = null;
}

writeFileSync("reports/gsc/_manifest.json", JSON.stringify(out, null, 2));
console.log(`Propriedade: ${site}`);
