import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoVenancioAT from "@/pages/bairros/SaoVenancioAT";

export const Route = createFileRoute("/bairros/sao-venancio")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-venancio", title: "Técnico de Informática no São Venâncio | Almirante Tamandaré | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no São Venâncio, Almirante Tamandaré. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SaoVenancioAT,
});
