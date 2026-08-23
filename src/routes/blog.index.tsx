import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Blog from "@/pages/Blog";

export const Route = createFileRoute("/blog/")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/blog",
    "title": "Blog Técnico | Manutenção e Suporte de Informática",
    "description": "Artigos técnicos revisados sobre manutenção de computadores, notebooks, redes e organização de TI, escritos pela operação que atende Curitiba e região.",
    "localBusiness": false
  }),
  /* seo:auto-end */
  component: Blog,
});
