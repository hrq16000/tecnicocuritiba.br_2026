import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import OuroFinoCL from "@/pages/bairros/OuroFinoCL";

export const Route = createFileRoute("/bairros/ouro-fino")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/ouro-fino", title: "Técnico de Informática no Ouro Fino | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Ouro Fino, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: OuroFinoCL,
});
