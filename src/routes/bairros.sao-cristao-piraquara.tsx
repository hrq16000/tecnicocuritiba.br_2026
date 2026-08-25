import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import SaoCristaoPiraquara from "@/pages/bairros/SaoCristaoPiraquara";

export const Route = createFileRoute("/bairros/sao-cristao-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/sao-cristao-piraquara", title: "Técnico de Informática no São Cristóvão | Piraquara | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no São Cristóvão, Piraquara. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: SaoCristaoPiraquara,
});
