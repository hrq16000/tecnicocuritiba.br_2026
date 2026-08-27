import { lazy, Suspense, useEffect, useState } from "react";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  redirect,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import appCss from "@/styles.css?url";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { RouteLoader } from "@/components/RouteLoader";
import { reportLovableError } from "@/lib/lovable-error-reporting";

const NotFound = lazy(() => import("@/pages/NotFound"));
const GeoAutoDetect = lazy(() => import("@/components/GeoAutoDetect").then((m) => ({ default: m.GeoAutoDetect })));
const InstitutionalJsonLd = lazy(() => import("@/components/InstitutionalJsonLd").then((m) => ({ default: m.InstitutionalJsonLd })));
const ProblemaLocalSchema = lazy(() => import("@/components/problemas/ProblemaLocalSchema").then((m) => ({ default: m.ProblemaLocalSchema })));
const WhatsAppFunnel = lazy(() => import("@/components/WhatsAppFunnel").then((m) => ({ default: m.WhatsAppFunnel })));
const WhatsAppFloat = lazy(() => import("@/components/WhatsAppFloat").then((m) => ({ default: m.WhatsAppFloat })));
const ConsentBanner = lazy(() => import("@/components/ConsentBanner"));
const WhatsAppChatbot = lazy(() => import("@/components/WhatsAppChatbot").then((m) => ({ default: m.WhatsAppChatbot })));
const SocialProofProvider = lazy(() => import("@/components/social-proof").then((m) => ({ default: m.SocialProofProvider })));
const GA4ChecklistPanel = lazy(() => import("@/components/GA4ChecklistPanel").then((m) => ({ default: m.GA4ChecklistPanel })));
const Toaster = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

