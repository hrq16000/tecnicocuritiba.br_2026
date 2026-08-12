import type { ServicoBairroData } from "@/pages/servico-bairro/ServicoBairroTemplate";

/**
 * Fábrica de dados para landings de bairro (indexáveis) dos serviços
 * de Wi-Fi e Manutenção de TV Smart. Cada bairro recebe copy própria
 * (pontos de referência, tempo médio de atendimento e FAQ localizada).
 */

interface BairroContext {
  slug: string;
  nome: string;
  pontosReferencia: string[];
  tempoAtendimento: string;
  bairrosProximos: { nome: string; slug: string }[];
  descricaoLocal: string;
  /**
   * Bloco narrativo exclusivo (≥ 220 palavras próprias) que sustenta a
   * exigência de uniqueness da política de poda. Obrigatório para novos
   * bairros âncora — validado por scripts/validate-bairro-copy.mjs.
   */
  narrativaLocal?: string;
  /**
   * Governa `noindex` no template. `undefined` (âncoras herdadas) → true.
   * Rebaixamentos usam `false` explicitamente para virar `noindex`.
   */
  indexable?: boolean;
}


export const BAIRROS_INDEXAVEIS: Record<string, BairroContext> = {
  batel: {
    slug: "batel",
    nome: "Batel",
    pontosReferencia: ["Shopping Curitiba", "Praça do Japão", "Av. do Batel", "Rua Comendador Araújo"],
    tempoAtendimento: "atendimento agendado na triagem, conforme a disponibilidade da agenda",
    bairrosProximos: [
      { nome: "Água Verde", slug: "agua-verde" },
      { nome: "Centro", slug: "centro" },
      { nome: "Bigorrilho", slug: "bigorrilho" },
    ],
    descricaoLocal:
      "O Batel concentra residências de alto padrão, escritórios e coworkings — cenários em que rede estável e Smart TV funcionando são essenciais para trabalho remoto e reuniões.",
    narrativaLocal:
      "O Batel reúne torres residenciais de alto padrão, salas comerciais e coworkings em um raio curto, o que cria uma densidade de redes sem fio raramente vista em outras regiões de Curitiba. Nas varreduras de espectro que fazemos na Avenida do Batel e na Rua Comendador Araújo, é normal enxergar mais de quarenta SSIDs simultâneos disputando os mesmos canais, com repetidores mal configurados dos vizinhos derrubando a estabilidade de quem trabalha em videoconferência. Nossa rotina começa medindo relação sinal-ruído sala a sala, migrando o cliente para faixa 5 GHz com largura de banda controlada e definindo canais fixos em vez de seleção automática, que fica trocando durante reuniões. Em escritórios do bairro criamos redes separadas para colaboradores, visitantes e equipamentos de automação predial, além de reserva de banda para telefonia IP. Nos apartamentos, planejamos o posicionamento dos nós considerando armários embutidos, drywall com estrutura metálica e vidros laminados das sacadas, que atenuam mais do que a maioria dos moradores imagina. Na frente de imagem, o padrão local são televisores premium de 65 e 75 polegadas instalados em painéis suspensos de marcenaria planejada, muitas vezes com cabeamento embutido sem folga. Retiramos o aparelho com dois profissionais para não danificar o acabamento, avaliamos em bancada com fonte externa controlada e devolvemos com relatório fotográfico das placas substituídas. Falhas mais frequentes que registramos por aqui envolvem placa de fonte com capacitores ressecados por ambientes aquecidos junto a lareira elétrica, além de módulos de conectividade que perdem a comunicação depois de atualizações interrompidas por oscilação de energia. Sempre priorizamos recuperar o aparelho original, porque a substituição de linhas premium costuma custar várias vezes o reparo. Antes de qualquer execução enviamos o laudo pelo WhatsApp com o escopo aprovado, prazo estimado e condições de garantia contadas em dias corridos, e deixamos documentada a configuração final da rede para que a administração do condomínio ou a equipe interna de TI consiga dar continuidade sem retrabalho.",
  },
  centro: {
    slug: "centro",
    nome: "Centro",
    pontosReferencia: ["Rua XV de Novembro", "Praça Tiradentes", "Boca Maldita", "Catedral"],
    tempoAtendimento: "atendimento agendado na triagem, conforme a disponibilidade da agenda",
    bairrosProximos: [
      { nome: "Batel", slug: "batel" },
      { nome: "Água Verde", slug: "agua-verde" },
      { nome: "Rebouças", slug: "reboucas" },
    ],
    descricaoLocal:
      "No Centro atendemos escritórios, clínicas, comércio e residências históricas — ambientes com desafios específicos de cabeamento, roteador antigo e antenas coletivas.",
    narrativaLocal:
      "O Centro de Curitiba impõe desafios que não aparecem em bairros novos: edifícios erguidos entre as décadas de 1950 e 1980, paredes espessas de alvenaria maciça, prumadas elétricas antigas e antenas coletivas que ainda distribuem sinal por cabo coaxial degradado. Em muitos endereços da Rua XV de Novembro e das galerias próximas à Praça Tiradentes, encontramos tomadas sem aterramento adequado, o que provoca reinícios espontâneos de televisores e perda de conexão em roteadores alimentados por fontes chaveadas baratas. Por isso, nossa inspeção começa medindo tensão entre neutro e terra antes de discutir qualquer troca de equipamento. Nas salas comerciais, o padrão de demanda é bem diferente do residencial: consultórios, escritórios contábeis, lojas e prestadores de serviço precisam de rede estável para emissão fiscal, maquininhas de cartão, catracas e câmeras. Montamos topologias com cabeamento estruturado sempre que o forro permite, evitando cascatas de repetidores que degradam latência a cada salto. Quando não é possível passar cabo, usamos rádios com backhaul dedicado e travamos potência para não invadir a rede do vizinho de andar. Na parte de imagem, o Centro concentra televisores de uso intensivo, ligados dez a quatorze horas por dia em recepções, lanchonetes e vitrines. Esse regime acelera falhas de backlight e ressecamento de capacitores, e é muito comum recebermos aparelhos com listras verticais, tela escura com som normal ou desligamento cíclico. Coletamos no endereço comercial em horário combinado para não interromper o expediente, avaliamos em bancada com câmera térmica e devolvemos com teste de queima prolongado, garantindo que o defeito não retorne em poucos dias. Também orientamos sobre estabilização elétrica e ventilação dos nichos de marcenaria, causa raiz frequente em pontos comerciais fechados. Todo o processo é registrado por escrito, com escopo aprovado previamente pelo WhatsApp, valor combinado antes da execução e nota das peças efetivamente aplicadas, o que dá previsibilidade para quem administra o negócio e precisa justificar a despesa.",
  },
  "agua-verde": {
    slug: "agua-verde",
    nome: "Água Verde",
    pontosReferencia: ["Av. República Argentina", "Parque da Água Verde", "Shopping Água Verde"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba central-sul",
    bairrosProximos: [
      { nome: "Batel", slug: "batel" },
      { nome: "Portão", slug: "portao" },
      { nome: "Centro", slug: "centro" },
    ],
    descricaoLocal:
      "Água Verde reúne muitos prédios residenciais e escritórios — áreas onde interferência de Wi-Fi entre vizinhos e Smart TVs mais antigas são queixas comuns.",
    narrativaLocal:
      "Água Verde é um dos bairros mais verticalizados de Curitiba e a maior parte dos chamados que recebemos vem de apartamentos entre 60 e 120 metros quadrados situados em edifícios próximos à Avenida República Argentina. A altura dos prédios muda completamente o comportamento do sinal sem fio: em andares elevados, a antena do roteador enxerga dezenas de redes de torres vizinhas, e o excesso de vizinhança gera colisões constantes mesmo com boa velocidade contratada. Nesses casos, reduzir a largura de canal, fixar frequência e reposicionar o roteador para longe de quadros de energia e caixas de passagem costuma resolver mais do que trocar de aparelho. Também é recorrente aqui o uso de extensores comprados por conta própria, instalados em pontos onde já não há sinal aceitável para replicar, o que apenas duplica o problema; nesses atendimentos, reaproveitamos o equipamento quando é possível operá-lo em modo ponto de acesso com cabo. O perfil de televisor do bairro é intermediário, entre 43 e 55 polegadas, muitas vezes instalado em quartos e salas compactas, encaixado em nichos com pouca ventilação. Esse detalhe explica boa parte das falhas que diagnosticamos: superaquecimento constante que degrada a fonte e o driver de backlight antes do tempo. Ao coletar o aparelho, registramos fotos do nicho e sugerimos afastamento mínimo para prolongar a vida útil depois do reparo. No laboratório, testamos barras de LED individualmente, medimos corrente de acionamento e só indicamos substituição de painel quando o custo realmente não compensa, apresentando comparação honesta com o preço de um modelo equivalente novo. Atendemos também síndicos e zeladores do bairro que precisam padronizar redes de portaria, interfonia digital e câmeras, separando esses serviços críticos do tráfego de moradores e prestadores. Cada visita termina com um resumo enviado pelo WhatsApp contendo o que foi configurado, senhas atualizadas, canais escolhidos e recomendações de manutenção preventiva para os próximos meses, sem cobrança adicional por essa documentação.",
  },
  cic: {
    slug: "cic",
    nome: "CIC",
    pontosReferencia: ["Terminal do CIC", "Parque Industrial", "Shopping Palladium"],
    tempoAtendimento: "atendimento agendado na triagem, conforme a disponibilidade da agenda",
    bairrosProximos: [
      { nome: "Portão", slug: "portao" },
      { nome: "Fazendinha", slug: "fazendinha" },
      { nome: "Campo Comprido", slug: "campo-comprido" },
    ],
    descricaoLocal:
      "O CIC é a maior região habitacional de Curitiba, com casas amplas e residências que frequentemente precisam de sistemas mesh para cobrir toda a metragem.",
    narrativaLocal:
      "A Cidade Industrial de Curitiba é a maior região habitacional do município e a nossa operação por lá lida com um cenário bem específico: terrenos maiores, casas de dois pavimentos ampliadas ao longo dos anos, edículas nos fundos e muros altos de concreto. O resultado prático é que um único roteador entregue pela operadora, quase sempre instalado no cômodo da frente onde chega a fibra, deixa quarto dos fundos, garagem e área de churrasco sem cobertura utilizável. Nossa solução padrão combina um nó principal reposicionado no eixo central da residência com nós secundários interligados por cabo de rede lançado por eletroduto externo ou canaleta discreta, entregando sinal consistente até a edícula sem depender de repetição por rádio. Em residências com muita laje e reforma sem projeto elétrico unificado, medimos também a qualidade do aterramento, porque oscilações da rede local afetam tanto o modem quanto o televisor. A CIC concentra ainda muitos pequenos negócios domiciliares, como salões, oficinas e lojas de bairro, que precisam de rede confiável para maquininha, sistema de vendas e câmeras acessíveis pelo celular. Para esses casos, separamos a rede da família da rede do negócio, o que reduz risco e evita queda de desempenho quando alguém assiste streaming em alta resolução. Na frente de televisores, o parque instalado no bairro tende a ser de aparelhos com cinco a dez anos de uso e alto tempo de tela ligada, o que gera uma incidência elevada de fonte queimada após picos de energia e de barras de LED com iluminação irregular. Fazemos a coleta no endereço, embalamos com proteção rígida para o transporte e devolvemos o aparelho testado, com garantia formalizada por escrito. Nunca prometemos valor antes do diagnóstico em bancada, e quando o reparo não compensa dizemos com clareza, apresentando alternativas em vez de empurrar serviço. Esse critério é o que sustenta o volume de indicações que recebemos entre vizinhos da região.",
  },
  portao: {
    slug: "portao",
    nome: "Portão",
    pontosReferencia: ["Shopping Palladium", "Rua Padre Anchieta", "Parque do Barigui (proximidades)"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba sul-oeste",
    bairrosProximos: [
      { nome: "Água Verde", slug: "agua-verde" },
      { nome: "CIC", slug: "cic" },
      { nome: "Fazendinha", slug: "fazendinha" },
    ],
    descricaoLocal:
      "Portão combina residencial e comercial, com comércio local que depende de rede estável para maquininhas, câmeras e Smart TVs em salas de espera.",
    narrativaLocal:
      "O Portão tem uma mistura equilibrada entre ruas residenciais tranquilas e corredores comerciais movimentados, e essa dupla vocação define os chamados que atendemos. Nas residências, o cenário mais comum são sobrados e casas geminadas com paredes internas próximas e caixas de disjuntores instaladas justamente no ponto em que a operadora deixou o modem, o que atrapalha a propagação. Reposicionamos o equipamento, ajustamos potência para evitar que o celular fique preso em um nó distante e configuramos transição suave entre pontos de acesso, algo que a maioria dos kits vendidos em varejo não faz corretamente sem intervenção manual. Já no comércio das ruas Padre Anchieta e adjacências, a prioridade é continuidade operacional: maquininha de cartão, sistema de pedidos, impressora fiscal e câmeras não podem cair em horário de pico. Montamos rede segregada para clientes, limitamos banda do acesso público e deixamos os equipamentos críticos em faixa própria, com endereçamento fixo para facilitar suporte remoto quando algo trava. Em salões, clínicas e escritórios com sala de espera, o televisor é parte da experiência do cliente e costuma ficar ligado o dia inteiro, condição que antecipa desgaste de fonte e de placa principal. Nesses atendimentos, priorizamos janelas de coleta fora do horário de atendimento ao público, para que o negócio não fique sem o aparelho durante o movimento. O diagnóstico é feito em bancada, com registro fotográfico das placas, medição ponto a ponto e teste prolongado antes da devolução. Também é frequente no bairro o pedido de reorganização de cabeamento aparente acumulado por instalações sucessivas de provedores diferentes; nesse serviço, identificamos cada ponto, removemos o que está morto e etiquetamos o que permanece ativo. Ao final, enviamos pelo WhatsApp um resumo com o mapa simplificado da instalação, senhas, canais e recomendações, mantendo transparência total sobre o que foi executado e sobre o que fica sugerido para uma etapa futura, sem obrigação de contratação imediata.",
  },
  bigorrilho: {
    slug: "bigorrilho",
    nome: "Bigorrilho",
    pontosReferencia: ["Shopping Mueller (proximidades)", "Praça do Expedicionário", "Champagnat"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba centro-oeste",
    bairrosProximos: [
      { nome: "Batel", slug: "batel" },
      { nome: "Centro", slug: "centro" },
      { nome: "Santa Felicidade", slug: "santa-felicidade" },
    ],
    descricaoLocal:
      "Bigorrilho tem forte perfil residencial vertical, com prédios altos e Smart TVs grandes onde reparo de painel e ajuste de mesh entre andares são frequentes.",
    narrativaLocal:
      "O Bigorrilho, junto à região do Champagnat, é dominado por edifícios altos e apartamentos com plantas alongadas, nas quais o comprimento entre a sala e a suíte do fundo supera o alcance confortável de um único roteador. Somam-se a isso estruturas de drywall com montantes metálicos, portas de vidro e espelhos amplos, todos elementos que refletem e atenuam sinal de forma difícil de prever sem medição. Por isso, cada atendimento no bairro começa com um levantamento de cobertura cômodo a cômodo, anotando potência recebida e vazão real, e só depois definimos quantos pontos são necessários. Em geral, dois nós bem posicionados resolvem melhor do que três instalados sem critério, e sempre que o apartamento possui tubulação livre optamos por interligação cabeada, que preserva a velocidade contratada. Outro ponto característico da região é a quantidade de home offices em suítes convertidas, com demanda de chamadas de vídeo contínuas, transferência de arquivos pesados e acesso remoto a servidores da empresa; para esses usuários, configuramos prioridade de tráfego e verificamos estabilidade de envio, não apenas de recebimento. Nos televisores, o perfil predominante são aparelhos grandes, de 65 polegadas ou mais, instalados em painéis suspensos com fixação embutida e cabos sem folga, o que exige desmontagem cuidadosa e dois técnicos para retirada segura. As falhas mais comuns que registramos envolvem placa principal com módulo de rede instável, tela apagada com áudio funcionando e manchas causadas por pressão indevida na montagem. Trabalhamos com diagnóstico em bancada, teste de barras de retroiluminação individualmente e substituição pontual de componentes sempre que possível, evitando a troca de conjuntos inteiros quando o defeito é localizado. Toda a proposta é enviada por escrito antes da execução, com prazo, escopo e garantia formal. Também explicamos ao morador como o consumo de energia e a ventilação do painel de marcenaria influenciam a durabilidade, orientação simples que evita a repetição do mesmo defeito depois de alguns meses.",
  },
  cabral: {
    slug: "cabral",
    nome: "Cabral",
    pontosReferencia: ["Estádio Couto Pereira", "Praça Redonda", "Av. Paraná"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba centro-norte",
    bairrosProximos: [
      { nome: "Boa Vista", slug: "boa-vista" },
      { nome: "Cristo Rei", slug: "cristo-rei" },
      { nome: "Centro", slug: "centro" },
    ],
    descricaoLocal:
      "O Cabral mistura casas antigas e prédios novos — cenários em que cabeamento herdado e antenas coletivas exigem diagnóstico antes de instalar mesh ou nova Smart TV.",
    narrativaLocal:
      "O Cabral vive um momento de transição urbana marcante: casas assobradadas dos anos 1970 convivem com empreendimentos recentes de alto padrão, e essa mistura aparece diretamente nos atendimentos. Nas residências mais antigas, herdamos instalações com telefonia legada, tubulação estreita e pontos de televisão distribuídos por coaxial que já não atende a demanda atual; nesses casos, avaliamos o que pode ser reaproveitado como conduíte para lançar cabo de rede e evitamos obra desnecessária. Nos prédios novos, o desafio muda de figura e passa a ser convivência de dezenas de redes na mesma prumada, além de automação residencial que ocupa a faixa de 2,4 GHz com sensores, lâmpadas e assistentes. Separar dispositivos inteligentes em uma rede dedicada é a medida que mais reduz reclamação de queda intermitente por aqui. A proximidade do estádio Couto Pereira também influencia o perfil de uso: há forte concentração de moradores que assistem transmissões esportivas ao vivo, o que torna intolerável qualquer travamento durante partidas. Nesses lares, testamos vazão sustentada em horário de pico, ajustamos buffer dos aplicativos e verificamos se o aparelho está usando a faixa correta, já que muitos televisores insistem em conectar na frequência mais congestionada. Do lado do reparo, recebemos com frequência aparelhos com problema de placa principal após tempestades, além de falhas em módulos de fonte causadas por variação de tensão em ruas com rede aérea antiga. Fazemos a retirada no endereço, protegemos o aparelho para transporte e realizamos diagnóstico completo em bancada, com laudo fotográfico e valor apresentado somente após a avaliação real do defeito. Quando o cliente prefere adiar, entregamos o parecer mesmo assim, sem vínculo de contratação. Encerramos cada atendimento documentando a configuração final e recomendando, quando aplicável, correções elétricas simples que reduzem drasticamente a chance de nova queima do mesmo componente nos próximos meses de uso.",
  },
  "santa-felicidade": {
    slug: "santa-felicidade",
    nome: "Santa Felicidade",
    pontosReferencia: ["Av. Manoel Ribas", "Bosque Italiano", "Cascatinha"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba noroeste",
    bairrosProximos: [
      { nome: "Bigorrilho", slug: "bigorrilho" },
      { nome: "Cascatinha", slug: "cascatinha" },
      { nome: "Campo Comprido", slug: "campo-comprido" },
    ],
    descricaoLocal:
      "Santa Felicidade concentra casas amplas e restaurantes, onde cobertura Wi-Fi em áreas externas e reparo de TV grande são as demandas recorrentes.",
    narrativaLocal:
      "Santa Felicidade tem uma característica que muda toda a estratégia técnica: terrenos grandes, casas com muitos ambientes, áreas externas de convivência e um comércio tradicional de restaurantes e cantinas com salões amplos. Cobrir esse tipo de imóvel com o roteador padrão da operadora é impossível, e as tentativas caseiras costumam terminar em uma sequência de repetidores encadeados que derruba a velocidade a cada salto. Nossa abordagem privilegia infraestrutura: definimos um ponto central, lançamos cabo até pontos estratégicos e usamos unidades preparadas para ambiente externo quando é necessário cobrir varanda gourmet, quintal ou estacionamento. Nos estabelecimentos gastronômicos do bairro, o requisito é diferente do residencial, porque envolve rede para clientes, sistema de comandas, impressoras de cozinha e câmeras de segurança operando ao mesmo tempo. Fazemos a separação lógica desses serviços e reservamos banda para o que é crítico, evitando que o acesso liberado aos visitantes prejudique o funcionamento do salão em noites cheias. Também avaliamos interferência gerada por fornos, motores e equipamentos de refrigeração, que impactam mais a estabilidade do que a maioria dos proprietários supõe. No campo de imagem, atendemos muitos televisores instalados em salões e áreas semiabertas, expostos a variação de temperatura e umidade, condição que acelera corrosão em conectores e falha de fonte. Recebemos com frequência aparelhos com imagem intermitente, faixas horizontais e desligamento após aquecimento, defeitos que exigem teste prolongado para reproduzir. Por isso, mantemos o aparelho em bancada por tempo suficiente para confirmar a correção antes de devolver, mesmo que isso alongue um pouco o prazo. A coleta é combinada previamente e o transporte é feito com proteção reforçada, considerando as vias e o volume dos aparelhos maiores comuns na região. Todo escopo é aprovado por escrito antes da execução, com garantia formal e registro das peças aplicadas, prática que dá segurança tanto para famílias quanto para estabelecimentos que dependem do equipamento em operação diária.",
  },
  "boa-vista": {
    slug: "boa-vista",
    nome: "Boa Vista",
    pontosReferencia: ["Shopping Barigüi (proximidades)", "Terminal Boa Vista", "Av. Paraná"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba norte",
    bairrosProximos: [
      { nome: "Cabral", slug: "cabral" },
      { nome: "Cristo Rei", slug: "cristo-rei" },
      { nome: "Bacacheri", slug: "bacacheri" },
    ],
    descricaoLocal:
      "Boa Vista tem grande volume residencial e comércio de bairro — perfil em que roteador da operadora não cobre a casa toda e Smart TVs de médio porte precisam de manutenção.",
    narrativaLocal:
      "A Boa Vista concentra um volume enorme de residências de porte médio, ruas com comércio de proximidade e um fluxo constante de moradores que trabalham em casa parte da semana. Nos atendimentos por lá, o problema mais recorrente não é falta de velocidade contratada, e sim distribuição: o modem chega instalado no cômodo em que a fibra entrou, geralmente colado à parede da frente, e os cômodos posteriores ficam com sinal fraco justamente onde as pessoas usam computador e televisor. Corrigimos isso com reposicionamento, ajuste de canais e, quando necessário, um segundo ponto de acesso interligado por cabo, solução que custa pouco e resolve de forma definitiva sem depender de repetidor por rádio. Verificamos ainda a idade do equipamento fornecido pela operadora, porque muitos modelos antigos ainda em uso não suportam o número de aparelhos conectados de uma casa atual, com celulares, televisores, consoles e câmeras simultâneos. No comércio de rua da região, atendemos padarias, mercados de bairro e prestadores que precisam manter maquininha e sistema de vendas estáveis, além de câmeras acessíveis remotamente pelo proprietário. Nesses casos, separamos a rede operacional do acesso de clientes e documentamos a instalação para facilitar futuras manutenções. Na frente de reparo, o parque de televisores do bairro é majoritariamente de aparelhos entre 43 e 55 polegadas com uso familiar intenso, e os defeitos que mais registramos são fonte com componentes ressecados, barras de retroiluminação com queda parcial e placas afetadas por descarga elétrica em dias de tempestade. Coletamos no endereço, diagnosticamos em bancada com instrumentação adequada e devolvemos o aparelho testado, com garantia registrada por escrito. Explicamos sempre a diferença entre o que é reparo viável e o que se tornou substituição inevitável, apresentando comparação de custo honesta. Essa clareza, somada ao combinado de valor antes da execução, é o que torna o atendimento previsível para quem mora ou empreende na região.",
  },
  "cristo-rei": {
    slug: "cristo-rei",
    nome: "Cristo Rei",
    pontosReferencia: ["UFPR Politécnico", "Praça Osório de Almeida", "Av. Sete de Setembro"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba leste-central",
    bairrosProximos: [
      { nome: "Jardim Botânico", slug: "jardim-botanico" },
      { nome: "Cabral", slug: "cabral" },
      { nome: "Centro", slug: "centro" },
    ],
    descricaoLocal:
      "Cristo Rei mistura residências, universidades e escritórios técnicos — onde estabilidade de Wi-Fi para estudo/trabalho remoto é crítica e TVs de médio porte são padrão.",
    indexable: false,
  },
  cajuru: {
    slug: "cajuru",
    nome: "Cajuru",
    pontosReferencia: ["Terminal Cajuru", "Av. das Torres", "Parque Náutico"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba leste",
    bairrosProximos: [
      { nome: "Boqueirão", slug: "boqueirao" },
      { nome: "Jardim Botânico", slug: "jardim-botanico" },
      { nome: "Uberaba", slug: "uberaba" },
    ],
    descricaoLocal:
      "O Cajuru é uma das regiões residenciais mais populosas de Curitiba — muitas casas com Wi-Fi limitado ao roteador da operadora e Smart TVs que precisam de reparo de fonte com frequência.",
    indexable: false,
  },
  boqueirao: {
    slug: "boqueirao",
    nome: "Boqueirão",
    pontosReferencia: ["Terminal Boqueirão", "Av. Marechal Floriano", "Rodoferroviária (proximidades)"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba sudeste",
    bairrosProximos: [
      { nome: "Cajuru", slug: "cajuru" },
      { nome: "Hauer", slug: "hauer" },
      { nome: "Xaxim", slug: "xaxim" },
    ],
    descricaoLocal:
      "Boqueirão é um grande bairro residencial com muito comércio local — atendimentos de Wi-Fi para casas grandes e conserto de TV com uso intenso predominam.",
    indexable: false,
  },
  "jardim-das-americas": {
    slug: "jardim-das-americas",
    nome: "Jardim das Américas",
    pontosReferencia: ["UFPR Centro Politécnico", "Parque Reinhard Maack", "Av. Prefeito Lothário Meissner"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba leste universitário",
    bairrosProximos: [
      { nome: "Cristo Rei", slug: "cristo-rei" },
      { nome: "Jardim Botânico", slug: "jardim-botanico" },
      { nome: "Guabirotuba", slug: "guabirotuba" },
    ],
    descricaoLocal:
      "Jardim das Américas gira em torno do Centro Politécnico da UFPR — muita república estudantil, laboratório doméstico e casas de professores que exigem Wi-Fi estável para aulas remotas e Smart TVs de médio porte para estudo em grupo.",
    narrativaLocal:
      "No Jardim das Américas, o perfil de demanda é fortemente influenciado pelo Centro Politécnico da UFPR e pelos laboratórios de pesquisa da região. Encontramos com frequência repúblicas estudantis com Wi-Fi saturado por múltiplos dispositivos simultâneos, docentes que trabalham em casa e precisam de rede segmentada para reuniões acadêmicas, e famílias em residências dos anos 1980–2000 cujo cabeamento coaxial da antena coletiva ainda influencia o desempenho das Smart TVs modernas. As casas típicas do bairro têm laje, muitas paredes internas e áreas de serviço nos fundos, o que gera zonas mortas quando o roteador da operadora fica na sala. Nossa abordagem começa pela análise de espectro para mapear canais congestionados na faixa 2,4 GHz — comum onde muitos vizinhos compartilham a mesma frequência — e pela indicação de mesh de dois ou três nós posicionados de forma a cobrir salas de estudo e áreas externas. Para Smart TVs, o padrão que vemos são aparelhos de 43\" a 55\" com fontes chaveadas que sofrem com a variação de tensão típica da rede elétrica antiga do bairro; muitas placas T-CON e capacitores de fonte cedem entre cinco e sete anos de uso. Coletamos a TV, executamos diagnóstico em bancada e devolvemos com garantia formal registrada por WhatsApp, sempre priorizando reparo antes de sugerir substituição. Também recebemos chamados de moradores próximos à Rua Coronel Francisco Heráclito dos Santos e à Alameda Prudente de Moraes, onde prédios recentes convivem com sobrados antigos e a mistura de estruturas dificulta cobertura uniforme. Em atendimentos noturnos, priorizamos ajustes que não exigem passagem de cabo aparente, respeitando o padrão estético dos imóveis, e deixamos documentação da senha, do canal escolhido e do posicionamento dos nós mesh para que o cliente consiga replicar a lógica no futuro. Para estudantes, aplicamos limites de banda por dispositivo quando há streaming pesado paralelo a videoaula, evitando queda de qualidade nas chamadas ao vivo. E, para docentes que gravam material didático em casa, priorizamos canais menos concorridos e verificamos a estabilidade de upload antes de encerrar a visita.",
    indexable: true,
  },
  ecoville: {
    slug: "ecoville",
    nome: "Ecoville",
    pontosReferencia: ["Parque Barigui (proximidades)", "Av. Comendador Franco (Ecoville)", "Universidade Positivo"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba oeste",
    bairrosProximos: [
      { nome: "Mossunguê", slug: "mossungue" },
      { nome: "Campo Comprido", slug: "campo-comprido" },
      { nome: "Santa Felicidade", slug: "santa-felicidade" },
    ],
    descricaoLocal:
      "Ecoville é polo residencial premium de Curitiba, com edifícios de alto padrão, home offices exigentes e Smart TVs grandes — cenário em que mesh corporativo, redes segmentadas e reparo de painéis QLED/OLED são recorrentes.",
    narrativaLocal:
      "O Ecoville tem uma característica bem definida: edifícios residenciais de alto padrão com apartamentos de 150 m² ou mais, muitos com automação (Alexa, Google Home, câmeras IP, fechaduras eletrônicas) que competem pelo mesmo espectro Wi-Fi. Nesse cenário, o roteador único da operadora praticamente nunca cobre a planta inteira e a interferência entre redes vizinhas na faixa 5 GHz costuma ser tão intensa quanto na 2,4 GHz. Configuramos sistemas mesh de três nós com backhaul dedicado, criamos SSIDs separados para trabalho, convidados e IoT, e reservamos canais DFS quando o roteador suporta — reduzindo latência para videoconferência em home office. As Smart TVs do Ecoville costumam ser modelos premium acima de 55\", frequentemente QLED e OLED da Samsung, LG e Sony, com placas caras e disponibilidade limitada. Executamos diagnóstico em bancada com câmera térmica para identificar falhas de backlight LED antes de indicar troca de painel, e trabalhamos com fornecedores de peças originais quando o reparo compensa. Para o cliente do Ecoville, transparência de valor do atendimento e garantia formal via WhatsApp são inegociáveis — todo laudo é entregue por escrito antes de qualquer execução, com prazos claros e comparativo entre reparo e substituição. Também é comum no bairro a existência de home theaters dedicados, com receiver AV, projetor 4K e sistemas de som multicanal — instalações onde a estabilidade da rede impacta diretamente o streaming em alta resolução via Apple TV, Nvidia Shield ou consoles de última geração. Verificamos vazão real por dispositivo, priorização de tráfego (QoS) e integração com fechaduras e câmeras Wi-Fi, que muitas vezes forçam o roteador a alternar canais e derrubam clientes 5 GHz. Nas coletas de TV, retiramos o aparelho embalado, transportamos com proteção rígida contra vibração da via elevada, e devolvemos com relatório técnico contendo fotos das placas trocadas, número de série e prazo de garantia contado por dias corridos. Quando o cliente prefere não fazer o reparo, entregamos comparativo entre substituir por um modelo equivalente atual e reparar o aparelho existente, para que a decisão financeira seja informada.",
    // Onda 1 de liberação de índice: narrativa exclusiva ≥300 palavras + entrada no sitemap curado.
    indexable: true,
  },
  "alto-da-xv": {
    slug: "alto-da-xv",
    nome: "Alto da XV",
    pontosReferencia: ["Rua Padre Anchieta (topo)", "Praça 29 de Março", "Colégio Estadual do Paraná (proximidades)"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba centro-leste",
    bairrosProximos: [
      { nome: "Centro", slug: "centro" },
      { nome: "Cristo Rei", slug: "cristo-rei" },
      { nome: "Cabral", slug: "cabral" },
    ],
    descricaoLocal:
      "Alto da XV combina residências verticais consolidadas, escritórios profissionais e pequenos comércios de rua — cenário em que Wi-Fi entre apartamentos disputa espectro e Smart TVs de 5–10 anos exigem reparo em vez de troca.",
    narrativaLocal:
      "Alto da XV é um dos bairros mais tradicionais da região central de Curitiba e concentra edifícios verticais de duas décadas ou mais, muitos com estrutura interna de concreto denso que atenua fortemente o sinal Wi-Fi entre cômodos. É comum encontrar salas de 40 m² onde o notebook conecta em 300 Mbps na entrada e cai para 40 Mbps na varanda. Aqui nossa recomendação padrão é reposicionar o roteador principal para o eixo central do apartamento, usar repetidores com backhaul cabeado (aproveitando pontos elétricos existentes) e, quando o cliente aceita, passar cabo CAT6 discreto pelo forro. O bairro também abriga muitos consultórios odontológicos, contábeis e advocatícios em salas comerciais — perfis que exigem rede segmentada para paciente/cliente e VoIP estável. Nas Smart TVs, o padrão do Alto da XV são aparelhos entre 5 e 10 anos, ainda LED de qualidade (Samsung série 6/7, LG UM/UN), cujo defeito típico é fonte com capacitores estufados ou backlight parcial. Compensa reparar: o painel funciona, a placa custa uma fração de uma TV nova, e a estética se preserva. Coletamos, diagnosticamos em bancada com laudo por escrito e devolvemos com garantia formal via WhatsApp — sem promessa de valor antes da avaliação. Também prestamos suporte a moradores próximos à Praça 29 de Março e à Rua Padre Anchieta, onde a arborização densa e as construções antigas conjugam sombreamento e ruído elétrico que impactam roteadores e Smart TVs igualmente. Em vários atendimentos, identificamos aterramento residencial precário como causa raiz de reinícios espontâneos da TV — antes de trocar peça, medimos tensão de terra e orientamos correção elétrica quando aplicável. Em salas comerciais menores do eixo, configuramos VLAN para separar clientes de máquinas de cartão e câmeras, reduzindo risco de invasão lateral. Também documentamos por escrito o layout final da rede, com nome de cada nó, canal, potência e MAC do gateway, deixando um manual simples que o próximo profissional consegue continuar sem retrabalho.",
    // Onda 1 de liberação de índice: narrativa exclusiva ≥300 palavras + entrada no sitemap curado.
    indexable: true,
  },
  reboucas: {
    slug: "reboucas",
    nome: "Rebouças",
    pontosReferencia: ["Shopping Estação", "Rodoferroviária de Curitiba", "Av. Sete de Setembro (Rebouças)"],
    tempoAtendimento: "atendimento agendado na triagem, com cobertura em Curitiba central-sul",
    bairrosProximos: [
      { nome: "Centro", slug: "centro" },
      { nome: "Água Verde", slug: "agua-verde" },
      { nome: "Prado Velho", slug: "prado-velho" },
    ],
    descricaoLocal:
      "Rebouças reúne comércio de rua, Shopping Estação, agências e residências verticais próximas ao Centro — perfil misto onde rede empresarial estável e Smart TVs em ambientes de espera são as demandas mais frequentes.",
    narrativaLocal:
      "Rebouças é uma das áreas com uso mais misto de Curitiba: eixo comercial da Av. Sete de Setembro, entorno do Shopping Estação e da Rodoferroviária, agências bancárias, clínicas médicas e edifícios residenciais dividem o mesmo perímetro. Isso cria dois padrões distintos de atendimento. No lado comercial, os pedidos giram em torno de rede estável para maquininhas de cartão, câmeras IP, controle de ponto e Smart TVs em salas de espera — ambientes que exigem SSID isolado, controle de banda por dispositivo e cabeamento estruturado quando o mobiliário permite. No residencial, a característica marcante são apartamentos de dois ou três dormitórios em prédios verticais, com cozinha americana e área de serviço no fundo, onde o roteador padrão da operadora deixa a suíte principal descoberta. Nesse caso, mesh de dois nós resolve na maior parte dos casos, e evitamos vender equipamento desnecessário quando o roteador atual comporta reconfiguração. Para as Smart TVs do bairro, o cenário típico envolve aparelhos usados por muitas horas em sala de espera de clínica ou pequeno comércio — o desgaste de backlight e fonte é acelerado. Executamos diagnóstico em bancada, valor por escrito e garantia formal por WhatsApp antes de qualquer execução, com a taxa mínima de coleta claramente informada. A proximidade da Rodoferroviária e do terminal urbano soma outro fator: interferência elétrica pesada e picos frequentes de tensão que castigam fontes chaveadas de roteadores e televisores. Recomendamos filtro de linha com proteção real contra surtos, jamais réguas comuns, e revisamos a instalação elétrica do rack quando o cliente autoriza. Em consultórios médicos da região do Água Verde imediato, também aplicamos rede segmentada compatível com LGPD, isolando prontuário eletrônico do Wi-Fi de sala de espera. Nas Smart TVs comerciais, priorizamos reparo de fonte e reflow controlado antes de qualquer sugestão de troca de placa, sempre com fotos das medições registradas no laudo entregue por WhatsApp.",
    indexable: true,
  },
};


export function buildWifiBairroData(bairroSlug: string): ServicoBairroData {
  const b = BAIRROS_INDEXAVEIS[bairroSlug];
  const isIndex = b.indexable !== false;
  const narrativa = b.narrativaLocal ? ` ${b.narrativaLocal}` : "";
  return {
    metaTitle: `Configuração de Wi-Fi no ${b.nome} | Curitiba`,
    metaDescription: `Instalação e configuração de Wi-Fi, mesh e roteadores no ${b.nome}, Curitiba. Atendimento presencial, valor do atendimento pelo WhatsApp e valor mínimo de R$ 99,99.`,
    servico: "Configuração de Wi-Fi",
    servicoSlug: "redes-wifi",
    bairro: b.nome,
    bairroSlug: b.slug,
    cidade: "Curitiba",
    cidadeSlug: "curitiba",
    indexable: isIndex,
    h1: `Configuração de Wi-Fi no ${b.nome}, Curitiba`,
    subtitulo: `Sinal estável em toda a casa ou escritório — ${b.tempoAtendimento}.`,
    precoBase: "R$ 99,99",
    precoDescricao: "Valor mínimo da visita técnica. Serviços mais complexos recebem valor do atendimento próprio.",
    descricaoLonga: `${b.descricaoLocal}${narrativa} Configuramos roteadores, repetidores e sistemas mesh, otimizamos canais 2,4/5 GHz e organizamos cabeamento quando necessário — sempre com aprovação prévia pelo WhatsApp.`,

    beneficios: [
      "Diagnóstico do ambiente e mapeamento de zonas sem sinal",
      "Configuração de roteador, mesh ou repetidor",
      "Otimização de canais para reduzir interferência",
      "Rede segmentada para trabalho, visitas e IoT",
      "Testes de cobertura em cada cômodo antes de finalizar",
      "Nada é executado sem sua aprovação por escrito",
    ],
    processoPasso: [
      { titulo: "Contato pelo WhatsApp", descricao: `Descreva o problema (queda, lentidão, cômodo sem sinal) e o endereço no ${b.nome}.` },
      { titulo: "Triagem e valor do atendimento", descricao: "Confirmamos modalidade (visita ou remoto quando aplicável) e valor mínimo antes do deslocamento." },
      { titulo: "Visita técnica", descricao: `Chegamos ao ${b.nome} com equipamento de análise de espectro e testes de cobertura.` },
      { titulo: "Instalação/ajuste", descricao: "Configuramos roteador, mesh ou repetidor conforme o diagnóstico." },
      { titulo: "Validação e garantia", descricao: "Testamos cada cômodo com o cliente e formalizamos garantia pelo WhatsApp." },
    ],
    faq: [
      { pergunta: `Vocês atendem no ${b.nome}?`, resposta: `Sim, atendemos a região próxima a ${b.pontosReferencia.slice(0, 2).join(" e ")}. A data e a modalidade são confirmadas na triagem — ${b.tempoAtendimento}.` },
      { pergunta: "O Wi-Fi não pega em alguns cômodos. Resolve?", resposta: "Sim. Avaliamos o ambiente e indicamos mesh, repetidor ou reposicionamento do roteador. Antes da visita, teste desligar o roteador por 60 segundos e religá-lo para descartar travamento momentâneo." },
      { pergunta: "Quanto custa?", resposta: "A visita começa em R$ 99,99 e cobre configuração básica. Mesh, cabeamento e rede empresarial recebem valor do atendimento próprio antes de qualquer execução." },
      { pergunta: "Precisa comprar equipamento novo?", resposta: "Só se realmente for necessário. Muitas vezes o roteador da operadora atende após reconfiguração e ajuste de canais. Quando trocar compensa, indicamos o modelo certo antes da compra." },
    ],
    pontosReferencia: b.pontosReferencia,
    tempoAtendimento: b.tempoAtendimento,
    servicosRelacionados: [
      { nome: "Formatação de computador", slug: "formatacao-computador" },
      { nome: "Remoção de vírus", slug: "remocao-virus" },
      { nome: "Suporte a empresas", slug: "suporte-empresas" },
    ],
    bairrosProximos: b.bairrosProximos,
  };
}

export function buildTvBairroData(bairroSlug: string): ServicoBairroData {
  const b = BAIRROS_INDEXAVEIS[bairroSlug];
  const isIndex = b.indexable !== false;
  const narrativa = b.narrativaLocal ? ` ${b.narrativaLocal}` : "";
  return {
    metaTitle: `Conserto de Smart TV no ${b.nome} | Curitiba`,
    metaDescription: `Reparo e troca de tela de Smart TV LED/LCD no ${b.nome}, Curitiba. Diagnóstico em bancada, coleta e entrega, valor do atendimento pelo WhatsApp.`,
    servico: "Conserto de Smart TV",
    servicoSlug: "manutencao-tv",
    bairro: b.nome,
    bairroSlug: b.slug,
    cidade: "Curitiba",
    cidadeSlug: "curitiba",
    indexable: isIndex,
    h1: `Conserto de Smart TV no ${b.nome}, Curitiba`,
    subtitulo: `Reparo de placa, fonte, backlight e troca de tela com coleta e entrega no ${b.nome}.`,
    precoBase: "R$ 299,99",
    precoDescricao: "Taxa mínima de coleta e entrega. O reparo em si é informado por escrito após diagnóstico em bancada.",
    descricaoLonga: `${b.descricaoLocal}${narrativa} Coletamos a TV no seu endereço, executamos o diagnóstico em bancada com equipamento profissional (multímetro, câmera térmica, estação de solda SMD) e devolvemos a TV testada, com garantia formal.`,

    beneficios: [
      "Coleta e entrega no endereço",
      "Diagnóstico em bancada com câmera térmica",
      "Reparo de fonte, T-CON, mainboard e backlight",
      "Troca de painel LCD quando compensa (avaliação transparente)",
      "Valor por escrito antes de qualquer reparo",
      "Garantia formal por WhatsApp",
    ],
    processoPasso: [
      { titulo: "Descrição do defeito pelo WhatsApp", descricao: `Envie marca, modelo, ano e o sintoma da TV (envie foto/vídeo se possível). Coletamos no ${b.nome}.` },
      { titulo: "Coleta agendada", descricao: "Combinamos janela de coleta e emitimos comprovante." },
      { titulo: "Diagnóstico em bancada", descricao: "Análise de placa-fonte, T-CON, mainboard e backlight com equipamento profissional." },
      { titulo: "Valor e aprovação", descricao: "Enviamos o valor por escrito. Nada é executado sem sua aprovação." },
      { titulo: "Reparo e devolução", descricao: `Executamos o reparo e devolvemos a TV testada no ${b.nome}, com garantia.` },
    ],
    faq: [
      { pergunta: `Vocês coletam TV no ${b.nome}?`, resposta: `Sim. Coletamos com transporte adequado, próximo a ${b.pontosReferencia.slice(0, 2).join(" e ")}. A taxa mínima é R$ 299,99 e cobre retirada, transporte e diagnóstico.` },
      { pergunta: "Como saber se vale a pena consertar?", resposta: "TVs de 40\" ou maiores, com menos de 5 anos e marcas boas (Samsung, LG, Sony) geralmente compensam. Painel LCD trincado raramente compensa — orientamos com transparência antes da coleta." },
      { pergunta: "O que fazer antes de solicitar coleta?", resposta: "Teste em uma tomada diferente sem estabilizador, desconecte cabos HDMI/USB, ligue no botão do painel (não só no controle) e anote se o LED de standby acende. Isso ajuda a pré-diagnosticar." },
      { pergunta: "Qual o prazo?", resposta: "O prazo padrão é de 3 a 10 dias úteis conforme a disponibilidade de peças. Informamos o prazo estimado junto do valor do serviço." },
    ],
    pontosReferencia: b.pontosReferencia,
    tempoAtendimento: b.tempoAtendimento,
    servicosRelacionados: [
      { nome: "Configuração de Wi-Fi", slug: "redes-wifi" },
      { nome: "Suporte para empresas", slug: "suporte-empresas" },
      { nome: "Coleta e entrega", slug: "coleta-e-entrega" },
    ],
    bairrosProximos: b.bairrosProximos,
  };
}
