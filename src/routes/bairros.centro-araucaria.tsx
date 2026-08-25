import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AraucariaCentro from "@/pages/bairros/AraucariaCentro";

export const Route = createFileRoute("/bairros/centro-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-araucaria", title: "Técnico de Informática no Centro de Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Centro de Araucária. Formatação, conserto de notebook/PC, remoção de vírus e upgrade SSD. Atendimento a domicílio com agendamento. a partir de R$ 99,99.", noindex: true }),
  component: AraucariaCentro,
});
