import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaMariaQB from "@/pages/bairros/VilaMariaQB";

export const Route = createFileRoute("/bairros/vila-maria-qb")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-maria-qb", title: "Técnico de Informática no Vila Maria | Quatro Barras | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Vila Maria, Quatro Barras. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: VilaMariaQB,
});
