import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import IndustrialAraucaria from "@/pages/bairros/IndustrialAraucaria";

export const Route = createFileRoute("/bairros/industrial-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/industrial-araucaria", title: "Técnico de Informática no Industrial | Araucária | Técnico Curitiba", description: "Técnico de informática no Industrial, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: IndustrialAraucaria,
});
