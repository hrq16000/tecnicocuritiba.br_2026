import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiCristoRei from "@/pages/servico-bairro/RedesWifiCristoRei";

export const Route = createFileRoute("/servicos/redes-wifi/cristo-rei")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/cristo-rei",
    "title": "Configuração de Wi-Fi no Cristo Rei | Curitiba",
    "description": "Instalação e configuração de Wi-Fi, mesh e roteadores no Cristo Rei, Curitiba. Atendimento presencial, valor do atendimento pelo WhatsApp e valor mínimo de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiCristoRei,
});
