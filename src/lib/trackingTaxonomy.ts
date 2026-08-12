// ─────────────────────────────────────────────────────────────
// TAXONOMIA ÚNICA DE TRACKING (GA4 + Google Ads + UTMs)
// Fonte única de verdade para nomes de eventos, utm_source/medium
// e normalização de `click_location`. Qualquer novo CTA deve usar
// estas constantes — nomes livres quebram os relatórios.
// ─────────────────────────────────────────────────────────────

/** Nomes canônicos de eventos GA4. */
export const GA4_EVENTS = {
  ctaClick: "cta_click",
  whatsapp: "click_whatsapp",
  call: "click_call",
  lead: "generate_lead",
  adsConversion: "conversion",
  funnelOpen: "funnel_open",
  funnelSubmit: "funnel_submit",
  faqToggle: "faq_toggle",
  fileDownload: "file_download",
  internalLink: "internal_link_click",
} as const;



/** utm_source padrão quando o visitante não veio de campanha externa. */
export const DEFAULT_UTM_SOURCE = "site";

/** utm_medium canônicos — todo CTA cai em um destes. */
export const UTM_MEDIUMS = [
  "header",
  "footer",
  "float",
  "hero",
  "modal",
  "funnel",
  "cta",
] as const;
export type UtmMedium = (typeof UTM_MEDIUMS)[number];

/** Normaliza qualquer rótulo para snake_case ASCII estável. */
export function normalizeTrackingLabel(raw: string | undefined | null): string {
  if (!raw) return "desconhecido";
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "desconhecido";
}

/** Garante que o medium enviado é um dos canônicos. */
export function normalizeUtmMedium(raw: string | undefined | null): UtmMedium {
  const v = normalizeTrackingLabel(raw) as UtmMedium;
  return (UTM_MEDIUMS as readonly string[]).includes(v) ? v : "cta";
}

/** utm_campaign derivado da rota atual (ex.: servicos_formatacao). */
export function campaignFromPath(pathname: string): string {
  const path = pathname.replace(/^\/+|\/+$/g, "") || "home";
  return normalizeTrackingLabel(path.replace(/\//g, "_")) || "home";
}

/**
 * Tipo de rota para segmentar conversão real no GA4/Ads.
 * home | pf | pj | servico | local | institucional | outro
 */
export type RouteType =
  | "home"
  | "pf"
  | "pj"
  | "servico"
  | "local"
  | "institucional"
  | "outro";

export function routeTypeFromPath(pathname: string): RouteType {
  const p = (pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
  if (p === "/") return "home";
  if (/(empresa|empresas|corporativ|pj|suporte-empresas|ti-curitiba)/.test(p)) return "pj";
  if (/(pessoa-fisica|residencial|domicilio|pf)\b/.test(p)) return "pf";
  if (/^\/(servicos|servico|arrumar-pc|problemas|marcas|cftv)/.test(p)) return "servico";
  if (/^\/(bairros?|tecnico-informatica-|assistencia-tecnica-)/.test(p)) return "local";
  if (
    /^\/(sobre|contato|faq|blog|precos-e-politicas|termos-e-condicoes|politica-privacidade|como-funciona|ordem-de-servico|seja-parceiro|status)/.test(
      p,
    )
  )
    return "institucional";
  return "outro";
}

/**
 * Faixa de viewport para segmentar conversão mobile nos relatórios GA4
 * (360 / 390 / 430 são os alvos de QA das páginas empresariais).
 */
export function viewportBucket(w: number): string {
  if (!w) return "unknown";
  if (w <= 375) return "360";
  if (w <= 400) return "390";
  if (w < 768) return "430";
  if (w < 1024) return "tablet";
  return "desktop";
}
