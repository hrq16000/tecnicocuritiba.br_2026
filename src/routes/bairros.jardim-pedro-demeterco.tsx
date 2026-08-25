import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimPedroDemeterco from "@/pages/bairros/JardimPedroDemeterco";

export const Route = createFileRoute("/bairros/jardim-pedro-demeterco")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-pedro-demeterco", title: "Técnico de Informática no Jardim Pedro Demeterco | Pinhais | Técnico Curitiba", description: "Técnico de informática no Jardim Pedro Demeterco, Pinhais. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimPedroDemeterco,
});
