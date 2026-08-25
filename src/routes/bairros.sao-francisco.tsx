import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoFrancisco from "@/pages/bairros/SaoFrancisco";

export const Route = createFileRoute("/bairros/sao-francisco")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-francisco", title: "Técnico de Informática no São Francisco SJP | Técnico Curitiba", description: "Técnico de informática no São Francisco, São José dos Pinhais. Manutenção, conserto de PC e notebook. Atendimento domiciliar. a partir de R$ 99,99.", noindex: true }),
  component: SaoFrancisco,
});
