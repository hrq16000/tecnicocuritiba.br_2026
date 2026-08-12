import { GA4_EVENTS, normalizeTrackingLabel, routeTypeFromPath, viewportBucket } from '@/lib/trackingTaxonomy';


// Google Analytics & Ads tracking utilities — no UI imports here to keep the first load lean.

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    __lastCtaLocation?: string;
    __lastCtaType?: 'whatsapp' | 'phone' | 'chatbot';
  }
}

const GA4_ID = 'G-B9VPHCZC10';
const ADS_ID = 'AW-17892118207';
const ADS_CONVERSION_LABEL = 'AW-17892118207/i5jSCMqi1JYcEL-d0NNC';

// Google Ads conversion with callback (mirrors gtag_report_conversion snippet)
export const gtagReportConversion = (url?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const callback = () => {
      if (url) {
        window.location.href = url;
      }
    };
    window.gtag('event', 'conversion', {
      send_to: ADS_CONVERSION_LABEL,
      value: 1.0,
      currency: 'BRL',
      event_callback: callback,
    });
  } else if (url) {
    window.location.href = url;
  }
};

// Read UTM params from current URL (set by Ads autotag / SEO campaigns)
const getUtmContext = () => {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get('utm_source') || undefined,
    utm_medium: p.get('utm_medium') || undefined,
    utm_campaign: p.get('utm_campaign') || undefined,
    utm_term: p.get('utm_term') || undefined,
    utm_content: p.get('utm_content') || undefined,
    gclid: p.get('gclid') || undefined,
  };
};

// Device dimension: habilita relatório "conversões/CTR por dispositivo" no GA4
// (mobile/tablet/desktop), inferido por largura + ponteiro coarse.
const getDeviceContext = () => {
  if (typeof window === 'undefined')
    return { device: 'unknown' as const, viewport_width: 0, viewport_bucket: 'unknown' };
  const w = window.innerWidth || document.documentElement.clientWidth || 0;
  const coarse = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  const device = w < 768 || coarse ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
  return { device, viewport_width: w, viewport_bucket: viewportBucket(w) };
};

