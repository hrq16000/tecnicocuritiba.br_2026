import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoGabrielColombo from "@/pages/bairros/SaoGabrielColombo";

export const Route = createFileRoute("/bairros/sao-gabriel-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-gabriel-colombo", title: "Técnico de Informática no São Gabriel | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no São Gabriel, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: SaoGabrielColombo,
});
