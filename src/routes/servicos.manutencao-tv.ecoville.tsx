import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ManutencaoTvEcoville from "@/pages/servico-bairro/ManutencaoTvEcoville";

export const Route = createFileRoute("/servicos/manutencao-tv/ecoville")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-tv/ecoville",
    "title": "Conserto de Smart TV no Ecoville | Curitiba",
    "description": "Reparo e troca de tela de Smart TV LED/LCD no Ecoville, Curitiba. Diagnóstico em bancada, coleta e entrega, valor do atendimento pelo WhatsApp."
  }),
  /* seo:auto-end */
  component: ManutencaoTvEcoville,
});
