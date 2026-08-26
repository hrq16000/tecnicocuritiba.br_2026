/**
 * ============================================================================
 * MÓDULOS EDITORIAIS VARIÁVEIS POR SERVIÇO PRIORITÁRIO (Fase de Operação)
 * ============================================================================
 * Escopo: NENHUMA rota nova. Estes módulos entram apenas nas páginas de
 * serviço que já existem e que são DESTINO das 40 URLs consolidadas — são
 * elas que precisam absorver a intenção das páginas removidas com valor
 * incremental real.
 *
 * Cada serviço recebe um subconjunto próprio de módulos, escolhido pelo que
 * de fato muda naquele serviço:
 *   diagnostico        · o que é medido antes de qualquer orçamento
 *   sintomas-causas    · matriz sintoma → causa provável → verificação
 *   procedimento       · sequência real de execução
 *   limitacoes         · o que o serviço NÃO resolve
 *   decisao            · consertar x substituir, com critério objetivo
 *
 * Regra de aplicação (aplicada em runtime por `filtrarModulos`): uma seção só
 * é renderizada quando o conteúdo dela é realmente diferente do que a página
 * já diz. Se o texto já existe na página (mesmo que com outras palavras), a
 * seção é descartada — módulo repetido é template, e template é doorway.
 *
 * Nada aqui inventa preço, prazo, taxa de sucesso, certificação ou volume de
 * atendimentos. Só descreve procedimento e critério de decisão.
 */

/** @typedef {{ id: string, label: string }} Ancora */

