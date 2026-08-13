#!/usr/bin/env node
/**
 * APROVAR ONDA EM LOTE — libera as URLs de uma onda para o sitemap.
 *
 * Fail-closed: só grava a aprovação quando TODAS as URLs da onda passam em
 * TODOS os gates consolidados em public/publish-status.json
 * (originalidade, prova visual real, provas da onda).
 *
 * Uso:
 *   npm run report:publish-status          # atualiza o consolidado
 *   npm run onda:aprovar -- --week=2026-08-17
 *   npm run onda:aprovar -- --week=2026-08-17 --revogar
 *   npm run onda:listar
 */
import { existsSync, readFileSync } from "node:fs";
import { WAVES } from "./lib/content-waves.mjs";
import { readApprovals, writeApprovals, APPROVALS_FILE } from "./lib/wave-approvals.mjs";

const args = process.argv.slice(2);
const arg = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const week = arg("week");
const revogar = args.includes("--revogar");
const listar = args.includes("--listar") || !week;

const registro = readApprovals();

if (listar) {
  console.log(`Ondas declaradas: ${WAVES.length}`);
  for (const w of WAVES) {
    const ok = registro.approvals.some((a) => a.week === w.week);
    console.log(`  ${ok ? "✔ liberada" : "· bloqueada"}  ${w.week}  (${w.paths.length} URLs)`);
  }
  if (!week) process.exit(0);
}

const onda = WAVES.find((w) => w.week === week);
if (!onda) {
  console.error(`✗ onda "${week}" não existe em scripts/lib/content-waves.mjs`);
  process.exit(1);
}

if (revogar) {
  writeApprovals({ approvals: registro.approvals.filter((a) => a.week !== week) });
  console.log(`onda ${week} revogada — URLs voltam a ficar fora do sitemap.`);
  process.exit(0);
}

const STATUS_FILE = "public/publish-status.json";
if (!existsSync(STATUS_FILE)) {
  console.error(`✗ ${STATUS_FILE} ausente. Rode antes: npm run report:publish-status`);
  process.exit(1);
}
const status = JSON.parse(readFileSync(STATUS_FILE, "utf8"));
const porPath = new Map((status.urls ?? []).map((u) => [u.path, u]));

const problemas = [];
for (const p of onda.paths) {
  const u = porPath.get(p);
  if (!u) {
    problemas.push(`${p}: sem status no relatório (rode report:publish-status)`);
    continue;
  }
  if (u.originalidade.ok !== true) {
    problemas.push(`${p}: originalidade ${u.originalidade.words ?? "?"}/${u.originalidade.minWords ?? "?"} palavras`);
  }
  if (u.provaVisual.ok !== true) {
    problemas.push(`${p}: prova visual não aprovada (${u.provaVisual.fotos ?? 0} foto(s))`);
  }
  if (u.onda.approved !== true) problemas.push(`${p}: onda sem provas mínimas`);
  for (const b of u.bloqueios) problemas.push(`${p}: ${b}`);
}

if (problemas.length) {
  console.error(`\nBLOQUEADO: onda ${week} tem ${problemas.length} pendência(s):`);
  for (const p of [...new Set(problemas)]) console.error(`  ✗ ${p}`);
  console.error("\nNenhuma URL foi liberada. Corrija as pendências e rode de novo.");
  process.exit(1);
}

const approvals = registro.approvals.filter((a) => a.week !== week);
approvals.push({
  week,
  approvedAt: new Date().toISOString(),
  by: process.env.USER || process.env.LOGNAME || "operador",
  paths: [...onda.paths],
  evidence: {
    publishStatusGeneratedAt: status.generatedAt,
    fontes: status.fontes ?? null,
  },
});
approvals.sort((a, b) => a.week.localeCompare(b.week));
writeApprovals({ approvals });

console.log(`✔ onda ${week} liberada em lote — ${onda.paths.length} URLs entram no próximo sitemap.`);
console.log(`  registro: ${APPROVALS_FILE}`);
console.log("  próximo passo: npm run build (gera sitemap) e ping IndexNow.");
