import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ItaquiCL from "@/pages/bairros/ItaquiCL";

export const Route = createFileRoute("/bairros/itaqui")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/itaqui", title: "Técnico de Informática no Itaqui | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Itaqui, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: ItaquiCL,
});
