import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import NacoesFRG from "@/pages/bairros/NacoesFRG";

export const Route = createFileRoute("/bairros/nacoes-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/nacoes-frg", title: "Técnico de Informática no Nações (Fazenda Rio Grande) | Técnico Curitiba", description: "Técnico de informática no Nações, Fazenda Rio Grande. Formatação, conserto, upgrade SSD e redes Wi-Fi. Atendimento domiciliar. a partir de R$ 99,99.", noindex: true }),
  component: NacoesFRG,
});
