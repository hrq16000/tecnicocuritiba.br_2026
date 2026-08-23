import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTouchpadNaoFunciona from "@/pages/problemas/TouchpadNaoFunciona";

export const Route = createFileRoute("/problemas/touchpad-nao-funciona")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/touchpad-nao-funciona",
    "title": "Touchpad Não Funciona no Notebook | Curitiba",
    "description": "Touchpad do notebook parou de responder, funciona pela metade ou só o clique falhou? Veja como separar atalho desativado, driver, cabo flat solto e falha física.",
    "faq": [
      {
        "question": "O touchpad parou do nada. É defeito de fábrica?",
        "answer": "Raramente. Parar de uma hora para outra, sem queda e sem líquido, costuma ser o atalho de teclado que desativa o touchpad ou o driver substituído em uma atualização do sistema. Antes de qualquer orçamento vale testar o atalho de função e reinstalar o driver oficial do fabricante — são dois passos gratuitos que resolvem a maior parte dos casos."
      },
      {
        "question": "O cursor anda mas o clique não funciona. Precisa trocar a peça?",
        "answer": "Nem sempre. Existem duas causas comuns: o recurso de tocar para clicar desativado nas configurações, que é ajuste de software, e o microswitch físico desgastado, que exige troca do módulo. A diferença é simples de verificar: se o clique por toque leve funciona e só o clique com pressão falhou, o desgaste é mecânico."
      },
      {
        "question": "Uma parte do touchpad não responde. Tem conserto?",
        "answer": "Área morta localizada quase sempre significa trilha rompida dentro da própria placa do touchpad, e trilha rompida nessa peça não se recupera de forma confiável. O caminho é a substituição do módulo, condicionada à disponibilidade da peça para o modelo. Quando não há peça compatível, informamos e não improvisamos com módulo de outro modelo."
      },
      {
        "question": "Parou depois de atualizar o Windows. Como resolver?",
        "answer": "Esse é o cenário mais fácil. A atualização costuma trocar o driver específico do fabricante por um driver genérico que não reconhece os gestos nem o clique. Reinstalar o driver oficial do modelo, baixado no site do fabricante, devolve o funcionamento. É um atendimento que fazemos remotamente, sem retirar o aparelho."
      },
      {
        "question": "Posso usar mouse externo e deixar como está?",
        "answer": "Pode, e para muita gente é uma solução aceitável. Só existe uma ressalva importante: se o touchpad parou após contato com líquido, deixar como está é arriscado, porque a corrosão continua avançando dentro do aparelho e pode alcançar a placa principal. Nesse caso a avaliação não é opcional."
      },
      {
        "question": "O teclado também parou junto. Muda alguma coisa?",
        "answer": "Muda bastante. Teclado e touchpad falhando ao mesmo tempo apontam para o controlador na placa ou para líquido que atingiu os dois conectores, e não para duas peças que quebraram por coincidência. Esse cenário está detalhado na página sobre teclado de notebook que não funciona e exige avaliação em bancada."
      },
      {
        "question": "Preciso levar o notebook até vocês?",
        "answer": "Não temos balcão de atendimento ao público. Casos de driver e configuração são resolvidos por acesso remoto. Quando é preciso abrir o aparelho para reencaixar o cabo flat ou trocar o módulo, retiramos no endereço informado e devolvemos no mesmo endereço, com 90 dias de garantia sobre mão de obra e peça aplicada."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTouchpadNaoFunciona,
});
