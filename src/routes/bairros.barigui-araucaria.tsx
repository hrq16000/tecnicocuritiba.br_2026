import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BariguiAraucaria from "@/pages/bairros/BariguiAraucaria";

export const Route = createFileRoute("/bairros/barigui-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/barigui-araucaria", title: "Técnico de Informática no Barigui | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Barigui, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: BariguiAraucaria,
});
