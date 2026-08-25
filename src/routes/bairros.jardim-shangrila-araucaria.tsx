import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimShangrilaAraucaria from "@/pages/bairros/JardimShangrilaAraucaria";

export const Route = createFileRoute("/bairros/jardim-shangrila-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-shangrila-araucaria", title: "Técnico de Informática no Jardim Shangri-lá | Araucária | Técnico Curitiba", description: "Técnico de informática no Jardim Shangri-lá, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimShangrilaAraucaria,
});
