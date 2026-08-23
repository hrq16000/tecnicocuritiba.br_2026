import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTvNaoLiga from "@/pages/problemas/TvNaoLiga";

export const Route = createFileRoute("/problemas/tv-nao-liga")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-nao-liga",
    "title": "TV Não Liga? Diagnóstico Técnico de TV em Curitiba",
    "description": "TV que não liga, com LED piscando, som sem imagem ou desligando sozinha: entenda o que é fonte, placa principal, backlight ou painel, o que verificar.",
    "faq": [
      {
        "question": "TV que não liga tem conserto?",
        "answer": "Depende de onde a falha está. Problemas de fonte, de iluminação da tela e parte das falhas de placa principal têm reparo viável. Dano físico no painel — tela trincada, mancha grande ou linhas fixas por impacto — não tem reparo que compense, e dizemos isso já na triagem, antes de qualquer deslocamento."
      },
      {
        "question": "O que significa o LED piscando na frente da TV?",
        "answer": "É uma sinalização de proteção: o aparelho interrompeu a partida porque alguma tensão saiu da faixa esperada. O padrão de piscadas varia por marca e plataforma, então ele orienta a investigação, mas não substitui a medição. Contar quantas piscadas ocorrem em sequência ajuda bastante na triagem."
      },
      {
        "question": "Tem som mas não tem imagem: é o painel?",
        "answer": "Nem sempre — e essa é a distinção mais importante. Se com uma lanterna incidindo de lado no escuro é possível ver a imagem apagada, o processamento está funcionando e o problema está na iluminação da tela, que costuma ter reparo. Painel comprometido é outro cenário, e nele o custo se aproxima do valor de um aparelho novo."
      },
      {
        "question": "Vocês trocam painel de TV?",
        "answer": "Não. Troca de painel raramente compensa: a peça representa a maior parte do valor do aparelho e o risco de dano no transporte e na montagem é alto. Quando o diagnóstico aponta painel, informamos abertamente e explicamos por que a substituição do aparelho é a decisão mais racional."
      },
      {
        "question": "A TV parou de ligar depois de uma tempestade. Isso é comum?",
        "answer": "Muito comum. Oscilações e picos na rede atingem primeiro a fonte de alimentação, que é justamente a etapa com maior chance de reparo pontual. Ligar a TV em tomada com aterramento adequado e evitar filtros de linha genéricos reduz a recorrência, mas não elimina o risco em descargas próximas."
      },
      {
        "question": "Preciso levar a TV até algum endereço?",
        "answer": "Não atendemos em balcão. O contato começa pelo WhatsApp com marca, modelo, tamanho e descrição do sintoma, e o aparelho é retirado e devolvido no endereço combinado, com as condições descritas na página de coleta e entrega."
      },
      {
        "question": "Dá para orçar antes de ver a TV?",
        "answer": "Não com precisão. Fonte, iluminação e placa principal são intervenções com custo bem diferente, e o mesmo sintoma pode vir de qualquer uma delas. O que fazemos na triagem é indicar quais cenários são compatíveis com o que você descreveu e qual deles não compensaria seguir."
      },
      {
        "question": "Qual a garantia do reparo de TV?",
        "answer": "90 dias de garantia sobre a mão de obra do serviço executado, limitada ao defeito efetivamente tratado. Peças e componentes seguem a garantia do fornecedor. A garantia não cobre outra falha que apareça em etapa diferente do aparelho nem dano físico posterior no painel."
      },
      {
        "question": "Vale a pena consertar uma TV antiga?",
        "answer": "O critério é a relação entre o custo do reparo e o valor de um aparelho equivalente hoje. Reparo de fonte em uma TV grande costuma compensar com folga; intervenção extensa em modelo pequeno e antigo raramente compensa. Apresentamos essa conta antes de você autorizar qualquer serviço."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTvNaoLiga,
});
