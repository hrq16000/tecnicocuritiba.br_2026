import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import HortenciaFRG from "@/pages/bairros/HortenciaFRG";

export const Route = createFileRoute("/bairros/hortencia-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/hortencia-frg", title: "Técnico de Informática no Hortência | Fazenda Rio Grande | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Hortência, Fazenda Rio Grande. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: HortenciaFRG,
});
