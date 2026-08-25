import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SantaCruzCL from "@/pages/bairros/SantaCruzCL";

export const Route = createFileRoute("/bairros/santa-cruz-campo-largo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/santa-cruz-campo-largo", title: "Técnico de Informática no Santa Cruz | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Santa Cruz, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SantaCruzCL,
});
