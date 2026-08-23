import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaWindowsNaoInicia from "@/pages/problemas/WindowsNaoInicia";

export const Route = createFileRoute("/problemas/windows-nao-inicia")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/windows-nao-inicia",
    "title": "Windows Não Inicia: Como Recuperar o Sistema | Curitiba",
    "description": "Windows travado no logo, reparo automático em loop ou mensagem de disco de inicialização não encontrado? Veja como separar falha de sistema, disco com setor ruim e.",
    "faq": [
      {
        "question": "Windows não inicia significa que vou perder meus arquivos?",
        "answer": "Não necessariamente, e na maioria dos atendimentos os arquivos são preservados. Sistema que não carrega e disco danificado são coisas diferentes. A avaliação começa justamente medindo a saúde do disco antes de qualquer reparo, e só então definimos se dá para recuperar o sistema no lugar ou se convém copiar os dados primeiro."
      },
      {
        "question": "Formatar resolve o problema?",
        "answer": "Resolve em parte dos casos, mas é a última alternativa e não a primeira. Formatar apaga o que estiver no disco e, se a origem for setor defeituoso, o problema volta em poucas semanas. Por isso o roteiro correto é diagnosticar o disco, recuperar os dados quando necessário e só depois reinstalar."
      },
      {
        "question": "O que é o reparo automático em loop?",
        "answer": "É a tentativa do próprio Windows de se consertar, repetida sem sucesso. Ela aparece quando os arquivos de inicialização estão inconsistentes ou quando o disco responde com erro em algumas leituras e não em outras. O loop em si não danifica nada, mas insistir em reiniciar dezenas de vezes com disco em falha piora o quadro."
      },
      {
        "question": "Pode ser problema de memória RAM?",
        "answer": "Pode, e é um cenário que testamos em bancada. Memória instável derruba o carregamento sempre em momentos diferentes, sem padrão fixo. Quando a falha ocorre exatamente no mesmo ponto toda vez, a suspeita se volta para disco ou arquivos de sistema."
      },
      {
        "question": "Consigo resolver por atendimento remoto?",
        "answer": "Não neste caso. O atendimento remoto depende do sistema carregado e com rede ativa. Quando o Windows não inicia, a avaliação precisa ser física, com o equipamento em bancada ou em visita técnica no endereço."
      },
      {
        "question": "Vale a pena consertar um computador antigo com esse problema?",
        "answer": "Depende do que a avaliação encontrar. Reparo de sistema em máquina antiga costuma compensar. Troca de disco em equipamento com placa já no fim da vida útil nem sempre compensa, e quando esse for o caso dizemos isso abertamente, com os números na mão, antes de você aprovar qualquer serviço."
      },
      {
        "question": "Como funciona o atendimento?",
        "answer": "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaWindowsNaoInicia,
});
