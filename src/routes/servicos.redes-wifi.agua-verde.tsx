import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiAguaVerde from "@/pages/servico-bairro/RedesWifiAguaVerde";

export const Route = createFileRoute("/servicos/redes-wifi/agua-verde")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/agua-verde",
    "title": "Configuração de Wi-Fi no Água Verde | Curitiba",
    "description": "Instalação e configuração de Wi-Fi, mesh e roteadores no Água Verde, Curitiba. Atendimento presencial, valor do atendimento pelo WhatsApp e valor mínimo de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiAguaVerde,
});
