import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import IraiPiraquara from "@/pages/bairros/IraiPiraquara";

export const Route = createFileRoute("/bairros/irai-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/irai-piraquara", title: "Técnico de Informática no Iraí | Piraquara | Técnico Curitiba", description: "Técnico de informática no Iraí, Piraquara. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: IraiPiraquara,
});
