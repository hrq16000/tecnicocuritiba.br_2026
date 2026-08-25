import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimSaoJorgeTamandare from "@/pages/bairros/JardimSaoJorgeTamandare";

export const Route = createFileRoute("/bairros/jardim-sao-jorge-at")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-sao-jorge-at", title: "Técnico de Informática no Jardim São Jorge | Almirante Tamandaré | Técnico Curitiba", description: "Técnico de informática no Jardim São Jorge, Almirante Tamandaré. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimSaoJorgeTamandare,
});
