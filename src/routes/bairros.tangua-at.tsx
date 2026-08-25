import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TanguaAT from "@/pages/bairros/TanguaAT";

export const Route = createFileRoute("/bairros/tangua-at")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/tangua-at", title: "Técnico de Informática no Tanguá | Almirante Tamandaré | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Tanguá, Almirante Tamandaré. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: TanguaAT,
});
