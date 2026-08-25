import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AltoMaracanaColombo from "@/pages/bairros/AltoMaracanaColombo";

export const Route = createFileRoute("/bairros/alto-maracana")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/alto-maracana", title: "Técnico de Informática no Alto Maracanã | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Alto Maracanã, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: AltoMaracanaColombo,
});
