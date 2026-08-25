import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AltoTaruma from "@/pages/bairros/AltoTaruma";

export const Route = createFileRoute("/bairros/alto-taruma")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/alto-taruma", title: "Técnico de Informática no Alto Tarumã | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Alto Tarumã, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: AltoTaruma,
});
