import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaNovaAraucaria from "@/pages/bairros/VilaNovaAraucaria";

export const Route = createFileRoute("/bairros/vila-nova-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-nova-araucaria", title: "Técnico de Informática no Vila Nova | Araucária | Técnico Curitiba", description: "Técnico de informática no Vila Nova, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: VilaNovaAraucaria,
});
