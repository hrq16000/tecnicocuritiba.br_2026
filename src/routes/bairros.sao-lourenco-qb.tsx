import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoLourencoQB from "@/pages/bairros/SaoLourencoQB";

export const Route = createFileRoute("/bairros/sao-lourenco-qb")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-lourenco-qb", title: "Técnico de Informática no São Lourenço | Quatro Barras | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no São Lourenço, Quatro Barras. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SaoLourencoQB,
});
