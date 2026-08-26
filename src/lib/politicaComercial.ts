/**
 * ============================================================================
 * POLÍTICA COMERCIAL — FONTE ÚNICA DE VERDADE (Rodada 4E)
 * ============================================================================
 * Centraliza as regras que aparecem espalhadas em páginas comerciais, locais,
 * FAQs e componentes de confiança: garantia, nota fiscal, backup/dados,
 * processo de atendimento e área de atendimento.
 *
 * GOVERNANÇA (não negociável):
 *  - Nada aqui pode ser inventado. Toda regra publicada precisa refletir a
 *    operação real (valor, ordem de serviço, política publicada).
 *  - Proibido: SLA, prazo garantido, preço recorrente fora da fonte de verdade,
 *    "nota fiscal garantida", certificação/credenciamento sem emissor,
 *    número de clientes, percentual de satisfação, avaliação inventada.
 *  - Divergência entre páginas deve ser resolvida AQUI, e a página passa a
 *    consumir esta fonte.
 */
import { siteConfig } from "@/lib/siteConfig";

/** Anos de atuação calculados — nunca gravar número fixo em componente. */
export function anosDeAtuacao(referencia: Date = new Date()): number {
  return referencia.getFullYear() - Number(siteConfig.foundedYear);
}

/** Rótulo seguro de experiência ("atuação desde 1998"). */
export const experienciaLabel = `Atuação em informática desde ${siteConfig.foundedYear}`;
export const experienciaLabelCurto = `Desde ${siteConfig.foundedYear}`;

// ─────────────────────────────────────────────────────────────
// GARANTIA (Etapa 6)
// ─────────────────────────────────────────────────────────────
export const GARANTIA = {
  /** Regra vigente publicada: mão de obra do serviço executado. */
  servicoDias: 90,
  servicoLabel: "90 dias de garantia sobre a mão de obra do serviço executado",
  /** Peças: sempre a garantia do fornecedor/fabricante, nunca a nossa. */
  pecasLabel: "Peças e componentes seguem a garantia do fornecedor/fabricante",
  /** Registro formal — o que sustenta a garantia. */
  registroLabel:
    "A garantia é registrada por escrito no valor aprovado e no registro do atendimento",
  /** Reparos de natureza limitada (ex.: microssolda/TAB) podem ter cobertura menor. */
  ressalvaLabel:
    "Reparos de natureza limitada (microssolda, reballing, flat cable) podem ter cobertura reduzida — o prazo aplicável é informado por escrito antes da aprovação",
  /** Exclusões reais — usadas em /precos-e-politicas e FAQs. */
  exclusoes: [
    "Mau uso, queda, líquido ou oxidação posterior ao atendimento",
    "Falha diferente da que foi reparada",
    "Dados, arquivos e licenças de software",
    "Nova contaminação por vírus ou instalação feita pelo usuário",
    "Equipamento aberto, adulterado ou reparado por terceiros após o serviço",
    "Oscilação elétrica, surto e problemas de instalação do local",
  ],
} as const;

// ─────────────────────────────────────────────────────────────
// NOTA FISCAL (Etapa 9)
// ─────────────────────────────────────────────────────────────
export const NOTA_FISCAL = {
  servicoLabel: "Nota fiscal de serviço emitida mediante solicitação",
  pecaLabel: "Peças adquiridas acompanham a nota do fornecedor quando aplicável",
  /** Nunca usar "nota fiscal garantida" nem prometer faturamento/boleto. */
  ressalvaLabel:
    "Condições de emissão (dados do tomador, PF ou PJ) são confirmadas antes da conclusão do atendimento",
} as const;

