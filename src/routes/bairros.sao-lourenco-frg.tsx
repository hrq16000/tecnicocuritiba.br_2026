import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoLourencoFRG from "@/pages/bairros/SaoLourencoFRG";

export const Route = createFileRoute("/bairros/sao-lourenco-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-lourenco-frg", title: "Técnico de Informática no São Lourenço | Fazenda Rio Grande | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no São Lourenço, Fazenda Rio Grande. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SaoLourencoFRG,
});
