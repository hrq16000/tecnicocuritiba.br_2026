import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ManutencaoTvAguaVerde from "@/pages/servico-bairro/ManutencaoTvAguaVerde";

export const Route = createFileRoute("/servicos/manutencao-tv/agua-verde")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-tv/agua-verde",
    "title": "Conserto de Smart TV no Água Verde | Curitiba",
    "description": "Reparo e troca de tela de Smart TV LED/LCD no Água Verde, Curitiba. Diagnóstico em bancada, coleta e entrega, valor do atendimento pelo WhatsApp."
  }),
  /* seo:auto-end */
  component: ManutencaoTvAguaVerde,
});
