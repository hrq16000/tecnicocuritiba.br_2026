import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimCondorFRG from "@/pages/bairros/JardimCondorFRG";

export const Route = createFileRoute("/bairros/jardim-condor-frg")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-condor-frg", title: "Técnico de Informática no Jardim Condor | Fazenda Rio Grande | Técnico Curitiba", description: "Técnico de informática no Jardim Condor, Fazenda Rio Grande. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimCondorFRG,
});
