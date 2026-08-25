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
      "Essa convivência aparece na nossa fila de atendimentos: metade dos chamados vem de casas — máquina que engasga, sistema desatualizado, arquivos sem backup — e metade de estabelecimentos que dependem de um computador para emitir documento fiscal, imprimir proposta e manter o sistema do balcão de pé.",
      "O ponto de partida é sempre o WhatsApp. Com o relato do sintoma, apontamos o que dá para tentar por conta, o que exige visita e o que precisa ir para bancada. O valor entra depois do diagnóstico, nunca antes.",
    ],
    operacaoLocal: [
      "Triagem que separa uso doméstico de máquina crítica do comércio",
      "Backup verificado antes de reinstalar sistema de trabalho",
      "Diagnóstico técnico antes de qualquer valor fechado",
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
      "Valor aprovado por escrito antes de executar",
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

  // ── HAUER ───────────────────────────────────────────────────
  hauer: {
    slug: "hauer",
    nome: "Hauer",
    nomeLocativo: "no Hauer",
    cidade: "Curitiba",
    areaName: "Hauer, Curitiba",
    metaTitle: "Técnico de Informática no Hauer (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Hauer, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e rede Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática no Hauer – Curitiba",
    subtitulo:
      "Atendimento para moradores e comércios do Hauer, com triagem pelo WhatsApp e valor informado só depois do diagnóstico.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Hauer, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Hauer é um bairro de ocupação consolidada no sul de Curitiba, com ruas residenciais tranquilas e um eixo comercial forte ao longo da Avenida Marechal Floriano Peixoto. Essa combinação cria dois perfis bem distintos de chamado: a família que usa um único notebook para estudo, trabalho remoto e streaming, e o comércio de rua que depende de um computador de frente de caixa que não pode ficar parado no meio do expediente.",
      "Boa parte dos casos que chegam do Hauer envolve máquinas que já passaram dos cinco anos de uso e nunca receberam limpeza interna nem troca de pasta térmica. O sintoma típico é o mesmo: o computador liga normalmente, funciona nos primeiros minutos e vai perdendo velocidade conforme esquenta, até travar ou reiniciar sozinho. Em muitos desses casos o equipamento não precisa ser substituído — precisa de manutenção térmica, disco SSD e sistema reinstalado corretamente.",
      "Também recebemos bastante chamado de rede. Sobrados e casas com laje no Hauer costumam sofrer com o roteador instalado num canto da sala, deixando quartos dos fundos e área de serviço sem sinal utilizável. Antes de vender repetidor, medimos onde o sinal cai de fato e avaliamos se reposicionar o equipamento já resolve.",
      "O contato começa sempre pelo WhatsApp: você descreve o sintoma, recebe as primeiras orientações e, quando faz sentido, combinamos a avaliação. A modalidade — no local, remoto ou coleta para bancada — é definida pelo tipo de problema, nunca prometida antes de entender o caso.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com descrição do sintoma e do uso da máquina",
      "Diagnóstico técnico antes de informar qualquer valor",
      "Execução somente depois da sua aprovação por escrito",
      "Horário combinado para não parar o comércio no pico de movimento",
    ],
    atendimentoLocal: [
      "Formatação com backup e reinstalação do sistema",
      "Limpeza interna, troca de pasta térmica e revisão de refrigeração",
      "Instalação de SSD e ampliação de memória",
      "Configuração de roteador e cobertura de Wi-Fi em casa ou na loja",
    ],
    coletaBancada: [
      "Notebook que não liga ou desliga sozinho durante o uso",
      "Troca de tela, dobradiça ou conector de energia",
      "Suspeita de falha na placa-mãe após oscilação de energia",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
      "/servicos/remocao-de-virus",
      "/servicos/upgrade-ssd-ram",
      "/servicos/redes-e-wifi",
    ],
    faqLocal: [
      { question: "Vocês atendem no Hauer no mesmo dia?", answer: "Depende da agenda e do tipo de problema. Na triagem pelo WhatsApp informamos o primeiro horário realmente disponível, sem prometer prazo que não conseguimos cumprir." },
      { question: "Meu computador esquenta e trava. Precisa trocar?", answer: "Na maioria dos casos, não. Superaquecimento costuma vir de dissipador entupido e pasta térmica ressecada. Fazemos a limpeza, medimos temperatura sob carga e só indicamos peça se o problema persistir." },
      { question: "Atendem comércio na Marechal Floriano?", answer: "Sim. Trabalhamos com estações de frente de caixa, impressora e rede da loja, combinando horário fora do pico para reduzir o impacto no atendimento ao cliente." },
      { question: "O Wi-Fi não chega nos quartos dos fundos. Tem solução?", answer: "Sim. Medimos o sinal ponto a ponto, avaliamos reposicionamento do roteador e, se realmente for necessário, indicamos repetidor ou ponto de acesso adicional com cabeamento." },
      { question: "Quanto custa o atendimento no Hauer?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e de eventuais peças, sempre apresentado e aprovado antes da execução." },
    ],
  },

  // ── PINHEIRINHO ─────────────────────────────────────────────
  pinheirinho: {
    slug: "pinheirinho",
    nome: "Pinheirinho",
    nomeLocativo: "no Pinheirinho",
    cidade: "Curitiba",
    areaName: "Pinheirinho, Curitiba",
    metaTitle: "Técnico de Informática no Pinheirinho (Curitiba) | PC e Notebook",
    metaDescription:
      "Técnico de informática no Pinheirinho, Curitiba: manutenção de computador, conserto de notebook, formatação e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática no Pinheirinho – Curitiba",
    subtitulo:
      "Suporte técnico para moradores, estudantes e pequenos negócios do Pinheirinho, com diagnóstico antes do valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Pinheirinho, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Pinheirinho é um dos bairros mais populosos do sul de Curitiba e concentra um fluxo enorme de pessoas em torno do terminal e do eixo da Winston Churchill. Essa densidade se traduz em uma demanda técnica bem específica: muita máquina compartilhada por família inteira, notebook usado por estudante durante o dia e por adulto em home office à noite, e computadores de pequenos negócios de rua que rodam sistema de vendas o expediente todo.",
      "Máquina compartilhada é máquina que acumula problema. É comum chegar do Pinheirinho um notebook com dezenas de programas instalados por pessoas diferentes, extensões de navegador desconhecidas, antivírus duplicado e disco cheio de arquivos duplicados. Nesses casos o serviço correto não é apenas 'formatar': é fazer backup organizado, reinstalar o sistema limpo, devolver os arquivos separados por usuário e deixar o equipamento com rotina de atualização que o dono consiga manter sozinho.",
      "Outro chamado recorrente no bairro é o de pop-up e propaganda invasiva no navegador, geralmente vindo de instalador baixado de site pirata. Tratamos como remoção de malware de verdade: identificamos o que está persistindo no sistema, removemos, revisamos navegadores e orientamos sobre a origem para o problema não voltar em duas semanas.",
      "Tudo começa pelo WhatsApp. Você conta o que está acontecendo, recebe orientação inicial e definimos junto se o caso resolve remoto, se compensa visita ou se o equipamento precisa ir para bancada.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp antes de agendar qualquer visita",
      "Backup dos arquivos combinado antes de qualquer formatação",
      "Diagnóstico primeiro, valor depois, execução só com aprovação",
      "Orientação de uso ao final para o problema não se repetir",
    ],
    atendimentoLocal: [
      "Formatação com backup e organização dos arquivos por usuário",
      "Remoção de vírus, pop-ups e sequestro de navegador",
      "Instalação de SSD para acelerar máquina antiga",
      "Configuração de Wi-Fi e senha da rede doméstica",
    ],
    coletaBancada: [
      "Notebook que não dá vídeo ou não passa da tela inicial",
      "Teclado, bateria ou carcaça danificados por queda",
      "Disco com ruído ou falha de leitura exigindo tentativa de recuperação",
    ],
    servicosPrioritarios: [
      "/servicos/formatacao",
      "/servicos/remocao-de-virus",
      "/servicos/manutencao-de-computador",
      "/servicos/upgrade-ssd-ram",
      "/servicos/recuperacao-de-dados",
    ],
    faqLocal: [
      { question: "Formatar apaga meus arquivos e fotos?", answer: "Não, quando o backup é feito antes. Combinamos o que precisa ser salvo, copiamos os dados, reinstalamos o sistema e devolvemos os arquivos organizados na máquina." },
      { question: "Meu notebook está cheio de propaganda abrindo sozinha. É vírus?", answer: "Normalmente é adware instalado junto com algum programa baixado fora da loja oficial. Fazemos a remoção, limpamos os navegadores e mostramos de onde veio para evitar reincidência." },
      { question: "Vale a pena colocar SSD num computador antigo?", answer: "Na maioria das vezes sim. Em máquinas com disco mecânico, a troca por SSD costuma ser o upgrade com maior ganho percebido por real investido. Avaliamos antes se a máquina comporta." },
      { question: "Atendem pequenos negócios no Pinheirinho?", answer: "Sim. Atendemos comércios de rua com computador de vendas, impressora e rede, com horário combinado para não travar o atendimento." },
      { question: "Qual o valor do serviço no Pinheirinho?", answer: "A partir de R$ 99,99 quando aplicável. O total depende do serviço executado e de peças, sempre aprovado por você antes de começarmos." },
    ],
  },

  // ── BACACHERI ───────────────────────────────────────────────
  bacacheri: {
    slug: "bacacheri",
    nome: "Bacacheri",
    nomeLocativo: "no Bacacheri",
    cidade: "Curitiba",
    areaName: "Bacacheri, Curitiba",
    metaTitle: "Técnico de Informática no Bacacheri (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Bacacheri, Curitiba: conserto de notebook, manutenção de computador, formatação e rede Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática no Bacacheri – Curitiba",
    subtitulo:
      "Atendimento a domicílio e por coleta no Bacacheri, com triagem pelo WhatsApp e valor aprovado antes da execução.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Bacacheri, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Bacacheri tem um perfil residencial marcado por casas de terreno amplo, arborização densa e vias largas na região da Erasto Gaertner. Esse desenho urbano tem um efeito prático que aparece direto nos chamados: casa grande com um único roteador entregue pela operadora significa cômodo dos fundos, escritório em anexo e edícula sem sinal decente de Wi-Fi. É um dos bairros em que mais avaliamos cobertura de rede antes de qualquer outra coisa.",
      "O segundo grupo de chamados vem de home office consolidado. Muitos moradores trabalham em casa em período integral e usam a mesma máquina para videochamada, planilha pesada e arquivo em nuvem. Quando essa máquina começa a travar, o prejuízo é imediato — por isso priorizamos diagnóstico rápido e, quando possível, deixamos o equipamento operacional no mesmo atendimento, adiando só o que exige bancada.",
      "Também é comum no bairro o computador de mesa montado há anos, que ainda tem uma boa base de hardware mas roda com disco mecânico e memória insuficiente para o uso atual. Nesses casos, medimos o gargalo real antes de sugerir compra: muitas vezes SSD, memória e limpeza térmica devolvem a máquina a um patamar de uso confortável por uma fração do custo de trocar tudo.",
      "O caminho é sempre o mesmo: WhatsApp para triagem, diagnóstico técnico, valor apresentado por escrito e execução só depois da sua aprovação.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com foco em impacto no trabalho e urgência",
      "Medição real da cobertura de Wi-Fi antes de indicar equipamento",
      "Diagnóstico antes do valor, sempre",
      "Coleta e entrega quando o reparo exige bancada",
    ],
    atendimentoLocal: [
      "Diagnóstico de lentidão e travamento em desktop e notebook",
      "Upgrade de SSD e memória para home office",
      "Cobertura de Wi-Fi em casas grandes e escritório anexo",
      "Configuração de backup em nuvem e organização de arquivos",
    ],
    coletaBancada: [
      "Desktop que não liga ou reinicia sob carga",
      "Notebook com tela quebrada ou dobradiça rompida",
      "Fonte ou placa com sinal de dano após queda de energia",
    ],
    servicosPrioritarios: [
      "/servicos/redes-e-wifi",
      "/servicos/manutencao-de-computador",
      "/servicos/upgrade-ssd-ram",
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
    ],
    faqLocal: [
      { question: "Minha casa é grande e o Wi-Fi não chega nos fundos. O que fazem?", answer: "Medimos a intensidade do sinal nos cômodos críticos, avaliamos reposicionamento do roteador e, quando necessário, indicamos ponto de acesso adicional ou repetidor com posicionamento correto — não apenas um aparelho a mais na tomada." },
      { question: "Trabalho em casa e não posso ficar sem o computador. Como funciona?", answer: "Priorizamos deixar a máquina operacional no atendimento e separamos para bancada apenas o que exige desmontagem. Combinamos previamente o tempo estimado de indisponibilidade." },
      { question: "Meu PC de mesa é antigo. Compensa consertar?", answer: "Avaliamos o hardware atual e o uso pretendido. Se a base ainda for adequada, SSD, memória e limpeza térmica costumam resolver. Se não for, dizemos com clareza que a substituição é a melhor escolha." },
      { question: "Vocês fazem coleta no Bacacheri?", answer: "Sim, para os casos que exigem bancada. A coleta é combinada na triagem e o equipamento é devolvido após o reparo aprovado." },
      { question: "Quanto custa o atendimento no Bacacheri?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e de peças, informado e aprovado antes da execução." },
    ],
  },

  // ── CAPÃO RASO ──────────────────────────────────────────────
  "capao-raso": {
    slug: "capao-raso",
    nome: "Capão Raso",
    nomeLocativo: "no Capão Raso",
    cidade: "Curitiba",
    areaName: "Capão Raso, Curitiba",
    metaTitle: "Técnico de Informática no Capão Raso (Curitiba) | PC e Notebook",
    metaDescription:
      "Técnico de informática no Capão Raso, Curitiba: conserto de notebook, formatação com backup, remoção de vírus e upgrade de SSD. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Capão Raso – Curitiba",
    subtitulo:
      "Atendimento técnico para casas, apartamentos e comércios do Capão Raso, com triagem pelo WhatsApp e valor só depois do diagnóstico.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Capão Raso, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Capão Raso cresceu em torno do terminal e da Avenida Republica Argentina, misturando prédios residenciais, casas antigas e um comércio de bairro bastante ativo. O resultado é um parque de equipamentos heterogêneo: notebooks de estudante, desktops de família comprados há muitos anos e computadores de loja rodando sistema de vendas o dia inteiro, todos com necessidades de manutenção diferentes.",
      "Em apartamento, o chamado mais frequente é de rede: roteador da operadora instalado na entrada, paredes de concreto e sinal que morre no quarto onde a pessoa realmente trabalha. Em casa, o cenário muda para máquina antiga com disco mecânico, sistema desatualizado e inicialização que leva minutos. São problemas distintos e cada um pede uma abordagem própria — por isso a triagem detalhada antes do agendamento faz diferença.",
      "No comércio local, o ponto crítico é continuidade. Um computador de caixa parado significa venda perdida, então trabalhamos com horário combinado, diagnóstico objetivo e, quando o reparo é longo, alternativa provisória para o negócio não travar. Também revisamos backup: muitos comércios pequenos guardam anos de registro em uma única máquina, sem qualquer cópia.",
      "O atendimento começa no WhatsApp, com descrição do sintoma e do uso. A partir daí definimos se resolve remoto, se vale visita ou se o equipamento precisa ir para bancada, sempre com valor aprovado antes da execução.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com sintoma, modelo e tipo de uso",
      "Agendamento em horário que não interrompa o comércio",
      "Diagnóstico técnico antes de qualquer valor",
      "Revisão de backup antes de intervenções que apagam dados",
    ],
    atendimentoLocal: [
      "Formatação com backup e reinstalação de programas essenciais",
      "Remoção de vírus e limpeza de navegadores",
      "Instalação de SSD e ampliação de memória",
      "Configuração de rede Wi-Fi em apartamento e loja",
    ],
    coletaBancada: [
      "Notebook que não liga, não carrega ou perde imagem",
      "Troca de tela, teclado ou conector de carga",
      "Tentativa de recuperação de dados em disco com falha",
    ],
    servicosPrioritarios: [
      "/servicos/formatacao",
      "/servicos/manutencao-de-notebook",
      "/servicos/remocao-de-virus",
      "/servicos/upgrade-ssd-ram",
      "/servicos/redes-e-wifi",
    ],
    faqLocal: [
      { question: "O Wi-Fi do meu apartamento no Capão Raso é fraco no quarto. Dá para resolver?", answer: "Sim. Verificamos canal, posicionamento e interferência de redes vizinhas — em prédio, é comum o problema ser congestionamento de canal, e não falta de aparelho." },
      { question: "Meu computador demora minutos para ligar. O que costuma ser?", answer: "Na maior parte dos casos é disco mecânico somado a programas iniciando junto com o sistema. Migração para SSD e limpeza de inicialização mudam completamente a experiência de uso." },
      { question: "Atendem loja com sistema de vendas?", answer: "Sim. Combinamos horário de menor movimento, avaliamos o computador de caixa, a impressora e a rede, e orientamos sobre backup dos registros." },
      { question: "Vocês tentam recuperar arquivos de HD com defeito?", answer: "Fazemos a tentativa em bancada e informamos as chances antes. Recuperação de dados nunca tem garantia de sucesso — o que garantimos é transparência sobre o que é possível." },
      { question: "Quanto custa o atendimento no Capão Raso?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e de peças, sempre apresentado e aprovado antes da execução." },
    ],
  },

  // ── SÍTIO CERCADO ───────────────────────────────────────────
  "sitio-cercado": {
    slug: "sitio-cercado",
    nome: "Sítio Cercado",
    nomeLocativo: "no Sítio Cercado",
    cidade: "Curitiba",
    areaName: "Sítio Cercado, Curitiba",
    metaTitle: "Técnico de Informática no Sítio Cercado (Curitiba) | PC e Notebook",
    metaDescription:
      "Técnico de informática no Sítio Cercado, Curitiba: formatação com backup, remoção de vírus, troca de SSD e conserto de notebook. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Sítio Cercado – Curitiba",
    subtitulo:
      "Atendimento para famílias, estudantes e pequenos comércios do Sítio Cercado, com triagem pelo WhatsApp e valor informado só depois do diagnóstico.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Sítio Cercado, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Sítio Cercado é um dos bairros mais populosos de Curitiba e isso muda o perfil dos chamados que recebemos de lá. A maior parte das casas tem um único computador compartilhado entre trabalho, tarefa escolar e entretenimento, então cada hora parada pesa. O pedido mais comum não é troca de máquina: é fazer o equipamento existente voltar a ser utilizável sem gasto desnecessário.",
      "As ruas internas do bairro, entre a Avenida Izaac Ferreira da Cruz e o eixo do Ganchinho, concentram muitos sobrados e casas geminadas. Nesses imóveis o roteador quase sempre fica na sala, junto da entrada do provedor, e o segundo andar recebe sinal fraco. Antes de sugerir compra de repetidor, medimos a queda de sinal cômodo a cômodo, porque em boa parte das vezes reposicionar o roteador e trocar o canal de transmissão já resolve.",
      "Também vemos muito notebook de uso escolar com disco mecânico original de fábrica, sistema cheio de programas que iniciam junto com o Windows e sem qualquer rotina de backup. Nesses casos a combinação de SSD, limpeza física e reinstalação limpa costuma devolver a máquina a um patamar bem acima do que o dono esperava.",
      "O primeiro contato é sempre pelo WhatsApp. Você descreve o sintoma, recebe orientação inicial e, quando é preciso avaliação técnica, combinamos a modalidade: no local, remoto ou coleta para bancada — definida pelo tipo de problema, nunca prometida antes de entender o caso.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com descrição do sintoma antes de qualquer deslocamento",
      "Diagnóstico técnico antes de informar valor",
      "Execução somente após aprovação por escrito",
      "Horário combinado, incluindo fim de tarde para quem trabalha fora",
    ],
    atendimentoLocal: [
      "Formatação com backup dos arquivos pessoais",
      "Remoção de vírus, adware e sequestro de navegador",
      "Instalação de SSD e ampliação de memória em notebook de estudo",
      "Ajuste de roteador e cobertura de Wi-Fi em sobrado",
    ],
    coletaBancada: [
      "Notebook que não liga ou não carrega a bateria",
      "Tela trincada, dobradiça quebrada ou carcaça solta",
      "Computador com sinal de curto após queda de energia",
    ],
    servicosPrioritarios: [
      "/servicos/formatacao",
      "/servicos/remocao-de-virus",
      "/servicos/upgrade-ssd-ram",
      "/servicos/manutencao-de-notebook",
      "/servicos/redes-e-wifi",
    ],
    faqLocal: [
      { question: "Vale a pena consertar um notebook antigo do Sítio Cercado ou comprar outro?", answer: "Depende do diagnóstico. Se a placa está saudável e o gargalo é disco mecânico, memória curta ou sistema comprometido, o reparo custa muito menos que um aparelho novo. Quando a placa exige reparo caro, dizemos isso com clareza e você decide." },
      { question: "Consigo atendimento fora do horário comercial?", answer: "Combinamos horário na triagem, incluindo fim de tarde. Não prometemos horário antes de confirmar a agenda do dia." },
      { question: "Meus arquivos e fotos se perdem na formatação?", answer: "Não, quando o disco está legível. Fazemos o backup antes, você confere o que foi salvo e só então reinstalamos o sistema." },
      { question: "O Wi-Fi não sobe para o segundo andar. Preciso de repetidor?", answer: "Nem sempre. Medimos o sinal em cada cômodo e testamos reposicionamento e troca de canal antes de indicar qualquer equipamento extra." },
      { question: "Atendem pequenos comércios do bairro?", answer: "Sim. Trabalhamos com computador de caixa, impressora fiscal e rede da loja, com horário combinado para não parar o movimento." },
    ],
  },

  // ── FAZENDINHA ──────────────────────────────────────────────
  fazendinha: {
    slug: "fazendinha",
    nome: "Fazendinha",
    nomeLocativo: "na Fazendinha",
    cidade: "Curitiba",
    areaName: "Fazendinha, Curitiba",
    metaTitle: "Técnico de Informática na Fazendinha (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática na Fazendinha, Curitiba: conserto de notebook, formatação, limpeza interna e configuração de Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática na Fazendinha – Curitiba",
    subtitulo:
      "Suporte técnico para moradores e comércio da Fazendinha, com diagnóstico antes do valor e aprovação por escrito.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática na Fazendinha, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "A Fazendinha combina um miolo residencial antigo com um comércio de bairro ativo em torno da Avenida Winston Churchill e da Rua Carlos Klemtz. Essa mistura aparece nos chamados: de manhã costumam ser lojas e escritórios pequenos com computador de atendimento travando; à tarde, moradores com notebook lento ou impressora que parou de ser reconhecida.",
      "Muitas residências da Fazendinha são casas térreas com edícula ou puxado nos fundos, e é exatamente ali que o Wi-Fi falha. Como a parede entre a casa principal e o fundo costuma ser de alvenaria dupla, o sinal chega, mas com taxa baixa demais para videochamada. Nesse cenário avaliamos cabeamento curto ou ponto de acesso adicional em vez de empilhar repetidores.",
      "Outro padrão frequente é o computador de mesa montado há anos, com fonte genérica e ventoinha ruidosa. Antes de indicar troca, medimos temperatura sob carga, revisamos alimentação e conferimos a saúde do disco — muita máquina considerada 'perdida' volta a rodar bem com SSD, limpeza e sistema reinstalado.",
      "O atendimento começa pelo WhatsApp: você conta o sintoma, recebe as primeiras orientações e definimos juntos se o caso é para atendimento no local, remoto ou coleta para bancada. Valor só depois do diagnóstico, sempre aprovado por você antes da execução.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com descrição do sintoma e do uso do equipamento",
      "Diagnóstico técnico antes de qualquer valor",
      "Aprovação por escrito antes da execução",
      "Agenda combinada para comércio fora do pico de movimento",
    ],
    atendimentoLocal: [
      "Limpeza interna, troca de pasta térmica e revisão de ventoinhas",
      "Formatação com backup e reinstalação de programas de trabalho",
      "Instalação e configuração de impressora em rede",
      "Ajuste de Wi-Fi para casa com edícula ou puxado nos fundos",
    ],
    coletaBancada: [
      "Desktop que desliga sozinho sob carga",
      "Notebook com carcaça, dobradiça ou conector danificado",
      "Recuperação de dados de disco com falha de leitura",
    ],
    servicosPrioritarios: [
      "/servicos/manutencao-de-computador",
      "/servicos/formatacao",
      "/servicos/redes-e-wifi",
      "/servicos/upgrade-ssd-ram",
      "/servicos/remocao-de-virus",
    ],
    faqLocal: [
      { question: "O computador da minha loja na Fazendinha trava no horário de pico. Dá para resolver no local?", answer: "Na maioria das vezes sim: limpeza, revisão térmica, troca de disco e ajuste do sistema são feitos no próprio balcão. Só levamos para bancada quando há suspeita de falha elétrica na placa." },
      { question: "Vocês configuram impressora compartilhada?", answer: "Sim. Instalamos e compartilhamos impressora na rede local, incluindo o caso comum de cada computador enxergar a impressora com nome diferente." },
      { question: "Tenho edícula nos fundos sem sinal. Repetidor resolve?", answer: "Depende da estrutura. Onde há parede dupla, repetidor entrega sinal fraco. Costuma ser mais estável um cabo curto até um ponto de acesso no fundo — avaliamos antes de indicar." },
      { question: "Qual o valor do atendimento na Fazendinha?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e das peças, apresentado antes da execução." },
      { question: "Preciso levar o equipamento em algum lugar?", answer: "Não. Não temos balcão de atendimento ao público: quando o caso exige bancada, combinamos coleta e devolução." },
    ],
  },

  // ── CAMPO COMPRIDO ──────────────────────────────────────────
  "campo-comprido": {
    slug: "campo-comprido",
    nome: "Campo Comprido",
    nomeLocativo: "no Campo Comprido",
    cidade: "Curitiba",
    areaName: "Campo Comprido, Curitiba",
    metaTitle: "Técnico de Informática no Campo Comprido (Curitiba) | PC e Notebook",
    metaDescription:
      "Técnico de informática no Campo Comprido, Curitiba: suporte a home office, formatação, upgrade de SSD e rede Wi-Fi em condomínio. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Campo Comprido – Curitiba",
    subtitulo:
      "Atendimento para condomínios, home office e escritórios do Campo Comprido, com diagnóstico antes do valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Campo Comprido, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Campo Comprido concentra condomínios verticais recentes ao longo da Avenida Manoel Ribas e da Rua Eduardo Sprada, e essa verticalização define o tipo de chamado. A maioria dos pedidos vem de quem trabalha em casa e precisa de estabilidade: videochamada sem queda, VPN da empresa funcionando e backup automático dos arquivos de trabalho.",
      "Apartamento em prédio novo tem um problema específico de rede: dezenas de redes Wi-Fi disputando os mesmos canais na faixa de 2,4 GHz. O sintoma clássico é internet 'rápida no teste de velocidade' e péssima na reunião. Nesses casos separamos as faixas de 2,4 e 5 GHz, ajustamos canal e potência e testamos a estabilidade em uso real, não só no medidor.",
      "Também atendemos muito notebook corporativo trazido para casa, com disco criptografado e políticas da empresa. Aqui a regra é clara: só mexemos no que o usuário tem autorização para alterar, e qualquer intervenção que dependa do TI da empresa é sinalizada antes.",
      "O contato é pelo WhatsApp. Descrevendo o sintoma e o modelo do equipamento já conseguimos indicar se o caso resolve em atendimento remoto, se compensa visita no local ou se será necessária coleta para bancada.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com sintoma, modelo e tipo de uso",
      "Diagnóstico antes de informar valor",
      "Aprovação por escrito antes de qualquer execução",
      "Horário combinado com portaria quando o condomínio exige autorização",
    ],
    atendimentoLocal: [
      "Estabilização de Wi-Fi em apartamento com interferência de canais",
      "Configuração de home office: videochamada, VPN e backup automático",
      "Instalação de SSD NVMe e ampliação de memória",
      "Formatação com backup e reinstalação dos programas de trabalho",
    ],
    coletaBancada: [
      "Notebook que superaquece e desliga em reunião",
      "Falha de vídeo ou tela sem imagem com máquina ligada",
      "Suspeita de defeito na placa após oscilação elétrica",
    ],
    servicosPrioritarios: [
      "/servicos/redes-e-wifi",
      "/servicos/upgrade-ssd-ram",
      "/servicos/formatacao",
      "/servicos/manutencao-de-notebook",
      "/servicos/remocao-de-virus",
    ],
    faqLocal: [
      { question: "Minha internet cai só nas videochamadas. É problema do provedor?", answer: "Nem sempre. Em prédios do Campo Comprido a causa mais comum é disputa de canal no Wi-Fi. Testamos a rede em uso real, separamos as faixas e só então avaliamos se o problema é do link do provedor." },
      { question: "Vocês atendem dentro de condomínio?", answer: "Sim. Combinamos horário e autorização na portaria durante a triagem, para evitar espera no acesso." },
      { question: "Dá para configurar backup automático do trabalho?", answer: "Sim. Configuramos backup em nuvem e/ou disco externo com rotina automática e testamos a restauração de um arquivo para comprovar que está funcionando." },
      { question: "Meu notebook é da empresa. Vocês mexem?", answer: "Só no que você tem autorização para alterar. Quando a mudança depende do TI da empresa, avisamos antes de qualquer intervenção." },
      { question: "Quanto custa o atendimento no Campo Comprido?", answer: "A partir de R$ 99,99 quando aplicável, com valor final apresentado após o diagnóstico e aprovado por você." },
    ],
  },

  // ── MERCÊS ──────────────────────────────────────────────────
  merces: {
    slug: "merces",
    nome: "Mercês",
    nomeLocativo: "nas Mercês",
    cidade: "Curitiba",
    areaName: "Mercês, Curitiba",
    metaTitle: "Técnico de Informática nas Mercês (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática nas Mercês, Curitiba: conserto de notebook, formatação com backup, recuperação de arquivos e Wi-Fi. A partir de R$ 99,99. Atendimento via WhatsApp.",
    h1: "Técnico de Informática nas Mercês – Curitiba",
    subtitulo:
      "Atendimento para residências, consultórios e escritórios das Mercês, com valor informado só depois do diagnóstico.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática nas Mercês, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "As Mercês são um bairro tradicional da região central de Curitiba, com casas antigas de alvenaria robusta convivendo com prédios de poucos andares e uma boa concentração de consultórios e escritórios profissionais. Essa característica muda o que é urgente por lá: perder acesso a um sistema de agenda ou a uma pasta de documentos costuma ser mais crítico do que a lentidão do computador em si.",
      "Nas casas mais antigas do bairro, com paredes espessas e pé-direito alto, o Wi-Fi enfrenta obstáculos físicos reais. Já vimos muita instalação com três repetidores em série entregando menos que um único ponto de acesso bem posicionado. Nosso trabalho começa medindo, não vendendo equipamento.",
      "Em consultórios, a preocupação principal é integridade e sigilo dos arquivos. Configuramos backup com rotina automática, revisamos permissões de compartilhamento na rede e ajustamos o antivírus para não conflitar com o sistema de gestão usado no atendimento.",
      "Todo atendimento começa pela triagem no WhatsApp: sintoma, tipo de equipamento e o quanto ele é crítico para a sua rotina. A partir daí definimos se resolve remoto, se vale visita no local ou se o caso exige coleta para bancada.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com nível de urgência e criticidade do equipamento",
      "Diagnóstico técnico antes de informar valor",
      "Aprovação por escrito antes da execução",
      "Atendimento em consultório com horário fora da agenda de pacientes",
    ],
    atendimentoLocal: [
      "Backup automático e verificação de restauração dos arquivos",
      "Formatação com preservação de documentos e sistemas de gestão",
      "Revisão de compartilhamento de pastas e permissões na rede",
      "Reestruturação de Wi-Fi em casa antiga com paredes espessas",
    ],
    coletaBancada: [
      "Disco com falha de leitura e necessidade de recuperação de dados",
      "Notebook com dano físico em tela, teclado ou conector",
      "Equipamento que não conclui a inicialização do sistema",
    ],
    servicosPrioritarios: [
      "/servicos/formatacao",
      "/servicos/recuperacao-de-dados",
      "/servicos/redes-e-wifi",
      "/servicos/manutencao-de-notebook",
      "/servicos/upgrade-ssd-ram",
    ],
    faqLocal: [
      { question: "Consigo recuperar arquivos de um disco que parou de abrir?", answer: "Em muitos casos sim, quando a falha é lógica ou o disco ainda é reconhecido. Avaliamos antes e informamos com honestidade a chance real de recuperação, sem cobrar promessa de resultado." },
      { question: "Atendem consultórios sem parar o atendimento?", answer: "Sim. Combinamos janela de horário fora da agenda de pacientes e priorizamos o que pode ser feito sem derrubar o sistema em uso." },
      { question: "Tenho três repetidores e o Wi-Fi continua ruim. Por quê?", answer: "Repetidores em série dividem a banda e aumentam a latência. Medimos o sinal e normalmente substituímos o arranjo por um ponto de acesso bem posicionado, com cabo quando possível." },
      { question: "Vocês configuram backup automático?", answer: "Sim, em nuvem e/ou disco externo, com rotina programada e teste de restauração para comprovar que os arquivos voltam." },
      { question: "Quanto custa o atendimento nas Mercês?", answer: "A partir de R$ 99,99 quando aplicável. O valor final sai após o diagnóstico e só é executado com sua aprovação." },
    ],
  },

  // ── JUVEVÊ ──────────────────────────────────────────────────
  juveve: {
    slug: "juveve",
    nome: "Juvevê",
    nomeLocativo: "no Juvevê",
    cidade: "Curitiba",
    areaName: "Juvevê, Curitiba",
    metaTitle: "Técnico de Informática no Juvevê (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Juvevê, Curitiba: suporte a home office, formatação, upgrade de SSD, Wi-Fi e conserto de notebook. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Juvevê – Curitiba",
    subtitulo:
      "Atendimento para apartamentos, home office e escritórios do Juvevê, com diagnóstico antes do valor.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Juvevê, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Juvevê é um bairro predominantemente vertical, com prédios residenciais em torno da Praça da Espanha e do eixo da Avenida João Gualberto. O perfil de chamado reflete isso: profissionais liberais e famílias que dependem de um notebook para trabalhar em casa e não toleram equipamento fora do ar por dias.",
      "A queixa mais comum é lentidão progressiva em notebooks de linha intermediária com quatro a oito anos de uso. Quase sempre a soma é a mesma: disco mecânico ou SSD saturado, memória insuficiente para o número de abas e programas abertos, e refrigeração comprometida por acúmulo de poeira. Tratamos os três pontos juntos, porque resolver só um deixa o usuário com a impressão de que 'não adiantou nada'.",
      "Em apartamentos do Juvevê também é frequente o problema de rede em imóveis com hall, escritório e quarto em extremidades opostas: o roteador entregue pelo provedor fica na entrada e o cômodo de trabalho recebe o pior sinal. Medimos a cobertura antes de indicar qualquer equipamento adicional.",
      "A triagem é feita pelo WhatsApp: descrevendo o sintoma, o modelo e a rotina de uso, já conseguimos apontar se o caso resolve remoto, no local ou com coleta para bancada, e qual o próximo passo.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com sintoma, modelo e rotina de uso",
      "Diagnóstico técnico antes de qualquer valor",
      "Execução apenas após aprovação por escrito",
      "Horário combinado com a portaria do prédio quando necessário",
    ],
    atendimentoLocal: [
      "Upgrade de SSD e memória em notebook de trabalho",
      "Limpeza interna e troca de pasta térmica",
      "Formatação com backup e reinstalação dos programas usados no dia a dia",
      "Ajuste de Wi-Fi para o cômodo usado como escritório",
    ],
    coletaBancada: [
      "Notebook que não liga ou reinicia sozinho",
      "Tela sem imagem, com listras ou com mancha após impacto",
      "Conector de energia solto ou que esquenta demais",
    ],
    servicosPrioritarios: [
      "/servicos/upgrade-ssd-ram",
      "/servicos/manutencao-de-notebook",
      "/servicos/formatacao",
      "/servicos/redes-e-wifi",
      "/servicos/remocao-de-virus",
    ],
    faqLocal: [
      { question: "Meu notebook ficou lento depois de anos de uso. SSD resolve?", answer: "Ajuda muito, mas raramente sozinho. Avaliamos disco, memória e refrigeração juntos: trocar só o disco em uma máquina que superaquece devolve pouco ganho percebido." },
      { question: "Quanto tempo leva um upgrade de SSD?", answer: "Quando é feito no local e a máquina permite acesso simples, costuma ser resolvido na mesma visita, incluindo migração dos seus dados. Casos com carcaça complexa vão para bancada." },
      { question: "Vocês atendem em apartamento com portaria?", answer: "Sim. Só pedimos que a autorização de acesso seja combinada antes, no horário definido na triagem." },
      { question: "Dá para melhorar o Wi-Fi no escritório do apartamento?", answer: "Sim. Medimos a cobertura no cômodo de trabalho, ajustamos faixa e canal e, se ainda faltar sinal, indicamos a solução mais estável para a planta do imóvel." },
      { question: "Qual o valor do atendimento no Juvevê?", answer: "A partir de R$ 99,99 quando aplicável, com valor final informado após o diagnóstico e aprovado antes da execução." },
    ],
  },

  // ── SEMINÁRIO ───────────────────────────────────────────────
  seminario: {
    slug: "seminario",
    nome: "Seminário",
    nomeLocativo: "no Seminário",
    cidade: "Curitiba",
    areaName: "Seminário, Curitiba",
    metaTitle: "Técnico de Informática no Seminário (Curitiba) | Notebook e PC",
    metaDescription:
      "Técnico de informática no Seminário, Curitiba: formatação, remoção de vírus, upgrade de SSD, Wi-Fi e conserto de notebook. A partir de R$ 99,99. Via WhatsApp.",
    h1: "Técnico de Informática no Seminário – Curitiba",
    subtitulo:
      "Atendimento para moradores, estudantes e escritórios do Seminário, com triagem pelo WhatsApp e valor do reparo após diagnóstico.",
    whatsappMessage:
      "Olá! Preciso de um técnico de informática no Seminário, em Curitiba. Pode me orientar?",
    introducaoLocal: [
      "O Seminário é um bairro residencial arborizado entre o Campo Comprido e o Bigorrilho, com forte presença de estudantes e profissionais que trabalham em casa parte da semana. Os chamados que chegam dali costumam ter prazo curto: a máquina precisa voltar antes da próxima entrega, prova ou reunião.",
      "Uma parte relevante dos atendimentos envolve máquinas usadas para estudo e produção — edição de documentos pesados, planilhas grandes, aulas gravadas. Nessas situações, o gargalo raramente é o processador: é memória curta e disco lotado. Medimos o uso real antes de recomendar qualquer peça, para não empurrar upgrade que não muda a experiência.",
      "Nas casas e sobrados do bairro, o padrão de rede é o roteador na sala e o quarto de estudos no fundo do corredor. Como as paredes internas são de alvenaria, a queda de sinal é previsível. Fazemos a medição por cômodo e mostramos o resultado antes de propor solução.",
      "O ponto de partida é o WhatsApp: sintoma, prazo e tipo de uso. Com isso definimos se o caso é remoto, no local ou coleta para bancada — e informamos valor somente depois de entender tecnicamente o problema.",
    ],
    operacaoLocal: [
      "Triagem pelo WhatsApp com sintoma, prazo e tipo de uso",
      "Diagnóstico antes de informar valor",
      "Aprovação por escrito antes da execução",
      "Prioridade combinada quando há prazo acadêmico ou de trabalho",
    ],
    atendimentoLocal: [
      "Ampliação de memória e troca de SSD para uso acadêmico e profissional",
      "Formatação com backup de projetos e trabalhos",
      "Remoção de vírus e limpeza de extensões maliciosas do navegador",
      "Medição e ajuste de Wi-Fi no quarto usado como estudo",
    ],
    coletaBancada: [
      "Notebook que trava na inicialização do sistema",
      "Teclado com teclas sem resposta ou após derramamento de líquido",
      "Falha intermitente de energia no conector de carga",
    ],
    servicosPrioritarios: [
      "/servicos/upgrade-ssd-ram",
      "/servicos/formatacao",
      "/servicos/remocao-de-virus",
      "/servicos/manutencao-de-notebook",
      "/servicos/redes-e-wifi",
    ],
    faqLocal: [
      { question: "Preciso do notebook para uma entrega esta semana. Dá para priorizar?", answer: "Informe o prazo na triagem. Priorizamos o que é possível dentro da agenda real do dia e dizemos com antecedência se o prazo não é viável." },
      { question: "Mais memória ou SSD: o que resolve meu caso?", answer: "Medimos o uso real da máquina antes de indicar. Planilhas grandes e muitas abas pedem memória; lentidão para abrir sistema e programas pede SSD. Muitas vezes o ganho vem da combinação." },
      { question: "Meus trabalhos ficam salvos na formatação?", answer: "Sim, quando o disco está legível. Fazemos backup, você confere os arquivos e só depois reinstalamos o sistema." },
      { question: "O Wi-Fi cai no quarto do fundo durante aula online. Como resolvem?", answer: "Medimos o sinal no cômodo em uso, ajustamos faixa e canal do roteador e, se necessário, indicamos ponto de acesso adicional — mostrando a medição antes e depois." },
      { question: "Quanto custa o atendimento no Seminário?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do serviço e das peças, sempre aprovado por você antes." },
    ],
  },
};


export const BAIRRO_LIST = Object.values(BAIRROS);
