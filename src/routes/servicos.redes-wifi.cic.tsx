import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiCIC from "@/pages/servico-bairro/RedesWifiCIC";

export const Route = createFileRoute("/servicos/redes-wifi/cic")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/cic",
    "title": "Configuração de Wi-Fi no CIC | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no CIC, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiCIC,
});
