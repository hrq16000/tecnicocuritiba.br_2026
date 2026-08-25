import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import JardimBoaVistaCM from "@/pages/bairros/JardimBoaVistaCM";

export const Route = createFileRoute("/bairros/jardim-boa-vista-cm")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/jardim-boa-vista-cm", title: "Técnico de Informática no Jardim Boa Vista | Campo Magro | Atendimento Domicílio | Técnico Curitiba", description: "Técnico de informática no Jardim Boa Vista, Campo Magro. Formatação, conserto de notebook, remoção de vírus, upgrade SSD. Atendimento a domicílio. a partir de R$ 99,99.", noindex: true }),
  component: JardimBoaVistaCM,
});
