import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimParaisoAT from "@/pages/bairros/JardimParaisoAT";

export const Route = createFileRoute("/bairros/jardim-paraiso-at")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-paraiso-at", title: "Técnico de Informática no Jardim Paraíso | Almirante Tamandaré | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Paraíso, Almirante Tamandaré. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimParaisoAT,
});
