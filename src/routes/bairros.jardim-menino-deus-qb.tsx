import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimMeninoDeusQB from "@/pages/bairros/JardimMeninoDeusQB";

export const Route = createFileRoute("/bairros/jardim-menino-deus-qb")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-menino-deus-qb", title: "Técnico de Informática no Jardim Menino Deus | Quatro Barras | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Menino Deus, Quatro Barras. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimMeninoDeusQB,
});
