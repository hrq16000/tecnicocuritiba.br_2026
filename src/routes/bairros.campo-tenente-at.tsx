import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CampoDoTenenteTamandare from "@/pages/bairros/CampoDoTenenteTamandare";

export const Route = createFileRoute("/bairros/campo-tenente-at")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/campo-tenente-at", title: "Técnico de Informática no Campo do Tenente | Almirante Tamandaré | Técnico Curitiba", description: "Técnico de informática no Campo do Tenente, Almirante Tamandaré. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: CampoDoTenenteTamandare,
});
