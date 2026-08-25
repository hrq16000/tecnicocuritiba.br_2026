import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CentroCampoMagro from "@/pages/bairros/CentroCampoMagro";

export const Route = createFileRoute("/bairros/centro-campo-magro")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-campo-magro", title: "Técnico de Informática no Centro | Campo Magro | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Centro, Campo Magro. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CentroCampoMagro,
});
