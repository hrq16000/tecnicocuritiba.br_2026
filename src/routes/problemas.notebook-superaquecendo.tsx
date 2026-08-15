import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaNotebookSuperaquecendo from "@/pages/problemas/NotebookSuperaquecendo";

export const Route = createFileRoute("/problemas/notebook-superaquecendo")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/notebook-superaquecendo",
    "title": "Notebook Superaquecendo? Diagnóstico Técnico em Curitiba",
    "description": "Notebook esquentando, com cooler acelerado ou desligando sozinho: entenda o que é temperatura normal, quais causas são de poeira, pasta térmica, uso ou falha elétrica, e o que fazer antes do atendimento.",
    "faq": [
      {
        "question": "Qual temperatura é considerada normal em um notebook?",
        "answer": "Não existe um número único: o limite depende do processador, do modelo e do tipo de uso. O que orienta a avaliação é o comportamento — se o equipamento sustenta o esforço sem perder desempenho, sem desligar e sem ruído anormal, a refrigeração está cumprindo o papel. Quando o desempenho cai progressivamente ou há desligamento, o limite está sendo atingido."
      },
      {
        "question": "Base de refrigeração resolve superaquecimento?",
        "answer": "Ajuda como paliativo, principalmente em uso prolongado sob carga, mas não corrige a causa. Se o dissipador está obstruído por poeira ou a pasta térmica está ressecada, o calor continua não sendo transferido para fora — a base apenas atenua o efeito percebido na superfície."
      },
      {
        "question": "De quanto em quanto tempo o notebook precisa de limpeza interna?",
        "answer": "Depende do ambiente e do uso. Equipamento em ambiente com poeira, animais ou uso diário intenso costuma pedir revisão mais cedo do que um usado poucas horas por semana em ambiente limpo. O sinal prático é o comportamento: cooler acelerando em tarefas leves e base mais quente que o habitual indicam que a revisão está atrasada."
      },
      {
        "question": "Superaquecimento pode danificar o notebook de forma permanente?",
        "answer": "Pode. O calor prolongado acelera o desgaste de componentes, resseca ainda mais a pasta térmica e afeta bateria e placa ao longo do tempo. O desligamento automático existe justamente para evitar dano imediato, mas conviver com ele por meses aumenta o risco de falha que já não se resolve com limpeza."
      },
      {
        "question": "Trocar a pasta térmica é arriscado?",
        "answer": "É um procedimento comum, mas exige desmontagem correta e dosagem adequada — excesso de pasta atrapalha em vez de ajudar, e parafusos apertados fora de ordem podem danificar a placa. Boa parte dos atendimentos de agravamento que recebemos vem de tentativa própria com tutorial genérico."
      },
      {
        "question": "Notebook desligando sozinho é sempre superaquecimento?",
        "answer": "Não. É a hipótese mais comum quando o desligamento acontece sob esforço e depois de alguns minutos, mas o mesmo comportamento aparece em bateria degradada, carregador inadequado e falha de alimentação na placa. O momento em que ocorre é o que separa os cenários, e essa informação é pedida já na triagem."
      },
      {
        "question": "Usar o notebook na cama estraga o equipamento?",
        "answer": "Não estraga de imediato, mas obstrui as entradas de ar da base e faz o sistema trabalhar acima do necessário. Como hábito diário, acelera o acúmulo de poeira no dissipador e antecipa a necessidade de limpeza interna. Superfície rígida e plana é a recomendação prática mais simples."
      },
      {
        "question": "Preciso trocar a bateria se ela estiver estufada?",
        "answer": "Bateria estufada não volta ao estado normal e representa risco físico, inclusive de deformar a carcaça e pressionar componentes internos. A orientação é interromper o uso e encaminhar para avaliação. A troca depende da disponibilidade de bateria compatível com o modelo e é aprovada por você antes da execução."
      },
      {
        "question": "Meus arquivos correm risco durante a limpeza interna?",
        "answer": "Limpeza interna, troca de pasta térmica e substituição de ventoinha não envolvem apagar dados. Quando a avaliação identifica que o disco também apresenta perda de saúde, isso é informado antes, e preservar os arquivos passa à frente de qualquer outra etapa."
      },
      {
        "question": "O valor pode ser informado antes do diagnóstico?",
        "answer": "Não com precisão. Modelos diferentes exigem desmontagens de complexidade bem distinta, e a necessidade de peça só é confirmada com o equipamento aberto. As condições comerciais vigentes estão publicadas na página de preços e políticas, e o valor do serviço é apresentado depois da avaliação, dependendo da sua autorização."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaNotebookSuperaquecendo,
});
