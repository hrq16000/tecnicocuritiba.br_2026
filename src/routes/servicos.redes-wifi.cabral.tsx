import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiCabral from "@/pages/servico-bairro/RedesWifiCabral";

export const Route = createFileRoute("/servicos/redes-wifi/cabral")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/cabral",
    "title": "Configuração de Wi-Fi no Cabral | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Cabral, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiCabral,
});
