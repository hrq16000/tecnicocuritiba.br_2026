import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RondinhaCL from "@/pages/bairros/RondinhaCL";

export const Route = createFileRoute("/bairros/rondinha")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/rondinha", title: "Técnico de Informática no Rondinha | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Rondinha, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: RondinhaCL,
});
