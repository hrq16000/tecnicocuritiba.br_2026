import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimPlanaltoCL from "@/pages/bairros/JardimPlanaltoCL";

export const Route = createFileRoute("/bairros/jardim-planalto-campo-largo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-planalto-campo-largo", title: "Técnico de Informática no Jardim Planalto | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Planalto, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimPlanaltoCL,
});
