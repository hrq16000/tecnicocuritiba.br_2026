import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TresCorregosCL from "@/pages/bairros/TresCorregosCL";

export const Route = createFileRoute("/bairros/tres-corregos")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/tres-corregos", title: "Técnico de Informática no Três Córregos | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Três Córregos, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: TresCorregosCL,
});
