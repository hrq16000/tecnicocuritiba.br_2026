import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import PradoVelhoPiraquara from "@/pages/bairros/PradoVelhoPiraquara";

export const Route = createFileRoute("/bairros/prado-velho-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/prado-velho-piraquara", title: "Técnico de Informática no Prado Velho | Piraquara | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Prado Velho, Piraquara. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: PradoVelhoPiraquara,
});
