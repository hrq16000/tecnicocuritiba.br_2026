import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SabiaAraucaria from "@/pages/bairros/SabiaAraucaria";

export const Route = createFileRoute("/bairros/sabia")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sabia", title: "Técnico de Informática no Sabiá | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Sabiá, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: SabiaAraucaria,
});
