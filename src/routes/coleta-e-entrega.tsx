import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ColetaEntrega from "@/pages/ColetaEntrega";

export const Route = createFileRoute("/coleta-e-entrega")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/coleta-e-entrega",
    "title": "Coleta e Entrega de Computador e Notebook em Curitiba",
    "description": "Coleta e entrega agendada para computadores e notebooks que precisam de diagnóstico, manutenção ou serviço técnico em bancada.",
    "faq": [
      {
        "question": "Quais equipamentos podem usar a coleta e entrega?",
        "answer": "Computadores de mesa e notebooks que precisam de diagnóstico, manutenção ou reparo em bancada. É a modalidade indicada quando o serviço não pode ser concluído no local."
      },
      {
        "question": "Quando a coleta é mais adequada que o atendimento no local?",
        "answer": "Quando o caso exige bancada, ferramentas específicas ou tempo estendido de diagnóstico — por exemplo reparo de placa, troca de tela ou recuperação de dados."
      },
      {
        "question": "Como funciona o agendamento?",
        "answer": "Fazemos uma triagem pelo WhatsApp antes de agendar. Na coleta, identificamos o equipamento e registramos os acessórios recebidos. A taxa mínima pré-aprovada é de R$ 299,99."
      },
      {
        "question": "O reparo é executado direto?",
        "answer": "Não. Após o recebimento fazemos o diagnóstico e a execução só acontece depois da sua aprovação do valor do serviço. Peças e componentes, quando necessários, ficam fora do valor-base."
      },
      {
        "question": "Qual o prazo?",
        "answer": "Celular / Rádio / Caixa de Som: 2 a 3 dias úteis. TV / Monitor / Notebook / PC: 15 a 60 dias úteis. O prazo depende do tipo de falha e da fila do laboratório."
      },
      {
        "question": "E se eu desistir após o diagnóstico?",
        "answer": "Você paga apenas o valor do diagnóstico (R$ 99,99) e agendamos a devolução do equipamento."
      }
    ]
  }),
  /* seo:auto-end */
  component: ColetaEntrega,
});