const M = {
  manutencaoComputador: {
    tocExtra: [
      { id: "diagnostico-desktop", label: "O que é medido no diagnóstico" },
      { id: "sintomas-causas-desktop", label: "Sintoma × causa provável" },
      { id: "limites-desktop", label: "O que não resolvemos" },
    ],
    secoes: [
      {
        kind: "conceitos",
        id: "diagnostico-desktop",
        titulo: "O que medimos antes de falar em orçamento",
        cards: [
          {
            titulo: "Alimentação e estabilidade",
            texto:
              "Tensão nas linhas da fonte sob carga, comportamento em picos e resposta ao ligar a frio. Máquina que só falha depois de alguns minutos costuma ser fonte ou dissipação, não software.",
          },
          {
            titulo: "Memória e armazenamento",
            texto:
              "Teste de memória em passes completos e leitura de S.M.A.R.T. do disco. Setores realocados e erros de leitura mudam a ordem do serviço: primeiro cópia dos dados, depois qualquer intervenção.",
          },
          {
            titulo: "Térmica sob carga",
            texto:
              "Temperatura em repouso e em carga sustentada. Diferença grande entre os dois estados indica pasta térmica saturada ou fluxo de ar obstruído, e não defeito de placa.",
          },
          {
            titulo: "Sistema e inicialização",
            texto:
              "Log de eventos, drivers em conflito e itens de inicialização. Isso separa lentidão de software de limitação real de hardware, que é o erro de diagnóstico mais comum.",
          },
        ],
      },
      {
        kind: "matriz",
        id: "sintomas-causas-desktop",
        titulo: "Sintoma, causa provável e como confirmamos",
        colunas: ["Sintoma relatado", "Causa mais provável", "Como confirmamos"],
        linhas: [
          ["Desliga sozinho depois de minutos", "Dissipação ou fonte", "Temperatura em carga e tensão sob carga"],
          ["Liga, ventoinha gira, sem imagem", "Memória, vídeo ou placa", "Teste com pente/slot isolado e vídeo alternativo"],
          ["Lentidão constante desde que ligou", "Disco mecânico ou pouca RAM", "Fila de disco e uso de memória em uso real"],
          ["Travamentos aleatórios sem padrão", "Memória com erro ou driver", "Passes de memória e log de eventos"],
          ["Ruído alto e aquecimento", "Fluxo de ar obstruído", "Inspeção interna e temperatura antes/depois da limpeza"],
        ],
        nota: "A matriz orienta a ordem dos testes; a conclusão vem sempre da medição na bancada, nunca do sintoma isolado.",
      },
      {
        kind: "limites",
        id: "limites-desktop",
        titulo: "O que este serviço não resolve",
        destaque:
          "Quando o problema está fora do escopo, dizemos antes de abrir o equipamento — e não cobramos por tentativa.",
        listas: [
          {
            titulo: "Fora do escopo",
            itens: [
              "Reparo de trilha interna de placa-mãe em máquina com corrosão generalizada",
              "Recuperação de arquivos de disco com falha física (isso é recuperação de dados, outro serviço)",
              "Licenciamento de software proprietário do cliente",
            ],
          },
          {
            titulo: "Quando não compensa",
            itens: [
              "Máquina cuja soma das peças necessárias se aproxima do valor de uma configuração equivalente nova",
              "Placa sem reposição de peça disponível no mercado nacional",
              "Equipamento que já retornou pelo mesmo defeito depois de reparo estrutural",
            ],
          },
        ],
      },
    ],
  },

  manutencaoNotebook: {
    tocExtra: [
      { id: "diagnostico-notebook", label: "Diagnóstico específico de notebook" },
      { id: "procedimento-notebook", label: "Como o serviço é executado" },
      { id: "decisao-notebook", label: "Consertar ou substituir" },
    ],
    secoes: [
      {
        kind: "conceitos",
        id: "diagnostico-notebook",
        titulo: "O que muda no diagnóstico de notebook",
        cards: [
          {
            titulo: "Carga e bateria",
            texto:
              "Testamos carregador, conector e ciclo de carga separadamente. Notebook que só liga na tomada quase nunca é 'placa queimada' — geralmente é bateria no fim do ciclo ou conector com mau contato.",
          },
          {
            titulo: "Dissipação em espaço fechado",
            texto:
              "O gabinete de notebook não perdoa pasta saturada: a máquina reduz desempenho antes de desligar. Medimos temperatura e clock em carga para diferenciar throttling de defeito.",
          },
          {
            titulo: "Teclado, dobradiça e carcaça",
            texto:
              "Peças de desgaste com disponibilidade muito variável por modelo. A checagem inclui se há reposição real antes de propor o reparo.",
          },
          {
            titulo: "Tela e cabo de vídeo",
            texto:
              "Imagem que oscila ao mover a tampa costuma ser cabo, não painel. Confirmamos com saída de vídeo externa antes de qualquer troca de painel.",
          },
        ],
      },
      {
        kind: "fluxo",
        id: "procedimento-notebook",
        titulo: "Como o serviço é executado",
        passos: [
          "Triagem pelo WhatsApp com modelo, sintoma e histórico de uso",
          "Coleta no endereço informado: não trabalhamos com balcão de atendimento ao público.",
          "Diagnóstico na bancada com registro do que foi medido",
          "Envio do escopo e do valor antes de qualquer execução",
          "Execução somente após autorização explícita",
          "Testes de validação em carga e entrega no endereço",
        ],
        nota: "Nenhuma peça é trocada sem autorização registrada. Se o diagnóstico mostrar que não compensa, dizemos isso.",
      },
      {
        kind: "duas-colunas",
        id: "decisao-notebook",
        titulo: "Consertar ou substituir: critério objetivo",
        destaque:
          "A decisão não é sobre a idade do notebook — é sobre quanto do valor de reposição o reparo consome e por quanto tempo ele resolve.",
        colunas: [
          {
            titulo: "Costuma valer o reparo",
            itens: [
              "Defeito isolado e com peça disponível (dissipação, bateria, conector, armazenamento)",
              "Máquina que ainda atende o uso real do cliente depois do reparo",
              "Upgrade que muda a experiência (SSD ou memória) em equipamento estruturalmente íntegro",
            ],
          },
          {
            titulo: "Costuma não valer",
            itens: [
              "Placa com dano por líquido em várias regiões",
              "Somatório de peças de desgaste ao mesmo tempo (tela, teclado, carcaça e bateria)",
              "Modelo sem reposição confiável, em que a próxima falha ficará sem solução",
            ],
          },
        ],
        nota: "Quando o caso cai na coluna da direita, a recomendação é essa mesma — mesmo que isso signifique não executar o serviço.",
      },
    ],
  },

  formatacao: {
    tocExtra: [
      { id: "procedimento-formatacao", label: "Procedimento passo a passo" },
      { id: "limites-formatacao", label: "Quando formatar não resolve" },
    ],
    secoes: [
      {
        kind: "fluxo",
        id: "procedimento-formatacao",
        titulo: "Procedimento real de formatação",
        passos: [
          "Levantamento do que precisa ser preservado: arquivos, perfis, e-mails locais e licenças",
          "Verificação de saúde do disco antes de qualquer escrita — disco com erro muda o plano",
          "Cópia dos dados combinados para mídia separada, com conferência",
          "Instalação limpa do sistema e aplicação de drivers do modelo",
          "Restauração dos dados e reconfiguração do que foi acordado",
          "Testes de inicialização, rede e impressão quando aplicável",
        ],
        nota: "Só formatamos depois de confirmar a cópia. Se o disco apresentar falha de leitura, o serviço muda de rota antes de continuar.",
      },
      {
        kind: "limites",
        id: "limites-formatacao",
        titulo: "Quando formatar não resolve o problema",
        destaque:
          "Formatação resolve estado de software. Ela não corrige hardware — e insistir nela em máquina com defeito físico só adia o diagnóstico.",
        listas: [
          {
            titulo: "Sintomas que não são de software",
            itens: [
              "Travamentos que continuam no menu de instalação do sistema",
              "Desligamento por temperatura sob carga",
              "Erros de leitura durante a própria cópia dos dados",
            ],
          },
          {
            titulo: "O que fazemos nesses casos",
            itens: [
              "Interrompemos e informamos o achado antes de cobrar execução",
              "Reordenamos o serviço: preservação dos dados primeiro",
              "Encaminhamos para o serviço correto em vez de repetir a formatação",
            ],
          },
        ],
      },
    ],
  },

  recuperacaoDados: {
    tocExtra: [
      { id: "diagnostico-dados", label: "Triagem antes de qualquer tentativa" },
      { id: "limites-dados", label: "Limites honestos do serviço" },
    ],
    secoes: [
      {
        kind: "conceitos",
        id: "diagnostico-dados",
        titulo: "Triagem antes de qualquer tentativa",
        cards: [
          {
            titulo: "Falha lógica x falha física",
            texto:
              "Partição perdida, exclusão acidental e sistema corrompido são casos lógicos. Ruído mecânico, não reconhecimento e erro de leitura em bloco indicam falha física — a abordagem e o risco são diferentes.",
          },
          {
            titulo: "Primeira regra: parar de escrever",
            texto:
              "Continuar usando a mídia reduz a chance de recuperação. Orientamos desligar e não instalar programas de recuperação no próprio disco afetado.",
          },
          {
            titulo: "Imagem antes de tudo",
            texto:
              "Quando a mídia permite leitura, trabalhamos sobre uma imagem, não sobre o disco original. Tentativa direta na mídia é o que costuma transformar caso recuperável em irreversível.",
          },
          {
            titulo: "SSD tem comportamento próprio",
            texto:
              "Em SSD, o descarte de blocos pode tornar dados apagados irrecuperáveis mesmo com a mídia saudável. Isso é dito na triagem, antes de qualquer expectativa.",
          },
        ],
      },
      {
        kind: "limites",
        id: "limites-dados",
        titulo: "Limites honestos deste serviço",
        destaque:
          "Nenhum caso é aceito com promessa de resultado. Quem garante resultado antes de abrir o caso está vendendo expectativa, não serviço técnico.",
        listas: [
          {
            titulo: "Casos com baixa probabilidade",
            itens: [
              "Mídia com dano mecânico severo que exige sala limpa e troca de conjunto",
              "Dados sobrescritos por uso continuado após a perda",
              "Criptografia sem a chave ou a senha do usuário",
            ],
          },
          {
            titulo: "Como conduzimos",
            itens: [
              "Avaliação inicial informando a probabilidade real antes de prosseguir",
              "Relação do que foi encontrado antes da entrega, para conferência",
              "Encaminhamento a laboratório especializado quando o caso exige estrutura que não temos",
            ],
          },
        ],
      },
    ],
  },

  upgradeSsdRam: {
    tocExtra: [
      { id: "ssd-ram-decidir", label: "SSD, RAM e o gargalo real" },
      { id: "migracao-dados", label: "Dados antes da migração" },
    ],
    secoes: [
      {
        kind: "matriz",
        id: "ssd-ram-decidir",
        titulo: "SSD, RAM e armazenamento: o que cada sinal pode indicar",
        colunas: ["Comportamento observado", "Hipóteses a avaliar", "Próximo passo seguro"],
        linhas: [
          ["Demora para ligar e abrir arquivos", "Armazenamento lento, pouco espaço ou sistema", "Verificar espaço e saúde do armazenamento sem apagar dados"],
          ["Trava com muitos programas ou abas", "Uso alto de RAM, software pesado ou CPU", "Observar quais programas estavam abertos e a memória em uso"],
          ["Lentidão que piora com calor", "Temperatura e ventilação", "Evitar atribuir o sintoma ao SSD ou à RAM sem avaliação"],
          ["Erros de leitura, arquivos inacessíveis ou disco que some", "Falha do armazenamento ou conexão", "Priorizar cópia e parar mudanças que gravem na unidade"],
        ],
        nota: "A tabela organiza hipóteses; compatibilidade e benefício só são definidos depois de avaliar o equipamento e o uso real.",
      },
      {
        kind: "fluxo",
        id: "migracao-dados",
        titulo: "Antes de migrar para SSD ou ampliar a memória",
        passos: [
          "Mapear arquivos, acessos e programas que precisam continuar disponíveis",
          "Verificar se há uma cópia independente dos dados importantes",
          "Confirmar interface, capacidade suportada e compatibilidade do modelo",
          "Avaliar o estado do armazenamento atual antes de qualquer clonagem",
          "Migrar ou instalar conforme o cenário aprovado e testar a inicialização",
        ],
        nota: "Migração não substitui backup. Se a unidade atual apresenta falhas, preservar os dados vem antes de tentar acelerar o computador.",
      },
    ],
  },
};

