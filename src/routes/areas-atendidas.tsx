import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AreasAtendidas from "@/pages/AreasAtendidas";

export const Route = createFileRoute("/areas-atendidas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/areas-atendidas",
    "title": "Áreas Atendidas em Curitiba e Região | Bairros e Cidades",
    "description": "Bairros de Curitiba e cidades da região metropolitana atendidas pelo Técnico em Curitiba, com a modalidade indicada em cada caso: no local, remoto ou coleta para."
  }),
  /* seo:auto-end */
  component: AreasAtendidas,
});
