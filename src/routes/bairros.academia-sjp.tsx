import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AcademiaSJP from "@/pages/bairros/AcademiaSJP";

export const Route = createFileRoute("/bairros/academia-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/academia-sjp", title: "Técnico de Informática no Academia | São José dos Pinhais | Técnico Curitiba", description: "Técnico de informática no Academia, São José dos Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: AcademiaSJP,
});
