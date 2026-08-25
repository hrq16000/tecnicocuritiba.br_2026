import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimUniaoPiraquara from "@/pages/bairros/JardimUniaoPiraquara";

export const Route = createFileRoute("/bairros/jardim-uniao-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-uniao-piraquara", title: "Técnico de Informática no Jardim União | Piraquara | Técnico Curitiba", description: "Técnico de informática no Jardim União, Piraquara. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimUniaoPiraquara,
});
