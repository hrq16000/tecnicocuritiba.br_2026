import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BotiatuvaCM from "@/pages/bairros/BotiatuvaCM";

export const Route = createFileRoute("/bairros/botiatuva-cm")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/botiatuva-cm", title: "Técnico de Informática no Botiatuva | Campo Magro | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Botiatuva, Campo Magro. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: BotiatuvaCM,
});
