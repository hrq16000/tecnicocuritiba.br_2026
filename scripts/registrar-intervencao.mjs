#!/usr/bin/env node
/**
 * SELO DE GOVERNANÇA — INTERVENÇÃO PÚBLICA NA JANELA D0 → D14
 *
 * O que faz:
 *   1. lê os eventos declarativos de `scripts/lib/intervencoes.mjs`;
 *   2. deriva as URLs de descoberta indireta (novos inbound do diretório);
 *   3. valida que nenhuma URL intervencionada/indireta é consolidada,
 *      redirect, 404 ou fora do conjunto curado;
 *   4. separa CLEAN_COHORT × INTERVENTION_COHORT × INDIRECT_DISCOVERY_COHORT;
 *   5. sela o ledger com cadeia de hash SHA-256 (append-only) e cria o
 *      manifesto FREEZE_V2 do estado público pós-intervenção.
 *
 * Nunca reescreve D0/D7: apenas registra o que mudou depois deles.
 *
 * Uso:
 *   node scripts/registrar-intervencao.mjs           # sela e grava
 *   node scripts/registrar-intervencao.mjs --check   # valida sem gravar
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { CURATED_PATHS } from "./lib/curated-urls.mjs";
import { LEDGER_SCHEMA, D0, INTERVENCOES } from "./lib/intervencoes.mjs";

const CHECK = process.argv.includes("--check");
const OUT = path.resolve("public/intervencoes-d0.json");

const sha = (v) => createHash("sha256").update(typeof v === "string" ? v : JSON.stringify(v)).digest("hex");

/** Destinos curados que o diretório de localidades passou a linkar. */
const destinosDiretorio = () =>
  CURATED_PATHS.filter((p) => /^\/(bairros\/|tecnico-informatica-)/.test(p)).sort();

const curado = new Set(CURATED_PATHS);
const erros = [];

const eventos = INTERVENCOES.map((ev, i) => {
  const indiretas =
    ev.urlsIndiretas === "DERIVAR_DO_DIRETORIO"
      ? destinosDiretorio().filter((u) => !ev.urlsDiretas.includes(u))
      : [...ev.urlsIndiretas];

  for (const u of [...ev.urlsDiretas, ...indiretas]) {
    if (!curado.has(u)) erros.push(`${ev.id}: URL fora do conjunto curado → ${u}`);
    if (u !== u.replace(/\/+$/, "") && u !== "/") erros.push(`${ev.id}: URL não canônica → ${u}`);
  }
  if (!ev.timestamp || Number.isNaN(Date.parse(ev.timestamp)))
    erros.push(`${ev.id}: timestamp UTC inválido`);
  if (Date.parse(ev.timestamp) < Date.parse(D0.registradoEm))
    erros.push(`${ev.id}: intervenção anterior ao D0 — não pertence a esta janela`);

  return { ...ev, ordem: i + 1, urlsIndiretas: indiretas };
});

// Cadeia de hash append-only: cada evento sela o anterior.
let anterior = sha(`${LEDGER_SCHEMA}|${D0.registradoEm}|${D0.universoCurado}`);
const selados = eventos.map((ev) => {
  const hash = sha(`${anterior}|${ev.id}|${ev.timestamp}|${ev.urlsDiretas.join(",")}|${ev.mudanca}`);
  const out = { ...ev, hashAnterior: anterior, hash };
  anterior = hash;
  return out;
});

const diretas = [...new Set(selados.flatMap((e) => e.urlsDiretas))].sort();
const indiretas = [...new Set(selados.flatMap((e) => e.urlsIndiretas))]
  .filter((u) => !diretas.includes(u))
  .sort();
const clean = CURATED_PATHS.filter((p) => !diretas.includes(p) && !indiretas.includes(p)).sort();

// FREEZE_V2 — manifesto do estado público pós-intervenção.
const hashesArquivo = existsSync("public/content-hashes.json")
  ? sha(readFileSync("public/content-hashes.json", "utf8"))
  : null;

const ledger = {
  schema: LEDGER_SCHEMA,
  atualizadoEm: new Date().toISOString(),
  baseline: { ...D0, imutavel: true },
  politica: {
    freeze_v1: "baseline original D0 — ZERO_PUBLIC_SEO_DIFF",
    intervention_event: `${selados.length} intervenção(ões) pública(s) registrada(s) na janela WAIT`,
    freeze_v2: "estado público pós-intervenção; nenhuma nova alteração pública até o D14 real",
    d14Valido: true,
    d14Earliest: "2026-09-08T01:49:17.273Z",
    declaracaoObrigatoriaNoD14: `Experimento global possui intervenção controlada em ${diretas.length} URL(s) diretas e ${indiretas.length} URL(s) de descoberta indireta.`,
  },
  eventos: selados,
  coortes: {
    CLEAN_COHORT: { total: clean.length, urls: clean },
    INTERVENTION_COHORT: {
      total: diretas.length,
      urls: diretas.map((u) => ({
        url: u,
        experimental_status: "INTERVENED",
        intervention_at:
          selados.find((e) => e.urlsDiretas.includes(u))?.timestamp ?? null,
      })),
    },
    INDIRECT_DISCOVERY_COHORT: {
      total: indiretas.length,
      motivo: "novo inbound recebido do diretório de localidades em /areas-atendidas",
      urls: indiretas.map((u) => ({ url: u, experimental_status: "INDIRECT_DISCOVERY_INTERVENTION" })),
    },
  },
  universoCurado: CURATED_PATHS.length,
  freezeV2: {
    criadoEm: new Date().toISOString(),
    contentHashesRef: hashesArquivo,
    curadoHash: sha(CURATED_PATHS.slice().sort().join("\n")),
    regra: "Qualquer alteração pública após este selo exige NOVO evento de intervenção.",
  },
};
ledger.selo = sha({ ...ledger, selo: undefined, atualizadoEm: undefined, freezeV2: { ...ledger.freezeV2, criadoEm: undefined } });

if (erros.length) {
  console.error(`\n❌ Ledger de intervenções inválido (${erros.length}):`);
  for (const e of erros) console.error(`  • ${e}`);
  process.exit(1);
}

if (!CHECK) writeFileSync(OUT, `${JSON.stringify(ledger, null, 2)}\n`);

console.log("✅ Intervenções seladas");
console.log(`   eventos:               ${selados.length}`);
console.log(`   CLEAN_COHORT:          ${clean.length}`);
console.log(`   INTERVENTION_COHORT:   ${diretas.length} (${diretas.join(", ")})`);
console.log(`   INDIRECT_DISCOVERY:    ${indiretas.length}`);
console.log(`   universo curado:       ${CURATED_PATHS.length}`);
console.log(`   selo:                  ${ledger.selo.slice(0, 16)}…`);
if (CHECK) console.log("   (modo --check: nada gravado)");
