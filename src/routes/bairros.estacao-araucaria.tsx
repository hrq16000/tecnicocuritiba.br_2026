import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import EstacaoAraucaria from "@/pages/bairros/EstacaoAraucaria";

export const Route = createFileRoute("/bairros/estacao-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/estacao-araucaria", title: "Técnico de Informática no Estação | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Estação, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: EstacaoAraucaria,
});
