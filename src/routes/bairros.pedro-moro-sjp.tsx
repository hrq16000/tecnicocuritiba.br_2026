import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PedroMoroSJP from "@/pages/bairros/PedroMoroSJP";

export const Route = createFileRoute("/bairros/pedro-moro-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/pedro-moro-sjp", title: "Técnico de Informática no Pedro Moro | São José dos Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Pedro Moro, São José dos Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: PedroMoroSJP,
});
