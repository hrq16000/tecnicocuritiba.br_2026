import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ManutencaoTvBoaVista from "@/pages/servico-bairro/ManutencaoTvBoaVista";

export const Route = createFileRoute("/servicos/manutencao-tv/boa-vista")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-tv/boa-vista",
    "title": "Conserto de Smart TV no Boa Vista | Curitiba",
    "description": "Reparo e troca de tela de Smart TV LED/LCD no Boa Vista, Curitiba. Diagnóstico em bancada, coleta e entrega, valor do atendimento pelo WhatsApp."
  }),
  /* seo:auto-end */
  component: ManutencaoTvBoaVista,
});
