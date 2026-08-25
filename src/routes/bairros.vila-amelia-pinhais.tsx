import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaAmeliaPinhais from "@/pages/bairros/VilaAmeliaPinhais";

export const Route = createFileRoute("/bairros/vila-amelia-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-amelia-pinhais", title: "Técnico de Informática no Vila Amélia | Pinhais | Técnico Curitiba", description: "Técnico de informática no Vila Amélia, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: VilaAmeliaPinhais,
});
