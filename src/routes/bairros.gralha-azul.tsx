import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import GralhaAzulFRG from "@/pages/bairros/GralhaAzulFRG";

export const Route = createFileRoute("/bairros/gralha-azul")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/gralha-azul", title: "Técnico de Informática no Gralha Azul | Fazenda Rio Grande | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Gralha Azul, Fazenda Rio Grande. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: GralhaAzulFRG,
});
