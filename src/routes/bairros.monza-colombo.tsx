import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import MonzaColombo from "@/pages/bairros/MonzaColombo";

export const Route = createFileRoute("/bairros/monza-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/monza-colombo", title: "Técnico de Informática no Monza | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Monza, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: MonzaColombo,
});
