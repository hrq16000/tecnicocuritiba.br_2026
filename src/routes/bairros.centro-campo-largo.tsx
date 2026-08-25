import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CampoLargoCentro from "@/pages/bairros/CampoLargoCentro";

export const Route = createFileRoute("/bairros/centro-campo-largo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-campo-largo", title: "Técnico de Informática no Centro de Campo Largo | Técnico Curitiba", description: "Técnico de informática no Centro de Campo Largo. Conserto de PC e notebook, formatação, vírus, upgrade SSD e configuração de rede. Atendimento a domicílio com agendamento. a partir de R$ 99,99.", noindex: true }),
  component: CampoLargoCentro,
});
