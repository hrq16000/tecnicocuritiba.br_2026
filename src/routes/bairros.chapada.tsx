import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ChapadaAraucaria from "@/pages/bairros/ChapadaAraucaria";

export const Route = createFileRoute("/bairros/chapada")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/chapada", title: "Técnico de Informática no Chapada | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Chapada, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: ChapadaAraucaria,
});
