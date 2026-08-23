import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaComputadorTravando from "@/pages/problemas/ComputadorTravando";

export const Route = createFileRoute("/problemas/computador-travando")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/computador-travando",
    "title": "Computador Travando: Causas e Conserto | Curitiba",
    "description": "Computador travando do nada, congelando a tela ou parando só em jogos e programas pesados? Veja como separar memória com defeito, superaquecimento, disco em falha e.",
    "faq": [
      {
        "question": "Computador travando é sempre defeito de peça?",
        "answer": "Não. Travamento tem duas famílias bem distintas. Quando é total, sem mouse e sem teclado, e acontece em qualquer situação, a suspeita principal é hardware: memória, temperatura ou fonte. Quando acontece sempre no mesmo programa ou depois de uma atualização específica, quase sempre é software. Separar as duas famílias antes de comprar qualquer peça é o que evita gasto errado."
      },
      {
        "question": "Como saber se a memória RAM é a culpada?",
        "answer": "O teste de memória do próprio Windows já indica erro na maioria dos módulos defeituosos e é gratuito. Em bancada vamos além: testamos módulo a módulo em slots diferentes e cruzamos com memória conhecida. Isso responde tanto se o defeito é do módulo quanto se é do slot da placa-mãe, o que muda completamente o orçamento."
      },
      {
        "question": "Trava só quando jogo. É a placa de vídeo?",
        "answer": "Pode ser, mas raramente é o primeiro suspeito. Travar apenas sob carga aponta antes para temperatura e para fonte de alimentação, porque é nesse momento que o consumo sobe. Driver de vídeo desatualizado ou corrompido é a terceira hipótese. A placa em si costuma ficar por último, e só entra na conta depois de teste cruzado."
      },
      {
        "question": "Travar e mostrar tela azul é o mesmo problema?",
        "answer": "É o mesmo sintoma com uma vantagem: a tela azul deixa um código de erro registrado, e esse código aponta para o componente ou driver envolvido. Se o seu caso mostra tela azul, a investigação começa pelo código, e esse caminho está descrito na página específica de tela azul do Windows."
      },
      {
        "question": "Formatar resolve travamento?",
        "answer": "Resolve quando a origem é software: sistema corrompido, atualização interrompida, driver conflitante ou infecção. Não resolve nada quando a origem é memória defeituosa, superaquecimento ou disco em falha, porque o hardware continua o mesmo depois da formatação. Por isso avaliamos antes e não vendemos formatação como solução universal."
      },
      {
        "question": "Meu computador trava e faz barulho. Preciso me preocupar?",
        "answer": "Sim, quando o barulho é de estalo ou clique vindo do disco. Isso indica falha física em andamento e, nesse cenário, a prioridade deixa de ser o travamento e passa a ser salvar os dados enquanto o disco ainda responde. Barulho de ventoinha rasgada ou zumbido é outro caso, mecânico e menos urgente, tratado na página sobre computador fazendo barulho."
      },
      {
        "question": "Preciso levar o computador até vocês?",
        "answer": "Não temos balcão de atendimento ao público. Casos de software podem ser resolvidos remotamente. Quando o diagnóstico exige teste de memória, fonte e temperatura, retiramos o equipamento no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado, com 90 dias de garantia sobre mão de obra e peça aplicada."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaComputadorTravando,
});
