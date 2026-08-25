import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BonecaSJP from "@/pages/bairros/BonecaSJP";

export const Route = createFileRoute("/bairros/boneca-do-iguacu-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/boneca-do-iguacu-sjp", title: "Técnico de Informática no Boneca do Iguaçu | São José dos Pinhais | Técnico Curitiba", description: "Técnico de informática no Boneca do Iguaçu, São José dos Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: BonecaSJP,
});
