import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TecnicoInformaticaAlmiranteTamandare from "@/pages/TecnicoInformaticaAlmiranteTamandare";

export const Route = createFileRoute("/tecnico-informatica-almirante-tamandare")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/tecnico-informatica-almirante-tamandare",
    "title": "Técnico em Almirante Tamandaré | Notebook e PC",
    "description": "Técnico de informática em Almirante Tamandaré: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus e redes. Visita agendada ou coleta via WhatsApp."
  }),
  /* seo:auto-end */
  component: TecnicoInformaticaAlmiranteTamandare,
});
