import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import OuroFinoSJP from "@/pages/bairros/OuroFinoSJP";

export const Route = createFileRoute("/bairros/ouro-fino-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/ouro-fino-sjp", title: "Técnico de Informática no Ouro Fino | São José dos Pinhais | Técnico Curitiba", description: "Técnico de informática no Ouro Fino, São José dos Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: OuroFinoSJP,
});
