import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Braga from "@/pages/bairros/Braga";

export const Route = createFileRoute("/bairros/braga")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/braga", title: "Técnico de Informática no Braga SJP | Conserto e Manutenção | Técnico Curitiba", description: "Técnico de informática no bairro Braga em São José dos Pinhais. Manutenção, conserto de PC e notebook. Atendimento em domicílio. a partir de R$ 99,99.", noindex: true }),
  component: Braga,
});
