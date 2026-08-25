import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AtubaCuritiba from "@/pages/bairros/AtubaCuritiba";

export const Route = createFileRoute("/bairros/atuba")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/atuba", title: "Assistência Técnica de Informática no Atuba | Curitiba", description: "Técnico de informática no Atuba, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: AtubaCuritiba,
});
