import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import MaracanaColombo from "@/pages/bairros/MaracanaColombo";

export const Route = createFileRoute("/bairros/maracana-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/maracana-colombo", title: "Técnico de Informática no Maracanã (Colombo) | Conserto e Formatação | Técnico Curitiba", description: "Técnico de informática no Maracanã, Colombo PR. Conserto de notebook, formatação, vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: MaracanaColombo,
});
