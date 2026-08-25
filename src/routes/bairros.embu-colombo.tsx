import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import EmbuColombo from "@/pages/bairros/EmbuColombo";

export const Route = createFileRoute("/bairros/embu-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/embu-colombo", title: "Técnico de Informática no Embu | Colombo | Técnico Curitiba", description: "Técnico de informática no Embu, Colombo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: EmbuColombo,
});