// Lead dedup: gera/persiste um ID por sessão por tipo de CTA para evitar
// múltiplos `generate_lead` na mesma sessão (clicar 2x no WhatsApp = 1 lead).
const LEAD_KEY = 'lead_dedup_v1';
type LeadMap = Partial<Record<'whatsapp' | 'phone' | 'chatbot', string>>;
const readLeadMap = (): LeadMap => {
  try { return JSON.parse(sessionStorage.getItem(LEAD_KEY) || '{}') as LeadMap; } catch { return {}; }
};
const writeLeadMap = (m: LeadMap) => {
  try { sessionStorage.setItem(LEAD_KEY, JSON.stringify(m)); } catch { /* noop */ }
};
const ensureLeadId = (ctaType: 'whatsapp' | 'phone' | 'chatbot'): { leadId: string; isNew: boolean } => {
  const map = readLeadMap();
  if (map[ctaType]) return { leadId: map[ctaType]!, isNew: false };
  const leadId = `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  map[ctaType] = leadId;
  writeLeadMap(map);
  return { leadId, isNew: true };
};

// Track CTA clicks for conversions
export const trackCTAClick = (ctaType: 'whatsapp' | 'phone' | 'chatbot', rawLocation: string) => {
  // Padroniza o rótulo: sem acento, snake_case — relatórios GA4/Ads consistentes.
  const location = normalizeTrackingLabel(rawLocation);
  if (typeof window !== 'undefined') {
    window.__lastCtaType = ctaType;
    window.__lastCtaLocation = location;
    (window as unknown as { __ctaTracked?: { type: string; location: string; t: number } }).__ctaTracked = {
      type: ctaType,
      location,
      t: Date.now(),
    };
  }
  if (typeof window !== 'undefined' && window.gtag) {
    const utm = getUtmContext();
    const deviceCtx = getDeviceContext();
    const { leadId, isNew } = ensureLeadId(ctaType);
    const appVersion = (window as unknown as { __APP_VERSION__?: string }).__APP_VERSION__ || 'dev';
    const payload = {
      event_category: 'engagement',
      event_label: `${ctaType}_${location}`,
      cta_type: ctaType,
      cta_location: location,
      click_location: location,
      page_path: window.location.pathname,
      // Segmenta conversão real por tipo de rota (home/pf/pj/servico/local).
      route_type: routeTypeFromPath(window.location.pathname),
      value: 1,
      lead_id: leadId,
      app_version: appVersion,
      ...deviceCtx,
      ...utm,
    };

    // cta_click sempre dispara (mede CTR / engajamento por dispositivo)
    window.gtag('event', GA4_EVENTS.ctaClick, payload);

    // Eventos GA4 nomeados — facilitam Key Events e relatórios por dispositivo.
    if (ctaType === 'whatsapp') {
      window.gtag('event', GA4_EVENTS.whatsapp, payload);
    } else if (ctaType === 'phone') {
      window.gtag('event', GA4_EVENTS.call, payload);
    }

    // generate_lead + conversão do Ads disparam APENAS no primeiro clique da
    // sessão (dedup via lead_id em sessionStorage). Cliques repetidos viram
    // engajamento (cta_click) e não contam como novo lead/conversão.
    if (isNew && (ctaType === 'whatsapp' || ctaType === 'phone')) {
      window.gtag('event', GA4_EVENTS.lead, {
        ...payload,
        currency: 'BRL',
        method: ctaType,
        // transaction_id deduplica o evento no GA4 caso o usuário recarregue.
        transaction_id: leadId,
      });
      gtagReportConversion();
    }

    // Visual debug for WhatsApp clicks (dev or ?debug_utm=1)
    if (ctaType === 'whatsapp') {
      const debugFlag =
        (import.meta as any).env?.DEV ||
        (typeof window !== 'undefined' &&
          (new URLSearchParams(window.location.search).get('debug_utm') === '1' ||
            window.localStorage.getItem('debug_utm') === '1'));
      // Console always for diagnostics
      // eslint-disable-next-line no-console
      console.log('[GA4 cta_click → WhatsApp]', payload);
      if (debugFlag) console.info('[GA4 debug]', { ...utm, location });
    }
  }
};

/**
 * Engajamento com a FAQ (abrir/fechar pergunta) — medido ANTES do WhatsApp/ligação.
 * Inclui route_type e o contexto de UTM/dispositivo, igual aos eventos de CTA.
 */
export const trackFaqToggle = (
  question: string,
  action: 'open' | 'close',
  section = 'faq',
  index?: number,
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  const payload = {
    event_category: 'engagement',
    event_label: `${section}_${normalizeTrackingLabel(question)}`,
    faq_action: action,
    faq_question: question.slice(0, 100),
    faq_section: normalizeTrackingLabel(section),
    ...(typeof index === 'number' ? { faq_index: index + 1 } : {}),
    page_path: window.location.pathname,
    route_type: routeTypeFromPath(window.location.pathname),
    ...getDeviceContext(),
    ...getUtmContext(),
  };
  window.gtag('event', GA4_EVENTS.faqToggle, payload);
};

/**
 * Download de arquivo (ex.: mídia kit em PDF).
 * Não é lead nem conversão do Ads — é engajamento comercial, medido por
 * `cta_location` para comparar CTA principal x rodapé.
 * Respeita o Consent Mode v2: só chega ao GA4 quando `window.gtag` existe e
 * o consentimento de analytics foi concedido (gtag ignora eventos negados).
 */
export const trackFileDownload = (fileName: string, rawLocation: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  const location = normalizeTrackingLabel(rawLocation);
  window.gtag('event', GA4_EVENTS.fileDownload, {
    event_category: 'engagement',
    event_label: `${normalizeTrackingLabel(fileName)}_${location}`,
    file_name: fileName,
    file_extension: fileName.split('.').pop() || '',
    cta_location: location,
    click_location: location,
    page_path: window.location.pathname,
    route_type: routeTypeFromPath(window.location.pathname),
    ...getDeviceContext(),
    ...getUtmContext(),
  });
};

/**
 * Clique em link interno de navegação (ex.: cards de "próximos problemas").
 * NÃO é lead nem conversão do Ads — serve para medir crawl/navegação entre
 * páginas de sintoma e não interfere na deduplicação por `lead_id`.
 */
export const trackInternalLink = (target: string, section: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', GA4_EVENTS.internalLink, {
    event_category: 'navigation',
    event_label: `${normalizeTrackingLabel(section)}_${normalizeTrackingLabel(target)}`,
    link_target: target,
    link_section: normalizeTrackingLabel(section),
    page_path: window.location.pathname,
    route_type: routeTypeFromPath(window.location.pathname),
    non_interaction: true,
    ...getDeviceContext(),
    ...getUtmContext(),
  });
};

// Track page views

export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_ID, {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};

