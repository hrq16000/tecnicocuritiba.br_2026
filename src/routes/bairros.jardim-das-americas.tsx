import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimAmericas from "@/pages/bairros/JardimAmericas";

export const Route = createFileRoute("/bairros/jardim-das-americas")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-das-americas", title: "Técnico de Informática no Jardim das Américas | Curitiba | Técnico Curitiba", description: "Técnico de informática no Jardim das Américas, Curitiba. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimAmericas,
});
