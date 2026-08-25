import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoSebastiaoCM from "@/pages/bairros/SaoSebastiaoCM";

export const Route = createFileRoute("/bairros/sao-sebastiao-cm")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-sebastiao-cm", title: "Técnico de Informática no São Sebastião | Campo Magro | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no São Sebastião, Campo Magro. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SaoSebastiaoCM,
});
