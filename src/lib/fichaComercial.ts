/**
 * ============================================================================
 * FICHA COMERCIAL PADRÃO DAS PÁGINAS DE SERVIÇO (Rodada 4C)
 * ============================================================================
 * Objetivo: toda página de serviço exibe os MESMOS campos obrigatórios —
 * valor inicial, tempo estimado, o que está incluso, o que não está incluso,
 * acréscimos, observações, limitações e um caminho de agendamento.
 *
 * Regras inegociáveis:
 * - Nenhum valor é escrito aqui à mão: todos vêm de `precosConfig`
 *   (fonte única de verdade). O gate `check:ficha-comercial` falha o build
 *   se qualquer rótulo de preço divergir.
 * - Nenhuma promessa de prazo de conclusão, de resultado ou de peça inclusa.
 * - Conteúdo aditivo: não substitui nenhum bloco editorial existente.
 */

import {
  NOTA_VISITA_AVULSA,
  QUANDO_VISITA_COMPATIVEL,
  REGRA_CANCELAMENTO,
  REGRA_IMPRESSORA_3D,
  VALOR_COLETA_MINIMO_LABEL,
  VALOR_IMPRESSORA_3D_MINIMO_LABEL,
  VALOR_PACOTE_2H_LABEL,
  VALOR_VISITA_LABEL,
} from "@/lib/precosConfig";

export type RotaAtendimento = "visita" | "coleta";

export interface FichaComercial {
  /** Como o serviço normalmente começa. */
  rota: RotaAtendimento;
  valorInicialLabel: string;
  valorInicialNota: string;
  tempoEstimado: string;
  incluso: string[];
  naoIncluso: string[];
  acrescimos: string[];
  observacoes: string[];
  limitacoes: string[];
}

const NAO_INCLUSO_BASE = [
  "Peças, componentes e materiais de reposição.",
  "Licenças de software e assinaturas.",
  "Serviços de terceiros (assistência de fabricante, operadora ou provedor).",
];

const ACRESCIMOS_BASE = [
  "Tempo adicional no endereço é contado a cada 30 minutos.",
  "Deslocamento fora de Curitiba pode alterar o valor mínimo.",
  `Pacote pré-acordado de até 2 horas: ${VALOR_PACOTE_2H_LABEL}.`,
];

const OBSERVACOES_BASE = [
  "Qualquer valor acima do mínimo pré-aprovado só avança com a sua autorização por escrito.",
  REGRA_CANCELAMENTO,
];

const VISITA: Pick<
  FichaComercial,
  "rota" | "valorInicialLabel" | "valorInicialNota" | "tempoEstimado"
> = {
  rota: "visita",
  valorInicialLabel: `A partir de ${VALOR_VISITA_LABEL}`,
  valorInicialNota: NOTA_VISITA_AVULSA,
  tempoEstimado: "Até 30 minutos de atendimento por bloco, contados no endereço.",
};

const COLETA: Pick<
  FichaComercial,
  "rota" | "valorInicialLabel" | "valorInicialNota" | "tempoEstimado"
> = {
  rota: "coleta",
  valorInicialLabel: `Mínimo pré-aprovado ${VALOR_COLETA_MINIMO_LABEL}`,
  valorInicialNota:
    "Diagnóstico com compromisso, com coleta e entrega inclusas no valor mínimo pré-aprovado. Peças não inclusas.",
  tempoEstimado:
    "Prazo confirmado por escrito depois do diagnóstico em bancada — sem promessa de prazo antes disso.",
};

function ficha(
  base: typeof VISITA | typeof COLETA,
  extra: {
    incluso: string[];
    naoIncluso?: string[];
    acrescimos?: string[];
    observacoes?: string[];
    limitacoes: string[];
  },
): FichaComercial {
  return {
    ...base,
    incluso: extra.incluso,
    naoIncluso: [...NAO_INCLUSO_BASE, ...(extra.naoIncluso ?? [])],
    acrescimos: [...ACRESCIMOS_BASE, ...(extra.acrescimos ?? [])],
    observacoes: [...OBSERVACOES_BASE, ...(extra.observacoes ?? [])],
    limitacoes: extra.limitacoes,
  };
}

/**
 * Impressora 3D — vertical com mínimo pré-aprovado próprio (fonte única:
 * VALOR_IMPRESSORA_3D_MINIMO_LABEL). Sempre por coleta e entrega, porque o
 * reparo exige bancada, calibração e teste de impressão real.
 */
