import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import GraciosaPinhais from "@/pages/bairros/GraciosaPinhais";

export const Route = createFileRoute("/bairros/graciosa")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/graciosa", title: "Técnico de Informática no Graciosa | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Graciosa, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: GraciosaPinhais,
});
