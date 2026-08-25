import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimPrimaveraPiraquara from "@/pages/bairros/JardimPrimaveraPiraquara";

export const Route = createFileRoute("/bairros/jardim-primavera-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-primavera-piraquara", title: "Técnico de Informática no Jardim Primavera | Piraquara | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Primavera, Piraquara. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimPrimaveraPiraquara,
});
