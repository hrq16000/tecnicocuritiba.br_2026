import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PradoVelho from "@/pages/bairros/PradoVelho";

export const Route = createFileRoute("/bairros/prado-velho")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/prado-velho", title: "Assistência Técnica de Informática no Prado Velho | Curitiba", description: "Técnico de informática no Prado Velho, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: PradoVelho,
});
