/**
 * ============================================================================
 * FÁBRICA DE LANDINGS SERVIÇO × BAIRRO (Curitiba)
 * ============================================================================
 * Gera páginas locais dedicadas para os serviços principais nos bairros-âncora,
 * reaproveitando o contexto local já curado em `wifiTvBairroData` (pontos de
 * referência, narrativa exclusiva e bairros vizinhos) e o NAP canônico do
 * template `ServicoBairroTemplate`.
 *
 * Regras (política de poda de bairros):
 *  - Indexável apenas para bairros-âncora com narrativa/descrição local real.
 *  - Demais combinações são renderizadas com `noindex` e ficam fora do sitemap.
 *  - Rotas estáticas já existentes têm precedência (React Router prioriza
 *    segmentos literais sobre parâmetros).
 */
import type { ServicoBairroData } from "@/pages/servico-bairro/ServicoBairroTemplate";
import { BAIRROS_INDEXAVEIS } from "@/pages/servico-bairro/wifiTvBairroData";
import { CONSOLIDATED_LOCAL_PATHS } from "@/lib/consolidatedLocalUrls";

/**
 * Bairros-âncora do sitemap curado (política de poda).
 * Onda 1 de liberação de índice: os 4 bairros com `narrativaLocal` exclusiva
 * (≥300 palavras) entram como âncoras geradas.
 */
export const BAIRROS_ANCORA = [
  "cic",
  "batel",
  "agua-verde",
  "centro",
  "portao",
  "jardim-das-americas",
  "ecoville",
  "alto-da-xv",
  "reboucas",
] as const;

interface ServicoDef {
  slug: string;
  nome: string;
  h1: (bairro: string) => string;
  subtitulo: string;
  precoBase: string;
  precoDescricao: string;
  /** Parágrafo técnico exclusivo do serviço (soma com a narrativa do bairro). */
  contexto: string;
  beneficios: string[];
  processoPasso: { titulo: string; descricao: string }[];
  faq: (bairro: string) => { pergunta: string; resposta: string }[];
  relacionados: { nome: string; slug: string }[];
}

const VISITA = "R$ 99,99";
const VISITA_DESC =
  "Visita técnica de inspeção sem compromisso a partir de R$ 99,99 por até 30 minutos (e a cada 30 minutos adicionais). Peças não inclusas. Condições completas na página de termos.";

