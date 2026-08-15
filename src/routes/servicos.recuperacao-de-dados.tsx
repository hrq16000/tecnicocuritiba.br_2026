import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/recuperacao-de-dados")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/recuperacao-de-dados",
    "title": "Recuperação de Dados em Curitiba | HD, SSD e Pendrive",
    "description": "Recuperação de dados em Curitiba de HD, SSD, pendrive e cartão. Exclusão acidental, sistema que não inicia e falhas. Avaliação primeiro — recuperação não é garantida.",
    "faq": [
      {
        "question": "A recuperação de dados é garantida?",
        "answer": "Não. Nenhum serviço sério garante resultado. Fazemos a avaliação, explicamos as chances reais do seu caso e trabalhamos para não piorar o estado do dispositivo. Quando não há perspectiva técnica, dizemos antes de executar qualquer tentativa."
      },
      {
        "question": "Apaguei arquivos, o que devo fazer agora?",
        "answer": "Pare de usar o dispositivo imediatamente e não instale programas de recuperação nele. Cada nova gravação pode sobrescrever justamente o que você quer de volta. Desligue, guarde e traga para avaliação o quanto antes."
      },
      {
        "question": "Meu HD faz barulho, tem solução?",
        "answer": "Ruído repetitivo costuma indicar falha física, que é o cenário mais delicado. Não insista em ligar e desligar: cada tentativa força um hardware já comprometido. A avaliação define se o caso é tratável aqui ou se exige ambiente de laboratório especializado."
      },
      {
        "question": "Recuperação em SSD é diferente de HD?",
        "answer": "Sim. O SSD gerencia os blocos internamente e descarta dados apagados de forma automática, o que reduz a janela de recuperação em comparação com o HD. Falha de controladora frequentemente encerra o caso. Preferimos explicar esse limite antes de qualquer tentativa."
      },
      {
        "question": "Vocês veem o conteúdo dos meus arquivos?",
        "answer": "O acesso é limitado ao necessário para confirmar integridade e organizar a entrega, sempre com sua autorização. Não copiamos, divulgamos nem utilizamos conteúdo pessoal, e o material recuperado é entregue em mídia combinada com você."
      },
      {
        "question": "Quanto tempo demora?",
        "answer": "Depende do tipo de falha, do tamanho da mídia e do estado do dispositivo. Casos lógicos simples costumam ser mais rápidos; mídias com dano físico exigem cópia cuidadosa e podem levar bem mais tempo. O prazo estimado é informado após a avaliação, não antes."
      },
      {
        "question": "Recuperação é a mesma coisa que backup?",
        "answer": "Não. Recuperação tenta resgatar dados já perdidos e não tem garantia. Backup é preventivo, feito antes de qualquer problema, e custa muito menos. Orientamos uma rotina de backup para você não depender de recuperação."
      },
      {
        "question": "Como evitar perder dados de novo?",
        "answer": "Mantenha cópia em mais de um lugar — disco externo e nuvem, por exemplo — e confira periodicamente se a cópia realmente abre. Também vale trocar o armazenamento quando ele já mostra sinal de desgaste, em vez de esperar a falha."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="recuperacao-de-dados" />,
});
