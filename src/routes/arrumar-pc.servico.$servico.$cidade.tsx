import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import { cities } from "@/pages/arrumar-pc/cities";
import { servicos } from "@/pages/arrumar-pc/services";
import ArrumarPCServicoCidade from "@/pages/arrumar-pc/ArrumarPCServicoCidade";

export const Route = createFileRoute("/arrumar-pc/servico/$servico/$cidade")({
  head: ({ params }) => {
    const s = servicos.find((x) => x.slug === params.servico);
    const c = cities.find((x) => x.slug === params.cidade);
    const cidade = c ? `${c.cidade}/${c.estado}` : params.cidade;
    const servico = s?.nome ?? params.servico;
    return seoHead({
      path: `/arrumar-pc/servico/${params.servico}/${params.cidade}`,
      title: `${servico} em ${c?.cidade ?? params.cidade} — atendimento online | Técnico em Curitiba`,
      description: `${servico} para ${cidade} por acesso remoto seguro: diagnóstico primeiro, valor combinado antes da execução e contato direto pelo WhatsApp.`,
      localBusiness: false,
      noindex: true,
    });
  },
  component: ArrumarPCServicoCidade,
});
