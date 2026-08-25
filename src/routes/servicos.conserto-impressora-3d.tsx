import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import { isNoindexByEnrichment } from "@/lib/enrichmentStatus";
import { SERVICOS_CORE } from "@/lib/servicosCore";
import ServicoCore from "@/pages/servicos/ServicoCore";

const PATH = "/servicos/conserto-impressora-3d";
const data = SERVICOS_CORE["conserto-impressora-3d"];

export const Route = createFileRoute("/servicos/conserto-impressora-3d")({
  head: () =>
    seoHead({
      path: PATH,
      title: data.metaTitle,
      description: data.metaDescription,
      faq: data.faqs,
      // Fail-closed: sem galeria de prova visual aprovada a rota fica SHALLOW.
      noindex: isNoindexByEnrichment(PATH),
    }),
  component: () => <ServicoCore slug="conserto-impressora-3d" />,
});
