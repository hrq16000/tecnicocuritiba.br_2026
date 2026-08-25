#!/usr/bin/env node
/**
 * ETAPA 3 — GATE FAIL-CLOSED DE RECONCILIAÇÃO DAS COORTES
 *
 * Toda URL curada pertence a exatamente uma coorte. Se alguma sumir, aparecer
 * em duas ou ficar sem classificação, a leitura do D14 vira ficção — então o
 * gate falha antes de qualquer análise.
 *
 *   node scripts/check-cohort-reconciliation.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";

const LEDGER = "public/intervencoes-d0.json";
const ESPERADO = { CLEAN_COHORT: 91, INTERVENTION_COHORT: 2, INDIRECT_DISCOVERY_COHORT: 37 };

if (!existsSync(LEDGER)) {
  console.error(`❌ Ledger ausente (${LEDGER}). Rode: npm run intervencao:registrar`);
  process.exit(1);
}

const ledger = JSON.parse(readFileSync(LEDGER, "utf8"));
const erros = [];
const url = (u) => (typeof u === "string" ? u : u.url);

const coortes = {
  CLEAN_COHORT: (ledger.coortes?.CLEAN_COHORT?.urls ?? []).map(url),
  INTERVENTION_COHORT: (ledger.coortes?.INTERVENTION_COHORT?.urls ?? []).map(url),
  INDIRECT_DISCOVERY_COHORT: (ledger.coortes?.INDIRECT_DISCOVERY_COHORT?.urls ?? []).map(url),
};

const pertence = new Map();
for (const [nome, urls] of Object.entries(coortes)) {
  if (urls.length !== ESPERADO[nome])
    erros.push(`${nome}: ${urls.length} URL(s), esperado ${ESPERADO[nome]}`);
  if (new Set(urls).size !== urls.length) erros.push(`${nome}: URLs duplicadas dentro da coorte`);
  for (const u of urls) {
    if (pertence.has(u)) erros.push(`URL em duas coortes mutuamente exclusivas: ${u} (${pertence.get(u)} + ${nome})`);
    else pertence.set(u, nome);
  }
}

for (const p of CURATED_PATHS) if (!pertence.has(p)) erros.push(`URL curada sem classificação de coorte: ${p}`);
for (const u of pertence.keys()) if (!CURATED_PATHS.includes(u)) erros.push(`URL classificada fora do conjunto curado: ${u}`);

const total = Object.values(coortes).reduce((a, u) => a + u.length, 0);
if (total !== CURATED_PATHS.length) erros.push(`Total reconciliado ${total} ≠ ${CURATED_PATHS.length} URLs curadas`);

console.log("Reconciliação de coortes");
for (const [nome, urls] of Object.entries(coortes)) console.log(`  ${nome.padEnd(26)} ${urls.length}`);
console.log(`  ${"TOTAL".padEnd(26)} ${total}/${CURATED_PATHS.length}`);

if (erros.length) {
  console.error(`\n❌ Reconciliação inválida (${erros.length}):`);
  for (const e of erros) console.error(`  • ${e}`);
  process.exit(1);
}
console.log("✅ 91 + 2 + 37 = 130 — coortes íntegras e mutuamente exclusivas.");
