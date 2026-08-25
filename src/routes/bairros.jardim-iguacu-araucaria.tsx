import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimIguacuAraucaria from "@/pages/bairros/JardimIguacuAraucaria";

export const Route = createFileRoute("/bairros/jardim-iguacu-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-iguacu-araucaria", title: "Técnico de Informática no Jardim Iguaçu | Araucária | Técnico Curitiba", description: "Técnico de informática no Jardim Iguaçu, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimIguacuAraucaria,
});
