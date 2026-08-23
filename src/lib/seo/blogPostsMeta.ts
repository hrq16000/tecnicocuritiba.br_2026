/**
 * Metadata SSR dos artigos editoriais APROVADOS (espelho manual de
 * `blogEditorialRegistry.FIRST_WAVE_SLUGS`). Existe porque a rota
 * `/blog/$slug` é dinâmica e o injetor de head só cobre rotas estáticas.
 *
 * Slug ausente aqui => head genérico do blog + noindex (fail-closed),
 * mesma política do registro editorial.
 */
export interface BlogPostMeta {
  title: string;
  description: string;
}

export const BLOG_POSTS_META: Record<string, BlogPostMeta> = {
  "organizacao-de-ti-para-pequenos-escritorios": {
    title: "Organização de TI para pequenos escritórios | Guia prático",
    description:
      "Como organizar equipamentos, arquivos, acessos e rotina de manutenção em um escritório pequeno, sem contratar estrutura de TI que não cabe no negócio.",
  },
  "como-escolher-uma-workstation": {
    title: "Como escolher uma workstation | Checklist de requisitos",
    description:
      "Checklist prático para dimensionar uma estação de trabalho profissional: o que levantar antes de comprar peça, o papel de cada componente e seus limites.",
  },
};

export const getBlogPostMeta = (slug: string): BlogPostMeta | undefined =>
  BLOG_POSTS_META[slug];
