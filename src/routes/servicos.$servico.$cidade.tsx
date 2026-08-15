import { createFileRoute } from "@tanstack/react-router";
import ServicoCidadePage from "@/pages/servico-bairro/ServicoBairroGerado";
import { seoHead } from "@/lib/seo/routeHead";
import { CURATED_DYNAMIC_HEAD } from "@/lib/seo/curatedDynamicHead.generated";

export const Route = createFileRoute("/servicos/$servico/$cidade")({
  head: ({ params }) => {
    const path = `/servicos/${params.servico}/${params.cidade}`;
    const curated = CURATED_DYNAMIC_HEAD[path];
    return curated ? seoHead(curated) : seoHead({ path, title: "Assistência Técnica em Curitiba", description: "Atendimento técnico em Curitiba e região com diagnóstico antes do orçamento." });
  },
  component: ServicoCidadePage,
});
