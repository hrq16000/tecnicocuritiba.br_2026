import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimWissingerPinhais from "@/pages/bairros/JardimWissingerPinhais";

export const Route = createFileRoute("/bairros/jardim-wissinger-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-wissinger-pinhais", title: "Técnico de Informática no Jardim Wissinger | Pinhais | Técnico Curitiba", description: "Técnico de informática no Jardim Wissinger, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimWissingerPinhais,
});
