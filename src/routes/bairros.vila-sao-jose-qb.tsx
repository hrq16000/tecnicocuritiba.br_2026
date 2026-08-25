import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaSaoJoseQB from "@/pages/bairros/VilaSaoJoseQB";

export const Route = createFileRoute("/bairros/vila-sao-jose-qb")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-sao-jose-qb", title: "Técnico de Informática no Vila São José | Quatro Barras | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Vila São José, Quatro Barras. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: VilaSaoJoseQB,
});
