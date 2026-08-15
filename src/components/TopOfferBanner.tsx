import { useState } from "react";

const STORAGE_KEY = "top_offer_banner_dismissed_v1";

/**
 * Banner topo da home com a oferta-âncora "Serviço Rápido até 30 min — R$ 99,99".
 * Dispara o WhatsAppFunnel via custom event. Pode ser dispensado (sessionStorage).
 */
export const TopOfferBanner = () => {
  const [visible, setVisible] = useState(() => {
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      return !dismissed;
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
  };

  const openFunnel = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", { detail: { location: "top_banner" } }),
    );
  };

  if (!visible) return <div aria-hidden="true" className="h-[var(--site-header-height)]" />;

  return (
    <>
      <div aria-hidden="true" className="h-[calc(var(--site-header-height)+var(--top-offer-height))]" />
      <div
        role="region"
        data-testid="top-offer-banner"
        aria-label="Oferta: serviço rápido até 30 minutos por R$ 99,99"
        style={{ zIndex: "var(--z-top-offer)" as unknown as number }}
        className="fixed left-0 right-0 top-[var(--site-header-height)] flex min-h-[var(--top-offer-height)] w-full items-center overflow-hidden bg-gradient-to-r from-accent via-accent to-primary text-white shadow-md"
      >
        <div className="container mx-auto flex min-h-[var(--top-offer-height)] items-center justify-center gap-2 px-3 py-1.5 pr-9 text-center sm:gap-4 sm:px-4 sm:py-2 sm:text-left">
          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <span className="flex-shrink-0 text-yellow-300" aria-hidden="true">⚡</span>
            <p className="text-sm font-semibold tracking-tight">
              Serviço Rápido até <span className="underline decoration-2 underline-offset-2">30 min</span> — apenas{" "}
              <span className="text-yellow-300 font-extrabold">R$ 99,99</span>
            </p>
          </div>
          <div className="flex min-w-0 items-center justify-center gap-2 text-[12px] sm:gap-3 sm:text-sm">
            <span className="font-semibold sm:hidden">
              ⚡ 30 min · <span className="font-extrabold text-yellow-300">R$ 99,99</span>
            </span>
            <a
              href="https://wa.me/5541997086380"
              onClick={openFunnel}
              data-wa-medium="top_banner"
              data-cta-location="top_banner"
              className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1 font-extrabold text-[hsl(var(--whatsapp))] shadow-xs transition-transform hover:scale-105"
            >
              Chamar agora <span aria-hidden="true">→</span>
            </a>
            <a
              href="/termos-e-condicoes"
              className="hidden truncate text-[11px] font-medium text-white/70 underline underline-offset-2 hover:text-white sm:inline"
            >
              Termos
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar oferta"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors hover:bg-white/20 sm:right-3"
        >
          <span className="block h-4 w-4 leading-4" aria-hidden="true">×</span>
        </button>
      </div>
    </>
  );
};

export default TopOfferBanner;
