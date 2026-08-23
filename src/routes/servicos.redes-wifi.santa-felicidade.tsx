import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiSantaFelicidadeAncora from "@/pages/servico-bairro/RedesWifiSantaFelicidadeAncora";

export const Route = createFileRoute("/servicos/redes-wifi/santa-felicidade")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/santa-felicidade",
    "title": "Configuração de Wi-Fi no Santa Felicidade | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Santa Felicidade, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiSantaFelicidadeAncora,
});
