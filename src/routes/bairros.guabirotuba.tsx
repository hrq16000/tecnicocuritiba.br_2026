import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Guabirotuba from "@/pages/bairros/Guabirotuba";

export const Route = createFileRoute("/bairros/guabirotuba")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/guabirotuba", title: "Assistência Técnica de Informática no Guabirotuba | Curitiba", description: "Técnico de informática no Guabirotuba, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: Guabirotuba,
});
