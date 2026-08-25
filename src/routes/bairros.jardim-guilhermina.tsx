import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimGuilherminaCampoLargo from "@/pages/bairros/JardimGuilherminaCampoLargo";

export const Route = createFileRoute("/bairros/jardim-guilhermina")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-guilhermina", title: "Técnico de Informática no Jardim Guilhermina (Campo Largo) | Técnico Curitiba", description: "Técnico de informática no Jardim Guilhermina, Campo Largo. Formatação, vírus, conserto de notebook, upgrade SSD/RAM e Wi‑Fi. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimGuilherminaCampoLargo,
});
