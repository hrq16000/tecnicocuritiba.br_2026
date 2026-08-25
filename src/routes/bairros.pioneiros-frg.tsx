import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PioneirosFRG from "@/pages/bairros/PioneirosFRG";

export const Route = createFileRoute("/bairros/pioneiros-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/pioneiros-frg", title: "Técnico de Informática no Pioneiros | Fazenda Rio Grande | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Pioneiros, Fazenda Rio Grande. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: PioneirosFRG,
});
