import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VilaMacedoPiraquara from "@/pages/bairros/VilaMacedoPiraquara";

export const Route = createFileRoute("/bairros/vila-macedo-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vila-macedo-piraquara", title: "Técnico de Informática no Vila Macedo | Piraquara | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Vila Macedo, Piraquara. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: VilaMacedoPiraquara,
});
