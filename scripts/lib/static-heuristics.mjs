/**
 * MODO DE VALIDAÇÃO ALTERNATIVO (heurístico) PARA OS GATES EM `--static`.
 *
 * Este app é uma SPA hidratada: parte das rotas do dist/ traz apenas o shell.
 * Antes, qualquer gate rodando em `--static` recusava o build inteiro
 * ("exige DOM renderizado"), o que travava a auditoria enquanto o Chromium do
 * Playwright não estivesse instalado.
 *
 * A alternativa aqui é classificar cada URL pela densidade do HTML estático:
 *
 *   • "estatico-confiavel" — o HTML já traz corpo real (texto suficiente e
 *     seções/h2). Nesse caso a medição estática vale e o gate pode reprovar.
 *   • "shell"              — só o shell da SPA. A medição não vale; a URL fica
 *     PENDENTE (não aprovada, não reprovada) e não derruba o build.
 *
 * Assim o gate continua fail-closed para publicação (pendente ≠ aprovada),
 * mas para de bloquear a auditoria por falta de navegador.
 */

/** Mínimo de caracteres de texto no <main> para considerar o HTML confiável. */
export const MIN_CHARS_CONFIAVEL = 1200;
/** Mínimo de seções <h2> para considerar o HTML confiável. */
export const MIN_H2_CONFIAVEL = 2;

export const semTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Recorta o <main> quando existir (evita contar header/footer globais). */
export const corpoPrincipal = (html) => {
  const m = html?.match(/<main[\s\S]*?<\/main>/i);
  return m ? m[0] : (html ?? "");
};

/**
 * Classifica a confiança da leitura estática de uma rota.
 * @returns {{ confianca: "estatico-confiavel"|"shell"|"ausente", chars:number, h2:number, motivo:string }}
 */
export function classificarEstatico(html) {
  if (!html) return { confianca: "ausente", chars: 0, h2: 0, motivo: "HTML não encontrado no dist" };
  const main = corpoPrincipal(html);
  const chars = semTags(main).length;
  const h2 = (main.match(/<h2[\s>]/gi) ?? []).length;
  if (chars >= MIN_CHARS_CONFIAVEL && h2 >= MIN_H2_CONFIAVEL) {
    return { confianca: "estatico-confiavel", chars, h2, motivo: `${chars} caracteres e ${h2} seções no HTML` };
  }
  return {
    confianca: "shell",
    chars,
    h2,
    motivo: `HTML traz só o shell (${chars} caracteres, ${h2} seções) — medição estática não é conclusiva`,
  };
}

/** Resumo textual para o console/relatório. */
export function resumoHeuristico(itens) {
  const conta = (c) => itens.filter((i) => i.confianca === c).length;
  return {
    confiaveis: conta("estatico-confiavel"),
    shell: conta("shell"),
    ausentes: conta("ausente"),
  };
}
