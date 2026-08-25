import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaMonitorSemSinal from "@/pages/problemas/MonitorSemSinal";

export const Route = createFileRoute("/problemas/monitor-sem-sinal")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/monitor-sem-sinal",
    "title": "Monitor Sem Sinal: Causas e Solução | Curitiba",
    "description": "Monitor mostra \"sem sinal\" com o computador ligado? Veja como separar cabo, entrada errada, placa de vídeo e falha do próprio monitor antes de gastar.",
    "faq": [
      {
        "question": "Meu computador liga mas o monitor fica sem sinal. É o monitor ou o PC?",
        "answer": "Só o teste cruzado responde. Ligue o monitor em outro equipamento: se ele exibe imagem, o monitor está bom e o problema é da saída de vídeo ou da inicialização do computador. Ligue o computador em outra tela: se a imagem aparece, o monitor ou o cabo daquele conjunto é o defeituoso. Ventoinha girando não prova inicialização — muitos casos de \"sem sinal\" são computador que sequer completa o boot por memória fora do encaixe."
      },
      {
        "question": "Troquei o cabo e continua sem imagem. O que testar depois?",
        "answer": "Confira a entrada selecionada no monitor manualmente, sem depender da detecção automática, e verifique em qual saída o cabo está ligado. Em máquinas com placa de vídeo dedicada, a saída da placa-mãe costuma ficar desativada, e ligar o cabo nela produz exatamente essa mensagem. Depois disso, reencaixe memória e placa de vídeo com o equipamento fora da tomada."
      },
      {
        "question": "A imagem some depois de alguns minutos. Qual a causa provável?",
        "answer": "Falha que aparece com o equipamento quente aponta para fadiga térmica na placa de vídeo, capacitor da fonte do monitor no fim da vida ou cabo com contato instável. Não é configuração. Esse padrão pede medição em bancada porque o defeito não se manifesta com o aparelho frio, que é justamente o estado em que um teste rápido acontece."
      },
      {
        "question": "Ficou sem imagem logo depois de uma limpeza. Isso é comum?",
        "answer": "Muito comum e quase sempre reversível. Ao remover poeira, é fácil deslocar um módulo de memória, tirar a placa de vídeo do trilho ou esquecer o cabo de alimentação auxiliar da GPU. Antes de supor peça queimada, reencaixe cada componente com firmeza até a trava fechar, com o cabo de força retirado da tomada."
      },
      {
        "question": "Vale a pena consertar o monitor ou é melhor comprar outro?",
        "answer": "Depende do bloco defeituoso. Fonte interna e placa de sinal são reparos de componente que costumam compensar com folga. Painel com trinca, mancha ou linhas fixas não tem reparo viável: a peça sozinha se aproxima do valor de um monitor equivalente, e nesses casos orientamos não fazer o serviço em vez de empurrar serviço."
      },
      {
        "question": "Preciso levar o equipamento até vocês?",
        "answer": "Não. Não temos balcão de atendimento ao público. O atendimento acontece no seu endereço, por acesso remoto quando cabível, ou por coleta e entrega quando o caso exige bancada — situação normal em falha de vídeo, que depende de peças de referência para ser isolada com segurança."
      },
      {
        "question": "Qual a garantia do serviço?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo na fonte do monitor cobre a fonte do monitor; troca de placa de vídeo cobre aquela placa. Defeito posterior em outro componente é avaliado como caso novo, e dano por descarga elétrica após a entrega não está coberto."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaMonitorSemSinal,
});
