import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SantaTerezinhaColombo from "@/pages/bairros/SantaTerezinhaColombo";

export const Route = createFileRoute("/bairros/santa-terezinha-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/santa-terezinha-colombo", title: "Técnico de Informática no Santa Terezinha | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Santa Terezinha, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: SantaTerezinhaColombo,
});
