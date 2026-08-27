import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import { CATEGORIES } from "@/pages/hubs/categories";
import { findLocal } from "@/pages/hubs/locais";
import { categoryLocalMeta } from "@/lib/categoryLocalContent";
import { ConsertoCelularLocalCity } from "@/pages/hubs/CategoryLocalTemplate";

export const Route = createFileRoute("/conserto-celular/$local")({
  head: ({ params }) => {
    const local = findLocal(params.local);
    const meta = local ? categoryLocalMeta(CATEGORIES.celular, local) : null;
    return seoHead({
      path: `/conserto-celular/${params.local}`,
      title: meta?.title ?? `Conserto de celular em ${params.local} | Técnico em Curitiba`,
      description:
        meta?.description ??
        "Conserto de celular com coleta e entrega na região de Curitiba, diagnóstico em bancada e valor aprovado antes do reparo.",
      noindex: true,
    });
  },
  component: ConsertoCelularLocalCity,
});
