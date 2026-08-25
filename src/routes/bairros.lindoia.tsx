import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Lindoia from "@/pages/bairros/Lindoia";

export const Route = createFileRoute("/bairros/lindoia")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/lindoia", title: "Assistência Técnica de Informática no Lindóia | Curitiba", description: "Técnico de informática no Lindóia, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: Lindoia,
});
