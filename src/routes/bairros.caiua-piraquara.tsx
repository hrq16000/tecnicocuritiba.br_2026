import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CaiuaPiraquara from "@/pages/bairros/CaiuaPiraquara";

export const Route = createFileRoute("/bairros/caiua-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/caiua-piraquara", title: "Técnico de Informática no Caiuá | Piraquara | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Caiuá, Piraquara. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CaiuaPiraquara,
});
