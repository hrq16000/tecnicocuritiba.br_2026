import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import NovoMundo from "@/pages/bairros/NovoMundo";

export const Route = createFileRoute("/bairros/novo-mundo")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/novo-mundo",
    "title": "Técnico de Informática no Novo Mundo (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Novo Mundo, Curitiba: manutenção de computador, conserto de notebook, upgrade de SSD e rede para comércio. A partir de R$ 99,99. Via WhatsApp."
  }),
  /* seo:auto-end */
  component: NovoMundo,
});
