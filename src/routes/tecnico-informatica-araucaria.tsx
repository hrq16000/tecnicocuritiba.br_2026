import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TecnicoInformaticaAraucaria from "@/pages/TecnicoInformaticaAraucaria";

export const Route = createFileRoute("/tecnico-informatica-araucaria")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/tecnico-informatica-araucaria",
    "title": "Técnico em Araucária para Notebook, PC e Empresas",
    "description": "Técnico de informática em Araucária: formatação, conserto de notebook e PC, upgrade de SSD, redes e suporte empresarial."
  }),
  /* seo:auto-end */
  component: TecnicoInformaticaAraucaria,
});
