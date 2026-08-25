import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PinevillePinhais from "@/pages/bairros/PinevillePinhais";

export const Route = createFileRoute("/bairros/pineville")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/pineville", title: "Técnico de Informática no Pineville (Pinhais) | Atendimento a Domicílio", description: "Técnico de informática no Pineville, Pinhais. Formatação, conserto, vírus, upgrade e configuração de internet/Wi‑Fi. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: PinevillePinhais,
});
