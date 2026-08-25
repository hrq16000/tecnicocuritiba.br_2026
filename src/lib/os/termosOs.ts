/**
 * ============================================================================
 * ORDEM DE SERVIÇO — CLASSIFICAÇÃO E TERMOS
 * ============================================================================
 * Fonte única do texto jurídico exibido e enviado nas ordens de serviço.
 * Dois caminhos possíveis:
 *  - "visita"      → atendimento rápido no endereço (equipamento montado e ligando)
 *  - "laboratorio" → coleta e entrega, bancada, mínimo pré-aprovado
 *
 * Observação de governança: este módulo é a única exceção autorizada ao gate
 * de copy (termo jurídico literal e dado de pagamento), e o dado de pagamento
 * só sai na mensagem privada de WhatsApp — nunca na tela pública.
 */

export const TERMOS_VERSAO = "os-2026-09";

export type TipoAtendimentoOs = "visita" | "laboratorio";

const EQUIPAMENTOS_LABORATORIO = [
  "tv",
  "televis",
  "smart tv",
  "placa",
  "placa-mãe",
  "placa mae",
  "placa mãe",
  "motherboard",
  "som",
  "áudio",
  "audio",
  "receiver",
  "amplificador",
  "monitor",
  "fonte",
  "console",
  "playstation",
  "xbox",
];

const SINTOMAS_LABORATORIO = [
  "não liga",
  "nao liga",
  "não dá vídeo",
  "nao da video",
  "sem imagem",
  "queimou",
  "curto",
  "molhou",
  "caiu água",
  "caiu agua",
  "líquido",
  "liquido",
  "desliga sozinh",
  "cheiro de queimado",
  "tela quebrada",
  "não carrega",
  "nao carrega",
];

const normalizar = (valor: string) => valor.toLowerCase().trim();

/**
 * Classifica o atendimento a partir do equipamento e do sintoma relatado.
 * Eletrônicos de bancada e falhas de energia/hardware vão para laboratório;
 * o restante segue como visita técnica de inspeção.
 */
export function classificarAtendimento(equipamento: string, sintoma: string): TipoAtendimentoOs {
  const eq = normalizar(equipamento);
  const si = normalizar(sintoma);
  if (EQUIPAMENTOS_LABORATORIO.some((t) => eq.includes(t))) return "laboratorio";
  if (SINTOMAS_LABORATORIO.some((t) => si.includes(t))) return "laboratorio";
  return "visita";
}

export const MOTIVO_CLASSIFICACAO: Record<TipoAtendimentoOs, string> = {
  visita:
    "O equipamento está montado e ligando, então o atendimento começa como visita técnica de inspeção no seu endereço.",
  laboratorio:
    "O tipo de equipamento ou a falha relatada exige bancada e ferramenta específica, então o atendimento é com coleta e entrega.",
};

/** Regras obrigatórias da visita técnica de inspeção. */
export const TERMOS_VISITA = {
  titulo: "Visita técnica de inspeção — R$ 99,99",
  escopo: [
    "Válida apenas para equipamentos já montados e ligando.",
    "Cobre até 30 minutos de atendimento — e a cada 30 minutos adicionais.",
    "Serve para reparo rápido (upgrade, atualização, configuração) ou inspeção visual e tátil para avaliação posterior.",
    "Não há garantia de resolução no local: o que não couber no tempo é convertido em coleta.",
    "Peças, componentes, licenças e materiais não estão inclusos.",
  ],
  estacionamento:
    "O solicitante precisa disponibilizar local para estacionar ou reembolsar a despesa de estacionamento do profissional.",
  seguranca: [
    "Sem diálogos durante a execução: dúvidas devem ser tiradas antes do agendamento.",
    "Manter distância da área de trabalho enquanto o atendimento estiver em andamento.",
    "Animais e crianças mantidos a uma distância segura do profissional e dos equipamentos.",
    "Proibido fumar no interior do imóvel ou em local coberto próximo ao atendimento.",
    "Sem ruído alto (TV, rádio, celular) e sem odores fortes durante o atendimento.",
  ],
} as const;

/** Prazos e regras da coleta para laboratório. */
export const TERMOS_LABORATORIO_RESUMO = {
  titulo: "Coleta e entrega para laboratório — mínimo pré-aprovado R$ 299,99",
  itens: [
    "Indicado para eletrônicos: TV, computador que não liga, placa, equipamento de áudio.",
    "Prazo operacional de 2 a 90 dias úteis conforme fila e complexidade.",
    "Cancelamento ou desistência válidos somente se manifestados em até 24 horas após a coleta.",
    "Coleta e entrega inclusas no valor mínimo pré-aprovado.",
    "Peças e componentes não estão inclusos.",
  ],
} as const;

/**
 * Impressora 3D — mínimo pré-aprovado próprio (R$ 500,00).
 * A bancada é dedicada (extrusão, sensoriamento térmico, mecânica de eixos e
 * eletrônica de controle), por isso o mínimo não é o de informática.
 */
