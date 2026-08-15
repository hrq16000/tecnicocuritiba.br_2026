import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AguaVerde from "@/pages/bairros/AguaVerde";

export const Route = createFileRoute("/bairros/agua-verde")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/agua-verde",
    "title": "Técnico de Informática no Água Verde | Notebook e PC",
    "description": "Técnico de informática no Água Verde, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Diagnóstico a partir de R$ 99,99. Via WhatsApp."
  }),
  /* seo:auto-end */
  component: AguaVerde,
});
