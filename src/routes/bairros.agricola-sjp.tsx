import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AgricolareSJP from "@/pages/bairros/AgricolareSJP";

export const Route = createFileRoute("/bairros/agricola-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/agricola-sjp", title: "Técnico de Informática no Agrícola | São José dos Pinhais | Técnico Curitiba", description: "Técnico de informática no Agrícola, São José dos Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: AgricolareSJP,
});
