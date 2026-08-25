import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ColoniaMalhadaCL from "@/pages/bairros/ColoniaMalhadaCL";

export const Route = createFileRoute("/bairros/colonia-malhada-cl")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/colonia-malhada-cl", title: "Técnico de Informática no Colônia Malhada | Campo Largo | Técnico Curitiba", description: "Técnico de informática no Colônia Malhada, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: ColoniaMalhadaCL,
});
