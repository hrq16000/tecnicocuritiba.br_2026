import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ValeDasAguas from "@/pages/bairros/ValeDasAguas";

export const Route = createFileRoute("/bairros/vale-das-aguas")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vale-das-aguas", title: "Técnico de Informática no Vale das Águas | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Vale das Águas, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: ValeDasAguas,
});
