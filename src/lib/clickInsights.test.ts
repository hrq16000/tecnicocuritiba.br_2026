import { describe, it, expect } from "vitest";
import {
  aggregateByHour,
  dedupeClickEvents,
  detectDropAlerts,
  type InsightEvent,
} from "./clickInsights";

const ev = (over: Partial<InsightEvent> & { id: string; created_at: string }): InsightEvent => ({
  event_type: "wa_click",
  servico: null,
  path: "/",
  session_id: "s1",
  cta_location: "hero",
  ...over,
});

describe("dedupeClickEvents", () => {
  it("descarta clique idêntico dentro da janela", () => {
    const rows = [
      ev({ id: "1", created_at: "2026-08-10T10:00:00.000Z" }),
      ev({ id: "2", created_at: "2026-08-10T10:00:10.000Z" }),
    ];
    const r = dedupeClickEvents(rows);
    expect(r.unique).toHaveLength(1);
    expect(r.duplicates.map((d) => d.id)).toEqual(["2"]);
    expect(r.duplicateRate).toBe(50);
  });

  it("mantém cliques fora da janela ou de sessões/CTAs distintos", () => {
    const rows = [
      ev({ id: "1", created_at: "2026-08-10T10:00:00.000Z" }),
      ev({ id: "2", created_at: "2026-08-10T10:01:00.000Z" }),
      ev({ id: "3", created_at: "2026-08-10T10:00:05.000Z", session_id: "s2" }),
      ev({ id: "4", created_at: "2026-08-10T10:00:05.000Z", cta_location: "footer" }),
    ];
    expect(dedupeClickEvents(rows).unique).toHaveLength(4);
  });

  it("não deduplica eventos sem sessão", () => {
    const rows = [
      ev({ id: "1", created_at: "2026-08-10T10:00:00.000Z", session_id: null }),
      ev({ id: "2", created_at: "2026-08-10T10:00:01.000Z", session_id: null }),
    ];
    expect(dedupeClickEvents(rows).unique).toHaveLength(2);
  });
});

describe("aggregateByHour", () => {
  it("agrupa por hora local e separa wa/call", () => {
    const base = new Date(2026, 7, 10, 9, 30).toISOString();
    const rows = [
      ev({ id: "1", created_at: base }),
      ev({ id: "2", created_at: base, event_type: "call_click" }),
      ev({ id: "3", created_at: base, event_type: "funnel_open" }),
    ];
    const buckets = aggregateByHour(rows);
    expect(buckets).toHaveLength(24);
    expect(buckets[9]).toMatchObject({ wa: 1, call: 1, total: 2 });
  });
});

describe("detectDropAlerts", () => {
  it("alerta queda brusca por serviço", () => {
    const rows: InsightEvent[] = [];
    for (const day of ["2026-08-08", "2026-08-09"]) {
      for (let i = 0; i < 6; i++) {
        rows.push(ev({ id: `${day}-${i}`, created_at: `${day}T12:00:0${i}.000Z`, servico: "notebook", session_id: `s${i}` }));
      }
    }
    rows.push(ev({ id: "last", created_at: "2026-08-10T12:00:00.000Z", servico: "notebook", session_id: "z" }));
    const alerts = detectDropAlerts(rows);
    const servico = alerts.find((a) => a.scope === "servico");
    expect(servico?.label).toBe("notebook");
    expect(servico?.dropPct).toBeGreaterThan(50);
  });

  it("não alerta com histórico insuficiente", () => {
    const rows = [ev({ id: "1", created_at: "2026-08-10T12:00:00.000Z" })];
    expect(detectDropAlerts(rows)).toEqual([]);
  });
});
