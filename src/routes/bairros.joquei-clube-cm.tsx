import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JoqueiFRCM from "@/pages/bairros/JoqueiFRCM";

export const Route = createFileRoute("/bairros/joquei-clube-cm")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/joquei-clube-cm", title: "Técnico de Informática no Jóquei Clube | Campo Magro | Técnico Curitiba", description: "Técnico de informática no Jóquei Clube, Campo Magro. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JoqueiFRCM,
});
