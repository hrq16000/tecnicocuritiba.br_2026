import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import QuandoNaoCompensa from "@/pages/QuandoNaoCompensa";

export const Route = createFileRoute("/quando-nao-compensa")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/quando-nao-compensa",
    "title": "Quando NÃO Compensa Reparar | Guia Técnico - Curitiba",
    "description": "Guia completo sobre quando compensa e quando NÃO compensa reparar computadores, notebooks, TVs e outros equipamentos. Dicas de um técnico profissional em Curitiba."
  }),
  /* seo:auto-end */
  component: QuandoNaoCompensa,
});
