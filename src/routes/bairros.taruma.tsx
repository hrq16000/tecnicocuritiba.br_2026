import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Taruma from "@/pages/bairros/Taruma";

export const Route = createFileRoute("/bairros/taruma")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/taruma", title: "Técnico de Informática no Tarumã | Curitiba | Técnico Curitiba", description: "Técnico de informática no Tarumã, Curitiba. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: Taruma,
});
