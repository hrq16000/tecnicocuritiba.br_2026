import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AltoBoqueiraoCtba from "@/pages/bairros/AltoBoqueiraoCtba";

export const Route = createFileRoute("/bairros/alto-boqueirao")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/alto-boqueirao", title: "Técnico de Informática no Alto Boqueirão | Curitiba | Técnico Curitiba", description: "Técnico de informática no Alto Boqueirão, Curitiba. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: AltoBoqueiraoCtba,
});
