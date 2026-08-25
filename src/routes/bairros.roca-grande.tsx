import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RocaGrandeColombo from "@/pages/bairros/RocaGrandeColombo";

export const Route = createFileRoute("/bairros/roca-grande")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/roca-grande", title: "Técnico de Informática no Roça Grande | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Roça Grande, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: RocaGrandeColombo,
});
