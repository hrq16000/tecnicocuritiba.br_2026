import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimDasPedrasFRG from "@/pages/bairros/JardimDasPedrasFRG";

export const Route = createFileRoute("/bairros/jardim-das-pedras-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-das-pedras-frg", title: "Técnico de Informática no Jardim das Pedras | Fazenda Rio Grande | Técnico Curitiba", description: "Técnico de informática no Jardim das Pedras, Fazenda Rio Grande. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimDasPedrasFRG,
});
