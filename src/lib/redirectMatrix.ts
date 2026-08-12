// ─────────────────────────────────────────────────────────────
// MATRIZ ÚNICA DE REDIRECTS INTERNOS (301)
//
// Fonte de verdade para:
//  • as rotas <Navigate replace> do SPA (React Router),
//  • a exportação de regras 301 para o CDN (Cloudflare/Nginx/Apache),
//  • o gate de CI `check:index-health`, que valida que todo `to`
//    responde 200 com canonical self-referente.
//
// Regra de ouro: um alias NUNCA pode ter canonical próprio nem entrar
// no sitemap — ele só existe para preservar link equity de URLs antigas
// e de variações de intenção (PF × PJ).
// ─────────────────────────────────────────────────────────────

export interface RedirectRule {
  /** Caminho antigo/alias (sempre começando com "/"). */
  from: string;
  /** Destino canônico e indexável. */
  to: string;
  /** Por que a regra existe — documentação viva para auditoria. */
  motivo: "url-antiga" | "variacao-slug" | "alias-pf" | "alias-pj" | "alias-institucional";
}

export const REDIRECT_MATRIX: RedirectRule[] = [
  // ── Slugs de serviço antigos ────────────────────────────────
  { from: "/servicos/formatacao-computador", to: "/servicos/formatacao", motivo: "variacao-slug" },
  { from: "/servicos/remocao-virus", to: "/servicos/remocao-de-virus", motivo: "variacao-slug" },
  { from: "/servicos/upgrade-ssd-memoria", to: "/servicos/upgrade-ssd-ram", motivo: "variacao-slug" },
  { from: "/servicos/conserto-pc-notebook", to: "/servicos/manutencao-de-computador", motivo: "variacao-slug" },
  { from: "/servicos/conserto-notebook-curitiba", to: "/servicos/manutencao-de-notebook", motivo: "variacao-slug" },
  { from: "/servicos/redes-wifi", to: "/servicos/redes-e-wifi", motivo: "variacao-slug" },
  { from: "/tecnico-informatica-sao-jose-dos-pinhais", to: "/tecnico-informatica-sao-jose-pinhais", motivo: "variacao-slug" },
  { from: "/servicos/backup-recuperacao", to: "/servicos/recuperacao-de-dados", motivo: "variacao-slug" },
  // PC Gamer é intenção de busca da mesma página de montagem — alias, nunca
  // página duplicada (evita canibalização com /servicos/montagem-de-pc).
  { from: "/servicos/pc-gamer", to: "/servicos/montagem-de-pc", motivo: "variacao-slug" },
  { from: "/servicos/montagem-de-pc-gamer", to: "/servicos/montagem-de-pc", motivo: "variacao-slug" },
  // "tela azul" é a mesma intenção da página publicada — alias, nunca página
  // duplicada (evitaria canibalizar /problemas/tela-azul-windows).
  { from: "/problemas/tela-azul", to: "/problemas/tela-azul-windows", motivo: "variacao-slug" },
  { from: "/pc-gamer-curitiba", to: "/servicos/montagem-de-pc", motivo: "url-antiga" },

  // ── URLs comerciais antigas (raiz) ──────────────────────────
  { from: "/formatacao-de-computador-curitiba", to: "/servicos/formatacao", motivo: "url-antiga" },
  { from: "/remocao-de-virus-curitiba", to: "/servicos/remocao-de-virus", motivo: "url-antiga" },
  { from: "/upgrade-ssd-curitiba", to: "/servicos/upgrade-ssd-ram", motivo: "url-antiga" },
  { from: "/upgrade-memoria-ram-curitiba", to: "/servicos/upgrade-ssd-ram", motivo: "url-antiga" },
  { from: "/conserto-de-notebook-curitiba", to: "/servicos/manutencao-de-notebook", motivo: "url-antiga" },
  { from: "/suporte-tecnico-remoto", to: "/atendimento-remoto", motivo: "url-antiga" },
  { from: "/assistencia-tecnica-empresas-curitiba", to: "/servicos/suporte-tecnico-empresarial", motivo: "url-antiga" },
  { from: "/suporte-empresas", to: "/servicos/suporte-tecnico-empresarial", motivo: "url-antiga" },

  // ── Procedimentos migrados para /procedimentos/* ────────────
  { from: "/reflow-bga-curitiba", to: "/procedimentos/reflow-bga-curitiba", motivo: "url-antiga" },
  { from: "/reballing-bga-curitiba", to: "/procedimentos/reballing-bga-curitiba", motivo: "url-antiga" },
  { from: "/troca-chip-bga-curitiba", to: "/procedimentos/troca-chip-bga-curitiba", motivo: "url-antiga" },
  { from: "/microsoldagem-celular-curitiba", to: "/procedimentos/microsoldagem-celular-curitiba", motivo: "url-antiga" },
  { from: "/recapacitacao-placa-eletronica-curitiba", to: "/procedimentos/recapacitacao-placa-eletronica-curitiba", motivo: "url-antiga" },

  // ── Institucionais ──────────────────────────────────────────
  { from: "/privacidade", to: "/politica-de-privacidade", motivo: "alias-institucional" },
  { from: "/termos", to: "/precos-e-politicas", motivo: "alias-institucional" },
  { from: "/valores", to: "/precos-e-politicas", motivo: "alias-institucional" },
  { from: "/precos", to: "/precos-e-politicas", motivo: "alias-institucional" },
  { from: "/termos-condicoes-valores", to: "/precos-e-politicas", motivo: "alias-institucional" },
  // Intenção comercial de mídia: uma única página canônica (/anuncie).
  { from: "/publicidade", to: "/anuncie", motivo: "alias-institucional" },


  // ── Aliases de intenção PF (pessoa física / residencial) ────
  { from: "/pessoa-fisica", to: "/atendimento-domicilio", motivo: "alias-pf" },
  { from: "/para-voce", to: "/atendimento-domicilio", motivo: "alias-pf" },
  { from: "/residencial", to: "/atendimento-domicilio", motivo: "alias-pf" },
  { from: "/tecnico-a-domicilio", to: "/atendimento-domicilio", motivo: "alias-pf" },

  // ── Aliases de intenção PJ (empresa / corporativo) ──────────
  { from: "/pessoa-juridica", to: "/empresa-de-ti-curitiba", motivo: "alias-pj" },
  { from: "/para-empresas", to: "/empresa-de-ti-curitiba", motivo: "alias-pj" },
  { from: "/empresas", to: "/empresa-de-ti-curitiba", motivo: "alias-pj" },
  { from: "/ti-para-empresas", to: "/empresa-de-ti-curitiba", motivo: "alias-pj" },
  { from: "/suporte-corporativo", to: "/empresa-de-ti-curitiba", motivo: "alias-pj" },
];

/** Conjunto de aliases — nenhum deles pode entrar no sitemap. */
export const REDIRECT_SOURCES = new Set(REDIRECT_MATRIX.map((r) => r.from));

/** Destinos únicos — todos devem responder 200 com canonical self-referente. */
export const REDIRECT_TARGETS = [...new Set(REDIRECT_MATRIX.map((r) => r.to))];

/** Resolve um alias para o destino canônico (ou null se não for alias). */
export function resolveRedirect(path: string): string | null {
  const clean = path.replace(/\/+$/, "") || "/";
  return REDIRECT_MATRIX.find((r) => r.from === clean)?.to ?? null;
}
