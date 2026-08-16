import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Xaxim from "@/pages/bairros/Xaxim";

export const Route = createFileRoute("/bairros/xaxim")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/xaxim",
    "title": "Técnico de Informática no Xaxim (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Xaxim, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi em casa. A partir de R$ 99,99. Atendimento via WhatsApp."
  }),
  /* seo:auto-end */
  component: Xaxim,
});
