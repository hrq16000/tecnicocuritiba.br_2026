import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BoaVistaTamandare from "@/pages/bairros/BoaVistaTamandare";

export const Route = createFileRoute("/bairros/boa-vista-at")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/boa-vista-at", title: "Técnico de Informática no Boa Vista | Almirante Tamandaré | Técnico Curitiba", description: "Técnico de informática no Boa Vista, Almirante Tamandaré. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: BoaVistaTamandare,
});
