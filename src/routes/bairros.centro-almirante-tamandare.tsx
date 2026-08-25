import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CentroAlmiranteTamandare from "@/pages/bairros/CentroAlmiranteTamandare";

export const Route = createFileRoute("/bairros/centro-almirante-tamandare")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-almirante-tamandare", title: "Técnico de Informática no Centro de Almirante Tamandaré | Técnico Curitiba", description: "Técnico de informática no Centro de Almirante Tamandaré. Formatação, conserto, vírus, upgrade. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: CentroAlmiranteTamandare,
});
