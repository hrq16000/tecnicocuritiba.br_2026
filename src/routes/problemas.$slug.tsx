import { createFileRoute, notFound } from "@tanstack/react-router";
import ProblemaPage from "@/pages/ProblemaPage";
import { seoHead } from "@/lib/seo/routeHead";
import { getProblemaRouteMeta } from "@/lib/seo/problemaRouteMeta";

export const Route = createFileRoute("/problemas/$slug")({
  // Fail-closed: slug fora da base real responde 404 HTTP de verdade (sem soft-404).
  beforeLoad: ({ params }) => {
    if (!getProblemaRouteMeta(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const data = getProblemaRouteMeta(params.slug);
    return seoHead({
      path: `/problemas/${params.slug}`,
      title: data?.title ?? "Problema técnico | Técnico em Curitiba",
      description:
        data?.metaDescription ??
        "Diagnóstico técnico do problema, causas prováveis e quando o reparo compensa, com atendimento em Curitiba e região.",
      // Preserva a política vigente: cluster /problemas segue noindex, follow.
      noindex: true,
    });
  },
  component: ProblemaPage,
});
