import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Pinheirinho from "@/pages/bairros/Pinheirinho";

export const Route = createFileRoute("/bairros/pinheirinho")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/pinheirinho",
    "title": "Técnico de Informática no Pinheirinho (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Pinheirinho, Curitiba: manutenção de computador, conserto de notebook, formatação e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp."
  }),
  /* seo:auto-end */
  component: Pinheirinho,
});
