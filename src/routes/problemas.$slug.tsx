import { createFileRoute, notFound } from "@tanstack/react-router";
import ProblemaPage from "@/pages/ProblemaPage";
import { getAllProblemaSlugs } from "@/lib/problemaPagesData";

const SLUGS = new Set(getAllProblemaSlugs());

export const Route = createFileRoute("/problemas/$slug")({
  // Fail-closed: slug fora da base real responde 404 HTTP de verdade (sem soft-404).
  beforeLoad: ({ params }) => {
    if (!SLUGS.has(params.slug)) throw notFound();
  },
  component: ProblemaPage,
});