// ─────────────────────────────────────────────────────────────
// PAGAMENTO (bloco público de /precos-e-politicas)
// ─────────────────────────────────────────────────────────────
export const PAGAMENTO = {
  /** Quando se paga — regra real da operação. */
  momentoLabel:
    "O pagamento acontece na conclusão do atendimento, depois que o serviço aprovado foi executado e testado com você",
  aprovacaoLabel:
    "Nenhum valor é cobrado sem aprovação prévia: o escopo e o valor são apresentados antes da execução",
  formasLabel:
    "As formas de pagamento aceitas são confirmadas na triagem pelo WhatsApp e reconfirmadas no fechamento do atendimento",
  pecasLabel:
    "Peças e componentes são cobrados à parte do valor do serviço e só entram na conta após a sua autorização",
  desistenciaLabel:
    "Em caso de desistência após o diagnóstico, é devido apenas o valor do diagnóstico informado antes",
  /** Antifraude — regra de segurança, não promessa comercial. */
  seguraLabel:
    "Não solicitamos pagamento antecipado por links enviados de números desconhecidos nem depósito em conta de terceiros. Na dúvida, confirme pelo WhatsApp oficial do site",
} as const;

// ─────────────────────────────────────────────────────────────
// SUPORTE GERENCIADO PARA EMPRESAS
// ─────────────────────────────────────────────────────────────
// Valores e condição mínima confirmados para a operação em 26/08/2026.
// Todo plano é delimitado: visita, licença, peça, nuvem e projeto que não
// estejam escritos no escopo são avaliados separadamente.
export const SUPORTE_GERENCIADO = {
  minimoEquipamentos: 4,
  unidadeCobranca: "por computador gerenciado, por mês",
  planos: [
    {
      nome: "Essencial",
      valorLabel: "R$ 69,99",
      valorMensalPorMaquina: 69.99,
      destaque: "Base para equipes pequenas",
      recursos: [
        "Triagem e suporte remoto para as estações cadastradas",
        "Registro dos atendimentos e orientações para a equipe",
        "Inventário inicial dos computadores incluídos",
        "Revisão de atualizações e cuidados preventivos em rotina combinada",
      ],
    },
    {
      nome: "Pro",
      valorLabel: "R$ 99,99",
      valorMensalPorMaquina: 99.99,
      destaque: "Para operação que já depende da TI diariamente",
      recursos: [
        "Tudo do Essencial",
        "Rotina preventiva planejada para os equipamentos cadastrados",
        "Acompanhamento de incidentes recorrentes e recomendações de correção",
        "Organização técnica do ambiente para reduzir retrabalho nas próximas solicitações",
      ],
    },
    {
      nome: "Premium",
      valorLabel: "R$ 199,00",
      valorMensalPorMaquina: 199,
      destaque: "Para ambientes que exigem escopo ampliado",
      recursos: [
        "Tudo do Pro",
        "Revisão periódica de continuidade, rede e cópia dos dados dentro do escopo contratado",
        "Acompanhamento preventivo acordado para ativos compatíveis",
        "Planejamento técnico para mudanças de equipamentos e crescimento da equipe",
      ],
    },
  ],
  exclusoesLabel:
    "Visitas presenciais, peças, licenças, equipamentos de rede, serviços em nuvem, recuperação de dados, servidores e projetos fora do escopo são avaliados separadamente.",
  limitesLabel:
    "Os planos não representam plantão 24 horas, suporte ilimitado ou prazo de resposta garantido. Horários, itens atendidos e responsabilidades ficam registrados na contratação.",
} as const;


// ─────────────────────────────────────────────────────────────
// DADOS, BACKUP E PRIVACIDADE (Etapa 7)
// ─────────────────────────────────────────────────────────────
export const POLITICA_DADOS = [
  "O backup prévio é responsabilidade do cliente. Quando não existir, avisamos antes de qualquer intervenção que possa afetar os dados.",
  "Formatação, reinstalação e reparo de disco envolvem risco real de perda. O risco é informado e precisa ser aceito antes da execução.",
  "Recuperação de dados não tem resultado garantido. Avaliamos, explicamos as chances e trabalhamos para não piorar o estado da mídia.",
  "O acesso ao equipamento é limitado ao necessário para o diagnóstico e o reparo. Não navegamos por arquivos pessoais sem necessidade técnica.",
  "Não solicitamos senhas em formulários públicos nem por canais não oficiais. Quando o acesso exigir senha, ela é informada diretamente ao técnico e pode ser trocada depois.",
  "No atendimento remoto, a sessão é autorizada por você a cada acesso, acompanhada em tempo real na sua tela e encerrada ao final.",
  "Mídias danificadas podem exigir apoio de laboratório de terceiros — nesse caso, o envio só ocorre com sua autorização expressa.",
  "Peças substituídas e mídias são devolvidas ao cliente ou descartadas mediante autorização.",
] as const;

