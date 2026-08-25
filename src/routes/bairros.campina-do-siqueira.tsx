import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CampinaDoSiqueira from "@/pages/bairros/CampinaDoSiqueira";

export const Route = createFileRoute("/bairros/campina-do-siqueira")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/campina-do-siqueira", title: "Assistência Técnica de Informática no Campina do Siqueira | Curitiba", description: "Técnico de informática no Campina do Siqueira, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: CampinaDoSiqueira,
});
