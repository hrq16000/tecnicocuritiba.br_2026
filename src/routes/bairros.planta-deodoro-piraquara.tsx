import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PlantaDeodoroPiraquara from "@/pages/bairros/PlantaDeodoroPiraquara";

export const Route = createFileRoute("/bairros/planta-deodoro-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/planta-deodoro-piraquara", title: "Técnico de Informática no Planta Deodoro | Piraquara | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Planta Deodoro, Piraquara. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: PlantaDeodoroPiraquara,
});
