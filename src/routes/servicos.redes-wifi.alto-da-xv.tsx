import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiAltoXV from "@/pages/servico-bairro/RedesWifiAltoXV";

export const Route = createFileRoute("/servicos/redes-wifi/alto-da-xv")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/alto-da-xv",
    "title": "Configuração de Wi-Fi no Alto da XV | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Alto da XV, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiAltoXV,
});
