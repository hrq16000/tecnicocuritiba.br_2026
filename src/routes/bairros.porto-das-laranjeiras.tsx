import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PortoDasLaranjeiras from "@/pages/bairros/PortoDasLaranjeiras";

export const Route = createFileRoute("/bairros/porto-das-laranjeiras")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/porto-das-laranjeiras", title: "Técnico de Informática no Porto das Laranjeiras | Araucária | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Porto das Laranjeiras, Araucária. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: PortoDasLaranjeiras,
});
