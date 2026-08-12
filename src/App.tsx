import { lazy, Suspense, startTransition, useEffect, useRef, useState } from "react";
import Index from "./pages/Index";
import { RouteLoader } from "./components/RouteLoader";
import { RouteProgress } from "./components/motion/RouteProgress";
import { startNav } from "./lib/navTelemetry";
import ConsentBanner from "./components/ConsentBanner";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { WhatsAppFunnel } from "./components/WhatsAppFunnel";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { InstitutionalJsonLd } from "./components/InstitutionalJsonLd";
import { GeoAutoDetect } from "./components/GeoAutoDetect";


const LegacyApp = lazy(() => import("./LegacyApp"));

const routeCache = new Map<string, Promise<unknown>>();

const routeImportMap: Record<string, () => Promise<unknown>> = {
  "/servicos": () => import("./pages/Servicos"),
  "/como-funciona": () => import("./pages/ComoFunciona"),
  "/valores": () => import("./pages/PrecosEPoliticas"),
  "/precos-e-politicas": () => import("./pages/PrecosEPoliticas"),
  "/tecnico-informatica-curitiba": () => import("./pages/TecnicoInformaticaCuritiba"),
  "/blog": () => import("./pages/Blog"),
  "/diagnostico-60s": () => import("./pages/Diagnostico60s"),
  "/termos-e-condicoes": () => import("./pages/TermosCondicoes"),
  "/sobre": () => import("./pages/Sobre"),
  "/contato": () => import("./pages/Contato"),
  "/anuncie": () => import("./pages/Anuncie"),
  "/faq": () => import("./pages/FAQ"),
  "/equipamentos-atendidos": () => import("./pages/EquipamentosAtendidos"),
  "/areas-atendidas": () => import("./pages/AreasAtendidas"),
  "/atendimento-domicilio": () => import("./pages/AtendimentoDomicilio"),
  "/atendimento-remoto": () => import("./pages/AtendimentoRemoto"),
  "/servicos/suporte-tecnico-empresarial": () => import("./pages/servicos/ServicoCore"),
  "/servicos/manutencao-preventiva-empresas": () => import("./pages/servicos/ServicoCore"),
  "/servicos/backup-para-empresas": () => import("./pages/servicos/ServicoCore"),
  "/servicos/suporte-home-office": () => import("./pages/servicos/ServicoCore"),
  "/servicos/montagem-de-pc": () => import("./pages/servicos/ServicoCore"),
  "/seguranca-dos-dados": () => import("./pages/SegurancaDosDados"),
  "/politica-de-pecas-do-cliente": () => import("./pages/PoliticaPecasCliente"),
  "/empresa-de-ti-curitiba": () => import("./pages/EmpresaDeTiCuritiba"),
  "/problemas-reais-e-casos": () => import("./pages/ProblemasReaisCasos"),
  "/problemas/notebook-nao-liga": () => import("./pages/problemas/NotebookNaoLiga"),
  "/problemas/computador-lento": () => import("./pages/problemas/ComputadorLento"),
  "/problemas/tela-azul-windows": () => import("./pages/problemas/TelaAzulWindows"),
  "/problemas/notebook-nao-carrega-bateria": () => import("./pages/problemas/NotebookNaoCarregaBateria"),
  "/problemas/tv-nao-liga": () => import("./pages/problemas/TvNaoLiga"),
  "/problemas/computador-desliga-sozinho": () => import("./pages/problemas/ComputadorDesligaSozinho"),
  "/problemas/wifi-caindo-toda-hora": () => import("./pages/problemas/WifiCaindoTodaHora"),
  "/problemas/tv-com-som-sem-imagem": () => import("./pages/problemas/TvComSomSemImagem"),
  "/problemas/notebook-molhado": () => import("./pages/problemas/NotebookMolhado"),
  "/problemas/tela-de-notebook-quebrada": () => import("./pages/problemas/TelaDeNotebookQuebrada"),
  "/problemas/hd-nao-reconhecido": () => import("./pages/problemas/HdNaoReconhecido"),
  "/problemas/computador-nao-liga": () => import("./pages/problemas/ComputadorNaoLiga"),
  "/problemas/teclado-de-notebook-nao-funciona": () => import("./pages/problemas/TecladoNotebookNaoFunciona"),
  "/problemas/computador-fazendo-barulho": () => import("./pages/problemas/ComputadorFazendoBarulho"),
  "/problemas/notebook-com-tela-preta": () => import("./pages/problemas/NotebookComTelaPreta"),
  "/problemas/tv-desligando-sozinha": () => import("./pages/problemas/TvDesligandoSozinha"),
  "/problemas/tv-com-linhas-na-tela": () => import("./pages/problemas/TvComLinhasNaTela"),
  "/problemas/notebook-superaquecendo": () => import("./pages/problemas/NotebookSuperaquecendo"),
  "/guia-tecnico-informatica": () => import("./pages/GuiaTecnicoInformatica"),
  "/coleta-e-entrega": () => import("./pages/ColetaEntrega"),
  "/arrumar-pc": () => import("./pages/ArrumarPC"),
  "/obrigado": () => import("./pages/Obrigado"),
  "/ordem-de-servico": () => import("./pages/OrdemDeServico"),
  "/status-da-ordem-de-servico": () => import("./pages/StatusOs"),
  "/status-os": () => import("./pages/StatusOs"),
  "/depoimentos": () => import("./pages/Depoimentos"),
  "/como-avaliar": () => import("./pages/ComoAvaliar"),
};

