/**
 * ============================================================================
 * MODALIDADES E VALORES — FONTE ÚNICA DE VERDADE
 * ============================================================================
 * Nenhuma página pode publicar valor de atendimento fora deste arquivo.
 * Regras reais da operação — sem promessa de prazo e sem peça inclusa.
 */

export const TERMOS_URL = "/termos-e-condicoes";

export interface ModalidadeAtendimento {
  id: "visita-avulsa" | "pacote-2h" | "coleta-diagnostico";
  titulo: string;
  valorLabel: string;
  unidade: string;
  resumo: string;
  detalhes: string[];
  indicadoQuando: string;
}

export const MODALIDADES: ModalidadeAtendimento[] = [
  {
    id: "visita-avulsa",
    titulo: "Visita técnica de inspeção (avulsa)",
    valorLabel: "A partir de R$ 99,99",
    unidade: "cada 30 minutos de atendimento",
    resumo:
      "Visita técnica de inspeção sem compromisso, a partir de R$ 99,99 por até 30 minutos — e a cada 30 minutos adicionais de atendimento.",
    detalhes: [
      "Inspeção superficial, sem abertura de placas e sem bancada.",
      "Peças, componentes, licenças e materiais não estão inclusos.",
      "O valor mínimo pode variar conforme a região de deslocamento.",
      "Inclui inspeção, diagnóstico, avaliação e tentativa de reparo rápido que seja compatível com o tempo contratado.",
      "Sem promessa de solução no local: o que não for resolvível em visita é convertido em coleta.",
    ],
    indicadoQuando:
      "A máquina liga e funciona, e a necessidade é atualização de sistema, configuração, upgrade simples ou instalação de peça que o cliente já possui.",
  },
  {
    id: "pacote-2h",
    titulo: "Pacote de visita técnica de até 2 horas",
    valorLabel: "R$ 279,99",
    unidade: "pacote de até 2 horas, pré-acordado",
    resumo:
      "Pacote pré-acordado de até 2 horas de visita técnica por R$ 279,99, sem promessas de resultado e sem peças inclusas.",
    detalhes: [
      "Precisa ser acordado antes do deslocamento.",
      "Limite de até 2 horas no endereço; tempo excedente segue a regra de 30 em 30 minutos.",
      "Não inclui peças, componentes, licenças nem serviços de bancada.",
      "Sem promessa de solução — o escopo é tempo técnico aplicado.",
    ],
    indicadoQuando:
      "Serviços mais longos no endereço, como organização de várias máquinas, configuração de rede ou upgrades planejados.",
  },
  {
    id: "coleta-diagnostico",
    titulo: "Diagnóstico com compromisso + coleta e entrega",
    valorLabel: "Mínimo pré-aprovado R$ 299,99",
    unidade: "coleta e entrega inclusas",
    resumo:
      "Diagnóstico com compromisso e tentativa de reparos compatíveis, com coleta e entrega inclusas, valor mínimo pré-aprovado de R$ 299,99.",
    detalhes: [
      "Coleta e entrega inclusas, sem custo adicional, no valor mínimo pré-aprovado.",
      "Reparos compatíveis dentro do mínimo pré-aprovado já são executados sem custo extra.",
      "Se o reparo necessário ultrapassar o mínimo, o valor é informado antes de qualquer execução.",
      "Peças, componentes e licenças não estão inclusos.",
      "Reparos acima do mínimo pré-aprovado dependem da sua autorização por escrito.",
      "Cancelamento válido somente até 24 horas corridas após a coleta.",
      "Após 24 horas da coleta não é compatível cancelamento nem desistência do diagnóstico.",
    ],
    indicadoQuando:
      "A maioria dos casos: quando o reparo exige bancada, ferramenta específica ou quando o equipamento não liga, trava ou apresenta falha de hardware.",
  },
];

/** Regra de cancelamento — texto único usado em todo o site. */
export const REGRA_CANCELAMENTO =
  "Cancelamento válido somente até 24 horas corridas após a coleta. Após esse prazo não é compatível o cancelamento ou a desistência do diagnóstico.";

/** Nota curta obrigatória junto de qualquer valor de visita/diagnóstico. */
export const NOTA_VISITA_AVULSA =
  "No atendimento avulso é visita técnica de inspeção sem compromisso, a partir de R$ 99,99 por até (ou a cada) 30 minutos de atendimento. Peças não inclusas.";

/** Quando a visita técnica é realmente compatível. */
export const QUANDO_VISITA_COMPATIVEL =
  "A visita técnica é compatível quando a máquina está ligando e funcionando e a necessidade é atualização de sistema, configuração ou upgrade com peça já em mãos. Na maioria dos demais casos o atendimento é com coleta e entrega.";

export const VALOR_VISITA_LABEL = "R$ 99,99";
export const VALOR_PACOTE_2H_LABEL = "R$ 279,99";
export const VALOR_COLETA_MINIMO_LABEL = "R$ 299,99";

/**
 * Não existe balcão de atendimento ao público: o equipamento é sempre coletado
 * e devolvido no endereço do cliente. Texto único usado em todo o site.
 */
export const REGRA_SEM_BALCAO =
  "Não temos balcão de atendimento ao público: o equipamento é sempre coletado e devolvido no seu endereço, com data e horário combinados na triagem.";

/** Quando a coleta substitui a visita — gatilho objetivo de tempo de serviço. */
export const GATILHO_COLETA_SEM_CUSTO =
  "Quando o serviço passa de 1 hora de trabalho técnico, a visita deixa de ser vantajosa e oferecemos coleta e entrega sem custo, com mínimo pré-aprovado de R$ 299,99 — reparos compatíveis dentro desse valor já saem executados.";
