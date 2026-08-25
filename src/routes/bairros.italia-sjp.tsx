import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ItaliaSJP from "@/pages/bairros/ItaliaSJP";

export const Route = createFileRoute("/bairros/italia-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/italia-sjp", title: "Técnico de Informática no Itália | São José dos Pinhais | Técnico Curitiba", description: "Técnico de informática no Itália, São José dos Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: ItaliaSJP,
});
