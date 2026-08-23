import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiBoqueirao from "@/pages/servico-bairro/RedesWifiBoqueirao";

export const Route = createFileRoute("/servicos/redes-wifi/boqueirao")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/boqueirao",
    "title": "Configuração de Wi-Fi no Boqueirão | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Boqueirão, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiBoqueirao,
});
