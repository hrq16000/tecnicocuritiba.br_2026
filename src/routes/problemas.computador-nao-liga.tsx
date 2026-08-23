import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaComputadorNaoLiga from "@/pages/problemas/ComputadorNaoLiga";

export const Route = createFileRoute("/problemas/computador-nao-liga")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/computador-nao-liga",
    "title": "Computador de Mesa Não Liga: Diagnóstico Real | Curitiba",
    "description": "PC não liga, não dá vídeo ou liga e apaga em seguida? Entenda como separar fonte, botão, placa-mãe e memória antes de trocar peça por achismo, e como funciona.",
    "faq": [
      {
        "question": "Meu PC não liga de jeito nenhum. É sempre a fonte?",
        "answer": "Não é sempre, mas a fonte lidera as estatísticas nesse sintoma. Antes de concluir, testamos cabo, tomada, chave de tensão e o botão do gabinete, porque os quatro produzem exatamente o mesmo comportamento de aparelho morto. Depois vem a medição das tensões sob carga: uma fonte pode acender LED e girar ventoinha e ainda assim não sustentar o consumo real no momento do boot."
      },
      {
        "question": "O computador liga e desliga em um segundo. O que isso significa?",
        "answer": "Significa que a proteção da fonte ou da placa cortou a alimentação ao detectar algo fora da faixa. Em bancada, o teste é montar o conjunto mínimo — placa, processador e uma memória — fora do gabinete. Se assim liga normalmente, o curto está em algo que foi removido: cooler, cabo frontal, periférico ou o próprio contato do gabinete metálico com a placa."
      },
      {
        "question": "As ventoinhas giram, mas a tela fica preta. É a placa de vídeo?",
        "answer": "Pode ser, mas o mais comum é memória. Antes disso, vale checar a entrada selecionada no monitor e o cabo, porque muita gente liga na saída de vídeo da placa-mãe quando há placa dedicada instalada. Em bancada testamos os módulos de memória isoladamente, limpamos os contatos e verificamos se a placa de vídeo está com o conector auxiliar de energia devidamente ligado."
      },
      {
        "question": "Trocar a fonte por conta própria resolve?",
        "answer": "Às vezes resolve e às vezes cria um problema maior. Fonte genérica de potência insuficiente ou sem proteção adequada entrega tensão irregular e pode danificar placa-mãe, disco e placa de vídeo — um reparo de baixo custo vira prejuízo grande. Se for trocar, escolha potência compatível com o que está instalado e de fabricante com proteção real contra sobretensão."
      },
      {
        "question": "Senti cheiro de queimado. Ainda tem conserto?",
        "answer": "Frequentemente sim, desde que você pare de ligar. O cheiro indica componente queimado, e na maior parte dos casos o dano começa localizado — um capacitor, um regulador, um fusível. O que transforma isso em perda total é insistir: cada nova tentativa propaga o defeito para outros trechos do circuito. Desligue da tomada e encaminhe para inspeção."
      },
      {
        "question": "Vale a pena consertar um computador antigo que não liga?",
        "answer": "Depende do que a inspeção encontrar e do que a máquina precisa entregar. Fonte e limpeza costumam compensar em quase qualquer idade. Reparo de placa-mãe em equipamento muito antigo, com processador defasado, muitas vezes não compensa — e nesse caso dizemos isso abertamente, entregamos o laudo e ajudamos a preservar os arquivos antes de qualquer decisão."
      },
      {
        "question": "Como funciona o atendimento? Posso levar o computador aí?",
        "answer": "Não temos balcão de atendimento ao público. O contato começa pelo WhatsApp, com a descrição do sintoma, e a partir daí combinamos a coleta do gabinete no endereço informado. A avaliação é feita em bancada, o valor é apresentado antes da execução e a devolução acontece no mesmo endereço, com o equipamento testado."
      },
      {
        "question": "Existe garantia no serviço?",
        "answer": "Sim, 90 dias sobre a mão de obra e as peças que aplicamos, limitados ao bloco que foi reparado. Se trocamos a fonte, a garantia cobre a fonte e o serviço relacionado; uma falha posterior em outro componente é um caso novo. Não cobrimos danos causados por pico de energia posterior à entrega, por isso recomendamos proteção adequada na instalação elétrica."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaComputadorNaoLiga,
});
