import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Boqueirao from "@/pages/bairros/Boqueirao";

export const Route = createFileRoute("/bairros/boqueirao")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/boqueirao",
    "title": "Técnico de Informática no Boqueirão (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Boqueirão, Curitiba: conserto de PC e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp."
  }),
  /* seo:auto-end */
  component: Boqueirao,
});
