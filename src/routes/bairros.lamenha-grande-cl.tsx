import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import LamenhaGrandeCL from "@/pages/bairros/LamenhaGrandeCL";

export const Route = createFileRoute("/bairros/lamenha-grande-cl")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/lamenha-grande-cl", title: "Técnico de Informática no Lamenha Grande | Campo Largo | Técnico Curitiba", description: "Técnico de informática no Lamenha Grande, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: LamenhaGrandeCL,
});
