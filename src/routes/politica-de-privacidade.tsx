import { createFileRoute } from "@tanstack/react-router";
import PoliticaPrivacidade from "@/pages/PoliticaPrivacidade";
import { seoHead } from "@/lib/seo/routeHead";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => seoHead({
    path: "/politica-de-privacidade",
    title: "Política de Privacidade | Técnico em Curitiba",
    description: "Informações sobre tratamento de dados e privacidade no atendimento de informática em Curitiba.",
    noindex: true,
    localBusiness: false,
  }),
  component: PoliticaPrivacidade,
});
