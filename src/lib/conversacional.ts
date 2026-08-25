/**
 * ENRIQUECIMENTO SEMÂNTICO — INTENÇÃO CONVERSACIONAL (buscas em LLMs)
 * ===================================================================
 * Mapeia, por serviço do cluster de informática, as perguntas no formato em
 * que as pessoas realmente escrevem em ChatGPT/Gemini/Copilot, agrupadas por
 * intenção: O QUE (definição), COMO (processo), ONDE (contexto local) e
 * POR QUE (causa-raiz).
 *
 * Regras:
 *  • H2 = a intenção, H3 = a pergunta exata (extraível por LLM);
 *  • respostas marcadas `curta: true` entram no FAQPage único da página
 *    (paridade 1:1 exigida por check-faq-parity / jsonld-content-parity);
 *  • conteúdo autoral por slug — nenhuma frase reutilizada entre páginas.
 */

export type IntencaoConversacional = "o-que" | "como" | "onde" | "por-que";

export type PerguntaConversacional = {
  /** Pergunta exata, no formato conversacional, usada como <h3>. */
  pergunta: string;
  /** Resposta direta. Quando `curta`, entra também no FAQPage. */
  resposta: string;
  /** Marca respostas curtas e diretas, elegíveis a FAQPage. */
  curta?: boolean;
};

export type BlocoConversacional = {
  intencao: IntencaoConversacional;
  /** Título da seção (<h2>). */
  titulo: string;
  perguntas: PerguntaConversacional[];
};

