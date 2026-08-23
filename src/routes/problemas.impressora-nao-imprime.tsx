import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaImpressoraNaoImprime from "@/pages/problemas/ImpressoraNaoImprime";

export const Route = createFileRoute("/problemas/impressora-nao-imprime")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/impressora-nao-imprime",
    "title": "Impressora Não Imprime: Causas e Solução | Curitiba",
    "description": "Impressora aparece como offline, aceita o trabalho e não imprime ou sai página em branco? Veja como separar fila travada, driver, rede Wi-Fi e falha mecânica.",
    "faq": [
      {
        "question": "Minha impressora aparece como offline mesmo estando ligada. O que é isso?",
        "answer": "Na quase totalidade dos casos é rede, não defeito. A impressora recebe um endereço novo depois de uma queda de energia ou de uma troca de roteador, enquanto o computador continua procurando pelo endereço antigo. O resultado é o status offline com o aparelho perfeitamente funcional. A correção é fixar o endereço da impressora na rede e recriar a porta no computador, algo que costuma ser feito remotamente."
      },
      {
        "question": "A impressora imprime pelo celular, mas não pelo computador. Por quê?",
        "answer": "Esse teste é a melhor notícia possível: ele prova que a impressora, a rede e a parte mecânica estão em ordem. O que falhou é a camada de software daquele computador — driver corrompido, fila travada ou impressora padrão apontando para um dispositivo virtual de PDF. Reinstalação limpa do driver resolve a maioria desses casos sem qualquer peça."
      },
      {
        "question": "Sai página em branco. Preciso trocar o cartucho?",
        "answer": "Nem sempre, e essa é uma das trocas mais desperdiçadas que vemos. Em impressora a jato parada por semanas, o mais comum é cabeça de impressão entupida por tinta seca, e a limpeza pelo painel costuma devolver a impressão com o mesmo cartucho. Em laser, página em branco aponta para toner mal encaixado, cilindro no fim ou sensor sujo. Vale rodar a limpeza e a página de teste antes de comprar suprimento."
      },
      {
        "question": "A impressora atola papel toda vez. Isso tem conserto?",
        "answer": "Tem, e geralmente é mecânico simples. Atolamento sempre no mesmo ponto indica rolete desgastado, sujeira acumulada no caminho da folha ou um pedaço de papel esquecido dentro do equipamento numa remoção anterior. Limpeza do trajeto e troca de rolete resolvem a maior parte. O que agrava o quadro é puxar a folha contra o sentido do mecanismo, o que costuma quebrar dentes de engrenagem."
      },
      {
        "question": "Vale a pena consertar ou é melhor comprar outra?",
        "answer": "O critério é objetivo e mudamos a recomendação conforme o caso. Ajuste de driver, rede e limpeza compensam quase sempre, porque o custo fica muito abaixo de um aparelho novo. Já troca de cabeçote em impressora de entrada, ou peça descontinuada em modelo antigo, com frequência se aproxima do valor de uma impressora nova — e nesse cenário dizemos para não fazer, mesmo perdendo o serviço."
      },
      {
        "question": "Preciso levar a impressora até vocês?",
        "answer": "Não. Não temos balcão de atendimento ao público. Boa parte dos casos de impressora se resolve no próprio local ou remotamente, porque a origem é driver, fila ou rede. Quando a avaliação precisa de bancada, retiramos o equipamento no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "Qual a garantia do serviço em impressora?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Serviço de rolete cobre rolete; ajuste de rede e driver cobre a configuração entregue. Suprimento, cartucho e toner seguem a garantia do fabricante. Atolamento causado por papel fora da gramatura recomendada ou por umidade caracteriza situação nova e é avaliado à parte."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaImpressoraNaoImprime,
});
