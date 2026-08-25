import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoJoseDosPinhais from "@/pages/bairros/SaoJoseDosPinhais";

export const Route = createFileRoute("/bairros/sao-jose-dos-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-jose-dos-pinhais", title: "Técnico de Informática em São José dos Pinhais | Atendimento Rápido | Técnico Curitiba", description: "Técnico de informática em São José dos Pinhais. Atendimento em domicílio para PC e notebook. Formatação, vírus, upgrade. a partir de R$ 99,99.", noindex: true }),
  component: SaoJoseDosPinhais,
});
