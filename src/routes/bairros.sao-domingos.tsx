import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoDomingos from "@/pages/bairros/SaoDomingos";

export const Route = createFileRoute("/bairros/sao-domingos")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-domingos", title: "Técnico de Informática no São Domingos SJP | Técnico Curitiba", description: "Técnico de informática no São Domingos, São José dos Pinhais. Manutenção, formatação, conserto. Atendimento em domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: SaoDomingos,
});
