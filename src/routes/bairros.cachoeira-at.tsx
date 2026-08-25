import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CachoeiraAT from "@/pages/bairros/CachoeiraAT";

export const Route = createFileRoute("/bairros/cachoeira-at")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/cachoeira-at", title: "Técnico de Informática na Cachoeira (Almirante Tamandaré) | Técnico Curitiba", description: "Técnico de informática na Cachoeira, Almirante Tamandaré. Formatação, conserto de notebook, vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CachoeiraAT,
});
