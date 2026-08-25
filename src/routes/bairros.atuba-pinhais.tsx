import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AtubaPinhais from "@/pages/bairros/AtubaPinhais";

export const Route = createFileRoute("/bairros/atuba-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/atuba-pinhais", title: "Técnico de Informática no Atuba | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Atuba, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: AtubaPinhais,
});
