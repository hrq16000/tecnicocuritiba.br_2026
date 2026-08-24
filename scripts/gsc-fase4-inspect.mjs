#!/usr/bin/env node
/**
 * FASE 4 — Estado de indexação real de cada URL do sitemap curado.
 * Somente leitura (URL Inspection). Saída: reports/gsc/index-coverage.json
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";
import { resolveSite, inspectUrl } from "./lib/gsc-client.mjs";

const BASE = "https://tecnico.curitiba.br";
const site = process.env.GSC_SITE_URL || (await resolveSite(`${BASE}/`));
const paths = [...new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)))].sort();
console.log(`${paths.length} URL(s) curadas · propriedade ${site}`);

mkdirSync("reports/gsc", { recursive: true });
const results = [];
const CONC = 4;
let i = 0;
async function worker() {
  while (i < paths.length) {
    const p = paths[i++];
    try {
      const s = await inspectUrl(site, `${BASE}${p}`);
      results.push({ path: p, ...s, indexed: s.verdict === "PASS", error: null });
    } catch (e) {
      results.push({ path: p, verdict: "ERROR", coverageState: "erro", indexed: false, error: e.message.slice(0, 200) });
    }
    if (results.length % 20 === 0) console.log(`  ${results.length}/${paths.length}`);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
results.sort((a, b) => a.path.localeCompare(b.path));
writeFileSync(
  "reports/gsc/index-coverage.json",
  JSON.stringify({ site, geradoEm: new Date().toISOString(), total: results.length, results }, null, 2),
);
const ok = results.filter((r) => r.indexed).length;
console.log(`Indexadas: ${ok}/${results.length} (${((ok / results.length) * 100).toFixed(1)}%)`);