const CONVERSACIONAL: Record<string, BlocoConversacional[]> = {
  "manutencao-de-computador": [
    {
      intencao: "o-que",
      titulo: "O que é manutenção de computador, na prática",
      perguntas: [
        {
          pergunta: "O que está incluído em uma manutenção de computador?",
          resposta:
            "Leitura dos sensores e dos registros de falha do sistema, teste de memória e de disco, revisão da fonte, limpeza interna com troca de pasta térmica quando necessário e ajuste da inicialização. O laudo diz o que foi medido, não apenas o que foi trocado.",
          curta: true,
        },
        {
          pergunta: "O que diferencia manutenção preventiva de manutenção corretiva?",
          resposta:
            "A preventiva acontece com a máquina funcionando: o objetivo é medir desgaste, temperatura e saúde do disco antes da parada. A corretiva parte de um defeito já instalado e trabalha para isolar a peça responsável. A primeira é agendável; a segunda depende do diagnóstico.",
        },
      ],
    },
    {
      intencao: "como",
      titulo: "Como identificar o que o seu computador está pedindo",
      perguntas: [
        {
          pergunta: "Como saber se o problema é do disco, da memória ou da fonte?",
          resposta:
            "Cada peça falha com uma assinatura própria. Disco em fim de vida trava a máquina durante leituras longas e acumula setores realocados. Memória com defeito derruba o sistema em horários aleatórios, sem relação com o que está aberto. Fonte no limite desliga o computador exatamente quando a carga sobe, como ao abrir um jogo ou renderizar um vídeo. O diagnóstico separa os três com teste de estresse controlado antes de qualquer troca de peça.",
        },
        {
          pergunta: "Como é feito o backup antes da manutenção?",
          resposta:
            "Listamos com você as pastas que não podem se perder, copiamos para destino externo, conferimos a cópia abrindo arquivos de amostra e só então mexemos no sistema.",
          curta: true,
        },
      ],
    },
    {
      intencao: "onde",
      titulo: "Onde a manutenção acontece em Curitiba",
      perguntas: [
        {
          pergunta: "Onde fazer manutenção de computador em Curitiba sem sair de casa?",
          resposta:
            "O atendimento é no seu endereço em Curitiba e Região Metropolitana ou por coleta e entrega quando o serviço exige bancada. Não há balcão para o público: você não precisa transportar o equipamento.",
          curta: true,
        },
      ],
    },
    {
      intencao: "por-que",
      titulo: "Por que o computador piora com o tempo",
      perguntas: [
        {
          pergunta: "Por que meu computador desliga sozinho quando abro jogos?",
          resposta:
            "Porque o consumo sai do repouso e vai ao pico em segundos. Se a fonte já perdeu capacidade ou a refrigeração está saturada por poeira e pasta térmica seca, o sistema corta a energia para se proteger. É desligamento por proteção, não defeito do jogo — e aparece primeiro nas tarefas mais pesadas.",
        },
        {
          pergunta: "Por que a máquina fica lenta mesmo depois de formatar?",
          resposta:
            "Formatar resolve sintoma de software. Quando a lentidão volta em poucos dias, o gargalo é físico: disco mecânico saturado, memória insuficiente para a rotina ou aquecimento que reduz a frequência do processador.",
          curta: true,
        },
      ],
    },
  ],

  "manutencao-de-notebook": [
    {
      intencao: "o-que",
      titulo: "O que a manutenção de notebook resolve",
      perguntas: [
        {
          pergunta: "O que significa quando o notebook esquenta e desliga?",
          resposta:
            "Significa que o calor gerado não está sendo dissipado: dissipador obstruído, pasta térmica vencida ou ventoinha com rotação abaixo do especificado. O sistema corta a energia antes de danificar o processador.",
          curta: true,
        },
        {
          pergunta: "O que a limpeza interna faz que a limpeza superficial não faz?",
          resposta:
            "A limpeza interna alcança o conjunto que realmente segura o calor: aletas do dissipador, eixo da ventoinha e a interface térmica entre processador e cooler. Sem abrir, a poeira compactada nas aletas continua funcionando como isolante térmico, e a temperatura volta ao patamar anterior em poucos dias.",
        },
      ],
    },
    {
      intencao: "como",
      titulo: "Como avaliar o estado do seu notebook antes de gastar",
      perguntas: [
        {
          pergunta: "Como saber se o meu HD ou SSD queimou?",
          resposta:
            "Disco morto não aparece na inicialização: a máquina fica na tela do fabricante ou avisa que não há sistema. Disco em degradação ainda aparece, mas trava durante cópias grandes e mostra setores realocados e erros de leitura nos indicadores de saúde. Verificamos os dois cenários antes de falar em recuperação de dados, porque o segundo caso ainda permite salvar arquivos.",
        },
        {
          pergunta: "Como funciona a coleta do notebook para bancada?",
          resposta:
            "Combinamos horário no WhatsApp, retiramos no endereço com registro do estado do aparelho, enviamos o valor após o diagnóstico e devolvemos no mesmo endereço depois da sua aprovação.",
          curta: true,
        },
      ],
    },
    {
      intencao: "onde",
      titulo: "Onde consertar notebook em Curitiba e região",
      perguntas: [
        {
          pergunta: "Onde consertar notebook em Curitiba com atendimento no local?",
          resposta:
            "Atendemos em domicílio e em escritórios de Curitiba e da Região Metropolitana; serviços de bancada seguem por coleta e entrega, sem necessidade de deslocamento do cliente.",
          curta: true,
        },
      ],
    },
    {
      intencao: "por-que",
      titulo: "Por que notebooks ficam lentos e instáveis",
      perguntas: [
        {
          pergunta: "Por que meu notebook ficou lento depois de dois anos?",
          resposta:
            "Quase sempre é a soma de três desgastes que amadurecem juntos: o disco perde desempenho de escrita, a memória passa a ser insuficiente para a rotina atual e a refrigeração degrada, forçando o processador a trabalhar em frequência reduzida. Trocar só uma das três peças costuma devolver pouco ganho percebido — a avaliação diz qual delas é o gargalo real da sua máquina.",
        },
      ],
    },
  ],

  "recuperacao-de-dados": [
    {
      intencao: "o-que",
      titulo: "O que é possível recuperar de um disco com falha",
      perguntas: [
        {
          pergunta: "O que é falha lógica e falha física em um disco?",
          resposta:
            "Falha lógica é perda de estrutura de arquivos com o disco ainda íntegro; falha física envolve componente danificado. A primeira tem chance alta de recuperação; a segunda depende do grau do dano.",
          curta: true,
        },
      ],
    },
    {
      intencao: "como",
      titulo: "Como agir nas primeiras horas após perder arquivos",
      perguntas: [
        {
          pergunta: "Como aumentar a chance de recuperar meus arquivos apagados?",
          resposta:
            "Pare de usar o equipamento imediatamente e não instale programas de recuperação no mesmo disco. Cada gravação nova pode ocupar o espaço onde os seus arquivos ainda estão. Trabalhamos sobre uma imagem do disco, nunca sobre o original, justamente para não consumir as tentativas disponíveis.",
        },
        {
          pergunta: "Como vocês informam a chance real de recuperação?",
          resposta:
            "Após a avaliação enviamos o estado do disco, o tipo de falha identificada e uma estimativa honesta de sucesso — sem prometer resultado que o hardware não sustenta.",
          curta: true,
        },
      ],
    },
    {
      intencao: "onde",
      titulo: "Onde avaliar um disco com problema em Curitiba",
      perguntas: [
        {
          pergunta: "Onde levar um HD que não abre em Curitiba?",
          resposta:
            "Você não precisa levar: retiramos o equipamento ou apenas o disco no seu endereço em Curitiba e região, com registro de recebimento, e a avaliação é feita em bancada.",
          curta: true,
        },
      ],
    },
    {
      intencao: "por-que",
      titulo: "Por que os dados se perdem",
      perguntas: [
        {
          pergunta: "Por que perdi arquivos sem ter apagado nada?",
          resposta:
            "Queda de energia durante gravação, cabo com mau contato e setores que falham em silêncio corrompem a tabela de arquivos sem apagar o conteúdo. Para o sistema a pasta parece vazia; para o disco os dados seguem lá até serem sobrescritos — por isso a pressa em interromper o uso vale mais que qualquer programa.",
        },
      ],
    },
  ],

  "conserto-placa": [
    {
      intencao: "o-que",
      titulo: "O que é reparo em nível de placa",
      perguntas: [
        {
          pergunta: "O que significa reparo em nível de componente na placa-mãe?",
          resposta:
            "É medir os estágios de energia da placa e substituir o componente defeituoso — controlador, mosfet, capacitor ou conector — em vez de trocar a placa inteira.",
          curta: true,
        },
      ],
    },
    {
      intencao: "como",
      titulo: "Como o diagnóstico de placa é feito",
      perguntas: [
        {
          pergunta: "Como saber se o problema é a placa-mãe e não a fonte?",
          resposta:
            "Medimos as tensões de entrada antes de acusar a placa. Se a alimentação chega correta e os estágios internos não sobem, a falha é da placa. Se a entrada já oscila, trocar a placa não resolveria nada — e essa distinção é o primeiro passo do laudo, com fotos das medições.",
        },
      ],
    },
    {
      intencao: "onde",
      titulo: "Onde consertar placa de notebook em Curitiba",
      perguntas: [
        {
          pergunta: "Onde consertar placa mãe de notebook em Curitiba?",
          resposta:
            "O serviço é de bancada, com coleta e entrega no seu endereço em Curitiba e Região Metropolitana; o laudo com fotos das medições é enviado antes da aprovação do valor.",
          curta: true,
        },
      ],
    },
    {
      intencao: "por-que",
      titulo: "Por que placas queimam",
      perguntas: [
        {
          pergunta: "Por que a placa queimou depois de um carregador genérico?",
          resposta:
            "Carregadores fora de especificação entregam tensão instável, e o primeiro estágio de energia da placa absorve essa variação. O componente de proteção cede para salvar o restante do circuito — daí a máquina que simplesmente não dá sinal de vida, mesmo com a bateria intacta.",
        },
      ],
    },
  ],
};

/** Blocos conversacionais do serviço, ou undefined quando não mapeado. */
export const conversacionalDoServico = (slug: string): BlocoConversacional[] | undefined =>
  CONVERSACIONAL[slug];

/**
 * Respostas curtas e diretas, no formato aceito pelo FAQPage da página.
 * Mantém paridade 1:1 porque as mesmas perguntas são renderizadas na FAQ.
 */
export const faqsConversacionais = (slug: string) =>
  (CONVERSACIONAL[slug] ?? [])
    .flatMap((bloco) => bloco.perguntas)
    .filter((p) => p.curta)
    .map((p) => ({ question: p.pergunta, answer: p.resposta }));

export const SLUGS_CONVERSACIONAIS = Object.keys(CONVERSACIONAL);
