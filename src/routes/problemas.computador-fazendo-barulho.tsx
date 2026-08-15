import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaComputadorBarulho from "@/pages/problemas/ComputadorFazendoBarulho";

export const Route = createFileRoute("/problemas/computador-fazendo-barulho")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/computador-fazendo-barulho",
    "title": "Computador Fazendo Barulho: Como Identificar a Origem | Curitiba",
    "description": "PC barulhento, ventoinha rugindo, estalo ou zumbido? Entenda como separar cooler, fonte, disco rígido e ruído elétrico antes de trocar peça, e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "Computador barulhento sempre significa defeito?",
        "answer": "Não. Um equipamento com refrigeração exigida por jogo ou edição de vídeo eleva a rotação naturalmente, e isso é o sistema funcionando. O que indica problema é a mudança de padrão: ficar alto em tarefa leve, apresentar ruído metálico, estalo ou clique, ou passar a rugir logo na inicialização. Quando o barulho muda de caráter e não só de volume, existe algo mecânico ou térmico por trás."
      },
      {
        "question": "Como sei se o barulho é da ventoinha ou do disco?",
        "answer": "O ruído de ventoinha é contínuo, varia com a carga e muda quando o cooler acelera. O de disco é ritmado, repetitivo e independe do esforço que a máquina está fazendo. Uma pista prática: em computador com SSD como unidade principal, ruído rítmico só pode vir de peça mecânica, o que reduz muito as possibilidades. Na dúvida, desligue — se o custo de errar for perder arquivos, a decisão prudente é não insistir."
      },
      {
        "question": "Limpar o computador resolve o ruído?",
        "answer": "Resolve em boa parte dos casos, quando a origem é poeira compactada no dissipador ou fluxo de ar obstruído. Mas limpeza não recupera rolamento gasto nem corrige pasta térmica ressecada — por isso a limpeza técnica em bancada inclui a reaplicação da pasta e o teste de temperatura sob carga depois de fechar. Se o ruído voltar em poucas semanas, a causa não era sujeira."
      },
      {
        "question": "Posso usar o computador enquanto ele faz barulho?",
        "answer": "Depende do ruído. Rugido por temperatura permite uso, ainda que com desgaste e perda de desempenho por redução automática de frequência. Chiado de rolamento também permite, mas caminha para o travamento da ventoinha, e cooler parado significa superaquecimento. Já clique de disco e estalo com cheiro de queimado pedem desligamento imediato: nesses dois casos, continuar usando aumenta o prejuízo."
      },
      {
        "question": "Quanto custa resolver ruído de computador?",
        "answer": "A faixa depende da origem. Limpeza técnica com troca de pasta é o cenário mais comum e mais acessível. Substituição de ventoinha soma a peça. Fonte e disco envolvem valores maiores, porque não são apenas conforto acústico: mexem em confiabilidade e em dados. O valor fechado sai depois da inspeção, com sua aprovação antes de qualquer execução — as condições estão publicadas na página de preços e políticas."
      },
      {
        "question": "Trocar por ventoinha maior deixa mais silencioso?",
        "answer": "Em geral sim, porque uma hélice maior move o mesmo volume de ar com menos rotação, e rotação é o que gera ruído. Mas só funciona quando o gabinete tem espaço e furação compatíveis e quando o problema real é térmico. Colocar cooler potente em máquina cheia de poeira apenas mascara a causa por algum tempo. Avaliamos a montagem antes de sugerir troca de peça."
      },
      {
        "question": "Vocês atendem em casa ou preciso levar o equipamento?",
        "answer": "Não temos balcão de atendimento ao público. O contato começa pelo WhatsApp, com a descrição do ruído, e o equipamento é retirado no endereço informado por coleta, sendo devolvido no mesmo endereço depois do serviço. Casos simples podem ser resolvidos em visita técnica, conforme a agenda; casos que exigem bancada seguem por coleta."
      },
      {
        "question": "Existe garantia no serviço de limpeza e troca de cooler?",
        "answer": "Sim, com escopo declarado: 90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco em que atuamos. Ruído que apareça em outro componente depois do atendimento é um caso novo e é tratado como tal, com avaliação própria. Não prometemos silêncio absoluto: informamos qual nível de ruído é esperado para o seu hardware antes de executar."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/computador-fazendo-barulho",
    "title": "Computador Fazendo Barulho: Como Identificar a Origem | Curitiba",
    "description": "PC barulhento, ventoinha rugindo, estalo ou zumbido? Entenda como separar cooler, fonte, disco rígido e ruído elétrico antes de trocar peça, e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "Computador barulhento sempre significa defeito?",
        "answer": "Não. Um equipamento com refrigeração exigida por jogo ou edição de vídeo eleva a rotação naturalmente, e isso é o sistema funcionando. O que indica problema é a mudança de padrão: ficar alto em tarefa leve, apresentar ruído metálico, estalo ou clique, ou passar a rugir logo na inicialização. Quando o barulho muda de caráter e não só de volume, existe algo mecânico ou térmico por trás."
      },
      {
        "question": "Como sei se o barulho é da ventoinha ou do disco?",
        "answer": "O ruído de ventoinha é contínuo, varia com a carga e muda quando o cooler acelera. O de disco é ritmado, repetitivo e independe do esforço que a máquina está fazendo. Uma pista prática: em computador com SSD como unidade principal, ruído rítmico só pode vir de peça mecânica, o que reduz muito as possibilidades. Na dúvida, desligue — se o custo de errar for perder arquivos, a decisão prudente é não insistir."
      },
      {
        "question": "Limpar o computador resolve o ruído?",
        "answer": "Resolve em boa parte dos casos, quando a origem é poeira compactada no dissipador ou fluxo de ar obstruído. Mas limpeza não recupera rolamento gasto nem corrige pasta térmica ressecada — por isso a limpeza técnica em bancada inclui a reaplicação da pasta e o teste de temperatura sob carga depois de fechar. Se o ruído voltar em poucas semanas, a causa não era sujeira."
      },
      {
        "question": "Posso usar o computador enquanto ele faz barulho?",
        "answer": "Depende do ruído. Rugido por temperatura permite uso, ainda que com desgaste e perda de desempenho por redução automática de frequência. Chiado de rolamento também permite, mas caminha para o travamento da ventoinha, e cooler parado significa superaquecimento. Já clique de disco e estalo com cheiro de queimado pedem desligamento imediato: nesses dois casos, continuar usando aumenta o prejuízo."
      },
      {
        "question": "Quanto custa resolver ruído de computador?",
        "answer": "A faixa depende da origem. Limpeza técnica com troca de pasta é o cenário mais comum e mais acessível. Substituição de ventoinha soma a peça. Fonte e disco envolvem valores maiores, porque não são apenas conforto acústico: mexem em confiabilidade e em dados. O valor fechado sai depois da inspeção, com sua aprovação antes de qualquer execução — as condições estão publicadas na página de preços e políticas."
      },
      {
        "question": "Trocar por ventoinha maior deixa mais silencioso?",
        "answer": "Em geral sim, porque uma hélice maior move o mesmo volume de ar com menos rotação, e rotação é o que gera ruído. Mas só funciona quando o gabinete tem espaço e furação compatíveis e quando o problema real é térmico. Colocar cooler potente em máquina cheia de poeira apenas mascara a causa por algum tempo. Avaliamos a montagem antes de sugerir troca de peça."
      },
      {
        "question": "Vocês atendem em casa ou preciso levar o equipamento?",
        "answer": "Não temos balcão de atendimento ao público. O contato começa pelo WhatsApp, com a descrição do ruído, e o equipamento é retirado no endereço informado por coleta, sendo devolvido no mesmo endereço depois do serviço. Casos simples podem ser resolvidos em visita técnica, conforme a agenda; casos que exigem bancada seguem por coleta."
      },
      {
        "question": "Existe garantia no serviço de limpeza e troca de cooler?",
        "answer": "Sim, com escopo declarado: 90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco em que atuamos. Ruído que apareça em outro componente depois do atendimento é um caso novo e é tratado como tal, com avaliação própria. Não prometemos silêncio absoluto: informamos qual nível de ruído é esperado para o seu hardware antes de executar."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/computador-fazendo-barulho",
    "title": "Computador Fazendo Barulho: Como Identificar a Origem | Curitiba",
    "description": "PC barulhento, ventoinha rugindo, estalo ou zumbido? Entenda como separar cooler, fonte, disco rígido e ruído elétrico antes de trocar peça, e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "Computador barulhento sempre significa defeito?",
        "answer": "Não. Um equipamento com refrigeração exigida por jogo ou edição de vídeo eleva a rotação naturalmente, e isso é o sistema funcionando. O que indica problema é a mudança de padrão: ficar alto em tarefa leve, apresentar ruído metálico, estalo ou clique, ou passar a rugir logo na inicialização. Quando o barulho muda de caráter e não só de volume, existe algo mecânico ou térmico por trás."
      },
      {
        "question": "Como sei se o barulho é da ventoinha ou do disco?",
        "answer": "O ruído de ventoinha é contínuo, varia com a carga e muda quando o cooler acelera. O de disco é ritmado, repetitivo e independe do esforço que a máquina está fazendo. Uma pista prática: em computador com SSD como unidade principal, ruído rítmico só pode vir de peça mecânica, o que reduz muito as possibilidades. Na dúvida, desligue — se o custo de errar for perder arquivos, a decisão prudente é não insistir."
      },
      {
        "question": "Limpar o computador resolve o ruído?",
        "answer": "Resolve em boa parte dos casos, quando a origem é poeira compactada no dissipador ou fluxo de ar obstruído. Mas limpeza não recupera rolamento gasto nem corrige pasta térmica ressecada — por isso a limpeza técnica em bancada inclui a reaplicação da pasta e o teste de temperatura sob carga depois de fechar. Se o ruído voltar em poucas semanas, a causa não era sujeira."
      },
      {
        "question": "Posso usar o computador enquanto ele faz barulho?",
        "answer": "Depende do ruído. Rugido por temperatura permite uso, ainda que com desgaste e perda de desempenho por redução automática de frequência. Chiado de rolamento também permite, mas caminha para o travamento da ventoinha, e cooler parado significa superaquecimento. Já clique de disco e estalo com cheiro de queimado pedem desligamento imediato: nesses dois casos, continuar usando aumenta o prejuízo."
      },
      {
        "question": "Quanto custa resolver ruído de computador?",
        "answer": "A faixa depende da origem. Limpeza técnica com troca de pasta é o cenário mais comum e mais acessível. Substituição de ventoinha soma a peça. Fonte e disco envolvem valores maiores, porque não são apenas conforto acústico: mexem em confiabilidade e em dados. O valor fechado sai depois da inspeção, com sua aprovação antes de qualquer execução — as condições estão publicadas na página de preços e políticas."
      },
      {
        "question": "Trocar por ventoinha maior deixa mais silencioso?",
        "answer": "Em geral sim, porque uma hélice maior move o mesmo volume de ar com menos rotação, e rotação é o que gera ruído. Mas só funciona quando o gabinete tem espaço e furação compatíveis e quando o problema real é térmico. Colocar cooler potente em máquina cheia de poeira apenas mascara a causa por algum tempo. Avaliamos a montagem antes de sugerir troca de peça."
      },
      {
        "question": "Vocês atendem em casa ou preciso levar o equipamento?",
        "answer": "Não temos balcão de atendimento ao público. O contato começa pelo WhatsApp, com a descrição do ruído, e o equipamento é retirado no endereço informado por coleta, sendo devolvido no mesmo endereço depois do serviço. Casos simples podem ser resolvidos em visita técnica, conforme a agenda; casos que exigem bancada seguem por coleta."
      },
      {
        "question": "Existe garantia no serviço de limpeza e troca de cooler?",
        "answer": "Sim, com escopo declarado: 90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco em que atuamos. Ruído que apareça em outro componente depois do atendimento é um caso novo e é tratado como tal, com avaliação própria. Não prometemos silêncio absoluto: informamos qual nível de ruído é esperado para o seu hardware antes de executar."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/computador-fazendo-barulho",
    "title": "Computador Fazendo Barulho: Como Identificar a Origem | Curitiba",
    "description": "PC barulhento, ventoinha rugindo, estalo ou zumbido? Entenda como separar cooler, fonte, disco rígido e ruído elétrico antes de trocar peça, e como funciona a coleta em Curitiba.",
    "faq": [
      {
        "question": "Computador barulhento sempre significa defeito?",
        "answer": "Não. Um equipamento com refrigeração exigida por jogo ou edição de vídeo eleva a rotação naturalmente, e isso é o sistema funcionando. O que indica problema é a mudança de padrão: ficar alto em tarefa leve, apresentar ruído metálico, estalo ou clique, ou passar a rugir logo na inicialização. Quando o barulho muda de caráter e não só de volume, existe algo mecânico ou térmico por trás."
      },
      {
        "question": "Como sei se o barulho é da ventoinha ou do disco?",
        "answer": "O ruído de ventoinha é contínuo, varia com a carga e muda quando o cooler acelera. O de disco é ritmado, repetitivo e independe do esforço que a máquina está fazendo. Uma pista prática: em computador com SSD como unidade principal, ruído rítmico só pode vir de peça mecânica, o que reduz muito as possibilidades. Na dúvida, desligue — se o custo de errar for perder arquivos, a decisão prudente é não insistir."
      },
      {
        "question": "Limpar o computador resolve o ruído?",
        "answer": "Resolve em boa parte dos casos, quando a origem é poeira compactada no dissipador ou fluxo de ar obstruído. Mas limpeza não recupera rolamento gasto nem corrige pasta térmica ressecada — por isso a limpeza técnica em bancada inclui a reaplicação da pasta e o teste de temperatura sob carga depois de fechar. Se o ruído voltar em poucas semanas, a causa não era sujeira."
      },
      {
        "question": "Posso usar o computador enquanto ele faz barulho?",
        "answer": "Depende do ruído. Rugido por temperatura permite uso, ainda que com desgaste e perda de desempenho por redução automática de frequência. Chiado de rolamento também permite, mas caminha para o travamento da ventoinha, e cooler parado significa superaquecimento. Já clique de disco e estalo com cheiro de queimado pedem desligamento imediato: nesses dois casos, continuar usando aumenta o prejuízo."
      },
      {
        "question": "Quanto custa resolver ruído de computador?",
        "answer": "A faixa depende da origem. Limpeza técnica com troca de pasta é o cenário mais comum e mais acessível. Substituição de ventoinha soma a peça. Fonte e disco envolvem valores maiores, porque não são apenas conforto acústico: mexem em confiabilidade e em dados. O valor fechado sai depois da inspeção, com sua aprovação antes de qualquer execução — as condições estão publicadas na página de preços e políticas."
      },
      {
        "question": "Trocar por ventoinha maior deixa mais silencioso?",
        "answer": "Em geral sim, porque uma hélice maior move o mesmo volume de ar com menos rotação, e rotação é o que gera ruído. Mas só funciona quando o gabinete tem espaço e furação compatíveis e quando o problema real é térmico. Colocar cooler potente em máquina cheia de poeira apenas mascara a causa por algum tempo. Avaliamos a montagem antes de sugerir troca de peça."
      },
      {
        "question": "Vocês atendem em casa ou preciso levar o equipamento?",
        "answer": "Não temos balcão de atendimento ao público. O contato começa pelo WhatsApp, com a descrição do ruído, e o equipamento é retirado no endereço informado por coleta, sendo devolvido no mesmo endereço depois do serviço. Casos simples podem ser resolvidos em visita técnica, conforme a agenda; casos que exigem bancada seguem por coleta."
      },
      {
        "question": "Existe garantia no serviço de limpeza e troca de cooler?",
        "answer": "Sim, com escopo declarado: 90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco em que atuamos. Ruído que apareça em outro componente depois do atendimento é um caso novo e é tratado como tal, com avaliação própria. Não prometemos silêncio absoluto: informamos qual nível de ruído é esperado para o seu hardware antes de executar."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaComputadorBarulho,
});
