import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimMontoSantoAT from "@/pages/bairros/JardimMontoSantoAT";

export const Route = createFileRoute("/bairros/jardim-monte-santo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-monte-santo", title: "Técnico de Informática no Jardim Monte Santo (Almirante Tamandaré) | Técnico Curitiba", description: "Técnico de informática no Jardim Monte Santo, Almirante Tamandaré. Conserto, formatação, vírus, upgrade. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimMontoSantoAT,
});
