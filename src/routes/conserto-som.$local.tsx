import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import { CATEGORIES } from "@/pages/hubs/categories";
import { findLocal } from "@/pages/hubs/locais";
import { categoryLocalMeta } from "@/lib/categoryLocalContent";
import { ConsertoSomCity } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-som/$local")({
  head: ({ params }) => {
    const local = findLocal(params.local);
    const meta = local ? categoryLocalMeta(CATEGORIES.som, local) : null;
    return seoHead({
      path: `/conserto-som/${params.local}`,
      title: meta?.title ?? `Conserto de som e áudio em ${params.local} | Técnico em Curitiba`,
      description:
        meta?.description ??
        "Conserto de som e áudio com coleta e entrega na região de Curitiba, diagnóstico em bancada e valor aprovado antes do reparo.",
      noindex: true,
    });
  },
  component: ConsertoSomCity,
});
