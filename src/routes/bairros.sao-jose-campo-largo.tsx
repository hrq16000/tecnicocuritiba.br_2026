import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoJoseCampoLargo from "@/pages/bairros/SaoJoseCampoLargo";

export const Route = createFileRoute("/bairros/sao-jose-campo-largo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-jose-campo-largo", title: "Técnico de Informática no São José | Campo Largo | Técnico Curitiba", description: "Técnico de informática no São José, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: SaoJoseCampoLargo,
});
