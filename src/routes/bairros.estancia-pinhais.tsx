import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import EstanciaPinhais from "@/pages/bairros/EstanciaPinhais";

export const Route = createFileRoute("/bairros/estancia-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/estancia-pinhais", title: "Técnico de Informática no Estância Pinhais | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Estância Pinhais, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: EstanciaPinhais,
});
