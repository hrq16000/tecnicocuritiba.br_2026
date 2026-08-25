import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SantaQuiteria from "@/pages/bairros/SantaQuiteria";

export const Route = createFileRoute("/bairros/santa-quiteria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/santa-quiteria", title: "Assistência Técnica de Informática no Santa Quitéria | Curitiba", description: "Técnico de informática no Santa Quitéria, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: SantaQuiteria,
});
