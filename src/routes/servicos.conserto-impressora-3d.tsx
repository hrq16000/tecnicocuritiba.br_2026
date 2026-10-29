import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import { isNoindexByEnrichment } from "@/lib/enrichmentStatus";
import { SERVICOS_CORE } from "@/lib/servicosCore";
// O corpo do serviço é importado na navegação, mantendo o head no SSR.

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
  component: lazyRouteComponent(() =>
    import("@/pages/servicos/ServicoCore").then(({ default: ServicoCore }) => ({
      default: () => <ServicoCore slug="conserto-impressora-3d" />,
    })),
  ),
});
