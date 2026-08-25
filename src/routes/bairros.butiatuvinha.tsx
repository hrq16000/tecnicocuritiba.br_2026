import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Butiatuvinha from "@/pages/bairros/Butiatuvinha";

export const Route = createFileRoute("/bairros/butiatuvinha")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/butiatuvinha", title: "Assistência Técnica de Informática no Butiatuvinha | Curitiba", description: "Técnico de informática no Butiatuvinha, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: Butiatuvinha,
});
