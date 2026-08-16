import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Reboucas from "@/pages/bairros/Reboucas";

export const Route = createFileRoute("/bairros/reboucas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/reboucas",
    "title": "Técnico de Informática no Rebouças (Curitiba) | Empresas e PC",
    "description": "Técnico de informática no Rebouças, Curitiba: suporte a escritórios, manutenção de computador, formatação e rede. A partir de R$ 99,99. Atendimento via WhatsApp."
  }),
  /* seo:auto-end */
  component: Reboucas,
});
