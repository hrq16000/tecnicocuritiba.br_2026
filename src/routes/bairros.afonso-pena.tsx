import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AfonsoPena from "@/pages/bairros/AfonsoPena";

export const Route = createFileRoute("/bairros/afonso-pena")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/afonso-pena", title: "Técnico de Informática no Afonso Pena SJP | Técnico Curitiba", description: "Técnico de informática no Afonso Pena, São José dos Pinhais. Visita técnica a domicílio. Conserto de PC, formatação e suporte. a partir de R$ 99,99.", noindex: true }),
  component: AfonsoPena,
});
