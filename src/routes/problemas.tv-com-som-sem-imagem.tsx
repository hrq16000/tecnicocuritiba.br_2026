import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaTvComSomSemImagem from "@/pages/problemas/TvComSomSemImagem";

export const Route = createFileRoute("/problemas/tv-com-som-sem-imagem")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/tv-com-som-sem-imagem",
    "title": "TV com Som e Sem Imagem? Diagnóstico em Curitiba",
    "description": "Televisor com som normal e tela apagada: entenda a diferença entre falha de backlight, de placa de fonte e de painel, quais testes indicam cada caso e quando.",
    "faq": [
      {
        "question": "Som funcionando e tela apagada significa que a TV tem conserto?",
        "answer": "Na maior parte dos casos, sim. Quando o áudio sai normalmente e o aparelho responde ao controle, a placa principal está funcionando e o problema costuma estar na iluminação do painel ou na etapa que a alimenta — dois cenários reparáveis. A exceção relevante é o painel com dano físico interno, que não tem reparo viável. O teste da lanterna dá a primeira indicação, e o diagnóstico em bancada confirma."
      },
      {
        "question": "O que é o teste da lanterna e por que ele importa tanto?",
        "answer": "É apontar a lanterna do celular bem próximo da tela, em ambiente escuro, com o televisor ligado. Se aparecer uma imagem fraca do menu, a eletrônica está gerando vídeo e apenas a iluminação de fundo parou. Isso muda completamente a expectativa de custo e prazo, porque separa um reparo comum de um caso de painel. Vale registrar em foto ou vídeo e enviar junto da descrição."
      },
      {
        "question": "Trocar as barras de iluminação resolve de forma definitiva?",
        "answer": "Resolve quando a causa é desgaste da iluminação e o restante do circuito está íntegro. O ponto crítico é a especificação: barra de tensão ou corrente diferente da original volta a falhar em pouco tempo e ainda sobrecarrega a etapa de alimentação. Por isso trabalhamos com equivalência técnica verificada e teste de uniformidade de brilho antes de fechar o aparelho."
      },
      {
        "question": "Vocês consertam painel de televisor?",
        "answer": "Não. Painel trincado, com pressão interna ou com dano na estrutura ótica não tem reparo confiável fora da fábrica, e qualquer promessa nesse sentido é conversa de venda. Nesses casos emitimos laudo com foto do dano e explicamos por que não iniciamos o serviço. Você decide o que fazer com a informação, sem ter pagado por uma tentativa sem chance real."
      },
      {
        "question": "Como funciona o atendimento se eu não posso levar o aparelho?",
        "answer": "Não existe atendimento presencial em balcão: trabalhamos com coleta e entrega no endereço informado. O contato começa pelo WhatsApp, com marca, modelo e descrição do comportamento. A partir daí combinamos a coleta, o aparelho é avaliado em bancada e o retorno vem com diagnóstico, valor fechado e prazo antes de qualquer intervenção."
      },
      {
        "question": "Quanto custa descobrir o que a televisão tem?",
        "answer": "O diagnóstico em bancada tem valor informado antes da coleta e é abatido quando o reparo é aprovado. Nenhum serviço começa sem aprovação explícita do valor fechado. Se a avaliação apontar que o conserto não compensa diante do valor do aparelho, você recebe essa conclusão de forma direta, com o motivo técnico."
      },
      {
        "question": "Qual é a garantia do reparo de televisor?",
        "answer": "90 dias sobre a mão de obra e sobre os componentes que substituímos, contados da entrega. A garantia é escopada ao que foi reparado: ela não cobre falha em outro bloco do aparelho que estava íntegro na saída, dano por surto elétrico posterior, queda, líquido nem intervenção feita por terceiros depois da devolução."
      },
      {
        "question": "Vale a pena consertar ou é melhor comprar outra?",
        "answer": "A conta que usamos é simples e dita em voz alta: reparo que se aproxima do valor de um aparelho equivalente novo raramente compensa. Televisores maiores e mais recentes normalmente compensam o reparo de iluminação ou de alimentação; modelos pequenos e antigos frequentemente não. Damos essa leitura junto do orçamento, inclusive quando ela significa perder o serviço."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaTvComSomSemImagem,
});
