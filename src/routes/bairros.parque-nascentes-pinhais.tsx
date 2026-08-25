import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ParqueNascentesPinhais from "@/pages/bairros/ParqueNascentesPinhais";

export const Route = createFileRoute("/bairros/parque-nascentes-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/parque-nascentes-pinhais", title: "Técnico de Informática no Parque das Nascentes | Pinhais | Técnico Curitiba", description: "Técnico de informática no Parque das Nascentes, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: ParqueNascentesPinhais,
});
