import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimParanaguaTamandare from "@/pages/bairros/JardimParanaguaTamandare";

export const Route = createFileRoute("/bairros/jardim-paranagua-at")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-paranagua-at", title: "Técnico de Informática no Jardim Paranaguá | Almirante Tamandaré | Técnico Curitiba", description: "Técnico de informática no Jardim Paranaguá, Almirante Tamandaré. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimParanaguaTamandare,
});
