import { describe, it, expect, beforeEach, vi } from "vitest";
import { trackCTAClick } from "./analytics";

type GtagCall = [string, string, Record<string, unknown>];

function gtagCalls(): GtagCall[] {
  return (window.gtag as unknown as { mock: { calls: GtagCall[] } }).mock.calls;
}

function eventsOf(name: string): Record<string, unknown>[] {
  return gtagCalls()
    .filter(([type, evt]) => type === "event" && evt === name)
    .map(([, , params]) => params);
}

describe("trackCTAClick — dedup de lead por sessão", () => {
  beforeEach(() => {
    sessionStorage.clear();
    (window as any).gtag = vi.fn();
  });

  it("dispara generate_lead UMA vez por sessão para whatsapp, mesmo com múltiplos cliques", () => {
    trackCTAClick("whatsapp", "hero");
    trackCTAClick("whatsapp", "header");
    trackCTAClick("whatsapp", "float");

    const leads = eventsOf("generate_lead");
    expect(leads).toHaveLength(1);
    expect(leads[0].method).toBe("whatsapp");
    expect(leads[0].transaction_id).toMatch(/^lead_/);

    // cta_click é engajamento e dispara em todos os cliques
    expect(eventsOf("cta_click")).toHaveLength(3);
    expect(eventsOf("click_whatsapp")).toHaveLength(3);

    // mesmo lead_id reutilizado em todos os cta_click do mesmo tipo
    const ids = new Set(eventsOf("cta_click").map((p) => p.lead_id));
    expect(ids.size).toBe(1);
  });

  it("whatsapp e phone têm lead_id independentes e cada um dispara generate_lead 1x", () => {
    trackCTAClick("whatsapp", "hero");
    trackCTAClick("whatsapp", "footer");
    trackCTAClick("phone", "header");
    trackCTAClick("phone", "footer");

    const leads = eventsOf("generate_lead");
    expect(leads).toHaveLength(2);
    const methods = leads.map((l) => l.method).sort();
    expect(methods).toEqual(["phone", "whatsapp"]);

    const ids = new Set(leads.map((l) => l.transaction_id));
    expect(ids.size).toBe(2); // ids distintos por tipo de CTA
  });

  it("chatbot NUNCA dispara generate_lead e cliques em rajada não duplicam cta_click", () => {
    trackCTAClick("chatbot", "widget");
    trackCTAClick("chatbot", "widget"); // rajada <1,2s no mesmo CTA → descartado
    trackCTAClick("chatbot", "rodape");
    expect(eventsOf("generate_lead")).toHaveLength(0);
    expect(eventsOf("cta_click")).toHaveLength(2);
  });


  it("persiste o lead_id em sessionStorage para deduplicar entre reloads da SPA", () => {
    trackCTAClick("whatsapp", "hero");
    const raw = sessionStorage.getItem("lead_dedup_v1");
    expect(raw).toBeTruthy();
    const map = JSON.parse(raw!);
    expect(map.whatsapp).toMatch(/^lead_/);

    // Simula "novo ciclo": gtag zerado, mas sessionStorage persiste.
    (window as any).gtag = vi.fn();
    trackCTAClick("whatsapp", "hero");
    expect(eventsOf("generate_lead")).toHaveLength(0);
  });
});
