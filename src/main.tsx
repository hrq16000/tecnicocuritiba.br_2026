import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initErrorReporter, APP_BUILD_INFO } from "./lib/errorReporter";
import { installCtaRuntimeGuard } from "./lib/ctaRuntimeGuard";
import { initSentry } from "./lib/observability/sentry";
import { initOtel } from "./lib/observability/otel";

initErrorReporter();
installCtaRuntimeGuard();
// Observabilidade: no-op quando as variáveis de ambiente não estão definidas.
void initSentry();
initOtel();
// Tema único (claro): remove qualquer `dark` herdado, força color-scheme light
// e zera flags antigas no localStorage para ignorar preferências do usuário.
try {
  document.documentElement.classList.remove("dark");
  document.documentElement.style.colorScheme = "light";
  localStorage.removeItem("theme");
} catch { /* noop */ }
// Sinaliza ao fallback estático do index.html que o JS hidratou.
try {
  document.documentElement.dataset.hydrated = "1";
  const meta = document.querySelector('meta[name="app-version"]');
  if (meta) meta.setAttribute("content", `${APP_BUILD_INFO.version} @ ${APP_BUILD_INFO.buildTime}`);
  // Cache-bust automático: se a versão atual difere da última vista nesta
  // sessão, força reload UMA vez (evita loop). Cobre o caso de cache antigo.
  try {
    const KEY = "__app_version__";
    const last = sessionStorage.getItem(KEY);
    if (last && last !== APP_BUILD_INFO.version) {
      sessionStorage.setItem(KEY, APP_BUILD_INFO.version);
      if (!sessionStorage.getItem("__app_version_reloaded__")) {
        sessionStorage.setItem("__app_version_reloaded__", "1");
        location.reload();
      }
    } else if (!last) {
      sessionStorage.setItem(KEY, APP_BUILD_INFO.version);
    } else {
      sessionStorage.removeItem("__app_version_reloaded__");
    }
  } catch { /* noop */ }
} catch { /* noop */ }



// Recarrega 1x quando um chunk antigo (deploy novo) falha em ser baixado.
const RELOAD_KEY = "__chunk_reloaded__";
const isChunkLoadError = (msg: string) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk \d+ failed/i.test(
    msg || "",
  );
const handleChunkError = (msg: string) => {
  if (!isChunkLoadError(msg)) return;
  try {
    if (sessionStorage.getItem(RELOAD_KEY)) return;
    sessionStorage.setItem(RELOAD_KEY, "1");
    window.location.reload();
  } catch {
    window.location.reload();
  }
};
window.addEventListener("error", (e) => handleChunkError(e?.message || ""));
window.addEventListener("unhandledrejection", (e) =>
  handleChunkError((e?.reason && (e.reason.message || String(e.reason))) || ""),
);
window.addEventListener("load", () => {
  try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* noop */ }
});
// Vite emite este evento específico para falhas de preload de chunks após novo deploy
window.addEventListener("vite:preloadError", (e: Event) => {
  e.preventDefault?.();
  handleChunkError("Failed to fetch dynamically imported module");
});

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(<App />);

// Painel dev-only de relatório JSON-LD — desativado a pedido do usuário
// (poluía a UI mesmo em preview). Reativar manualmente se precisar auditar.


const runWhenIdle = (fn: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(fn, { timeout: 3000 });
  } else {
    window.setTimeout(fn, 1200);
  }
};

runWhenIdle(() => {
  import("./lib/whatsappUtm").then(({ initWhatsAppUtm }) => initWhatsAppUtm());
  import("./lib/webVitals").then(({ initWebVitals }) => initWebVitals());
});
