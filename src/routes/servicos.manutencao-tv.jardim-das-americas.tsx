import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ManutencaoTvJardimAmericas from "@/pages/servico-bairro/ManutencaoTvJardimAmericas";

export const Route = createFileRoute("/servicos/manutencao-tv/jardim-das-americas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-tv/jardim-das-americas",
    "title": "Conserto de Smart TV no Jardim das Américas | Curitiba",
    "description": "Reparo e troca de tela de Smart TV LED/LCD no Jardim das Américas, Curitiba. Diagnóstico em bancada, coleta e entrega, valor do atendimento pelo WhatsApp."
  }),
  /* seo:auto-end */
  component: ManutencaoTvJardimAmericas,
});
