import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import IndependenciaSJP from "@/pages/bairros/IndependenciaSJP";

export const Route = createFileRoute("/bairros/independencia-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/independencia-sjp", title: "Técnico de Informática no Independência | São José dos Pinhais | Técnico Curitiba", description: "Técnico de informática no Independência, São José dos Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: IndependenciaSJP,
});
