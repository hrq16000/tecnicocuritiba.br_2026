import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import GraciosaMirQB from "@/pages/bairros/GraciosaMirQB";

export const Route = createFileRoute("/bairros/graciosa-qb")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/graciosa-qb", title: "Técnico de Informática no Graciosa | Quatro Barras | Técnico Curitiba", description: "Técnico de informática no Graciosa, Quatro Barras. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: GraciosaMirQB,
});
