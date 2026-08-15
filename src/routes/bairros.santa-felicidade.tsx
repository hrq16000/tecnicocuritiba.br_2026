import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SantaFelicidade from "@/pages/bairros/SantaFelicidade";

export const Route = createFileRoute("/bairros/santa-felicidade")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/santa-felicidade",
    "title": "Técnico de Informática em Santa Felicidade | Curitiba",
    "description": "Técnico de informática em Santa Felicidade, Curitiba: conserto de PC e notebook, formatação, Wi-Fi em casa grande e suporte a comércio. A partir de R$ 99,99. Via WhatsApp."
  }),
  /* seo:auto-end */
  component: SantaFelicidade,
});
