// ─────────────────────────────────────────────────────────────
// REGISTRO EDITORIAL FAIL-CLOSED — fonte única de aprovação de conteúdo.
//
// Regra inegociável: um artigo só é indexável / publicável se possuir
// um registro EXPLÍCITO e TIPADO de aprovação. Sem registro válido, o
// artigo é tratado como rascunho (draft): noindex, fora do sitemap,
// fora da listagem pública e sem schema de autoria pessoal.
//
// A aprovação NÃO pode depender de: categoria, data, presença de
// conteúdo, presença de imagem, slug, origem (manual/programática)
// ou tema. Depende exclusivamente deste registro.
//
// Estado inicial: ZERO artigos aprovados.
// ─────────────────────────────────────────────────────────────

import { siteConfig } from "@/lib/siteConfig";

export type EditorialStatus = "draft" | "in_review" | "approved" | "archived";

export type EditorialAuthorType = "organization" | "person";

export type EditorialImageOrigin = "owned" | "licensed" | "generated" | "unknown";

export interface EditorialApproval {
  slug: string;
  status: EditorialStatus;
  authorType: EditorialAuthorType;
  /** Identificador do autor aprovado (ex.: "org:tecnico-em-curitiba"). */
  authorId: string;
  /** Data ISO da revisão editorial (opcional até revisão material). */
  reviewedAt?: string;
  /** Data ISO real da aprovação — obrigatória para status approved. */
  approvedAt?: string;
  imageOrigin: EditorialImageOrigin;
  imageLicense?: string;
  imageAttribution?: string;
  notes?: string;
}

// Autoria institucional temporária. Enquanto não houver autor pessoal
// real e verificado, a autoria é a própria entidade oficial.
// Todos os dados vêm de siteConfig — nunca duplicar manualmente.
export const INSTITUTIONAL_AUTHOR = {
  id: "org:tecnico-em-curitiba",
  type: "organization" as EditorialAuthorType,
  name: siteConfig.brandName,
  url: siteConfig.baseUrl,
} as const;

// Publisher institucional oficial (alinhado à entidade da marca).
export const EDITORIAL_PUBLISHER = {
  name: siteConfig.brandName,
  url: siteConfig.baseUrl,
  logo: `${siteConfig.baseUrl}/logo.png`,
} as const;

// ─────────────────────────────────────────────────────────────
// PRIMEIRA ONDA EDITORIAL INDEXÁVEL (Rodada 4H).
//
// Cada item abaixo só entrou após: revisão técnica concluída e
// fact-check registrado (src/lib/blogEditorialSources.ts), capa
// própria com origem declarada (src/lib/blogEditorialCovers.ts) e
// aprovação editorial datada. Artigos fora deste Map permanecem
// noindex, follow, fora do sitemap e fora da listagem pública.
//
// Espelho de build/gates: scripts/lib/editorial-wave.mjs.
// ─────────────────────────────────────────────────────────────
const FIRST_WAVE_APPROVED_AT = "2026-08-06";

// Rodada 3F — liberação controlada: os dois guias que disputavam a mesma
// intenção das novas páginas de sintoma (/problemas/notebook-nao-liga e
// /problemas/computador-lento) voltaram para revisão (noindex, follow) e
// o guia de superaquecimento entrou no lugar, apoiando manutenção de
// notebook. Limite da onda: 6 artigos.
// Rodada 3O — onda educacional empresarial: dois conteúdos já existentes no
// acervo (nenhuma rota nova) promovidos após revisão técnica, capa própria e
// interlinking de entrada. Limite total de artigos indexáveis: 7.
// Rodada de curadoria (2026-08-16): cinco guias voltaram para revisão editorial
// para compor a fila-piloto de 8 conteúdos in_review. Permanecem indexáveis
// apenas os dois conteúdos empresariais da onda 3O.
const FIRST_WAVE_SLUGS = [
  "organizacao-de-ti-para-pequenos-escritorios",
  "como-escolher-uma-workstation",
] as const;


export const APPROVED_EDITORIAL_CONTENT = new Map<string, EditorialApproval>(
  FIRST_WAVE_SLUGS.map((slug) => [
    slug,
    {
      slug,
      status: "approved" as EditorialStatus,
      authorType: "organization" as EditorialAuthorType,
      authorId: INSTITUTIONAL_AUTHOR.id,
      reviewedAt: FIRST_WAVE_APPROVED_AT,
      approvedAt: FIRST_WAVE_APPROVED_AT,
      imageOrigin: "generated" as EditorialImageOrigin,
      imageLicense: "Ativo gerado sob encomenda para uso próprio da marca",
      imageAttribution: "Técnico em Curitiba",
      notes:
        "Revisão técnica concluída e fact-check registrado em blogEditorialSources.ts; capa própria conforme briefing.",
    },
  ]),
);


