import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import GuaraitubaColombo from "@/pages/bairros/GuaraitubaColombo";

export const Route = createFileRoute("/bairros/guaraituba-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/guaraituba-colombo", title: "Técnico de Informática no Guaraituba (Colombo) | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Guaraituba, Colombo PR. Formatação, conserto, vírus, upgrade e redes. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: GuaraitubaColombo,
});
