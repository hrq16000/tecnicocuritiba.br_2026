import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaIzabel from "@/pages/bairros/VilaIzabel";

export const Route = createFileRoute("/bairros/vila-izabel")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-izabel", title: "Técnico de Informática no Vila Izabel | Curitiba | Técnico Curitiba", description: "Técnico de informática no Vila Izabel, Curitiba. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: VilaIzabel,
});
