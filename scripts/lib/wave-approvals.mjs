/**
 * LIBERAÇÃO DE ONDAS EM LOTE (fail-closed).
 *
 * Registro persistente das ondas aprovadas manualmente após TODAS as suas URLs
 * passarem em todos os gates (originalidade, prova visual real e provas da onda).
 * Enquanto a semana não estiver aqui, as URLs da onda NÃO entram no sitemap.
 *
 * Arquivo: scripts/lib/wave-approvals.json
 *   { "approvals": [ { "week": "2026-08-17", "approvedAt": "...", "by": "...",
 *                      "paths": [...], "evidence": { ... } } ] }
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const APPROVALS_FILE = path.resolve("scripts/lib/wave-approvals.json");

export function readApprovals() {
  if (!existsSync(APPROVALS_FILE)) return { approvals: [] };
  try {
    const data = JSON.parse(readFileSync(APPROVALS_FILE, "utf8"));
    return { approvals: Array.isArray(data.approvals) ? data.approvals : [] };
  } catch {
    // Registro ilegível => nenhuma onda liberada (fail-closed).
    return { approvals: [] };
  }
}

export function writeApprovals(data) {
  writeFileSync(APPROVALS_FILE, `${JSON.stringify(data, null, 2)}\n`);
}

/** Semanas liberadas. */
export function approvedWeeks() {
  return new Set(readApprovals().approvals.map((a) => a.week));
}

/** URLs liberadas por aprovação em lote. */
export function approvedWavePaths() {
  return new Set(readApprovals().approvals.flatMap((a) => a.paths ?? []));
}
