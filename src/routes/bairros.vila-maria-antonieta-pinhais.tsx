import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaMariaAntonietaPinhais from "@/pages/bairros/VilaMariaAntonietaPinhais";

export const Route = createFileRoute("/bairros/vila-maria-antonieta-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-maria-antonieta-pinhais", title: "Técnico de Informática no Vila Maria Antonieta | Pinhais | Técnico Curitiba", description: "Técnico de informática no Vila Maria Antonieta, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: VilaMariaAntonietaPinhais,
});
