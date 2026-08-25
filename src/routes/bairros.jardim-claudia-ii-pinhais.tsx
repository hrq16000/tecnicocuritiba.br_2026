import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimClaudiaIIPinhais from "@/pages/bairros/JardimClaudiaIIPinhais";

export const Route = createFileRoute("/bairros/jardim-claudia-ii-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-claudia-ii-pinhais", title: "Técnico de Informática no Jardim Cláudia II | Pinhais | Técnico Curitiba", description: "Técnico de informática no Jardim Cláudia II, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimClaudiaIIPinhais,
});
