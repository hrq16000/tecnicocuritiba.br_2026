import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CorreiaDeFreitasCL from "@/pages/bairros/CorreiaDeFreitasCL";

export const Route = createFileRoute("/bairros/correia-de-freitas")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/correia-de-freitas", title: "Técnico de Informática no Correia de Freitas | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Correia de Freitas, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: CorreiaDeFreitasCL,
});
