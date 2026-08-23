import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiJardimAmericas from "@/pages/servico-bairro/RedesWifiJardimAmericas";

export const Route = createFileRoute("/servicos/redes-wifi/jardim-das-americas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/jardim-das-americas",
    "title": "Configuração de Wi-Fi no Jardim das Américas | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Jardim das Américas, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiJardimAmericas,
});
