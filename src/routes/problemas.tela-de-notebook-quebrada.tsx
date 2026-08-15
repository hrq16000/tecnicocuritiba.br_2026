import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTelaNotebookQuebrada from "@/pages/problemas/TelaDeNotebookQuebrada";

export const Route = createFileRoute("/problemas/tela-de-notebook-quebrada")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tela-de-notebook-quebrada",
    "title": "Tela de Notebook Quebrada: Troca, Custo e Riscos | Curitiba",
    "description": "Tela trincada, com manchas ou linhas? Entenda a diferença entre painel danificado, cabo flat e placa de vídeo, o que a troca resolve, o que não resolve e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "Dá para consertar a tela trincada sem trocar o painel?",
        "answer": "Não. Painel de notebook é um conjunto selado: a matriz, a iluminação e o filtro polarizador formam uma peça só. Quando há trinca com mancha escura, o cristal líquido já vazou e nenhuma técnica devolve a área perdida. O que existe de reparo real é a troca do painel completo. Quem oferece 'conserto de trinca' geralmente está falando de troca de vidro em telas touch, que é outra situação e nem sempre é possível."
      },
      {
        "question": "Como vocês sabem se é a tela ou a placa de vídeo?",
        "answer": "Pelo teste com monitor externo, que separa os dois caminhos em minutos. Se a imagem externa sai limpa, a parte gráfica da placa está funcionando e a falha está no painel, no cabo flat ou no conector. Se o monitor externo repete o mesmo defeito, o problema é da placa e trocar a tela não resolveria nada. Esse teste é feito antes de qualquer orçamento de peça."
      },
      {
        "question": "Quanto custa trocar a tela do meu notebook?",
        "answer": "O valor depende do painel do seu modelo, e a variação é grande: resolução, tipo de conector, presença de touch e disponibilidade de peça mudam o preço mais do que a mão de obra. Pelo WhatsApp damos a faixa provável a partir do modelo, e o valor fechado sai depois da inspeção, com peça identificada. Nada é executado sem sua aprovação."
      },
      {
        "question": "A tela nova fica igual à original?",
        "answer": "Trabalhamos com painel de mesma resolução, mesmo tamanho e mesmo tipo de conector do original. Quando o painel disponível tiver característica diferente da peça de fábrica — por exemplo, variação de ângulo de visão em modelos antigos — informamos antes da compra, e você decide. Não instalamos painel de resolução inferior sem aviso."
      },
      {
        "question": "Vale a pena trocar a tela de um notebook antigo?",
        "answer": "Depende da relação entre o custo do painel e o valor do aparelho funcionando. Em notebooks antigos, o painel às vezes representa boa parte do valor de mercado do equipamento, e nesse caso dizemos isso com clareza em vez de empurrar o serviço. Uma alternativa honesta em muitos casos é usar o aparelho com monitor externo e migrar os dados quando fizer sentido trocar de máquina."
      },
      {
        "question": "Preciso levar o notebook até vocês?",
        "answer": "Não existe atendimento presencial em balcão. O serviço é feito com coleta e entrega: você aciona pelo WhatsApp, combinamos a retirada no endereço informado, o aparelho é avaliado e reparado em bancada e devolvido no mesmo endereço. Para transporte com vidro estilhaçado, orientamos como embalar sem espalhar cacos."
      },
      {
        "question": "Qual é a garantia da troca de tela?",
        "answer": "90 dias sobre a mão de obra e sobre o painel aplicado, escopados ao serviço executado. A garantia cobre defeito da peça e da instalação — não cobre novo impacto, pressão sobre a tampa ou queda posterior, porque são danos novos e não falha do reparo. Esse limite é informado antes, por escrito, junto do orçamento."
      },
      {
        "question": "Meus arquivos correm risco durante a troca?",
        "answer": "A troca de painel não mexe na unidade de armazenamento, então em condições normais os arquivos permanecem intactos. Ainda assim, recomendamos backup antes de qualquer serviço, porque um aparelho que sofreu queda pode ter outros danos que só se manifestam ao ser aberto. Se você não tiver como fazer o backup, fazemos a cópia junto do serviço."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTelaNotebookQuebrada,
});
