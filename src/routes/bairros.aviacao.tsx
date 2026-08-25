import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Aviacao from "@/pages/bairros/Aviacao";

export const Route = createFileRoute("/bairros/aviacao")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/aviacao", title: "Técnico de Informática na Aviação SJP | Próximo ao Aeroporto | Técnico Curitiba", description: "Técnico de informática no bairro Aviação em São José dos Pinhais. Próximo ao Aeroporto Afonso Pena. Atendimento rápido. Serviços a partir de a partir de R$ 99,99.", noindex: true }),
  component: Aviacao,
});
