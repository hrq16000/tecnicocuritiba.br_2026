import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Contato from "@/pages/Contato";

export const Route = createFileRoute("/contato")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/contato",
    "title": "Contato Técnico Curitiba | Atendimento a partir de R$ 99,99",
    "description": "Fale com técnico de informática em Curitiba pelo WhatsApp. Atendimento hoje para PC, notebook, vírus, formatação e SSD a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/contato",
    "title": "Contato Técnico Curitiba | Atendimento a partir de R$ 99,99",
    "description": "Fale com técnico de informática em Curitiba pelo WhatsApp. Atendimento hoje para PC, notebook, vírus, formatação e SSD a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/contato",
    "title": "Contato Técnico Curitiba | Atendimento a partir de R$ 99,99",
    "description": "Fale com técnico de informática em Curitiba pelo WhatsApp. Atendimento hoje para PC, notebook, vírus, formatação e SSD a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/contato",
    "title": "Contato Técnico Curitiba | Atendimento a partir de R$ 99,99",
    "description": "Fale com técnico de informática em Curitiba pelo WhatsApp. Atendimento hoje para PC, notebook, vírus, formatação e SSD a partir de R$ 99,99."
  }),
  /* seo:auto-end */
  component: Contato,
});
