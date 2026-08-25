import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BordaDoCampoQB from "@/pages/bairros/BordaDoCampoQB";

export const Route = createFileRoute("/bairros/borda-do-campo-qb")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/borda-do-campo-qb", title: "Técnico de Informática no Borda do Campo | Quatro Barras | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Borda do Campo, Quatro Barras. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: BordaDoCampoQB,
});
