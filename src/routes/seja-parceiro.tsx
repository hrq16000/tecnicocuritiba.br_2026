import { createFileRoute } from "@tanstack/react-router";
import SejaParceiro from "@/pages/SejaParceiro";
import { seoHead } from "@/lib/seo/routeHead";

export const Route = createFileRoute("/seja-parceiro")({
  // Página de triagem de parceiros: não compõe o sitemap curado.
  // Canonical SSR válido para o destino das URLs legadas sem promovê-la ao índice.
  head: () => seoHead({
    path: "/seja-parceiro",
    title: "Seja Parceiro | Técnico em Curitiba",
    description: "Informações sobre o cadastro de técnicos parceiros para atendimento em Curitiba e região.",
    noindex: true,
    localBusiness: false,
  }),
  component: SejaParceiro,
});
