import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaNotebookTelaPreta from "@/pages/problemas/NotebookComTelaPreta";

export const Route = createFileRoute("/problemas/notebook-com-tela-preta")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/notebook-com-tela-preta",
    "title": "Notebook com Tela Preta mas Ligado: O Que Fazer | Curitiba",
    "description": "Notebook liga, ventoinha gira e teclado acende, mas a tela fica preta? Entenda como separar iluminação da tela, cabo interno, vídeo da placa e sistema travado.",
    "faq": [
      {
        "question": "Meu notebook liga mas a tela fica preta. É a tela ou a placa?",
        "answer": "O teste do monitor externo responde isso em menos de um minuto. Se a imagem aparece no monitor conectado, o computador está processando normalmente e o defeito está no conjunto de tela, no cabo interno ou no circuito que ilumina o painel. Se nem o monitor externo mostra imagem, a investigação se desloca para memória, vídeo e circuitos de alimentação da placa. São dois caminhos com custo e prazo bem diferentes, por isso esse teste vem antes de qualquer valor fechado."
      },
      {
        "question": "Consigo ver a imagem bem fraquinha com a lanterna. O que isso significa?",
        "answer": "Significa que o vídeo está sendo gerado e enviado à tela, mas a iluminação do painel não está acendendo. Na prática, é uma boa notícia: o circuito de iluminação e seu cabo são a parte reparável da história, e o painel costuma estar íntegro. A avaliação em bancada confirma se falta alimentação, se o problema está no conversor ou se o cabo interno rompeu na dobradiça."
      },
      {
        "question": "A tela ficou preta depois de uma atualização do Windows. Tem conserto sem trocar peça?",
        "answer": "Na maior parte desses casos, sim. Atualização que instala driver de vídeo incompatível deixa o sistema rodando sem exibir imagem, e a correção é feita por inicialização em modo de segurança com reversão do driver. Nenhuma peça é envolvida. Como o sintoma é idêntico ao de uma falha física, verificamos o hardware antes de concluir que a origem era só de software."
      },
      {
        "question": "Vale a pena consertar ou é melhor trocar o notebook?",
        "answer": "Usamos um critério objetivo: quando o custo do reparo se aproxima do valor de um aparelho equivalente, não indicamos o serviço. Cabo interno, conector e circuito de iluminação costumam ficar bem abaixo desse limite. Painel danificado por impacto e placa com dano extenso são os cenários que mais se aproximam dele. Damos a orientação com o número na mão, mesmo quando ela significa não fazer o serviço."
      },
      {
        "question": "A imagem volta quando eu mexo na tampa. Posso continuar usando assim?",
        "answer": "Pode, mas o quadro tende a piorar. Imagem que aparece e some conforme o ângulo indica cabo interno com trilha em processo de rompimento na passagem pela dobradiça. Cada abertura acelera o desgaste, e o estágio final é a tela que não volta mais. Avaliar enquanto o defeito ainda é intermitente costuma resultar em serviço mais simples e mais barato."
      },
      {
        "question": "Preciso levar o notebook até vocês?",
        "answer": "Não. Não temos balcão de atendimento ao público. O atendimento começa pelo WhatsApp, com a descrição do sintoma e o resultado do teste do monitor externo. Se o caso seguir para bancada, retiramos o aparelho no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado por você."
      },
      {
        "question": "Vocês conseguem preservar meus arquivos?",
        "answer": "O procedimento padrão é trabalhar preservando o conteúdo do disco, e qualquer intervenção que exija formatação é comunicada e aprovada antes. Quando o disco também apresenta falha, o trabalho é feito sobre cópia, sem gravar no dispositivo original. Não prometemos recuperação integral em mídia com dano físico — informamos o que é possível depois da avaliação."
      },
      {
        "question": "Qual a garantia desse tipo de reparo?",
        "answer": "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco em que atuamos. Reparo no conjunto de tela cobre o conjunto de tela; reparo na placa cobre o circuito tratado. Falha posterior em outro ponto é avaliada como caso novo. Queda, líquido e pressão sobre a tampa depois da entrega caracterizam dano novo e não estão cobertos."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaNotebookTelaPreta,
});
