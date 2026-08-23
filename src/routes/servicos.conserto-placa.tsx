import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/conserto-placa")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/conserto-placa",
    "title": "Reparo de Placa Eletrônica em Curitiba | Nível de Componente",
    "description": "Reparo de placa-mãe de notebook, placa de PC e placa de TV em Curitiba: avaliação em bancada, reparo em nível de componente, retrabalho de BGA quando viável, coleta.",
    "faq": [
      {
        "question": "O que é reparo em nível de componente?",
        "answer": "É atuar dentro da placa em vez de substituí-la. Medimos os estágios do circuito, comparamos o comportamento com o esperado, localizamos o componente que falhou e trocamos apenas ele. Isso permite recuperar equipamentos cuja placa nova é cara, indisponível ou fora de linha. Exige bancada com instrumentos de medição, ferramenta de solda adequada e leitura de circuito — não é o mesmo trabalho de trocar módulo."
      },
      {
        "question": "Toda placa tem conserto?",
        "answer": "Não, e essa é a parte que precisa ficar clara antes da avaliação. Placa com corrosão avançada em várias regiões, com trilhas internas rompidas em camadas que não são acessíveis, com dano térmico extenso ou com componente que simplesmente não existe mais no mercado pode não ter caminho de reparo. Nesses casos entregamos o laudo explicando o motivo e devolvemos a placa."
      },
      {
        "question": "Vocês fazem retrabalho de BGA e reballing?",
        "answer": "Fazemos quando o caso permite e sempre com o risco declarado por escrito. Retrabalho de encapsulamento envolve aquecimento controlado de uma região da placa, e existe risco real de o procedimento não recuperar o funcionamento ou de a recuperação não se sustentar no tempo. Não tratamos esse procedimento como solução garantida e não o executamos sem o seu aceite expresso das limitações."
      },
      {
        "question": "O equipamento caiu líquido. Ainda dá para recuperar?",
        "answer": "Depende do tempo de exposição e de o aparelho ter sido ligado depois. Líquido causa corrosão progressiva: a placa pode funcionar por dias e falhar depois, porque a trilha continua se degradando sob o verniz. Fazemos limpeza técnica e reparo dos pontos atingidos, mas o resultado é limitado pelo dano já consolidado e não conseguimos garantir estabilidade futura em placa que sofreu corrosão."
      },
      {
        "question": "Qual é a garantia de um reparo de placa?",
        "answer": "90 dias sobre a mão de obra e sobre o ponto reparado. A cobertura é específica: vale para o defeito tratado e para o componente substituído por nós. Não cobre falha em outro estágio da mesma placa, dano por nova entrada de líquido, novo surto elétrico, queda ou intervenção de terceiros. Em placa com histórico de corrosão, a cobertura é limitada ao ponto reparado, e isso é registrado no laudo."
      },
      {
        "question": "Vale mais a pena reparar a placa ou trocar o equipamento?",
        "answer": "É exatamente o que a avaliação responde. Consideramos o valor do reparo, o valor de uma placa nova quando ela existe, o valor de um equipamento equivalente, a idade do aparelho e o estado dos demais componentes. Quando a conta não fecha a favor do reparo, dizemos isso — recuperar uma placa por um valor próximo ao de um equipamento novo raramente é a melhor decisão."
      },
      {
        "question": "Vocês reparam placa avulsa, sem o equipamento?",
        "answer": "Recebemos placa avulsa para avaliação, mas com uma limitação importante: sem o equipamento completo não é possível validar o reparo em condição real de uso. Testamos a placa em bancada dentro do que o circuito permite, e o teste final com carga real fica por sua conta ao remontar. Sempre que possível, prefira enviar o equipamento inteiro."
      },
      {
        "question": "A placa já foi mexida por outro técnico. Vocês aceitam?",
        "answer": "Aceitamos, desde que você informe isso na triagem. Reparo anterior não é motivo de recusa, mas muda o trabalho: excesso de solda, cola, componente trocado por outro fora de especificação e trilha já emendada precisam ser corrigidos antes de qualquer diagnóstico confiável. Placa muito castigada por intervenções sucessivas pode chegar ao ponto de não ter mais viabilidade."
      },
      {
        "question": "Existe risco de a placa piorar durante o reparo?",
        "answer": "Existe, e não escondemos isso. Trabalho em nível de componente envolve aquecimento, remoção de peças e manipulação de trilhas, tudo em uma placa que já está com defeito. Em placas com corrosão, com dano térmico anterior ou com múltiplos reparos prévios, o risco é maior. Avisamos quando identificamos esse cenário e só seguimos com a sua autorização registrada."
      },
      {
        "question": "Como funciona o envio da placa ou do equipamento?",
        "answer": "Pela coleta e entrega, nas condições publicadas na página de coleta. O equipamento é registrado no recebimento com estado e acessórios, avaliado em bancada e devolvido após os testes. Não fazemos esse tipo de serviço em visita: reparo de placa depende de bancada, instrumentos e ambiente controlado."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="conserto-placa" />,
});
