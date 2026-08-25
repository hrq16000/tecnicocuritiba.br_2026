import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import GuajuviraAraucaria from "@/pages/bairros/GuajuviraAraucaria";

export const Route = createFileRoute("/bairros/guajuvira")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/guajuvira", title: "Técnico de Informática no Guajuvira | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Guajuvira, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: GuajuviraAraucaria,
});
