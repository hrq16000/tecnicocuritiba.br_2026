import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ManutencaoTvBigorrilho from "@/pages/servico-bairro/ManutencaoTvBigorrilho";

export const Route = createFileRoute("/servicos/manutencao-tv/bigorrilho")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-tv/bigorrilho",
    "title": "Conserto de Smart TV no Bigorrilho | Curitiba",
    "description": "Reparo e troca de tela de Smart TV LED/LCD no Bigorrilho, Curitiba. Diagnóstico em bancada, coleta e entrega, valor do atendimento pelo WhatsApp."
  }),
  /* seo:auto-end */
  component: ManutencaoTvBigorrilho,
});
