import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiAltoXV from "@/pages/servico-bairro/RedesWifiAltoXV";

export const Route = createFileRoute("/servicos/redes-wifi/alto-da-xv")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/alto-da-xv",
    "title": "Configuração de Wi-Fi no Alto da XV | Curitiba",
    "description": "Instalação e configuração de Wi-Fi, mesh e roteadores no Alto da XV, Curitiba. Atendimento presencial, valor do atendimento pelo WhatsApp e valor mínimo de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiAltoXV,
});
