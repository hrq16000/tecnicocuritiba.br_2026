import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ColareColombo from "@/pages/bairros/ColareColombo";

export const Route = createFileRoute("/bairros/sao-dimas-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-dimas-colombo", title: "Técnico de Informática no São Dimas | Colombo | Técnico Curitiba", description: "Técnico de informática no São Dimas, Colombo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: ColareColombo,
});
