import { createFileRoute, notFound } from "@tanstack/react-router";
import MarcaPage from "@/pages/MarcaPage";
import { brandsData } from "@/lib/brandsData";

const SLUGS = new Set(brandsData.map((b) => b.slug));

export const Route = createFileRoute("/marcas/$slug")({
  // Fail-closed: marca inexistente devolve 404 HTTP real.
  beforeLoad: ({ params }) => {
    if (!SLUGS.has(params.slug)) throw notFound();
  },
  component: MarcaPage,
});
