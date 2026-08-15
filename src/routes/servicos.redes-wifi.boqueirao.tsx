import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiBoqueirao from "@/pages/servico-bairro/RedesWifiBoqueirao";

export const Route = createFileRoute("/servicos/redes-wifi/boqueirao")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/boqueirao",
    "title": "Configuração de Wi-Fi no Boqueirão | Curitiba",
    "description": "Instalação e configuração de Wi-Fi, mesh e roteadores no Boqueirão, Curitiba. Atendimento presencial, valor do atendimento pelo WhatsApp e valor mínimo de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiBoqueirao,
});
