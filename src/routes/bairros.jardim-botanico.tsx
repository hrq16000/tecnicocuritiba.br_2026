import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AguaVerdeBairro from "@/pages/bairros/AguaVerdeBairro";

export const Route = createFileRoute("/bairros/jardim-botanico")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-botanico", title: "Técnico de Informática no Jardim Botânico | Curitiba | Técnico Curitiba", description: "Técnico de informática no Jardim Botânico, Curitiba. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: AguaVerdeBairro,
});
