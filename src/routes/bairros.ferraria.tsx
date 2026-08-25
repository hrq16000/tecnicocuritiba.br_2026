import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import FerrariaCampoLargo from "@/pages/bairros/FerrariaCampoLargo";

export const Route = createFileRoute("/bairros/ferraria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/ferraria", title: "Técnico de Informática na Ferraria (Campo Largo) | Atendimento a Domicílio", description: "Técnico de informática na Ferraria, Campo Largo. Assistência técnica para computadores e notebooks: formatação, conserto, vírus, upgrade e redes. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: FerrariaCampoLargo,
});
