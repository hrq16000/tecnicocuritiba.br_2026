import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CapaoImbuia from "@/pages/bairros/CapaoImbuia";

export const Route = createFileRoute("/bairros/capao-da-imbuia")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/capao-da-imbuia", title: "Técnico de Informática no Capão da Imbuia | Curitiba | Técnico Curitiba", description: "Técnico de informática no Capão da Imbuia, Curitiba. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: CapaoImbuia,
});
