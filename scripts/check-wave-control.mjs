#!/usr/bin/env node
/**
 * GATE — CONTROLE DE ONDAS (hubs Wi-Fi / Smart TV por bairro).
 *
 * Falha o build quando:
 *   • uma onda publica menos de 4 ou mais de 6 URLs na semana;
 *   • uma URL da onda não tem prova visual mínima (fotos reais em public/);
 *   • uma URL de onda NÃO aprovada já está no sitemap curado;
 *   • uma URL Wi-Fi/TV está no sitemap sem pertencer ao LEGADO nem a uma onda.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { ACTIVE_SITEMAPS } from "./lib/curated-urls.mjs";
import { LEGADO, WAVES, waveStatus } from "./lib/content-waves.mjs";

const existsInPublic = (p) => existsSync(path.resolve("public", p.replace(/^\//, "")));
const curated = new Set(ACTIVE_SITEMAPS.flatMap(([, e]) => e.map((x) => x.path)));
const wifiTv = [...curated].filter((p) => /^\/servicos\/(redes-wifi|manutencao-tv)\//.test(p));

const status = waveStatus(existsInPublic);
const errors = [];

for (const wave of status) {
  errors.push(...wave.problems);
  if (!wave.approved) {
    for (const p of wave.paths) {
      if (curated.has(p)) errors.push(`onda ${wave.week} não aprovada, mas ${p} já está no sitemap curado (deveria seguir noindex)`);
    }
  }
}

const cobertas = new Set([...LEGADO, ...WAVES.flatMap((w) => w.paths)]);
for (const p of wifiTv) {
  if (!cobertas.has(p)) errors.push(`${p} está no sitemap sem onda declarada em scripts/lib/content-waves.mjs`);
}

const aprovadas = status.filter((w) => w.approved).length;
console.log(
  `ondas Wi-Fi/TV: ${WAVES.length} declarada(s), ${aprovadas} aprovada(s) | ${wifiTv.length} URLs indexáveis (${LEGADO.length} legado)`,
);

if (errors.length) {
  console.error(`\nBLOQUEADO: ${errors.length} problema(s) no controle de ondas:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log("OK: controle de ondas consistente.");
