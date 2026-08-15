import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTecladoNotebook from "@/pages/problemas/TecladoNotebookNaoFunciona";

export const Route = createFileRoute("/problemas/teclado-de-notebook-nao-funciona")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/teclado-de-notebook-nao-funciona",
    "title": "Teclado do Notebook Não Funciona: Causas e Troca | Curitiba",
    "description": "Teclas que não respondem, teclado morto ou digitando sozinho? Entenda quando é software, cabo flat, líquido ou placa, o que a troca resolve e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "Como saber se é o teclado ou o sistema?",
        "answer": "Dois testes resolvem quase sempre. O primeiro é ligar um teclado USB: se ele digita normalmente, o sistema está saudável e a falha está no teclado interno, no cabo flat ou no conector. O segundo é entrar na BIOS/Setup ao ligar o aparelho, um ambiente que roda antes do Windows — se o teclado também falha ali, está descartada qualquer hipótese de driver ou configuração."
      },
      {
        "question": "Dá para trocar só a tecla que parou?",
        "answer": "A tampa da tecla e o mecanismo de borracha podem ser recolocados quando apenas se soltaram. Mas se a falha é elétrica, o contato acontece em uma membrana de várias camadas que percorre o teclado inteiro: não existe reparo por tecla nessa camada, e a substituição é da peça completa. Por isso o diagnóstico separa antes o que é mecânico do que é de membrana."
      },
      {
        "question": "Derramei café no teclado e ele ainda funciona. Preciso levar?",
        "answer": "Sim, e quanto antes melhor. Bebidas com açúcar deixam resíduo condutivo que continua agindo depois de secar, causando teclas que grudam, caracteres repetidos e, no pior cenário, corrosão que atravessa o teclado e alcança a placa-mãe. Funcionar hoje não indica que passou: a oxidação é progressiva e o custo do reparo cresce junto com ela."
      },
      {
        "question": "Meu teclado digita letras trocadas. É defeito?",
        "answer": "Nem sempre. Layout configurado como US em teclado ABNT2 troca acentos, cedilha e símbolos, e isso se resolve na configuração de idioma em poucos minutos, sem nenhum reparo. Se a troca de caracteres for aleatória, com repetição de teclas que você não pressionou, aí sim o quadro aponta membrana com contato permanente, geralmente por resíduo."
      },
      {
        "question": "Quanto custa trocar o teclado de um notebook?",
        "answer": "Depende do modelo e da construção. Notebooks com teclado como peça independente têm troca mais simples e barata; modelos em que o teclado vem rebitado à carcaça superior exigem substituição do conjunto, com custo maior. Como a diferença é grande, informamos a faixa provável a partir do modelo e o valor fechado depois da inspeção, sempre com sua aprovação antes da execução."
      },
      {
        "question": "O teclado externo resolve por definitivo?",
        "answer": "Resolve como solução de contorno e é uma escolha legítima quando o notebook fica sempre na mesma mesa. Não recomendamos como definitivo em dois casos: quando houve líquido, porque o resíduo segue avançando por dentro, e quando a falha é do cabo flat na dobradiça, porque o rompimento pode alcançar outras vias que passam pelo mesmo caminho."
      },
      {
        "question": "Como o notebook chega até vocês?",
        "answer": "Por coleta no endereço informado — não temos balcão de atendimento ao público. Você aciona pelo WhatsApp descrevendo o sintoma, combinamos a retirada, a avaliação é feita em bancada e a devolução acontece no mesmo endereço, com o teclado testado tecla a tecla na sua frente no ato da entrega."
      },
      {
        "question": "Existe garantia?",
        "answer": "Sim, 90 dias sobre a mão de obra e sobre o teclado aplicado, limitados ao bloco reparado. Novo derramamento de líquido, queda ou pressão sobre a carcaça são danos novos e não estão cobertos. Em casos que envolveram líquido anterior, informamos antes que a oxidação já existente pode voltar a se manifestar, e isso fica registrado no laudo."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/teclado-de-notebook-nao-funciona",
    "title": "Teclado do Notebook Não Funciona: Causas e Troca | Curitiba",
    "description": "Teclas que não respondem, teclado morto ou digitando sozinho? Entenda quando é software, cabo flat, líquido ou placa, o que a troca resolve e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "Como saber se é o teclado ou o sistema?",
        "answer": "Dois testes resolvem quase sempre. O primeiro é ligar um teclado USB: se ele digita normalmente, o sistema está saudável e a falha está no teclado interno, no cabo flat ou no conector. O segundo é entrar na BIOS/Setup ao ligar o aparelho, um ambiente que roda antes do Windows — se o teclado também falha ali, está descartada qualquer hipótese de driver ou configuração."
      },
      {
        "question": "Dá para trocar só a tecla que parou?",
        "answer": "A tampa da tecla e o mecanismo de borracha podem ser recolocados quando apenas se soltaram. Mas se a falha é elétrica, o contato acontece em uma membrana de várias camadas que percorre o teclado inteiro: não existe reparo por tecla nessa camada, e a substituição é da peça completa. Por isso o diagnóstico separa antes o que é mecânico do que é de membrana."
      },
      {
        "question": "Derramei café no teclado e ele ainda funciona. Preciso levar?",
        "answer": "Sim, e quanto antes melhor. Bebidas com açúcar deixam resíduo condutivo que continua agindo depois de secar, causando teclas que grudam, caracteres repetidos e, no pior cenário, corrosão que atravessa o teclado e alcança a placa-mãe. Funcionar hoje não indica que passou: a oxidação é progressiva e o custo do reparo cresce junto com ela."
      },
      {
        "question": "Meu teclado digita letras trocadas. É defeito?",
        "answer": "Nem sempre. Layout configurado como US em teclado ABNT2 troca acentos, cedilha e símbolos, e isso se resolve na configuração de idioma em poucos minutos, sem nenhum reparo. Se a troca de caracteres for aleatória, com repetição de teclas que você não pressionou, aí sim o quadro aponta membrana com contato permanente, geralmente por resíduo."
      },
      {
        "question": "Quanto custa trocar o teclado de um notebook?",
        "answer": "Depende do modelo e da construção. Notebooks com teclado como peça independente têm troca mais simples e barata; modelos em que o teclado vem rebitado à carcaça superior exigem substituição do conjunto, com custo maior. Como a diferença é grande, informamos a faixa provável a partir do modelo e o valor fechado depois da inspeção, sempre com sua aprovação antes da execução."
      },
      {
        "question": "O teclado externo resolve por definitivo?",
        "answer": "Resolve como solução de contorno e é uma escolha legítima quando o notebook fica sempre na mesma mesa. Não recomendamos como definitivo em dois casos: quando houve líquido, porque o resíduo segue avançando por dentro, e quando a falha é do cabo flat na dobradiça, porque o rompimento pode alcançar outras vias que passam pelo mesmo caminho."
      },
      {
        "question": "Como o notebook chega até vocês?",
        "answer": "Por coleta no endereço informado — não temos balcão de atendimento ao público. Você aciona pelo WhatsApp descrevendo o sintoma, combinamos a retirada, a avaliação é feita em bancada e a devolução acontece no mesmo endereço, com o teclado testado tecla a tecla na sua frente no ato da entrega."
      },
      {
        "question": "Existe garantia?",
        "answer": "Sim, 90 dias sobre a mão de obra e sobre o teclado aplicado, limitados ao bloco reparado. Novo derramamento de líquido, queda ou pressão sobre a carcaça são danos novos e não estão cobertos. Em casos que envolveram líquido anterior, informamos antes que a oxidação já existente pode voltar a se manifestar, e isso fica registrado no laudo."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/teclado-de-notebook-nao-funciona",
    "title": "Teclado do Notebook Não Funciona: Causas e Troca | Curitiba",
    "description": "Teclas que não respondem, teclado morto ou digitando sozinho? Entenda quando é software, cabo flat, líquido ou placa, o que a troca resolve e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "Como saber se é o teclado ou o sistema?",
        "answer": "Dois testes resolvem quase sempre. O primeiro é ligar um teclado USB: se ele digita normalmente, o sistema está saudável e a falha está no teclado interno, no cabo flat ou no conector. O segundo é entrar na BIOS/Setup ao ligar o aparelho, um ambiente que roda antes do Windows — se o teclado também falha ali, está descartada qualquer hipótese de driver ou configuração."
      },
      {
        "question": "Dá para trocar só a tecla que parou?",
        "answer": "A tampa da tecla e o mecanismo de borracha podem ser recolocados quando apenas se soltaram. Mas se a falha é elétrica, o contato acontece em uma membrana de várias camadas que percorre o teclado inteiro: não existe reparo por tecla nessa camada, e a substituição é da peça completa. Por isso o diagnóstico separa antes o que é mecânico do que é de membrana."
      },
      {
        "question": "Derramei café no teclado e ele ainda funciona. Preciso levar?",
        "answer": "Sim, e quanto antes melhor. Bebidas com açúcar deixam resíduo condutivo que continua agindo depois de secar, causando teclas que grudam, caracteres repetidos e, no pior cenário, corrosão que atravessa o teclado e alcança a placa-mãe. Funcionar hoje não indica que passou: a oxidação é progressiva e o custo do reparo cresce junto com ela."
      },
      {
        "question": "Meu teclado digita letras trocadas. É defeito?",
        "answer": "Nem sempre. Layout configurado como US em teclado ABNT2 troca acentos, cedilha e símbolos, e isso se resolve na configuração de idioma em poucos minutos, sem nenhum reparo. Se a troca de caracteres for aleatória, com repetição de teclas que você não pressionou, aí sim o quadro aponta membrana com contato permanente, geralmente por resíduo."
      },
      {
        "question": "Quanto custa trocar o teclado de um notebook?",
        "answer": "Depende do modelo e da construção. Notebooks com teclado como peça independente têm troca mais simples e barata; modelos em que o teclado vem rebitado à carcaça superior exigem substituição do conjunto, com custo maior. Como a diferença é grande, informamos a faixa provável a partir do modelo e o valor fechado depois da inspeção, sempre com sua aprovação antes da execução."
      },
      {
        "question": "O teclado externo resolve por definitivo?",
        "answer": "Resolve como solução de contorno e é uma escolha legítima quando o notebook fica sempre na mesma mesa. Não recomendamos como definitivo em dois casos: quando houve líquido, porque o resíduo segue avançando por dentro, e quando a falha é do cabo flat na dobradiça, porque o rompimento pode alcançar outras vias que passam pelo mesmo caminho."
      },
      {
        "question": "Como o notebook chega até vocês?",
        "answer": "Por coleta no endereço informado — não temos balcão de atendimento ao público. Você aciona pelo WhatsApp descrevendo o sintoma, combinamos a retirada, a avaliação é feita em bancada e a devolução acontece no mesmo endereço, com o teclado testado tecla a tecla na sua frente no ato da entrega."
      },
      {
        "question": "Existe garantia?",
        "answer": "Sim, 90 dias sobre a mão de obra e sobre o teclado aplicado, limitados ao bloco reparado. Novo derramamento de líquido, queda ou pressão sobre a carcaça são danos novos e não estão cobertos. Em casos que envolveram líquido anterior, informamos antes que a oxidação já existente pode voltar a se manifestar, e isso fica registrado no laudo."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/teclado-de-notebook-nao-funciona",
    "title": "Teclado do Notebook Não Funciona: Causas e Troca | Curitiba",
    "description": "Teclas que não respondem, teclado morto ou digitando sozinho? Entenda quando é software, cabo flat, líquido ou placa, o que a troca resolve e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "Como saber se é o teclado ou o sistema?",
        "answer": "Dois testes resolvem quase sempre. O primeiro é ligar um teclado USB: se ele digita normalmente, o sistema está saudável e a falha está no teclado interno, no cabo flat ou no conector. O segundo é entrar na BIOS/Setup ao ligar o aparelho, um ambiente que roda antes do Windows — se o teclado também falha ali, está descartada qualquer hipótese de driver ou configuração."
      },
      {
        "question": "Dá para trocar só a tecla que parou?",
        "answer": "A tampa da tecla e o mecanismo de borracha podem ser recolocados quando apenas se soltaram. Mas se a falha é elétrica, o contato acontece em uma membrana de várias camadas que percorre o teclado inteiro: não existe reparo por tecla nessa camada, e a substituição é da peça completa. Por isso o diagnóstico separa antes o que é mecânico do que é de membrana."
      },
      {
        "question": "Derramei café no teclado e ele ainda funciona. Preciso levar?",
        "answer": "Sim, e quanto antes melhor. Bebidas com açúcar deixam resíduo condutivo que continua agindo depois de secar, causando teclas que grudam, caracteres repetidos e, no pior cenário, corrosão que atravessa o teclado e alcança a placa-mãe. Funcionar hoje não indica que passou: a oxidação é progressiva e o custo do reparo cresce junto com ela."
      },
      {
        "question": "Meu teclado digita letras trocadas. É defeito?",
        "answer": "Nem sempre. Layout configurado como US em teclado ABNT2 troca acentos, cedilha e símbolos, e isso se resolve na configuração de idioma em poucos minutos, sem nenhum reparo. Se a troca de caracteres for aleatória, com repetição de teclas que você não pressionou, aí sim o quadro aponta membrana com contato permanente, geralmente por resíduo."
      },
      {
        "question": "Quanto custa trocar o teclado de um notebook?",
        "answer": "Depende do modelo e da construção. Notebooks com teclado como peça independente têm troca mais simples e barata; modelos em que o teclado vem rebitado à carcaça superior exigem substituição do conjunto, com custo maior. Como a diferença é grande, informamos a faixa provável a partir do modelo e o valor fechado depois da inspeção, sempre com sua aprovação antes da execução."
      },
      {
        "question": "O teclado externo resolve por definitivo?",
        "answer": "Resolve como solução de contorno e é uma escolha legítima quando o notebook fica sempre na mesma mesa. Não recomendamos como definitivo em dois casos: quando houve líquido, porque o resíduo segue avançando por dentro, e quando a falha é do cabo flat na dobradiça, porque o rompimento pode alcançar outras vias que passam pelo mesmo caminho."
      },
      {
        "question": "Como o notebook chega até vocês?",
        "answer": "Por coleta no endereço informado — não temos balcão de atendimento ao público. Você aciona pelo WhatsApp descrevendo o sintoma, combinamos a retirada, a avaliação é feita em bancada e a devolução acontece no mesmo endereço, com o teclado testado tecla a tecla na sua frente no ato da entrega."
      },
      {
        "question": "Existe garantia?",
        "answer": "Sim, 90 dias sobre a mão de obra e sobre o teclado aplicado, limitados ao bloco reparado. Novo derramamento de líquido, queda ou pressão sobre a carcaça são danos novos e não estão cobertos. Em casos que envolveram líquido anterior, informamos antes que a oxidação já existente pode voltar a se manifestar, e isso fica registrado no laudo."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTecladoNotebook,
});
