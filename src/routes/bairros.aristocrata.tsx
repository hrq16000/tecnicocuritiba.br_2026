import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Aristocrata from "@/pages/bairros/Aristocrata";

export const Route = createFileRoute("/bairros/aristocrata")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/aristocrata", title: "Técnico de Informática no Aristocrata SJP | Assistência Técnica | Técnico Curitiba", description: "Técnico de informática no Aristocrata em São José dos Pinhais. Conserto, formatação, upgrade. Atendimento domiciliar rápido. Serviços a partir de a partir de R$ 99,99.", noindex: true }),
  component: Aristocrata,
});
