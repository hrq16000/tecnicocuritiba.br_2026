import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AtubaColombo from "@/pages/bairros/AtubaColombo";

export const Route = createFileRoute("/bairros/atuba-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/atuba-colombo", title: "Técnico de Informática no Atuba | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Atuba, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: AtubaColombo,
});
