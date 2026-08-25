import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CaliforniaAraucaria from "@/pages/bairros/CaliforniaAraucaria";

export const Route = createFileRoute("/bairros/california-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/california-araucaria", title: "Técnico de Informática no Califórnia | Araucária | Técnico Curitiba", description: "Técnico de informática no Califórnia, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: CaliforniaAraucaria,
});
