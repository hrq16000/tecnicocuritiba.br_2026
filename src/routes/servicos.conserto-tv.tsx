import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/conserto-tv")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/conserto-tv",
    "title": "Conserto de TV e Smart TV em Curitiba | Bancada e Coleta",
    "description": "Conserto de TV LED, LCD e Smart TV em Curitiba: avaliação em bancada, reparo em nível de componente quando viável, coleta e entrega.",
    "faq": [
      {
        "question": "Vocês fazem visita para consertar TV?",
        "answer": "Não. Televisor exige bancada, instrumentos de medição e espaço de apoio para abrir o aparelho com segurança — nada disso é reproduzível na sala do cliente. Por isso o atendimento de TV é sempre por coleta, avaliação em laboratório e entrega. As condições e a taxa mínima estão publicadas na página de coleta e entrega e em preços e políticas."
      },
      {
        "question": "Como sei se vale a pena consertar minha TV?",
        "answer": "A resposta honesta só existe depois da avaliação com o aparelho aberto. Defeito de fonte ou de iluminação interna costuma ter reparo viável; painel trincado, com mancha de impacto ou com falha interna de linha normalmente não compensa, porque o painel é a parte mais cara do conjunto. Quando o reparo não compensa, dizemos isso e você decide — não empurramos serviço."
      },
      {
        "question": "TV com tela quebrada tem conserto?",
        "answer": "Na prática, não trabalhamos com troca de painel. Painel trincado, com marca de impacto ou com mancha interna é considerado fora de reparo aqui, porque o custo da peça e o risco de manuseio se aproximam ou ultrapassam o valor do aparelho. Você recebe essa informação na triagem, antes da coleta, para não pagar por uma avaliação previsível."
      },
      {
        "question": "O que é reparo em nível de componente?",
        "answer": "É trabalhar dentro da placa em vez de trocar a placa inteira. Medimos os estágios do circuito, identificamos o componente que falhou e substituímos apenas ele quando é viável e seguro. Nem todo defeito permite esse caminho: circuitos com componente indisponível, placa com dano extenso por corrosão ou por descarga elétrica, e módulos que só o fabricante fornece já montados seguem outra rota."
      },
      {
        "question": "A tela está escura mas o som funciona. O que costuma ser?",
        "answer": "Esse é o sintoma mais associado ao conjunto de iluminação interna ou ao circuito que o alimenta. Também pode envolver o comando do painel. A verificação é feita em bancada, com o aparelho aberto e medição direta — sem abrir, qualquer diagnóstico é chute. Só depois da medição informamos o que foi encontrado e qual o escopo do reparo."
      },
      {
        "question": "Vocês consertam Smart TV travada na tela da marca?",
        "answer": "Avaliamos. Travamento na inicialização pode vir de falha de alimentação, de memória interna ou da própria placa principal. O que não fazemos é modificação não oficial de software, instalação de firmware de origem duvidosa nem desbloqueio de recursos do aparelho. Trabalhamos com procedimentos suportados pelo fabricante ou com reparo eletrônico."
      },
      {
        "question": "Minha TV tomou raio. Ainda dá para avaliar?",
        "answer": "Dá para avaliar, com a ressalva de que descarga elétrica raramente atinge um ponto só. É comum encontrar fonte, placa principal e entradas comprometidas ao mesmo tempo. Nesses casos a avaliação define o quanto do conjunto foi afetado, e a decisão de seguir ou não depende da relação entre o escopo encontrado e o valor do aparelho."
      },
      {
        "question": "Existe garantia no conserto de TV?",
        "answer": "Sim: 90 dias sobre a mão de obra e sobre o reparo executado, contados da entrega. A garantia cobre o defeito tratado e o serviço realizado. Ficam fora dela outros defeitos que apareçam depois em pontos diferentes do aparelho, dano por nova oscilação elétrica, queda, infiltração, tentativa de reparo por terceiros e o painel, que não é peça reparada por nós."
      },
      {
        "question": "Vocês trabalham com peças originais?",
        "answer": "Trabalhamos com componentes adequados à especificação do circuito. Em linha de televisores, boa parte dos componentes eletrônicos é de mercado e não tem versão de marca do fabricante do aparelho. Quando o reparo depende de módulo específico, informamos a origem da peça e o valor antes de comprar — nada é adquirido sem a sua autorização."
      },
      {
        "question": "Quanto tempo demora?",
        "answer": "Não trabalhamos com promessa de prazo fixo. Depende do defeito encontrado, da necessidade de peça e da disponibilidade do componente no mercado. Depois da avaliação você recebe uma previsão realista para o seu caso específico, e qualquer mudança nessa previsão é comunicada."
      },
      {
        "question": "Posso levar a TV até vocês em vez de coletar?",
        "answer": "O fluxo padrão é a coleta, justamente porque o transporte de televisor tem risco: painel é sensível a pressão e a torção, e um aparelho mal apoiado no carro chega com dano novo. Se você preferir outro arranjo, trate isso na triagem pelo WhatsApp antes de mover o aparelho."
      },
      {
        "question": "Vocês consertam monitor de computador também?",
        "answer": "Monitor entra como categoria atendida na avaliação de equipamentos, com o mesmo critério de bancada e as mesmas limitações de painel. Não existe página nem processo separado: o encaminhamento é feito pela triagem, junto com as demais categorias de equipamentos atendidos."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="conserto-tv" />,
});
