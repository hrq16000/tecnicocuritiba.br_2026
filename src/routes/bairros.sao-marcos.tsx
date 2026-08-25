import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoMarcos from "@/pages/bairros/SaoMarcos";

export const Route = createFileRoute("/bairros/sao-marcos")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-marcos", title: "Técnico de Informática no São Marcos SJP | Assistência Técnica | Técnico Curitiba", description: "Técnico de informática no São Marcos, São José dos Pinhais. Formatação, conserto, upgrade. Visita técnica em domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SaoMarcos,
});
