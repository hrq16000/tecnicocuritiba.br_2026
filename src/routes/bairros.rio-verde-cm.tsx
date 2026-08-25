import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RioVerdeCM from "@/pages/bairros/RioVerdeCM";

export const Route = createFileRoute("/bairros/rio-verde-cm")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/rio-verde-cm", title: "Técnico de Informática no Rio Verde | Campo Magro | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Rio Verde, Campo Magro. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: RioVerdeCM,
});
