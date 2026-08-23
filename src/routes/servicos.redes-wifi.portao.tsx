import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiPortao from "@/pages/servico-bairro/RedesWifiPortao";

export const Route = createFileRoute("/servicos/redes-wifi/portao")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/portao",
    "title": "Configuração de Wi-Fi no Portão | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Portão, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiPortao,
});
