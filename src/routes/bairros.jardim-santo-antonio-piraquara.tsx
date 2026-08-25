import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimSantoAntonioPiraquara from "@/pages/bairros/JardimSantoAntonioPiraquara";

export const Route = createFileRoute("/bairros/jardim-santo-antonio-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-santo-antonio-piraquara", title: "Técnico de Informática no Jardim Santo Antônio | Piraquara | Técnico Curitiba", description: "Técnico de informática no Jardim Santo Antônio, Piraquara. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimSantoAntonioPiraquara,
});
