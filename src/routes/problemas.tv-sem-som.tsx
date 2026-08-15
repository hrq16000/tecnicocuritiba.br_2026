import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTvSemSom from "@/pages/problemas/TvSemSom";

export const Route = createFileRoute("/problemas/tv-sem-som")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-sem-som",
    "title": "TV Sem Som: Causas, Testes e Conserto | Curitiba",
    "description": "TV com imagem normal e sem áudio, som chiado ou saída de fone mudo? Veja como separar configuração de saída, falha do amplificador de áudio e alto-falante rompido antes de orçar, com avaliação por coleta em Curitiba.",
    "faq": [
      {
        "question": "Minha TV está com imagem e sem som. Isso tem conserto?",
        "answer": "Na maior parte dos casos, sim, e costuma ser um dos reparos mais viáveis do televisor. Falha de áudio raramente envolve o painel, que é a peça cara do aparelho. Ela se concentra no amplificador da placa principal ou nos alto-falantes, dois blocos que aceitam reparo pontual. Antes disso vale eliminar o gratuito: saída redirecionada para barra de som, Bluetooth pareado ou formato de áudio incompatível no aplicativo."
      },
      {
        "question": "Como sei se é configuração ou defeito de verdade?",
        "answer": "O teste decisivo é variar a fonte. Se o silêncio aparece na TV aberta, num HDMI e num aplicativo interno ao mesmo tempo, o problema é do televisor. Se só um deles fica mudo, a origem está no ajuste daquela entrada ou no aparelho conectado a ela. Forçar a saída para os alto-falantes internos no menu de som resolve uma parte real dos chamados sem qualquer custo."
      },
      {
        "question": "O som sai pelo fone e pela barra, mas não pelos alto-falantes. O que significa?",
        "answer": "Significa que a parte de processamento está funcionando e o sinal chega até a saída. O que falhou está entre o amplificador e os alto-falantes. É um cenário favorável: normalmente envolve componente do estágio de amplificação, conector solto ou alto-falante rompido, sem mexer em placa de painel nem em fonte."
      },
      {
        "question": "O som está chiado e distorcido. Posso continuar usando assim?",
        "answer": "Não recomendamos. Distorção significa que o sinal já está saindo fora de forma, e insistir em volume alto costuma terminar de romper a bobina do alto-falante. Um caso que seria de reparo de componente vira troca de alto-falante mais reparo, com custo maior. Baixar o volume e agendar a avaliação evita esse agravamento."
      },
      {
        "question": "Vocês trocam apenas o alto-falante?",
        "answer": "Quando a avaliação mostra alto-falante rompido e o restante do circuito íntegro, sim. O que não fazemos é adaptar alto-falante genérico com impedância diferente da original: isso força o amplificador e cria um defeito novo poucos meses depois. Se a peça correta não existir para o modelo, informamos e você decide com o número na mão."
      },
      {
        "question": "Preciso levar a TV até vocês?",
        "answer": "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das maiores causas de dano de painel, um problema muito mais caro que a falta de som. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "Qual a garantia do reparo de áudio?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo no circuito de áudio cobre o circuito de áudio. Falha posterior em fonte, painel ou placa principal é avaliada como caso novo. Descarga elétrica e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertas."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-sem-som",
    "title": "TV Sem Som: Causas, Testes e Conserto | Curitiba",
    "description": "TV com imagem normal e sem áudio, som chiado ou saída de fone mudo? Veja como separar configuração de saída, falha do amplificador de áudio e alto-falante rompido antes de orçar, com avaliação por coleta em Curitiba.",
    "faq": [
      {
        "question": "Minha TV está com imagem e sem som. Isso tem conserto?",
        "answer": "Na maior parte dos casos, sim, e costuma ser um dos reparos mais viáveis do televisor. Falha de áudio raramente envolve o painel, que é a peça cara do aparelho. Ela se concentra no amplificador da placa principal ou nos alto-falantes, dois blocos que aceitam reparo pontual. Antes disso vale eliminar o gratuito: saída redirecionada para barra de som, Bluetooth pareado ou formato de áudio incompatível no aplicativo."
      },
      {
        "question": "Como sei se é configuração ou defeito de verdade?",
        "answer": "O teste decisivo é variar a fonte. Se o silêncio aparece na TV aberta, num HDMI e num aplicativo interno ao mesmo tempo, o problema é do televisor. Se só um deles fica mudo, a origem está no ajuste daquela entrada ou no aparelho conectado a ela. Forçar a saída para os alto-falantes internos no menu de som resolve uma parte real dos chamados sem qualquer custo."
      },
      {
        "question": "O som sai pelo fone e pela barra, mas não pelos alto-falantes. O que significa?",
        "answer": "Significa que a parte de processamento está funcionando e o sinal chega até a saída. O que falhou está entre o amplificador e os alto-falantes. É um cenário favorável: normalmente envolve componente do estágio de amplificação, conector solto ou alto-falante rompido, sem mexer em placa de painel nem em fonte."
      },
      {
        "question": "O som está chiado e distorcido. Posso continuar usando assim?",
        "answer": "Não recomendamos. Distorção significa que o sinal já está saindo fora de forma, e insistir em volume alto costuma terminar de romper a bobina do alto-falante. Um caso que seria de reparo de componente vira troca de alto-falante mais reparo, com custo maior. Baixar o volume e agendar a avaliação evita esse agravamento."
      },
      {
        "question": "Vocês trocam apenas o alto-falante?",
        "answer": "Quando a avaliação mostra alto-falante rompido e o restante do circuito íntegro, sim. O que não fazemos é adaptar alto-falante genérico com impedância diferente da original: isso força o amplificador e cria um defeito novo poucos meses depois. Se a peça correta não existir para o modelo, informamos e você decide com o número na mão."
      },
      {
        "question": "Preciso levar a TV até vocês?",
        "answer": "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das maiores causas de dano de painel, um problema muito mais caro que a falta de som. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "Qual a garantia do reparo de áudio?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo no circuito de áudio cobre o circuito de áudio. Falha posterior em fonte, painel ou placa principal é avaliada como caso novo. Descarga elétrica e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertas."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-sem-som",
    "title": "TV Sem Som: Causas, Testes e Conserto | Curitiba",
    "description": "TV com imagem normal e sem áudio, som chiado ou saída de fone mudo? Veja como separar configuração de saída, falha do amplificador de áudio e alto-falante rompido antes de orçar, com avaliação por coleta em Curitiba.",
    "faq": [
      {
        "question": "Minha TV está com imagem e sem som. Isso tem conserto?",
        "answer": "Na maior parte dos casos, sim, e costuma ser um dos reparos mais viáveis do televisor. Falha de áudio raramente envolve o painel, que é a peça cara do aparelho. Ela se concentra no amplificador da placa principal ou nos alto-falantes, dois blocos que aceitam reparo pontual. Antes disso vale eliminar o gratuito: saída redirecionada para barra de som, Bluetooth pareado ou formato de áudio incompatível no aplicativo."
      },
      {
        "question": "Como sei se é configuração ou defeito de verdade?",
        "answer": "O teste decisivo é variar a fonte. Se o silêncio aparece na TV aberta, num HDMI e num aplicativo interno ao mesmo tempo, o problema é do televisor. Se só um deles fica mudo, a origem está no ajuste daquela entrada ou no aparelho conectado a ela. Forçar a saída para os alto-falantes internos no menu de som resolve uma parte real dos chamados sem qualquer custo."
      },
      {
        "question": "O som sai pelo fone e pela barra, mas não pelos alto-falantes. O que significa?",
        "answer": "Significa que a parte de processamento está funcionando e o sinal chega até a saída. O que falhou está entre o amplificador e os alto-falantes. É um cenário favorável: normalmente envolve componente do estágio de amplificação, conector solto ou alto-falante rompido, sem mexer em placa de painel nem em fonte."
      },
      {
        "question": "O som está chiado e distorcido. Posso continuar usando assim?",
        "answer": "Não recomendamos. Distorção significa que o sinal já está saindo fora de forma, e insistir em volume alto costuma terminar de romper a bobina do alto-falante. Um caso que seria de reparo de componente vira troca de alto-falante mais reparo, com custo maior. Baixar o volume e agendar a avaliação evita esse agravamento."
      },
      {
        "question": "Vocês trocam apenas o alto-falante?",
        "answer": "Quando a avaliação mostra alto-falante rompido e o restante do circuito íntegro, sim. O que não fazemos é adaptar alto-falante genérico com impedância diferente da original: isso força o amplificador e cria um defeito novo poucos meses depois. Se a peça correta não existir para o modelo, informamos e você decide com o número na mão."
      },
      {
        "question": "Preciso levar a TV até vocês?",
        "answer": "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das maiores causas de dano de painel, um problema muito mais caro que a falta de som. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "Qual a garantia do reparo de áudio?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo no circuito de áudio cobre o circuito de áudio. Falha posterior em fonte, painel ou placa principal é avaliada como caso novo. Descarga elétrica e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertas."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-sem-som",
    "title": "TV Sem Som: Causas, Testes e Conserto | Curitiba",
    "description": "TV com imagem normal e sem áudio, som chiado ou saída de fone mudo? Veja como separar configuração de saída, falha do amplificador de áudio e alto-falante rompido antes de orçar, com avaliação por coleta em Curitiba.",
    "faq": [
      {
        "question": "Minha TV está com imagem e sem som. Isso tem conserto?",
        "answer": "Na maior parte dos casos, sim, e costuma ser um dos reparos mais viáveis do televisor. Falha de áudio raramente envolve o painel, que é a peça cara do aparelho. Ela se concentra no amplificador da placa principal ou nos alto-falantes, dois blocos que aceitam reparo pontual. Antes disso vale eliminar o gratuito: saída redirecionada para barra de som, Bluetooth pareado ou formato de áudio incompatível no aplicativo."
      },
      {
        "question": "Como sei se é configuração ou defeito de verdade?",
        "answer": "O teste decisivo é variar a fonte. Se o silêncio aparece na TV aberta, num HDMI e num aplicativo interno ao mesmo tempo, o problema é do televisor. Se só um deles fica mudo, a origem está no ajuste daquela entrada ou no aparelho conectado a ela. Forçar a saída para os alto-falantes internos no menu de som resolve uma parte real dos chamados sem qualquer custo."
      },
      {
        "question": "O som sai pelo fone e pela barra, mas não pelos alto-falantes. O que significa?",
        "answer": "Significa que a parte de processamento está funcionando e o sinal chega até a saída. O que falhou está entre o amplificador e os alto-falantes. É um cenário favorável: normalmente envolve componente do estágio de amplificação, conector solto ou alto-falante rompido, sem mexer em placa de painel nem em fonte."
      },
      {
        "question": "O som está chiado e distorcido. Posso continuar usando assim?",
        "answer": "Não recomendamos. Distorção significa que o sinal já está saindo fora de forma, e insistir em volume alto costuma terminar de romper a bobina do alto-falante. Um caso que seria de reparo de componente vira troca de alto-falante mais reparo, com custo maior. Baixar o volume e agendar a avaliação evita esse agravamento."
      },
      {
        "question": "Vocês trocam apenas o alto-falante?",
        "answer": "Quando a avaliação mostra alto-falante rompido e o restante do circuito íntegro, sim. O que não fazemos é adaptar alto-falante genérico com impedância diferente da original: isso força o amplificador e cria um defeito novo poucos meses depois. Se a peça correta não existir para o modelo, informamos e você decide com o número na mão."
      },
      {
        "question": "Preciso levar a TV até vocês?",
        "answer": "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das maiores causas de dano de painel, um problema muito mais caro que a falta de som. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado."
      },
      {
        "question": "Qual a garantia do reparo de áudio?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo no circuito de áudio cobre o circuito de áudio. Falha posterior em fonte, painel ou placa principal é avaliada como caso novo. Descarga elétrica e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertas."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTvSemSom,
});
