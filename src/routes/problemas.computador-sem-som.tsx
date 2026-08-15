import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaComputadorSemSom from "@/pages/problemas/ComputadorSemSom";

export const Route = createFileRoute("/problemas/computador-sem-som")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/computador-sem-som",
    "title": "Computador Sem Som: Como Resolver | Curitiba",
    "description": "Computador sem som, som só no fone ou saída de áudio sumida do Windows? Veja como separar dispositivo de saída errado, driver, conector danificado e falha no chip de áudio antes de trocar peça, com avaliação em Curitiba.",
    "faq": [
      {
        "question": "Meu computador ficou sem som do nada. É defeito de hardware?",
        "answer": "Na maioria dos casos, não. Som que some sem queda, sem raio e sem pancada costuma ser driver substituído em atualização, serviço de áudio parado ou dispositivo de saída trocado para o monitor HDMI. Vale checar essas três frentes antes de considerar defeito físico, porque nenhuma delas exige peça."
      },
      {
        "question": "O som funciona no fone mas não na caixa. O que é?",
        "answer": "Duas possibilidades dominam esse quadro. A primeira é o sistema ter fixado o fone como saída padrão e não voltar sozinho. A segunda é o cabo ou o plugue da caixa estar rompido internamente, algo comum perto da dobra do conector. Testar a caixa em um celular resolve a dúvida em um minuto."
      },
      {
        "question": "A placa de áudio sumiu do gerenciador de dispositivos. Isso é grave?",
        "answer": "Não necessariamente. Sumir da lista acontece quando o driver foi removido ou quando o dispositivo está desativado. Também pode indicar que o chip de áudio da placa-mãe deixou de responder, o que é mais sério. A diferença entre os dois cenários aparece no diagnóstico em bancada, e não em qualquer ajuste feito por fora."
      },
      {
        "question": "Vale a pena instalar uma placa de som em vez de consertar?",
        "answer": "Em desktop, quando o chip de áudio integrado realmente falhou, uma placa dedicada ou um adaptador USB costuma ser a saída mais econômica, e dizemos isso quando é o caso. Em notebook, essa alternativa é limitada e a avaliação precisa considerar o conector e a placa. A recomendação sai depois do diagnóstico, não antes."
      },
      {
        "question": "O som está chiando e picotando. Também é falta de driver?",
        "answer": "Pode ser, mas não só. Chiado e picotes aparecem em conflito de driver, em interferência elétrica e em cabo sem blindagem passando junto de fonte. Trocar o cabo de posição e testar outra saída ajuda a isolar. Se o ruído acompanha o computador em qualquer saída, o caminho é o diagnóstico técnico."
      },
      {
        "question": "Formatar resolve problema de áudio?",
        "answer": "Resolve quando a origem é software, mas é a última opção e não a primeira. Antes disso vale conferir saída padrão, mixer, serviço de áudio e driver. Se optarmos por reinstalação, o backup é feito antes e os dados são devolvidos depois, sem improviso."
      },
      {
        "question": "Como funciona o atendimento?",
        "answer": "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Parte dos casos de áudio se resolve por atendimento remoto, e nesse caso avisamos antes."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaComputadorSemSom,
});
