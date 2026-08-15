import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiCIC from "@/pages/servico-bairro/RedesWifiCIC";

export const Route = createFileRoute("/servicos/redes-wifi/cic")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/cic",
    "title": "Configuração de Wi-Fi no CIC | Curitiba",
    "description": "Instalação e configuração de Wi-Fi, mesh e roteadores no CIC, Curitiba. Atendimento presencial, valor do atendimento pelo WhatsApp e valor mínimo de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiCIC,
});
