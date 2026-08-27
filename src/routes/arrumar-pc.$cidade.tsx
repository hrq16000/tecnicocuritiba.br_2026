import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import { cities } from "@/pages/arrumar-pc/cities";
import ArrumarPCCity from "@/pages/arrumar-pc/ArrumarPCCity";

export const Route = createFileRoute("/arrumar-pc/$cidade")({
  head: ({ params }) => {
    const c = cities.find((x) => x.slug === params.cidade);
    const label = c ? `${c.cidade}/${c.estado}` : params.cidade;
    return seoHead({
      path: `/arrumar-pc/${params.cidade}`,
      title: c
        ? `Arrumar PC em ${c.cidade} ${c.estado} — Técnico online | Técnico em Curitiba`
        : "Arrumar PC — Técnico online | Técnico em Curitiba",
      description: `Técnico de informática online para ${label}. Formatação, vírus, lentidão, tela azul e Wi-Fi por WhatsApp com acesso remoto seguro.`,
      localBusiness: false,
      // Mantém a política atual: páginas nacionais seguem fora do índice.
      noindex: true,
    });
  },
  component: ArrumarPCCity,
});
