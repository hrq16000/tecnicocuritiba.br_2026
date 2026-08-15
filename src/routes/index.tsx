import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/",
    "title": "Técnico em Curitiba | Assistência Técnica e Suporte Local",
    "description": "Assistência técnica em Curitiba com diagnóstico honesto: atendimento a domicílio, remoto ou com coleta. Escolha o serviço e continue pelo WhatsApp."
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/",
    "title": "Técnico em Curitiba | Assistência Técnica e Suporte Local",
    "description": "Assistência técnica em Curitiba com diagnóstico honesto: atendimento a domicílio, remoto ou com coleta. Escolha o serviço e continue pelo WhatsApp."
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/",
    "title": "Técnico em Curitiba | Assistência Técnica e Suporte Local",
    "description": "Assistência técnica em Curitiba com diagnóstico honesto: atendimento a domicílio, remoto ou com coleta. Escolha o serviço e continue pelo WhatsApp."
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/",
    "title": "Técnico em Curitiba | Assistência Técnica e Suporte Local",
    "description": "Assistência técnica em Curitiba com diagnóstico honesto: atendimento a domicílio, remoto ou com coleta. Escolha o serviço e continue pelo WhatsApp."
  }),
  /* seo:auto-end */
  component: Index,
});
