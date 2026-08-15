import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaNotebookDesligandoSozinho from "@/pages/problemas/NotebookDesligandoSozinho";

export const Route = createFileRoute("/problemas/notebook-desligando-sozinho")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/notebook-desligando-sozinho",
    "title": "Notebook Desligando Sozinho: Causas | Curitiba",
    "description": "Notebook desligando sozinho do nada, só em jogos ou quando tira da tomada? Veja como separar superaquecimento, bateria em fim de vida, carregador fraco e falha de placa antes de gastar, com avaliação técnica em Curitiba.",
    "faq": [
      {
        "question": "Notebook desligando sozinho é sempre superaquecimento?",
        "answer": "Não, mas é a causa mais frequente. Superaquecimento tem uma assinatura reconhecível: o aparelho desliga depois de alguns minutos de uso ou sob carga, e às vezes precisa esfriar antes de aceitar ligar de novo. Quando o desligamento acontece de forma aleatória, mesmo com o aparelho frio, a investigação passa para bateria, carregador e circuito de energia da placa."
      },
      {
        "question": "Desliga só quando tiro da tomada. É a bateria?",
        "answer": "Na prática, quase sempre sim. Bateria em fim de vida perde capacidade real de entrega mesmo continuando a exibir percentual alto no sistema, porque o indicador se baseia em tensão e não em autonomia efetiva. Medimos a capacidade real antes de indicar a troca — não trocamos bateria por suposição."
      },
      {
        "question": "Limpeza resolve mesmo ou é só paliativo?",
        "answer": "Quando a causa é térmica, limpeza com troca de pasta térmica resolve de fato, e o resultado é verificável: medimos a temperatura sob carga depois do serviço e mostramos o número. O que não resolve é limpeza superficial com ar comprimido pelas grades, que costuma empurrar a poeira ainda mais para dentro do dissipador."
      },
      {
        "question": "Posso continuar usando enquanto não conserto?",
        "answer": "Em caso de desligamento térmico, o uso continuado acelera o desgaste do processador e do próprio cooler, então não recomendamos. Já em caso de estalo, cheiro de queimado ou aquecimento anormal no carregador, a orientação é parar imediatamente: nesses cenários o risco deixa de ser só o aparelho."
      },
      {
        "question": "Comprei um carregador genérico. Pode ser a causa?",
        "answer": "Pode, e vemos isso com frequência. Carregador com potência abaixo da exigida pelo modelo dá conta do consumo em repouso, mas não sustenta o aparelho sob carga, provocando desligamento justo nos momentos de uso pesado. Confira a etiqueta do notebook e compare com a saída indicada no carregador."
      },
      {
        "question": "Vale a pena consertar ou é melhor trocar de notebook?",
        "answer": "Limpeza, pasta térmica e bateria costumam custar muito abaixo do valor de um aparelho novo e devolvem anos de uso. Reparo de circuito de energia exige uma conta mais cuidadosa, feita em cima do estado geral do equipamento. Damos o cenário real e o valor antes de qualquer serviço, com mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada."
      },
      {
        "question": "Preciso levar o notebook até vocês?",
        "answer": "Não temos balcão de atendimento ao público. Fazemos coleta e devolução no endereço informado, e a coleta é gratuita nos serviços acima de uma hora de bancada. As condições completas estão descritas na página de preços e políticas."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaNotebookDesligandoSozinho,
});
