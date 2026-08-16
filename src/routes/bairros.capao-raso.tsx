import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CapaoRaso from "@/pages/bairros/CapaoRaso";

export const Route = createFileRoute("/bairros/capao-raso")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/capao-raso",
    "title": "Técnico de Informática no Capão Raso (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Capão Raso, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e upgrade de SSD. A partir de R$ 99,99. Via WhatsApp."
  }),
  /* seo:auto-end */
  component: CapaoRaso,
});
