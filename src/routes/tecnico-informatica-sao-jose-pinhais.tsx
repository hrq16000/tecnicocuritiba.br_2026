import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TecnicoInformaticaSaoJosePinhais from "@/pages/TecnicoInformaticaSaoJosePinhais";

export const Route = createFileRoute("/tecnico-informatica-sao-jose-pinhais")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/tecnico-informatica-sao-jose-pinhais",
    "title": "Técnico em São José dos Pinhais para Notebook e PC",
    "description": "Técnico de informática em São José dos Pinhais: formatação, conserto de notebook e PC, upgrade de SSD, redes e suporte a empresas."
  }),
  /* seo:auto-end */
  component: TecnicoInformaticaSaoJosePinhais,
});
