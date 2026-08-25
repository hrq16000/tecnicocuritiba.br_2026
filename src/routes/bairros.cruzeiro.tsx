import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Cruzeiro from "@/pages/bairros/Cruzeiro";

export const Route = createFileRoute("/bairros/cruzeiro")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/cruzeiro", title: "Técnico de Informática no Cruzeiro SJP | Atendimento Rápido | Técnico Curitiba", description: "Técnico de informática no bairro Cruzeiro em São José dos Pinhais. Formatação, conserto, upgrade SSD. Atendimento em domicílio. a partir de R$ 99,99.", noindex: true }),
  component: Cruzeiro,
});