const CONSENT_GTAG_SNIPPET = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
try {
  var saved = localStorage.getItem('lgpd_consent_v1');
  if (saved === 'granted') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
  }
} catch(e){}
gtag('js', new Date());
gtag('config', 'G-B9VPHCZC10', { anonymize_ip: true });
gtag('config', 'AW-17892118207');
(window.requestIdleCallback || function(cb){ return setTimeout(cb, 1800); })(function(){
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-B9VPHCZC10';
  document.head.appendChild(s);
});
`;

const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap";

/** Promove o preload das webfonts para stylesheet sem bloquear o primeiro paint. */
const FONTS_SWAP_SNIPPET = `(function(){var h=${JSON.stringify(GOOGLE_FONTS_HREF)};function p(){var l=document.querySelector('link[rel="preload"][href="'+h+'"]');if(l){l.rel="stylesheet";return;}var n=document.createElement("link");n.rel="stylesheet";n.href=h;document.head.appendChild(n);}if(document.readyState==="complete"){p();}else{window.addEventListener("load",p,{once:true});}})();`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: ({ location }) => {
    // Política única de URL (salto único, sempre 301, sem canonicalização client-side):
    //   /index.html, /index → /
    //   /Servicos           → /servicos   (caixa baixa)
    //   //servicos, /servicos/ → /servicos (barras duplicadas e barra final)
    const raw = location.pathname;
    let path = raw.replace(/\/{2,}/g, "/");
    path = path.replace(/\/index\.html?$/i, "/");
    path = path.toLowerCase();
    path = path.replace(/(.)\/+$/, "$1");
    if (path === "/index") path = "/";
    if (path !== raw) {
      throw redirect({ href: `${path}${location.searchStr ?? ""}`, statusCode: 301 });
    }
  },

  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Técnico em Curitiba" },
      {
        name: "description",
        content:
          "Técnico em Curitiba — suporte e manutenção de informática para casas e empresas.",
      },
      { name: "theme-color", content: "#0b2733" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "author", content: "Técnico em Curitiba — Suporte em Informática" },
      { name: "geo.region", content: "BR-PR" },
      { name: "geo.placename", content: "Curitiba" },
      { name: "geo.position", content: "-25.4284;-49.2733" },
      { name: "ICBM", content: "-25.4284, -49.2733" },
      { name: "format-detection", content: "telephone=no" },
      { name: "msapplication-TileColor", content: "#0b2733" },
      { name: "application-name", content: "Técnico em Curitiba" },
      { name: "google-adsense-account", content: "ca-pub-3762170279587706" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Técnico em Curitiba" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:title", content: "Técnico em Curitiba" },
      {
        property: "og:description",
        content:
          "Técnico em Curitiba — suporte e manutenção de informática para casas e empresas.",
      },
      { property: "og:image", content: "https://tecnico.curitiba.br/og-image.png?v=20260709-1" },
      { property: "og:image:secure_url", content: "https://tecnico.curitiba.br/og-image.png?v=20260709-1" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Técnico de Informática em Curitiba - Atendimento no mesmo dia" },
      { property: "og:image:type", content: "image/png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Técnico em Curitiba" },
      {
        name: "twitter:description",
        content:
          "Técnico em Curitiba — suporte e manutenção de informática para casas e empresas.",
      },
      { name: "twitter:image", content: "https://tecnico.curitiba.br/og-image.png?v=20260709-1" },
      { name: "twitter:image:alt", content: "Técnico de Informática em Curitiba" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preload", as: "image", href: "/logo.webp", type: "image/webp", fetchPriority: "high" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Rajdhani/Sora entram sem bloquear a renderização: o preload baixa em
      // paralelo e o snippet abaixo promove para stylesheet. Montserrat/Poppins
      // auto-hospedados cobrem o primeiro paint sem FOIT.
      {
        rel: "preload",
        as: "style",
        href: GOOGLE_FONTS_HREF,
      },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/montserrat-var.woff2", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/poppins-700.woff2", crossOrigin: "anonymous" },
      { rel: "apple-touch-icon", sizes: "192x192", href: "/apple-touch-icon-20260624.png" },
      { rel: "manifest", href: "/manifest.json", crossOrigin: "use-credentials" },
    ],
    scripts: [
      { children: FONTS_SWAP_SNIPPET },
      // Google Consent Mode v2: tudo "denied" por padrão (LGPD). O banner de
      // consentimento chama gtag('consent','update', {...}) ao aceitar.
      { children: CONSENT_GTAG_SNIPPET },
    ],
  }),
  errorComponent: ({ error }) => {
    reportLovableError(error);
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <img src="/logo.webp" alt="Técnico Curitiba" loading="eager" decoding="async" width={240} height={78} style={{ maxWidth: "60vw", height: "auto" }} />
          <h1 style={{ fontSize: "1.4rem", margin: "16px 0 8px" }}>Algo deu errado por aqui</h1>
          <p style={{ margin: "0 0 16px", opacity: 0.85 }}>
            Recarregue a página ou fale direto com a gente pelo WhatsApp.
          </p>
          <a
            href="https://wa.me/5541997086380?text=Ol%C3%A1!%20Preciso%20de%20suporte%20t%C3%A9cnico%20em%20Curitiba."
            data-cta-location="error_fallback"
            style={{ background: "#16a34a", color: "#fff", fontWeight: 700, padding: "12px 22px", borderRadius: 12, textDecoration: "none", display: "inline-block" }}
          >
            WhatsApp Agora
          </a>
        </div>
      </div>
    );
  },
  notFoundComponent: () => (
    <Suspense fallback={<RouteLoader />}>
      <NotFound />
    </Suspense>
  ),
  component: RootComponent,
});

/** Efeitos de inicialização portados de src/main.tsx (somente cliente). */
const ClientInit = () => {
  useEffect(() => {
    import("@/lib/errorReporter").then(({ initErrorReporter }) => initErrorReporter());
    import("@/lib/ctaRuntimeGuard").then(({ installCtaRuntimeGuard }) => installCtaRuntimeGuard());
    import("@/lib/observability/sentry").then(({ initSentry }) => void initSentry());
    import("@/lib/observability/otel").then(({ initOtel }) => initOtel());
    import("@/lib/utmCapture").then(({ captureUtmsFromUrl }) => captureUtmsFromUrl());
    import("@/lib/attribution").then(({ captureAttribution }) => captureAttribution());

    // Tema único (claro): remove qualquer `dark` herdado e força light.
    try {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      localStorage.removeItem("theme");
      document.documentElement.dataset.hydrated = "1";
    } catch { /* noop */ }

    const runWhenIdle = (fn: () => void) => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(fn, { timeout: 3000 });
      } else {
        window.setTimeout(fn, 1200);
      }
    };
    runWhenIdle(() => {
      import("@/lib/whatsappUtm").then(({ initWhatsAppUtm }) => initWhatsAppUtm());
      import("@/lib/webVitals").then(({ initWebVitals }) => initWebVitals());
    });
  }, []);
  return null;
};

/** Widgets globais carregados após o idle (paridade com IdleEnhancements). */
const IdleEnhancements = () => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const activate = () => setEnabled(true);
    const idleId: number =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(activate, { timeout: 4500 })
        : (globalThis.setTimeout(activate, 2500) as unknown as number);
    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId);
      }
    };
  }, []);
  if (!enabled) return null;
  return (
    <Suspense fallback={null}>
      <Toaster />
      <Sonner />
      <WhatsAppChatbot />
      <SocialProofProvider />
      <GA4ChecklistPanel />
    </Suspense>
  );
};

/** Widgets globais client-only (paridade com o shell SPA anterior). */
const GlobalWidgets = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <GeoAutoDetect />
      <InstitutionalJsonLd />
      <ProblemaLocalSchema />
      <WhatsAppFunnel />
      <WhatsAppFloat />
      <ConsentBanner />
      <IdleEnhancements />
    </Suspense>
  );
};

function RootComponent() {
  return (
    <RootDocument>
      <AppErrorBoundary>
        <ClientInit />
        <Suspense fallback={<RouteLoader />}>
          <Outlet />
        </Suspense>
        <GlobalWidgets />
      </AppErrorBoundary>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" style={{ colorScheme: "light" }}>
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="root">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}
