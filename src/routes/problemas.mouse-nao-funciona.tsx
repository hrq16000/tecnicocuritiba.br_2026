import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaMouseNaoFunciona from "@/pages/problemas/MouseNaoFunciona";

export const Route = createFileRoute("/problemas/mouse-nao-funciona")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/mouse-nao-funciona",
    "title": "Mouse Não Funciona: Como Resolver | Curitiba",
    "description": "Mouse não funciona, cursor travado ou clique falhando sozinho? Veja como separar porta USB, receptor sem fio, driver, bateria e falha do próprio mouse antes de.",
    "faq": [
      {
        "question": "Meu mouse parou de funcionar de repente. Preciso comprar outro?",
        "answer": "Ainda não. O teste que resolve a dúvida leva um minuto: ligue o mouse em outro computador. Se funcionar lá, o periférico está bom e o problema é da porta USB ou do sistema da sua máquina. Comprar mouse novo nesse cenário só repete a falha."
      },
      {
        "question": "O clique está dando dois cliques sozinho. Tem conserto?",
        "answer": "Esse comportamento é desgaste do micro switch do botão, e existe troca da peça em mouses de melhor qualidade. Em mouse de entrada, o custo do serviço costuma passar do valor de um aparelho novo, e dizemos isso quando é o caso, em vez de empurrar reparo."
      },
      {
        "question": "Mouse sem fio travando é defeito ou é a pilha?",
        "answer": "Pilha fraca é a causa mais comum e imita defeito grave: o cursor anda aos pulos e trava por segundos. Antes de qualquer conclusão, troque a pilha e aproxime o receptor. Se o comportamento continuar com pilha nova e receptor próximo, aí sim entram interferência e falha do módulo."
      },
      {
        "question": "O mouse funciona nas portas de trás mas não nas da frente. Isso é grave?",
        "answer": "Grave não é, mas é físico. Portas frontais dependem de um cabo interno ligado na placa-mãe, e esse conector se solta com facilidade em gabinetes que já foram abertos. Recolocar e testar é serviço rápido de bancada, sem troca de componente na maioria dos casos."
      },
      {
        "question": "Mouse e teclado pararam ao mesmo tempo. Pode ser vírus?",
        "answer": "É pouco provável. Dois periféricos caindo juntos aponta para a controladora USB, para uma atualização que substituiu drivers ou para falha na alimentação das portas. O diagnóstico começa testando os dois em outra máquina, o que separa hardware de sistema sem gastar nada."
      },
      {
        "question": "O cursor some quando o computador volta da suspensão. O que fazer?",
        "answer": "Esse é o efeito da economia de energia desligando as portas USB. A correção é ajustar essa política no sistema, e costuma ser feita por atendimento remoto, sem retirar o equipamento do lugar."
      },
      {
        "question": "Como funciona o atendimento?",
        "answer": "Não temos balcão de atendimento ao público. Fazemos retirada e devolução no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Boa parte dos casos de periférico se resolve remotamente, e avisamos quando esse é o caminho."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaMouseNaoFunciona,
});
