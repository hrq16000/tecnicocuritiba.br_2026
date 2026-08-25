import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import FatimaColombo from "@/pages/bairros/FatimaColombo";

export const Route = createFileRoute("/bairros/fatima-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/fatima-colombo", title: "Técnico de Informática no Fátima | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Fátima, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: FatimaColombo,
});
