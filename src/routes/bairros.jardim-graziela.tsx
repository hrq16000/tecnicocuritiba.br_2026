import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimGrazielaAT from "@/pages/bairros/JardimGrazielaAT";

export const Route = createFileRoute("/bairros/jardim-graziela")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-graziela", title: "Técnico de Informática no Jardim Graziela | Almirante Tamandaré | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Graziela, Almirante Tamandaré. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimGrazielaAT,
});
