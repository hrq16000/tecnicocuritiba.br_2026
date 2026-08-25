import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PalmitalPinhais from "@/pages/bairros/PalmitalPinhais";

export const Route = createFileRoute("/bairros/palmital-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/palmital-pinhais", title: "Técnico de Informática no Palmital | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Palmital, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: PalmitalPinhais,
});
