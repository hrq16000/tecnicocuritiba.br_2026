import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PassaunaAraucaria from "@/pages/bairros/PassaunaAraucaria";

export const Route = createFileRoute("/bairros/passauna")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/passauna", title: "Técnico de Informática no Passaúna | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Passaúna, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: PassaunaAraucaria,
});
