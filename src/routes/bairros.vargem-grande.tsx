import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VargemGrande from "@/pages/bairros/VargemGrande";

export const Route = createFileRoute("/bairros/vargem-grande")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vargem-grande", title: "Técnico de Informática no Vargem Grande | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Vargem Grande, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: VargemGrande,
});
