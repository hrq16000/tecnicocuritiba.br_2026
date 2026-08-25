import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Tingui from "@/pages/bairros/Tingui";

export const Route = createFileRoute("/bairros/tingui")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/tingui", title: "Técnico de Informática no Tingui | Curitiba | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Tingui, Curitiba. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: Tingui,
});
