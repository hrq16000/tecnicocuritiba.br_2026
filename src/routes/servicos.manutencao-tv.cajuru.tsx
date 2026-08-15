import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ManutencaoTvCajuru from "@/pages/servico-bairro/ManutencaoTvCajuru";

export const Route = createFileRoute("/servicos/manutencao-tv/cajuru")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-tv/cajuru",
    "title": "Conserto de Smart TV no Cajuru | Curitiba",
    "description": "Reparo e troca de tela de Smart TV LED/LCD no Cajuru, Curitiba. Diagnóstico em bancada, coleta e entrega, valor do atendimento pelo WhatsApp."
  }),
  /* seo:auto-end */
  component: ManutencaoTvCajuru,
});
