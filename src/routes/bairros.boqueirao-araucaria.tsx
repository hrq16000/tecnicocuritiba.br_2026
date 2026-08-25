import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BoqueiraoAraucaria from "@/pages/bairros/BoqueiraoAraucaria";

export const Route = createFileRoute("/bairros/boqueirao-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/boqueirao-araucaria", title: "Técnico de Informática no Boqueirão | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Boqueirão, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: BoqueiraoAraucaria,
});
