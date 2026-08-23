import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Anuncie from "@/pages/Anuncie";

export const Route = createFileRoute("/anuncie")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/anuncie",
    "title": "Anuncie no Técnico em Curitiba | Mídia Kit",
    "description": "Espaços de divulgação para marcas e prestadores locais no portal Técnico em Curitiba. Formatos, critérios editoriais e como solicitar o mídia kit.",
    "localBusiness": false
  }),
  /* seo:auto-end */
  component: Anuncie,
});
