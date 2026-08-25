import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import VistaAlegre from "@/pages/bairros/VistaAlegre";

export const Route = createFileRoute("/bairros/vista-alegre")({
  // Fila de enriquecimento agressivo: baseline => noindex até promoção por gate.
  head: () => seoHead({ path: "/bairros/vista-alegre", title: "Assistência Técnica de Informática no Vista Alegre | Curitiba", description: "Técnico de informática no Vista Alegre, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi. Diagnóstico antes do valor, a partir de R$ 99,99.", noindex: true }),
  component: VistaAlegre,
});
