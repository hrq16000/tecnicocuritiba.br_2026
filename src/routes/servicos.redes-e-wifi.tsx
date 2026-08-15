import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ServicoCore from "@/pages/servicos/ServicoCore";

export const Route = createFileRoute("/servicos/redes-e-wifi")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-e-wifi",
    "title": "Configuração de Redes e Wi-Fi em Curitiba | Roteadores",
    "description": "Configuração de redes e Wi-Fi em Curitiba: internet instável, roteador, repetidor, cabeamento e rede empresarial. Cobertura melhor em casa e no trabalho. Via WhatsApp.",
    "faq": [
      {
        "question": "Meu Wi-Fi não pega em todos os cômodos, o que fazer?",
        "answer": "Avaliamos o ambiente e indicamos posicionamento do roteador, repetidores ou sistema mesh para ampliar a cobertura de forma estável."
      },
      {
        "question": "Repetidor ou mesh, qual é melhor?",
        "answer": "Depende do ambiente. O mesh costuma oferecer transição mais suave; o repetidor pode resolver casos pontuais. Indicamos o adequado após avaliar."
      },
      {
        "question": "Vocês configuram a rede da minha empresa?",
        "answer": "Sim. Trabalhamos estabilidade, segurança e organização de redes empresariais, com atendimento pontual ou recorrente conforme o escopo definido após a avaliação."
      },
      {
        "question": "Por que o Wi-Fi cai em alguns ambientes do escritório?",
        "answer": "Normalmente por distância, parede de concreto, divisórias metálicas, excesso de redes vizinhas na faixa de 2,4 GHz ou por um único roteador tentando cobrir toda a área. A medição no local mostra onde o sinal deixa de ser utilizável."
      },
      {
        "question": "Um roteador mais potente resolve?",
        "answer": "Nem sempre. Potência não vence obstrução física nem congestionamento de canal. Em escritórios, dois pontos bem posicionados costumam entregar mais estabilidade do que um equipamento isolado mais caro."
      },
      {
        "question": "É necessário instalar cabeamento?",
        "answer": "Depende do layout e do uso. Quando existe passagem viável, levar cabo até o ponto distante é a solução mais estável para setores fixos. Onde não há infraestrutura, avaliamos alternativas sem prometer obra civil."
      },
      {
        "question": "É possível separar redes de funcionários e visitantes?",
        "answer": "Sim, quando o equipamento suporta rede de visitantes ou segmentação básica. É uma separação de uso, não uma solução completa de segurança corporativa."
      },
      {
        "question": "Vocês configuram impressoras de rede?",
        "answer": "Sim, dentro do escopo de conectividade: instalação do driver oficial, endereço IP fixo, compartilhamento entre as estações, fila de impressão, descoberta na rede, digitalização em rede quando o modelo suporta e reconexão após troca de roteador. O atendimento de impressoras e periféricos nesta página se limita à configuração, comunicação e compartilhamento em rede. Defeitos mecânicos ou eletrônicos dependem de assistência específica para o equipamento."
      },
      {
        "question": "Vocês consertam impressora com defeito?",
        "answer": "Não. Reparo mecânico, troca de cabeçote, recarga, manutenção de fusor, reparo eletrônico, conserto de placa e manutenção de plotter estão fora do escopo, assim como o fornecimento de toner e tinta. Se a avaliação apontar falha física do aparelho, informamos e orientamos a assistência do fabricante."
      },
      {
        "question": "Dá para compartilhar uma pasta ou um disco na rede?",
        "answer": "Sim, para compartilhamento simples entre os computadores do ambiente ou disco ligado ao roteador, dentro do que a estrutura atual permite. Servidor de arquivos com permissões por setor é escopo do suporte técnico empresarial."
      },
      {
        "question": "Passam cabo de rede?",
        "answer": "Quando faz sentido para estabilidade, avaliamos e realizamos o cabeamento e a organização dos pontos."
      },
      {
        "question": "O valor pode ser definido sem avaliar o local?",
        "answer": "Não para ambientes empresariais. Cobertura, número de pontos e infraestrutura existente só ficam claros com levantamento no local ou com informações detalhadas da planta e do uso."
      },
      {
        "question": "Equipamentos estão incluídos?",
        "answer": "Roteadores, access points, switches e cabos são tratados como material à parte. Informamos o que é necessário antes da execução e você decide se fornece ou se compramos conforme autorização."
      },
      {
        "question": "A internet continua lenta, é problema de Wi-Fi?",
        "answer": "Pode ser Wi-Fi, roteador, quantidade de dispositivos ou o próprio plano. O diagnóstico separa o que é rede local do que é o provedor — falhas da operadora fogem ao nosso reparo."
      },
      {
        "question": "Scanner, leitor e outros periféricos em rede entram no escopo?",
        "answer": "Entram como dispositivos em rede: reconhecimento pelas estações, driver oficial do fabricante, endereço fixo quando o modelo permite, compartilhamento e digitalização em rede. Não fazemos reparo mecânico nem eletrônico desses aparelhos, e limpeza interna, troca de peça, correia, sensor ou placa seguem para a assistência do próprio fabricante."
      },
      {
        "question": "Câmeras IP e NAS podem ser configurados junto com a rede?",
        "answer": "Sim, na parte de rede: endereçamento, acesso na rede local, separação do tráfego quando o equipamento suporta e ajuste do roteador para que os dispositivos se enxerguem. Instalação física, infraestrutura de energia, suporte de fixação e reparo do aparelho não fazem parte deste serviço."
      },
      {
        "question": "Por que a impressora some da rede depois de trocar o roteador?",
        "answer": "Quase sempre porque o endereço do aparelho mudou ou a rede recebeu outro nome e senha. A correção é reservar um endereço fixo para a impressora e reapontar as estações — é configuração de rede, não defeito do equipamento."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-e-wifi",
    "title": "Configuração de Redes e Wi-Fi em Curitiba | Roteadores",
    "description": "Configuração de redes e Wi-Fi em Curitiba: internet instável, roteador, repetidor, cabeamento e rede empresarial. Cobertura melhor em casa e no trabalho. Via WhatsApp.",
    "faq": [
      {
        "question": "Meu Wi-Fi não pega em todos os cômodos, o que fazer?",
        "answer": "Avaliamos o ambiente e indicamos posicionamento do roteador, repetidores ou sistema mesh para ampliar a cobertura de forma estável."
      },
      {
        "question": "Repetidor ou mesh, qual é melhor?",
        "answer": "Depende do ambiente. O mesh costuma oferecer transição mais suave; o repetidor pode resolver casos pontuais. Indicamos o adequado após avaliar."
      },
      {
        "question": "Vocês configuram a rede da minha empresa?",
        "answer": "Sim. Trabalhamos estabilidade, segurança e organização de redes empresariais, com atendimento pontual ou recorrente conforme o escopo definido após a avaliação."
      },
      {
        "question": "Por que o Wi-Fi cai em alguns ambientes do escritório?",
        "answer": "Normalmente por distância, parede de concreto, divisórias metálicas, excesso de redes vizinhas na faixa de 2,4 GHz ou por um único roteador tentando cobrir toda a área. A medição no local mostra onde o sinal deixa de ser utilizável."
      },
      {
        "question": "Um roteador mais potente resolve?",
        "answer": "Nem sempre. Potência não vence obstrução física nem congestionamento de canal. Em escritórios, dois pontos bem posicionados costumam entregar mais estabilidade do que um equipamento isolado mais caro."
      },
      {
        "question": "É necessário instalar cabeamento?",
        "answer": "Depende do layout e do uso. Quando existe passagem viável, levar cabo até o ponto distante é a solução mais estável para setores fixos. Onde não há infraestrutura, avaliamos alternativas sem prometer obra civil."
      },
      {
        "question": "É possível separar redes de funcionários e visitantes?",
        "answer": "Sim, quando o equipamento suporta rede de visitantes ou segmentação básica. É uma separação de uso, não uma solução completa de segurança corporativa."
      },
      {
        "question": "Vocês configuram impressoras de rede?",
        "answer": "Sim, dentro do escopo de conectividade: instalação do driver oficial, endereço IP fixo, compartilhamento entre as estações, fila de impressão, descoberta na rede, digitalização em rede quando o modelo suporta e reconexão após troca de roteador. O atendimento de impressoras e periféricos nesta página se limita à configuração, comunicação e compartilhamento em rede. Defeitos mecânicos ou eletrônicos dependem de assistência específica para o equipamento."
      },
      {
        "question": "Vocês consertam impressora com defeito?",
        "answer": "Não. Reparo mecânico, troca de cabeçote, recarga, manutenção de fusor, reparo eletrônico, conserto de placa e manutenção de plotter estão fora do escopo, assim como o fornecimento de toner e tinta. Se a avaliação apontar falha física do aparelho, informamos e orientamos a assistência do fabricante."
      },
      {
        "question": "Dá para compartilhar uma pasta ou um disco na rede?",
        "answer": "Sim, para compartilhamento simples entre os computadores do ambiente ou disco ligado ao roteador, dentro do que a estrutura atual permite. Servidor de arquivos com permissões por setor é escopo do suporte técnico empresarial."
      },
      {
        "question": "Passam cabo de rede?",
        "answer": "Quando faz sentido para estabilidade, avaliamos e realizamos o cabeamento e a organização dos pontos."
      },
      {
        "question": "O valor pode ser definido sem avaliar o local?",
        "answer": "Não para ambientes empresariais. Cobertura, número de pontos e infraestrutura existente só ficam claros com levantamento no local ou com informações detalhadas da planta e do uso."
      },
      {
        "question": "Equipamentos estão incluídos?",
        "answer": "Roteadores, access points, switches e cabos são tratados como material à parte. Informamos o que é necessário antes da execução e você decide se fornece ou se compramos conforme autorização."
      },
      {
        "question": "A internet continua lenta, é problema de Wi-Fi?",
        "answer": "Pode ser Wi-Fi, roteador, quantidade de dispositivos ou o próprio plano. O diagnóstico separa o que é rede local do que é o provedor — falhas da operadora fogem ao nosso reparo."
      },
      {
        "question": "Scanner, leitor e outros periféricos em rede entram no escopo?",
        "answer": "Entram como dispositivos em rede: reconhecimento pelas estações, driver oficial do fabricante, endereço fixo quando o modelo permite, compartilhamento e digitalização em rede. Não fazemos reparo mecânico nem eletrônico desses aparelhos, e limpeza interna, troca de peça, correia, sensor ou placa seguem para a assistência do próprio fabricante."
      },
      {
        "question": "Câmeras IP e NAS podem ser configurados junto com a rede?",
        "answer": "Sim, na parte de rede: endereçamento, acesso na rede local, separação do tráfego quando o equipamento suporta e ajuste do roteador para que os dispositivos se enxerguem. Instalação física, infraestrutura de energia, suporte de fixação e reparo do aparelho não fazem parte deste serviço."
      },
      {
        "question": "Por que a impressora some da rede depois de trocar o roteador?",
        "answer": "Quase sempre porque o endereço do aparelho mudou ou a rede recebeu outro nome e senha. A correção é reservar um endereço fixo para a impressora e reapontar as estações — é configuração de rede, não defeito do equipamento."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-e-wifi",
    "title": "Configuração de Redes e Wi-Fi em Curitiba | Roteadores",
    "description": "Configuração de redes e Wi-Fi em Curitiba: internet instável, roteador, repetidor, cabeamento e rede empresarial. Cobertura melhor em casa e no trabalho. Via WhatsApp.",
    "faq": [
      {
        "question": "Meu Wi-Fi não pega em todos os cômodos, o que fazer?",
        "answer": "Avaliamos o ambiente e indicamos posicionamento do roteador, repetidores ou sistema mesh para ampliar a cobertura de forma estável."
      },
      {
        "question": "Repetidor ou mesh, qual é melhor?",
        "answer": "Depende do ambiente. O mesh costuma oferecer transição mais suave; o repetidor pode resolver casos pontuais. Indicamos o adequado após avaliar."
      },
      {
        "question": "Vocês configuram a rede da minha empresa?",
        "answer": "Sim. Trabalhamos estabilidade, segurança e organização de redes empresariais, com atendimento pontual ou recorrente conforme o escopo definido após a avaliação."
      },
      {
        "question": "Por que o Wi-Fi cai em alguns ambientes do escritório?",
        "answer": "Normalmente por distância, parede de concreto, divisórias metálicas, excesso de redes vizinhas na faixa de 2,4 GHz ou por um único roteador tentando cobrir toda a área. A medição no local mostra onde o sinal deixa de ser utilizável."
      },
      {
        "question": "Um roteador mais potente resolve?",
        "answer": "Nem sempre. Potência não vence obstrução física nem congestionamento de canal. Em escritórios, dois pontos bem posicionados costumam entregar mais estabilidade do que um equipamento isolado mais caro."
      },
      {
        "question": "É necessário instalar cabeamento?",
        "answer": "Depende do layout e do uso. Quando existe passagem viável, levar cabo até o ponto distante é a solução mais estável para setores fixos. Onde não há infraestrutura, avaliamos alternativas sem prometer obra civil."
      },
      {
        "question": "É possível separar redes de funcionários e visitantes?",
        "answer": "Sim, quando o equipamento suporta rede de visitantes ou segmentação básica. É uma separação de uso, não uma solução completa de segurança corporativa."
      },
      {
        "question": "Vocês configuram impressoras de rede?",
        "answer": "Sim, dentro do escopo de conectividade: instalação do driver oficial, endereço IP fixo, compartilhamento entre as estações, fila de impressão, descoberta na rede, digitalização em rede quando o modelo suporta e reconexão após troca de roteador. O atendimento de impressoras e periféricos nesta página se limita à configuração, comunicação e compartilhamento em rede. Defeitos mecânicos ou eletrônicos dependem de assistência específica para o equipamento."
      },
      {
        "question": "Vocês consertam impressora com defeito?",
        "answer": "Não. Reparo mecânico, troca de cabeçote, recarga, manutenção de fusor, reparo eletrônico, conserto de placa e manutenção de plotter estão fora do escopo, assim como o fornecimento de toner e tinta. Se a avaliação apontar falha física do aparelho, informamos e orientamos a assistência do fabricante."
      },
      {
        "question": "Dá para compartilhar uma pasta ou um disco na rede?",
        "answer": "Sim, para compartilhamento simples entre os computadores do ambiente ou disco ligado ao roteador, dentro do que a estrutura atual permite. Servidor de arquivos com permissões por setor é escopo do suporte técnico empresarial."
      },
      {
        "question": "Passam cabo de rede?",
        "answer": "Quando faz sentido para estabilidade, avaliamos e realizamos o cabeamento e a organização dos pontos."
      },
      {
        "question": "O valor pode ser definido sem avaliar o local?",
        "answer": "Não para ambientes empresariais. Cobertura, número de pontos e infraestrutura existente só ficam claros com levantamento no local ou com informações detalhadas da planta e do uso."
      },
      {
        "question": "Equipamentos estão incluídos?",
        "answer": "Roteadores, access points, switches e cabos são tratados como material à parte. Informamos o que é necessário antes da execução e você decide se fornece ou se compramos conforme autorização."
      },
      {
        "question": "A internet continua lenta, é problema de Wi-Fi?",
        "answer": "Pode ser Wi-Fi, roteador, quantidade de dispositivos ou o próprio plano. O diagnóstico separa o que é rede local do que é o provedor — falhas da operadora fogem ao nosso reparo."
      },
      {
        "question": "Scanner, leitor e outros periféricos em rede entram no escopo?",
        "answer": "Entram como dispositivos em rede: reconhecimento pelas estações, driver oficial do fabricante, endereço fixo quando o modelo permite, compartilhamento e digitalização em rede. Não fazemos reparo mecânico nem eletrônico desses aparelhos, e limpeza interna, troca de peça, correia, sensor ou placa seguem para a assistência do próprio fabricante."
      },
      {
        "question": "Câmeras IP e NAS podem ser configurados junto com a rede?",
        "answer": "Sim, na parte de rede: endereçamento, acesso na rede local, separação do tráfego quando o equipamento suporta e ajuste do roteador para que os dispositivos se enxerguem. Instalação física, infraestrutura de energia, suporte de fixação e reparo do aparelho não fazem parte deste serviço."
      },
      {
        "question": "Por que a impressora some da rede depois de trocar o roteador?",
        "answer": "Quase sempre porque o endereço do aparelho mudou ou a rede recebeu outro nome e senha. A correção é reservar um endereço fixo para a impressora e reapontar as estações — é configuração de rede, não defeito do equipamento."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/servicos/redes-e-wifi",
    "title": "Configuração de Redes e Wi-Fi em Curitiba | Roteadores",
    "description": "Configuração de redes e Wi-Fi em Curitiba: internet instável, roteador, repetidor, cabeamento e rede empresarial. Cobertura melhor em casa e no trabalho. Via WhatsApp.",
    "faq": [
      {
        "question": "Meu Wi-Fi não pega em todos os cômodos, o que fazer?",
        "answer": "Avaliamos o ambiente e indicamos posicionamento do roteador, repetidores ou sistema mesh para ampliar a cobertura de forma estável."
      },
      {
        "question": "Repetidor ou mesh, qual é melhor?",
        "answer": "Depende do ambiente. O mesh costuma oferecer transição mais suave; o repetidor pode resolver casos pontuais. Indicamos o adequado após avaliar."
      },
      {
        "question": "Vocês configuram a rede da minha empresa?",
        "answer": "Sim. Trabalhamos estabilidade, segurança e organização de redes empresariais, com atendimento pontual ou recorrente conforme o escopo definido após a avaliação."
      },
      {
        "question": "Por que o Wi-Fi cai em alguns ambientes do escritório?",
        "answer": "Normalmente por distância, parede de concreto, divisórias metálicas, excesso de redes vizinhas na faixa de 2,4 GHz ou por um único roteador tentando cobrir toda a área. A medição no local mostra onde o sinal deixa de ser utilizável."
      },
      {
        "question": "Um roteador mais potente resolve?",
        "answer": "Nem sempre. Potência não vence obstrução física nem congestionamento de canal. Em escritórios, dois pontos bem posicionados costumam entregar mais estabilidade do que um equipamento isolado mais caro."
      },
      {
        "question": "É necessário instalar cabeamento?",
        "answer": "Depende do layout e do uso. Quando existe passagem viável, levar cabo até o ponto distante é a solução mais estável para setores fixos. Onde não há infraestrutura, avaliamos alternativas sem prometer obra civil."
      },
      {
        "question": "É possível separar redes de funcionários e visitantes?",
        "answer": "Sim, quando o equipamento suporta rede de visitantes ou segmentação básica. É uma separação de uso, não uma solução completa de segurança corporativa."
      },
      {
        "question": "Vocês configuram impressoras de rede?",
        "answer": "Sim, dentro do escopo de conectividade: instalação do driver oficial, endereço IP fixo, compartilhamento entre as estações, fila de impressão, descoberta na rede, digitalização em rede quando o modelo suporta e reconexão após troca de roteador. O atendimento de impressoras e periféricos nesta página se limita à configuração, comunicação e compartilhamento em rede. Defeitos mecânicos ou eletrônicos dependem de assistência específica para o equipamento."
      },
      {
        "question": "Vocês consertam impressora com defeito?",
        "answer": "Não. Reparo mecânico, troca de cabeçote, recarga, manutenção de fusor, reparo eletrônico, conserto de placa e manutenção de plotter estão fora do escopo, assim como o fornecimento de toner e tinta. Se a avaliação apontar falha física do aparelho, informamos e orientamos a assistência do fabricante."
      },
      {
        "question": "Dá para compartilhar uma pasta ou um disco na rede?",
        "answer": "Sim, para compartilhamento simples entre os computadores do ambiente ou disco ligado ao roteador, dentro do que a estrutura atual permite. Servidor de arquivos com permissões por setor é escopo do suporte técnico empresarial."
      },
      {
        "question": "Passam cabo de rede?",
        "answer": "Quando faz sentido para estabilidade, avaliamos e realizamos o cabeamento e a organização dos pontos."
      },
      {
        "question": "O valor pode ser definido sem avaliar o local?",
        "answer": "Não para ambientes empresariais. Cobertura, número de pontos e infraestrutura existente só ficam claros com levantamento no local ou com informações detalhadas da planta e do uso."
      },
      {
        "question": "Equipamentos estão incluídos?",
        "answer": "Roteadores, access points, switches e cabos são tratados como material à parte. Informamos o que é necessário antes da execução e você decide se fornece ou se compramos conforme autorização."
      },
      {
        "question": "A internet continua lenta, é problema de Wi-Fi?",
        "answer": "Pode ser Wi-Fi, roteador, quantidade de dispositivos ou o próprio plano. O diagnóstico separa o que é rede local do que é o provedor — falhas da operadora fogem ao nosso reparo."
      },
      {
        "question": "Scanner, leitor e outros periféricos em rede entram no escopo?",
        "answer": "Entram como dispositivos em rede: reconhecimento pelas estações, driver oficial do fabricante, endereço fixo quando o modelo permite, compartilhamento e digitalização em rede. Não fazemos reparo mecânico nem eletrônico desses aparelhos, e limpeza interna, troca de peça, correia, sensor ou placa seguem para a assistência do próprio fabricante."
      },
      {
        "question": "Câmeras IP e NAS podem ser configurados junto com a rede?",
        "answer": "Sim, na parte de rede: endereçamento, acesso na rede local, separação do tráfego quando o equipamento suporta e ajuste do roteador para que os dispositivos se enxerguem. Instalação física, infraestrutura de energia, suporte de fixação e reparo do aparelho não fazem parte deste serviço."
      },
      {
        "question": "Por que a impressora some da rede depois de trocar o roteador?",
        "answer": "Quase sempre porque o endereço do aparelho mudou ou a rede recebeu outro nome e senha. A correção é reservar um endereço fixo para a impressora e reapontar as estações — é configuração de rede, não defeito do equipamento."
      }
    ]
  }),
  /* seo:auto-end */
  component: () => <ServicoCore slug="redes-e-wifi" />,
});
