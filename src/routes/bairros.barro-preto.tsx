import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BarroPreto from "@/pages/bairros/BarroPreto";

export const Route = createFileRoute("/bairros/barro-preto")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/barro-preto", title: "Técnico de Informática no Barro Preto SJP | Técnico Curitiba", description: "Técnico de informática no Barro Preto, São José dos Pinhais. Conserto de PC e notebook, formatação. Visita técnica domiciliar. a partir de R$ 99,99.", noindex: true }),
  component: BarroPreto,
});
