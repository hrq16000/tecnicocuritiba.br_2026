import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import EucaliptosFRG2 from "@/pages/bairros/EucaliptosFRG2";

export const Route = createFileRoute("/bairros/parque-industrial-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/parque-industrial-frg", title: "Técnico de Informática no Parque Industrial | Fazenda Rio Grande | Técnico Curitiba", description: "Técnico de informática no Parque Industrial, Fazenda Rio Grande. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: EucaliptosFRG2,
});
