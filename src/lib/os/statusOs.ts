// ─────────────────────────────────────────────────────────────
// MÁQUINA DE ESTADOS E CÁLCULO FINANCEIRO DA ORDEM DE SERVIÇO
// Camada pura (sem I/O) — usada pelo painel admin, pelos server
// functions e pelos testes. Nenhum valor é inventado aqui: todo
// número vem do operador; o módulo só soma de forma determinística.
// ─────────────────────────────────────────────────────────────

export const OS_STATUS = [
  "ABERTA",
  "AGUARDANDO_DIAGNOSTICO",
  "PROPOSTA_ENVIADA",
  "AGUARDANDO_APROVACAO",
  "APROVADA",
  "EM_ATENDIMENTO",
  "AGUARDANDO_PECA",
  "CONCLUIDA",
  "ENTREGUE",
  "CANCELADA",
] as const;

export type OsStatus = (typeof OS_STATUS)[number];

export const OS_STATUS_LABEL: Record<OsStatus, string> = {
  ABERTA: "Aberta",
  AGUARDANDO_DIAGNOSTICO: "Aguardando diagnóstico",
  PROPOSTA_ENVIADA: "Proposta enviada",
  AGUARDANDO_APROVACAO: "Aguardando aprovação",
  APROVADA: "Aprovada",
  EM_ATENDIMENTO: "Em atendimento",
  AGUARDANDO_PECA: "Aguardando peça",
  CONCLUIDA: "Concluída",
  ENTREGUE: "Entregue",
  CANCELADA: "Cancelada",
};

/** Transições permitidas. Cancelar é possível de qualquer estado aberto. */
const TRANSICOES: Record<OsStatus, OsStatus[]> = {
  ABERTA: ["AGUARDANDO_DIAGNOSTICO", "EM_ATENDIMENTO", "CANCELADA"],
  AGUARDANDO_DIAGNOSTICO: ["PROPOSTA_ENVIADA", "EM_ATENDIMENTO", "CANCELADA"],
  PROPOSTA_ENVIADA: ["AGUARDANDO_APROVACAO", "APROVADA", "CANCELADA"],
  AGUARDANDO_APROVACAO: ["APROVADA", "CANCELADA"],
  APROVADA: ["EM_ATENDIMENTO", "AGUARDANDO_PECA", "CANCELADA"],
  EM_ATENDIMENTO: ["AGUARDANDO_PECA", "CONCLUIDA", "CANCELADA"],
  AGUARDANDO_PECA: ["EM_ATENDIMENTO", "CONCLUIDA", "CANCELADA"],
  CONCLUIDA: ["ENTREGUE"],
  ENTREGUE: [],
  CANCELADA: [],
};

export function ehStatusOs(valor: string): valor is OsStatus {
  return (OS_STATUS as readonly string[]).includes(valor);
}

export function proximosStatus(atual: OsStatus): OsStatus[] {
  return TRANSICOES[atual] ?? [];
}

export function transicaoPermitida(de: OsStatus, para: OsStatus): boolean {
  if (de === para) return false;
  return proximosStatus(de).includes(para);
}

export const OS_PAGAMENTO = ["pendente", "parcial", "pago", "isento"] as const;
export type OsPagamento = (typeof OS_PAGAMENTO)[number];

export interface OsPeca {
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface OsValoresEntrada {
  valorServicos: number;
  pecas: OsPeca[];
  desconto: number;
}

export interface OsValores {
  valorServicos: number;
  valorPecas: number;
  desconto: number;
  total: number;
}

const centavos = (n: number) => Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;

/**
 * Soma determinística: serviços + peças − desconto. Nunca negativo.
 * Lança quando o desconto excede o subtotal (erro de digitação do operador).
 */
export function calcularValores(entrada: OsValoresEntrada): OsValores {
  const valorServicos = centavos(Math.max(0, entrada.valorServicos));
  const valorPecas = centavos(
    (entrada.pecas ?? []).reduce(
      (acc, p) => acc + Math.max(0, p.quantidade || 0) * Math.max(0, p.valorUnitario || 0),
      0,
    ),
  );
  const subtotal = centavos(valorServicos + valorPecas);
  const desconto = centavos(Math.max(0, entrada.desconto));
  if (desconto > subtotal) {
    throw new Error("Desconto maior que o subtotal da ordem de serviço.");
  }
  return { valorServicos, valorPecas, desconto, total: centavos(subtotal - desconto) };
}

export const formatarBRL = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
