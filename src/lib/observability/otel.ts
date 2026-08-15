/**
 * Instrumentação OpenTelemetry leve (OTLP/HTTP JSON) sem SDK pesado.
 *
 * Por que não o SDK oficial: o bundle do `@opentelemetry/sdk-trace-web`
 * custa centenas de KB e velocidade é prioridade absoluta aqui. Este módulo
 * emite spans no formato OTLP/HTTP JSON — compatível com qualquer coletor
 * (Grafana Tempo, Honeycomb, Datadog OTLP, New Relic OTLP).
 *
 * O que instrumenta:
 *  - `navigation`: uma raiz por rota (trace por página, correlacionado à sessão)
 *  - `cta.click`: cliques de WhatsApp e ligação, filhos do span de navegação,
 *    com atributos de rota, tipo de rota e localização do CTA.
 *
 * Ativação: `VITE_OTEL_ENDPOINT` (ex.: https://coletor/v1/traces).
 * Sem endpoint → no-op total (nenhuma requisição, nenhum custo).
 * Privacidade: apenas path (sem query), sem PII, sem número de WhatsApp.
 */
import { routeTypeFromPath } from "@/lib/trackingTaxonomy";

const ENDPOINT = (import.meta.env.VITE_OTEL_ENDPOINT as string | undefined)?.trim() || "";
const SERVICE_NAME =
  (import.meta.env.VITE_OTEL_SERVICE_NAME as string | undefined)?.trim() || "tecnico-curitiba-web";

type Attr = Record<string, string | number | boolean>;

type OtlpSpan = {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  kind: number;
  startTimeUnixNano: string;
  endTimeUnixNano: string;
  attributes: Array<{ key: string; value: Record<string, unknown> }>;
};

const hex = (bytes: number) => {
  const a = new Uint8Array(bytes);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(a);
  else for (let i = 0; i < bytes; i++) a[i] = Math.floor(Math.random() * 256);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
};

const nowNano = () => `${Math.round(performance.timeOrigin + performance.now()) * 1e6}`;

const toAttr = (attrs: Attr) =>
  Object.entries(attrs).map(([key, v]) => ({
    key,
    value:
      typeof v === "number"
        ? Number.isInteger(v)
          ? { intValue: String(v) }
          : { doubleValue: v }
        : typeof v === "boolean"
          ? { boolValue: v }
          : { stringValue: String(v) },
  }));

let traceId = "";
let navSpanId = "";
let queue: OtlpSpan[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

export const isOtelEnabled = () => Boolean(ENDPOINT);

function flush(useBeacon = false) {
  if (!ENDPOINT || queue.length === 0) return;
  const body = JSON.stringify({
    resourceSpans: [
      {
        resource: {
          attributes: toAttr({
            "service.name": SERVICE_NAME,
            "service.version":
              typeof window !== "undefined" ? window.__APP_VERSION__ || "dev" : "dev",
            "deployment.environment": import.meta.env.PROD ? "production" : "development",
          }),
        },
        scopeSpans: [{ scope: { name: "web-cta" }, spans: queue }],
      },
    ],
  });
  queue = [];
  try {
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* noop */
  }
}

function enqueue(span: OtlpSpan) {
  queue.push(span);
  if (queue.length >= 20) return flush();
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, 3000);
}

/** Abre (ou reabre) o span raiz de navegação para a rota atual. */
export function startNavigationSpan(path?: string) {
  if (!ENDPOINT || typeof window === "undefined") return;
  const p = path || window.location.pathname;
  const start = nowNano();
  traceId = hex(16);
  navSpanId = hex(8);
  // Span de navegação com duração simbólica: correlaciona os filhos por rota.
  enqueue({
    traceId,
    spanId: navSpanId,
    name: `navigation ${p}`,
    kind: 1,
    startTimeUnixNano: start,
    endTimeUnixNano: start,
    attributes: toAttr({
      "http.route": p,
      "app.route_type": routeTypeFromPath(p),
      "app.referrer": typeof document !== "undefined" ? document.referrer.split("?")[0] : "",
    }),
  });
}

/** Registra um span filho de clique em CTA (WhatsApp / ligação / interno). */
export function recordCtaSpan(name: string, attrs: Attr = {}) {
  if (!ENDPOINT || typeof window === "undefined") return;
  if (!traceId) startNavigationSpan();
  const t = nowNano();
  const path = window.location.pathname;
  enqueue({
    traceId,
    spanId: hex(8),
    parentSpanId: navSpanId,
    name,
    kind: 1,
    startTimeUnixNano: t,
    endTimeUnixNano: t,
    attributes: toAttr({
      "http.route": path,
      "app.route_type": routeTypeFromPath(path),
      ...attrs,
    }),
  });
}

export function initOtel() {
  if (!ENDPOINT || typeof window === "undefined") return;
  startNavigationSpan();
  // SPA: um trace novo por rota (pushState/replaceState/voltar).
  const patch = (key: "pushState" | "replaceState") => {
    const orig = history[key].bind(history) as (...args: unknown[]) => unknown;
    history[key] = ((...args: unknown[]) => {
      const r = orig(...args);
      setTimeout(() => startNavigationSpan(), 0);
      return r;
    }) as typeof orig;
  };
  patch("pushState");
  patch("replaceState");
  window.addEventListener("popstate", () => startNavigationSpan());
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
  });
  window.addEventListener("pagehide", () => flush(true));
}

/** Somente para testes. */
export const __otelInternals = { toAttr, hex };