export const SERVICOS_GERADOS: Record<string, ServicoDef> = {
  "formatacao-computador": {
    slug: "formatacao-computador",
    nome: "Formatação de Computador",
    h1: (b) => `Formatação de Computador e Notebook no ${b}`,
    subtitulo:
      "Reinstalação limpa do Windows com backup prévio, drivers atualizados e programas essenciais, com agenda combinada na triagem.",
    precoBase: VISITA,
    precoDescricao: VISITA_DESC,
    contexto:
      "A formatação começa por um inventário do que precisa ser preservado: documentos, fotos, perfis de navegador, chaves de licença e pastas sincronizadas em nuvem. Só depois de confirmar o backup executamos a reinstalação do sistema, aplicamos os drivers corretos para o modelo específico da placa-mãe ou do notebook e reinstalamos os programas de rotina. Em máquinas com disco mecânico antigo, medimos os setores realocados antes de reinstalar — formatar um disco em fim de vida apenas adia o problema, e nesses casos apresentamos o comparativo entre reinstalar no disco atual ou migrar para SSD. Ao final, entregamos a máquina com atualizações aplicadas, inicialização enxuta e uma lista por escrito do que foi instalado.",
    beneficios: [
      "Backup verificado antes de qualquer formatação",
      "Windows reinstalado com drivers do modelo exato",
      "Programas de rotina e navegadores reconfigurados",
      "Inicialização limpa, sem programas desnecessários",
      "Diagnóstico do disco antes de reinstalar",
      "Relatório por escrito do que foi feito",
    ],
    processoPasso: [
      { titulo: "Triagem", descricao: "Levantamos equipamento, sintoma e dados a preservar pelo WhatsApp" },
      { titulo: "Backup", descricao: "Copiamos e conferimos os arquivos antes de formatar" },
      { titulo: "Reinstalação", descricao: "Sistema, drivers e programas instalados e atualizados" },
      { titulo: "Devolução", descricao: "Máquina testada e entregue com relatório do serviço" },
    ],
    faq: (b) => [
      {
        pergunta: `Meus arquivos ficam salvos ao formatar no ${b}?`,
        resposta:
          "Sim. O backup é etapa obrigatória e é conferido antes da formatação. Se o disco estiver com falha física, avisamos antes de prosseguir.",
      },
      {
        pergunta: "Quanto tempo leva a formatação?",
        resposta:
          "Depende do volume de dados e do estado do disco. A janela estimada é confirmada na triagem, sem promessa de prazo fechado.",
      },
      {
        pergunta: `O atendimento no ${b} é em casa ou com coleta?`,
        resposta:
          "Quando a máquina liga e funciona, a formatação costuma caber em visita. Se houver falha de disco ou necessidade de bancada, convertemos em coleta e entrega.",
      },
      {
        pergunta: "O serviço tem garantia?",
        resposta: "Sim, a mão de obra tem garantia registrada por escrito. Peças seguem a garantia do fornecedor.",
      },
    ],
    relacionados: [
      { nome: "Remoção de Vírus", slug: "remocao-virus" },
      { nome: "Upgrade de SSD e Memória", slug: "upgrade-ssd-memoria" },
      { nome: "Conserto de PC e Notebook", slug: "conserto-pc-notebook" },
    ],
  },
  "remocao-virus": {
    slug: "remocao-virus",
    nome: "Remoção de Vírus e Malware",
    h1: (b) => `Remoção de Vírus e Malware no ${b}`,
    subtitulo:
      "Limpeza de ameaças, sequestradores de navegador e programas indesejados sem apagar seus arquivos pessoais.",
    precoBase: VISITA,
    precoDescricao: VISITA_DESC,
    contexto:
      "A maior parte das infecções que atendemos não é vírus clássico: são extensões de navegador injetando anúncios, tarefas agendadas que reinstalam adware, atalhos alterados e programas que se disfarçam de utilitário de limpeza. Por isso o trabalho começa por uma varredura offline e pela leitura das tarefas agendadas, serviços e chaves de inicialização, e não apenas por um antivírus rodando dentro do sistema infectado. Removemos o que é malicioso, revertemos as alterações de proxy e de página inicial, verificamos se houve roubo de sessões salvas e orientamos a troca de senhas críticas quando há indício de captura de credenciais. Documentos, fotos e pastas de trabalho permanecem intactos: a limpeza é cirúrgica e a formatação só entra em cena quando a infecção compromete o núcleo do sistema.",
    beneficios: [
      "Varredura offline, fora do sistema comprometido",
      "Limpeza de extensões, tarefas agendadas e serviços maliciosos",
      "Arquivos pessoais preservados",
      "Reversão de proxy, página inicial e atalhos alterados",
      "Orientação de troca de senhas quando há risco de credenciais",
      "Ajuste das proteções nativas do sistema",
    ],
    processoPasso: [
      { titulo: "Triagem", descricao: "Descrevemos os sintomas e o histórico da infecção pelo WhatsApp" },
      { titulo: "Varredura", descricao: "Análise offline e leitura de inicialização, serviços e tarefas" },
      { titulo: "Limpeza", descricao: "Remoção das ameaças e reversão das alterações do sistema" },
      { titulo: "Prevenção", descricao: "Proteções ajustadas e orientação de uso seguro" },
    ],
    faq: (b) => [
      {
        pergunta: `Preciso formatar para remover vírus no ${b}?`,
        resposta:
          "Na maioria dos casos não. A formatação só é recomendada quando a infecção atinge componentes do sistema que não podem ser recuperados com segurança.",
      },
      {
        pergunta: "Tenho antivírus e mesmo assim infectei. Por quê?",
        resposta:
          "Adware e sequestradores de navegador costumam ser instalados pelo próprio usuário junto de programas gratuitos, e muitos antivírus não bloqueiam esse tipo de instalação.",
      },
      {
        pergunta: "Meus arquivos correm risco durante a limpeza?",
        resposta:
          "Não removemos documentos pessoais. Quando há risco de perda por dano prévio, avisamos antes e sugerimos backup.",
      },
      {
        pergunta: `Atendem empresas no ${b}?`,
        resposta: "Sim. Também tratamos estações de trabalho e servidores de arquivo de pequenas e médias empresas.",
      },
    ],
    relacionados: [
      { nome: "Formatação de Computador", slug: "formatacao-computador" },
      { nome: "Backup e Recuperação de Dados", slug: "backup-recuperacao" },
      { nome: "Conserto de PC e Notebook", slug: "conserto-pc-notebook" },
    ],
  },
  "conserto-pc-notebook": {
    slug: "conserto-pc-notebook",
    nome: "Conserto de PC e Notebook",
    h1: (b) => `Conserto de PC e Notebook no ${b}`,
    subtitulo:
      "Diagnóstico de máquina que não liga, superaquecimento, tela azul e travamentos, com bancada quando o reparo exige.",
    precoBase: VISITA,
    precoDescricao: VISITA_DESC,
    contexto:
      "Diagnóstico de hardware não se faz por tentativa. Medimos tensões da fonte, testamos memória em ciclos longos, avaliamos temperatura sob carga e observamos o comportamento do equipamento em partida a frio antes de apontar a causa. Notebooks que desligam sozinhos, por exemplo, tanto podem estar com pasta térmica ressecada e dissipador obstruído quanto com falha na etapa de alimentação da placa — e o caminho de reparo é completamente diferente em cada caso. Quando o reparo exige bancada, microscópio ou estação de retrabalho, a máquina segue para coleta com valor mínimo pré-aprovado e laudo por escrito. Quando o conserto não compensa diante do valor do equipamento, dizemos isso com clareza e apresentamos o comparativo em vez de empurrar peça.",
    beneficios: [
      "Diagnóstico com medição real, não por tentativa",
      "Limpeza interna e troca de pasta térmica quando indicado",
      "Reparo em bancada para falhas de placa",
      "Comparativo honesto entre reparar e substituir",
      "Laudo por escrito antes da execução",
      "Garantia registrada sobre a mão de obra",
    ],
    processoPasso: [
      { titulo: "Triagem", descricao: "Sintoma, modelo e histórico levantados pelo WhatsApp" },
      { titulo: "Avaliação", descricao: "Testes de alimentação, memória, temperatura e armazenamento" },
      { titulo: "Reparo", descricao: "Execução em visita ou bancada, conforme a complexidade" },
      { titulo: "Entrega", descricao: "Testes finais, laudo e garantia registrada" },
    ],
    faq: (b) => [
      {
        pergunta: `Vocês consertam notebook de qualquer marca no ${b}?`,
        resposta:
          "Sim. Trabalhamos com as principais marcas de notebook e desktop, incluindo montagens personalizadas e máquinas de trabalho.",
      },
      {
        pergunta: "Máquina que não liga é sempre placa queimada?",
        resposta:
          "Não. Fonte, bateria, botão de energia e memória respondem por boa parte dos casos. Só apontamos placa após medição.",
      },
      {
        pergunta: `O reparo é feito no meu endereço no ${b}?`,
        resposta:
          "Reparos simples cabem em visita. Falhas de placa e reparos com bancada exigem coleta, com valor mínimo pré-aprovado e laudo.",
      },
      {
        pergunta: "E se não compensar consertar?",
        resposta:
          "Apresentamos o comparativo entre reparo e substituição. A decisão é sua, com o laudo em mãos e sem pressão comercial.",
      },
    ],
    relacionados: [
      { nome: "Upgrade de SSD e Memória", slug: "upgrade-ssd-memoria" },
      { nome: "Formatação de Computador", slug: "formatacao-computador" },
      { nome: "Backup e Recuperação de Dados", slug: "backup-recuperacao" },
    ],
  },
  "upgrade-ssd-memoria": {
    slug: "upgrade-ssd-memoria",
    nome: "Upgrade de SSD e Memória",
    h1: (b) => `Upgrade de SSD e Memória RAM no ${b}`,
    subtitulo:
      "Troca de disco por SSD e ampliação de memória com migração do sistema, sem reinstalar tudo do zero.",
    precoBase: VISITA,
    precoDescricao: VISITA_DESC,
    contexto:
      "Antes de indicar qualquer peça, verificamos o que a máquina realmente aceita: interface do disco (SATA ou NVMe), número de slots de memória livres, frequência suportada pela placa e limite do chipset. É comum encontrar notebooks que aceitam NVMe apenas em um dos slots, ou placas que reduzem a frequência da memória quando os quatro bancos são ocupados — detalhes que mudam completamente o resultado percebido. Na execução, migramos o sistema para o SSD preservando programas, licenças e perfis, ajustamos alinhamento e recursos de gerenciamento do disco e validamos a leitura e escrita reais depois da migração. Quando a lentidão vem de outra causa — disco em falha, superaquecimento ou infecção — dizemos isso antes de vender upgrade que não resolveria o problema.",
    beneficios: [
      "Checagem de compatibilidade antes de indicar peça",
      "Migração do sistema sem reinstalar do zero",
      "Programas, licenças e perfis preservados",
      "Validação de leitura e escrita após o upgrade",
      "Avaliação honesta quando a lentidão tem outra causa",
      "Instalação de peça que o cliente já possui, se preferir",
    ],
    processoPasso: [
      { titulo: "Triagem", descricao: "Modelo e uso levantados para checar compatibilidade" },
      { titulo: "Compatibilidade", descricao: "Interface, slots livres e limites da placa verificados" },
      { titulo: "Migração", descricao: "Sistema clonado para o SSD e memória instalada" },
      { titulo: "Validação", descricao: "Testes de desempenho e entrega com orientações" },
    ],
    faq: (b) => [
      {
        pergunta: `Vocês levam as peças no atendimento no ${b}?`,
        resposta:
          "Confirmamos o modelo na triagem. Você também pode fornecer a peça: nesse caso o atendimento cobre apenas a instalação e a migração.",
      },
      {
        pergunta: "Vou perder programas ao trocar por SSD?",
        resposta:
          "Não. A migração preserva o sistema, os programas e os perfis. A reinstalação limpa só é feita se você preferir.",
      },
      {
        pergunta: "Quanto de memória vale a pena colocar?",
        resposta:
          "Depende do uso e do que a placa aceita. Indicamos a configuração que traz ganho real, sem empurrar capacidade que o sistema não aproveita.",
      },
      {
        pergunta: "Upgrade resolve qualquer lentidão?",
        resposta:
          "Não. Disco em falha, superaquecimento e infecção também causam lentidão — por isso o diagnóstico vem antes da indicação de peça.",
      },
    ],
    relacionados: [
      { nome: "Formatação de Computador", slug: "formatacao-computador" },
      { nome: "Conserto de PC e Notebook", slug: "conserto-pc-notebook" },
      { nome: "Remoção de Vírus", slug: "remocao-virus" },
    ],
  },
};

