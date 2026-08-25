// ─────────────────────────────────────────────────────────────
// GATILHOS DE NOTIFICAÇÃO POR MUDANÇA DE STATUS DA O.S.
// Camada pura (sem I/O). Nada é enviado automaticamente ao cliente:
// o gatilho apenas cria um LEMBRETE interno para o operador abrir o
// deep link do WhatsApp manualmente (evento MESSAGE_PREPARED).
// ─────────────────────────────────────────────────────────────
import type { OsStatus } from "./statusOs";
import type { OsTemplate } from "./whatsappOs";

export interface GatilhoOs {
  /** Tipo do lembrete criado (chave de idempotência por ordem). */
  tipo: string;
  /** Template de WhatsApp sugerido para o operador. */
  template: OsTemplate;
  /** Atraso sugerido, em minutos, a partir da transição. */
  atrasoMinutos: number;
  observacao: string;
}

/**
 * Marcos operacionais que geram lembrete automático:
 *  • após coleta / início de atendimento;
 *  • após diagnóstico com proposta;
 *  • quando o equipamento fica pronto para entrega.
 */
export const GATILHOS_STATUS: Partial<Record<OsStatus, GatilhoOs>> = {
  EM_ATENDIMENTO: {
    tipo: "AVISAR_EM_ATENDIMENTO",
    template: "EM_ATENDIMENTO",
    atrasoMinutos: 0,
    observacao: "Equipamento coletado/em bancada — avisar o cliente pelo WhatsApp.",
  },
  PROPOSTA_ENVIADA: {
    tipo: "AVISAR_PROPOSTA",
    template: "PROPOSTA_DISPONIVEL",
    atrasoMinutos: 0,
    observacao: "Diagnóstico concluído — enviar a proposta ao cliente.",
  },
  AGUARDANDO_APROVACAO: {
    tipo: "COBRAR_APROVACAO",
    template: "SOLICITAR_APROVACAO",
    atrasoMinutos: 24 * 60,
    observacao: "Sem retorno do cliente em 24h — reforçar pedido de aprovação.",
  },
  AGUARDANDO_PECA: {
    tipo: "AVISAR_PECA",
    template: "AGUARDANDO_PECA",
    atrasoMinutos: 0,
    observacao: "Serviço parado aguardando peça — informar o cliente.",
  },
  CONCLUIDA: {
    tipo: "AVISAR_PRONTO",
    template: "DISPONIVEL_RETIRADA",
    atrasoMinutos: 0,
    observacao: "Serviço concluído — combinar entrega com o cliente.",
  },
};

/** Gatilho aplicável a uma transição, se houver. */
export function gatilhoParaStatus(status: OsStatus): GatilhoOs | null {
  return GATILHOS_STATUS[status] ?? null;
}
