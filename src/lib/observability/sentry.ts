/**
 * Sentry (front-end) com carregamento sob demanda.
 *
 * - Só inicializa quando `VITE_SENTRY_DSN` está definido no build.
 * - Import dinâmico: o bundle inicial não paga o custo do SDK (performance
 *   é prioridade absoluta neste projeto).
 * - Correlaciona com o build via `release = __APP_VERSION__` — os source maps
 *   enviados no deploy (ver `vite.config.ts`) usam o mesmo release.
 * - Nunca envia dados pessoais: `sendDefaultPii` desligado e scrub de query
 *   string das URLs.
 */
import { APP_BUILD_INFO } from "@/lib/errorReporter";

type SentryLike = {
  captureException: (e: unknown, ctx?: Record<string, unknown>) => void;
  setTag: (k: string, v: string) => void;
};

let sentry: SentryLike | null = null;
let initialized = false;

const DSN = (import.meta.env.VITE_SENTRY_DSN as string | undefined)?.trim() || "";
const ENVIRONMENT =
  (import.meta.env.VITE_SENTRY_ENVIRONMENT as string | undefined)?.trim() ||
  (import.meta.env.PROD ? "production" : "development");

const stripQuery = (url?: string) => (typeof url === "string" ? url.split("?")[0] : url);

export const isSentryEnabled = () => Boolean(DSN);

export async function initSentry() {
  if (initialized || !DSN || typeof window === "undefined") return;
  initialized = true;
  try {
    const Sentry = await import("@sentry/browser");
    Sentry.init({
      dsn: DSN,
      environment: ENVIRONMENT,
      release: APP_BUILD_INFO.version,
      sendDefaultPii: false,
      tracesSampleRate: 0,
      // Ruído de extensões do navegador e falhas de rede de terceiros.
      ignoreErrors: [
        "ResizeObserver loop",
        "Non-Error promise rejection captured",
        "Cannot read properties of undefined (reading 'onMessage')",
      ],
      denyUrls: [/extensions\//i, /^chrome:\/\//i, /^moz-extension:\/\//i],
      beforeSend(event) {
        if (event.request?.url) event.request.url = stripQuery(event.request.url);
        return event;
      },
    });
    Sentry.setTag("app_version", APP_BUILD_INFO.version);
    sentry = Sentry as unknown as SentryLike;

    // Espelha o buffer do errorReporter para o Sentry (mesma taxonomia).
    window.addEventListener("app:error", (e) => {
      const detail = (e as CustomEvent).detail as Record<string, unknown> | undefined;
      if (!detail) return;
      sentry?.captureException(new Error(String(detail.message || detail.kind || "app_error")), {
        extra: { ...detail, url: stripQuery(String(detail.url || "")) },
      });
    });
  } catch {
    /* observabilidade nunca pode quebrar a página */
  }
}

export const captureError = (error: unknown, extra?: Record<string, unknown>) => {
  try {
    sentry?.captureException(error, extra ? { extra } : undefined);
  } catch {
    /* noop */
  }
};
