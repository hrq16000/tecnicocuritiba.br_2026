import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CampoPequenoColombo from "@/pages/bairros/CampoPequenoColombo";

export const Route = createFileRoute("/bairros/campo-pequeno")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/campo-pequeno", title: "Técnico de Informática no Campo Pequeno | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Campo Pequeno, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: CampoPequenoColombo,
});
