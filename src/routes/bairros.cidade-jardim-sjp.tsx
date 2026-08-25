import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CidadeJardimSJP from "@/pages/bairros/CidadeJardimSJP";

export const Route = createFileRoute("/bairros/cidade-jardim-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/cidade-jardim-sjp", title: "Técnico de Informática no Cidade Jardim | São José dos Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Cidade Jardim, São José dos Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CidadeJardimSJP,
});
