import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Reboucas from "@/pages/bairros/Reboucas";

export const Route = createFileRoute("/bairros/reboucas")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/reboucas",
    "title": "Técnico de Informática no Rebouças (Curitiba) | Empresas e PC",
    "description": "Técnico de informática no Rebouças, Curitiba: suporte a escritórios, manutenção de computador, formatação e rede. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "Vocês dão suporte a escritórios pequenos no Rebouças?",
        "answer": "Sim. Atendemos equipes enxutas com chamados pontuais ou acompanhamento periódico, cobrindo estações, rede, impressoras e rotina de backup."
      },
      {
        "question": "Dá para melhorar uma máquina de edição sem trocar tudo?",
        "answer": "Frequentemente sim. Avaliamos gargalo real — disco, memória, refrigeração ou processador — e indicamos o upgrade que traz ganho perceptível, evitando gasto desnecessário."
      },
      {
        "question": "Como funciona o backup para empresa?",
        "answer": "Definimos o que precisa ser copiado, com que frequência e para onde, e testamos a restauração. Backup que nunca foi restaurado não é backup confiável."
      },
      {
        "question": "Quanto custa o atendimento no Rebouças?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do número de equipamentos, da complexidade e de peças, sempre aprovado antes da execução."
      }
    ]
  }),
  /* seo:auto-end */
  component: Reboucas,
});