// ─────────────────────────────────────────────────────────────
// FILA DE REVISÃO EDITORIAL (in_review) — separada dos aprovados.
//
// Os oito conteúdos-piloto foram reescritos com profundidade, mas
// NÃO estão aprovados: seguem noindex, fora do sitemap e fora da
// listagem pública. Esta fila é apenas um registro de trabalho.
// Ela NÃO influencia isEditorialApproved() — a única fonte de
// indexabilidade continua sendo APPROVED_EDITORIAL_CONTENT.
//
// Regras para cada item aqui:
//   status: "in_review"
//   authorType: "organization" (autoria institucional; sem pessoa)
//   authorId: entidade oficial (INSTITUTIONAL_AUTHOR.id)
//   imageOrigin: "unknown" (nenhuma imagem aprovada)
//   approvedAt: AUSENTE
//   reviewedAt: AUSENTE (não houve revisão material concluída)
// ─────────────────────────────────────────────────────────────
// Fila-piloto: artigos ainda em revisão (noindex, fora do sitemap).
// Os slugs promovidos na primeira onda (FIRST_WAVE_SLUGS) saíram desta fila.
export const EDITORIAL_PILOT_SLUGS = [
  "como-instalar-windows-11-do-zero",
  // Rodada 3F: despromovidos por sobreposição de intenção com as páginas
  // de sintoma /problemas/notebook-nao-liga e /problemas/computador-lento.
  "notebook-nao-liga-o-que-fazer",
  "computador-lento-causas-solucoes",
  // Curadoria 2026-08-16: despromovidos dos indexados para fechar a fila
  // piloto em exatamente 8 conteúdos in_review (noindex, fora do sitemap).
  "quando-trocar-hd-por-ssd",
  "como-saber-se-pc-tem-virus-malware",
  "backup-como-proteger-seus-arquivos",
  "como-melhorar-sinal-wifi-em-casa",
  "notebook-superaquecendo-o-que-fazer",
] as const;


export const EDITORIAL_REVIEW_QUEUE = new Map<string, EditorialApproval>(
  EDITORIAL_PILOT_SLUGS.map((slug) => [
    slug,
    {
      slug,
      status: "in_review" as EditorialStatus,
      authorType: "organization" as EditorialAuthorType,
      authorId: INSTITUTIONAL_AUTHOR.id,
      imageOrigin: "unknown" as EditorialImageOrigin,
      // Rascunho em revisao — sem data de aprovacao e sem data de revisao material.
    },
  ]),
);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:[T ].*)?$/;

/**
 * Validação fail-closed. Retorna true SOMENTE quando todos os
 * requisitos explícitos estão presentes e coerentes.
 */
function isValidApproval(a: EditorialApproval | undefined): a is EditorialApproval {
  if (!a) return false;
  if (a.status !== "approved") return false;
  if (a.authorType !== "organization" && a.authorType !== "person") return false;
  if (!a.authorId || a.authorId.trim() === "") return false;
  if (!a.imageOrigin || a.imageOrigin === "unknown") return false;
  if (!a.approvedAt || !ISO_DATE.test(a.approvedAt)) return false;
  // Rejeita datas de aprovação no futuro (proteção anti-build-date).
  const ts = new Date(a.approvedAt).getTime();
  if (Number.isNaN(ts) || ts > Date.now()) return false;
  return true;
}

/** Status editorial de um slug. Padrão fail-closed: "draft". */
export function getEditorialStatus(slug: string): EditorialStatus {
  const entry = APPROVED_EDITORIAL_CONTENT.get(slug);
  return entry?.status ?? "draft";
}

/** Registro editorial bruto de um slug (se existir). */
export function getEditorialApproval(slug: string): EditorialApproval | undefined {
  return APPROVED_EDITORIAL_CONTENT.get(slug);
}

/** Verdadeiro apenas se o slug tem aprovação editorial válida e completa. */
export function isEditorialApproved(slug: string): boolean {
  return isValidApproval(APPROVED_EDITORIAL_CONTENT.get(slug));
}

/** Lista de slugs efetivamente aprovados (validados). Vazia nesta fase. */
export function getApprovedSlugs(): string[] {
  return [...APPROVED_EDITORIAL_CONTENT.values()]
    .filter(isValidApproval)
    .map((a) => a.slug);
}

export default APPROVED_EDITORIAL_CONTENT;