/** Módulos por path de serviço já existente (nunca cria rota). */
export const MODULOS_EDITORIAIS = {
  "/servicos/manutencao-de-computador": M.manutencaoComputador,
  "/servicos/manutencao-de-notebook": M.manutencaoNotebook,
  "/servicos/formatacao": M.formatacao,
  "/servicos/recuperacao-de-dados": M.recuperacaoDados,
  "/servicos/upgrade-ssd-ram": M.upgradeSsdRam,
};

export const MODULOS_EDITORIAIS_PATHS = Object.keys(MODULOS_EDITORIAIS);

/** Texto plano de uma seção — usado na checagem de diferença real. */
export function textoDaSecao(secao) {
  const partes = [secao.titulo, secao.intro, secao.destaque, secao.nota];
  if (secao.cards)
    for (const c of secao.cards) partes.push(c.titulo, c.texto, ...(c.itens ?? []));
  if (secao.passos) partes.push(...secao.passos);
  if (secao.linhas) for (const l of secao.linhas) partes.push(...l);
  if (secao.colunas && Array.isArray(secao.colunas))
    for (const c of secao.colunas)
      typeof c === "string" ? partes.push(c) : partes.push(c.titulo, ...(c.itens ?? []));
  if (secao.listas) for (const l of secao.listas) partes.push(l.titulo, ...l.itens);
  return partes.filter(Boolean).join(" ");
}

