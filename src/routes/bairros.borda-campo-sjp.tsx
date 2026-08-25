import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BordoDoCampoSJP2 from "@/pages/bairros/BordoDoCampoSJP2";

export const Route = createFileRoute("/bairros/borda-campo-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/borda-campo-sjp", title: "Técnico de Informática no Borda do Campo | São José dos Pinhais | Técnico Curitiba", description: "Técnico de informática no Borda do Campo, São José dos Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: BordoDoCampoSJP2,
});
