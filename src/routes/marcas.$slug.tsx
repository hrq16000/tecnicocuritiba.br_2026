import { createFileRoute, notFound } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import MarcaPage from "@/pages/MarcaPage";
import { brandsData } from "@/lib/brandsData";

const SLUGS = new Set(brandsData.map((b) => b.slug));

export const Route = createFileRoute("/marcas/$slug")({
  // Fail-closed: marca inexistente devolve 404 HTTP real.
  beforeLoad: ({ params }) => {
    if (!SLUGS.has(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const brand = brandsData.find((b) => b.slug === params.slug);
    return seoHead({
      path: `/marcas/${params.slug}`,
      title: `Assistência Técnica ${brand?.name ?? params.slug} em Curitiba | Conserto e Manutenção`,
      description: `Assistência técnica para equipamentos ${brand?.name ?? params.slug} em Curitiba e região: ${(brand?.servicos ?? []).slice(0, 3).join(", ") || "diagnóstico, reparo e manutenção"}. Atendimento combinado pelo WhatsApp.`,
      // Mantém a política atual (páginas de marca seguem fora do índice).
      noindex: true,
    });
  },
  component: MarcaPage,
});
