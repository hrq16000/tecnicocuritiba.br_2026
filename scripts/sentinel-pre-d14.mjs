#!/usr/bin/env node
/**
 * SENTINELA PRÉ-D14 — MONITORAMENTO PASSIVO
 *
 * Agrega os gates já existentes (freeze v2, coortes, janela temporal, live,
 * lastmod, indexnow) em um artefato compacto. NÃO altera nada público:
 * apenas lê artefatos e escreve reports/pre-d14-sentinel.json.
 *
 *   node scripts/sentinel-pre-d14.mjs [--gate]
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { avaliarJanela } from "./lib/marco-janela.mjs";

const ler = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const rodar = (script) => spawnSync("node", [script], { encoding: "utf8" });

const freezeRun = rodar("scripts/check-seo-freeze-v2.mjs");
const cohortRun = rodar("scripts/check-cohort-reconciliation.mjs");

const live = ler("reports/live-validation.json");
const drift = ler("public/freeze-v2-drift.json");
const ledger = ler("public/intervencoes-d0.json");
const marcos = ler("public/operacao-marcos.json") ?? { marcos: [] };
const indexnow = ler("public/indexation-daily.json")?.indexnow ?? null;

const janela = avaliarJanela("D14", marcos);
const coortes = {
  CLEAN: ledger?.coortes?.CLEAN_COHORT?.urls?.length ?? null,
  DIRECT: ledger?.coortes?.INTERVENTION_COHORT?.urls?.length ?? null,
  INDIRECT: ledger?.coortes?.INDIRECT_DISCOVERY_COHORT?.urls?.length ?? null,
};

const publicDrift = drift?.resumo?.PUBLIC_CHANGE_NAO_REGISTRADO ?? (freezeRun.status === 0 ? 0 : null);
const regressoes = live?.totais?.problemas ?? null;
const indexnowInesperado = indexnow?.submitted ?? 0;

const sentinela = {
  schema: "pre-d14-sentinel/1.0",
  checked_at: new Date().toISOString(),
  temporal_status: janela.ok ? "D14_READY" : "D14_LOCKED",
  next_valid_at: janela.elegivelEm,
  freeze_v2_status: freezeRun.status === 0 ? "PASS" : "FAIL",
  public_drift: publicDrift,
  cohort_reconciliation: {
    status: cohortRun.status === 0 ? "PASS" : "FAIL",
    ...coortes,
    total: (coortes.CLEAN ?? 0) + (coortes.DIRECT ?? 0) + (coortes.INDIRECT ?? 0),
  },
  indexability_regressions: regressoes,
  redirect_regressions: live?.totais?.falhas ?? null,
  unexpected_lastmod: drift?.lastmod?.UNEXPECTED_CHANGE?.length ?? 0,
  unexpected_indexnow: indexnowInesperado,
  quick_wins_active: 0,
  observational_only: true,
  alert_status:
    freezeRun.status === 0 && cohortRun.status === 0 && !regressoes && !indexnowInesperado
      ? "HEALTHY"
      : "INVESTIGATE",
  decision: "WAIT",
};

mkdirSync("reports", { recursive: true });
writeFileSync("reports/pre-d14-sentinel.json", `${JSON.stringify(sentinela, null, 2)}\n`);
console.log(JSON.stringify(sentinela, null, 2));

if (process.argv.includes("--gate") && sentinela.alert_status !== "HEALTHY") process.exit(1);
