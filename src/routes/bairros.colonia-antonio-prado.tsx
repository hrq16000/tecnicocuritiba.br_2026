import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ColoniaAntonioPradoAT from "@/pages/bairros/ColoniaAntonioPradoAT";

export const Route = createFileRoute("/bairros/colonia-antonio-prado")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/colonia-antonio-prado", title: "Técnico de Informática no Colônia Antônio Prado | Almirante Tamandaré | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Colônia Antônio Prado, Almirante Tamandaré. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: ColoniaAntonioPradoAT,
});
