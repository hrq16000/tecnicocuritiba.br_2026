/**
 * DEDUPLICAÇÃO DE CONVERSÕES POR SESSÃO (lead_id)
 * ───────────────────────────────────────────────
 * Fonte única do `lead_id` usado por GA4 (`generate_lead`, `transaction_id`)
 * e pela conversão do Google Ads. Regra:
 *
 *   • 1 lead_id por (sessão × tipo de CTA) — persistido em sessionStorage;
 *   • `generate_lead` + conversão do Ads disparam SOMENTE quando o lead_id
 *     é criado (primeiro clique da sessão);
 *   • cliques seguintes continuam gerando `cta_click`/`wa_click` (engajamento)
 *     com o MESMO lead_id, então o Ads não conta clique duplicado;
 *   • um clique repetido em menos de 1,2s (bubbling, Strict Mode, double click)
 *     é descartado antes mesmo de virar evento.
 *
 * Todos os pontos de conversão (analytics.ts e funnelAnalytics.ts) devem usar
 * este módulo — nunca reimplementar o mapa de leads localmente.
 */
export type LeadCtaType = "whatsapp" | "phone" | "chatbot";

const LEAD_KEY = "lead_dedup_v1";
const BURST_MS = 1200;

type LeadMap = Partial<Record<LeadCtaType, string>>;

const readLeadMap = (): LeadMap => {
  try {
    return JSON.parse(sessionStorage.getItem(LEAD_KEY) || "{}") as LeadMap;
  } catch {
    return {};
  }
};

const writeLeadMap = (m: LeadMap) => {
  try {
    sessionStorage.setItem(LEAD_KEY, JSON.stringify(m));
  } catch {
    /* noop */
  }
};

/** Retorna o lead_id da sessão para o tipo de CTA, criando-o se necessário. */
export const ensureLeadId = (ctaType: LeadCtaType): { leadId: string; isNew: boolean } => {
  const map = readLeadMap();
  if (map[ctaType]) return { leadId: map[ctaType]!, isNew: false };
  const leadId = `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  map[ctaType] = leadId;
  writeLeadMap(map);
  return { leadId, isNew: true };
};

/** Só para testes/diagnóstico: limpa os leads da sessão. */
export const resetLeadDedup = () => {
  try {
    sessionStorage.removeItem(LEAD_KEY);
    sessionStorage.removeItem(BURST_KEY);
  } catch {
    /* noop */
  }
};

const BURST_KEY = "lead_burst_v1";

/**
 * `true` quando o mesmo clique lógico já foi contabilizado há menos de 1,2s.
 * Evita duplicidade quando o handler é disparado por bubbling ou re-render.
 * O estado vive em sessionStorage: limpar a sessão zera a janela de burst.
 */
export const isDuplicateBurst = (key: string, windowMs = BURST_MS): boolean => {
  const now = Date.now();
  let map: Record<string, number> = {};
  try {
    map = JSON.parse(sessionStorage.getItem(BURST_KEY) || "{}") as Record<string, number>;
  } catch {
    map = {};
  }
  const prev = map[key];
  map[key] = now;
  try {
    sessionStorage.setItem(BURST_KEY, JSON.stringify(map));
  } catch {
    /* noop */
  }
  return typeof prev === "number" && now - prev < windowMs;
};
