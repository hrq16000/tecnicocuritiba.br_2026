import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiReboucas from "@/pages/servico-bairro/RedesWifiReboucas";

export const Route = createFileRoute("/servicos/redes-wifi/reboucas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/reboucas",
    "title": "Configuração de Wi-Fi no Rebouças | Curitiba",
    "description": "Instalação e configuração de Wi-Fi, mesh e roteadores no Rebouças, Curitiba. Atendimento presencial, valor do atendimento pelo WhatsApp e valor mínimo de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiReboucas,
});
