import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimEsperancaCL from "@/pages/bairros/JardimEsperancaCL";

export const Route = createFileRoute("/bairros/jardim-esperanca-cl")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-esperanca-cl", title: "Técnico de Informática no Jardim Esperança | Campo Largo | Técnico Curitiba", description: "Técnico de informática no Jardim Esperança, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimEsperancaCL,
});
