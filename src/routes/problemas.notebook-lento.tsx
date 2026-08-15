import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaNotebookLento from "@/pages/problemas/NotebookLento";

export const Route = createFileRoute("/problemas/notebook-lento")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/notebook-lento",
    "title": "Notebook Lento: Causas Reais e Solução | Curitiba",
    "description": "Notebook demorando para ligar, travando ao abrir programas ou lento só na bateria? Veja como separar disco mecânico, memória insuficiente, calor e software antes de trocar de aparelho, com avaliação técnica em Curitiba.",
    "faq": [
      {
        "question": "Meu notebook ficou muito lento. Vale a pena consertar ou é melhor comprar outro?",
        "answer": "Na maioria dos aparelhos com até seis ou sete anos, a troca do disco mecânico por SSD e o ajuste de memória entregam um salto de desempenho por uma fração do valor de um notebook novo. O que muda a conta é dano de placa, dobradiça arrebentada ou tela comprometida ao mesmo tempo. Quando a soma dos reparos se aproxima do valor de um aparelho equivalente, dizemos isso com o número na mão em vez de empurrar serviço."
      },
      {
        "question": "Trocar por SSD resolve mesmo ou é exagero de técnico?",
        "answer": "Resolve quando o gargalo é o disco, e isso é verificável antes: se o gerenciador de tarefas mostra o disco em 100% enquanto processador e memória estão folgados, o disco é o limite. Nesse caso o SSD muda a experiência inteira, do tempo de inicialização à abertura de programas. Se o gargalo for memória ou temperatura, SSD sozinho decepciona, e é por isso que a avaliação vem antes da peça."
      },
      {
        "question": "Formatar deixa o notebook rápido de novo?",
        "answer": "Ajuda quando a causa é software acumulado: programas iniciando junto, restos de instalações e infecção. Não ajuda quando o limite é físico. Notebook com HD mecânico continua lento depois de formatado, porque o disco continua sendo o mesmo. Por isso avaliamos primeiro e evitamos vender formatação como solução universal."
      },
      {
        "question": "Por que ele fica lento só depois de um tempo ligado?",
        "answer": "Porque o processador reduz a própria frequência para não superaquecer. Isso acontece quando o dissipador está obstruído por poeira e a pasta térmica perdeu eficiência, situação comum em notebooks com mais de dois anos sem limpeza interna. A correção é mecânica, feita em bancada, com teste de temperatura sob carga depois do serviço para comprovar o ganho."
      },
      {
        "question": "Programas otimizadores ajudam?",
        "answer": "Não recomendamos. Limpadores de registro e aceleradores prometem ganho que não existe, muitas vezes instalam componentes indesejados e, em alguns casos, removem itens necessários ao sistema. Desativar a inicialização automática do que você não usa é gratuito, seguro e entrega mais resultado do que qualquer um desses programas."
      },
      {
        "question": "Perco meus arquivos na troca de disco ou na formatação?",
        "answer": "Não. O backup dos seus dados é feito antes de qualquer intervenção e a restauração acontece depois, com conferência junto com você. A exceção é o disco já em falha física: quando há estalos ou setores ilegíveis, parte dos dados pode não ser recuperável, e isso é informado antes de começar, sem promessa que não se possa cumprir."
      },
      {
        "question": "Preciso levar o notebook até vocês?",
        "answer": "Não temos balcão de atendimento ao público. Casos de software e configuração costumam ser resolvidos por acesso remoto. Quando o serviço envolve troca de disco, memória ou limpeza interna, retiramos o aparelho no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado, com 90 dias de garantia sobre mão de obra e peça aplicada."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaNotebookLento,
});
