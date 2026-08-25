import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ThomazCoelhoIIAraucaria from "@/pages/bairros/ThomazCoelhoIIAraucaria";

export const Route = createFileRoute("/bairros/thomaz-coelho-ii")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/thomaz-coelho-ii", title: "Técnico de Informática no Thomaz Coelho II | Araucária | Técnico Curitiba", description: "Técnico de informática no Thomaz Coelho II, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: ThomazCoelhoIIAraucaria,
});
