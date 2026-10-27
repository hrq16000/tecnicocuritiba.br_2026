/**
 * Contextos estreitos que explicam limites ou descrevem tecnologia.
 * A análise é por ocorrência: uma negativa nunca libera outra promessa na linha.
 */
export function isNonPromotionalClaim(rule, line, match) {
  const before = line.slice(0, match.index);
  const after = line.slice(match.index + match[0].length);

  if (rule === "recuperacao-garantida") {
    return /O que não prometemos:\s*$/iu.test(before);
  }
  if (rule === "garantia-total") {
    return /\bnão vendemos\s+$/iu.test(before);
  }
  if (rule === "sla") {
    return /\b(?:sem inventar|não publicamos)\s+$/iu.test(before) ||
      (/Resina \($/u.test(before) && /^\/DLP\/LCD\)/u.test(after));
  }
  if (rule === "mesmo-dia") {
    // Pergunta não afirma prazo; uma promessa na resposta continua sendo avaliada.
    const question = /["']?question["']?\s*:\s*["'][^"']*$/u.test(before);
    if (question && /^\?["']/u.test(after)) return true;
    // Orientação para encaminhar equipamento molhado, sem prazo de execução.
    return /Não há um prazo exato, mas a diferença entre encaminhar(?: no)?\s+$/u.test(before) &&
      /^ e esperar uma semana\b/u.test(after);
  }
  return false;
}
