import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CampinaDaBarra from "@/pages/bairros/CampinaDaBarra";

export const Route = createFileRoute("/bairros/campina-da-barra")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/campina-da-barra", title: "Técnico de Informática no Campina da Barra | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Campina da Barra, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: CampinaDaBarra,
});
