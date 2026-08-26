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

import { CONSOLIDATED_LOCAL_URLS } from "./consolidatedLocalUrls";

export interface RedirectRule {
  /** Caminho antigo/alias (sempre começando com "/"). */
  from: string;
  /** Destino canônico e indexável. */
  to: string;
  /** Por que a regra existe — documentação viva para auditoria. */
  motivo:
    | "url-antiga"
    | "variacao-slug"
    | "alias-pf"
    | "alias-pj"
    | "alias-institucional"
    | "consolidacao-local";
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

  // ── Artigos editoriais antigos consolidados ─────────────────
  // Estes slugs existiram no acervo, mas não pertencem à onda editorial
  // aprovada. Links externos não devem terminar em 404: cada URL aponta
  // para a página canônica que responde à mesma necessidade.
  { from: "/blog/quando-trocar-hd-por-ssd", to: "/servicos/upgrade-ssd-ram", motivo: "url-antiga" },
  { from: "/blog/como-instalar-segundo-ssd-notebook", to: "/servicos/upgrade-ssd-ram", motivo: "url-antiga" },
  { from: "/blog/como-clonar-hd-para-ssd", to: "/servicos/upgrade-ssd-ram", motivo: "url-antiga" },
  { from: "/blog/erros-comuns-upgrade-computador", to: "/servicos/upgrade-ssd-ram", motivo: "url-antiga" },
  { from: "/blog/como-saber-se-pc-tem-virus-malware", to: "/servicos/remocao-de-virus", motivo: "url-antiga" },
  { from: "/blog/backup-como-proteger-seus-arquivos", to: "/seguranca-dos-dados", motivo: "url-antiga" },
  { from: "/blog/backup-nuvem-empresas-qual-escolher", to: "/servicos/backup-para-empresas", motivo: "url-antiga" },
  { from: "/blog/notebook-superaquecendo-o-que-fazer", to: "/problemas/notebook-superaquecendo", motivo: "url-antiga" },
  { from: "/blog/como-trocar-pasta-termica-notebook", to: "/problemas/notebook-superaquecendo", motivo: "url-antiga" },
  { from: "/blog/como-limpar-notebook-por-dentro", to: "/servicos/manutencao-de-notebook", motivo: "url-antiga" },
  { from: "/blog/como-diagnosticar-placa-mae-defeituosa", to: "/servicos/conserto-placa", motivo: "url-antiga" },
  { from: "/blog/como-testar-fonte-de-alimentacao-pc", to: "/problemas/computador-nao-liga", motivo: "url-antiga" },
  { from: "/blog/wifi-lento-como-melhorar", to: "/servicos/redes-e-wifi", motivo: "url-antiga" },
  { from: "/blog/como-configurar-rede-wifi-empresarial", to: "/empresa-de-ti-curitiba", motivo: "url-antiga" },
  { from: "/blog/como-montar-pc-do-zero-guia-completo", to: "/servicos/montagem-de-pc", motivo: "url-antiga" },
  { from: "/blog/como-configurar-bios-uefi-corretamente", to: "/servicos/montagem-de-pc", motivo: "url-antiga" },
  { from: "/blog/preciso-de-um-plataforma-prestadores", to: "/seja-parceiro", motivo: "url-antiga" },
  { from: "/blog/como-cadastrar-preciso-de-um", to: "/seja-parceiro", motivo: "url-antiga" },
  { from: "/blog/preciso-de-um-todos-os-ramos", to: "/seja-parceiro", motivo: "url-antiga" },
  { from: "/blog/preciso-de-um-vagas-oportunidades", to: "/seja-parceiro", motivo: "url-antiga" },

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
  // /empresas deixou de ser alias: passou a servir a landing B2B (noindex) com
  // formulário de triagem empresarial. Os aliases /para-empresas e /ti-para-empresas
  // continuam apontando para a página institucional indexável.
  { from: "/ti-para-empresas", to: "/empresa-de-ti-curitiba", motivo: "alias-pj" },
  { from: "/suporte-corporativo", to: "/empresa-de-ti-curitiba", motivo: "alias-pj" },

  // ── Consolidação local (Fase Final) ─────────────────────────
  // Landings serviço × bairro sem intenção independente comprovada. A lista é
  // gerada por `scripts/apply-local-consolidation.mjs` a partir da auditoria.
  ...CONSOLIDATED_LOCAL_URLS.map(
    (r): RedirectRule => ({ from: r.from, to: r.to, motivo: "consolidacao-local" }),
  ),
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
