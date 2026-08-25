#!/usr/bin/env node
/**
 * GATE ANTIDOORWAY — QUALIDADE DE PÁGINA LOCAL
 *
 * Opera sobre `reports/quality-audit.json` (nunca sobre contagem de palavras
 * isolada). Sinais avaliados por página local (bairro, cidade, serviço×bairro):
 *   1. similaridade extrema com outra página do mesmo cluster (shingles);
 *   2. proporção baixa de texto exclusivo;
 *   3. ausência de valor incremental (score de utilidade prática);
 *   4. title/H1 repetitivos apenas com troca de localidade.
 *
 * URLs consolidadas na Fase Final (301) são excluídas: elas não são páginas
 * indexáveis, logo não entram no piso de qualidade nem no baseline.
 *
 * Modalidades:
 *   --report (padrão) → diagnóstico, exit 0, atualiza reports/*.json
 *   --gate            → governança: falha em REGRESSÃO NOVA
 *                        (path que não estava ALTO no baseline curado,
 *                         página local nova abaixo do piso de qualidade,
 *                         ou aumento do total ALTO)
 *   --rebaseline      → registra o baseline explícito do conjunto curado atual
 *   --strict          → alias histórico de --gate (compatibilidade de CI)
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { CONSOLIDATED_LOCAL_PATHS } from "./lib/consolidated-local-urls.mjs";

const argv = process.argv.slice(2);
const gate = argv.includes("--gate") || argv.includes("--strict");
const rebaseline = argv.includes("--rebaseline");
const AUDIT = "reports/quality-audit.json";
const BASELINE = "reports/local-page-quality-baseline.json";

/**
 * PISO DE QUALIDADE (Fase Final) — não é meta de palavras.
 * Uma página local nova só é aceitável se combinar score mínimo, exclusividade
 * mínima e similaridade máxima controlada.
 */
export const QUALITY_FLOOR = {
  score: 60,
  textoExclusivoRatio: 0.16,
  similaridadeMax: 0.55,
};

if (!existsSync(AUDIT)) {
  console.error(`check:local-page-quality: ${AUDIT} ausente — rode 'npm run report:quality' antes.`);
  process.exit(1);
}
const { geradoEm, results } = JSON.parse(readFileSync(AUDIT, "utf8"));

const ehLocal = (p) =>
  /^\/bairros\//.test(p) || /^\/tecnico-informatica-/.test(p) || /^\/servicos\/[^/]+\/[^/]+$/.test(p);
const locais = results.filter((r) => ehLocal(r.path) && !CONSOLIDATED_LOCAL_PATHS.has(r.path));

function risco(r) {
  const sinais = [];
  if (r.similaridadeMax >= 0.7) sinais.push(`similaridade extrema (${r.similaridadeMax})`);
  else if (r.similaridadeMax >= 0.55) sinais.push(`similaridade alta (${r.similaridadeMax})`);
  if (r.textoExclusivoRatio < 0.25)
    sinais.push(`texto exclusivo baixo (${(r.textoExclusivoRatio * 100).toFixed(0)}%)`);
  if ((r.componentes?.utilidade ?? 0) < 8)
    sinais.push(`utilidade prática fraca (${r.componentes?.utilidade ?? 0}/20)`);
  if ((r.componentes?.incremental ?? 0) <= 8)
    sinais.push(`valor incremental baixo (${r.componentes?.incremental ?? 0}/20)`);
  const nivel = sinais.length >= 3 ? "ALTO" : sinais.length === 2 ? "MEDIO" : sinais.length === 1 ? "BAIXO" : "OK";
  return { nivel, sinais };
}

/** Causa provável dominante — orienta a correção editorial, não só o alarme. */
function causaProvavel(r, sinais) {
  if (r.similaridadeMax >= 0.55 && r.textoExclusivoRatio < 0.15) return "TEMPLATE_OVERUSE";
  if ((r.componentes?.incremental ?? 0) <= 8) return "LOW_INCREMENTAL_VALUE";
  if ((r.componentes?.utilidade ?? 0) < 8) return "THIN_INFORMATION";
  return sinais.length ? "WEAK_LOCAL_CONTEXT" : "OK";
}

