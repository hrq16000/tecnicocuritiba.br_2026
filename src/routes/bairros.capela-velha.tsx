import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CapelaVelhaAraucaria from "@/pages/bairros/CapelaVelhaAraucaria";

export const Route = createFileRoute("/bairros/capela-velha")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/capela-velha", title: "Técnico de Informática na Capela Velha (Araucária) | Técnico Curitiba", description: "Técnico de informática na Capela Velha, Araucária. Conserto de notebook e PC, formatação, vírus, rede Wi‑Fi e upgrade. Atendimento em domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CapelaVelhaAraucaria,
});
