import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import IguacuAraucaria from "@/pages/bairros/IguacuAraucaria";

export const Route = createFileRoute("/bairros/iguacu-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/iguacu-araucaria", title: "Técnico de Informática no Iguaçu | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Iguaçu, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: IguacuAraucaria,
});
