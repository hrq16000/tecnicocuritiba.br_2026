import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TimbotuvaCL from "@/pages/bairros/TimbotuvaCL";

export const Route = createFileRoute("/bairros/timbotuva-cl")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/timbotuva-cl", title: "Técnico de Informática no Timbotuva | Campo Largo | Técnico Curitiba", description: "Técnico de informática no Timbotuva, Campo Largo. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: TimbotuvaCL,
});
