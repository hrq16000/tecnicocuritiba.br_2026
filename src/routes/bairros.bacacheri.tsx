import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Bacacheri from "@/pages/bairros/Bacacheri";

export const Route = createFileRoute("/bairros/bacacheri")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/bacacheri",
    "title": "Técnico de Informática no Bacacheri (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Bacacheri, Curitiba: conserto de notebook, manutenção de computador, formatação e rede Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp."
  }),
  /* seo:auto-end */
  component: Bacacheri,
});
