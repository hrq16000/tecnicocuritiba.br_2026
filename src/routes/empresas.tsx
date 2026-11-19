import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
// SSR permanece ativo: somente o componente da rota é carregado sob demanda.

// Landing de triagem B2B: não concorre com /empresa-de-ti-curitiba.
// robots, canonical, title e description são emitidos no SSR (sem depender da hidratação).
export const Route = createFileRoute("/empresas")({
  head: () =>
    seoHead({
      path: "/empresas",
      title: "Atendimento Empresarial de TI | Técnico em Curitiba",
      description:
        "Solicite atendimento de TI para sua empresa em Curitiba: informe empresa, quantidade de equipamentos, problema, prioridade e região. Retorno pelo WhatsApp.",
      noindex: true,
      localBusiness: false,
    }),
  component: lazyRouteComponent(() => import("@/pages/Empresas")),
});
