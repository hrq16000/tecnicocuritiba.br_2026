import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TaxiqueiraColomboo from "@/pages/bairros/TaxiqueiraColomboo";

export const Route = createFileRoute("/bairros/taxiqueira-colombo")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/taxiqueira-colombo", title: "Técnico de Informática no Taxiqueira | Colombo | Técnico Curitiba", description: "Técnico de informática no Taxiqueira, Colombo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: TaxiqueiraColomboo,
});