const warmRoute = (pathname = "") => {
  if (routeCache.has(pathname)) return routeCache.get(pathname)!;
  const routeImport = routeImportMap[pathname]?.() ?? Promise.resolve();
  const promise = Promise.all([import("./LegacyApp"), routeImport]).catch((err) => {
    // Permite nova tentativa se a primeira falhar (ex.: rede instável).
    routeCache.delete(pathname);
    handlePreloadError(err);
    return undefined;
  });
  routeCache.set(pathname, promise);
  return promise;
};

// Fallback robusto para deploys novos: chunk antigo desapareceu do servidor.
// Faz UM reload (guardado por sessionStorage) sem entrar em loop. Se já
// recarregamos uma vez, segue silenciosamente — Suspense mantém a rota atual
// renderizada, sem tela intermediária de loader.
const PRELOAD_RELOAD_KEY = "__nav_preload_reload__";
const isPreloadError = (err: unknown) => {
  if (!err) return false;
  const name = (err as { name?: string }).name ?? "";
  const msg = (err as { message?: string }).message ?? String(err);
  return (
    name === "ChunkLoadError" ||
    /Loading chunk [\w-]+ failed/i.test(msg) ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg)
  );
};
const handlePreloadError = (err: unknown) => {
  if (typeof window === "undefined" || !isPreloadError(err)) return;
  try {
    if (sessionStorage.getItem(PRELOAD_RELOAD_KEY)) return;
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, "1");
    window.location.reload();
  } catch {
    /* storage indisponível: ignora silenciosamente */
  }
};
// Registro dos listeners é feito dentro do useEffect de InstantNavigation
// para evitar TDZ em chunks minificados (referência a consts ainda não
// inicializadas durante avaliação top-level com import circular).

const AppInit = () => {
  useEffect(() => {
    import("@/lib/utmCapture").then(({ captureUtmsFromUrl }) => captureUtmsFromUrl());
    // Atribuição first-touch (SEO × Ads × orgânico) usada nos cliques de CTA.
    import("@/lib/attribution").then(({ captureAttribution }) => captureAttribution());
  }, []);
  return null;
};


const isHomeRoute = (pathname?: string) => {
  const path = (pathname ?? (typeof window === "undefined" ? "/" : window.location.pathname)).replace(/\/+$/, "") || "/";
  return path === "/" || path === "/index";
};

