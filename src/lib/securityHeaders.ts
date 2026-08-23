/**
 * Política de headers de segurança APLICADA PELO SERVIDOR (src/server.ts).
 *
 * Espelha scripts/lib/security-headers.mjs (fonte única versionada). O gate
 * scripts/check-security-headers.ts compara os dois arquivos e derruba o build
 * em caso de divergência — nunca editar um sem o outro.
 *
 * Por que existe: a hospedagem atual não aplica public/_headers, então CSP
 * (Report-Only), anti-framing e Permissions-Policy não chegavam à produção.
 * HSTS, nosniff e Referrer-Policy já são emitidos pela borda da plataforma e
 * aqui só são preenchidos quando ausentes (sem `preload` nesta rodada).
 */

const SUPABASE = "https://hisepaayuwxjrnumbqeq.supabase.co";
const SUPABASE_WS = "wss://hisepaayuwxjrnumbqeq.supabase.co";

export const CSP_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'", "https://wa.me", "https://api.whatsapp.com"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
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
    SUPABASE,
    SUPABASE_WS,
    "https://viacep.com.br",
    "https://ipwho.is",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://pagead2.googlesyndication.com",
    "https://td.doubleclick.net",
  ],
  "frame-src": ["'self'", "https://www.googletagmanager.com", "https://td.doubleclick.net"],
  "media-src": ["'self'"],
  "manifest-src": ["'self'"],
  "worker-src": ["'self'", "blob:"],
};

export const CSP_REPORT_ONLY = Object.entries(CSP_DIRECTIVES)
  .map(([k, v]) => `${k} ${v.join(" ")}`)
  .join("; ");

/** Emitidos sempre — nenhuma outra camada os entrega hoje. */
export const SERVER_SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "Permissions-Policy":
    "geolocation=(self), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "X-DNS-Prefetch-Control": "on",
  "Content-Security-Policy-Report-Only": CSP_REPORT_ONLY,
};

/** Emitidos apenas se a borda não tiver enviado (sem sobrescrever a plataforma). */
export const SERVER_FALLBACK_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

/** Aplica a política a uma resposta HTML (documentos, não assets). */
export function applySecurityHeaders(response: Response): Response {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return response;

  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SERVER_SECURITY_HEADERS)) headers.set(name, value);
  for (const [name, value] of Object.entries(SERVER_FALLBACK_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
