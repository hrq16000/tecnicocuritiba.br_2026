import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoSilvestreCL from "@/pages/bairros/SaoSilvestreCL";

export const Route = createFileRoute("/bairros/sao-silvestre")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-silvestre", title: "Técnico de Informática no São Silvestre | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no São Silvestre, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SaoSilvestreCL,
});
