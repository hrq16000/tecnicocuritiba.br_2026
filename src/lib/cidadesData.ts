// ─────────────────────────────────────────────────────────────
// CIDADES ÂNCORA — conteúdo local próprio, útil e não duplicado.
// Sem rating inventado, sem endereço físico falso, sem equipe fixa
// por cidade, sem tempo de chegada garantido, sem "melhor da cidade".
// Rota canônica existente: /tecnico-informatica-<slug> (self-referente).
// ─────────────────────────────────────────────────────────────

export interface CidadeFaq {
  question: string;
  answer: string;
}

export interface CidadeData {
  /** Slug final da rota /tecnico-informatica-<slug> */
  slug: string;
  cidade: string;
  /** Nome usado no areaServed do schema */
  areaName: string;
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  /** Conteúdo visível */
  eyebrow: string;
  h1: string;
  h1Accent: string;
  subtitulo: string;
  /** Mensagem pré-preenchida do WhatsApp */
  whatsappMessage: string;
  /** Proposta local (2-3 parágrafos, distintos por cidade) */
  proposta: string[];
  /** Perfil local resumido em bullets */
  perfilLocal: string[];
  /** Quando chamar um técnico — exemplos práticos */
  quandoChamar: { title: string; desc: string }[];
  /** FAQ local — mínimo 5 por cidade, conteúdo distinto */
  faqs: CidadeFaq[];
}

// 8 serviços canônicos — links compartilhados (sem páginas serviço×cidade).
export const SERVICOS_CANONICOS: { label: string; to: string; desc: string }[] = [
  { label: "Formatação", to: "/servicos/formatacao", desc: "Reinstalação limpa do Windows com backup e programas essenciais." },
  { label: "Manutenção de notebook", to: "/servicos/manutencao-de-notebook", desc: "Limpeza interna, troca de tela, teclado, bateria e reparo de hardware." },
  { label: "Manutenção de computador", to: "/servicos/manutencao-de-computador", desc: "Diagnóstico e reparo de desktops que travam, reiniciam ou não ligam." },
  { label: "Upgrade SSD e RAM", to: "/servicos/upgrade-ssd-ram", desc: "Troca por SSD e mais memória para acelerar a máquina." },
  { label: "Remoção de vírus", to: "/servicos/remocao-de-virus", desc: "Limpeza de malware, pop-ups e sequestro de navegador." },
  { label: "Recuperação de dados", to: "/servicos/recuperacao-de-dados", desc: "Tentativa de recuperar arquivos de HD, SSD e pendrive (sem garantia)." },
  { label: "Redes e Wi-Fi", to: "/servicos/redes-e-wifi", desc: "Configuração de roteador, repetidores e rede estável em casa ou empresa." },
  { label: "Suporte empresarial", to: "/servicos/suporte-tecnico-empresarial", desc: "Suporte pontual ou recorrente para estações, servidores e rede." },
];

// Modalidades de atendimento — links compartilhados para as páginas próprias.
export const MODALIDADES_ATENDIMENTO: { label: string; to: string; desc: string }[] = [
  { label: "Atendimento em domicílio", to: "/atendimento-domicilio", desc: "Avaliação e reparo no local, quando o problema permite atendimento presencial." },
  { label: "Suporte remoto", to: "/atendimento-remoto", desc: "Configurações, sistemas e orientações resolvidos à distância, sem deslocamento." },
  { label: "Coleta e entrega", to: "/coleta-e-entrega", desc: "Retirada agendada quando o serviço precisa de bancada, com devolução ao final." },
  { label: "Diagnóstico técnico", to: "/diagnostico-tecnico", desc: "Etapa de avaliação para identificar a causa antes de informar qualquer valor." },
];

// Bairros curados de Curitiba — a landing de Curitiba é a página-mãe deles.
export const CURITIBA_BAIRROS: { label: string; to: string; desc: string }[] = [
  { label: "CIC (Cidade Industrial)", to: "/bairros/cic", desc: "Atendimento para residências e empresas no maior bairro de Curitiba." },
  { label: "Batel", to: "/bairros/batel", desc: "Suporte para home office, residências e pequenos escritórios." },
  { label: "Água Verde", to: "/bairros/agua-verde", desc: "Manutenção de notebook e PC para quem trabalha e estuda em casa." },
  { label: "Centro", to: "/bairros/centro", desc: "Atendimento ágil para lojas, consultórios e escritórios da região central." },
  { label: "Portão", to: "/bairros/portao", desc: "Conserto de notebook, PC e redes para casas e comércios do bairro." },
];

// Processo comum (não é conteúdo SEO exclusivo; é institucional).
export const PROCESSO_ATENDIMENTO = [
  { step: "1", title: "Triagem", desc: "Você descreve o problema pelo WhatsApp e recebe as primeiras orientações." },
  { step: "2", title: "Avaliação", desc: "Diagnóstico técnico do equipamento para entender a real causa." },
  { step: "3", title: "Orientação", desc: "Explicamos o que foi encontrado em linguagem clara, sem empurrar peça." },
  { step: "4", title: "Valor do atendimento", desc: "Valor apresentado e aprovado por você antes de qualquer serviço." },
  { step: "5", title: "Execução", desc: "Serviço realizado com peças e procedimentos adequados." },
];

