import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AntonioOliveraCM from "@/pages/bairros/AntonioOliveraCM";

export const Route = createFileRoute("/bairros/antonio-olivero-cm")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/antonio-olivero-cm", title: "Técnico de Informática no Antônio Olívero | Campo Magro | Técnico Curitiba", description: "Técnico de informática no Antônio Olívero, Campo Magro. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: AntonioOliveraCM,
});
