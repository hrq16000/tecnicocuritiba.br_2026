import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoCristovao from "@/pages/bairros/SaoCristovao";

export const Route = createFileRoute("/bairros/sao-cristovao")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-cristovao", title: "Técnico de Informática no São Cristóvão SJP | Técnico Curitiba", description: "Técnico de informática no São Cristóvão, São José dos Pinhais. Conserto de PC e notebook, formatação, upgrade. Atendimento domiciliar. a partir de R$ 99,99.", noindex: true }),
  component: SaoCristovao,
});
