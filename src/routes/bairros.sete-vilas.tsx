import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SeteVilas from "@/pages/bairros/SeteVilas";

export const Route = createFileRoute("/bairros/sete-vilas")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sete-vilas", title: "Técnico de Informática no Sete Vilas | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Sete Vilas, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SeteVilas,
});