/**
 * Combinações geradas e INDEXÁVEIS (âncoras sem página estática dedicada).
 * Mantida em sincronia com `scripts/generate-sitemaps.mjs`.
 */
export const ROTAS_ESTATICAS_EXISTENTES = new Set<string>([
  "formatacao-computador/centro",
  "formatacao-computador/portao",
  "remocao-virus/centro",
  "remocao-virus/batel",
  "remocao-virus/portao",
  "conserto-pc-notebook/batel",
  "conserto-pc-notebook/cic",
  "conserto-pc-notebook/portao",
  "upgrade-ssd-memoria/batel",
]);

export function isIndexavel(servicoSlug: string, bairroSlug: string): boolean {
  const bairro = BAIRROS_INDEXAVEIS[bairroSlug];
  if (!bairro) return false;
  if (!(BAIRROS_ANCORA as readonly string[]).includes(bairroSlug)) return false;
  if (ROTAS_ESTATICAS_EXISTENTES.has(`${servicoSlug}/${bairroSlug}`)) return false;
  // Fase Final: consolidada ⇒ 301, nunca indexável.
  if (CONSOLIDATED_LOCAL_PATHS.has(`/servicos/${servicoSlug}/${bairroSlug}`)) return false;
  return Boolean(bairro.narrativaLocal || bairro.descricaoLocal);
}

