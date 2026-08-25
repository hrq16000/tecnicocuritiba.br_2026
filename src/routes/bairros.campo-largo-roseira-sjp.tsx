import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CampoLargoSJP from "@/pages/bairros/CampoLargoSJP";

export const Route = createFileRoute("/bairros/campo-largo-roseira-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/campo-largo-roseira-sjp", title: "Técnico de Informática no Campo Largo da Roseira | São José dos Pinhais | Técnico Curitiba", description: "Técnico de informática no Campo Largo da Roseira, São José dos Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: CampoLargoSJP,
});
