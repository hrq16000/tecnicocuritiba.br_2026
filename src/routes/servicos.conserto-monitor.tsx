import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/conserto-monitor")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/conserto-monitor",
    "title": "Conserto de Monitor em Curitiba | Bancada, Coleta e Entrega",
    "description": "Conserto de monitor em Curitiba: avaliação em bancada, reparo de fonte, placa e backlight quando viável, coleta e entrega.",
    "faq": [
      {
        "question": "Meu monitor não liga. Tem conserto?",
        "answer": "Na maioria das vezes sim, porque a causa costuma ser elétrica. Monitor que não acende nenhum LED normalmente tem problema no adaptador externo, na fonte interna ou no estágio de alimentação da placa. Esses três casos têm reparo viável em bancada e reparo em nível de componente, sem troca do aparelho. O primeiro passo é gratuito e você mesmo pode fazer: teste outra tomada e, se o monitor usa fonte externa, teste outro adaptador compatível. Muita gente descobre assim que o defeito está no carregador, não no monitor."
      },
      {
        "question": "A tela está preta mas o LED acende. O que é?",
        "answer": "São dois cenários distintos e a bancada separa um do outro. Se ao apontar uma lanterna bem próxima da tela você consegue enxergar a imagem fraca, a imagem está sendo gerada normalmente e o que falhou foi a iluminação: driver de backlight ou barra de LED. Se não aparece nada nem com a lanterna, a suspeita passa para a placa lógica ou para o estágio de entrada de vídeo. O teste da lanterna é o primeiro que fazemos no recebimento, porque muda todo o caminho do diagnóstico."
      },
      {
        "question": "Vocês trocam painel de monitor trincado?",
        "answer": "Não. Essa é uma recusa declarada antes da coleta e ela vale para trinca, mancha de pressão, marca de impacto e infiltração no painel. O motivo é econômico e não técnico: o painel é a peça mais cara do conjunto e, na maior parte dos modelos, custa próximo ou acima do valor de um monitor novo equivalente. Preferimos dizer isso na triagem a coletar o aparelho, cobrar avaliação e devolver com a mesma resposta. Falhas eletrônicas e de alimentação, ao contrário, costumam ter boa viabilidade de reparo."
      },
      {
        "question": "Monitor gamer de alta taxa de atualização tem atendimento?",
        "answer": "Sim, para as mesmas falhas de qualquer outro monitor: alimentação, fonte externa, backlight, conector de vídeo e placa. O que não fazemos é prometer validação de desempenho. Não temos bancada dedicada para certificar taxa de atualização máxima, tempo de resposta, faixa de cor ampliada ou sincronização adaptativa, então não anunciamos esses itens como resultado do reparo. Testamos o monitor funcionando em duas entradas de vídeo, de forma estável, e é isso que declaramos no laudo."
      },
      {
        "question": "Qual é a garantia do conserto de monitor?",
        "answer": "90 dias sobre a mão de obra e sobre o ponto reparado, contados da entrega. A cobertura é do defeito tratado e do componente que substituímos. Não estão cobertos: defeito novo em outro estágio do aparelho, dano por surto ou oscilação elétrica posterior, queda, infiltração, uso em tensão incorreta, intervenção de terceiros depois da nossa entrega e o painel, que não é peça reparada por nós. Quando o monitor chega com histórico de líquido ou de reparo anterior, a cobertura é registrada de forma ainda mais delimitada no laudo."
      },
      {
        "question": "Compensa consertar ou é melhor comprar outro?",
        "answer": "É a pergunta que a avaliação responde, e nem sempre a resposta favorece o reparo. Pesamos o valor do serviço, o valor de um monitor equivalente novo, a idade do aparelho, o tamanho e o estado geral. Em monitores pequenos e antigos, muito fora de garantia, o reparo frequentemente não compensa e dizemos isso. Já em monitores maiores, ultrawide, curvos ou de uso profissional, uma falha de fonte costuma ser bem mais barata de resolver do que substituir o conjunto."
      },
      {
        "question": "Como funciona a coleta do monitor?",
        "answer": "Pela logística de coleta e entrega, nas faixas de distância publicadas: até 8 km, de 8 a 15 km e de 15 a 30 km, o que inclui Curitiba e cidades vizinhas como São José dos Pinhais, Pinhais, Colombo, Araucária e Campo Largo. No recebimento registramos marca, modelo, número de série, estado do painel com foto, base ou pedestal, cabo e fonte. Esse registro protege os dois lados em caso de dúvida sobre avaria de transporte, e é por isso que ele é obrigatório."
      },
      {
        "question": "Preciso enviar a base e os cabos junto?",
        "answer": "A fonte externa sim, sempre, porque em muitos casos o defeito está nela e não no monitor. A base ou pedestal ajuda no teste final, já que o aparelho precisa ficar em pé e ligado por um período contínuo. O cabo de vídeo é opcional: temos cabos de bancada para o teste, mas se o seu cabo é parte da suspeita, envie junto para que possamos descartá-lo. Monitor ultrawide, curvo ou acima de 32 polegadas exige embalagem extra, e orientamos isso na triagem."
      },
      {
        "question": "E se o problema não estiver no monitor?",
        "answer": "Acontece com frequência e faz parte do trabalho identificar isso. Cabo com mau contato, entrada de vídeo do computador com defeito, placa de vídeo com falha, adaptador de sinal incompatível e configuração errada de resolução produzem sintomas que parecem defeito de monitor. Quando o aparelho passa nos testes de bancada sem apresentar falha, você recebe o laudo dizendo isso, com o que foi testado, e a orientação de onde procurar a causa real no lado do computador."
      },
      {
        "question": "O monitor é só a placa. Vocês recebem placa avulsa?",
        "answer": "Recebemos, mas nesse caso o atendimento correto é o de reparo de placa eletrônica e não este. A diferença é prática: sem o monitor completo não conseguimos validar o resultado em condição real de uso, com o painel ligado e a iluminação funcionando. Testamos a placa dentro do que o circuito permite em bancada e o teste final fica por sua conta na remontagem. Sempre que possível, envie o monitor inteiro — o laudo fica muito mais conclusivo."
      },
      {
        "question": "Como vocês sabem que o problema é do painel e não da eletrônica?",
        "answer": "Pela sequência de testes do recebimento, e ela é sempre a mesma. Primeiro medimos a alimentação: se não há tensão estável nas linhas, a causa é elétrica e o painel nem entra na conta. Havendo alimentação, verificamos se existe imagem sendo gerada — o teste da lanterna e a leitura dos sinais de vídeo respondem isso. Imagem presente sem iluminação aponta para backlight, que é reparável. Ausência total de sinal com alimentação correta aponta para placa lógica, também reparável. Painel entra como causa apenas quando há dano físico visível (trinca, mancha de pressão, infiltração) ou quando as linhas verticais e horizontais permanecem com a placa e o cabo já descartados. Esse encadeamento é registrado no laudo para você conferir."
      },
      {
        "question": "Mancha, linha vertical ou pixel queimado tem conserto?",
        "answer": "Na prática, não. Mancha escura, mancha clara em forma de nuvem, linha vertical ou horizontal fixa, faixa colorida permanente e pixel travado são falhas do próprio painel ou do circuito integrado colado nele. Não há reparo em bancada com resultado confiável para esses casos: o que existe no mercado são procedimentos improvisados de aquecimento e pressão que dão resultado temporário e voltam. Não fazemos isso e não cobramos por tentativa. Quando o sintoma é claramente de painel, dizemos na triagem para você não pagar coleta."
      },
      {
        "question": "Existe risco de danificar o monitor durante o conserto?",
        "answer": "Existe, e ele é declarado antes da coleta. Abrir um monitor envolve soltar clipes plásticos que endurecem com o tempo, manipular o cabo plano que liga a placa ao painel e movimentar o conjunto óptico. Em aparelhos antigos, plástico quebradiço pode trincar na abertura, e em alguns modelos o painel é acessível apenas por um caminho que exige manuseio direto. Trabalhamos com o aparelho apoiado, ferramenta apropriada e registro fotográfico de entrada, e você recebe aviso quando o modelo é de risco maior. O que não fazemos é prometer risco zero em equipamento que já chega com defeito."
      },
      {
        "question": "O monitor pegou raio ou queda de energia. Muda alguma coisa?",
        "answer": "Muda bastante. Surto elétrico raramente danifica um único ponto: normalmente atinge o estágio de entrada, pode alcançar o conversor de tensão e às vezes chega à placa lógica. Reparamos o que está no caminho identificado, mas alertamos que dano por surto costuma deixar componentes marginalmente comprometidos, que falham semanas depois. Por isso a garantia nesses casos cobre o ponto reparado e não o aparelho como um todo, e isso fica escrito no laudo. Se você tem outros equipamentos na mesma tomada, vale revisar o aterramento e o protetor antes da devolução."
      },
      {
        "question": "Posso usar o monitor com uma fonte genérica enquanto isso?",
        "answer": "Não recomendamos. Fonte com tensão correta mas corrente insuficiente faz o monitor ligar e desligar em ciclo, e fonte com polaridade ou tensão errada danifica o estágio de entrada de forma imediata e irreversível. Boa parte dos monitores que chegam com placa queimada passou por isso. Se a suspeita é da fonte, envie a original junto na coleta: testamos as duas e informamos qual peça precisa ser substituída."
      },
      {
        "question": "Qual é o prazo típico do conserto de monitor?",
        "answer": "A avaliação em bancada fica pronta em até 2 dias úteis depois do recebimento, e você recebe o laudo com o valor antes de qualquer reparo. Aprovado o serviço, o caso mais comum — fonte, alimentação ou backlight com componente de linha — costuma ser concluído em 2 a 5 dias úteis. Reparo em placa lógica com necessidade de peça específica pode chegar a 10 dias úteis, dependendo do fornecimento. A coleta e a entrega entram além desse prazo, conforme a faixa de distância. Quando qualquer etapa atrasa, avisamos com o motivo em vez de deixar você perguntando."
      },
      {
        "question": "E se depois da avaliação eu não quiser fazer o conserto?",
        "answer": "Você paga apenas a avaliação e a logística, e o monitor volta montado, com todas as peças e no mesmo estado em que chegou. Não fazemos retenção de equipamento e não desmontamos aparelho recusado para aproveitamento de peça. O laudo é seu e traz o que foi medido, o que foi encontrado e por que recomendamos ou não o reparo — inclusive quando a nossa recomendação é a de não consertar."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="conserto-monitor" />,
});
