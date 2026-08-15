import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/manutencao-de-notebook")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-de-notebook",
    "title": "Assistência Técnica de Notebook em Curitiba | Diagnóstico",
    "description": "Assistência técnica de notebook em Curitiba: lentidão, aquecimento, tela, teclado, bateria e limpeza interna. Todas as marcas. Diagnóstico antes de informar o valor via WhatsApp.",
    "faq": [
      {
        "question": "Meu notebook esquenta muito, tem solução?",
        "answer": "Na maioria dos casos, sim. O aquecimento costuma vir de poeira acumulada e pasta térmica ressecada. Fazemos limpeza interna e avaliamos a ventoinha e o dissipador."
      },
      {
        "question": "Vale a pena consertar ou é melhor trocar?",
        "answer": "Depende do custo do reparo frente ao valor do aparelho. Após o diagnóstico explicamos com honestidade quando compensa consertar e quando não vale."
      },
      {
        "question": "Vocês trocam tela e teclado?",
        "answer": "Sim, avaliamos e substituímos tela, dobradiça, teclado, bateria e conectores, conforme o modelo e a disponibilidade de peça. Nem toda placa, porém, tem reparo viável."
      },
      {
        "question": "Preciso levar o notebook até vocês?",
        "answer": "Atendemos em domicílio e também por coleta e entrega em Curitiba e região, conforme o tipo de serviço."
      },
      {
        "question": "Quanto tempo leva a manutenção?",
        "answer": "Serviços simples podem sair conforme a disponibilidade da agenda; reparos que dependem de peça específica levam mais tempo. Informamos o prazo junto com o valor."
      },
      {
        "question": "Meu notebook não liga. O que devo fazer?",
        "answer": "Teste outra tomada, observe se algum LED acende e remova periféricos externos. Se não houver mudança, evite novas tentativas — principalmente após líquido, queda, cheiro ou aquecimento — e encaminhe para diagnóstico. Os sinais e as causas possíveis estão detalhados na página sobre notebook que não liga."
      },
      {
        "question": "Notebook aquecendo precisa de limpeza?",
        "answer": "Aquecimento pode estar relacionado a poeira acumulada e pasta térmica ressecada, mas também a ventoinha com desgaste, dissipador obstruído ou uso intenso sem ventilação. A limpeza é indicada depois da avaliação, não antes dela."
      },
      {
        "question": "Vale a pena trocar SSD ou memória?",
        "answer": "Quando a placa está saudável e o gargalo é disco lento ou memória insuficiente, o upgrade costuma entregar ganho real de desempenho. Isso é avaliado no diagnóstico, junto da compatibilidade do modelo."
      },
      {
        "question": "A manutenção apaga meus arquivos?",
        "answer": "Serviços de hardware não têm como objetivo apagar dados. Ainda assim, quando há risco envolvido — armazenamento suspeito ou reinstalação de sistema — avisamos antes e tratamos a preservação dos arquivos como etapa separada."
      },
      {
        "question": "É possível informar o valor sem diagnóstico?",
        "answer": "Não com precisão. O mesmo sintoma pode ter causas de custo muito diferente. Informamos antes as condições comerciais vigentes, publicadas em preços e políticas; o valor do reparo vem depois da causa confirmada e depende da sua autorização."
      },
      {
        "question": "Peças estão incluídas?",
        "answer": "Não. Peças, componentes e materiais são tratados à parte do serviço e só são adquiridos após a sua aprovação. Informamos se o item é original, paralelo ou recondicionado."
      },
      {
        "question": "Há garantia?",
        "answer": "Sim, conforme o serviço efetivamente executado e a peça aplicada. As condições de garantia estão descritas na página de preços e políticas."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-de-notebook",
    "title": "Assistência Técnica de Notebook em Curitiba | Diagnóstico",
    "description": "Assistência técnica de notebook em Curitiba: lentidão, aquecimento, tela, teclado, bateria e limpeza interna. Todas as marcas. Diagnóstico antes de informar o valor via WhatsApp.",
    "faq": [
      {
        "question": "Meu notebook esquenta muito, tem solução?",
        "answer": "Na maioria dos casos, sim. O aquecimento costuma vir de poeira acumulada e pasta térmica ressecada. Fazemos limpeza interna e avaliamos a ventoinha e o dissipador."
      },
      {
        "question": "Vale a pena consertar ou é melhor trocar?",
        "answer": "Depende do custo do reparo frente ao valor do aparelho. Após o diagnóstico explicamos com honestidade quando compensa consertar e quando não vale."
      },
      {
        "question": "Vocês trocam tela e teclado?",
        "answer": "Sim, avaliamos e substituímos tela, dobradiça, teclado, bateria e conectores, conforme o modelo e a disponibilidade de peça. Nem toda placa, porém, tem reparo viável."
      },
      {
        "question": "Preciso levar o notebook até vocês?",
        "answer": "Atendemos em domicílio e também por coleta e entrega em Curitiba e região, conforme o tipo de serviço."
      },
      {
        "question": "Quanto tempo leva a manutenção?",
        "answer": "Serviços simples podem sair conforme a disponibilidade da agenda; reparos que dependem de peça específica levam mais tempo. Informamos o prazo junto com o valor."
      },
      {
        "question": "Meu notebook não liga. O que devo fazer?",
        "answer": "Teste outra tomada, observe se algum LED acende e remova periféricos externos. Se não houver mudança, evite novas tentativas — principalmente após líquido, queda, cheiro ou aquecimento — e encaminhe para diagnóstico. Os sinais e as causas possíveis estão detalhados na página sobre notebook que não liga."
      },
      {
        "question": "Notebook aquecendo precisa de limpeza?",
        "answer": "Aquecimento pode estar relacionado a poeira acumulada e pasta térmica ressecada, mas também a ventoinha com desgaste, dissipador obstruído ou uso intenso sem ventilação. A limpeza é indicada depois da avaliação, não antes dela."
      },
      {
        "question": "Vale a pena trocar SSD ou memória?",
        "answer": "Quando a placa está saudável e o gargalo é disco lento ou memória insuficiente, o upgrade costuma entregar ganho real de desempenho. Isso é avaliado no diagnóstico, junto da compatibilidade do modelo."
      },
      {
        "question": "A manutenção apaga meus arquivos?",
        "answer": "Serviços de hardware não têm como objetivo apagar dados. Ainda assim, quando há risco envolvido — armazenamento suspeito ou reinstalação de sistema — avisamos antes e tratamos a preservação dos arquivos como etapa separada."
      },
      {
        "question": "É possível informar o valor sem diagnóstico?",
        "answer": "Não com precisão. O mesmo sintoma pode ter causas de custo muito diferente. Informamos antes as condições comerciais vigentes, publicadas em preços e políticas; o valor do reparo vem depois da causa confirmada e depende da sua autorização."
      },
      {
        "question": "Peças estão incluídas?",
        "answer": "Não. Peças, componentes e materiais são tratados à parte do serviço e só são adquiridos após a sua aprovação. Informamos se o item é original, paralelo ou recondicionado."
      },
      {
        "question": "Há garantia?",
        "answer": "Sim, conforme o serviço efetivamente executado e a peça aplicada. As condições de garantia estão descritas na página de preços e políticas."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-de-notebook",
    "title": "Assistência Técnica de Notebook em Curitiba | Diagnóstico",
    "description": "Assistência técnica de notebook em Curitiba: lentidão, aquecimento, tela, teclado, bateria e limpeza interna. Todas as marcas. Diagnóstico antes de informar o valor via WhatsApp.",
    "faq": [
      {
        "question": "Meu notebook esquenta muito, tem solução?",
        "answer": "Na maioria dos casos, sim. O aquecimento costuma vir de poeira acumulada e pasta térmica ressecada. Fazemos limpeza interna e avaliamos a ventoinha e o dissipador."
      },
      {
        "question": "Vale a pena consertar ou é melhor trocar?",
        "answer": "Depende do custo do reparo frente ao valor do aparelho. Após o diagnóstico explicamos com honestidade quando compensa consertar e quando não vale."
      },
      {
        "question": "Vocês trocam tela e teclado?",
        "answer": "Sim, avaliamos e substituímos tela, dobradiça, teclado, bateria e conectores, conforme o modelo e a disponibilidade de peça. Nem toda placa, porém, tem reparo viável."
      },
      {
        "question": "Preciso levar o notebook até vocês?",
        "answer": "Atendemos em domicílio e também por coleta e entrega em Curitiba e região, conforme o tipo de serviço."
      },
      {
        "question": "Quanto tempo leva a manutenção?",
        "answer": "Serviços simples podem sair conforme a disponibilidade da agenda; reparos que dependem de peça específica levam mais tempo. Informamos o prazo junto com o valor."
      },
      {
        "question": "Meu notebook não liga. O que devo fazer?",
        "answer": "Teste outra tomada, observe se algum LED acende e remova periféricos externos. Se não houver mudança, evite novas tentativas — principalmente após líquido, queda, cheiro ou aquecimento — e encaminhe para diagnóstico. Os sinais e as causas possíveis estão detalhados na página sobre notebook que não liga."
      },
      {
        "question": "Notebook aquecendo precisa de limpeza?",
        "answer": "Aquecimento pode estar relacionado a poeira acumulada e pasta térmica ressecada, mas também a ventoinha com desgaste, dissipador obstruído ou uso intenso sem ventilação. A limpeza é indicada depois da avaliação, não antes dela."
      },
      {
        "question": "Vale a pena trocar SSD ou memória?",
        "answer": "Quando a placa está saudável e o gargalo é disco lento ou memória insuficiente, o upgrade costuma entregar ganho real de desempenho. Isso é avaliado no diagnóstico, junto da compatibilidade do modelo."
      },
      {
        "question": "A manutenção apaga meus arquivos?",
        "answer": "Serviços de hardware não têm como objetivo apagar dados. Ainda assim, quando há risco envolvido — armazenamento suspeito ou reinstalação de sistema — avisamos antes e tratamos a preservação dos arquivos como etapa separada."
      },
      {
        "question": "É possível informar o valor sem diagnóstico?",
        "answer": "Não com precisão. O mesmo sintoma pode ter causas de custo muito diferente. Informamos antes as condições comerciais vigentes, publicadas em preços e políticas; o valor do reparo vem depois da causa confirmada e depende da sua autorização."
      },
      {
        "question": "Peças estão incluídas?",
        "answer": "Não. Peças, componentes e materiais são tratados à parte do serviço e só são adquiridos após a sua aprovação. Informamos se o item é original, paralelo ou recondicionado."
      },
      {
        "question": "Há garantia?",
        "answer": "Sim, conforme o serviço efetivamente executado e a peça aplicada. As condições de garantia estão descritas na página de preços e políticas."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/manutencao-de-notebook",
    "title": "Assistência Técnica de Notebook em Curitiba | Diagnóstico",
    "description": "Assistência técnica de notebook em Curitiba: lentidão, aquecimento, tela, teclado, bateria e limpeza interna. Todas as marcas. Diagnóstico antes de informar o valor via WhatsApp.",
    "faq": [
      {
        "question": "Meu notebook esquenta muito, tem solução?",
        "answer": "Na maioria dos casos, sim. O aquecimento costuma vir de poeira acumulada e pasta térmica ressecada. Fazemos limpeza interna e avaliamos a ventoinha e o dissipador."
      },
      {
        "question": "Vale a pena consertar ou é melhor trocar?",
        "answer": "Depende do custo do reparo frente ao valor do aparelho. Após o diagnóstico explicamos com honestidade quando compensa consertar e quando não vale."
      },
      {
        "question": "Vocês trocam tela e teclado?",
        "answer": "Sim, avaliamos e substituímos tela, dobradiça, teclado, bateria e conectores, conforme o modelo e a disponibilidade de peça. Nem toda placa, porém, tem reparo viável."
      },
      {
        "question": "Preciso levar o notebook até vocês?",
        "answer": "Atendemos em domicílio e também por coleta e entrega em Curitiba e região, conforme o tipo de serviço."
      },
      {
        "question": "Quanto tempo leva a manutenção?",
        "answer": "Serviços simples podem sair conforme a disponibilidade da agenda; reparos que dependem de peça específica levam mais tempo. Informamos o prazo junto com o valor."
      },
      {
        "question": "Meu notebook não liga. O que devo fazer?",
        "answer": "Teste outra tomada, observe se algum LED acende e remova periféricos externos. Se não houver mudança, evite novas tentativas — principalmente após líquido, queda, cheiro ou aquecimento — e encaminhe para diagnóstico. Os sinais e as causas possíveis estão detalhados na página sobre notebook que não liga."
      },
      {
        "question": "Notebook aquecendo precisa de limpeza?",
        "answer": "Aquecimento pode estar relacionado a poeira acumulada e pasta térmica ressecada, mas também a ventoinha com desgaste, dissipador obstruído ou uso intenso sem ventilação. A limpeza é indicada depois da avaliação, não antes dela."
      },
      {
        "question": "Vale a pena trocar SSD ou memória?",
        "answer": "Quando a placa está saudável e o gargalo é disco lento ou memória insuficiente, o upgrade costuma entregar ganho real de desempenho. Isso é avaliado no diagnóstico, junto da compatibilidade do modelo."
      },
      {
        "question": "A manutenção apaga meus arquivos?",
        "answer": "Serviços de hardware não têm como objetivo apagar dados. Ainda assim, quando há risco envolvido — armazenamento suspeito ou reinstalação de sistema — avisamos antes e tratamos a preservação dos arquivos como etapa separada."
      },
      {
        "question": "É possível informar o valor sem diagnóstico?",
        "answer": "Não com precisão. O mesmo sintoma pode ter causas de custo muito diferente. Informamos antes as condições comerciais vigentes, publicadas em preços e políticas; o valor do reparo vem depois da causa confirmada e depende da sua autorização."
      },
      {
        "question": "Peças estão incluídas?",
        "answer": "Não. Peças, componentes e materiais são tratados à parte do serviço e só são adquiridos após a sua aprovação. Informamos se o item é original, paralelo ou recondicionado."
      },
      {
        "question": "Há garantia?",
        "answer": "Sim, conforme o serviço efetivamente executado e a peça aplicada. As condições de garantia estão descritas na página de preços e políticas."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="manutencao-de-notebook" />,
});
