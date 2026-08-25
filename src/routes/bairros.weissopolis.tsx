import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import WeissopolisPinhais from "@/pages/bairros/WeissopolisPinhais";

export const Route = createFileRoute("/bairros/weissopolis")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/weissopolis", title: "Técnico de Informática no Weissópolis (Pinhais) | Conserto e Formatação", description: "Técnico de informática no Weissópolis, Pinhais. Conserto de notebook e PC, formatação, vírus, upgrade SSD e redes Wi‑Fi. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: WeissopolisPinhais,
});
