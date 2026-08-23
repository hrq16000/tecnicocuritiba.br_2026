import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TecnicoInformaticaPinhais from "@/pages/TecnicoInformaticaPinhais";

export const Route = createFileRoute("/tecnico-informatica-pinhais")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/tecnico-informatica-pinhais",
    "title": "Técnico em Pinhais para Notebook, PC e Redes",
    "description": "Técnico de informática em Pinhais: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial."
  }),
  /* seo:auto-end */
  component: TecnicoInformaticaPinhais,
});
