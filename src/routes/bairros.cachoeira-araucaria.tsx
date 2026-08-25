import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CacheiraAraucaria from "@/pages/bairros/CacheiraAraucaria";

export const Route = createFileRoute("/bairros/cachoeira-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/cachoeira-araucaria", title: "Técnico de Informática no Cachoeira | Araucária | Técnico Curitiba", description: "Técnico de informática no Cachoeira, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: CacheiraAraucaria,
});
