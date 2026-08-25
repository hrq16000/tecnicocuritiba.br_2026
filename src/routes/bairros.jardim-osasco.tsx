import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimOsascoColombo from "@/pages/bairros/JardimOsascoColombo";

export const Route = createFileRoute("/bairros/jardim-osasco")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-osasco", title: "Técnico de Informática no Jardim Osasco | Colombo | Atendimento a Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Osasco, Colombo. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio rápido. a partir de R$ 99,99.", noindex: true }),
  component: JardimOsascoColombo,
});
