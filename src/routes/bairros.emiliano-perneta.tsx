import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import EmilianoPerneta from "@/pages/bairros/EmilianoPerneta";

export const Route = createFileRoute("/bairros/emiliano-perneta")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/emiliano-perneta", title: "Técnico de Informática no Emiliano Perneta | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Emiliano Perneta, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: EmilianoPerneta,
});