const InstantNavigation = ({
  setRoutePath,
  setShowNavLoader,
}: {
  setRoutePath: (path: string) => void;
  setShowNavLoader: (show: boolean) => void;
}) => {
  const navId = useRef(0);

  useEffect(() => {
    const onPreloadError = (event: Event) => {
      event.preventDefault();
      handlePreloadError((event as Event & { payload?: unknown }).payload ?? new Error("vite:preloadError"));
    };
    const onLoad = () => {
      try { sessionStorage.removeItem(PRELOAD_RELOAD_KEY); } catch { /* noop */ }
    };
    window.addEventListener("vite:preloadError", onPreloadError);
    window.addEventListener("load", onLoad);

    warmRoute(window.location.pathname);
    const preloadCommon = window.setTimeout(() => {
      ["/servicos", "/como-funciona", "/valores", "/tecnico-informatica-curitiba", "/blog", "/faq", "/contato"].forEach(warmRoute);
    }, 40);

    const getInternalUrl = (target: EventTarget | null) => {
      const anchor = target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return null;
      const url = new URL(anchor.href, window.location.href);
      return url.origin === window.location.origin ? url : null;
    };

    const prefetch = (event: Event) => {
      const url = getInternalUrl(event.target);
      if (url) warmRoute(url.pathname);
    };

    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = getInternalUrl(event.target);
      if (!url || (url.pathname === window.location.pathname && url.search === window.location.search && url.hash)) return;

      event.preventDefault();
      const currentNav = ++navId.current;
      const cached = routeCache.has(url.pathname);
      const endNav = startNav(url.pathname);
      const loaderTimer = window.setTimeout(() => {
        if (navId.current === currentNav) setShowNavLoader(true);
      }, 90);

      const go = () => {
        window.history.pushState({}, "", url);
        window.dispatchEvent(new PopStateEvent("popstate"));
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        startTransition(() => setRoutePath(url.pathname));
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            if (navId.current === currentNav) setShowNavLoader(false);
            endNav({ cached });
          });
        });
      };

      warmRoute(url.pathname).then(go).finally(() => window.clearTimeout(loaderTimer));
    };


    const pop = () => startTransition(() => setRoutePath(window.location.pathname));

    document.addEventListener("pointerover", prefetch, true);
    document.addEventListener("pointerdown", prefetch, true);
    document.addEventListener("focusin", prefetch, true);
    document.addEventListener("touchstart", prefetch, true);
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", pop);
    return () => {
      document.removeEventListener("pointerover", prefetch, true);
      document.removeEventListener("pointerdown", prefetch, true);
      document.removeEventListener("focusin", prefetch, true);
      document.removeEventListener("touchstart", prefetch, true);
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", pop);
      window.removeEventListener("vite:preloadError", onPreloadError);
      window.removeEventListener("load", onLoad);
      window.clearTimeout(preloadCommon);
    };
  }, [setRoutePath, setShowNavLoader]);
  return null;
};

const NavigationOverlay = () => (
  <div className="fixed inset-0 z-[var(--z-page-wipe)] animate-in fade-in duration-150">
    <RouteLoader />
  </div>
);

const HomeApp = () => {
  const [routePath, setRoutePath] = useState(() =>
    typeof window === "undefined" ? "/" : window.location.pathname,
  );
  const [showNavLoader, setShowNavLoader] = useState(false);

  return (
    <AppErrorBoundary>
      <AppInit />
      <GeoAutoDetect />
      <InstitutionalJsonLd />
      <InstantNavigation setRoutePath={setRoutePath} setShowNavLoader={setShowNavLoader} />
      <RouteProgress active={showNavLoader} />
      {showNavLoader ? <NavigationOverlay /> : null}
      {isHomeRoute(routePath) ? (
        <Index />
      ) : (
        <Suspense fallback={<RouteLoader />}>
          <LegacyApp />
        </Suspense>
      )}
      <WhatsAppFunnel />
      <WhatsAppFloat />
      <ConsentBanner />
    </AppErrorBoundary>
  );
};

export default HomeApp;
