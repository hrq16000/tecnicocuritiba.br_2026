// ─────────────────────────────────────────────────────────────
// TEMPLATES DE WHATSAPP POR ORDEM DE SERVIÇO
// Regras duras:
//  • só variáveis permitidas entram na mensagem;
//  • variável ausente = a linha inteira some (nunca "undefined"/"—");
//  • nada é enviado automaticamente: geramos deep link wa.me e o
//    evento registrado é MESSAGE_PREPARED, jamais MESSAGE_SENT.
// ─────────────────────────────────────────────────────────────
import { formatarBRL } from "./statusOs";

export const OS_TEMPLATES = [
  "PROPOSTA_DISPONIVEL",
  "SOLICITAR_APROVACAO",
  "EM_ATENDIMENTO",
  "AGUARDANDO_PECA",
  "SERVICO_CONCLUIDO",
  "DISPONIVEL_RETIRADA",
  "LEMBRETE_RETIRADA",
] as const;

export type OsTemplate = (typeof OS_TEMPLATES)[number];

export const OS_TEMPLATE_LABEL: Record<OsTemplate, string> = {
  PROPOSTA_DISPONIVEL: "Proposta disponível",
  SOLICITAR_APROVACAO: "Solicitar aprovação",
  EM_ATENDIMENTO: "Equipamento em atendimento",
  AGUARDANDO_PECA: "Aguardando peça",
  SERVICO_CONCLUIDO: "Serviço concluído",
  DISPONIVEL_RETIRADA: "Disponível para entrega",
  LEMBRETE_RETIRADA: "Lembrete de entrega",
};

/** Único conjunto de variáveis que um template pode consumir. */
export interface OsTemplateVars {
  protocolo: string;
  primeiroNome?: string | null;
  equipamento?: string | null;
  marcaModelo?: string | null;
  diagnostico?: string | null;
  servicoExecutado?: string | null;
  total?: number | null;
  previsao?: string | null;
}

const linha = (rotulo: string, valor?: string | null) => {
  const v = (valor ?? "").toString().trim();
  return v ? `${rotulo}: ${v}` : null;
};

const equipamentoTexto = (v: OsTemplateVars) =>
  [v.equipamento, v.marcaModelo].map((x) => (x ?? "").trim()).filter(Boolean).join(" ") || null;

const saudacao = (v: OsTemplateVars) => {
  const nome = (v.primeiroNome ?? "").trim().split(/\s+/)[0];
  return nome ? `Olá, ${nome}!` : "Olá!";
};

const totalTexto = (v: OsTemplateVars) =>
  typeof v.total === "number" && v.total > 0 ? formatarBRL(v.total) : null;

const CORPO: Record<OsTemplate, (v: OsTemplateVars) => (string | null)[]> = {
  PROPOSTA_DISPONIVEL: (v) => [
    "Terminamos a avaliação técnica e a proposta de reparo já está pronta.",
    linha("Diagnóstico", v.diagnostico),
    linha("Valor do reparo", totalTexto(v)),
    "Se estiver de acordo, é só confirmar por aqui que damos sequência.",
  ],
  SOLICITAR_APROVACAO: (v) => [
    "Estamos aguardando sua confirmação para iniciar o reparo.",
    linha("Diagnóstico", v.diagnostico),
    linha("Valor do reparo", totalTexto(v)),
    "Sem sua aprovação nada é executado.",
  ],
  EM_ATENDIMENTO: (v) => [
    "Seu equipamento já está em atendimento na bancada.",
    linha("Serviço em execução", v.servicoExecutado),
    linha("Previsão", v.previsao),
  ],
  AGUARDANDO_PECA: (v) => [
    "O serviço está em andamento e aguardamos a chegada da peça necessária.",
    linha("Serviço", v.servicoExecutado),
    linha("Previsão", v.previsao),
    "Assim que a peça chegar, retomamos e aviso por aqui.",
  ],
  SERVICO_CONCLUIDO: (v) => [
    "O serviço foi concluído.",
    linha("Serviço executado", v.servicoExecutado),
    linha("Valor", totalTexto(v)),
  ],
  DISPONIVEL_RETIRADA: (v) => [
    "Seu equipamento está pronto e disponível para entrega.",
    linha("Serviço executado", v.servicoExecutado),
    linha("Valor", totalTexto(v)),
    "Me diga o melhor dia e horário que combinamos a entrega.",
  ],
  LEMBRETE_RETIRADA: () => [
    "Passando para lembrar que seu equipamento está pronto e aguardando a entrega.",
    "Me confirme o melhor dia e horário, por favor.",
  ],
};

const PLACEHOLDERS = /(undefined|null|NaN|\{\{|\}\}|—\s*$)/im;

/** Monta a mensagem final. Nunca devolve placeholder ou dado inventado. */
export function montarMensagemOs(template: OsTemplate, vars: OsTemplateVars): string {
  const partes = [
    saudacao(vars),
    `Ordem de serviço ${vars.protocolo}.`,
    linha("Equipamento", equipamentoTexto(vars)),
    "",
    ...CORPO[template](vars),
  ].filter((l): l is string => l !== null);

  const texto = partes.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (PLACEHOLDERS.test(texto)) {
    throw new Error("Mensagem contém placeholder inválido — revise os dados da O.S.");
  }
  return texto;
}

/** Deep link wa.me. Telefone é normalizado para dígitos com DDI brasileiro. */
export function linkWhatsAppOs(telefone: string, mensagem: string): string | null {
  const digitos = (telefone ?? "").replace(/\D/g, "");
  if (digitos.length < 10) return null;
  const comDdi = digitos.startsWith("55") ? digitos : `55${digitos}`;
  return `https://wa.me/${comDdi}?text=${encodeURIComponent(mensagem)}`;
}
