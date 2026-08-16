import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Uberaba from "@/pages/bairros/Uberaba";

export const Route = createFileRoute("/bairros/uberaba")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/uberaba",
    "title": "Técnico de Informática no Uberaba (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Uberaba, Curitiba: conserto de notebook, formatação, remoção de vírus e Wi-Fi para home office. A partir de R$ 99,99. Atendimento via WhatsApp."
  }),
  /* seo:auto-end */
  component: Uberaba,
});
