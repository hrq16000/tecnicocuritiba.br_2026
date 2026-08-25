import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CentroFRG from "@/pages/bairros/CentroFRG";

export const Route = createFileRoute("/bairros/centro-fazenda-rio-grande")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-fazenda-rio-grande", title: "Técnico de Informática no Centro de Fazenda Rio Grande | Técnico Curitiba", description: "Técnico de informática no Centro de Fazenda Rio Grande. Formatação, conserto, vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CentroFRG,
});
