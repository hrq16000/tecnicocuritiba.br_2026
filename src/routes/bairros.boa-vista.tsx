import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BoaVista from "@/pages/bairros/BoaVista";

export const Route = createFileRoute("/bairros/boa-vista")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/boa-vista",
    "title": "Técnico de Informática no Boa Vista (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Boa Vista, Curitiba: conserto de computador e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99. Via WhatsApp."
  }),
  /* seo:auto-end */
  component: BoaVista,
});
