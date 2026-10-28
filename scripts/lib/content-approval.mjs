/**
 * Converte um relatório de originalidade em exclusões para o sitemap.
 *
 * Relatório ausente (primeiro prebuild): o manifesto curado e a aprovação
 * de ondas continuam sendo a fonte de URLs. Um relatório PRESENTE, porém
 * incompleto/inválido, jamais pode ser ignorado silenciosamente.
 */
export function blockedFromContentApproval(json, curatedPaths) {
  if (json === null) return new Set();

  let report;
  try {
    report = JSON.parse(json);
  } catch {
    throw new Error("content-approval.json inválido: JSON ilegível");
  }
  if (!report || !Array.isArray(report.approved) || !Array.isArray(report.blocked)) {
    throw new Error("content-approval.json inválido: approved[] e blocked[] obrigatórios");
  }

  const curated = new Set(curatedPaths);
  const approved = new Set();
  const blocked = new Set();

  for (const path of report.approved) {
    if (typeof path !== "string" || !curated.has(path) || approved.has(path)) {
      throw new Error("content-approval.json inválido: URL aprovada desconhecida/duplicada");
    }
    approved.add(path);
  }
  for (const item of report.blocked) {
    const path = item?.path;
    if (typeof path !== "string" || !curated.has(path) || blocked.has(path) || approved.has(path)) {
      throw new Error("content-approval.json inválido: URL bloqueada desconhecida/duplicada ou aprovada");
    }
    blocked.add(path);
  }

  const unclassified = [...curated].filter((path) => !approved.has(path) && !blocked.has(path));
  if (unclassified.length) {
    throw new Error(
      "content-approval.json incompleto: " +
        unclassified.length +
        " URL(s) curada(s) sem decisão (ex.: " +
        unclassified[0] +
        ")",
    );
  }
  return blocked;
}