// ─────────────────────────────────────────────────────────────
// PROCESSO DE ATENDIMENTO (Etapa 8)
// ─────────────────────────────────────────────────────────────
export interface EtapaProcesso {
  titulo: string;
  descricao: string;
}

export const PROCESSO_ATENDIMENTO: EtapaProcesso[] = [
  { titulo: "Solicitação e triagem", descricao: "Você descreve o problema pelo WhatsApp. Identificamos se é atendimento residencial ou empresarial e qual modalidade se aplica." },
  { titulo: "Classificação do atendimento", descricao: "Definimos a modalidade: remoto, no endereço, coleta e entrega ou bancada." },
  { titulo: "Avaliação ou diagnóstico", descricao: "Verificação técnica do equipamento antes de qualquer execução. Nada é reparado antes de entender a causa." },
  { titulo: "Valor e aprovação", descricao: "Escopo e valor registrados por escrito. Nenhum serviço adicional é executado sem sua aprovação." },
  { titulo: "Execução", descricao: "Serviço realizado dentro do escopo aprovado. Mudança de escopo volta para aprovação." },
  { titulo: "Testes", descricao: "Verificação do que foi reparado, incluindo estabilidade quando o caso exigir." },
  { titulo: "Entrega ou conclusão", descricao: "Devolução ou encerramento do atendimento com o registro do que foi feito." },
  { titulo: "Garantia e acompanhamento", descricao: `${GARANTIA.servicoLabel}. ${GARANTIA.pecasLabel}.` },
];

/** Diferenças reais por modalidade — evita prometer prazo único. */
export const PROCESSO_POR_MODALIDADE = {
  remoto: "Diagnóstico e execução na mesma sessão autorizada, apenas para casos de software e configuração.",
  domicilio: "Avaliação no endereço, valor informado na hora e execução após aprovação. Casos que exigem bancada são convertidos em coleta.",
  coleta: "Retirada, avaliação em bancada, valor por escrito, execução após aprovação e devolução.",
  bancada: "Casos que exigem ferramenta de bancada: prazo depende da disponibilidade de peça e da complexidade, informado após a avaliação.",
  empresarial: "Triagem por chamado, priorização combinada com o responsável e registro do que foi executado. Para quatro ou mais computadores, há planos mensais por máquina com escopo definido.",
} as const;

// ─────────────────────────────────────────────────────────────
// ÁREA DE ATENDIMENTO (Etapa 10)
// ─────────────────────────────────────────────────────────────
export const AREA_ATENDIMENTO = {
  /** Cidade-sede da operação — nenhuma outra é filial. */
  sede: siteConfig.primaryCity,
  /** Cidades promovidas com página própria indexável. */
  cidadesPromovidas: [
    "Curitiba",
    "São José dos Pinhais",
    "Pinhais",
    "Colombo",
    "Araucária",
    "Campo Largo",
  ],
  /** Demais localidades: atendidas mediante consulta, sem página promovida. */
  sobConsultaLabel:
    "Demais municípios da Região Metropolitana de Curitiba são atendidos mediante consulta de agenda e deslocamento — sem unidade física no local.",
  /** Nunca usar "toda a região" sem esta definição ao lado. */
  disclaimer:
    "Atendemos a partir de Curitiba. Não mantemos filial, loja ou laboratório em outras cidades ou bairros.",
} as const;

export default {
  GARANTIA,
  NOTA_FISCAL,
  PAGAMENTO,
  SUPORTE_GERENCIADO,
  POLITICA_DADOS,
  PROCESSO_ATENDIMENTO,
  PROCESSO_POR_MODALIDADE,
  AREA_ATENDIMENTO,
};
