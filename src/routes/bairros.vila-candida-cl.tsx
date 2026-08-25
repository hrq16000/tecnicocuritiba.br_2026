import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaCandidaCL from "@/pages/bairros/VilaCandidaCL";

export const Route = createFileRoute("/bairros/vila-candida-cl")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-candida-cl", title: "Técnico de Informática no Vila Cândida | Campo Largo | Técnico Curitiba", description: "Técnico de informática no Vila Cândida, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: VilaCandidaCL,
});
