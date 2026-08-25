import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SedeCampoMagro from "@/pages/bairros/SedeCampoMagro";

export const Route = createFileRoute("/bairros/sede-campo-magro")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sede-campo-magro", title: "Técnico de Informática no Sede | Campo Magro | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Sede, Campo Magro. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SedeCampoMagro,
});
