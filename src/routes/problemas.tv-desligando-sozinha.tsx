import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTvDesligando from "@/pages/problemas/TvDesligandoSozinha";

export const Route = createFileRoute("/problemas/tv-desligando-sozinha")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-desligando-sozinha",
    "title": "TV Desligando Sozinha: Causas e Conserto | Curitiba",
    "description": "Televisor que desliga sozinho, reinicia ou entra em ciclo de LED piscando? Entenda como separar capacitor de fonte, proteção térmica, ajuste de economia e placa principal, com avaliação por coleta em Curitiba.",
    "faq": [
      {
        "question": "Minha TV desliga sozinha depois de alguns minutos. O que costuma ser?",
        "answer": "O padrão mais comum é componente da fonte de alimentação que perde característica ao aquecer. Nos primeiros minutos tudo funciona; conforme a temperatura sobe, a tensão sai da faixa e o circuito de proteção desliga o aparelho para evitar dano maior. Antes de concluir isso, vale eliminar o óbvio: temporizador ativado no menu, modo de economia e aparelho externo com defeito derrubando a TV."
      },
      {
        "question": "A TV desliga e liga sozinha em ciclo. Isso danifica o aparelho?",
        "answer": "O ciclo em si é a proteção funcionando, então ele existe justamente para evitar dano. O que agrava o quadro é insistir: cada tentativa de partida submete a fonte a um pico de corrente que acelera a degradação de componentes já comprometidos. Se o aparelho entrou em ciclo, o melhor caminho é deixá-lo desligado da tomada até a avaliação."
      },
      {
        "question": "Pode ser só uma configuração do menu?",
        "answer": "Pode, e é a primeira coisa a verificar porque não custa nada. Temporizador de desligamento, modo de economia de energia e desligamento automático por ausência de sinal produzem exatamente o mesmo sintoma de uma falha de fonte. A diferença está na regularidade: configuração desliga sempre no mesmo intervalo, enquanto falha térmica varia conforme temperatura e tempo de uso."
      },
      {
        "question": "Vocês conseguem reparar sem trocar a placa inteira?",
        "answer": "Na maior parte dos casos, sim. Capacitor degradado e solda fadigada são tratados em nível de componente, com estação de retrabalho, o que custa uma fração da substituição do conjunto. Quando o dano se espalha por trilhas ou atinge circuitos integrados sem reposição disponível, o reparo pontual deixa de ser viável — e nesse caso informamos em vez de tentar."
      },
      {
        "question": "Vale a pena consertar ou é melhor comprar outra?",
        "answer": "O critério é objetivo: quando o custo do reparo se aproxima do valor de um televisor equivalente, não indicamos o serviço. Reparo de fonte costuma ficar bem abaixo desse limite e devolve anos de uso ao aparelho. Falha na placa principal de modelos com peça descontinuada é o cenário que mais se aproxima dele. Damos a orientação depois da avaliação, mesmo quando a resposta é não fazer."
      },
      {
        "question": "Preciso levar a TV até vocês?",
        "answer": "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das principais causas de dano de painel — um problema muito pior que o desligamento original. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "A imagem some mas o som continua. É o mesmo problema?",
        "answer": "Não. Se o som segue e o LED continua aceso, o televisor não desligou: é a iluminação da tela que parou de acender. O diagnóstico, o procedimento e o custo são outros, e esse quadro está descrito na página sobre TV com som e sem imagem. Descrever com precisão o que acontece com som e LED encurta bastante a triagem."
      },
      {
        "question": "Qual a garantia do reparo de fonte?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo na placa de alimentação cobre a placa de alimentação. Falha posterior em outro circuito é avaliada como caso novo. Descarga elétrica, raio e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertos pela garantia."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-desligando-sozinha",
    "title": "TV Desligando Sozinha: Causas e Conserto | Curitiba",
    "description": "Televisor que desliga sozinho, reinicia ou entra em ciclo de LED piscando? Entenda como separar capacitor de fonte, proteção térmica, ajuste de economia e placa principal, com avaliação por coleta em Curitiba.",
    "faq": [
      {
        "question": "Minha TV desliga sozinha depois de alguns minutos. O que costuma ser?",
        "answer": "O padrão mais comum é componente da fonte de alimentação que perde característica ao aquecer. Nos primeiros minutos tudo funciona; conforme a temperatura sobe, a tensão sai da faixa e o circuito de proteção desliga o aparelho para evitar dano maior. Antes de concluir isso, vale eliminar o óbvio: temporizador ativado no menu, modo de economia e aparelho externo com defeito derrubando a TV."
      },
      {
        "question": "A TV desliga e liga sozinha em ciclo. Isso danifica o aparelho?",
        "answer": "O ciclo em si é a proteção funcionando, então ele existe justamente para evitar dano. O que agrava o quadro é insistir: cada tentativa de partida submete a fonte a um pico de corrente que acelera a degradação de componentes já comprometidos. Se o aparelho entrou em ciclo, o melhor caminho é deixá-lo desligado da tomada até a avaliação."
      },
      {
        "question": "Pode ser só uma configuração do menu?",
        "answer": "Pode, e é a primeira coisa a verificar porque não custa nada. Temporizador de desligamento, modo de economia de energia e desligamento automático por ausência de sinal produzem exatamente o mesmo sintoma de uma falha de fonte. A diferença está na regularidade: configuração desliga sempre no mesmo intervalo, enquanto falha térmica varia conforme temperatura e tempo de uso."
      },
      {
        "question": "Vocês conseguem reparar sem trocar a placa inteira?",
        "answer": "Na maior parte dos casos, sim. Capacitor degradado e solda fadigada são tratados em nível de componente, com estação de retrabalho, o que custa uma fração da substituição do conjunto. Quando o dano se espalha por trilhas ou atinge circuitos integrados sem reposição disponível, o reparo pontual deixa de ser viável — e nesse caso informamos em vez de tentar."
      },
      {
        "question": "Vale a pena consertar ou é melhor comprar outra?",
        "answer": "O critério é objetivo: quando o custo do reparo se aproxima do valor de um televisor equivalente, não indicamos o serviço. Reparo de fonte costuma ficar bem abaixo desse limite e devolve anos de uso ao aparelho. Falha na placa principal de modelos com peça descontinuada é o cenário que mais se aproxima dele. Damos a orientação depois da avaliação, mesmo quando a resposta é não fazer."
      },
      {
        "question": "Preciso levar a TV até vocês?",
        "answer": "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das principais causas de dano de painel — um problema muito pior que o desligamento original. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "A imagem some mas o som continua. É o mesmo problema?",
        "answer": "Não. Se o som segue e o LED continua aceso, o televisor não desligou: é a iluminação da tela que parou de acender. O diagnóstico, o procedimento e o custo são outros, e esse quadro está descrito na página sobre TV com som e sem imagem. Descrever com precisão o que acontece com som e LED encurta bastante a triagem."
      },
      {
        "question": "Qual a garantia do reparo de fonte?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo na placa de alimentação cobre a placa de alimentação. Falha posterior em outro circuito é avaliada como caso novo. Descarga elétrica, raio e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertos pela garantia."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-desligando-sozinha",
    "title": "TV Desligando Sozinha: Causas e Conserto | Curitiba",
    "description": "Televisor que desliga sozinho, reinicia ou entra em ciclo de LED piscando? Entenda como separar capacitor de fonte, proteção térmica, ajuste de economia e placa principal, com avaliação por coleta em Curitiba.",
    "faq": [
      {
        "question": "Minha TV desliga sozinha depois de alguns minutos. O que costuma ser?",
        "answer": "O padrão mais comum é componente da fonte de alimentação que perde característica ao aquecer. Nos primeiros minutos tudo funciona; conforme a temperatura sobe, a tensão sai da faixa e o circuito de proteção desliga o aparelho para evitar dano maior. Antes de concluir isso, vale eliminar o óbvio: temporizador ativado no menu, modo de economia e aparelho externo com defeito derrubando a TV."
      },
      {
        "question": "A TV desliga e liga sozinha em ciclo. Isso danifica o aparelho?",
        "answer": "O ciclo em si é a proteção funcionando, então ele existe justamente para evitar dano. O que agrava o quadro é insistir: cada tentativa de partida submete a fonte a um pico de corrente que acelera a degradação de componentes já comprometidos. Se o aparelho entrou em ciclo, o melhor caminho é deixá-lo desligado da tomada até a avaliação."
      },
      {
        "question": "Pode ser só uma configuração do menu?",
        "answer": "Pode, e é a primeira coisa a verificar porque não custa nada. Temporizador de desligamento, modo de economia de energia e desligamento automático por ausência de sinal produzem exatamente o mesmo sintoma de uma falha de fonte. A diferença está na regularidade: configuração desliga sempre no mesmo intervalo, enquanto falha térmica varia conforme temperatura e tempo de uso."
      },
      {
        "question": "Vocês conseguem reparar sem trocar a placa inteira?",
        "answer": "Na maior parte dos casos, sim. Capacitor degradado e solda fadigada são tratados em nível de componente, com estação de retrabalho, o que custa uma fração da substituição do conjunto. Quando o dano se espalha por trilhas ou atinge circuitos integrados sem reposição disponível, o reparo pontual deixa de ser viável — e nesse caso informamos em vez de tentar."
      },
      {
        "question": "Vale a pena consertar ou é melhor comprar outra?",
        "answer": "O critério é objetivo: quando o custo do reparo se aproxima do valor de um televisor equivalente, não indicamos o serviço. Reparo de fonte costuma ficar bem abaixo desse limite e devolve anos de uso ao aparelho. Falha na placa principal de modelos com peça descontinuada é o cenário que mais se aproxima dele. Damos a orientação depois da avaliação, mesmo quando a resposta é não fazer."
      },
      {
        "question": "Preciso levar a TV até vocês?",
        "answer": "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das principais causas de dano de painel — um problema muito pior que o desligamento original. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "A imagem some mas o som continua. É o mesmo problema?",
        "answer": "Não. Se o som segue e o LED continua aceso, o televisor não desligou: é a iluminação da tela que parou de acender. O diagnóstico, o procedimento e o custo são outros, e esse quadro está descrito na página sobre TV com som e sem imagem. Descrever com precisão o que acontece com som e LED encurta bastante a triagem."
      },
      {
        "question": "Qual a garantia do reparo de fonte?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo na placa de alimentação cobre a placa de alimentação. Falha posterior em outro circuito é avaliada como caso novo. Descarga elétrica, raio e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertos pela garantia."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-desligando-sozinha",
    "title": "TV Desligando Sozinha: Causas e Conserto | Curitiba",
    "description": "Televisor que desliga sozinho, reinicia ou entra em ciclo de LED piscando? Entenda como separar capacitor de fonte, proteção térmica, ajuste de economia e placa principal, com avaliação por coleta em Curitiba.",
    "faq": [
      {
        "question": "Minha TV desliga sozinha depois de alguns minutos. O que costuma ser?",
        "answer": "O padrão mais comum é componente da fonte de alimentação que perde característica ao aquecer. Nos primeiros minutos tudo funciona; conforme a temperatura sobe, a tensão sai da faixa e o circuito de proteção desliga o aparelho para evitar dano maior. Antes de concluir isso, vale eliminar o óbvio: temporizador ativado no menu, modo de economia e aparelho externo com defeito derrubando a TV."
      },
      {
        "question": "A TV desliga e liga sozinha em ciclo. Isso danifica o aparelho?",
        "answer": "O ciclo em si é a proteção funcionando, então ele existe justamente para evitar dano. O que agrava o quadro é insistir: cada tentativa de partida submete a fonte a um pico de corrente que acelera a degradação de componentes já comprometidos. Se o aparelho entrou em ciclo, o melhor caminho é deixá-lo desligado da tomada até a avaliação."
      },
      {
        "question": "Pode ser só uma configuração do menu?",
        "answer": "Pode, e é a primeira coisa a verificar porque não custa nada. Temporizador de desligamento, modo de economia de energia e desligamento automático por ausência de sinal produzem exatamente o mesmo sintoma de uma falha de fonte. A diferença está na regularidade: configuração desliga sempre no mesmo intervalo, enquanto falha térmica varia conforme temperatura e tempo de uso."
      },
      {
        "question": "Vocês conseguem reparar sem trocar a placa inteira?",
        "answer": "Na maior parte dos casos, sim. Capacitor degradado e solda fadigada são tratados em nível de componente, com estação de retrabalho, o que custa uma fração da substituição do conjunto. Quando o dano se espalha por trilhas ou atinge circuitos integrados sem reposição disponível, o reparo pontual deixa de ser viável — e nesse caso informamos em vez de tentar."
      },
      {
        "question": "Vale a pena consertar ou é melhor comprar outra?",
        "answer": "O critério é objetivo: quando o custo do reparo se aproxima do valor de um televisor equivalente, não indicamos o serviço. Reparo de fonte costuma ficar bem abaixo desse limite e devolve anos de uso ao aparelho. Falha na placa principal de modelos com peça descontinuada é o cenário que mais se aproxima dele. Damos a orientação depois da avaliação, mesmo quando a resposta é não fazer."
      },
      {
        "question": "Preciso levar a TV até vocês?",
        "answer": "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das principais causas de dano de painel — um problema muito pior que o desligamento original. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "A imagem some mas o som continua. É o mesmo problema?",
        "answer": "Não. Se o som segue e o LED continua aceso, o televisor não desligou: é a iluminação da tela que parou de acender. O diagnóstico, o procedimento e o custo são outros, e esse quadro está descrito na página sobre TV com som e sem imagem. Descrever com precisão o que acontece com som e LED encurta bastante a triagem."
      },
      {
        "question": "Qual a garantia do reparo de fonte?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo na placa de alimentação cobre a placa de alimentação. Falha posterior em outro circuito é avaliada como caso novo. Descarga elétrica, raio e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertos pela garantia."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTvDesligando,
});
