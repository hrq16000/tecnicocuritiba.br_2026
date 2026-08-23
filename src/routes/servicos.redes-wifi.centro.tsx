import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiCentro from "@/pages/servico-bairro/RedesWifiCentro";

export const Route = createFileRoute("/servicos/redes-wifi/centro")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/centro",
    "title": "Configuração de Wi-Fi no Centro | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Centro, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiCentro,
});
