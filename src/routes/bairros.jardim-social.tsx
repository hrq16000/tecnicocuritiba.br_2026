import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimSocial from "@/pages/bairros/JardimSocial";

export const Route = createFileRoute("/bairros/jardim-social")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-social", title: "Técnico de Informática no Jardim Social | Curitiba | Técnico Curitiba", description: "Técnico de informática no Jardim Social, Curitiba. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimSocial,
});
