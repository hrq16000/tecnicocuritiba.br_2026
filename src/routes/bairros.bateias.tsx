import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BateiasCL from "@/pages/bairros/BateiasCL";

export const Route = createFileRoute("/bairros/bateias")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/bateias", title: "Técnico de Informática no Bateias | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Bateias, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: BateiasCL,
});
