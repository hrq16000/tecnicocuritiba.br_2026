import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiBoaVista from "@/pages/servico-bairro/RedesWifiBoaVista";

export const Route = createFileRoute("/servicos/redes-wifi/boa-vista")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/boa-vista",
    "title": "Configuração de Wi-Fi no Boa Vista | Curitiba",
    "description": "Instalação e configuração de Wi-Fi, mesh e roteadores no Boa Vista, Curitiba. Atendimento presencial, valor do atendimento pelo WhatsApp e valor mínimo de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiBoaVista,
});