export const TERMOS_IMPRESSORA_3D_RESUMO = {
  titulo: "Impressora 3D — mínimo pré-aprovado R$ 500,00",
  itens: [
    "Cobre diagnóstico de bancada, desentupimento de bico, troca de termistor ou resistência, calibração, reparo de placa e upgrades.",
    "Coleta e entrega inclusas no valor mínimo pré-aprovado.",
    "Peças, bicos, hotends, sensores e placas não estão inclusos.",
    "Reparos acima do mínimo pré-aprovado dependem de autorização por escrito.",
    "Cancelamento ou desistência válidos somente em até 24 horas após a coleta.",
    "Sem promessa de qualidade de impressão: o resultado depende de perfil de fatiamento, material e desgaste mecânico do equipamento.",
  ],
} as const;


const PIX_LABORATORIO = "(PIX CNPJ 41.723.708/0001-58 NUBANK)";

/**
 * Termo literal da O.S. de laboratório.
 * `incluirPagamento` só é verdadeiro na mensagem privada de WhatsApp.
 */
export function termosLaboratorio(numeroOs: string, incluirPagamento = false): string {
  const pagamento = incluirPagamento ? `\n${PIX_LABORATORIO}` : "";
  return `O.S: ${numeroOs}

🔎 ⚙️ OBS.: No processo de reparo vamos efetuar os seguintes procedimentos como tentativa de sanar o defeito:
✔️ Reparo no Circuito

Processos inclusos em todos os reparos:
✔️ Banho químico
✔️ Limpeza completa
✔️ Troca de pasta térmica

➡️ VALOR MÍNIMO PRÉ-APROVADO R$ 299,99 — com garantia de 90 dias sobre o reparo.
SE aprovado, pagar o valor inicial de R$ 99,99, que será abatido no valor do reparo; se não sanar o problema, será o custo da tentativa / DIAGNÓSTICO.${pagamento}

✔️ Após diagnóstico é informado o valor final.
✔️ Pasta térmica utilizada: 12.8w/mk Alta Performance

🔎 Este é um ORÇAMENTO.
Trabalhamos com prestadores especializados em várias regiões do Brasil. De acordo com a fila, o equipamento pode ser direcionado para laboratório especializado.
NÃO INCLUSO PEÇAS.

⚠️ ATENÇÃO ⚠️
✔️ Aviso importante (aplicável em caso de reballing):
Caso seja necessário realizar o procedimento de reballing, o equipamento será submetido a altas temperaturas, etapa indispensável para a execução do reparo. Devido ao estado prévio da placa, podem ocorrer danos irreversíveis durante o processo. O procedimento será realizado com equipamento profissional Honton R690, garantindo controle e precisão técnica.

1️⃣ 🔎 Taxa de TENTATIVA de REPARO: caso os processos de reparo não resolvam o problema ou mude o defeito, é cobrada uma TAXA FIXA (por modelo), à vista ou PIX, pelos insumos e pelo tempo dedicado no processo de reparo.
2️⃣ 🔎 Taxa de CANCELAMENTO: após aprovação do ORÇAMENTO ou após 24 horas úteis da coleta: R$ 299,99 (taxa do pré-aprovado MÍNIMO).
Caso não aprove, solicitamos a retirada do seu equipamento VIA COLETA. NÃO REALIZAMOS ENTREGAS EM CASOS DE DESISTÊNCIA, CANCELAMENTO OU ORÇAMENTO NÃO APROVADO.
4️⃣ 🔎 Equipamentos ABANDONADOS: equipamentos que não forem retirados (após aviso via WhatsApp, e-mail ou ligação) serão reciclados após exceder o tempo de armazenamento de 90 dias.
5️⃣ 🔎 TEMPO de REPARO: após aprovação do ORÇAMENTO: 15 a 45 dias.`;
}

export interface DadosOsMensagem {
  protocolo: string;
  tipo: TipoAtendimentoOs;
  nome: string;
  local?: string;
  equipamento: string;
  marcaModelo?: string;
  acessorios?: string;
  sintoma: string;
  modalidadeTitulo: string;
  valorLabel: string;
}

/** Mensagem enxuta e formatada enviada ao WhatsApp. */
export function mensagemWhatsAppOs(os: DadosOsMensagem): string {
  const cabecalho = [
    `*Ordem de serviço ${os.protocolo}*`,
    `Data: ${new Date().toLocaleDateString("pt-BR")}`,
    `Cliente: ${os.nome}`,
    os.local ? `Bairro/cidade: ${os.local}` : "",
    `Equipamento: ${os.equipamento}${os.marcaModelo ? ` (${os.marcaModelo})` : ""}`,
    os.acessorios ? `Acessórios: ${os.acessorios}` : "",
    `Problema: ${os.sintoma}`,
    "",
    `*Atendimento:* ${os.modalidadeTitulo}`,
    `*Valor:* ${os.valorLabel}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (os.tipo === "laboratorio") {
    return `${cabecalho}\n\n${termosLaboratorio(os.protocolo, true)}`;
  }

  const visita = [
    "",
    `*${TERMOS_VISITA.titulo}*`,
    ...TERMOS_VISITA.escopo.map((t) => `• ${t}`),
    "",
    `*Estacionamento:* ${TERMOS_VISITA.estacionamento}`,
    "",
    "*Regras no local:*",
    ...TERMOS_VISITA.seguranca.map((t) => `• ${t}`),
  ].join("\n");

  return `${cabecalho}\n${visita}`;
}
