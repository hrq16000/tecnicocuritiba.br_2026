import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import { CATEGORIES } from "@/pages/hubs/categories";
import { findLocal } from "@/pages/hubs/locais";
import { categoryLocalMeta } from "@/lib/categoryLocalContent";
import { ConsertoVideogameCity } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-videogame/$local")({
  head: ({ params }) => {
    const local = findLocal(params.local);
    const meta = local ? categoryLocalMeta(CATEGORIES.videogame, local) : null;
    return seoHead({
      path: `/conserto-videogame/${params.local}`,
      title: meta?.title ?? `Conserto de videogame em ${params.local} | Técnico em Curitiba`,
      description:
        meta?.description ??
        "Conserto de videogame com coleta e entrega na região de Curitiba, diagnóstico em bancada e valor aprovado antes do reparo.",
      noindex: true,
    });
  },
  component: ConsertoVideogameCity,
});
