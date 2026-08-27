import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import { CATEGORIES } from "@/pages/hubs/categories";
import { findLocal } from "@/pages/hubs/locais";
import { categoryLocalMeta } from "@/lib/categoryLocalContent";
import { ConsertoTVCity } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-tv/$local")({
  head: ({ params }) => {
    const local = findLocal(params.local);
    const meta = local ? categoryLocalMeta(CATEGORIES.tv, local) : null;
    return seoHead({
      path: `/conserto-tv/${params.local}`,
      title: meta?.title ?? `Conserto de TV em ${params.local} | Técnico em Curitiba`,
      description:
        meta?.description ??
        "Conserto de TV com coleta e entrega na região de Curitiba, diagnóstico em bancada e valor aprovado antes do reparo.",
      noindex: true,
    });
  },
  component: ConsertoTVCity,
});
