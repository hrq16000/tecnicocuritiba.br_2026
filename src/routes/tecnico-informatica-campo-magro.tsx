import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TecnicoInformaticaCampoMagro from "@/pages/TecnicoInformaticaCampoMagro";

export const Route = createFileRoute("/tecnico-informatica-campo-magro")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/tecnico-informatica-campo-magro",
    "title": "Técnico em Campo Magro para Notebook, PC e Wi-Fi",
    "description": "Técnico de informática em Campo Magro: conserto de notebook e PC, formatação, upgrade de SSD, remoção de vírus e Wi-Fi em chácaras e casas."
  }),
  /* seo:auto-end */
  component: TecnicoInformaticaCampoMagro,
});
