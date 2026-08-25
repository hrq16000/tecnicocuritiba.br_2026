import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import HugoLange from "@/pages/bairros/HugoLange";

export const Route = createFileRoute("/bairros/hugo-lange")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/hugo-lange", title: "Técnico de Informática no Hugo Lange | Curitiba | Técnico Curitiba", description: "Técnico de informática no Hugo Lange, Curitiba. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: HugoLange,
});
