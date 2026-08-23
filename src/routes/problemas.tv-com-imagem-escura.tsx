import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTvComImagemEscura from "@/pages/problemas/TvComImagemEscura";

export const Route = createFileRoute("/problemas/tv-com-imagem-escura")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-com-imagem-escura",
    "title": "TV com Imagem Escura: Causas e Conserto | Curitiba",
    "description": "TV com imagem escura, som normal e tela quase apagada? Veja como separar backlight queimado, placa de fonte, ajuste de brilho e falha do painel antes de trocar o.",
    "faq": [
      {
        "question": "Minha TV está com a imagem muito escura. É o painel?",
        "answer": "Raramente. Na maior parte dos aparelhos que recebemos com esse sintoma o painel está intacto e a falha está na iluminação de fundo ou na placa que a alimenta. O teste da lanterna no escuro é o que separa os dois cenários em segundos: se a imagem aparece de leve, o painel está funcionando."
      },
      {
        "question": "Vale a pena consertar ou é melhor comprar outra TV?",
        "answer": "Depende do que a avaliação encontrar e do tamanho do aparelho. Reparo de iluminação e de placa de fonte costuma compensar em televisores maiores. Quando o custo se aproxima demais do valor de um aparelho novo, dizemos isso abertamente com os números na mão, antes de você aprovar qualquer serviço."
      },
      {
        "question": "Pode ser apenas configuração de brilho?",
        "answer": "Pode, e é a primeira coisa a descartar porque não custa nada. Modo economia de energia, sensor de luz ambiente e perfis de imagem muito escuros deixam a tela quase apagada em salas claras. Restaurar o perfil padrão resolve esse cenário sem nenhuma intervenção técnica."
      },
      {
        "question": "A TV escurece só depois de meia hora ligada. O que isso indica?",
        "answer": "Escurecimento progressivo com o aquecimento aponta para componente que perde desempenho quente, geralmente na placa de fonte ou no driver de iluminação. É um padrão que só se confirma medindo tensão com o aparelho já aquecido, o que exige bancada."
      },
      {
        "question": "Vocês fazem o reparo na minha casa?",
        "answer": "Abertura de televisor não é feita em domicílio. A avaliação inicial pode ser feita no endereço, mas o reparo de iluminação e de placa exige bancada, com ferramenta adequada e teste posterior antes da devolução."
      },
      {
        "question": "Quanto tempo o aparelho fica com vocês?",
        "answer": "Não damos prazo fixo antes de avaliar, porque ele depende do que for encontrado e da disponibilidade da peça específica do modelo. Depois da avaliação você recebe o que foi encontrado, o que será feito e o valor, e nada é executado sem a sua aprovação."
      },
      {
        "question": "Como funciona o atendimento?",
        "answer": "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTvComImagemEscura,
});
