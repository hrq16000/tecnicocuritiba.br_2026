import { createFileRoute, notFound } from "@tanstack/react-router";
import ProblemaPage from "@/pages/ProblemaPage";
import { seoHead } from "@/lib/seo/routeHead";
import { getAllProblemaSlugs, getProblemaPageBySlug } from "@/lib/problemaPagesData";

const SLUGS = new Set(getAllProblemaSlugs());

export const Route = createFileRoute("/procedimentos/$slug")({
  // Fail-closed: procedimento inexistente devolve 404 HTTP real.
  beforeLoad: ({ params }) => {
    if (!SLUGS.has(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const data = getProblemaPageBySlug(params.slug);
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
