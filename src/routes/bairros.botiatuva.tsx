import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BotiatuvaCL from "@/pages/bairros/BotiatuvaCL";

export const Route = createFileRoute("/bairros/botiatuva")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/botiatuva", title: "Técnico de Informática no Botiatuva | Campo Largo | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Botiatuva, Campo Largo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: BotiatuvaCL,
});
