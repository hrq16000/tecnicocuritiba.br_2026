import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaTaruma from "@/pages/bairros/VilaTaruma";

export const Route = createFileRoute("/bairros/vila-taruma")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-taruma", title: "Técnico de Informática no Vila Tarumã | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Vila Tarumã, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: VilaTaruma,
});
