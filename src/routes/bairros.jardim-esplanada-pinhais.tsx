import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimEsplanadaPinhais from "@/pages/bairros/JardimEsplanadaPinhais";

export const Route = createFileRoute("/bairros/jardim-esplanada-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-esplanada-pinhais", title: "Técnico de Informática no Jardim Esplanada | Pinhais | Técnico Curitiba", description: "Técnico de informática no Jardim Esplanada, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimEsplanadaPinhais,
});
