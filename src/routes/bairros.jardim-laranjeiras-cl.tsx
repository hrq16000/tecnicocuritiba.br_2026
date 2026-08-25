import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimLaranjeirasCL from "@/pages/bairros/JardimLaranjeirasCL";

export const Route = createFileRoute("/bairros/jardim-laranjeiras-cl")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-laranjeiras-cl", title: "Técnico de Informática no Jardim das Laranjeiras | Campo Largo | Técnico Curitiba", description: "Técnico de informática no Jardim das Laranjeiras, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimLaranjeirasCL,
});
