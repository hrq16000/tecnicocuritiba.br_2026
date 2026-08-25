import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AltoGloria from "@/pages/bairros/AltoGloria";

export const Route = createFileRoute("/bairros/alto-da-gloria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/alto-da-gloria", title: "Técnico de Informática no Alto da Glória | Curitiba | Técnico Curitiba", description: "Técnico de informática no Alto da Glória, Curitiba. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: AltoGloria,
});
