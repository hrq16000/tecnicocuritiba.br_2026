import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RedesWifiBigorrilho from "@/pages/servico-bairro/RedesWifiBigorrilho";

export const Route = createFileRoute("/servicos/redes-wifi/bigorrilho")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-wifi/bigorrilho",
    "title": "Configuração de Wi-Fi no Bigorrilho | Curitiba",
    "description": "Wi-Fi, mesh e roteadores no Bigorrilho, Curitiba. Instalação e configuração presencial, com valor combinado pelo WhatsApp a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: RedesWifiBigorrilho,
});
