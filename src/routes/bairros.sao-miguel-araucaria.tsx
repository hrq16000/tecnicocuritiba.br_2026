import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoMiguelAraucaria from "@/pages/bairros/SaoMiguelAraucaria";

export const Route = createFileRoute("/bairros/sao-miguel-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-miguel-araucaria", title: "Técnico de Informática no São Miguel | Araucária | Técnico Curitiba", description: "Técnico de informática no São Miguel, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: SaoMiguelAraucaria,
});
