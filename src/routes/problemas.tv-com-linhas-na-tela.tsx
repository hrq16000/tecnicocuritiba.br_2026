import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTvLinhas from "@/pages/problemas/TvComLinhasNaTela";

export const Route = createFileRoute("/problemas/tv-com-linhas-na-tela")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-com-linhas-na-tela",
    "title": "TV com Linhas na Tela: Tem Conserto? | Curitiba",
    "description": "Televisor com linhas verticais, horizontais ou faixas coloridas na imagem? Entenda quando é conexão do painel, placa de controle ou dano interno sem reparo viável.",
    "faq": [
      {
        "question": "TV com linhas na tela tem conserto?",
        "answer": "Depende de onde a falha está. Quando a origem é conexão do painel, cabo flat ou placa de controle da imagem, o reparo costuma ser viável e o aparelho volta com imagem normal. Quando o dano está dentro da matriz do painel, não há reparo possível — e trocar o painel raramente compensa diante do valor de um televisor novo. Por isso a avaliação em bancada vem antes de qualquer valor fechado: é ela que separa os dois mundos."
      },
      {
        "question": "Linha vertical e linha horizontal têm a mesma causa?",
        "answer": "Não, e essa diferença muda bastante a expectativa. Linhas verticais têm relação com o comando das colunas, um circuito que em muitos modelos passa por conexões acessíveis e por isso apresenta taxa maior de reparo. Linhas horizontais costumam vir do lado das linhas do painel, com componentes integrados à estrutura da tela, onde a intervenção é bem mais limitada. Sinalizamos a expectativa real antes de iniciar."
      },
      {
        "question": "As linhas apareceram depois que eu mudei de casa. É coincidência?",
        "answer": "Provavelmente não. Transporte é uma das causas mais frequentes de linhas em televisor: a vibração solta conectores e a flexão da tela durante o manuseio compromete contatos internos. A boa notícia é que casos de mau contato após movimentação estão entre os mais reparáveis. A má notícia é que pressão sobre a tela durante o transporte, quando marca a matriz, produz um dano sem volta."
      },
      {
        "question": "Vale a pena consertar ou é melhor comprar outra TV?",
        "answer": "O critério que usamos é objetivo: quando o custo do reparo se aproxima do valor de um aparelho equivalente, não indicamos o serviço. Reparos de conexão e de placa costumam ficar bem abaixo desse limite e compensam. Dano de painel, ao contrário, quase nunca compensa. Damos a orientação com o número na mão depois da avaliação, mesmo quando a resposta significa não fazer o serviço."
      },
      {
        "question": "As linhas somem sozinhas depois de um tempo ligada. Isso melhora?",
        "answer": "Não melhora, mas é uma informação valiosa. Falha que varia com o aquecimento indica solda fadigada ou contato dilatando, e esse é justamente o grupo com maior chance de reparo bem-sucedido. O padrão típico é piorar aos poucos: começa aparecendo só nos primeiros minutos e passa a ficar permanente. Avaliar enquanto ainda é intermitente costuma resultar em serviço mais simples."
      },
      {
        "question": "Preciso levar a TV até vocês?",
        "answer": "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Televisor transportado sem embalagem adequada é uma das principais causas de dano de painel. O atendimento começa pelo WhatsApp com a foto da tela, e a retirada acontece no endereço informado. A devolução é feita no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "Vocês trocam o painel do televisor?",
        "answer": "Não trabalhamos com substituição de painel. É uma peça cara, frágil, frequentemente indisponível para modelos com alguns anos e com risco alto de dano na aplicação — o resultado quase nunca justifica o custo para o cliente. Preferimos declarar essa limitação antes de recolher o aparelho a cobrar por uma tentativa que sabemos improvável."
      },
      {
        "question": "Qual a garantia do reparo de imagem?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco em que atuamos. Se o reparo foi na placa de controle da imagem, é esse conjunto que está coberto. Falha posterior em outro circuito é avaliada como caso novo. Impacto, queda ou pressão sobre a tela depois da entrega caracterizam dano novo e não estão cobertos pela garantia."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTvLinhas,
});
