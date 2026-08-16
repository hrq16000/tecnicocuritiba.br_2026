// ─────────────────────────────────────────────────────────────
// BAIRROS CURADOS DE CURITIBA — 5 landings hiperlocais indexáveis.
// Conteúdo próprio por bairro, sem endereço/unidade física inventada,
// sem tempo de deslocamento prometido, sem avaliação inventada.
// Rota canônica: /bairros/<slug> (self-referente). Página-mãe:
// /tecnico-informatica-curitiba.
// ─────────────────────────────────────────────────────────────

import { SERVICOS_CANONICOS } from "@/lib/cidadesData";

export interface BairroFaq {
  question: string;
  answer: string;
}

export interface BairroLocalData {
  slug: string;
  /** Nome curto do bairro (CIC, Batel, Água Verde, Centro, Portão) */
  nome: string;
  /** Nome locativo para uso em frase: "no CIC", "no Centro de Curitiba" */
  nomeLocativo: string;
  cidade: string;
  /** Nome usado no areaServed do schema */
  areaName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitulo: string;
  /** Mensagem pré-preenchida do WhatsApp (inclui bairro + Curitiba) */
  whatsappMessage: string;
  /** Introdução local — parágrafos distintos por bairro */
  introducaoLocal: string[];
  /** Como a triagem e a operação funcionam naquele bairro */
  operacaoLocal: string[];
  /** Quando o atendimento no local pode ser indicado */
  atendimentoLocal: string[];
  /** Quando pode ser necessária coleta ou bancada */
  coletaBancada: string[];
  /** Serviços prioritários — paths das 8 rotas curadas de /servicos */
  servicosPrioritarios: string[];
  /** FAQ local visível (espelhada em FAQPage) — distinta entre bairros */
  faqLocal: BairroFaq[];
}

// Resolve um path de /servicos para o item canônico (label + desc).
export function servicoByPath(to: string) {
  return SERVICOS_CANONICOS.find((s) => s.to === to);
}

