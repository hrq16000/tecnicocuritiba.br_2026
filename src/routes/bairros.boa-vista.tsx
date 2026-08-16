import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import BoaVista from "@/pages/bairros/BoaVista";

export const Route = createFileRoute("/bairros/boa-vista")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/boa-vista",
    "title": "Técnico de Informática no Boa Vista (Curitiba) | PC e Notebook",
    "description": "Técnico de informática no Boa Vista, Curitiba: conserto de computador e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99. Via WhatsApp.",
    "faq": [
      {
        "question": "Meu computador ficou muito lento. Precisa trocar?",
        "answer": "Na maioria dos casos do bairro, não. Computador com disco mecânico costuma voltar a responder bem com SSD, memória e limpeza do sistema. Só indicamos troca quando o reparo não se paga — e explicamos o porquê."
      },
      {
        "question": "Vocês fazem backup das fotos antes de formatar?",
        "answer": "Sim, sempre que o disco permite leitura. O backup é a primeira etapa e é conferido com você antes de qualquer reinstalação."
      },
      {
        "question": "Preciso levar o equipamento até vocês?",
        "answer": "Não. Não temos balcão ao público: o serviço é feito no seu endereço ou fazemos coleta e entrega quando o caso exige bancada."
      },
      {
        "question": "Qual o valor do atendimento no Boa Vista?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes da execução."
      }
    ]
  }),
  /* seo:auto-end */
  component: BoaVista,
});
