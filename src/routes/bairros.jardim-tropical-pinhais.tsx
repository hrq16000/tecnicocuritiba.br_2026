import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimTropicalPinhais from "@/pages/bairros/JardimTropicalPinhais";

export const Route = createFileRoute("/bairros/jardim-tropical-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-tropical-pinhais", title: "Técnico de Informática no Jardim Tropical | Pinhais | Técnico Curitiba", description: "Técnico de informática no Jardim Tropical, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimTropicalPinhais,
});
