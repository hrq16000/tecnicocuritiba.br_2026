import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import RioPequenoSJP from "@/pages/bairros/RioPequenoSJP";

export const Route = createFileRoute("/bairros/rio-pequeno-sjp")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/rio-pequeno-sjp", title: "Técnico de Informática no Rio Pequeno | São José dos Pinhais | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Rio Pequeno, São José dos Pinhais. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: RioPequenoSJP,
});
