import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Hauer from "@/pages/bairros/Hauer";

export const Route = createFileRoute("/bairros/hauer")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/hauer",
    "title": "Técnico de Informática no Hauer (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Hauer, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e rede Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp."
  }),
  /* seo:auto-end */
  component: Hauer,
});