export const CIDADES: Record<string, CidadeData> = {
  // ── CURITIBA ────────────────────────────────────────────────
  curitiba: {
    slug: "curitiba",
    cidade: "Curitiba",
    areaName: "Curitiba",
    metaTitle: "Técnico de Informática em Curitiba | PC e Notebook",
    metaDescription:
      "Atendimento técnico em Curitiba para computador, notebook, formatação, SSD, vírus, recuperação de dados, Wi-Fi e suporte para empresas.",
    eyebrow: "Atendimento em Curitiba",
    h1: "Técnico de informática em Curitiba para",
    h1Accent: "PC e notebook",
    subtitulo:
      "Atendimento técnico em informática na capital paranaense, com triagem por WhatsApp, valor transparente e garantia sobre o serviço realizado.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Curitiba. Pode me orientar?",
    proposta: [
      "Curitiba concentra muita gente que depende do computador todos os dias: home office, faculdade, profissionais liberais e empresas de todos os portes. Quando o notebook trava, o PC fica lento ou o Wi-Fi cai no meio de uma reunião, a rotina para. Nosso foco é resolver isso com clareza, sem termos técnicos confusos e sem cobrança surpresa.",
      "Atendemos residências e empresas em Curitiba com atendimento a domicílio ou por coleta e entrega, conforme o tipo de problema. Casos simples costumam ser resolvidos na primeira visita; reparos de bancada (placa, tela de notebook, recuperação de dados) seguem para a oficina com o seu acompanhamento.",
      "Trabalhamos com diagnóstico primeiro, valor do atendimento depois. Você entende o que está acontecendo com o equipamento antes de aprovar qualquer coisa — e decide com calma.",
    ],
    perfilLocal: [
      "Alta demanda por suporte a home office e estudo remoto",
      "Empresas e escritórios que não podem ficar parados",
      "Máquinas antigas que ganham fôlego com SSD e mais memória",
      "Redes Wi-Fi instáveis em apartamentos e casas grandes",
    ],
    quandoChamar: [
      { title: "Notebook travando", desc: "Esquenta, congela ou desliga sozinho durante o uso." },
      { title: "Computador lento", desc: "Demora para abrir programas e navegar mesmo em tarefas simples." },
      { title: "Empresa parada", desc: "Estação de trabalho ou rede fora do ar afetando o time." },
      { title: "Arquivos em risco", desc: "HD com barulho, sistema que não abre ou exclusão acidental." },
      { title: "Wi-Fi instável", desc: "Sinal que cai, oscila ou não cobre todos os cômodos." },
      { title: "Sistema corrompido", desc: "Windows com erro, tela azul ou que não inicia." },
    ],
    faqs: [
      { question: "Vocês atendem em toda Curitiba?", answer: "Atendemos Curitiba com atendimento a domicílio ou por coleta e entrega, combinando horário pelo WhatsApp. A logística é definida conforme o bairro e o tipo de serviço." },
      { question: "Quanto custa o atendimento em Curitiba?", answer: "O diagnóstico/visita começa a partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, do deslocamento, da urgência, da complexidade e de eventuais peças. Nada é executado sem sua aprovação." },
      { question: "Dá para resolver conforme a disponibilidade da agenda?", answer: "Muitos casos simples são resolvidos na primeira visita. Reparos que exigem bancada ou peças específicas podem levar mais tempo, e você é avisado do prazo antes de aprovar." },
      { question: "Atendem empresas e escritórios em Curitiba?", answer: "Sim. Fazemos suporte pontual ou recorrente para estações de trabalho, servidores locais e rede, sob consulta, para reduzir paradas no dia a dia." },
      { question: "Vocês recuperam arquivos apagados?", answer: "Fazemos a tentativa de recuperação de dados de HD, SSD e pendrive. Recuperação não é garantida — depende do estado físico e lógico da mídia — e isso é dito com transparência antes de começar." },
      { question: "Como faço o primeiro contato?", answer: "Pelo WhatsApp. Você descreve o problema, recebe as primeiras orientações e, se fizer sentido, combinamos a avaliação do equipamento." },
    ],
  },

  // ── SÃO JOSÉ DOS PINHAIS ────────────────────────────────────
  "sao-jose-pinhais": {
    slug: "sao-jose-pinhais",
    cidade: "São José dos Pinhais",
    areaName: "São José dos Pinhais",
    metaTitle: "Técnico em São José dos Pinhais para Notebook e PC",
    metaDescription:
      "Técnico de informática em São José dos Pinhais: formatação, conserto de notebook e PC, upgrade de SSD, redes e suporte a empresas. Atendimento a domicílio ou coleta via WhatsApp.",
    eyebrow: "Atendimento em São José dos Pinhais",
    h1: "Técnico em São José dos Pinhais para notebook, PC e informática",
    h1Accent: "para casa e empresa",
    subtitulo:
      "Suporte técnico em informática em São José dos Pinhais, com triagem por WhatsApp, valor do atendimento claro e garantia sobre o serviço.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em São José dos Pinhais. Pode me orientar?",
    proposta: [
      "São José dos Pinhais tem um perfil que mistura forte presença industrial e comercial com bairros residenciais em crescimento. Isso significa demanda tanto de famílias que precisam do computador de casa funcionando quanto de empresas que dependem de estações e rede estáveis para trabalhar.",
      "Atendemos a cidade com atendimento a domicílio ou por coleta e entrega. Para o dia a dia residencial, resolvemos lentidão, vírus, formatação e Wi-Fi; para o lado empresarial, damos suporte a estações, backup e rede, de forma pontual ou recorrente sob consulta.",
      "Nossa postura é sempre a mesma: primeiro entender o problema, depois avaliar o valor. Você aprova antes de qualquer execução e sabe exatamente o que será feito.",
    ],
    perfilLocal: [
      "Bairros residenciais em expansão com muitos home offices",
      "Comércios e empresas que precisam de rede e estações confiáveis",
      "Equipamentos que pedem upgrade de SSD e memória",
      "Necessidade frequente de backup e organização de dados",
    ],
    quandoChamar: [
      { title: "Notebook travando", desc: "Trava ou reinicia durante o trabalho ou estudo." },
      { title: "Computador lento", desc: "PC do escritório ou de casa arrastando nas tarefas do dia." },
      { title: "Empresa parada", desc: "Rede fora do ar ou máquina crítica sem funcionar." },
      { title: "Arquivos em risco", desc: "Dados importantes de trabalho sem backup adequado." },
      { title: "Wi-Fi instável", desc: "Sinal fraco em pontos da casa, comércio ou galpão." },
      { title: "Sistema corrompido", desc: "Windows travado, com erros ou que não inicializa." },
    ],
    faqs: [
      { question: "O atendimento em São José dos Pinhais é a domicílio?", answer: "Sim, atendemos a domicílio ou por coleta e entrega, com horário combinado pelo WhatsApp. A escolha depende do tipo de serviço — casos de bancada seguem para a oficina." },
      { question: "Vocês dão suporte para empresas na cidade?", answer: "Sim. Fazemos suporte a estações de trabalho, servidores locais e rede, de forma pontual ou recorrente sob consulta, pensando em reduzir paradas." },
      { question: "Qual o valor do diagnóstico?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, deslocamento, urgência, complexidade e peças. Você aprova o valor antes da execução." },
      { question: "Atendem tanto notebook quanto desktop?", answer: "Sim, atendemos notebooks e desktops: formatação, remoção de vírus, upgrade de SSD/RAM, reparo de hardware, redes e recuperação de dados." },
      { question: "Recuperação de dados tem garantia?", answer: "Não. Recuperação de dados é sempre uma tentativa, pois depende do estado da mídia. Somos transparentes sobre as chances antes de iniciar." },
    ],
  },

  // ── PINHAIS ─────────────────────────────────────────────────
  pinhais: {
    slug: "pinhais",
    cidade: "Pinhais",
    areaName: "Pinhais",
    metaTitle: "Técnico em Pinhais para Notebook, PC e Redes",
    metaDescription:
      "Técnico de informática em Pinhais: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial. Atendimento a domicílio ou coleta via WhatsApp.",
    eyebrow: "Atendimento em Pinhais",
    h1: "Técnico em Pinhais para notebook, PC e informática",
    h1Accent: "rápido e transparente",
    subtitulo:
      "Assistência técnica em informática em Pinhais, com triagem por WhatsApp, diagnóstico honesto e valor aprovado por você.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Pinhais. Pode me orientar?",
    proposta: [
      "Pinhais é uma cidade compacta e densa, colada a Curitiba, o que favorece um atendimento ágil. O perfil é bastante residencial e de pequenos comércios, com muita gente usando o computador para trabalho, estudo e serviços do dia a dia.",
      "Atendemos Pinhais com atendimento a domicílio ou por coleta e entrega. Resolvemos os casos mais comuns — lentidão, vírus, formatação, upgrade de SSD e Wi-Fi instável — e encaminhamos para bancada os reparos que exigem estrutura, sempre com seu acompanhamento.",
      "Você fala direto com quem vai resolver o problema. Primeiro o diagnóstico, depois o valor do atendimento — e nada é feito sem sua aprovação.",
    ],
    perfilLocal: [
      "Proximidade com Curitiba facilita a logística de atendimento",
      "Muitos usuários residenciais e pequenos comércios",
      "Máquinas que ganham desempenho com SSD e mais memória",
      "Redes domésticas e de comércio que precisam de estabilidade",
    ],
    quandoChamar: [
      { title: "Notebook travando", desc: "Congela, esquenta ou desliga durante o uso." },
      { title: "Computador lento", desc: "Demora para ligar e abrir programas simples." },
      { title: "Comércio parado", desc: "PC do caixa ou da loja sem funcionar." },
      { title: "Arquivos em risco", desc: "Fotos e documentos importantes sem cópia de segurança." },
      { title: "Wi-Fi instável", desc: "Sinal que cai ou não cobre a casa/loja inteira." },
      { title: "Sistema corrompido", desc: "Windows com erro, lento ou que não inicia." },
    ],
    faqs: [
      { question: "Vocês atendem rápido em Pinhais?", answer: "Pela proximidade com Curitiba, a logística costuma ser ágil. Combinamos o horário pelo WhatsApp; não prometemos tempo fixo de chegada porque depende de agenda e trânsito." },
      { question: "É atendimento a domicílio?", answer: "Sim, a domicílio ou por coleta e entrega. Serviços de bancada, como troca de tela e reparo de placa, são feitos na oficina com seu acompanhamento." },
      { question: "Quanto custa a visita?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, deslocamento, urgência, complexidade e peças, e é aprovado por você antes de tudo." },
      { question: "Fazem upgrade para SSD em Pinhais?", answer: "Sim. A troca por SSD e o aumento de memória estão entre os serviços mais pedidos, porque dão um ganho de desempenho perceptível em máquinas antigas." },
      { question: "Atendem pequenos comércios?", answer: "Sim. Damos suporte a computadores, impressoras de rede e Wi-Fi de lojas e escritórios pequenos, de forma pontual ou recorrente sob consulta." },
    ],
  },

  // ── COLOMBO ─────────────────────────────────────────────────
  colombo: {
    slug: "colombo",
    cidade: "Colombo",
    areaName: "Colombo",
    metaTitle: "Técnico em Colombo para Notebook, PC e Informática",
    metaDescription:
      "Técnico de informática em Colombo: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial. Atendimento a domicílio ou coleta via WhatsApp.",
    eyebrow: "Atendimento em Colombo",
    h1: "Técnico em Colombo para notebook, PC e informática",
    h1Accent: "sem enrolação",
    subtitulo:
      "Suporte técnico em informática em Colombo, com triagem por WhatsApp, valor transparente e garantia sobre o serviço realizado.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Colombo. Pode me orientar?",
    proposta: [
      "Colombo é uma das cidades mais populosas da região metropolitana de Curitiba, com bairros residenciais extensos. Boa parte dos moradores trabalha ou estuda usando o computador, então lentidão, vírus e sistema travado atrapalham diretamente a rotina.",
      "Atendemos Colombo com atendimento a domicílio ou por coleta e entrega. Os problemas mais comuns — formatação, remoção de vírus, upgrade de SSD, reparo de notebook e Wi-Fi — costumam ser tratados de forma direta; casos de bancada seguem para a oficina.",
      "Sem promessa de valor fechado por telefone: primeiro avaliamos o equipamento, depois apresentamos o valor do atendimento para você decidir.",
    ],
    perfilLocal: [
      "Bairros residenciais extensos e população em crescimento",
      "Muitos moradores em home office e estudo remoto",
      "Demanda por formatação, limpeza de vírus e upgrade",
      "Redes Wi-Fi que precisam cobrir casas maiores",
    ],
    quandoChamar: [
      { title: "Notebook travando", desc: "Trava ou aquece durante o trabalho e o estudo." },
      { title: "Computador lento", desc: "Máquina arrastando mesmo em tarefas básicas." },
      { title: "Empresa parada", desc: "Comércio ou escritório com equipamento fora do ar." },
      { title: "Arquivos em risco", desc: "Documentos e fotos sem backup e HD com sintomas." },
      { title: "Wi-Fi instável", desc: "Sinal fraco em cômodos distantes do roteador." },
      { title: "Sistema corrompido", desc: "Windows com falhas, lento ou que não abre." },
    ],
    faqs: [
      { question: "Vocês atendem a domicílio em Colombo?", answer: "Sim, com atendimento a domicílio ou por coleta e entrega. O horário é combinado pelo WhatsApp e a logística depende do bairro e do tipo de serviço." },
      { question: "Qual o valor do diagnóstico em Colombo?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, deslocamento, urgência, complexidade e peças. Você aprova o valor antes da execução." },
      { question: "Atendem empresas e comércios em Colombo?", answer: "Sim. Fazemos suporte a estações de trabalho, rede e backup, de forma pontual ou recorrente sob consulta." },
      { question: "Dá para deixar o computador antigo mais rápido?", answer: "Na maioria dos casos, sim — a troca por SSD e o aumento de memória trazem ganho perceptível. Não prometemos porcentagem fixa; o resultado depende do hardware." },
      { question: "Vocês recuperam arquivos perdidos?", answer: "Fazemos a tentativa de recuperação de dados. Não há garantia, pois depende do estado da mídia, e explicamos as chances antes de iniciar." },
    ],
  },

  // ── ARAUCÁRIA ───────────────────────────────────────────────
  araucaria: {
    slug: "araucaria",
    cidade: "Araucária",
    areaName: "Araucária",
    metaTitle: "Técnico em Araucária para Notebook, PC e Empresas",
    metaDescription:
      "Técnico de informática em Araucária: formatação, conserto de notebook e PC, upgrade de SSD, redes e suporte empresarial. Atendimento a domicílio ou coleta via WhatsApp.",
    eyebrow: "Atendimento em Araucária",
    h1: "Técnico em Araucária para notebook, PC e informática",
    h1Accent: "para residências e empresas",
    subtitulo:
      "Assistência técnica em informática em Araucária, com triagem por WhatsApp, diagnóstico honesto e valor aprovado por você.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Araucária. Pode me orientar?",
    proposta: [
      "Araucária tem forte perfil industrial e empresarial, ao lado de bairros residenciais consolidados. Isso gera dois tipos de demanda bem distintos: o computador de casa que precisa voltar a funcionar e o ambiente de trabalho que não pode parar.",
      "Atendemos a cidade com atendimento a domicílio ou por coleta e entrega para uso residencial, e com suporte a estações, rede e backup para empresas — pontual ou recorrente, sob consulta. Formatação, upgrade de SSD, remoção de vírus e redes são os pedidos mais frequentes.",
      "Em todos os casos, seguimos a mesma lógica: diagnóstico primeiro, valor do atendimento depois, execução só com sua aprovação.",
    ],
    perfilLocal: [
      "Presença industrial e empresarial relevante",
      "Bairros residenciais com demanda de suporte doméstico",
      "Empresas que precisam de rede estável e backup",
      "Máquinas que pedem upgrade de SSD e memória",
    ],
    quandoChamar: [
      { title: "Notebook travando", desc: "Congela ou reinicia durante o uso." },
      { title: "Computador lento", desc: "Desktop de casa ou do trabalho arrastando." },
      { title: "Empresa parada", desc: "Estação crítica ou rede fora do ar." },
      { title: "Arquivos em risco", desc: "Dados de trabalho sem backup e HD com sintomas." },
      { title: "Wi-Fi instável", desc: "Cobertura fraca em casa, escritório ou galpão." },
      { title: "Sistema corrompido", desc: "Windows com erro, lento ou que não inicia." },
    ],
    faqs: [
      { question: "Vocês atendem empresas em Araucária?", answer: "Sim. Por causa do forte perfil empresarial da cidade, oferecemos suporte a estações de trabalho, servidores locais, rede e backup, de forma pontual ou recorrente sob consulta." },
      { question: "O atendimento residencial é a domicílio?", answer: "Sim, a domicílio ou por coleta e entrega, com horário combinado pelo WhatsApp. Casos de bancada seguem para a oficina com seu acompanhamento." },
      { question: "Quanto custa o diagnóstico?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, deslocamento, urgência, complexidade e peças, sempre aprovado por você antes." },
      { question: "Fazem upgrade e formatação?", answer: "Sim, são serviços frequentes: troca por SSD, aumento de memória e formatação com backup e programas essenciais." },
      { question: "Recuperação de dados é garantida?", answer: "Não. É sempre uma tentativa, pois depende do estado físico e lógico da mídia. Explicamos as chances com transparência antes de começar." },
    ],
  },

  // ── CAMPO LARGO ─────────────────────────────────────────────
  "campo-largo": {
    slug: "campo-largo",
    cidade: "Campo Largo",
    areaName: "Campo Largo",
    metaTitle: "Técnico em Campo Largo para Notebook, PC e Redes",
    metaDescription:
      "Técnico de informática em Campo Largo: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus, redes e suporte empresarial. Atendimento a domicílio ou coleta via WhatsApp.",
    eyebrow: "Atendimento em Campo Largo",
    h1: "Técnico em Campo Largo para notebook, PC e informática",
    h1Accent: "com valor do atendimento claro",
    subtitulo:
      "Suporte técnico em informática em Campo Largo, com triagem por WhatsApp, diagnóstico honesto e garantia sobre o serviço realizado.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Campo Largo. Pode me orientar?",
    proposta: [
      "Campo Largo tem território amplo, com áreas urbanas, comércio local e regiões mais afastadas. Esse espalhamento torna o atendimento planejado ainda mais importante: combinamos tudo antes pelo WhatsApp para organizar visita ou coleta sem desperdício de tempo.",
      "Atendemos residências e comércios da cidade com atendimento a domicílio ou por coleta e entrega. Formatação, remoção de vírus, upgrade de SSD, reparo de notebook e Wi-Fi instável estão entre os serviços mais pedidos, e reparos de bancada seguem para a oficina.",
      "Como em toda a região, o método é o mesmo: entender o problema primeiro, avaliar o valor depois e executar apenas com a sua aprovação.",
    ],
    perfilLocal: [
      "Território amplo, com áreas urbanas e mais afastadas",
      "Comércio local e usuários residenciais",
      "Demanda por formatação, upgrade e limpeza de vírus",
      "Redes Wi-Fi que precisam cobrir casas e pontos comerciais",
    ],
    quandoChamar: [
      { title: "Notebook travando", desc: "Trava, aquece ou desliga durante o uso." },
      { title: "Computador lento", desc: "Máquina arrastando nas tarefas do dia a dia." },
      { title: "Comércio parado", desc: "PC da loja ou do escritório sem funcionar." },
      { title: "Arquivos em risco", desc: "Documentos importantes sem cópia de segurança." },
      { title: "Wi-Fi instável", desc: "Sinal fraco em partes da casa ou do comércio." },
      { title: "Sistema corrompido", desc: "Windows com erro, lento ou que não inicia." },
    ],
    faqs: [
      { question: "Vocês atendem em Campo Largo mesmo em regiões mais afastadas?", answer: "Combinamos tudo antes pelo WhatsApp para avaliar a melhor forma: atendimento a domicílio ou coleta e entrega. Não prometemos tempo fixo de chegada porque depende da localização e da agenda." },
      { question: "Qual o valor da visita técnica?", answer: "A partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, deslocamento, urgência, complexidade e peças, e é aprovado por você antes da execução." },
      { question: "Fazem formatação e upgrade de SSD?", answer: "Sim, são serviços muito pedidos: formatação com backup e a troca por SSD com aumento de memória, que aceleram máquinas antigas." },
      { question: "Atendem comércios e escritórios?", answer: "Sim. Damos suporte a computadores, impressoras de rede e Wi-Fi de lojas e escritórios, de forma pontual ou recorrente sob consulta." },
      { question: "Recuperam arquivos de HD com defeito?", answer: "Fazemos a tentativa de recuperação de dados. Não há garantia, pois depende do estado da mídia, e informamos as chances antes de iniciar." },
    ],
  },

  // ── PIRAQUARA ───────────────────────────────────────────────
  piraquara: {
    slug: "piraquara",
    cidade: "Piraquara",
    areaName: "Piraquara",
    metaTitle: "Técnico em Piraquara para Notebook, PC e Internet",
    metaDescription:
      "Técnico de informática em Piraquara: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus e Wi-Fi. Atendimento a domicílio ou coleta combinada por WhatsApp.",
    eyebrow: "Atendimento em Piraquara",
    h1: "Técnico em Piraquara para notebook, PC e internet",
    h1Accent: "sem viagem até a capital",
    subtitulo:
      "Suporte técnico em informática em Piraquara com triagem por WhatsApp, valor aprovado antes da execução e garantia sobre o serviço realizado.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Piraquara. Pode me orientar?",
    proposta: [
      "Quem mora em Piraquara costuma perder meio dia quando precisa levar um computador para a capital. Por isso o atendimento aqui é pensado para resolver no próprio endereço sempre que o problema permite, e só encaminhar para bancada o que realmente exige desmontagem, solda ou testes longos.",
      "A cidade tem muita residência em rua sem saída, condomínio e loteamento distante do eixo principal, o que torna a combinação prévia essencial: definimos endereço, ponto de referência e janela de horário pelo WhatsApp antes de sair. Não temos balcão para receber cliente — trabalhamos com visita agendada ou coleta e entrega no seu endereço.",
      "Os pedidos mais comuns em Piraquara são internet oscilando em casas compridas ou sobrados, notebook antigo travando, formatação com backup e recuperação de arquivos de HD que parou. Cada caso passa por diagnóstico antes de qualquer valor ser informado.",
    ],
    perfilLocal: [
      "Residências espalhadas, com ruas sem saída e pontos de referência importantes",
      "Casas compridas e sobrados em que o Wi-Fi não chega aos fundos",
      "Máquinas usadas por mais tempo, que respondem bem a SSD e limpeza",
      "Pequenos comércios de bairro com um único computador em operação",
    ],
    quandoChamar: [
      { title: "Wi-Fi não chega aos fundos", desc: "Sinal cai no quintal, na edícula ou no segundo andar." },
      { title: "Notebook antigo travando", desc: "Demora para ligar, esquenta e congela em tarefas simples." },
      { title: "PC não inicia", desc: "Windows com erro, tela azul ou reinício em loop." },
      { title: "Arquivos presos no HD", desc: "Disco fazendo barulho ou sistema que não abre mais." },
      { title: "Vírus e pop-ups", desc: "Navegador sequestrado e propaganda abrindo sozinha." },
      { title: "Comércio parado", desc: "O único computador da loja fora do ar." },
    ],
    faqs: [
      { question: "Vocês atendem Piraquara mesmo longe do Centro?", answer: "Sim. Combinamos endereço, ponto de referência e janela de horário pelo WhatsApp antes de sair. Não prometemos tempo fixo de chegada porque depende da região e da agenda do dia." },
      { question: "Posso levar o equipamento até vocês?", answer: "Não trabalhamos com balcão de atendimento ao público. A logística é visita agendada no seu endereço ou coleta e entrega quando o reparo precisa de bancada." },
      { question: "Quanto custa a visita em Piraquara?", answer: "A visita/diagnóstico começa a partir de R$ 99,99 quando aplicável. O valor final depende do equipamento, deslocamento, urgência, complexidade e peças, e é aprovado por você antes da execução." },
      { question: "Dá para melhorar o Wi-Fi de uma casa comprida?", answer: "Na maioria dos casos sim. Avaliamos posição do roteador, interferência e cabeamento e indicamos se a solução é reposicionar, cabear ou usar um ponto de acesso extra — sem empurrar equipamento desnecessário." },
      { question: "Vocês recuperam arquivos de HD com defeito?", answer: "Fazemos a tentativa de recuperação. Não há garantia, porque depende do estado físico e lógico da mídia, e explicamos as chances antes de iniciar." },
    ],
  },

  // ── QUATRO BARRAS ───────────────────────────────────────────
  "quatro-barras": {
    slug: "quatro-barras",
    cidade: "Quatro Barras",
    areaName: "Quatro Barras",
    metaTitle: "Técnico em Quatro Barras para PC, Notebook e Redes",
    metaDescription:
      "Técnico de informática em Quatro Barras: conserto de notebook e PC, formatação, upgrade de SSD, redes e suporte a pequenas empresas. Visita agendada ou coleta via WhatsApp.",
    eyebrow: "Atendimento em Quatro Barras",
    h1: "Técnico em Quatro Barras para PC, notebook e redes",
    h1Accent: "com atendimento combinado antes",
    subtitulo:
      "Atendimento técnico em informática em Quatro Barras, com diagnóstico explicado em linguagem clara e valor aprovado antes de qualquer serviço.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Quatro Barras. Pode me orientar?",
    proposta: [
      "Quatro Barras é uma cidade compacta, mas com um perfil bem particular: uma faixa urbana concentrada, condomínios em área de mata e um corredor logístico com galpões e pequenas empresas. Isso muda o tipo de chamado — de um lado computador doméstico, do outro estação de trabalho e rede que não pode ficar fora do ar.",
      "Para residências, o foco é resolver na visita: limpeza, troca por SSD, formatação com backup, ajuste de rede e remoção de vírus. Para empresas, priorizamos manter a operação de pé, com avaliação da rede, dos pontos de cabo e das máquinas críticas antes de propor qualquer troca.",
      "Todo atendimento é combinado antes pelo WhatsApp. Não recebemos equipamento em balcão: ou vamos até o endereço, ou fazemos coleta e entrega quando o reparo exige bancada.",
    ],
    perfilLocal: [
      "Faixa urbana concentrada e condomínios afastados em área verde",
      "Corredor logístico com galpões e pequenas empresas",
      "Estações de trabalho que não podem parar durante o expediente",
      "Rede Wi-Fi em terrenos grandes, com paredes e distância entre blocos",
    ],
    quandoChamar: [
      { title: "Estação de trabalho parada", desc: "Máquina do escritório ou do galpão sem ligar." },
      { title: "Rede caindo no expediente", desc: "Internet oscilando entre setores ou blocos." },
      { title: "Computador lento", desc: "Sistema arrastando mesmo em planilhas e navegador." },
      { title: "Sistema corrompido", desc: "Windows com erro após queda de energia." },
      { title: "Sem backup", desc: "Arquivos da empresa só na máquina, sem cópia." },
      { title: "Notebook com defeito físico", desc: "Tela, teclado, dobradiça ou carregamento com falha." },
    ],
    faqs: [
      { question: "Vocês atendem empresas e galpões em Quatro Barras?", answer: "Sim. Fazemos suporte pontual ou recorrente para estações de trabalho, rede e backup, sob consulta, priorizando manter a operação funcionando durante a avaliação." },
      { question: "Atendem condomínios afastados da área urbana?", answer: "Atendemos, combinando endereço e acesso antes pelo WhatsApp. Como o deslocamento varia bastante, não prometemos tempo fixo de chegada." },
      { question: "Qual o valor do atendimento?", answer: "A partir de R$ 99,99 para visita/diagnóstico quando aplicável. Peças e serviços adicionais são orçados e aprovados por você antes de qualquer execução." },
      { question: "Existe loja para deixar o equipamento?", answer: "Não. Não temos balcão ao público: o serviço acontece no seu endereço ou por coleta e entrega quando o reparo precisa de bancada." },
      { question: "Fazem cabeamento de rede?", answer: "Avaliamos a rede existente e indicamos o que faz sentido: reposicionar roteador, organizar pontos de cabo ou ampliar cobertura. O escopo é definido depois do diagnóstico." },
    ],
  },

  // ── CAMPO MAGRO ─────────────────────────────────────────────
  "campo-magro": {
    slug: "campo-magro",
    cidade: "Campo Magro",
    areaName: "Campo Magro",
    metaTitle: "Técnico em Campo Magro para Notebook, PC e Wi-Fi",
    metaDescription:
      "Técnico de informática em Campo Magro: conserto de notebook e PC, formatação, upgrade de SSD, remoção de vírus e Wi-Fi em chácaras e casas. Atendimento combinado por WhatsApp.",
    eyebrow: "Atendimento em Campo Magro",
    h1: "Técnico em Campo Magro para notebook, PC e Wi-Fi",
    h1Accent: "inclusive em chácaras e sítios",
    subtitulo:
      "Suporte técnico em informática em Campo Magro, com avaliação antes do valor, comunicação clara e garantia sobre o serviço executado.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Campo Magro. Pode me orientar?",
    proposta: [
      "Campo Magro tem muita chácara, sítio e casa em terreno grande, com internet via rádio ou fibra que chega em um ponto só. O resultado é previsível: sinal forte perto do roteador e nada no restante da propriedade. Boa parte dos chamados aqui é justamente cobertura de rede, não defeito de computador.",
      "Também atendemos os problemas clássicos de máquina: notebook que trava, PC que não liga, formatação com backup, upgrade para SSD e remoção de vírus. Quando o reparo exige bancada, combinamos coleta e entrega para você não precisar deslocar até a capital.",
      "Por causa da distância entre endereços, tudo é planejado antes pelo WhatsApp: descrição do problema, endereço com referência e janela de horário. Não temos balcão para atendimento ao público.",
    ],
    perfilLocal: [
      "Chácaras, sítios e casas em terrenos amplos",
      "Internet que chega em um único ponto da propriedade",
      "Distância entre endereços que exige agendamento planejado",
      "Uso doméstico e trabalho remoto dependendo da mesma rede",
    ],
    quandoChamar: [
      { title: "Sinal só perto do roteador", desc: "Wi-Fi não cobre a casa inteira nem áreas externas." },
      { title: "Trabalho remoto caindo", desc: "Reunião travando por instabilidade da conexão." },
      { title: "Notebook travando", desc: "Aquecimento, lentidão e desligamento durante o uso." },
      { title: "PC não liga", desc: "Sem imagem, sem inicialização ou reinício constante." },
      { title: "Vírus e lentidão", desc: "Pop-ups, navegador estranho e sistema pesado." },
      { title: "Backup inexistente", desc: "Fotos e documentos só em uma máquina." },
    ],
    faqs: [
      { question: "Vocês atendem chácaras e endereços rurais em Campo Magro?", answer: "Sim, desde que o acesso seja combinado antes pelo WhatsApp com endereço e ponto de referência. O deslocamento influencia o valor e o horário possível, e isso é informado antes." },
      { question: "Dá para levar Wi-Fi até a área externa ou outro bloco?", answer: "Na maioria dos casos sim, avaliando cabeamento e pontos de acesso adicionais. Primeiro medimos onde o sinal cai; só depois indicamos a solução, sem vender equipamento por padrão." },
      { question: "Qual o valor da visita técnica?", answer: "A partir de R$ 99,99 quando aplicável, com valor final dependendo de equipamento, deslocamento, urgência, complexidade e peças. Nada é executado sem sua aprovação." },
      { question: "Posso deixar o equipamento em algum endereço de vocês?", answer: "Não. Trabalhamos apenas com visita agendada ou coleta e entrega no seu endereço — não há balcão ao público." },
      { question: "Fazem formatação preservando os arquivos?", answer: "Fazemos backup antes da formatação sempre que o disco permite ler os dados, e confirmamos com você o que precisa ser preservado antes de começar." },
    ],
  },

  // ── ALMIRANTE TAMANDARÉ ─────────────────────────────────────
  "almirante-tamandare": {
    slug: "almirante-tamandare",
    cidade: "Almirante Tamandaré",
    areaName: "Almirante Tamandaré",
    metaTitle: "Técnico em Almirante Tamandaré | Notebook e PC",
    metaDescription:
      "Técnico de informática em Almirante Tamandaré: formatação, conserto de notebook e PC, upgrade de SSD, remoção de vírus e redes. Visita agendada ou coleta via WhatsApp.",
    eyebrow: "Atendimento em Almirante Tamandaré",
    h1: "Técnico em Almirante Tamandaré para notebook e PC",
    h1Accent: "com orçamento aprovado antes",
    subtitulo:
      "Atendimento técnico em informática em Almirante Tamandaré, com diagnóstico primeiro, valor depois e garantia sobre o serviço realizado.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Almirante Tamandaré. Pode me orientar?",
    proposta: [
      "Almirante Tamandaré é uma cidade densa e vizinha imediata da capital, com bairros que crescem em ritmo próprio e muita família dividindo um único computador entre trabalho, escola e estudo. Quando essa máquina para, para tudo junto — e a prioridade passa a ser devolver o equipamento funcionando rápido, sem gastar mais do que o aparelho vale.",
      "Por isso, aqui o diagnóstico é bem direto sobre viabilidade: em máquinas antigas, muitas vezes SSD e memória resolvem melhor do que trocar peças caras. Quando o reparo não compensa, dizemos isso com clareza em vez de empurrar serviço.",
      "O atendimento é por visita agendada ou coleta e entrega, combinado antes pelo WhatsApp. Não recebemos equipamento em balcão.",
    ],
    perfilLocal: [
      "Bairros densos, com muita residência familiar",
      "Um computador atendendo trabalho, escola e estudo ao mesmo tempo",
      "Parque de máquinas mais antigo, sensível a custo de peça",
      "Comércio de vizinhança com PC de caixa e impressora",
    ],
    quandoChamar: [
      { title: "PC da família parado", desc: "A única máquina de casa parou de ligar." },
      { title: "Lentidão extrema", desc: "Windows demorando minutos para abrir programas." },
      { title: "Vírus e propaganda", desc: "Pop-ups e páginas abrindo sozinhas no navegador." },
      { title: "Trabalho escolar em risco", desc: "Arquivos importantes sem cópia de segurança." },
      { title: "Impressora fora da rede", desc: "PC do comércio sem imprimir ou sem conexão." },
      { title: "Notebook sem carregar", desc: "Bateria, fonte ou conector com falha." },
    ],
    faqs: [
      { question: "Vale a pena consertar um computador antigo?", answer: "Depende do defeito. Em muitos casos, SSD e memória custam bem menos que a troca de peças principais e resolvem a lentidão. Se o reparo não compensar, avisamos antes de você gastar." },
      { question: "Como funciona o atendimento em Almirante Tamandaré?", answer: "Você descreve o problema pelo WhatsApp, combinamos visita no seu endereço ou coleta e entrega. Não há balcão de atendimento ao público." },
      { question: "Qual o valor do diagnóstico?", answer: "A partir de R$ 99,99 quando aplicável. O valor final considera equipamento, deslocamento, urgência, complexidade e peças, e é aprovado por você antes da execução." },
      { question: "Atendem comércios do bairro?", answer: "Sim. Damos suporte a PC de caixa, impressora em rede e Wi-Fi de lojas pequenas, de forma pontual ou combinada sob consulta." },
      { question: "Vocês formatam mantendo meus arquivos?", answer: "Sempre que o disco permite leitura, fazemos backup antes e confirmamos com você o que deve ser preservado. Se o disco estiver com defeito, explicamos o risco antes de continuar." },
    ],
  },

  // ── FAZENDA RIO GRANDE ──────────────────────────────────────
  "fazenda-rio-grande": {
    slug: "fazenda-rio-grande",
    cidade: "Fazenda Rio Grande",
    areaName: "Fazenda Rio Grande",
    metaTitle: "Técnico em Fazenda Rio Grande | PC, Notebook e Rede",
    metaDescription:
      "Técnico de informática em Fazenda Rio Grande: conserto de notebook e PC, formatação, upgrade de SSD, remoção de vírus e redes. Atendimento agendado ou coleta via WhatsApp.",
    eyebrow: "Atendimento em Fazenda Rio Grande",
    h1: "Técnico em Fazenda Rio Grande para PC, notebook e rede",
    h1Accent: "sem depender do horário comercial da capital",
    subtitulo:
      "Suporte técnico em informática em Fazenda Rio Grande, com triagem por WhatsApp, valor claro antes da execução e garantia sobre o serviço realizado.",
    whatsappMessage: "Olá! Preciso de um técnico de informática em Fazenda Rio Grande. Pode me orientar?",
    proposta: [
      "Fazenda Rio Grande tem uma rotina marcada pelo deslocamento: muita gente trabalha em Curitiba e só consegue resolver questões de casa no fim do dia ou no fim de semana. Isso pesa na escolha do atendimento — levar o computador para a capital costuma custar um dia inteiro.",
      "Nosso formato aqui é combinar a janela de horário que cabe na sua rotina e resolver no endereço quando o problema permite. Reparos que exigem bancada seguem por coleta e entrega, com você acompanhando cada etapa pelo WhatsApp.",
      "Os chamados mais frequentes são notebook lento ou travando, formatação com backup, upgrade para SSD, remoção de vírus e Wi-Fi que não cobre a casa toda em construções de dois andares. Em todos, o diagnóstico vem antes do valor.",
    ],
    perfilLocal: [
      "Moradores que trabalham em Curitiba e resolvem tudo fora do horário comercial",
      "Loteamentos residenciais em expansão, com casas de dois andares",
      "Home office e estudo dividindo a mesma conexão",
      "Notebooks usados intensamente no transporte diário",
    ],
    quandoChamar: [
      { title: "Notebook lento no home office", desc: "Trava em reunião, navegador e planilha ao mesmo tempo." },
      { title: "Wi-Fi fraco no andar de cima", desc: "Sinal não sobe ou cai nos quartos." },
      { title: "PC não inicia", desc: "Tela azul, erro de sistema ou reinício em loop." },
      { title: "Máquina cheia de vírus", desc: "Propaganda, extensões estranhas e lentidão súbita." },
      { title: "Disco cheio ou falhando", desc: "Sem espaço, com travamentos ou barulho no HD." },
      { title: "Horário difícil", desc: "Só dá para atender no fim do dia ou no fim de semana." },
    ],
    faqs: [
      { question: "Vocês atendem fora do horário comercial em Fazenda Rio Grande?", answer: "Trabalhamos com janela de horário combinada pelo WhatsApp e tentamos encaixar horários alternativos conforme a agenda do dia. Não garantimos horário fixo antes de confirmar." },
      { question: "Preciso levar o equipamento até Curitiba?", answer: "Não. Ou atendemos no seu endereço, ou fazemos coleta e entrega quando o reparo exige bancada. Não existe balcão para receber cliente." },
      { question: "Quanto custa o atendimento?", answer: "A partir de R$ 99,99 para visita/diagnóstico quando aplicável. Peças e serviços extras são informados e aprovados por você antes de qualquer execução." },
      { question: "O Wi-Fi não chega no segundo andar. Tem solução?", answer: "Geralmente sim. Avaliamos posição do roteador, material das paredes e possibilidade de cabo ou ponto de acesso adicional, indicando o caminho mais simples primeiro." },
      { question: "Dá para acelerar um notebook antigo?", answer: "Na maioria dos casos, trocar o HD por SSD e ampliar a memória muda a experiência de uso. Avaliamos se a máquina suporta o upgrade antes de recomendar." },
    ],
  },
};

export const CIDADE_LIST = Object.values(CIDADES);
