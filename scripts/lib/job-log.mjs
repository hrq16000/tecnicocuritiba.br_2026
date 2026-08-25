/**
 * ============================================================================
 * REGISTRO DE EXECUÇÃO DE JOBS OPERACIONAIS
 * ============================================================================
 * Cada job da fase de operação (coleta de marco, reindexação, análise D7/D14,
 * diff de snapshots) grava aqui: quando rodou, quanto durou, se o fail-closed
 * passou, quantas entradas foram verificadas e as linhas de log relevantes.
 *
 * Fonte única para a seção "Execução de jobs" em /admin/monitoramento.
 * Guarda as 60 execuções mais recentes; nunca inventa dado (ausente = null).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ARQ = "reports/job-runs.json";
const PUB = "public/job-runs.json";
const LIMITE = 60;

const ler = () => {
  try {
    return existsSync(ARQ) ? JSON.parse(readFileSync(ARQ, "utf8")) : { execucoes: [] };
  } catch {
    return { execucoes: [] };
  }
};

/**
 * @param {object} run
 * @param {string} run.job          identificador estável ("snapshot:marco", "reindex:snapshots", ...)
 * @param {string} [run.marco]      marco associado (D0/D7/D14/D30) quando houver
 * @param {number} run.duracaoMs
 * @param {"ok"|"falhou"|"aviso"} run.status
 * @param {boolean|null} [run.failClosed]  resultado da verificação fail-closed
 * @param {object} [run.contagens]  contagens verificadas (urls, snapshots, memórias...)
 * @param {string[]} [run.logs]     linhas de log já formatadas
 */
export function registrarJob(run) {
  const dados = ler();
  dados.execucoes = [
    {
      id: `${run.job}-${Date.now()}`,
      job: run.job,
      marco: run.marco ?? null,
      executadoEm: new Date().toISOString(),
      duracaoMs: Math.round(run.duracaoMs ?? 0),
      status: run.status ?? "ok",
      failClosed: run.failClosed ?? null,
      contagens: run.contagens ?? {},
      logs: (run.logs ?? []).slice(0, 40),
    },
    ...(dados.execucoes ?? []),
  ].slice(0, LIMITE);
  dados.atualizadoEm = new Date().toISOString();

  mkdirSync("reports", { recursive: true });
  mkdirSync("public", { recursive: true });
  const payload = `${JSON.stringify(dados, null, 2)}\n`;
  writeFileSync(ARQ, payload);
  writeFileSync(PUB, payload);
  return dados.execucoes[0];
}