const normalizar = (t) =>
  String(t)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

function shingles(texto, n = 5) {
  const w = normalizar(texto);
  const set = new Set();
  for (let i = 0; i + n <= w.length; i++) set.add(w.slice(i, i + n).join(" "));
  return set;
}

/** Fração do módulo que já existe no texto da página. */
export function sobreposicao(secao, textoExistente) {
  const a = shingles(textoDaSecao(secao));
  const b = shingles(textoExistente ?? "");
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const s of a) if (b.has(s)) inter++;
  return inter / a.size;
}

/** Limite acima do qual a seção é considerada repetição do que já está na página. */
export const LIMITE_SOBREPOSICAO = 0.3;

/**
 * Devolve apenas os módulos que acrescentam conteúdo realmente diferente.
 * @param {string} path caminho da página de serviço
 * @param {string} textoExistente texto já renderizado na página
 */
export function filtrarModulos(path, textoExistente = "") {
  const cfg = MODULOS_EDITORIAIS[path];
  if (!cfg) return undefined;
  const secoes = cfg.secoes.filter((s) => sobreposicao(s, textoExistente) < LIMITE_SOBREPOSICAO);
  if (!secoes.length) return undefined;
  const ids = new Set(secoes.map((s) => s.id));
  return { tocExtra: cfg.tocExtra.filter((t) => ids.has(t.id)), secoes };
}

export default MODULOS_EDITORIAIS;
