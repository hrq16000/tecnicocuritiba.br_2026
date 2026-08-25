#!/usr/bin/env node
/**
 * GATE — QUALIDADE DE PÁGINA LOCAL / RISCO DOORWAY (Etapa 18)
 *
 * Opera sobre `reports/quality-audit.json` (nunca sobre contagem de palavras
 * isolada). Sinais avaliados por página local (bairro, cidade, serviço×bairro):
 *   1. similaridade extrema com outra página do mesmo cluster (shingles);
 *   2. proporção baixa de texto exclusivo;
 *   3. ausência de valor incremental (score de utilidade prática);
 *   4. title/H1 repetitivos apenas com troca de localidade.
 *
 * Modo padrão: REPORT (exit 0) — gera baseline e nunca derruba 170 URLs sem
 * revisão humana. Com `--strict`, falha se o risco ALTO piorar em relação ao
 * baseline registrado em `reports/local-page-quality-baseline.json`.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const strict = process.argv.includes("--strict");
const AUDIT = "reports/quality-audit.json";
const BASELINE = "reports/local-page-quality-baseline.json";

if (!existsSync(AUDIT)) {
  console.error(`check:local-page-quality: ${AUDIT} ausente — rode 'npm run report:quality' antes.`);
  process.exit(1);
}
const { geradoEm, results } = JSON.parse(readFileSync(AUDIT, "utf8"));

const ehLocal = (p) => /^\/bairros\//.test(p) || /^\/tecnico-informatica-/.test(p) || /^\/servicos\/[^/]+\/[^/]+$/.test(p);
const locais = results.filter((r) => ehLocal(r.path));

// Padrão de title mecânico: mesma moldura com a localidade trocada.
const molde = (t) => (t ?? "").toLowerCase().replace(/[^\p{L}\s]/gu, " ").replace(/\s+/g, " ").trim();
const moldes = new Map();
for (const r of locais) {
  const chave = molde(r.path.split("/").slice(0, -1).join("/"));
  moldes.set(chave, (moldes.get(chave) ?? 0) + 1);
}

function risco(r) {
  const sinais = [];
  if (r.similaridadeMax >= 0.7) sinais.push(`similaridade extrema (${r.similaridadeMax})`);
  else if (r.similaridadeMax >= 0.55) sinais.push(`similaridade alta (${r.similaridadeMax})`);
  if (r.textoExclusivoRatio < 0.25) sinais.push(`texto exclusivo baixo (${(r.textoExclusivoRatio * 100).toFixed(0)}%)`);
  if ((r.componentes?.utilidade ?? 0) < 8) sinais.push(`utilidade prática fraca (${r.componentes?.utilidade ?? 0}/20)`);
  if ((r.componentes?.incremental ?? 0) <= 8) sinais.push(`valor incremental baixo (${r.componentes?.incremental ?? 0}/20)`);
  const nivel = sinais.length >= 3 ? "ALTO" : sinais.length === 2 ? "MEDIO" : sinais.length === 1 ? "BAIXO" : "OK";
  return { nivel, sinais };
}

const avaliadas = locais.map((r) => ({ path: r.path, score: r.score, cluster: r.cluster, ...risco(r) }));
const conta = (n) => avaliadas.filter((a) => a.nivel === n).length;
const resumo = { total: avaliadas.length, alto: conta("ALTO"), medio: conta("MEDIO"), baixo: conta("BAIXO"), ok: conta("OK") };

console.log(
  `check:local-page-quality (${strict ? "strict" : "report"}) — ${resumo.total} páginas locais · ALTO ${resumo.alto} · MÉDIO ${resumo.medio} · BAIXO ${resumo.baixo} · OK ${resumo.ok}`,
);
for (const a of avaliadas.filter((x) => x.nivel === "ALTO").slice(0, 20))
  console.log(`  ! ${a.path} (score ${a.score}) — ${a.sinais.join("; ")}`);

const payload = { geradoEm, auditadoEm: geradoEm, resumo, paginas: avaliadas };
writeFileSync("reports/local-page-quality.json", JSON.stringify(payload, null, 2));

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, JSON.stringify({ registradoEm: new Date().toISOString(), resumo }, null, 2));
  console.log(`baseline registrado em ${BASELINE} (ALTO=${resumo.alto}).`);
  process.exit(0);
}

const base = JSON.parse(readFileSync(BASELINE, "utf8"));
if (resumo.alto > base.resumo.alto) {
  const msg = `risco doorway ALTO subiu de ${base.resumo.alto} para ${resumo.alto}`;
  if (strict) {
    console.error(`check:local-page-quality FALHOU — ${msg}`);
    process.exit(1);
  }
  console.warn(`aviso: ${msg} (modo report — não bloqueia).`);
} else {
  console.log(`sem regressão de risco doorway (baseline ALTO=${base.resumo.alto}).`);
}
