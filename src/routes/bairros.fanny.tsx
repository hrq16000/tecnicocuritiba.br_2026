import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Fanny from "@/pages/bairros/Fanny";

export const Route = createFileRoute("/bairros/fanny")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/fanny", title: "Assistência Técnica de Informática no Fanny | Curitiba", description: "Técnico de informática no Fanny, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: Fanny,
});