const IMPRESSORA_3D: Pick<
  FichaComercial,
  "rota" | "valorInicialLabel" | "valorInicialNota" | "tempoEstimado"
> = {
  rota: "coleta",
  valorInicialLabel: `Mínimo pré-aprovado ${VALOR_IMPRESSORA_3D_MINIMO_LABEL}`,
  valorInicialNota:
    "Diagnóstico completo em bancada, calibração e teste de impressão, com coleta e entrega inclusas no valor mínimo pré-aprovado. Insumos e peças não inclusos.",
  tempoEstimado:
    "Prazo confirmado por escrito depois do diagnóstico em bancada — sem promessa de prazo antes disso.",
};

export const FICHAS_COMERCIAIS: Record<string, FichaComercial> = {
  formatacao: ficha(VISITA, {
    incluso: [
      "Conferência do equipamento e da viabilidade da instalação.",
      "Instalação do sistema e dos drivers essenciais.",
      "Conferência de inicialização e dos periféricos básicos.",
    ],
    limitacoes: [
      "Backup dos seus arquivos precisa ser combinado antes: formatar apaga o disco.",
      "Licenças originais são de responsabilidade do cliente.",
    ],
  }),
  "manutencao-de-notebook": ficha(COLETA, {
    incluso: [
      "Diagnóstico em bancada com registro do que foi verificado.",
      "Coleta e entrega dentro da área atendida.",
      "Valor informado por escrito antes de qualquer reparo.",
    ],
    limitacoes: [
      "Equipamento com dano por líquido ou oxidação tem avaliação caso a caso.",
      "Peça descontinuada pode inviabilizar o reparo — nesse caso a análise é informada por escrito.",
    ],
  }),
  "manutencao-de-computador": ficha(VISITA, {
    incluso: [
      "Inspeção do funcionamento, temperatura e inicialização.",
      "Ajustes e limpeza compatíveis com atendimento no endereço.",
      "Relato do que foi encontrado e o próximo passo recomendado.",
    ],
    limitacoes: [
      "Reparo que exige bancada, solda ou ferramenta específica é convertido em coleta.",
      QUANDO_VISITA_COMPATIVEL,
    ],
  }),
  "upgrade-ssd-ram": ficha(VISITA, {
    incluso: [
      "Conferência de compatibilidade antes da instalação.",
      "Instalação da peça e conferência de reconhecimento pelo sistema.",
    ],
    limitacoes: [
      "Memória soldada não é expansível.",
      "Clonagem de disco depende do estado do disco de origem.",
    ],
  }),
  "remocao-de-virus": ficha(VISITA, {
    incluso: [
      "Verificação do sistema e remoção do que for identificado.",
      "Revisão de inicialização, extensões e programas suspeitos.",
    ],
    limitacoes: [
      "Arquivo criptografado por ransomware pode não ser recuperável.",
      "Reinfecção depende de hábitos de uso e não está coberta como retorno.",
    ],
  }),
  "recuperacao-de-dados": ficha(COLETA, {
    incluso: [
      "Análise do estado da mídia antes de qualquer tentativa.",
      "Relato honesto de viabilidade, com o que é e o que não é possível.",
    ],
    limitacoes: [
      "Não há garantia de recuperação: dano físico severo pode inviabilizar a leitura.",
      "Trabalhos de sala limpa são encaminhados a laboratório especializado.",
    ],
  }),
  "redes-e-wifi": ficha(VISITA, {
    incluso: [
      "Medição de sinal nos pontos combinados.",
      "Ajuste de canal, posicionamento e configuração do roteador.",
    ],
    limitacoes: [
      "Instabilidade do provedor é responsabilidade da operadora.",
      "Passagem de cabo e infraestrutura civil são avaliadas à parte.",
    ],
  }),
  "suporte-tecnico-empresarial": ficha(VISITA, {
    incluso: [
      "Atendimento por chamado com registro do que foi executado.",
      "Suporte remoto ou presencial conforme o caso.",
    ],
    limitacoes: [
      "Acessos e senhas de sistemas de terceiros são de responsabilidade da empresa.",
      "Desenvolvimento de software não faz parte do escopo.",
    ],
  }),
  "manutencao-preventiva-empresas": ficha(VISITA, {
    incluso: [
      "Checklist preventivo por estação com registro.",
      "Inventário simplificado do parque atendido.",
    ],
    limitacoes: [
      "Preventiva reduz risco, mas não elimina falha de hardware.",
      "Correção de defeito encontrado tem valor informado separadamente.",
    ],
  }),
  "backup-para-empresas": ficha(VISITA, {
    incluso: [
      "Levantamento do que precisa ser copiado e com que frequência.",
      "Configuração das rotinas combinadas e teste de restauração.",
    ],
    limitacoes: [
      "Sincronização em nuvem não substitui backup com versões.",
      "Custos de armazenamento e licenças são do contratante.",
    ],
  }),
  "suporte-home-office": ficha(VISITA, {
    incluso: [
      "Conferência do posto de trabalho, rede e periféricos.",
      "Ajustes de configuração para as ferramentas usadas no trabalho.",
    ],
    limitacoes: [
      "Políticas e VPNs corporativas dependem de liberação do TI da empresa.",
      "Equipamento com defeito de hardware é convertido em coleta.",
    ],
  }),
  "montagem-de-pc": ficha(COLETA, {
    incluso: [
      "Conferência de compatibilidade das peças antes da montagem.",
      "Montagem, organização de cabos, ajuste de BIOS e testes de estabilidade.",
    ],
    limitacoes: [
      "Peças enviadas pelo cliente são conferidas, mas a garantia delas é do fornecedor.",
      "Montagem não cobre overclock extremo nem refrigeração líquida customizada.",
    ],
  }),
  "conserto-tv": ficha(COLETA, {
    incluso: [
      "Diagnóstico em bancada com registro fotográfico do processo.",
      "Coleta e entrega dentro da área atendida.",
    ],
    limitacoes: [
      "Painel/tela trincado ou com falha interna não é reparável — a análise informa quando o reparo deixa de compensar.",
      "Garantia de 90 dias cobre a mão de obra do ponto reparado, não o aparelho inteiro.",
    ],
  }),
  "conserto-placa": ficha(COLETA, {
    incluso: [
      "Análise da placa em bancada, com medição e registro do que foi encontrado.",
      "Valor informado por escrito antes de qualquer intervenção.",
    ],
    limitacoes: [
      "Placa com dano extenso por oxidação ou reparo anterior mal feito pode ser recusada.",
      "Garantia de 90 dias cobre a mão de obra do ponto reparado.",
    ],
  }),
  "conserto-monitor": ficha(COLETA, {
    incluso: [
      "Diagnóstico em bancada com provas visuais do processo.",
      "Coleta e entrega dentro da área atendida.",
    ],
    limitacoes: [
      "Não realizamos troca de painel: monitor com painel danificado é devolvido com o parecer.",
      "Garantia de 90 dias cobre a mão de obra do ponto reparado.",
    ],
  }),
  "conserto-impressora-3d": ficha(IMPRESSORA_3D, {
    incluso: [
      "Diagnóstico completo em bancada: térmico, mecânico, eletrônico e de firmware.",
      "Calibração de nivelamento, primeira camada e fluxo para o material declarado.",
      "Peça de validação impressa na própria máquina e registrada no laudo.",
      "Coleta e entrega dentro da área atendida.",
    ],
    naoIncluso: [
      "Filamento, resina e demais insumos de impressão.",
      "Peças de upgrade (hotend, placa, sensor) e itens de desgaste como bico, tubo e correia.",
      "Serviço de impressão de peças sob demanda.",
    ],
    observacoes: [
      REGRA_IMPRESSORA_3D,
      "A calibração entregue vale para o material declarado por você; trocar de material exige recalibrar.",
    ],
    limitacoes: [
      "Atendimento exclusivamente por coleta e entrega: o reparo exige bancada e teste de impressão.",
      "Impressora de resina precisa chegar com o tanque limpo, sem resina, por segurança de manuseio.",
      "Garantia de 90 dias cobre a mão de obra do ponto reparado, sem cobrir entupimento novo por insumo inadequado.",
    ],
  }),
};


export function fichaComercialDoServico(slug: string): FichaComercial | undefined {
  return FICHAS_COMERCIAIS[slug];
}

export const FICHA_ANCORA = "ficha-comercial";
export const AGENDAMENTO_ANCORA = "agendamento";
