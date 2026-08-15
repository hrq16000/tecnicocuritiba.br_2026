import { createFileRoute } from "@tanstack/react-router";
import { seoHead } from "@/lib/seo/routeHead";
import ProblemaWifiCaindoTodaHora from "@/pages/problemas/WifiCaindoTodaHora";

export const Route = createFileRoute("/problemas/wifi-caindo-toda-hora")({
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/wifi-caindo-toda-hora",
    "title": "Wi-Fi Caindo Toda Hora? Diagnóstico de Rede em Curitiba",
    "description": "Wi-Fi que cai toda hora, sinal que some em um cômodo ou internet lenta só à noite: entenda a diferença entre falha do provedor, do roteador e da cobertura, o que testar antes e como é feito o diagnóstico de rede em Curitiba.",
    "faq": [
      {
        "question": "Wi-Fi caindo é sempre culpa do provedor?",
        "answer": "Não, e existe um teste simples que separa as duas hipóteses: conecte um computador por cabo direto ao roteador e use a internet nessa condição. Se o cabo também cai, a instabilidade está no link ou no equipamento do provedor, e o caminho é abrir chamado com ele. Se o cabo se mantém estável e apenas o sem fio cai, o problema está na rede interna — cobertura, canal, posicionamento ou capacidade do roteador."
      },
      {
        "question": "Repetidor de sinal resolve?",
        "answer": "Resolve em situações específicas e piora em outras. Repetidor replica o sinal que recebe: se for instalado onde a recepção já é ruim, ele espalha um sinal ruim e ainda reduz a velocidade disponível. Funciona quando o ponto de instalação tem boa recepção e a área a cobrir é pequena. Para casa com laje ou dois pavimentos, o resultado consistente vem de nós interligados por cabo."
      },
      {
        "question": "Por que o sinal aparece cheio e mesmo assim trava?",
        "answer": "Porque a barra de sinal mede intensidade, não qualidade. É possível receber um sinal forte em um canal disputado por várias redes vizinhas: o aparelho enxerga o roteador, mas passa boa parte do tempo esperando a vez de transmitir. Nesse cenário, mudar de canal ou migrar dispositivos para a faixa de 5 GHz muda mais o resultado do que trocar o roteador."
      },
      {
        "question": "Trocar o roteador da operadora por um melhor adianta?",
        "answer": "Adianta quando o equipamento é o gargalo real, o que acontece com frequência em imóvel com muitos dispositivos conectados. Mas trocar por dedução é caro e às vezes inútil: se a causa é posicionamento, cobertura ou canal congestionado, o aparelho novo repete o mesmo comportamento. Avaliamos o ambiente antes de indicar compra."
      },
      {
        "question": "Vocês atendem rede em apartamento?",
        "answer": "Sim, e é um cenário com característica própria: em prédio, a quantidade de redes vizinhas na mesma faixa é o fator dominante, muito mais do que a área a cobrir. O trabalho costuma envolver escolha de canal, separação das faixas de rádio e cabeamento discreto para os pontos fixos, respeitando as regras do condomínio."
      },
      {
        "question": "Preciso comprar equipamento antes do atendimento?",
        "answer": "Não, e recomendamos que não compre. A definição do que é necessário sai da avaliação do imóvel e do uso real. Comprar antes leva a equipamento incompatível com o cenário ou superdimensionado para a necessidade. Quando há indicação de compra, ela vem com a justificativa técnica do que aquele item resolve."
      },
      {
        "question": "Esse serviço é feito na minha casa ou por coleta?",
        "answer": "Rede é um dos poucos serviços que só faz sentido no local: cobertura depende do imóvel, das paredes e da posição dos aparelhos. A visita técnica avalia o ambiente e apresenta as opções. Não atendemos em balcão — o contato começa pelo WhatsApp e o atendimento acontece no endereço."
      },
      {
        "question": "Qual a garantia do serviço de rede?",
        "answer": "90 dias sobre a mão de obra da configuração e da instalação executadas. Equipamentos seguem a garantia do fabricante. A garantia não cobre instabilidade do link do provedor, mudança de layout do imóvel depois do serviço nem alteração de configuração feita por terceiros."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/wifi-caindo-toda-hora",
    "title": "Wi-Fi Caindo Toda Hora? Diagnóstico de Rede em Curitiba",
    "description": "Wi-Fi que cai toda hora, sinal que some em um cômodo ou internet lenta só à noite: entenda a diferença entre falha do provedor, do roteador e da cobertura, o que testar antes e como é feito o diagnóstico de rede em Curitiba.",
    "faq": [
      {
        "question": "Wi-Fi caindo é sempre culpa do provedor?",
        "answer": "Não, e existe um teste simples que separa as duas hipóteses: conecte um computador por cabo direto ao roteador e use a internet nessa condição. Se o cabo também cai, a instabilidade está no link ou no equipamento do provedor, e o caminho é abrir chamado com ele. Se o cabo se mantém estável e apenas o sem fio cai, o problema está na rede interna — cobertura, canal, posicionamento ou capacidade do roteador."
      },
      {
        "question": "Repetidor de sinal resolve?",
        "answer": "Resolve em situações específicas e piora em outras. Repetidor replica o sinal que recebe: se for instalado onde a recepção já é ruim, ele espalha um sinal ruim e ainda reduz a velocidade disponível. Funciona quando o ponto de instalação tem boa recepção e a área a cobrir é pequena. Para casa com laje ou dois pavimentos, o resultado consistente vem de nós interligados por cabo."
      },
      {
        "question": "Por que o sinal aparece cheio e mesmo assim trava?",
        "answer": "Porque a barra de sinal mede intensidade, não qualidade. É possível receber um sinal forte em um canal disputado por várias redes vizinhas: o aparelho enxerga o roteador, mas passa boa parte do tempo esperando a vez de transmitir. Nesse cenário, mudar de canal ou migrar dispositivos para a faixa de 5 GHz muda mais o resultado do que trocar o roteador."
      },
      {
        "question": "Trocar o roteador da operadora por um melhor adianta?",
        "answer": "Adianta quando o equipamento é o gargalo real, o que acontece com frequência em imóvel com muitos dispositivos conectados. Mas trocar por dedução é caro e às vezes inútil: se a causa é posicionamento, cobertura ou canal congestionado, o aparelho novo repete o mesmo comportamento. Avaliamos o ambiente antes de indicar compra."
      },
      {
        "question": "Vocês atendem rede em apartamento?",
        "answer": "Sim, e é um cenário com característica própria: em prédio, a quantidade de redes vizinhas na mesma faixa é o fator dominante, muito mais do que a área a cobrir. O trabalho costuma envolver escolha de canal, separação das faixas de rádio e cabeamento discreto para os pontos fixos, respeitando as regras do condomínio."
      },
      {
        "question": "Preciso comprar equipamento antes do atendimento?",
        "answer": "Não, e recomendamos que não compre. A definição do que é necessário sai da avaliação do imóvel e do uso real. Comprar antes leva a equipamento incompatível com o cenário ou superdimensionado para a necessidade. Quando há indicação de compra, ela vem com a justificativa técnica do que aquele item resolve."
      },
      {
        "question": "Esse serviço é feito na minha casa ou por coleta?",
        "answer": "Rede é um dos poucos serviços que só faz sentido no local: cobertura depende do imóvel, das paredes e da posição dos aparelhos. A visita técnica avalia o ambiente e apresenta as opções. Não atendemos em balcão — o contato começa pelo WhatsApp e o atendimento acontece no endereço."
      },
      {
        "question": "Qual a garantia do serviço de rede?",
        "answer": "90 dias sobre a mão de obra da configuração e da instalação executadas. Equipamentos seguem a garantia do fabricante. A garantia não cobre instabilidade do link do provedor, mudança de layout do imóvel depois do serviço nem alteração de configuração feita por terceiros."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/wifi-caindo-toda-hora",
    "title": "Wi-Fi Caindo Toda Hora? Diagnóstico de Rede em Curitiba",
    "description": "Wi-Fi que cai toda hora, sinal que some em um cômodo ou internet lenta só à noite: entenda a diferença entre falha do provedor, do roteador e da cobertura, o que testar antes e como é feito o diagnóstico de rede em Curitiba.",
    "faq": [
      {
        "question": "Wi-Fi caindo é sempre culpa do provedor?",
        "answer": "Não, e existe um teste simples que separa as duas hipóteses: conecte um computador por cabo direto ao roteador e use a internet nessa condição. Se o cabo também cai, a instabilidade está no link ou no equipamento do provedor, e o caminho é abrir chamado com ele. Se o cabo se mantém estável e apenas o sem fio cai, o problema está na rede interna — cobertura, canal, posicionamento ou capacidade do roteador."
      },
      {
        "question": "Repetidor de sinal resolve?",
        "answer": "Resolve em situações específicas e piora em outras. Repetidor replica o sinal que recebe: se for instalado onde a recepção já é ruim, ele espalha um sinal ruim e ainda reduz a velocidade disponível. Funciona quando o ponto de instalação tem boa recepção e a área a cobrir é pequena. Para casa com laje ou dois pavimentos, o resultado consistente vem de nós interligados por cabo."
      },
      {
        "question": "Por que o sinal aparece cheio e mesmo assim trava?",
        "answer": "Porque a barra de sinal mede intensidade, não qualidade. É possível receber um sinal forte em um canal disputado por várias redes vizinhas: o aparelho enxerga o roteador, mas passa boa parte do tempo esperando a vez de transmitir. Nesse cenário, mudar de canal ou migrar dispositivos para a faixa de 5 GHz muda mais o resultado do que trocar o roteador."
      },
      {
        "question": "Trocar o roteador da operadora por um melhor adianta?",
        "answer": "Adianta quando o equipamento é o gargalo real, o que acontece com frequência em imóvel com muitos dispositivos conectados. Mas trocar por dedução é caro e às vezes inútil: se a causa é posicionamento, cobertura ou canal congestionado, o aparelho novo repete o mesmo comportamento. Avaliamos o ambiente antes de indicar compra."
      },
      {
        "question": "Vocês atendem rede em apartamento?",
        "answer": "Sim, e é um cenário com característica própria: em prédio, a quantidade de redes vizinhas na mesma faixa é o fator dominante, muito mais do que a área a cobrir. O trabalho costuma envolver escolha de canal, separação das faixas de rádio e cabeamento discreto para os pontos fixos, respeitando as regras do condomínio."
      },
      {
        "question": "Preciso comprar equipamento antes do atendimento?",
        "answer": "Não, e recomendamos que não compre. A definição do que é necessário sai da avaliação do imóvel e do uso real. Comprar antes leva a equipamento incompatível com o cenário ou superdimensionado para a necessidade. Quando há indicação de compra, ela vem com a justificativa técnica do que aquele item resolve."
      },
      {
        "question": "Esse serviço é feito na minha casa ou por coleta?",
        "answer": "Rede é um dos poucos serviços que só faz sentido no local: cobertura depende do imóvel, das paredes e da posição dos aparelhos. A visita técnica avalia o ambiente e apresenta as opções. Não atendemos em balcão — o contato começa pelo WhatsApp e o atendimento acontece no endereço."
      },
      {
        "question": "Qual a garantia do serviço de rede?",
        "answer": "90 dias sobre a mão de obra da configuração e da instalação executadas. Equipamentos seguem a garantia do fabricante. A garantia não cobre instabilidade do link do provedor, mudança de layout do imóvel depois do serviço nem alteração de configuração feita por terceiros."
      }
    ]
  }),
  /* seo:auto-end */
  /* seo:auto-start */
  head: () => seoHead({
    "path": "/problemas/wifi-caindo-toda-hora",
    "title": "Wi-Fi Caindo Toda Hora? Diagnóstico de Rede em Curitiba",
    "description": "Wi-Fi que cai toda hora, sinal que some em um cômodo ou internet lenta só à noite: entenda a diferença entre falha do provedor, do roteador e da cobertura, o que testar antes e como é feito o diagnóstico de rede em Curitiba.",
    "faq": [
      {
        "question": "Wi-Fi caindo é sempre culpa do provedor?",
        "answer": "Não, e existe um teste simples que separa as duas hipóteses: conecte um computador por cabo direto ao roteador e use a internet nessa condição. Se o cabo também cai, a instabilidade está no link ou no equipamento do provedor, e o caminho é abrir chamado com ele. Se o cabo se mantém estável e apenas o sem fio cai, o problema está na rede interna — cobertura, canal, posicionamento ou capacidade do roteador."
      },
      {
        "question": "Repetidor de sinal resolve?",
        "answer": "Resolve em situações específicas e piora em outras. Repetidor replica o sinal que recebe: se for instalado onde a recepção já é ruim, ele espalha um sinal ruim e ainda reduz a velocidade disponível. Funciona quando o ponto de instalação tem boa recepção e a área a cobrir é pequena. Para casa com laje ou dois pavimentos, o resultado consistente vem de nós interligados por cabo."
      },
      {
        "question": "Por que o sinal aparece cheio e mesmo assim trava?",
        "answer": "Porque a barra de sinal mede intensidade, não qualidade. É possível receber um sinal forte em um canal disputado por várias redes vizinhas: o aparelho enxerga o roteador, mas passa boa parte do tempo esperando a vez de transmitir. Nesse cenário, mudar de canal ou migrar dispositivos para a faixa de 5 GHz muda mais o resultado do que trocar o roteador."
      },
      {
        "question": "Trocar o roteador da operadora por um melhor adianta?",
        "answer": "Adianta quando o equipamento é o gargalo real, o que acontece com frequência em imóvel com muitos dispositivos conectados. Mas trocar por dedução é caro e às vezes inútil: se a causa é posicionamento, cobertura ou canal congestionado, o aparelho novo repete o mesmo comportamento. Avaliamos o ambiente antes de indicar compra."
      },
      {
        "question": "Vocês atendem rede em apartamento?",
        "answer": "Sim, e é um cenário com característica própria: em prédio, a quantidade de redes vizinhas na mesma faixa é o fator dominante, muito mais do que a área a cobrir. O trabalho costuma envolver escolha de canal, separação das faixas de rádio e cabeamento discreto para os pontos fixos, respeitando as regras do condomínio."
      },
      {
        "question": "Preciso comprar equipamento antes do atendimento?",
        "answer": "Não, e recomendamos que não compre. A definição do que é necessário sai da avaliação do imóvel e do uso real. Comprar antes leva a equipamento incompatível com o cenário ou superdimensionado para a necessidade. Quando há indicação de compra, ela vem com a justificativa técnica do que aquele item resolve."
      },
      {
        "question": "Esse serviço é feito na minha casa ou por coleta?",
        "answer": "Rede é um dos poucos serviços que só faz sentido no local: cobertura depende do imóvel, das paredes e da posição dos aparelhos. A visita técnica avalia o ambiente e apresenta as opções. Não atendemos em balcão — o contato começa pelo WhatsApp e o atendimento acontece no endereço."
      },
      {
        "question": "Qual a garantia do serviço de rede?",
        "answer": "90 dias sobre a mão de obra da configuração e da instalação executadas. Equipamentos seguem a garantia do fabricante. A garantia não cobre instabilidade do link do provedor, mudança de layout do imóvel depois do serviço nem alteração de configuração feita por terceiros."
      }
    ]
  }),
  /* seo:auto-end */
  component: ProblemaWifiCaindoTodaHora,
});
