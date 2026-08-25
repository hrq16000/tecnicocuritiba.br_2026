import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimIperigoFRG from "@/pages/bairros/JardimIperigoFRG";

export const Route = createFileRoute("/bairros/jardim-ipe-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-ipe-frg", title: "Técnico de Informática no Jardim Ipê | Fazenda Rio Grande | Técnico Curitiba", description: "Técnico de informática no Jardim Ipê, Fazenda Rio Grande. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimIperigoFRG,
});
