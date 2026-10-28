import { createFileRoute, notFound } from "@tanstack/react-router";
import ProblemaPage from "@/pages/ProblemaPage";
import { seoHead } from "@/lib/seo/routeHead";
import { getProblemaRouteMeta } from "@/lib/seo/problemaRouteMeta";
import { getProblemaPage } from "@/lib/problemaPage.functions";

export const Route = createFileRoute("/procedimentos/$slug")({
  // Fail-closed: procedimento inexistente devolve 404 HTTP real.
  beforeLoad: ({ params }) => {
    if (!getProblemaRouteMeta(params.slug)) throw notFound();
  },
  loader: async ({ params }) => {
    const data = await getProblemaPage({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ params }) => {
    const data = getProblemaRouteMeta(params.slug);
    return seoHead({
      path: `/procedimentos/${params.slug}`,
      title: data
        ? `Procedimento técnico: ${data.h1} | Técnico em Curitiba`
        : "Procedimento técnico | Técnico em Curitiba",
      description:
        data?.metaDescription ??
        "Como o procedimento técnico é executado, o que é verificado antes do reparo e quando ele compensa.",
      noindex: true,
    });
  },
  component: ProblemaPage,
});
