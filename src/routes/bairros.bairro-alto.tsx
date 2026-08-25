import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BairroAlto from "@/pages/bairros/BairroAlto";

export const Route = createFileRoute("/bairros/bairro-alto")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/bairro-alto", title: "Assistência Técnica de Informática no Bairro Alto | Curitiba", description: "Técnico de informática no Bairro Alto, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: BairroAlto,
});
