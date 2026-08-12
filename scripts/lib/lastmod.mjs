/**
 * LASTMOD DECLARADO POR URL
 *
 * Fonte única das datas de última atualização relevante de conteúdo, usadas no
 * sitemap para sinalizar frescor ao Google (acelera recrawl de páginas novas ou
 * reescritas). Regras:
 *  - só registre a data quando o CONTEÚDO da página mudou de fato;
 *  - nunca use a data do build como padrão para o site inteiro (sinal ruidoso);
 *  - formato ISO (YYYY-MM-DD).
 */
export const LASTMOD = {
  // Pillar do cluster de informática (Rodada 4I-P.2)
  "/guia-tecnico-informatica": "2026-08-09",
  "/problemas/notebook-nao-liga": "2026-08-09",
  "/problemas/computador-lento": "2026-08-09",
  // Onda 6 — novos sintomas curados
  "/problemas/tela-azul-windows": "2026-08-12",
  "/problemas/notebook-superaquecendo": "2026-08-12",
  // Frente de monetização — página comercial de patrocínio
  "/anuncie": "2026-08-08",
  // Rodada 3L — montagem de PC e periféricos em rede
  "/servicos/montagem-de-pc": "2026-08-06",
  "/servicos/redes-e-wifi": "2026-08-06",
  // Quarta onda editorial (Rodada 3E) — modalidades, home office e dados
  "/atendimento-remoto": "2026-08-06",
  "/atendimento-domicilio": "2026-08-06",
  "/equipamentos-atendidos": "2026-08-06",
  "/areas-atendidas": "2026-08-08",
  "/servicos/suporte-home-office": "2026-08-06",
  "/seguranca-dos-dados": "2026-08-06",
  // Segunda onda editorial (Rodada 3C) + microgate 3C.1
  "/servicos/upgrade-ssd-ram": "2026-08-06",
  "/servicos/recuperacao-de-dados": "2026-08-06",
  "/precos-e-politicas": "2026-08-06",
  "/sobre": "2026-08-06",
  // Primeira onda editorial (Rodada 3B)
  "/servicos/manutencao-de-notebook": "2026-08-04",
  "/servicos/manutencao-de-computador": "2026-08-04",
  "/servicos/formatacao": "2026-08-04",
  "/como-funciona": "2026-08-06",
};

/**
 * Nunca emitir data futura: lastmod à frente de hoje é sinal inválido para o
 * Google e pode fazer a URL ser reavaliada como não confiável. Clampa no dia.
 */
export const lastmodFor = (path) => {
  const declared = LASTMOD[path];
  if (!declared) return null;
  const today = new Date().toISOString().slice(0, 10);
  return declared > today ? today : declared;
};
