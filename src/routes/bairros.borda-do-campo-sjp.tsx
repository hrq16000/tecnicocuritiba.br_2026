import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BordaDoCampoSJP from "@/pages/bairros/BordaDoCampoSJP";

export const Route = createFileRoute("/bairros/borda-do-campo-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/borda-do-campo-sjp", title: "Técnico de Informática no Borda do Campo | São José dos Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Borda do Campo, São José dos Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: BordaDoCampoSJP,
});