/** Lista de paths gerados e indexáveis (usada em auditorias e sitemap). */
export const GENERATED_INDEXABLE_PATHS: string[] = Object.keys(SERVICOS_GERADOS)
  .flatMap((servico) =>
    (BAIRROS_ANCORA as readonly string[]).map((bairro) => ({ servico, bairro })),
  )
  .filter(({ servico, bairro }) => isIndexavel(servico, bairro))
  .map(({ servico, bairro }) => `/servicos/${servico}/${bairro}`);

/** Constrói os dados da landing serviço × bairro, ou `null` se não houver contexto. */
export function buildServicoBairroData(
  servicoSlug: string,
  bairroSlug: string,
): ServicoBairroData | null {
  const servico = SERVICOS_GERADOS[servicoSlug];
  const bairro = BAIRROS_INDEXAVEIS[bairroSlug];
  if (!servico || !bairro) return null;

  const referencias = bairro.pontosReferencia.join(", ");
  const descricaoLonga = [
    `${servico.nome} no ${bairro.nome}, em Curitiba: ${bairro.descricaoLocal}`,
    servico.contexto,
    `No ${bairro.nome} atendemos endereços próximos a ${referencias}, com ${bairro.tempoAtendimento}. O contato inicial é sempre pelo WhatsApp, com triagem que registra equipamento, sintoma e endereço aproximado antes de qualquer deslocamento — isso evita visita desnecessária e permite indicar a modalidade correta (visita de inspeção, pacote de até 2 horas ou coleta com diagnóstico). Nos bairros vizinhos ${bairro.bairrosProximos
      .map((b) => b.nome)
      .join(", ")} o atendimento segue as mesmas condições comerciais publicadas na página de termos.`,
    bairro.narrativaLocal ?? "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    // Título curto (< 60 caracteres) para não truncar na SERP: o nome da marca
    // já aparece no domínio e no og:site_name, e "Curitiba" só é acrescentado
    // quando o nome do bairro ainda não o contém.
    metaTitle: `${servico.nome} — ${bairro.nome}${bairro.nome.includes("Curitiba") ? "" : ", Curitiba"}`,
    metaDescription: `${servico.nome} no ${bairro.nome}, Curitiba. Triagem por WhatsApp, agendamento e condições por escrito. Visita a partir de R$ 99,99.`,
    servico: servico.nome,
    servicoSlug: servico.slug,
    bairro: bairro.nome,
    bairroSlug: bairro.slug,
    cidade: "Curitiba",
    cidadeSlug: "curitiba",
    h1: servico.h1(bairro.nome),
    subtitulo: servico.subtitulo,
    precoBase: servico.precoBase,
    precoDescricao: servico.precoDescricao,
    descricaoLonga,
    beneficios: servico.beneficios,
    processoPasso: servico.processoPasso,
    faq: servico.faq(bairro.nome),
    pontosReferencia: bairro.pontosReferencia,
    tempoAtendimento: bairro.tempoAtendimento,
    servicosRelacionados: servico.relacionados,
    bairrosProximos: bairro.bairrosProximos,
    indexable: isIndexavel(servicoSlug, bairroSlug),
  };
}
