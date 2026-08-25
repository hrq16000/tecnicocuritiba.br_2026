import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CosteiraAraucaria from "@/pages/bairros/CosteiraAraucaria";

export const Route = createFileRoute("/bairros/costeira-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/costeira-araucaria", title: "Técnico de Informática no Costeira | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Costeira, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: CosteiraAraucaria,
});
