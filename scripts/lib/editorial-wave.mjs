/**
 * ============================================================================
 * PRIMEIRA ONDA EDITORIAL INDEXÁVEL — Rodada 4H
 * ============================================================================
 * Fonte única (build/gates) dos artigos editoriais liberados para indexação.
 * Espelha `APPROVED_EDITORIAL_CONTENT` em `src/lib/blogEditorialRegistry.ts`
 * (paridade validada por `scripts/check-editorial-governance.mjs`).
 *
 * Regras da onda:
 *   • Só entra artigo com revisão técnica concluída (blogEditorialSources.ts),
 *     imagem própria com origem declarada e aprovação editorial datada.
 *   • Todo artigo aqui é indexável, entra no sitemap-editorial.xml e recebe
 *     HTML estático próprio com BlogPosting + BreadcrumbList.
 *   • Qualquer artigo fora desta lista permanece noindex, follow e fora de
 *     todos os sitemaps (fail-closed).
 */

export const EDITORIAL_WAVE = [
  // ── Rodada 3O — onda educacional empresarial (2 conteúdos, 0 rotas novas).
  {
    slug: "organizacao-de-ti-para-pequenos-escritorios",
    approvedAt: "2026-08-06",
    pilar: "/empresa-de-ti-curitiba",
    pilarLabel: "Empresa de TI em Curitiba",
    apoio: "/servicos/suporte-tecnico-empresarial",
    apoioLabel: "Suporte técnico empresarial",
    cover: "/blog/organizacao-de-ti-para-pequenos-escritorios.jpg",
  },
  {
    slug: "como-escolher-uma-workstation",
    approvedAt: "2026-08-06",
    pilar: "/servicos/montagem-de-pc",
    pilarLabel: "Montagem de PC sob medida",
    apoio: "/servicos/upgrade-ssd-ram",
    apoioLabel: "Upgrade de SSD e memória",
    cover: "/blog/como-escolher-uma-workstation.jpg",
  },
];

export const EDITORIAL_WAVE_SLUGS = EDITORIAL_WAVE.map((a) => a.slug);

const BY_SLUG = new Map(EDITORIAL_WAVE.map((a) => [a.slug, a]));

export function getWaveArticle(slug) {
  return BY_SLUG.get(slug);
}

export function isWaveApproved(slug) {
  return BY_SLUG.has(slug);
}
