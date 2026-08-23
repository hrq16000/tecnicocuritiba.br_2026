import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaNotebookNaoConectaWifi from "@/pages/problemas/NotebookNaoConectaWifi";

export const Route = createFileRoute("/problemas/notebook-nao-conecta-no-wifi")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/notebook-nao-conecta-no-wifi",
    "title": "Notebook Não Conecta no Wi-Fi: Como Resolver | Curitiba",
    "description": "Notebook não conecta no Wi-Fi, não encontra a rede ou conecta sem internet? Veja como separar driver, placa de rede desativada, antena solta e falha do roteador.",
    "faq": [
      {
        "question": "Meu notebook não encontra nenhuma rede Wi-Fi. O que pode ser?",
        "answer": "Lista completamente vazia, com outros aparelhos conectando normalmente, aponta para três frentes: adaptador desativado por atalho ou modo avião, driver ausente após atualização, ou placa sem fio não reconhecida pelo sistema. As duas primeiras se resolvem por configuração e a terceira exige avaliação física."
      },
      {
        "question": "Só conecto quando estou muito perto do roteador. Isso tem conserto?",
        "answer": "Tem, e o cenário mais comum é antena interna desconectada. Isso acontece com frequência depois de uma manutenção anterior, porque os cabos de antena passam pela dobradiça e são fáceis de esquecer na remontagem. Recolocada a antena, o alcance volta ao normal."
      },
      {
        "question": "Conecta no Wi-Fi mas não abre nenhum site. Por quê?",
        "answer": "Conexão sem navegação separa dois mundos: o notebook falou com o roteador, mas algo entre o roteador e a internet não está resolvendo. Costuma ser DNS, conflito de endereço IP ou o próprio link do provedor. Testar outro aparelho na mesma rede resolve a dúvida rapidamente."
      },
      {
        "question": "Vale trocar a placa Wi-Fi ou usar um adaptador USB?",
        "answer": "Depende do diagnóstico. Quando o módulo interno realmente falhou, o adaptador USB é uma alternativa econômica e dizemos isso quando é o caso. Quando o problema é antena ou encaixe, trocar a placa não resolve nada e o custo seria desperdiçado."
      },
      {
        "question": "O Wi-Fi cai sozinho depois de alguns minutos. É defeito?",
        "answer": "Nem sempre. A economia de energia do adaptador desliga o rádio para poupar bateria e derruba a conexão em uso leve. Desativar essa opção resolve boa parte dos casos. Se a queda persistir com a economia desligada, entra driver instável ou interferência de canal."
      },
      {
        "question": "Dá para resolver sem levar o notebook?",
        "answer": "Na maioria dos casos de driver, perfil de rede e configuração, sim, e é o que indicamos por ser mais rápido. Quando o sintoma é alcance curto ou o adaptador nem aparece no sistema, a avaliação precisa ser física e o equipamento é retirado no endereço informado."
      },
      {
        "question": "Como funciona o atendimento?",
        "answer": "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaNotebookNaoConectaWifi,
});
