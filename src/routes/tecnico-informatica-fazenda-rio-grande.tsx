import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import TecnicoInformaticaFazendaRioGrande from "@/pages/TecnicoInformaticaFazendaRioGrande";

export const Route = createFileRoute("/tecnico-informatica-fazenda-rio-grande")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/tecnico-informatica-fazenda-rio-grande",
    "title": "Técnico em Fazenda Rio Grande | PC, Notebook e Rede",
    "description": "Técnico de informática em Fazenda Rio Grande: conserto de notebook e PC, formatação, upgrade de SSD, remoção de vírus e redes. Atendimento agendado ou coleta via WhatsApp."
  }),
  /* seo:auto-end */
  component: TecnicoInformaticaFazendaRioGrande,
});
