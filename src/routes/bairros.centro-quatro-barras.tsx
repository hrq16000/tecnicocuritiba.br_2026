import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CentroQuatroBarras from "@/pages/bairros/CentroQuatroBarras";

export const Route = createFileRoute("/bairros/centro-quatro-barras")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-quatro-barras", title: "Técnico de Informática no Centro | Quatro Barras | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Centro, Quatro Barras. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CentroQuatroBarras,
});
