import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import GabirobalColombo from "@/pages/bairros/GabirobalColombo";

export const Route = createFileRoute("/bairros/gabirobal")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/gabirobal", title: "Técnico de Informática no Gabirobal | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Gabirobal, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: GabirobalColombo,
});
