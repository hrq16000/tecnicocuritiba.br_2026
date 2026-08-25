import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimKarlaPinhais from "@/pages/bairros/JardimKarlaPinhais";

export const Route = createFileRoute("/bairros/jardim-karla-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-karla-pinhais", title: "Técnico de Informática no Jardim Karla | Pinhais | Técnico Curitiba", description: "Técnico de informática no Jardim Karla, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimKarlaPinhais,
});
