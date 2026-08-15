import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TecnicoInformaticaPiraquara from "@/pages/TecnicoInformaticaPiraquara";

export const Route = createFileRoute("/tecnico-informatica-piraquara")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/tecnico-informatica-piraquara",
    "title": "Técnico em Piraquara para Notebook, PC e Internet",
    "description": "Técnico de informática em Piraquara: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus e Wi-Fi. Atendimento a domicílio ou coleta combinada por WhatsApp."
  }),
  /* seo:auto-end */
  component: TecnicoInformaticaPiraquara,
});
