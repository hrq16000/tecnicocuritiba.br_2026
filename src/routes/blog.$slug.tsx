import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { resolveRedirect } from "@/lib/redirectMatrix";
import { seoHead } from "@/lib/seo/routeHead";
import { getBlogPostMeta } from "@/lib/seo/blogPostsMeta";
import BlogPost from "@/pages/BlogPost";

export const Route = createFileRoute("/blog/$slug")({
  // Fail-closed: artigo fora da lista aprovada responde 404 HTTP real (nunca 200 + noindex).
  beforeLoad: ({ params }) => {
    // URLs antigas do blog devem responder 301 antes do gate editorial.
    // Rascunhos SEM alias continuam retornando 404 real (fail-closed).
    const destination = resolveRedirect(`/blog/${params.slug}`);
    if (destination) throw redirect({ to: destination, statusCode: 301 });
    if (!getBlogPostMeta(params.slug)) throw notFound();
  },

  head: ({ params }) => {
    const meta = getBlogPostMeta(params.slug);
    return seoHead({
      path: `/blog/${params.slug}`,
      title: meta?.title ?? "Blog | Técnico em Curitiba",
      description:
        meta?.description ??
        "Conteúdo técnico sobre manutenção, suporte e infraestrutura de informática em Curitiba.",
      localBusiness: false,
      ogType: "article",
      // Fail-closed: artigo fora da lista aprovada não é indexável.
      noindex: !meta,
    });
  },
  component: BlogPost,
});
