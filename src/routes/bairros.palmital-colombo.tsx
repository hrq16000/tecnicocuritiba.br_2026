import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PalmitalColombo from "@/pages/bairros/PalmitalColombo";

export const Route = createFileRoute("/bairros/palmital-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/palmital-colombo", title: "Técnico de Informática no Palmital | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Palmital, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: PalmitalColombo,
});
