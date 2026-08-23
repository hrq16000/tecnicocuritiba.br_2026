import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiReboucas from "@/pages/servico-bairro/RedesWifiReboucas";

export const Route = createFileRoute("/servicos/redes-wifi/reboucas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/reboucas",
    "title": "Configuração de Wi-Fi no Rebouças | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Rebouças, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiReboucas,
});
