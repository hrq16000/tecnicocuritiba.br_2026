import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import EspigoAlegreCM from "@/pages/bairros/EspigoAlegreCM";

export const Route = createFileRoute("/bairros/espigao-alegre-cm")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/espigao-alegre-cm", title: "Técnico de Informática no Espigão Alegre | Campo Magro | Técnico Curitiba", description: "Técnico de informática no Espigão Alegre, Campo Magro. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: EspigoAlegreCM,
});