const avaliadas = locais.map((r) => {
  const { nivel, sinais } = risco(r);
  return {
    path: r.path,
    score: r.score,
    cluster: r.cluster,
    tier: r.tier ?? null,
    exclusivoPct: Math.round((r.textoExclusivoRatio ?? 0) * 100),
    similaridadeMax: r.similaridadeMax ?? 0,
    parMaisParecido: r.parMaisParecido ?? null,
    impressions: r.impressions ?? 0,
    gscStatus: r.gscStatus ?? null,
    nivel,
    sinais,
    causaProvavel: causaProvavel(r, sinais),
  };
});

const conta = (n) => avaliadas.filter((a) => a.nivel === n).length;
const resumo = {
  total: avaliadas.length,
  alto: conta("ALTO"),
  medio: conta("MEDIO"),
  baixo: conta("BAIXO"),
  ok: conta("OK"),
  consolidadas: CONSOLIDATED_LOCAL_PATHS.size,
};

console.log(
  `check:local-page-quality (${gate ? "gate" : "report"}) — ${resumo.total} páginas locais curadas · ALTO ${resumo.alto} · MÉDIO ${resumo.medio} · BAIXO ${resumo.baixo} · OK ${resumo.ok} · consolidadas fora do conjunto ${resumo.consolidadas}`,
);
for (const a of avaliadas.filter((x) => x.nivel === "ALTO").slice(0, 20))
  console.log(`  ! ${a.path} (score ${a.score}, ${a.causaProvavel}) — ${a.sinais.join("; ")}`);

const payload = { geradoEm, auditadoEm: geradoEm, floor: QUALITY_FLOOR, resumo, paginas: avaliadas };
writeFileSync("reports/local-page-quality.json", JSON.stringify(payload, null, 2));

const altoPaths = avaliadas.filter((a) => a.nivel === "ALTO").map((a) => a.path).sort();

if (rebaseline || !existsSync(BASELINE)) {
  writeFileSync(
    BASELINE,
    `${JSON.stringify(
      {
        registradoEm: new Date().toISOString(),
        origem: "Fase Final — baseline explícito do conjunto curado pós-consolidação",
        floor: QUALITY_FLOOR,
        resumo,
        altoPaths,
        paths: avaliadas.map((a) => a.path).sort(),
      },
      null,
      2,
    )}\n`,
  );
  console.log(`baseline registrado em ${BASELINE} (ALTO=${resumo.alto}, curadas=${resumo.total}).`);
  process.exit(0);
}

const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const baseAlto = new Set(base.altoPaths ?? []);
const basePaths = new Set(base.paths ?? []);
const falhas = [];

// 1. Regressão nova: página que não estava ALTO no baseline curado.
for (const a of avaliadas) {
  if (a.nivel === "ALTO" && basePaths.has(a.path) && !baseAlto.has(a.path)) {
    falhas.push(`regressão: ${a.path} entrou em risco ALTO (${a.causaProvavel}) — ${a.sinais.join("; ")}`);
  }
}

// 2. Página local NOVA abaixo do piso de qualidade.
for (const a of avaliadas) {
  if (basePaths.has(a.path)) continue;
  const abaixo =
    a.score < QUALITY_FLOOR.score ||
    a.exclusivoPct / 100 < QUALITY_FLOOR.textoExclusivoRatio ||
    a.similaridadeMax > QUALITY_FLOOR.similaridadeMax;
  if (abaixo) {
    falhas.push(
      `página local nova abaixo do piso: ${a.path} (score ${a.score}, exclusivo ${a.exclusivoPct}%, sim ${a.similaridadeMax}) — piso score ${QUALITY_FLOOR.score} / exclusivo ${QUALITY_FLOOR.textoExclusivoRatio * 100}% / sim ≤ ${QUALITY_FLOOR.similaridadeMax}`,
    );
  }
}

// 3. Piora agregada do risco ALTO.
if (resumo.alto > (base.resumo?.alto ?? 0)) {
  falhas.push(`risco doorway ALTO subiu de ${base.resumo?.alto} para ${resumo.alto}`);
}

if (!falhas.length) {
  console.log(
    `sem regressão antidoorway (baseline ALTO=${base.resumo?.alto} sobre ${base.resumo?.total} páginas curadas).`,
  );
  process.exit(0);
}

for (const f of falhas) console.error(`  ✗ ${f}`);
if (gate) {
  console.error(`check:local-page-quality FALHOU — ${falhas.length} regressão(ões).`);
  process.exit(1);
}
console.warn(`aviso: ${falhas.length} regressão(ões) (modo report — não bloqueia).`);
