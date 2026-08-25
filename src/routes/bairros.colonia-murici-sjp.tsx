import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ColoniaMurcySJP from "@/pages/bairros/ColoniaMurcySJP";

export const Route = createFileRoute("/bairros/colonia-murici-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/colonia-murici-sjp", title: "Técnico de Informática no Colônia Murici | São José dos Pinhais | Técnico Curitiba", description: "Técnico de informática no Colônia Murici, São José dos Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: ColoniaMurcySJP,
});
