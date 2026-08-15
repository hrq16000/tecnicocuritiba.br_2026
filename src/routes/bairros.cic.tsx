import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CIC from "@/pages/bairros/CIC";

export const Route = createFileRoute("/bairros/cic")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/cic",
    "title": "Técnico de Informática no CIC (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no CIC, Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para empresas. Diagnóstico a partir de R$ 99,99. Via WhatsApp."
  }),
  /* seo:auto-end */
  component: CIC,
});
