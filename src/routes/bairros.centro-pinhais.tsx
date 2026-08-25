import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PinhaisCentro from "@/pages/bairros/PinhaisCentro";

export const Route = createFileRoute("/bairros/centro-pinhais")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-pinhais", title: "Técnico de Informática no Centro de Pinhais | Atendimento Rápido | Técnico Curitiba", description: "Técnico de informática no Centro de Pinhais. Formatação, conserto de notebook/PC, remoção de vírus e upgrade SSD. Atendimento a domicílio rápido (divisa com Curitiba). a partir de R$ 99,99.", noindex: true }),
  component: PinhaisCentro,
});
