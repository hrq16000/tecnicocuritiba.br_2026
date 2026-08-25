import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimSaoPauloPiraquara from "@/pages/bairros/JardimSaoPauloPiraquara";

export const Route = createFileRoute("/bairros/jardim-sao-paulo-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-sao-paulo-piraquara", title: "Técnico de Informática no Jardim São Paulo | Piraquara | Técnico Curitiba", description: "Técnico de informática no Jardim São Paulo, Piraquara. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimSaoPauloPiraquara,
});
