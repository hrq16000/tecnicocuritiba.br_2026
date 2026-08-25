import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimJaponeQB from "@/pages/bairros/JardimJaponeQB";

export const Route = createFileRoute("/bairros/jardim-japao-qb")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-japao-qb", title: "Técnico de Informática no Jardim Japão | Quatro Barras | Técnico Curitiba", description: "Técnico de informática no Jardim Japão, Quatro Barras. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimJaponeQB,
});