export const BAIRROS: Record<string, BairroLocalData> = {
  // ── CIC ─────────────────────────────────────────────────────
  cic: {
    slug: "cic",
    nome: "CIC",
    nomeLocativo: "no CIC",
    cidade: "Curitiba",
    areaName: "Cidade Industrial de Curitiba (CIC)",
    metaTitle: "Técnico de Informática no CIC (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no CIC, Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para empresas. Diagnóstico a partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no CIC – Curitiba",
    subtitulo:
      "Atendimento para residências e empresas no maior bairro de Curitiba, começando por triagem no WhatsApp e diagnóstico antes de informar o valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no CIC, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "A Cidade Industrial de Curitiba (CIC) é o maior bairro da capital em extensão, com um perfil que mistura indústrias, comércios e muitas residências. Isso gera dois tipos de demanda: empresas que dependem de computadores e rede estáveis para não parar a operação e famílias que precisam do notebook do dia a dia funcionando.",
      "O contato começa pelo WhatsApp: você descreve o problema, recebe as primeiras orientações e, se fizer sentido, combinamos a avaliação do equipamento. A modalidade — no local, remoto ou por coleta — é definida conforme o problema, não prometida antes de entender o caso.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp para entender sintoma, uso e urgência",
      "Diagnóstico técnico antes de informar qualquer valor",
      "Valor aprovado por você antes da execução",
      "Manutenção preventiva sugerida para máquinas que rodam o dia inteiro",
    ],
    atendimentoLocal: [
      "Formatação com backup e reinstalação do sistema",
      "Limpeza interna e upgrade de SSD ou memória",
      "Configuração de rede e Wi-Fi em casa ou no comércio",
      "Suporte pontual a estações de trabalho de escritório",
    ],
    coletaBancada: [
      "Reparo de placa-mãe e falhas intermitentes de hardware",
      "Troca de tela ou teclado de notebook",
      "Tentativa de recuperação de dados em HD ou SSD com falha",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-computador",
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
      "/servicos/upgrade-ssd-ram",
      "/servicos/redes-e-wifi",
      "/servicos/suporte-tecnico-empresarial",
    ],
    faqLocal: [
      { question: "Vocês atendem empresas e comércios no CIC?", answer: "Sim. Como o CIC concentra muitas operações, damos suporte pontual ou recorrente sob consulta a estações de trabalho, rede e rotinas de backup. A avaliação começa pelo WhatsApp." },
      { question: "O atendimento no CIC é no local ou por coleta?", answer: "Depende do problema. Casos como formatação, upgrade e configuração de rede costumam ser resolvidos no local; reparos de bancada seguem por coleta e entrega, sempre com sua aprovação." },
      { question: "Quanto custa o diagnóstico no CIC?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças — e nada é executado sem aprovação." },
      { question: "Vale mais a pena consertar ou trocar o computador?", answer: "Em muitos casos, um upgrade de SSD e memória resolve a lentidão por um custo menor que a troca. Avaliamos o equipamento e explicamos com clareza antes de indicar qualquer caminho." },
    ],
  },

  // ── BATEL ───────────────────────────────────────────────────
  batel: {
    slug: "batel",
    nome: "Batel",
    nomeLocativo: "no Batel",
    cidade: "Curitiba",
    areaName: "Batel, Curitiba",
    metaTitle: "Técnico de Informática no Batel (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Batel, Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para home office. Diagnóstico a partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Batel – Curitiba",
    subtitulo:
      "Suporte para residências, home office e pequenos escritórios no Batel, com triagem por WhatsApp e diagnóstico antes de informar o valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Batel, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Batel reúne muita gente que trabalha em casa e depende do computador o tempo todo. Por isso, os pedidos mais comuns na região envolvem notebook lento ou esquentando, necessidade de formatação com backup e Wi-Fi estável o suficiente para reuniões online.",
      "O atendimento começa por triagem no WhatsApp. A partir da descrição do problema, orientamos os primeiros passos e definimos se o caso pode ser resolvido no local, de forma remota ou se precisa seguir para bancada — sempre com diagnóstico antes de informar o valor.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com foco em home office e residências",
      "Diagnóstico honesto antes de trocar qualquer peça",
      "Valor aprovado por você antes de executar",
      "Orientação sobre desempenho e estabilidade de rede",
    ],
    atendimentoLocal: [
      "Ajustes de desempenho e formatação com backup",
      "Upgrade de SSD e memória para ganho de velocidade",
      "Configuração de Wi-Fi e melhoria de cobertura em apartamentos",
      "Remoção de vírus e limpeza de programas indesejados",
    ],
    coletaBancada: [
      "Troca de tela, teclado ou bateria de notebook",
      "Reparos internos que exigem estrutura de oficina",
      "Diagnósticos mais longos de hardware instável",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
      "/servicos/upgrade-ssd-ram",
      "/servicos/remocao-de-virus",
      "/servicos/redes-e-wifi",
    ],
    faqLocal: [
      { question: "Fazem suporte para home office no Batel?", answer: "Sim. Ajustamos desempenho, organizamos programas e melhoramos a estabilidade do Wi-Fi para reuniões online. A avaliação do que é necessário é feita após a triagem pelo WhatsApp." },
      { question: "Atendem apartamentos e prédios no Batel?", answer: "Sim, atendemos residências e pequenos escritórios. Em prédios, basta liberar o acesso na portaria no horário combinado. A modalidade depende do tipo de serviço." },
      { question: "Meu notebook está lento — precisa trocar?", answer: "Nem sempre. Muitas vezes um upgrade de SSD e memória, somado a uma limpeza, devolve a agilidade. Avaliamos antes de indicar troca e explicamos o ganho realista." },
      { question: "Qual o valor do atendimento no Batel?", answer: "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes." },
    ],
  },

  // ── ÁGUA VERDE ──────────────────────────────────────────────
  "agua-verde": {
    slug: "agua-verde",
    nome: "Água Verde",
    nomeLocativo: "no Água Verde",
    cidade: "Curitiba",
    areaName: "Água Verde, Curitiba",
    metaTitle: "Técnico de Informática no Água Verde | Notebook e PC",
    metaDescription:
      "Técnico de informática no Água Verde, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Diagnóstico a partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Água Verde – Curitiba",
    subtitulo:
      "Manutenção de notebook e PC para quem trabalha e estuda em casa no Água Verde, com triagem por WhatsApp e valor transparente.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Água Verde, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "No Água Verde, o perfil que mais aparece é o de quem trabalha de casa e não pode ficar com o notebook parado. Por isso, boa parte das solicitações envolve notebook lento, aquecimento, tela ou teclado com defeito e a necessidade de um upgrade de SSD para dar sobrevida à máquina.",
      "Também há forte procura por formatação com backup e remoção de vírus em computadores usados por vários membros da família. Tudo começa pela triagem no WhatsApp, com diagnóstico antes de informar qualquer valor e sem troca de peça sem necessidade.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com foco em notebook e PC de uso diário",
      "Backup dos arquivos antes de formatar, quando o caso pede",
      "Diagnóstico de fonte, memória, disco e temperatura antes de indicar troca",
      "Entrega da máquina com drivers e programas essenciais configurados",
    ],
    atendimentoLocal: [
      "Formatação com backup e reinstalação do sistema",
      "Upgrade de SSD e memória para acelerar a máquina",
      "Remoção de vírus e limpeza de pop-ups",
      "Manutenção de desktop de escritório em casa",
    ],
    coletaBancada: [
      "Troca de tela, dobradiça ou teclado de notebook",
      "Reparo de placa e falhas físicas de hardware",
      "Tentativa de recuperação de dados de mídia com defeito",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/manutencao-de-computador",
      "/servicos/upgrade-ssd-ram",
      "/servicos/formatacao",
      "/servicos/recuperacao-de-dados",
    ],
    faqLocal: [
      { question: "Vocês fazem upgrade de SSD no Água Verde?", answer: "Sim, é um dos serviços mais pedidos no bairro. A troca por SSD com aumento de memória costuma trazer ganho perceptível em máquinas antigas, avaliado caso a caso." },
      { question: "Formatam com backup dos meus arquivos?", answer: "Sim. Sempre que possível, fazemos o backup dos arquivos antes de reinstalar o Windows e devolvemos a máquina com drivers, antivírus e programas essenciais já configurados." },
      { question: "Conseguem recuperar arquivos apagados?", answer: "Fazemos a tentativa de recuperação de dados. Não há garantia, pois o resultado depende do estado físico e lógico da mídia — e explicamos as chances antes de iniciar." },
      { question: "O atendimento é a domicílio no Água Verde?", answer: "Pode ser a domicílio ou por coleta e entrega, conforme o serviço. Reparos de bancada seguem para a oficina; a definição acontece após a triagem pelo WhatsApp." },
    ],
  },

  // ── CENTRO ──────────────────────────────────────────────────
  centro: {
    slug: "centro",
    nome: "Centro de Curitiba",
    nomeLocativo: "no Centro de Curitiba",
    cidade: "Curitiba",
    areaName: "Centro de Curitiba",
    metaTitle: "Técnico de Informática no Centro de Curitiba | Notebook e PC",
    metaDescription:
      "Técnico de informática no Centro de Curitiba: conserto de notebook, manutenção de computador, formatação e suporte para escritórios. Diagnóstico a partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Centro de Curitiba",
    subtitulo:
      "Atendimento ágil para lojas, consultórios e escritórios do Centro de Curitiba, com triagem por WhatsApp e diagnóstico antes de informar o valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Centro de Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Centro de Curitiba tem ritmo comercial: lojas, escritórios de advocacia e contabilidade, imobiliárias e consultórios que não podem ficar com o computador parado no meio do expediente. Os chamados mais comuns envolvem PC de balcão travando, lentidão com sistemas e planilhas e rede instável afetando o atendimento.",
      "Como cada hora parada pesa no comércio, priorizamos triagem rápida pelo WhatsApp e diagnóstico objetivo. A partir daí, indicamos se o caso é resolvido no local, de forma remota ou por coleta — sempre com valor aprovado antes da execução.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp pensando na rotina comercial",
      "Diagnóstico rápido para reduzir tempo de parada",
      "Backup antes de reinstalar sistemas de equipe",
      "Valor aprovado antes de qualquer serviço",
    ],
    atendimentoLocal: [
      "Reparo de PC de escritório que trava no expediente",
      "Formatação com backup em máquinas compartilhadas",
      "Configuração de rede e impressoras de escritório",
      "Remoção de vírus em computadores de equipe",
    ],
    coletaBancada: [
      "Reparos internos de hardware que exigem oficina",
      "Troca de componentes de notebook",
      "Diagnósticos prolongados de instabilidade",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-computador",
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
      "/servicos/remocao-de-virus",
      "/servicos/redes-e-wifi",
    ],
    faqLocal: [
      { question: "Atendem escritórios e lojas no Centro de Curitiba?", answer: "Sim. Boa parte da demanda no Centro é comercial: PCs de balcão, escritórios e consultórios. Fazemos suporte pontual ou recorrente sob consulta, começando pela triagem no WhatsApp." },
      { question: "Vocês têm loja física no Centro?", answer: "Não trabalhamos com loja de balcão. O atendimento é combinado por WhatsApp e realizado a domicílio, remotamente ou por coleta e entrega, conforme o tipo de serviço." },
      { question: "Dá para reduzir o tempo de parada da empresa?", answer: "Esse é o foco no Centro: triagem rápida e diagnóstico objetivo. Casos simples costumam ser resolvidos no local; quando é preciso bancada, informamos o prazo antes de retirar o equipamento." },
      { question: "Qual o valor da avaliação no Centro?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, e é sempre aprovado por você antes." },
    ],
  },

  // ── PORTÃO ──────────────────────────────────────────────────
  portao: {
    slug: "portao",
    nome: "Portão",
    nomeLocativo: "no Portão",
    cidade: "Curitiba",
    areaName: "Portão, Curitiba",
    metaTitle: "Técnico de Informática no Portão (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Portão, Curitiba: conserto de notebook, manutenção de computador, formatação e upgrade de SSD. Atendimento a domicílio a partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Portão – Curitiba",
    subtitulo:
      "Conserto de notebook, PC e redes para casas e comércios do Portão, com triagem por WhatsApp e valor aprovado por você.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Portão, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Portão tem um perfil familiar e comercial ao mesmo tempo: casas com um ou mais computadores usados por toda a família e pequenos comércios que dependem de um PC estável para vender e emitir nota. Por isso aparecem muito computador lento e cheio de programas, notebook esquentando e Wi-Fi que não cobre a casa inteira.",
      "O atendimento começa pela triagem no WhatsApp. A partir do relato, orientamos os primeiros passos e definimos a melhor forma de resolver — no local, remotamente ou por coleta — com diagnóstico antes de informar o valor.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp para residências e comércio do bairro",
      "Diagnóstico antes de indicar troca de peças",
      "Foco em reduzir o tempo de parada do comércio",
      "Valor aprovado por você antes de executar",
    ],
    atendimentoLocal: [
      "Formatação com backup dos arquivos da família",
      "Upgrade de SSD e memória para ganho de desempenho",
      "Configuração de Wi-Fi para cobrir a casa toda",
      "Suporte ao PC do balcão do comércio",
    ],
    coletaBancada: [
      "Reparo de placa e falhas após queda de energia",
      "Troca de componentes internos de notebook",
      "Casos que exigem testes prolongados de bancada",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/manutencao-de-computador",
      "/servicos/formatacao",
      "/servicos/upgrade-ssd-ram",
      "/servicos/redes-e-wifi",
      "/servicos/remocao-de-virus",
    ],
    faqLocal: [
      { question: "Atendem o comércio do Portão?", answer: "Sim. Damos suporte ao PC do balcão, à impressora e à rede de pequenos comércios, com foco em reduzir o tempo de parada. A avaliação começa pela triagem no WhatsApp." },
      { question: "O Wi-Fi não cobre a casa toda — vocês resolvem?", answer: "Avaliamos o posicionamento do roteador e a necessidade de repetidor ou sistema mesh para melhorar a cobertura. A indicação depende do tamanho do imóvel e da estrutura." },
      { question: "Recebi um aviso pedindo pagamento para liberar o PC. É golpe?", answer: "Quase sempre é golpe. Não pague nada antes de uma avaliação. Fale conosco pelo WhatsApp que verificamos o caso com segurança antes de qualquer serviço." },
      { question: "Qual o valor do atendimento no Portão?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças, sempre aprovado por você antes." },
    ],
  },

  // ── BIGORRILHO ──────────────────────────────────────────────
  bigorrilho: {
    slug: "bigorrilho",
    nome: "Bigorrilho",
    nomeLocativo: "no Bigorrilho",
    cidade: "Curitiba",
    areaName: "Bigorrilho (Champagnat), Curitiba",
    metaTitle: "Técnico de Informática no Bigorrilho (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Bigorrilho e Champagnat, Curitiba: conserto de notebook, formatação, upgrade de SSD e Wi-Fi em apartamento. Diagnóstico a partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Bigorrilho – Curitiba",
    subtitulo:
      "Atendimento para apartamentos e escritórios do Bigorrilho e do eixo Champagnat, com triagem pelo WhatsApp e diagnóstico antes de qualquer valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Bigorrilho, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Bigorrilho é um bairro verticalizado: a maior parte dos chamados vem de apartamentos e de pequenos escritórios instalados ao longo da Vicente Machado, da Bispo Dom José e do eixo Champagnat. Esse perfil muda o tipo de problema que aparece. Em vez de máquinas de bancada antigas, predominam notebooks usados como computador principal, docks com dois monitores e roteador único tentando cobrir apartamentos compridos com paredes de concreto.",
      "Por isso, dois pedidos se repetem na região: desempenho (notebook que trava em reunião, disco cheio, inicialização lenta) e rede (queda de sinal no quarto que virou escritório). O contato começa pelo WhatsApp, com descrição do sintoma; a partir daí definimos se o caso é resolvido no local, remotamente ou se precisa seguir para bancada.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com foco em apartamento e home office",
      "Agendamento em horário compatível com liberação na portaria",
      "Diagnóstico técnico antes de informar qualquer valor",
      "Execução só depois da sua aprovação",
    ],
    atendimentoLocal: [
      "Upgrade de SSD e memória em notebook usado para trabalho",
      "Formatação com backup e reinstalação dos programas de rotina",
      "Reposicionamento de roteador, canais e repetidor/mesh no apartamento",
      "Configuração de monitor externo, dock e impressora de rede",
    ],
    coletaBancada: [
      "Troca de tela, dobradiça ou teclado de notebook",
      "Superaquecimento que exige limpeza interna e troca de pasta térmica",
      "Falha elétrica na placa após oscilação de energia no prédio",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/upgrade-ssd-ram",
      "/servicos/redes-e-wifi",
      "/servicos/formatacao",
      "/servicos/manutencao-de-computador",
    ],
    faqLocal: [
      { question: "Vocês atendem apartamento no Bigorrilho?", answer: "Sim, é o perfil mais comum na região. Combinamos o horário pelo WhatsApp e o acesso é liberado na portaria. Serviços de software, rede e upgrades costumam ser resolvidos no próprio apartamento." },
      { question: "O Wi-Fi cai no quarto que virei escritório. Tem solução?", answer: "Na maioria dos apartamentos compridos o problema é posicionamento e canal do roteador, não velocidade contratada. Avaliamos a cobertura no local e indicamos ajuste, repetidor ou mesh conforme a planta." },
      { question: "Preciso levar o notebook até algum endereço?", answer: "Não. Não temos balcão ao público: ou o serviço é feito no seu endereço, ou fazemos coleta e entrega quando o caso exige bancada." },
      { question: "Quanto custa o atendimento no Bigorrilho?", answer: "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, e é sempre aprovado por você antes da execução." },
    ],
  },

  // ── SANTA FELICIDADE ────────────────────────────────────────
  "santa-felicidade": {
    slug: "santa-felicidade",
    nome: "Santa Felicidade",
    nomeLocativo: "em Santa Felicidade",
    cidade: "Curitiba",
    areaName: "Santa Felicidade, Curitiba",
    metaTitle: "Técnico de Informática em Santa Felicidade | Curitiba",
    metaDescription:
      "Técnico de informática em Santa Felicidade, Curitiba: conserto de PC e notebook, formatação, Wi-Fi em casa grande e suporte a comércio. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática em Santa Felicidade – Curitiba",
    subtitulo:
      "Atendimento a residências amplas e ao comércio familiar de Santa Felicidade, com triagem pelo WhatsApp e diagnóstico antes de informar o valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática em Santa Felicidade, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "Santa Felicidade tem um perfil bem diferente dos bairros verticais: predominam casas de terreno grande, sobrados e um comércio familiar consolidado ao longo da Manoel Ribas — restaurantes, vinícolas, lojas de móveis e ateliês. Isso aparece nos chamados de duas formas. Nas casas, o problema quase sempre é cobertura de Wi-Fi: o roteador fica na sala da frente e o sinal não chega aos fundos, ao segundo andar ou à edícula.",
      "No comércio, a prioridade é continuidade: o computador do caixa, a impressora de comanda ou a máquina que emite nota não podem ficar parados no fim de semana, quando o movimento é maior. A triagem começa pelo WhatsApp e, com o sintoma descrito, definimos se o caso se resolve no local, remotamente ou por coleta.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp para residências e comércio do bairro",
      "Prioridade para reduzir tempo de parada em caixa e emissão de nota",
      "Diagnóstico antes de indicar qualquer troca de peça",
      "Valor aprovado por você antes da execução",
    ],
    atendimentoLocal: [
      "Cobertura de Wi-Fi em casas grandes, sobrados e edículas",
      "Manutenção e limpeza de computador de mesa usado por toda a família",
      "Formatação com backup de fotos e documentos",
      "Suporte ao PC do caixa, impressora térmica e leitor do comércio",
    ],
    coletaBancada: [
      "Computador que não liga após oscilação de energia",
      "Reparo interno de notebook e troca de componentes",
      "Tentativa de recuperação de dados em HD antigo",
    ],
    servicosPrioritarios: [
      "/servicos/redes-e-wifi",
      "/servicos/manutencao-de-computador",
      "/servicos/formatacao",
      "/servicos/manutencao-de-notebook",
      "/servicos/suporte-tecnico-empresarial",
    ],
    faqLocal: [
      { question: "O Wi-Fi não chega aos fundos da casa. Como resolvem?", answer: "Em casas grandes o ponto de partida é medir o sinal ambiente por ambiente. A partir disso indicamos reposicionamento, troca de canal, cabeamento até um segundo ponto ou sistema mesh — sem prometer solução antes de medir." },
      { question: "Atendem restaurantes e lojas de Santa Felicidade?", answer: "Sim. Damos suporte pontual ou combinado ao computador do caixa, à impressora de comanda e à rede do estabelecimento, com foco em reduzir o tempo de parada." },
      { question: "Posso levar o equipamento até vocês?", answer: "Não trabalhamos com balcão ao público. Quando o caso exige bancada, fazemos coleta e entrega no seu endereço, com sua aprovação antes de qualquer serviço." },
      { question: "Qual o valor do atendimento em Santa Felicidade?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças, sempre informado e aprovado antes." },
    ],
  },

  // ── CABRAL ──────────────────────────────────────────────────
  cabral: {
    slug: "cabral",
    nome: "Cabral",
    nomeLocativo: "no Cabral",
    cidade: "Curitiba",
    areaName: "Cabral, Curitiba",
    metaTitle: "Técnico de Informática no Cabral (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Cabral, Curitiba: conserto de notebook, formatação, upgrade de SSD e suporte a consultórios e escritórios. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Cabral – Curitiba",
    subtitulo:
      "Suporte a apartamentos, consultórios e escritórios do Cabral e entorno do Centro Cívico, com triagem pelo WhatsApp e diagnóstico antes do valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Cabral, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Cabral mistura residências verticais com uma concentração incomum de consultórios, clínicas e escritórios pequenos, especialmente no eixo da Av. Paraná e nas ruas próximas ao Centro Cívico e ao Juvevê. Esse perfil traz uma demanda específica: computadores que rodam sistema de agenda, prontuário ou emissão fiscal e que não podem simplesmente ser formatados sem planejamento.",
      "Nesses casos, o cuidado maior é com backup e com a ordem das etapas — primeiro copiar dados e conferir licenças e acessos, depois executar. Para as residências do bairro, os pedidos são os clássicos: lentidão, disco cheio, notebook esquentando e Wi-Fi instável. A triagem começa pelo WhatsApp e a modalidade é definida conforme o problema.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp separando uso residencial e profissional",
      "Backup e checagem de acessos antes de formatar máquina de trabalho",
      "Diagnóstico técnico antes de informar valor",
      "Janela de atendimento combinada para não parar o consultório",
    ],
    atendimentoLocal: [
      "Formatação planejada com backup e reinstalação de sistemas de rotina",
      "Upgrade de SSD e memória em máquinas de escritório",
      "Ajuste de rede, impressora compartilhada e digitalização",
      "Remoção de vírus e limpeza de programas indesejados",
    ],
    coletaBancada: [
      "Notebook que não liga ou desliga sozinho",
      "Troca de tela, teclado ou bateria",
      "Diagnóstico prolongado de instabilidade de hardware",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
      "/servicos/upgrade-ssd-ram",
      "/servicos/suporte-tecnico-empresarial",
      "/servicos/remocao-de-virus",
    ],
    faqLocal: [
      { question: "Atendem consultórios e escritórios no Cabral?", answer: "Sim. Trabalhamos com janela de horário combinada para não interromper o atendimento, e a formatação de máquina de trabalho só acontece após backup e conferência de acessos e licenças." },
      { question: "Vocês fazem backup antes de formatar?", answer: "Sempre que o disco permite leitura, o backup dos dados é a primeira etapa e é conferido com você antes de qualquer reinstalação. Se o disco estiver com falha, isso é informado antes de prosseguir." },
      { question: "Preciso levar o equipamento em alguma loja?", answer: "Não. Não temos balcão ao público: o serviço é feito no seu endereço ou o equipamento é coletado e devolvido quando o caso exige bancada." },
      { question: "Qual o valor do atendimento no Cabral?", answer: "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes." },
    ],
  },

  // ── CRISTO REI ──────────────────────────────────────────────
  "cristo-rei": {
    slug: "cristo-rei",
    nome: "Cristo Rei",
    nomeLocativo: "no Cristo Rei",
    cidade: "Curitiba",
    areaName: "Cristo Rei, Curitiba",
    metaTitle: "Técnico de Informática no Cristo Rei (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Cristo Rei, Curitiba: conserto de notebook, formatação, upgrade de SSD e Wi-Fi para estudantes e famílias. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Cristo Rei – Curitiba",
    subtitulo:
      "Atendimento a estudantes, repúblicas e famílias do Cristo Rei, no entorno da UFPR, com triagem pelo WhatsApp e diagnóstico antes de informar o valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Cristo Rei, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Cristo Rei é fortemente influenciado pela proximidade com o campus da UFPR e com o Jardim Botânico: há muitos estudantes, repúblicas e apartamentos compactos ao lado de residências de famílias que moram no bairro há décadas. Isso cria uma demanda dupla — notebooks de uso intenso, com pouco espaço em disco e prazos de entrega de trabalho, e computadores domésticos mais antigos que ficaram lentos.",
      "Nos chamados de estudante, a prioridade quase sempre é recuperar o acesso aos arquivos e devolver a máquina funcionando rápido, sem perder documentos. Nas casas, a conversa costuma ser sobre vale a pena consertar ou trocar. A triagem começa pelo WhatsApp e o diagnóstico vem antes de qualquer valor.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com prioridade para prazo de trabalho e estudo",
      "Backup dos arquivos antes de qualquer reinstalação",
      "Diagnóstico honesto sobre consertar ou substituir",
      "Valor aprovado por você antes da execução",
    ],
    atendimentoLocal: [
      "Formatação com backup de trabalhos e documentos",
      "Upgrade de SSD e memória em notebook de estudo",
      "Remoção de vírus e recuperação de acesso ao sistema",
      "Configuração de Wi-Fi em apartamento compacto e república",
    ],
    coletaBancada: [
      "Notebook que não liga, com tela quebrada ou dobradiça solta",
      "Superaquecimento e desligamento durante uso prolongado",
      "Tentativa de recuperação de dados em disco com falha",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
      "/servicos/upgrade-ssd-ram",
      "/servicos/remocao-de-virus",
      "/servicos/redes-e-wifi",
    ],
    faqLocal: [
      { question: "Meu notebook travou e tenho trabalho para entregar. Dá para priorizar?", answer: "Informe o prazo já na triagem pelo WhatsApp. Quando o caso permite, priorizamos o acesso aos arquivos primeiro — mesmo que o reparo completo leve mais tempo depois." },
      { question: "Vale a pena consertar um computador antigo no Cristo Rei?", answer: "Depende do equipamento. Em muitos casos SSD e memória devolvem a agilidade por um custo bem menor que a troca; em outros, o reparo não se paga. Explicamos os dois cenários antes de você decidir." },
      { question: "Atendem repúblicas e apartamentos de estudante?", answer: "Sim. Serviços de software, rede e upgrade costumam ser feitos no próprio endereço. Casos de bancada seguem por coleta e entrega, com aprovação prévia." },
      { question: "Qual o valor do atendimento no Cristo Rei?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado antes da execução." },
    ],
  },

  // ── BOA VISTA ───────────────────────────────────────────────
  "boa-vista": {
    slug: "boa-vista",
    nome: "Boa Vista",
    nomeLocativo: "no Boa Vista",
    cidade: "Curitiba",
    areaName: "Boa Vista, Curitiba",
    metaTitle: "Técnico de Informática no Boa Vista (Curitiba) | PC e Notebook",
    metaDescription:
      "Técnico de informática no Boa Vista, Curitiba: conserto de computador e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Boa Vista – Curitiba",
    subtitulo:
      "Atendimento a famílias e pequenos comércios do Boa Vista e entorno do terminal, com triagem pelo WhatsApp e diagnóstico antes de qualquer valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Boa Vista, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Boa Vista é um bairro residencial consolidado, com muitas casas de família convivendo com prédios mais novos e um comércio de rua espalhado pela Av. Paraná e pelas ruas próximas ao terminal. O reflexo disso nos chamados é claro: boa parte dos equipamentos é de uso doméstico prolongado — computadores de mesa com cinco anos ou mais, notebooks compartilhados por pais e filhos e impressoras que servem à casa inteira.",
      "Nesse perfil, o problema mais frequente não é uma peça queimada, e sim acúmulo: disco cheio, sistema desatualizado, programas indesejados instalados junto de downloads e backup inexistente. A conversa começa pelo WhatsApp com a descrição do sintoma e, quando o disco ainda lê, a primeira etapa é sempre proteger as fotos e os documentos antes de qualquer reinstalação.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com foco em uso doméstico e familiar",
      "Backup de fotos e documentos antes de formatar",
      "Diagnóstico técnico antes de informar valor",
      "Execução somente após a sua aprovação",
    ],
    atendimentoLocal: [
      "Formatação com backup e reinstalação dos programas da casa",
      "Remoção de vírus e limpeza de programas indesejados",
      "Upgrade de SSD e memória em computador antigo da família",
      "Configuração de Wi-Fi, impressora compartilhada e TV conectada",
    ],
    coletaBancada: [
      "Computador que não liga ou reinicia sozinho",
      "Limpeza interna e troca de pasta térmica em notebook que superaquece",
      "Tentativa de recuperação de dados em HD com falha de leitura",
    ],
    servicosPrioritarios: [
      "/servicos/formatacao",
      "/servicos/manutencao-de-computador",
      "/servicos/remocao-de-virus",
      "/servicos/upgrade-ssd-ram",
      "/servicos/redes-e-wifi",
    ],
    faqLocal: [
      { question: "Meu computador ficou muito lento. Precisa trocar?", answer: "Na maioria dos casos do bairro, não. Computador com disco mecânico costuma voltar a responder bem com SSD, memória e limpeza do sistema. Só indicamos troca quando o reparo não se paga — e explicamos o porquê." },
      { question: "Vocês fazem backup das fotos antes de formatar?", answer: "Sim, sempre que o disco permite leitura. O backup é a primeira etapa e é conferido com você antes de qualquer reinstalação." },
      { question: "Preciso levar o equipamento até vocês?", answer: "Não. Não temos balcão ao público: o serviço é feito no seu endereço ou fazemos coleta e entrega quando o caso exige bancada." },
      { question: "Qual o valor do atendimento no Boa Vista?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes da execução." },
    ],
  },

  // ── CAJURU ──────────────────────────────────────────────────
  cajuru: {
    slug: "cajuru",
    nome: "Cajuru",
    nomeLocativo: "no Cajuru",
    cidade: "Curitiba",
    areaName: "Cajuru, Curitiba",
    metaTitle: "Técnico de Informática no Cajuru (Curitiba) | PC e Notebook",
    metaDescription:
      "Técnico de informática no Cajuru, Curitiba: conserto de notebook e PC, formatação com backup, remoção de vírus e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática no Cajuru – Curitiba",
    subtitulo:
      "Atendimento a residências e comércio de bairro no Cajuru, com triagem pelo WhatsApp e diagnóstico antes de informar qualquer valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Cajuru, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Cajuru é um dos bairros mais populosos de Curitiba e tem uma malha densa de ruas residenciais entremeada por comércio de vizinhança: mercados, papelarias, lan houses, escritórios pequenos e assistências de bairro. Essa mistura aparece nos chamados de duas maneiras. Nas casas, o pedido comum é máquina lenta, sistema travando e Wi-Fi que não cobre todos os cômodos.",
      "No comércio, o que pesa é continuidade: PC do caixa, impressora de cupom e conexão precisam voltar a funcionar rápido, porque parada significa fila. A triagem começa pelo WhatsApp e, com o sintoma descrito, definimos se o caso é resolvido no local, remotamente ou por coleta com bancada.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp separando uso residencial e comercial",
      "Prioridade para reduzir tempo de parada no comércio de bairro",
      "Diagnóstico antes de indicar troca de peça",
      "Valor aprovado antes da execução, sem surpresa",
    ],
    atendimentoLocal: [
      "Formatação com backup e reinstalação dos programas de rotina",
      "Remoção de vírus e recuperação de acesso ao sistema",
      "Configuração de Wi-Fi em casas com muitos cômodos",
      "Suporte ao PC do caixa, impressora térmica e rede do comércio",
    ],
    coletaBancada: [
      "Notebook com tela quebrada, dobradiça solta ou que não liga",
      "Fonte ou placa com falha após oscilação de energia",
      "Recuperação de dados quando o disco apresenta erro de leitura",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
      "/servicos/remocao-de-virus",
      "/servicos/redes-e-wifi",
      "/servicos/manutencao-de-computador",
    ],
    faqLocal: [
      { question: "Atendem comércio pequeno no Cajuru?", answer: "Sim. Damos suporte pontual ao PC do caixa, à impressora de cupom e à rede do estabelecimento, com foco em reduzir o tempo em que o atendimento fica parado." },
      { question: "O Wi-Fi não cobre a casa toda. O que fazer?", answer: "Em casas com muitos cômodos e paredes espessas, medimos o sinal ambiente por ambiente antes de indicar solução: pode ser reposicionamento, troca de canal, cabo até um segundo ponto ou mesh." },
      { question: "Posso levar o equipamento até vocês?", answer: "Não trabalhamos com balcão ao público. Atendemos no seu endereço ou fazemos coleta e entrega quando o serviço exige bancada." },
      { question: "Quanto custa o atendimento no Cajuru?", answer: "O diagnóstico começa em R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre informado e aprovado antes." },
    ],
  },

  // ── BOQUEIRÃO ───────────────────────────────────────────────
  boqueirao: {
    slug: "boqueirao",
    nome: "Boqueirão",
    nomeLocativo: "no Boqueirão",
    cidade: "Curitiba",
    areaName: "Boqueirão, Curitiba",
    metaTitle: "Técnico de Informática no Boqueirão (Curitiba) | PC e Notebook",
    metaDescription:
      "Técnico de informática no Boqueirão, Curitiba: conserto de PC e notebook, formatação com backup, upgrade de SSD e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática no Boqueirão – Curitiba",
    subtitulo:
      "Atendimento a moradores e pequenos negócios do Boqueirão e entorno da Marechal Floriano, com triagem pelo WhatsApp e diagnóstico antes do valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Boqueirão, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Boqueirão combina extensas áreas residenciais com um eixo comercial forte na Marechal Floriano Peixoto e nas vias que ligam ao terminal. É um bairro de moradores antigos, muitas casas com anexo ou edícula usada como escritório e um grande número de microempresas familiares — oficinas, distribuidoras, comércios de rua e prestadores que dependem de um único computador para emitir nota e controlar estoque.",
      "Por isso, dois cenários dominam a triagem: o equipamento doméstico que ficou lento e precisa de recuperação de dados e desempenho, e a máquina de trabalho que não pode parar. Em ambos, o caminho é o mesmo: sintoma descrito pelo WhatsApp, diagnóstico técnico e só depois valor, sempre aprovado por você.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com separação entre uso doméstico e máquina de trabalho",
      "Backup antes de qualquer reinstalação em PC que emite nota",
      "Diagnóstico técnico antes de informar valor",
      "Serviço executado apenas após aprovação",
    ],
    atendimentoLocal: [
      "Upgrade de SSD e memória em computador de uso diário",
      "Formatação com backup e reinstalação dos sistemas de trabalho",
      "Ajuste de rede, impressora e compartilhamento de arquivos",
      "Remoção de vírus e limpeza de programas indesejados",
    ],
    coletaBancada: [
      "PC que não liga ou desarma ao ligar",
      "Notebook com superaquecimento, tela ou teclado danificados",
      "Falhas intermitentes que exigem teste prolongado em bancada",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-computador",
      "/servicos/upgrade-ssd-ram",
      "/servicos/formatacao",
      "/servicos/manutencao-de-notebook",
      "/servicos/suporte-tecnico-empresarial",
    ],
    faqLocal: [
      { question: "Meu PC emite nota e não pode parar. Como funciona?", answer: "Informe isso na triagem. Fazemos backup e conferimos acessos e licenças antes de mexer no sistema, e combinamos a janela de atendimento para reduzir o tempo de parada." },
      { question: "Vale trocar o HD por SSD em máquina antiga?", answer: "Na maior parte dos casos sim: é a mudança que mais devolve agilidade por um custo baixo. Avaliamos o equipamento antes e dizemos com clareza quando o investimento não compensa." },
      { question: "Preciso levar o equipamento a algum endereço?", answer: "Não. Não temos balcão ao público: atendemos no seu endereço ou fazemos coleta e entrega quando o caso exige bancada." },
      { question: "Qual o valor do atendimento no Boqueirão?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da complexidade e de eventuais peças, sempre aprovado antes." },
    ],
  },

  // ── XAXIM ───────────────────────────────────────────────────
  xaxim: {
    slug: "xaxim",
    nome: "Xaxim",
    nomeLocativo: "no Xaxim",
    cidade: "Curitiba",
    areaName: "Xaxim, Curitiba",
    metaTitle: "Técnico de Informática no Xaxim (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Xaxim, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e Wi-Fi em casa. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática no Xaxim – Curitiba",
    subtitulo:
      "Atendimento a moradores e prestadores autônomos do Xaxim, com triagem pelo WhatsApp e diagnóstico antes de qualquer valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Xaxim, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Xaxim é um bairro de ocupação consolidada no sul de Curitiba, com predomínio de casas térreas, sobrados e pequenos condomínios ao longo da Francisco Derosso e das ruas que ligam ao Capão Raso e ao Pinheirinho. É uma região de famílias com filhos em idade escolar e de muitos profissionais autônomos que trabalham de casa — costureiras, corretores, motoristas de aplicativo, professores particulares.",
      "Esse perfil define o tipo de chamado que recebemos: computador antigo que ficou lento demais para as tarefas da escola, notebook de trabalho com bateria e aquecimento comprometidos, e roteador entregue pela operadora que não cobre a casa inteira quando duas ou três pessoas usam a internet ao mesmo tempo. Tudo começa pela conversa no WhatsApp, com o sintoma descrito em detalhe.",
      "A partir da descrição decidimos o caminho: alguns casos são resolvidos remotamente no mesmo dia, outros pedem visita ao seu endereço e uma parte exige bancada, quando o equipamento precisa de teste prolongado ou abertura. Nada é executado antes de você aprovar o valor.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp identificando se é lentidão, falha de hardware ou rede",
      "Diagnóstico técnico antes de indicar peça ou serviço",
      "Prioridade para equipamentos usados em estudo e trabalho em casa",
      "Valor sempre informado e aprovado antes da execução",
    ],
    atendimentoLocal: [
      "Formatação com backup dos arquivos escolares e de trabalho",
      "Troca de HD por SSD em computador que demora a iniciar",
      "Cobertura de Wi-Fi em sobrado e casa com laje",
      "Remoção de vírus e limpeza de extensões de navegador",
    ],
    coletaBancada: [
      "Notebook que aquece muito e desliga sozinho",
      "Tela trincada, dobradiça solta ou teclado que falha",
      "Computador que não dá vídeo e precisa de teste peça a peça",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
      "/servicos/upgrade-ssd-ram",
      "/servicos/redes-e-wifi",
      "/servicos/remocao-de-virus",
    ],
    faqLocal: [
      { question: "O Wi-Fi cai quando todos usam ao mesmo tempo. Tem solução?", answer: "Geralmente sim. Medimos o sinal nos cômodos usados, verificamos interferência de canal e o limite do aparelho da operadora, e só então indicamos reposicionamento, ponto extra por cabo ou mesh." },
      { question: "Vale a pena consertar um notebook antigo do Xaxim?", answer: "Depende do estado da placa, da tela e do custo da peça. Fazemos o diagnóstico e dizemos com clareza quando o reparo compensa e quando o dinheiro é melhor aplicado em outro equipamento." },
      { question: "Vocês atendem à noite ou no fim de semana?", answer: "Trabalhamos por agendamento e ajustamos a janela conforme a agenda disponível. Informe na triagem o melhor horário e confirmamos o que é possível." },
      { question: "Quanto custa o atendimento no Xaxim?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, da complexidade e de eventuais peças, sempre aprovado por você antes." },
    ],
  },

  // ── NOVO MUNDO ──────────────────────────────────────────────
  "novo-mundo": {
    slug: "novo-mundo",
    nome: "Novo Mundo",
    nomeLocativo: "no Novo Mundo",
    cidade: "Curitiba",
    areaName: "Novo Mundo, Curitiba",
    metaTitle: "Técnico de Informática no Novo Mundo (Curitiba) | PC e Notebook",
    metaDescription:
      "Técnico de informática no Novo Mundo, Curitiba: manutenção de computador, conserto de notebook, upgrade de SSD e rede para comércio. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Novo Mundo – Curitiba",
    subtitulo:
      "Suporte a residências e ao comércio de rua do Novo Mundo, com triagem pelo WhatsApp e valor apresentado só depois do diagnóstico.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Novo Mundo, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Novo Mundo é um dos bairros mais populosos da cidade e concentra um comércio de rua vigoroso na Nossa Senhora da Luz e nas vias que cortam a região até o Portão e a Fazendinha. Lojas de material de construção, clínicas pequenas, escritórios de contabilidade e serviços de bairro convivem com quadras inteiramente residenciais.",
      "Essa convivência aparece na nossa fila de atendimentos: metade dos chamados vem de casas — máquina que engasga, sistema desatualizado, arquivos sem backup — e metade de estabelecimentos que dependem de um computador para emitir documento fiscal, imprimir orçamento e manter o sistema do balcão de pé.",
      "O ponto de partida é sempre o WhatsApp. Com o relato do sintoma, apontamos o que dá para tentar por conta, o que exige visita e o que precisa ir para bancada. O valor entra depois do diagnóstico, nunca antes.",
    ],
    operacaoLocal: [
      "Triagem que separa uso doméstico de máquina crítica do comércio",
      "Backup verificado antes de reinstalar sistema de trabalho",
      "Diagnóstico técnico antes de qualquer orçamento",
      "Execução apenas com aprovação prévia do valor",
    ],
    atendimentoLocal: [
      "Manutenção de computador de mesa usado o dia inteiro",
      "Upgrade de SSD e memória para reduzir tempo de espera",
      "Configuração de impressora e compartilhamento de pastas",
      "Ajuste de rede cabeada e Wi-Fi em loja e escritório",
    ],
    coletaBancada: [
      "Fonte queimada ou placa com marca de oscilação de energia",
      "Notebook com falha intermitente que só aparece após horas ligado",
      "Disco com erro de leitura e necessidade de recuperação de dados",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-computador",
      "/servicos/upgrade-ssd-ram",
      "/servicos/suporte-tecnico-empresarial",
      "/servicos/recuperacao-de-dados",
      "/servicos/formatacao",
    ],
    faqLocal: [
      { question: "Atendem lojas e escritórios no Novo Mundo?", answer: "Sim, com suporte pontual ou acompanhamento recorrente: computador do balcão, impressora, rede e rotina de backup. Combinamos a janela de atendimento para reduzir o impacto no expediente." },
      { question: "O computador demora muito para abrir o sistema. É vírus?", answer: "Nem sempre. Disco mecânico saturado, memória insuficiente e programas em segundo plano explicam boa parte dos casos. O diagnóstico distingue causa de software e de hardware antes de qualquer troca." },
      { question: "Perdi arquivos importantes. Ainda dá para recuperar?", answer: "Em muitos casos sim, desde que o equipamento pare de ser usado imediatamente. Avaliamos o disco e informamos a chance real de recuperação antes de iniciar." },
      { question: "Como é cobrado o serviço no Novo Mundo?", answer: "A partir de R$ 99,99 quando aplicável, com o valor final definido após o diagnóstico e aprovado por você antes da execução." },
    ],
  },

  // ── UBERABA ─────────────────────────────────────────────────
  uberaba: {
    slug: "uberaba",
    nome: "Uberaba",
    nomeLocativo: "no Uberaba",
    cidade: "Curitiba",
    areaName: "Uberaba, Curitiba",
    metaTitle: "Técnico de Informática no Uberaba (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Uberaba, Curitiba: conserto de notebook, formatação, remoção de vírus e Wi-Fi para home office. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática no Uberaba – Curitiba",
    subtitulo:
      "Atendimento a famílias e quem trabalha de casa no Uberaba, com triagem pelo WhatsApp e diagnóstico antes de informar preço.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Uberaba, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Uberaba é um bairro extenso do leste de Curitiba, com bolsões residenciais que vão das proximidades do Jardim das Américas até a divisa com o Cajuru e o Prado Velho. Nos últimos anos ganhou muitos condomínios verticais, e com eles um público que trabalha em casa em regime híbrido e depende de conexão estável e máquina rápida para reuniões diárias.",
      "Os chamados mais frequentes refletem isso: microfone e câmera que somem em chamada, notebook que não segura a bateria depois de anos de uso, sistema travando durante o expediente e Wi-Fi instável em apartamento com muitas redes vizinhas concorrendo pelo mesmo canal.",
      "Começamos pelo WhatsApp para entender rotina, urgência e o equipamento envolvido. Casos de configuração costumam sair por atendimento remoto no mesmo dia; falhas físicas seguem para visita ou coleta, com aprovação de valor antes de qualquer serviço.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com atenção a horário de reunião e expediente",
      "Atendimento remoto quando o problema é de configuração",
      "Diagnóstico técnico antes de indicar troca de componente",
      "Valor apresentado e aprovado antes da execução",
    ],
    atendimentoLocal: [
      "Ajuste de câmera, áudio e periféricos para home office",
      "Formatação com backup e reinstalação de programas de trabalho",
      "Estabilização de Wi-Fi em apartamento com muitas redes por perto",
      "Limpeza de vírus e recuperação de contas e senhas do sistema",
    ],
    coletaBancada: [
      "Bateria inchada ou notebook que só funciona na tomada",
      "Teclado com teclas travadas por líquido derramado",
      "Equipamento que reinicia sozinho e precisa de teste em bancada",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/redes-e-wifi",
      "/servicos/formatacao",
      "/servicos/remocao-de-virus",
      "/servicos/manutencao-de-computador",
    ],
    faqLocal: [
      { question: "Trabalho em casa e não posso ficar sem o notebook. Como fica?", answer: "Diga isso na triagem. Priorizamos o que pode ser resolvido remotamente ou no seu endereço e, quando a coleta é inevitável, alinhamos prazo antes de retirar o equipamento." },
      { question: "A internet do apartamento oscila nas chamadas. É o provedor?", answer: "Pode ser, mas em prédios o mais comum é disputa de canal com dezenas de redes vizinhas. Medimos e ajustamos canal, banda e posição do roteador antes de sugerir trocar de plano ou aparelho." },
      { question: "Vocês instalam programas e configuram e-mail corporativo?", answer: "Sim, incluindo pacote de escritório, VPN, impressoras e contas de e-mail, com atenção às licenças que você já possui." },
      { question: "Qual o valor do serviço no Uberaba?", answer: "A partir de R$ 99,99 quando aplicável. O valor final é definido após o diagnóstico e depende do equipamento, da complexidade e de peças, sempre aprovado antes." },
    ],
  },

  // ── REBOUÇAS ────────────────────────────────────────────────
  reboucas: {
    slug: "reboucas",
    nome: "Rebouças",
    nomeLocativo: "no Rebouças",
    cidade: "Curitiba",
    areaName: "Rebouças, Curitiba",
    metaTitle: "Técnico de Informática no Rebouças (Curitiba) | Empresas e PC",
    metaDescription:
      "Técnico de informática no Rebouças, Curitiba: suporte a escritórios, manutenção de computador, formatação e rede. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática no Rebouças – Curitiba",
    subtitulo:
      "Suporte técnico a escritórios, coworkings e moradores do Rebouças, com triagem pelo WhatsApp e valor só depois do diagnóstico.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Rebouças, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Rebouças é o bairro onde galpões antigos viraram escritórios, estúdios e coworkings, ao lado de prédios residenciais e do fluxo intenso da região da Estação. Essa vocação de trabalho aparece na demanda: equipes pequenas com cinco a vinte estações, empresas de serviço que rodam sistemas na nuvem e profissionais criativos com máquinas exigentes em edição e renderização.",
      "Nesse contexto, a conversa técnica muda de foco. Não se trata só de consertar um equipamento, mas de manter a operação em pé: estação que não pode parar, backup que precisa existir de fato, rede que suporta videochamada e transferência de arquivos grandes simultaneamente.",
      "A triagem começa pelo WhatsApp, com descrição do parque de máquinas e da urgência. A partir dela definimos atendimento remoto, visita ao escritório ou coleta para bancada, sempre com diagnóstico antes do valor e execução só após aprovação.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com levantamento das máquinas envolvidas",
      "Atendimento planejado para reduzir parada de equipe",
      "Diagnóstico antes de indicar upgrade ou substituição",
      "Orçamento aprovado por escrito antes de executar",
    ],
    atendimentoLocal: [
      "Suporte a estações de trabalho e periféricos de escritório",
      "Upgrade de SSD e memória para edição e planilhas pesadas",
      "Organização de rede, cabeamento lógico e Wi-Fi corporativo",
      "Rotina de backup e checagem de restauração dos arquivos",
    ],
    coletaBancada: [
      "Estação que desliga sob carga alta de processamento",
      "Fonte ou placa-mãe com falha após pico de energia",
      "Disco de projeto com erro e necessidade de recuperação",
    ],
    servicosPrioritarios: [
      "/servicos/suporte-tecnico-empresarial",
      "/servicos/manutencao-de-computador",
      "/servicos/upgrade-ssd-ram",
      "/servicos/recuperacao-de-dados",
      "/servicos/redes-e-wifi",
    ],
    faqLocal: [
      { question: "Vocês dão suporte a escritórios pequenos no Rebouças?", answer: "Sim. Atendemos equipes enxutas com chamados pontuais ou acompanhamento periódico, cobrindo estações, rede, impressoras e rotina de backup." },
      { question: "Dá para melhorar uma máquina de edição sem trocar tudo?", answer: "Frequentemente sim. Avaliamos gargalo real — disco, memória, refrigeração ou processador — e indicamos o upgrade que traz ganho perceptível, evitando gasto desnecessário." },
      { question: "Como funciona o backup para empresa?", answer: "Definimos o que precisa ser copiado, com que frequência e para onde, e testamos a restauração. Backup que nunca foi restaurado não é backup confiável." },
      { question: "Quanto custa o atendimento no Rebouças?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do número de equipamentos, da complexidade e de peças, sempre aprovado antes da execução." },
    ],
  },
};


export const BAIRRO_LIST = Object.values(BAIRROS);
