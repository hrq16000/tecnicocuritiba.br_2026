import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import OswaldoCruzColombo from "@/pages/bairros/OswaldoCruzColombo";

export const Route = createFileRoute("/bairros/osvaldo-cruz-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/osvaldo-cruz-colombo", title: "Técnico de Informática no Osvaldo Cruz | Colombo | Técnico Curitiba", description: "Técnico de informática no Osvaldo Cruz, Colombo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: OswaldoCruzColombo,
});
