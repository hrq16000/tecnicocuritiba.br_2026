import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimPlanaltoIICL from "@/pages/bairros/JardimPlanaltoIICL";

export const Route = createFileRoute("/bairros/jardim-planalto-ii-cl")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-planalto-ii-cl", title: "Técnico de Informática no Jardim Planalto II | Campo Largo | Técnico Curitiba", description: "Técnico de informática no Jardim Planalto II, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimPlanaltoIICL,
});
