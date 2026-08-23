import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import CIC from "@/pages/bairros/CIC";

export const Route = createFileRoute("/bairros/cic")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/cic",
    "title": "Técnico de Informática no CIC (Curitiba) | Notebook e PC",
    "description": "Técnico de informática no CIC, Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para empresas. Diagnóstico a partir de R$ 99,99.",
    "faq": [
      {
        "question": "Vocês atendem empresas e comércios no CIC?",
        "answer": "Sim. Como o CIC concentra muitas operações, damos suporte pontual ou recorrente sob consulta a estações de trabalho, rede e rotinas de backup. A avaliação começa pelo WhatsApp."
      },
      {
        "question": "O atendimento no CIC é no local ou por coleta?",
        "answer": "Depende do problema. Casos como formatação, upgrade e configuração de rede costumam ser resolvidos no local; reparos de bancada seguem por coleta e entrega, sempre com sua aprovação."
      },
      {
        "question": "Quanto custa o diagnóstico no CIC?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças — e nada é executado sem aprovação."
      },
      {
        "question": "Vale mais a pena consertar ou trocar o computador?",
        "answer": "Em muitos casos, um upgrade de SSD e memória resolve a lentidão por um custo menor que a troca. Avaliamos o equipamento e explicamos com clareza antes de indicar qualquer caminho."
      }
    ]
  }),
  /* seo:auto-end */
  component: CIC,
});
