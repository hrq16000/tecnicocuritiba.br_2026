import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Costeira from "@/pages/bairros/Costeira";

export const Route = createFileRoute("/bairros/costeira")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/costeira", title: "Técnico de Informática na Costeira SJP | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática na Costeira, São José dos Pinhais. Formatação, conserto, upgrade SSD. Visita técnica em domicílio. a partir de R$ 99,99.", noindex: true }),
  component: Costeira,
});
