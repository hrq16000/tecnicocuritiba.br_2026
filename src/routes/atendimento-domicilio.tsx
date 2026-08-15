import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import AtendimentoDomicilio from "@/pages/AtendimentoDomicilio";

export const Route = createFileRoute("/atendimento-domicilio")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/atendimento-domicilio",
    "title": "Atendimento de Informática em Domicílio em Curitiba",
    "description": "Atendimento técnico de informática em domicílio em Curitiba: o que resolve no local, o que exige coleta ou bancada, preparação da visita, peças e fatores de valor.",
    "faq": [
      {
        "question": "Quais serviços podem ser feitos no local?",
        "answer": "Instalação e configuração de programas, ajustes de rede e Wi-Fi, remoção de vírus, backup, configuração de impressora e a maioria dos problemas de software costumam ser resolvidos na sua casa ou escritório. A confirmação depende da triagem prévia."
      },
      {
        "question": "Quando o equipamento precisa ser coletado?",
        "answer": "Casos que exigem bancada — como equipamento que não liga, reparo de placa, troca de tela ou recuperação de dados — normalmente não são resolvidos no local e seguem para coleta e entrega, com diagnóstico em laboratório."
      },
      {
        "question": "O atendimento em domicílio garante a resolução na hora?",
        "answer": "Nem sempre. O atendimento no local resolve boa parte dos casos de software, mas alguns problemas só são confirmados durante a avaliação e podem exigir peças, coleta ou tempo adicional."
      },
      {
        "question": "Como funciona a triagem antes da visita?",
        "answer": "Antes de agendar, conversamos pelo WhatsApp sobre o sintoma. Enviar informações e fotos do equipamento ajuda a avaliar se o caso é adequado para atendimento no local ou se será melhor por coleta."
      },
      {
        "question": "As peças estão incluídas na visita?",
        "answer": "Não automaticamente. A visita cobre a mão de obra e a avaliação; peças e materiais, quando necessários, são informados à parte e só trocados após a sua aprovação."
      },
      {
        "question": "Preciso desmontar ou preparar alguma coisa antes da visita?",
        "answer": "Não. Basta deixar o equipamento acessível e ligado à energia, com a senha de acesso à mão. Se o problema for de rede ou Wi-Fi, ter o acesso ao roteador (ou o contato da operadora) agiliza bastante o atendimento no local."
      },
      {
        "question": "Vocês atendem em apartamento, condomínio e escritório?",
        "answer": "Sim. Em condomínios e prédios comerciais com controle de acesso, o agendamento é combinado com antecedência para você liberar a entrada na portaria. Informe pelo WhatsApp se houver regra específica do prédio."
      },
      {
        "question": "O que acontece se o problema não for resolvido no local?",
        "answer": "A avaliação feita na visita é aproveitada: você recebe o diagnóstico do que foi encontrado e a orientação do próximo passo — coleta para bancada, valor do atendimento de peça ou indicação de substituição quando o reparo não compensa. Nada segue sem a sua aprovação."
      },
      {
        "question": "Qual a área de atendimento?",
        "answer": "Atendemos Curitiba e a Região Metropolitana. A localização pode influenciar o agendamento e o deslocamento, combinados antes da visita."
      },
      {
        "question": "É necessário levar o equipamento até vocês?",
        "answer": "Na modalidade em domicílio, não: o atendimento acontece no seu endereço. O equipamento só sai do local quando a avaliação indica bancada, e nesse caso a coleta é combinada com você antes."
      },
      {
        "question": "Posso solicitar atendimento para vários computadores?",
        "answer": "Sim. Informe na triagem a quantidade de equipamentos e o sintoma de cada um. Isso influencia o tempo previsto da visita e o escopo do atendimento, que é combinado antes do agendamento."
      },
      {
        "question": "É necessário ter alguém no local durante o atendimento?",
        "answer": "Sim. É preciso uma pessoa responsável presente para liberar o acesso, autorizar os procedimentos e conferir o resultado ao final. Em empresas, quem autoriza alterações deve estar disponível ao menos por contato."
      },
      {
        "question": "O técnico precisa acessar meus arquivos?",
        "answer": "Somente quando o serviço exige, como em backup, migração ou formatação. O acesso é limitado ao necessário e sempre com a sua autorização. As práticas completas estão descritas na página de segurança dos dados."
      },
      {
        "question": "Como funciona o cancelamento da visita?",
        "answer": "Avise pelo WhatsApp com a maior antecedência possível para reagendar sem transtorno. Cancelamento após o técnico já estar em deslocamento pode implicar cobrança do deslocamento, conforme as condições publicadas em preços e políticas."
      },
      {
        "question": "O valor pode mudar após a avaliação no local?",
        "answer": "O valor da visita e da avaliação é informado antes. Se a avaliação revelar um serviço maior, peça necessária ou necessidade de bancada, o novo escopo é apresentado e só é executado após a sua aprovação."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/atendimento-domicilio",
    "title": "Atendimento de Informática em Domicílio em Curitiba",
    "description": "Atendimento técnico de informática em domicílio em Curitiba: o que resolve no local, o que exige coleta ou bancada, preparação da visita, peças e fatores de valor.",
    "faq": [
      {
        "question": "Quais serviços podem ser feitos no local?",
        "answer": "Instalação e configuração de programas, ajustes de rede e Wi-Fi, remoção de vírus, backup, configuração de impressora e a maioria dos problemas de software costumam ser resolvidos na sua casa ou escritório. A confirmação depende da triagem prévia."
      },
      {
        "question": "Quando o equipamento precisa ser coletado?",
        "answer": "Casos que exigem bancada — como equipamento que não liga, reparo de placa, troca de tela ou recuperação de dados — normalmente não são resolvidos no local e seguem para coleta e entrega, com diagnóstico em laboratório."
      },
      {
        "question": "O atendimento em domicílio garante a resolução na hora?",
        "answer": "Nem sempre. O atendimento no local resolve boa parte dos casos de software, mas alguns problemas só são confirmados durante a avaliação e podem exigir peças, coleta ou tempo adicional."
      },
      {
        "question": "Como funciona a triagem antes da visita?",
        "answer": "Antes de agendar, conversamos pelo WhatsApp sobre o sintoma. Enviar informações e fotos do equipamento ajuda a avaliar se o caso é adequado para atendimento no local ou se será melhor por coleta."
      },
      {
        "question": "As peças estão incluídas na visita?",
        "answer": "Não automaticamente. A visita cobre a mão de obra e a avaliação; peças e materiais, quando necessários, são informados à parte e só trocados após a sua aprovação."
      },
      {
        "question": "Preciso desmontar ou preparar alguma coisa antes da visita?",
        "answer": "Não. Basta deixar o equipamento acessível e ligado à energia, com a senha de acesso à mão. Se o problema for de rede ou Wi-Fi, ter o acesso ao roteador (ou o contato da operadora) agiliza bastante o atendimento no local."
      },
      {
        "question": "Vocês atendem em apartamento, condomínio e escritório?",
        "answer": "Sim. Em condomínios e prédios comerciais com controle de acesso, o agendamento é combinado com antecedência para você liberar a entrada na portaria. Informe pelo WhatsApp se houver regra específica do prédio."
      },
      {
        "question": "O que acontece se o problema não for resolvido no local?",
        "answer": "A avaliação feita na visita é aproveitada: você recebe o diagnóstico do que foi encontrado e a orientação do próximo passo — coleta para bancada, valor do atendimento de peça ou indicação de substituição quando o reparo não compensa. Nada segue sem a sua aprovação."
      },
      {
        "question": "Qual a área de atendimento?",
        "answer": "Atendemos Curitiba e a Região Metropolitana. A localização pode influenciar o agendamento e o deslocamento, combinados antes da visita."
      },
      {
        "question": "É necessário levar o equipamento até vocês?",
        "answer": "Na modalidade em domicílio, não: o atendimento acontece no seu endereço. O equipamento só sai do local quando a avaliação indica bancada, e nesse caso a coleta é combinada com você antes."
      },
      {
        "question": "Posso solicitar atendimento para vários computadores?",
        "answer": "Sim. Informe na triagem a quantidade de equipamentos e o sintoma de cada um. Isso influencia o tempo previsto da visita e o escopo do atendimento, que é combinado antes do agendamento."
      },
      {
        "question": "É necessário ter alguém no local durante o atendimento?",
        "answer": "Sim. É preciso uma pessoa responsável presente para liberar o acesso, autorizar os procedimentos e conferir o resultado ao final. Em empresas, quem autoriza alterações deve estar disponível ao menos por contato."
      },
      {
        "question": "O técnico precisa acessar meus arquivos?",
        "answer": "Somente quando o serviço exige, como em backup, migração ou formatação. O acesso é limitado ao necessário e sempre com a sua autorização. As práticas completas estão descritas na página de segurança dos dados."
      },
      {
        "question": "Como funciona o cancelamento da visita?",
        "answer": "Avise pelo WhatsApp com a maior antecedência possível para reagendar sem transtorno. Cancelamento após o técnico já estar em deslocamento pode implicar cobrança do deslocamento, conforme as condições publicadas em preços e políticas."
      },
      {
        "question": "O valor pode mudar após a avaliação no local?",
        "answer": "O valor da visita e da avaliação é informado antes. Se a avaliação revelar um serviço maior, peça necessária ou necessidade de bancada, o novo escopo é apresentado e só é executado após a sua aprovação."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/atendimento-domicilio",
    "title": "Atendimento de Informática em Domicílio em Curitiba",
    "description": "Atendimento técnico de informática em domicílio em Curitiba: o que resolve no local, o que exige coleta ou bancada, preparação da visita, peças e fatores de valor.",
    "faq": [
      {
        "question": "Quais serviços podem ser feitos no local?",
        "answer": "Instalação e configuração de programas, ajustes de rede e Wi-Fi, remoção de vírus, backup, configuração de impressora e a maioria dos problemas de software costumam ser resolvidos na sua casa ou escritório. A confirmação depende da triagem prévia."
      },
      {
        "question": "Quando o equipamento precisa ser coletado?",
        "answer": "Casos que exigem bancada — como equipamento que não liga, reparo de placa, troca de tela ou recuperação de dados — normalmente não são resolvidos no local e seguem para coleta e entrega, com diagnóstico em laboratório."
      },
      {
        "question": "O atendimento em domicílio garante a resolução na hora?",
        "answer": "Nem sempre. O atendimento no local resolve boa parte dos casos de software, mas alguns problemas só são confirmados durante a avaliação e podem exigir peças, coleta ou tempo adicional."
      },
      {
        "question": "Como funciona a triagem antes da visita?",
        "answer": "Antes de agendar, conversamos pelo WhatsApp sobre o sintoma. Enviar informações e fotos do equipamento ajuda a avaliar se o caso é adequado para atendimento no local ou se será melhor por coleta."
      },
      {
        "question": "As peças estão incluídas na visita?",
        "answer": "Não automaticamente. A visita cobre a mão de obra e a avaliação; peças e materiais, quando necessários, são informados à parte e só trocados após a sua aprovação."
      },
      {
        "question": "Preciso desmontar ou preparar alguma coisa antes da visita?",
        "answer": "Não. Basta deixar o equipamento acessível e ligado à energia, com a senha de acesso à mão. Se o problema for de rede ou Wi-Fi, ter o acesso ao roteador (ou o contato da operadora) agiliza bastante o atendimento no local."
      },
      {
        "question": "Vocês atendem em apartamento, condomínio e escritório?",
        "answer": "Sim. Em condomínios e prédios comerciais com controle de acesso, o agendamento é combinado com antecedência para você liberar a entrada na portaria. Informe pelo WhatsApp se houver regra específica do prédio."
      },
      {
        "question": "O que acontece se o problema não for resolvido no local?",
        "answer": "A avaliação feita na visita é aproveitada: você recebe o diagnóstico do que foi encontrado e a orientação do próximo passo — coleta para bancada, valor do atendimento de peça ou indicação de substituição quando o reparo não compensa. Nada segue sem a sua aprovação."
      },
      {
        "question": "Qual a área de atendimento?",
        "answer": "Atendemos Curitiba e a Região Metropolitana. A localização pode influenciar o agendamento e o deslocamento, combinados antes da visita."
      },
      {
        "question": "É necessário levar o equipamento até vocês?",
        "answer": "Na modalidade em domicílio, não: o atendimento acontece no seu endereço. O equipamento só sai do local quando a avaliação indica bancada, e nesse caso a coleta é combinada com você antes."
      },
      {
        "question": "Posso solicitar atendimento para vários computadores?",
        "answer": "Sim. Informe na triagem a quantidade de equipamentos e o sintoma de cada um. Isso influencia o tempo previsto da visita e o escopo do atendimento, que é combinado antes do agendamento."
      },
      {
        "question": "É necessário ter alguém no local durante o atendimento?",
        "answer": "Sim. É preciso uma pessoa responsável presente para liberar o acesso, autorizar os procedimentos e conferir o resultado ao final. Em empresas, quem autoriza alterações deve estar disponível ao menos por contato."
      },
      {
        "question": "O técnico precisa acessar meus arquivos?",
        "answer": "Somente quando o serviço exige, como em backup, migração ou formatação. O acesso é limitado ao necessário e sempre com a sua autorização. As práticas completas estão descritas na página de segurança dos dados."
      },
      {
        "question": "Como funciona o cancelamento da visita?",
        "answer": "Avise pelo WhatsApp com a maior antecedência possível para reagendar sem transtorno. Cancelamento após o técnico já estar em deslocamento pode implicar cobrança do deslocamento, conforme as condições publicadas em preços e políticas."
      },
      {
        "question": "O valor pode mudar após a avaliação no local?",
        "answer": "O valor da visita e da avaliação é informado antes. Se a avaliação revelar um serviço maior, peça necessária ou necessidade de bancada, o novo escopo é apresentado e só é executado após a sua aprovação."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/atendimento-domicilio",
    "title": "Atendimento de Informática em Domicílio em Curitiba",
    "description": "Atendimento técnico de informática em domicílio em Curitiba: o que resolve no local, o que exige coleta ou bancada, preparação da visita, peças e fatores de valor.",
    "faq": [
      {
        "question": "Quais serviços podem ser feitos no local?",
        "answer": "Instalação e configuração de programas, ajustes de rede e Wi-Fi, remoção de vírus, backup, configuração de impressora e a maioria dos problemas de software costumam ser resolvidos na sua casa ou escritório. A confirmação depende da triagem prévia."
      },
      {
        "question": "Quando o equipamento precisa ser coletado?",
        "answer": "Casos que exigem bancada — como equipamento que não liga, reparo de placa, troca de tela ou recuperação de dados — normalmente não são resolvidos no local e seguem para coleta e entrega, com diagnóstico em laboratório."
      },
      {
        "question": "O atendimento em domicílio garante a resolução na hora?",
        "answer": "Nem sempre. O atendimento no local resolve boa parte dos casos de software, mas alguns problemas só são confirmados durante a avaliação e podem exigir peças, coleta ou tempo adicional."
      },
      {
        "question": "Como funciona a triagem antes da visita?",
        "answer": "Antes de agendar, conversamos pelo WhatsApp sobre o sintoma. Enviar informações e fotos do equipamento ajuda a avaliar se o caso é adequado para atendimento no local ou se será melhor por coleta."
      },
      {
        "question": "As peças estão incluídas na visita?",
        "answer": "Não automaticamente. A visita cobre a mão de obra e a avaliação; peças e materiais, quando necessários, são informados à parte e só trocados após a sua aprovação."
      },
      {
        "question": "Preciso desmontar ou preparar alguma coisa antes da visita?",
        "answer": "Não. Basta deixar o equipamento acessível e ligado à energia, com a senha de acesso à mão. Se o problema for de rede ou Wi-Fi, ter o acesso ao roteador (ou o contato da operadora) agiliza bastante o atendimento no local."
      },
      {
        "question": "Vocês atendem em apartamento, condomínio e escritório?",
        "answer": "Sim. Em condomínios e prédios comerciais com controle de acesso, o agendamento é combinado com antecedência para você liberar a entrada na portaria. Informe pelo WhatsApp se houver regra específica do prédio."
      },
      {
        "question": "O que acontece se o problema não for resolvido no local?",
        "answer": "A avaliação feita na visita é aproveitada: você recebe o diagnóstico do que foi encontrado e a orientação do próximo passo — coleta para bancada, valor do atendimento de peça ou indicação de substituição quando o reparo não compensa. Nada segue sem a sua aprovação."
      },
      {
        "question": "Qual a área de atendimento?",
        "answer": "Atendemos Curitiba e a Região Metropolitana. A localização pode influenciar o agendamento e o deslocamento, combinados antes da visita."
      },
      {
        "question": "É necessário levar o equipamento até vocês?",
        "answer": "Na modalidade em domicílio, não: o atendimento acontece no seu endereço. O equipamento só sai do local quando a avaliação indica bancada, e nesse caso a coleta é combinada com você antes."
      },
      {
        "question": "Posso solicitar atendimento para vários computadores?",
        "answer": "Sim. Informe na triagem a quantidade de equipamentos e o sintoma de cada um. Isso influencia o tempo previsto da visita e o escopo do atendimento, que é combinado antes do agendamento."
      },
      {
        "question": "É necessário ter alguém no local durante o atendimento?",
        "answer": "Sim. É preciso uma pessoa responsável presente para liberar o acesso, autorizar os procedimentos e conferir o resultado ao final. Em empresas, quem autoriza alterações deve estar disponível ao menos por contato."
      },
      {
        "question": "O técnico precisa acessar meus arquivos?",
        "answer": "Somente quando o serviço exige, como em backup, migração ou formatação. O acesso é limitado ao necessário e sempre com a sua autorização. As práticas completas estão descritas na página de segurança dos dados."
      },
      {
        "question": "Como funciona o cancelamento da visita?",
        "answer": "Avise pelo WhatsApp com a maior antecedência possível para reagendar sem transtorno. Cancelamento após o técnico já estar em deslocamento pode implicar cobrança do deslocamento, conforme as condições publicadas em preços e políticas."
      },
      {
        "question": "O valor pode mudar após a avaliação no local?",
        "answer": "O valor da visita e da avaliação é informado antes. Se a avaliação revelar um serviço maior, peça necessária ou necessidade de bancada, o novo escopo é apresentado e só é executado após a sua aprovação."
      }
    ]
  }),
  /* seo:auto-end */
  component: AtendimentoDomicilio,
});
