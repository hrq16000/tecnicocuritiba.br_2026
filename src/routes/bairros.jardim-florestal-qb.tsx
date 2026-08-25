import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimFlorestalQB from "@/pages/bairros/JardimFlorestalQB";

export const Route = createFileRoute("/bairros/jardim-florestal-qb")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-florestal-qb", title: "Técnico de Informática no Jardim Florestal | Quatro Barras | Técnico Curitiba", description: "Técnico de informática no Jardim Florestal, Quatro Barras. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimFlorestalQB,
});
