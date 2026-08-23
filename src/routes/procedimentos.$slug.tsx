import { createFileRoute, notFound } from "@tanstack/react-router";
import ProblemaPage from "@/pages/ProblemaPage";
import { getAllProblemaSlugs } from "@/lib/problemaPagesData";

const SLUGS = new Set(getAllProblemaSlugs());

export const Route = createFileRoute("/procedimentos/$slug")({
  // Fail-closed: procedimento inexistente devolve 404 HTTP real.
  beforeLoad: ({ params }) => {
    if (!SLUGS.has(params.slug)) throw notFound();
  },
  component: ProblemaPage,
});
