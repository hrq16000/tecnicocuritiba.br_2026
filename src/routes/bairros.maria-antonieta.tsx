import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import MariaAntonieta from "@/pages/bairros/MariaAntonieta";

export const Route = createFileRoute("/bairros/maria-antonieta")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/maria-antonieta", title: "Técnico de Informática no Maria Antonieta | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Maria Antonieta, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: MariaAntonieta,
});
