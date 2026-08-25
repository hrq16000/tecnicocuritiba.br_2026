import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaSoleneCL from "@/pages/bairros/VilaSoleneCL";

export const Route = createFileRoute("/bairros/vila-solene")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-solene", title: "Técnico de Informática no Vila Solene | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Vila Solene, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: VilaSoleneCL,
});
