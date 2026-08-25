import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import GuaritubaPiraquara from "@/pages/bairros/GuaritubaPiraquara";

export const Route = createFileRoute("/bairros/guarituba-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/guarituba-piraquara", title: "Técnico de Informática no Guarituba | Piraquara | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Guarituba, Piraquara. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: GuaritubaPiraquara,
});
