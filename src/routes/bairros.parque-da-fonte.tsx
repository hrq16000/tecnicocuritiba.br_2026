import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ParqueDaFonte from "@/pages/bairros/ParqueDaFonte";

export const Route = createFileRoute("/bairros/parque-da-fonte")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/parque-da-fonte", title: "Técnico de Informática no Parque da Fonte SJP | Técnico Curitiba", description: "Técnico de informática no Parque da Fonte, São José dos Pinhais. Conserto, formatação, upgrade. Atendimento domiciliar profissional. a partir de R$ 99,99.", noindex: true }),
  component: ParqueDaFonte,
});
