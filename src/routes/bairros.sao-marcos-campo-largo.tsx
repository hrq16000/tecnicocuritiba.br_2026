import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoMarcosCampoLargo from "@/pages/bairros/SaoMarcosCampoLargo";

export const Route = createFileRoute("/bairros/sao-marcos-campo-largo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-marcos-campo-largo", title: "Técnico de Informática no São Marcos | Campo Largo | Técnico Curitiba", description: "Técnico de informática no São Marcos, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: SaoMarcosCampoLargo,
});
