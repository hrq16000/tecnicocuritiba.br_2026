import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Cabral from "@/pages/bairros/Cabral";

export const Route = createFileRoute("/bairros/cabral")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/cabral",
    "title": "Técnico de Informática no Cabral (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no Cabral, Curitiba: conserto de notebook, formatação, upgrade de SSD e suporte a consultórios e escritórios. A partir de R$ 99,99.",
    "faq": [
      {
        "question": "Atendem consultórios e escritórios no Cabral?",
        "answer": "Sim. Trabalhamos com janela de horário combinada para não interromper o atendimento, e a formatação de máquina de trabalho só acontece após backup e conferência de acessos e licenças."
      },
      {
        "question": "Vocês fazem backup antes de formatar?",
        "answer": "Sempre que o disco permite leitura, o backup dos dados é a primeira etapa e é conferido com você antes de qualquer reinstalação. Se o disco estiver com falha, isso é informado antes de prosseguir."
      },
      {
        "question": "Preciso levar o equipamento em alguma loja?",
        "answer": "Não. Não temos balcão ao público: o serviço é feito no seu endereço ou o equipamento é coletado e devolvido quando o caso exige bancada."
      },
      {
        "question": "Qual o valor do atendimento no Cabral?",
        "answer": "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: Cabral,
});
