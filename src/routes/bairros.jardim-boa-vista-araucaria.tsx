import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimBoaVistaAraucaria from "@/pages/bairros/JardimBoaVistaAraucaria";

export const Route = createFileRoute("/bairros/jardim-boa-vista-araucaria")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-boa-vista-araucaria", title: "Técnico de Informática no Jardim Boa Vista Araucária | Araucária | Técnico Curitiba", description: "Técnico de informática no Jardim Boa Vista Araucária, Araucária. Atendimento a domicílio com diagnóstico no local. Formatação, conserto de notebook, redes Wi-Fi. a partir de R$ 99,99.", noindex: true }),
  component: JardimBoaVistaAraucaria,
});
