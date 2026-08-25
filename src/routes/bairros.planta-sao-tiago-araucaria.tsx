import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PlantaSaoTiagoAraucaria from "@/pages/bairros/PlantaSaoTiagoAraucaria";

export const Route = createFileRoute("/bairros/planta-sao-tiago-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/planta-sao-tiago-araucaria", title: "Técnico de Informática no Planta São Tiago | Araucária | Técnico Curitiba", description: "Técnico de informática no Planta São Tiago, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: PlantaSaoTiagoAraucaria,
});
