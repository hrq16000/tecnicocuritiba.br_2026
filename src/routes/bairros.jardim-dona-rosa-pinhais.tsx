import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimDonaRosaPinhais from "@/pages/bairros/JardimDonaRosaPinhais";

export const Route = createFileRoute("/bairros/jardim-dona-rosa-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-dona-rosa-pinhais", title: "Técnico de Informática no Jardim Dona Rosa | Pinhais | Técnico Curitiba", description: "Técnico de informática no Jardim Dona Rosa, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimDonaRosaPinhais,
});
