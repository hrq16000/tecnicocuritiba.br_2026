import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimNovoHorizonteCL from "@/pages/bairros/JardimNovoHorizonteCL";

export const Route = createFileRoute("/bairros/jardim-novo-horizonte-cl")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-novo-horizonte-cl", title: "Técnico de Informática no Jardim Novo Horizonte | Campo Largo | Técnico Curitiba", description: "Técnico de informática no Jardim Novo Horizonte, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimNovoHorizonteCL,
});
