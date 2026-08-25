import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import DelRey from "@/pages/bairros/DelRey";

export const Route = createFileRoute("/bairros/del-rey")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/del-rey", title: "Técnico de Informática no Del Rey SJP | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Del Rey, São José dos Pinhais. Formatação, conserto, upgrade SSD. Atendimento rápido em domicílio. a partir de R$ 99,99.", noindex: true }),
  component: DelRey,
});
