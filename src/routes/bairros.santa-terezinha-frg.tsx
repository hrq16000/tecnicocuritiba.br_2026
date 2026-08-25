import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SantaTerezinhaFRG from "@/pages/bairros/SantaTerezinhaFRG";

export const Route = createFileRoute("/bairros/santa-terezinha-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/santa-terezinha-frg", title: "Técnico de Informática no Santa Terezinha | Fazenda Rio Grande | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Santa Terezinha, Fazenda Rio Grande. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SantaTerezinhaFRG,
});
