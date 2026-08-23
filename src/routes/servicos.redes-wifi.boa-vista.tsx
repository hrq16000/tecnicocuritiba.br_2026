import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiBoaVista from "@/pages/servico-bairro/RedesWifiBoaVista";

export const Route = createFileRoute("/servicos/redes-wifi/boa-vista")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/boa-vista",
    "title": "Configuração de Wi-Fi no Boa Vista | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Boa Vista, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiBoaVista,
});
