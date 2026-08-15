import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ComoFunciona from "@/pages/ComoFunciona";

export const Route = createFileRoute("/como-funciona")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/como-funciona",
    "title": "Como Funciona o Atendimento Técnico em Curitiba",
    "description": "Entenda como funciona o atendimento técnico de informática em Curitiba e região. Passo a passo completo: solicitação via WhatsApp, diagnóstico, execução e garantia. Técnico a domicílio no mesmo dia.",
    "faq": [
      {
        "question": "Meus arquivos são copiados antes de formatar?",
        "answer": "Sim, sempre que o disco ainda permite leitura. A cópia de segurança é feita para mídia externa e conferida com você antes de qualquer serviço que apague dados, como formatação, reinstalação ou migração para SSD."
      },
      {
        "question": "Quanto tempo leva um backup durante o atendimento?",
        "answer": "Em disco saudável, normalmente no mesmo atendimento, variando com o volume de dados e a velocidade da mídia de destino. Discos com setores defeituosos exigem leitura em ritmo reduzido em bancada, com prazo informado depois da avaliação inicial."
      },
      {
        "question": "Existe garantia de recuperar todos os arquivos?",
        "answer": "Não. Em disco com falha física, arquivos sobrescritos ou dados criptografados por ransomware não há garantia de recuperação integral: o resultado depende do estado da mídia. Explicamos o cenário real antes de iniciar, sem prometer o que não pode ser assegurado."
      },
      {
        "question": "Vocês guardam cópias dos meus dados depois do serviço?",
        "answer": "Não. Cópias temporárias usadas no processo são apagadas na entrega, salvo pedido expresso seu de retenção por prazo definido. O acesso ao conteúdo se limita ao necessário para executar o serviço contratado."
      },
      {
        "question": "Quanto custa a visita técnica?",
        "answer": "Quando há visita ou diagnóstico presencial aplicável, a mão de obra começa a partir de R$ 99,99. O valor final depende da avaliação do problema e do tempo necessário. Consulte os detalhes em /precos-e-politicas."
      },
      {
        "question": "O valor pode mudar depois da avaliação?",
        "answer": "Sim, mas somente com sua aprovação prévia. Se durante o atendimento identificarmos algo que altere o escopo ou o valor, consultamos você antes de prosseguir. Nosso compromisso é transparência total — nenhum serviço adicional é executado sem sua autorização."
      },
      {
        "question": "Precisa pagar antes do atendimento?",
        "answer": "Não. O pagamento é feito após a conclusão do serviço. Aceitamos PIX (preferencial), dinheiro, cartão de crédito e débito. Para empresas com contrato, oferecemos pagamento faturado."
      },
      {
        "question": "Em quanto tempo conseguem atender?",
        "answer": "Na maioria dos casos, sim. Nosso objetivo é atender conforme a disponibilidade da agenda, dependendo da disponibilidade de agenda e da sua localização. Entre em contato via WhatsApp para verificar a disponibilidade."
      },
      {
        "question": "O serviço tem garantia?",
        "answer": "Sim. Todos os serviços possuem garantia por escrito de 90 dias em mão de obra sobre o ponto reparado ou o serviço executado. Peças possuem garantia do fabricante. Se algo der errado dentro do prazo, voltamos para resolver sem custo adicional."
      },
      {
        "question": "Faz atendimento remoto?",
        "answer": "Sim. Para problemas de software, configurações e muitos outros casos, realizamos atendimento remoto seguro. O técnico acessa seu computador de forma controlada e resolve o problema enquanto você acompanha em tempo real. É rápido, prático e mais econômico."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/como-funciona",
    "title": "Como Funciona o Atendimento Técnico em Curitiba",
    "description": "Entenda como funciona o atendimento técnico de informática em Curitiba e região. Passo a passo completo: solicitação via WhatsApp, diagnóstico, execução e garantia. Técnico a domicílio no mesmo dia.",
    "faq": [
      {
        "question": "Meus arquivos são copiados antes de formatar?",
        "answer": "Sim, sempre que o disco ainda permite leitura. A cópia de segurança é feita para mídia externa e conferida com você antes de qualquer serviço que apague dados, como formatação, reinstalação ou migração para SSD."
      },
      {
        "question": "Quanto tempo leva um backup durante o atendimento?",
        "answer": "Em disco saudável, normalmente no mesmo atendimento, variando com o volume de dados e a velocidade da mídia de destino. Discos com setores defeituosos exigem leitura em ritmo reduzido em bancada, com prazo informado depois da avaliação inicial."
      },
      {
        "question": "Existe garantia de recuperar todos os arquivos?",
        "answer": "Não. Em disco com falha física, arquivos sobrescritos ou dados criptografados por ransomware não há garantia de recuperação integral: o resultado depende do estado da mídia. Explicamos o cenário real antes de iniciar, sem prometer o que não pode ser assegurado."
      },
      {
        "question": "Vocês guardam cópias dos meus dados depois do serviço?",
        "answer": "Não. Cópias temporárias usadas no processo são apagadas na entrega, salvo pedido expresso seu de retenção por prazo definido. O acesso ao conteúdo se limita ao necessário para executar o serviço contratado."
      },
      {
        "question": "Quanto custa a visita técnica?",
        "answer": "Quando há visita ou diagnóstico presencial aplicável, a mão de obra começa a partir de R$ 99,99. O valor final depende da avaliação do problema e do tempo necessário. Consulte os detalhes em /precos-e-politicas."
      },
      {
        "question": "O valor pode mudar depois da avaliação?",
        "answer": "Sim, mas somente com sua aprovação prévia. Se durante o atendimento identificarmos algo que altere o escopo ou o valor, consultamos você antes de prosseguir. Nosso compromisso é transparência total — nenhum serviço adicional é executado sem sua autorização."
      },
      {
        "question": "Precisa pagar antes do atendimento?",
        "answer": "Não. O pagamento é feito após a conclusão do serviço. Aceitamos PIX (preferencial), dinheiro, cartão de crédito e débito. Para empresas com contrato, oferecemos pagamento faturado."
      },
      {
        "question": "Em quanto tempo conseguem atender?",
        "answer": "Na maioria dos casos, sim. Nosso objetivo é atender conforme a disponibilidade da agenda, dependendo da disponibilidade de agenda e da sua localização. Entre em contato via WhatsApp para verificar a disponibilidade."
      },
      {
        "question": "O serviço tem garantia?",
        "answer": "Sim. Todos os serviços possuem garantia por escrito de 90 dias em mão de obra sobre o ponto reparado ou o serviço executado. Peças possuem garantia do fabricante. Se algo der errado dentro do prazo, voltamos para resolver sem custo adicional."
      },
      {
        "question": "Faz atendimento remoto?",
        "answer": "Sim. Para problemas de software, configurações e muitos outros casos, realizamos atendimento remoto seguro. O técnico acessa seu computador de forma controlada e resolve o problema enquanto você acompanha em tempo real. É rápido, prático e mais econômico."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/como-funciona",
    "title": "Como Funciona o Atendimento Técnico em Curitiba",
    "description": "Entenda como funciona o atendimento técnico de informática em Curitiba e região. Passo a passo completo: solicitação via WhatsApp, diagnóstico, execução e garantia. Técnico a domicílio no mesmo dia.",
    "faq": [
      {
        "question": "Meus arquivos são copiados antes de formatar?",
        "answer": "Sim, sempre que o disco ainda permite leitura. A cópia de segurança é feita para mídia externa e conferida com você antes de qualquer serviço que apague dados, como formatação, reinstalação ou migração para SSD."
      },
      {
        "question": "Quanto tempo leva um backup durante o atendimento?",
        "answer": "Em disco saudável, normalmente no mesmo atendimento, variando com o volume de dados e a velocidade da mídia de destino. Discos com setores defeituosos exigem leitura em ritmo reduzido em bancada, com prazo informado depois da avaliação inicial."
      },
      {
        "question": "Existe garantia de recuperar todos os arquivos?",
        "answer": "Não. Em disco com falha física, arquivos sobrescritos ou dados criptografados por ransomware não há garantia de recuperação integral: o resultado depende do estado da mídia. Explicamos o cenário real antes de iniciar, sem prometer o que não pode ser assegurado."
      },
      {
        "question": "Vocês guardam cópias dos meus dados depois do serviço?",
        "answer": "Não. Cópias temporárias usadas no processo são apagadas na entrega, salvo pedido expresso seu de retenção por prazo definido. O acesso ao conteúdo se limita ao necessário para executar o serviço contratado."
      },
      {
        "question": "Quanto custa a visita técnica?",
        "answer": "Quando há visita ou diagnóstico presencial aplicável, a mão de obra começa a partir de R$ 99,99. O valor final depende da avaliação do problema e do tempo necessário. Consulte os detalhes em /precos-e-politicas."
      },
      {
        "question": "O valor pode mudar depois da avaliação?",
        "answer": "Sim, mas somente com sua aprovação prévia. Se durante o atendimento identificarmos algo que altere o escopo ou o valor, consultamos você antes de prosseguir. Nosso compromisso é transparência total — nenhum serviço adicional é executado sem sua autorização."
      },
      {
        "question": "Precisa pagar antes do atendimento?",
        "answer": "Não. O pagamento é feito após a conclusão do serviço. Aceitamos PIX (preferencial), dinheiro, cartão de crédito e débito. Para empresas com contrato, oferecemos pagamento faturado."
      },
      {
        "question": "Em quanto tempo conseguem atender?",
        "answer": "Na maioria dos casos, sim. Nosso objetivo é atender conforme a disponibilidade da agenda, dependendo da disponibilidade de agenda e da sua localização. Entre em contato via WhatsApp para verificar a disponibilidade."
      },
      {
        "question": "O serviço tem garantia?",
        "answer": "Sim. Todos os serviços possuem garantia por escrito de 90 dias em mão de obra sobre o ponto reparado ou o serviço executado. Peças possuem garantia do fabricante. Se algo der errado dentro do prazo, voltamos para resolver sem custo adicional."
      },
      {
        "question": "Faz atendimento remoto?",
        "answer": "Sim. Para problemas de software, configurações e muitos outros casos, realizamos atendimento remoto seguro. O técnico acessa seu computador de forma controlada e resolve o problema enquanto você acompanha em tempo real. É rápido, prático e mais econômico."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/como-funciona",
    "title": "Como Funciona o Atendimento Técnico em Curitiba",
    "description": "Entenda como funciona o atendimento técnico de informática em Curitiba e região. Passo a passo completo: solicitação via WhatsApp, diagnóstico, execução e garantia. Técnico a domicílio no mesmo dia.",
    "faq": [
      {
        "question": "Meus arquivos são copiados antes de formatar?",
        "answer": "Sim, sempre que o disco ainda permite leitura. A cópia de segurança é feita para mídia externa e conferida com você antes de qualquer serviço que apague dados, como formatação, reinstalação ou migração para SSD."
      },
      {
        "question": "Quanto tempo leva um backup durante o atendimento?",
        "answer": "Em disco saudável, normalmente no mesmo atendimento, variando com o volume de dados e a velocidade da mídia de destino. Discos com setores defeituosos exigem leitura em ritmo reduzido em bancada, com prazo informado depois da avaliação inicial."
      },
      {
        "question": "Existe garantia de recuperar todos os arquivos?",
        "answer": "Não. Em disco com falha física, arquivos sobrescritos ou dados criptografados por ransomware não há garantia de recuperação integral: o resultado depende do estado da mídia. Explicamos o cenário real antes de iniciar, sem prometer o que não pode ser assegurado."
      },
      {
        "question": "Vocês guardam cópias dos meus dados depois do serviço?",
        "answer": "Não. Cópias temporárias usadas no processo são apagadas na entrega, salvo pedido expresso seu de retenção por prazo definido. O acesso ao conteúdo se limita ao necessário para executar o serviço contratado."
      },
      {
        "question": "Quanto custa a visita técnica?",
        "answer": "Quando há visita ou diagnóstico presencial aplicável, a mão de obra começa a partir de R$ 99,99. O valor final depende da avaliação do problema e do tempo necessário. Consulte os detalhes em /precos-e-politicas."
      },
      {
        "question": "O valor pode mudar depois da avaliação?",
        "answer": "Sim, mas somente com sua aprovação prévia. Se durante o atendimento identificarmos algo que altere o escopo ou o valor, consultamos você antes de prosseguir. Nosso compromisso é transparência total — nenhum serviço adicional é executado sem sua autorização."
      },
      {
        "question": "Precisa pagar antes do atendimento?",
        "answer": "Não. O pagamento é feito após a conclusão do serviço. Aceitamos PIX (preferencial), dinheiro, cartão de crédito e débito. Para empresas com contrato, oferecemos pagamento faturado."
      },
      {
        "question": "Em quanto tempo conseguem atender?",
        "answer": "Na maioria dos casos, sim. Nosso objetivo é atender conforme a disponibilidade da agenda, dependendo da disponibilidade de agenda e da sua localização. Entre em contato via WhatsApp para verificar a disponibilidade."
      },
      {
        "question": "O serviço tem garantia?",
        "answer": "Sim. Todos os serviços possuem garantia por escrito de 90 dias em mão de obra sobre o ponto reparado ou o serviço executado. Peças possuem garantia do fabricante. Se algo der errado dentro do prazo, voltamos para resolver sem custo adicional."
      },
      {
        "question": "Faz atendimento remoto?",
        "answer": "Sim. Para problemas de software, configurações e muitos outros casos, realizamos atendimento remoto seguro. O técnico acessa seu computador de forma controlada e resolve o problema enquanto você acompanha em tempo real. É rápido, prático e mais econômico."
      }
    ]
  }),
  /* seo:auto-end */
  component: ComoFunciona,
});
