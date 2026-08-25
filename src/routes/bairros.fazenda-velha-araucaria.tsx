import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import FazendaVelhaAraucaria from "@/pages/bairros/FazendaVelhaAraucaria";

export const Route = createFileRoute("/bairros/fazenda-velha-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/fazenda-velha-araucaria", title: "Técnico de Informática no Fazenda Velha | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Fazenda Velha, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: FazendaVelhaAraucaria,
});
