import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimAmelia from "@/pages/bairros/JardimAmelia";

export const Route = createFileRoute("/bairros/jardim-amelia")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-amelia", title: "Técnico de Informática no Jardim Amélia | Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Amélia, Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimAmelia,
});
