import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import Fazendinha from "@/pages/bairros/Fazendinha";

export const Route = createFileRoute("/bairros/fazendinha")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/bairros/fazendinha",
    "title": "Técnico de Informática na Fazendinha (Curitiba) | Notebook e PC",
    "description": "Técnico de informática na Fazendinha, Curitiba: conserto de notebook, formatação, limpeza interna e configuração de Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    "faq": [
      {
        "question": "O computador da minha loja na Fazendinha trava no horário de pico. Dá para resolver no local?",
        "answer": "Na maioria das vezes sim: limpeza, revisão térmica, troca de disco e ajuste do sistema são feitos no próprio balcão. Só levamos para bancada quando há suspeita de falha elétrica na placa."
      },
      {
        "question": "Vocês configuram impressora compartilhada?",
        "answer": "Sim. Instalamos e compartilhamos impressora na rede local, incluindo o caso comum de cada computador enxergar a impressora com nome diferente."
      },
      {
        "question": "Tenho edícula nos fundos sem sinal. Repetidor resolve?",
        "answer": "Depende da estrutura. Onde há parede dupla, repetidor entrega sinal fraco. Costuma ser mais estável um cabo curto até um ponto de acesso no fundo — avaliamos antes de indicar."
      },
      {
        "question": "Qual o valor do atendimento na Fazendinha?",
        "answer": "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e das peças, apresentado antes da execução."
      },
      {
        "question": "Preciso levar o equipamento em algum lugar?",
        "answer": "Não. Não temos balcão de atendimento ao público: quando o caso exige bancada, combinamos coleta e devolução."
      }
    ]
  }),
  /* seo:auto-end */
  component: Fazendinha,
});
