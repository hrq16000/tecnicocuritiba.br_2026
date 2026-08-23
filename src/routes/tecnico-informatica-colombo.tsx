import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TecnicoInformaticaColombo from "@/pages/TecnicoInformaticaColombo";

export const Route = createFileRoute("/tecnico-informatica-colombo")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/tecnico-informatica-colombo",
    "title": "Técnico em Colombo para Notebook, PC e Informática",
    "description": "Técnico de informática em Colombo: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial."
  }),
  /* seo:auto-end */
  component: TecnicoInformaticaColombo,
});
