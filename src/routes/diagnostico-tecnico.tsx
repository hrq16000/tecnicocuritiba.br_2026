import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import DiagnosticoTecnico from "@/pages/DiagnosticoTecnico";

export const Route = createFileRoute("/diagnostico-tecnico")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/diagnostico-tecnico",
    "title": "Diagnóstico Técnico de Computador e Notebook em Curitiba",
    "description": "Diagnóstico técnico para identificar falhas em computadores e notebooks, avaliar a viabilidade do serviço e orientar o valor."
  }),
  /* seo:auto-end */
  component: DiagnosticoTecnico,
});
