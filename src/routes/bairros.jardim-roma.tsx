import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimRomaAT from "@/pages/bairros/JardimRomaAT";

export const Route = createFileRoute("/bairros/jardim-roma")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-roma", title: "Técnico de Informática no Jardim Roma | Almirante Tamandaré | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Roma, Almirante Tamandaré. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimRomaAT,
});
