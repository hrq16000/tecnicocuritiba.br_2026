/**
 * FONTE ÚNICA DA POLÍTICA DE HEADERS DE SEGURANÇA (Prompt 12).
 *
 * Consumidores:
 *   - public/_headers                       (hosts que honram _headers)
 *   - cloudflare/worker.js                  (camada de borda em produção)
 *   - scripts/check-security-headers.ts     (gate estático + antidrift)
 *   - scripts/check-security-headers.mjs    (gate runtime pós-deploy)
 *
 * Nunca duplicar a política em outra camada: importar daqui.
 *
 * A CSP desta rodada é REPORT-ONLY — observa violações sem bloquear.
 * A proteção efetiva contra framing vem de X-Frame-Options: DENY.
 */

/** Projeto Supabase (Lovable Cloud) — REST, Auth, Realtime e edge functions. */
const SUPABASE = "https://hisepaayuwxjrnumbqeq.supabase.co";
const SUPABASE_WS = "wss://hisepaayuwxjrnumbqeq.supabase.co";

/**
 * Cada origem abaixo tem consumidor real verificado no código.
 * Não adicionar origem sem apontar o arquivo que a consome.
 */
export const CSP_DIRECTIVES = {
  // Tudo o que não for explicitado cai no próprio domínio.
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  // Nenhuma página do portal é embutida legitimamente em iframe de terceiros.
  "frame-ancestors": ["'none'"],
  // Formulários postam no próprio site; wa.me/api.whatsapp são alvo dos CTAs.
  "form-action": ["'self'", "https://wa.me", "https://api.whatsapp.com"],
  // Fotos reais servidas do próprio domínio + bancos externos citados nos
  // créditos (images.unsplash.com) + data:/blob: de previews e canvas.
  "img-src": ["'self'", "data:", "blob:", "https:"],
  // Fontes locais (self), data: e Google Fonts (Rajdhani/Sora).
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  // Tailwind/shadcn injetam estilo inline em runtime (motion, skeletons).
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  // GTM/GA/Ads são os únicos scripts de terceiros carregados.
  // 'unsafe-inline' permanece nesta rodada: o bootstrap do GTM e o shell
  // crítico dependem dele; remover exige nonce/hash (fora de escopo).
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://www.googleadservices.com",
    "https://googleads.g.doubleclick.net",
    "https://pagead2.googlesyndication.com",
  ],
  "script-src-attr": ["'unsafe-inline'"],
  "connect-src": [
    "'self'",
    SUPABASE, //            REST/PostgREST, Auth, Storage e edge functions
    SUPABASE_WS, //         realtime (painel admin em tempo real)
    "https://viacep.com.br", //  src/lib/cepLookup.ts — autopreencher bairro/cidade
    "https://ipwho.is", //       src/lib/geoContext.ts — cidade aproximada por IP
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://pagead2.googlesyndication.com",
    "https://td.doubleclick.net",
  ],
  "frame-src": ["'self'", "https://www.googletagmanager.com", "https://td.doubleclick.net"],
  "media-src": ["'self'"],
  "manifest-src": ["'self'"],
  // blob: é exigido pelo chunking do Vite para workers.
  "worker-src": ["'self'", "blob:"],
};

/** Política CSP serializada em linha única (formato de header). */
export const CSP_REPORT_ONLY = Object.entries(CSP_DIRECTIVES)
  .map(([k, v]) => `${k} ${v.join(" ")}`)
  .join("; ");

/**
 * Headers aplicados a TODA resposta HTML.
 * geolocation=(self): o funil oferece "usar minha localização"; as demais
 * APIs sensíveis ficam desligadas por não terem consumidor.
 */
export const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(self), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()",
  // COOP é seguro aqui: não há pop-up OAuth dependente de window.opener.
  // COEP/CORP ficam de fora — quebrariam imagens e embeds de terceiros.
  "Cross-Origin-Opener-Policy": "same-origin",
  "X-DNS-Prefetch-Control": "on",
  "Content-Security-Policy-Report-Only": CSP_REPORT_ONLY,
};

/** Tokens que jamais podem aparecer na CSP. */
export const FORBIDDEN_CSP_TOKENS = [
  [/(^|\s)\*(\s|;|$)/, "curinga isolado '*'"],
  [/https?:\/\/\*/, "host curinga (https://*)"],
  [/(^|\s)http:\/\//, "origem insegura http:"],
  [/'unsafe-eval'/, "'unsafe-eval'"],
];
