import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiCajuru from "@/pages/servico-bairro/RedesWifiCajuru";

export const Route = createFileRoute("/servicos/redes-wifi/cajuru")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/cajuru",
    "title": "Configuração de Wi-Fi no Cajuru | Curitiba",
    "description": "Instalação e configuração de Wi-Fi, mesh e roteadores no Cajuru, Curitiba. Atendimento presencial, valor do atendimento pelo WhatsApp e valor mínimo de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiCajuru,
});
