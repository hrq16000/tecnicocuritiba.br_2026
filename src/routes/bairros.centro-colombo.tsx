import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CentroColombo from "@/pages/bairros/CentroColombo";

export const Route = createFileRoute("/bairros/centro-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-colombo", title: "Técnico de Informática no Centro de Colombo | Atendimento Rápido | Técnico Curitiba", description: "Técnico de informática no Centro de Colombo PR. Formatação, conserto de notebook/PC, remoção de vírus e upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CentroColombo,
});
