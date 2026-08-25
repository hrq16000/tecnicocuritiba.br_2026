import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CampinaGrandeColombo from "@/pages/bairros/CampinaGrandeColombo";

export const Route = createFileRoute("/bairros/campina-grande-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/campina-grande-colombo", title: "Técnico de Informática no Campina Grande do Sul | Colombo | Técnico Curitiba", description: "Técnico de informática no Campina Grande do Sul, Colombo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: CampinaGrandeColombo,
});
