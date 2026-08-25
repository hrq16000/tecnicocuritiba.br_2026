import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import EucaliptosFRG from "@/pages/bairros/EucaliptosFRG";

export const Route = createFileRoute("/bairros/eucaliptos-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/eucaliptos-frg", title: "Técnico de Informática no Eucaliptos (Fazenda Rio Grande) | Técnico Curitiba", description: "Técnico de informática no Eucaliptos, Fazenda Rio Grande. Conserto de PC/notebook, formatação, upgrade e redes. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: EucaliptosFRG,
});
