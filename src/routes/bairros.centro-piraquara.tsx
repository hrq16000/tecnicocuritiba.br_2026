import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CentroPiraquara from "@/pages/bairros/CentroPiraquara";

export const Route = createFileRoute("/bairros/centro-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-piraquara", title: "Técnico de Informática no Centro | Piraquara | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Centro, Piraquara. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CentroPiraquara,
});
