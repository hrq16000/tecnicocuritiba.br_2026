import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimBelaVistaPiraquara from "@/pages/bairros/JardimBelaVistaPiraquara";

export const Route = createFileRoute("/bairros/jardim-bela-vista-piraquara")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-bela-vista-piraquara", title: "Técnico de Informática no Jardim Bela Vista | Piraquara | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Bela Vista, Piraquara. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimBelaVistaPiraquara,
});
