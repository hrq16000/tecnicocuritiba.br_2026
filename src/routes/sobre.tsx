import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Sobre from "@/pages/Sobre";

export const Route = createFileRoute("/sobre")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/sobre",
    "title": "Sobre o Técnico em Curitiba | PC, Notebook e Redes",
    "description": "Conheça o Técnico em Curitiba: foco em informática, notebook, PC, redes e suporte empresarial em Curitiba e região, com diagnóstico honesto e valor transparente."
  }),
  /* seo:auto-end */
  component: Sobre,
});
