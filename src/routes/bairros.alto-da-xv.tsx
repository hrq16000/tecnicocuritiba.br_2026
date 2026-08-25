import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AltoDaXV from "@/pages/bairros/AltoDaXV";

export const Route = createFileRoute("/bairros/alto-da-xv")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/alto-da-xv", title: "Assistência Técnica de Informática no Alto da XV | Curitiba", description: "Técnico de informática no Alto da XV, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: AltoDaXV,
});
