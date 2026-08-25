import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ThomazCoelhoAraucaria from "@/pages/bairros/ThomazCoelhoAraucaria";

export const Route = createFileRoute("/bairros/thomaz-coelho")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/thomaz-coelho", title: "Técnico de Informática no Thomaz Coelho (Araucária) | Atendimento Rápido", description: "Técnico de informática no Thomaz Coelho, Araucária. Assistência técnica para PC e notebook: formatação, vírus, conserto, upgrade e redes. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: ThomazCoelhoAraucaria,
});
