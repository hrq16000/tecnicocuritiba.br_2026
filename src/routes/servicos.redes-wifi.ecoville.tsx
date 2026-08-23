import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiEcoville from "@/pages/servico-bairro/RedesWifiEcoville";

export const Route = createFileRoute("/servicos/redes-wifi/ecoville")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/ecoville",
    "title": "Configuração de Wi-Fi no Ecoville | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Ecoville, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiEcoville,
});
