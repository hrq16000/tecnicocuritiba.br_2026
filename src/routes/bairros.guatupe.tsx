import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Guatupe from "@/pages/bairros/Guatupe";

export const Route = createFileRoute("/bairros/guatupe")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/guatupe", title: "Técnico de Informática no Guatupê SJP | Atendimento Rápido | Técnico Curitiba", description: "Técnico de informática no Guatupê, São José dos Pinhais. Formatação, conserto, upgrade de hardware. Visita técnica domiciliar. a partir de R$ 99,99.", noindex: true }),
  component: Guatupe,
});
