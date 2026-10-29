import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { trackCTAClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Botão flutuante de WhatsApp.
 * - Visível em mobile, tablet e desktop.
 * - Não expõe número/URL: dispara o funil obrigatório via evento `wa-funnel:open`.
 * - Todo clique passa pelo funil que confirma o mínimo R$ 99,99 e coleta detalhes.
 */
export const WhatsAppFloat = () => {
  const handleClick = () => {
    trackCTAClick("whatsapp", "float");
    // Confirmação imediata do toque (mobile): o usuário sabe que o clique funcionou.
    toast.success("Abrindo a triagem rápida do WhatsApp…", { duration: 2000 });
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", { detail: { location: "float" } }),
    );
  };


  return (
    <button
      type="button"
      onClick={handleClick}
      data-cta-location="float"
      data-wa-funnel="required"
      data-testid="whatsapp-float"
      aria-label="Falar com técnico pelo WhatsApp"
      className={cn(
        // Rodada 3W — enquanto o banner de cookies está visível o botão sobe
        // (offset dinâmico via --consent-banner-h), respeitando a safe area.
        "wa-float-offset fixed right-4 z-[95] flex min-h-12 items-center gap-2 sm:right-6",
        "bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-primary-foreground",
        "pl-4 pr-5 py-3 rounded-full",
        "shadow-[0_4px_20px_hsl(var(--whatsapp)/0.35)] hover:shadow-[0_8px_30px_hsl(var(--whatsapp)/0.5)]",
        // O pulso infinito com transform tornava o botão instável para toques
        // (Playwright e usuários com precisão reduzida). Hover mantém feedback cromático.
        "transition-[box-shadow,background-color] duration-300 group",
      )}
    >
      <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-12" />
      <span className="hidden whitespace-nowrap text-sm font-semibold sm:inline">Fale com Técnico</span>
    </button>
  );
};
