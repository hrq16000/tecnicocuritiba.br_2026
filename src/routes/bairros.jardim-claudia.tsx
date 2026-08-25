import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimClaudia from "@/pages/bairros/JardimClaudia";

export const Route = createFileRoute("/bairros/jardim-claudia")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-claudia", title: "Técnico de Informática no Jardim Cláudia | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Cláudia, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimClaudia,
});
