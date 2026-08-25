import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CentroCivico from "@/pages/bairros/CentroCivico";

export const Route = createFileRoute("/bairros/centro-civico")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/centro-civico", title: "Assistência Técnica de Informática no Centro Cívico | Curitiba", description: "Técnico de informática no Centro Cívico, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: CentroCivico,
});
