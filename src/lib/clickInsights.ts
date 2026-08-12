/**
 * Insights do painel de conversão (Rodada 4K).
 *
 * Funções puras usadas pelo `/admin` para:
 * - deduplicar cliques repetidos (mesma sessão + tipo + destino em janela curta);
 * - agregar por hora do dia;
 * - detectar quedas bruscas por serviço/horário.
 *
 * Não altera a coleta: a deduplicação é apenas analítica (o dado bruto continua íntegro).
 */

export type InsightEvent = {
  id: string;
  created_at: string;
  event_type: string;
  servico: string | null;
  path: string | null;
  session_id: string | null;
  cta_location: string | null;
};

/** Janela padrão de deduplicação: cliques idênticos em até 30s contam uma vez. */
export const DEDUP_WINDOW_MS = 30_000;

export type DedupResult<T> = {
  /** Eventos considerados únicos. */
  unique: T[];
  /** Eventos descartados como duplicata. */
  duplicates: T[];
  /** Percentual de duplicatas sobre o total (0–100). */
  duplicateRate: number;
};

/**
 * Remove cliques duplicados: mesma sessão, mesmo tipo de evento, mesmo path e
 * mesma origem de CTA dentro da janela informada. Mantém sempre o mais antigo.
 */
export function dedupeClickEvents<T extends InsightEvent>(
  rows: T[],
  windowMs: number = DEDUP_WINDOW_MS,
): DedupResult<T> {
  const sorted = [...rows].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const lastSeen = new Map<string, number>();
  const unique: T[] = [];
  const duplicates: T[] = [];

  for (const row of sorted) {
    const t = new Date(row.created_at).getTime();
    if (!row.session_id || Number.isNaN(t)) {
      unique.push(row);
      continue;
    }
    const key = [row.session_id, row.event_type, row.path ?? "", row.cta_location ?? ""].join("::");
    const prev = lastSeen.get(key);
    if (prev !== undefined && t - prev < windowMs) {
      duplicates.push(row);
      continue;
    }
    lastSeen.set(key, t);
    unique.push(row);
  }

  const total = rows.length;
  return {
    unique,
    duplicates,
    duplicateRate: total ? (duplicates.length / total) * 100 : 0,
  };
}

export type HourBucket = { hour: number; wa: number; call: number; total: number };

/** Distribuição de conversões por hora local do dia (0–23). */
export function aggregateByHour(rows: InsightEvent[]): HourBucket[] {
  const buckets: HourBucket[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    wa: 0,
    call: 0,
    total: 0,
  }));
  for (const row of rows) {
    const d = new Date(row.created_at);
    if (Number.isNaN(d.getTime())) continue;
    const b = buckets[d.getHours()];
    if (row.event_type === "wa_click") b.wa++;
    else if (row.event_type === "call_click") b.call++;
    else continue;
    b.total++;
  }
  return buckets;
}

export type DropAlert = {
  scope: "servico" | "hora";
  label: string;
  baseline: number;
  current: number;
  dropPct: number;
};

/**
 * Compara o último dia com a média diária dos dias anteriores no mesmo recorte.
 * Alerta quando há baseline relevante (>= `minBaseline`) e queda >= `thresholdPct`.
 */
export function detectDropAlerts(
  rows: InsightEvent[],
  options: { thresholdPct?: number; minBaseline?: number } = {},
): DropAlert[] {
  const thresholdPct = options.thresholdPct ?? 50;
  const minBaseline = options.minBaseline ?? 3;

  const conversions = rows.filter(
    (r) => r.event_type === "wa_click" || r.event_type === "call_click",
  );
  if (conversions.length === 0) return [];

  const days = [...new Set(conversions.map((r) => r.created_at.slice(0, 10)))].sort();
  if (days.length < 3) return [];
  const lastDay = days[days.length - 1];
  const previousDays = days.slice(0, -1);

  const build = (
    scope: DropAlert["scope"],
    keyOf: (r: InsightEvent) => string,
  ): DropAlert[] => {
    const current = new Map<string, number>();
    const past = new Map<string, number>();
    for (const r of conversions) {
      const key = keyOf(r);
      const target = r.created_at.slice(0, 10) === lastDay ? current : past;
      target.set(key, (target.get(key) ?? 0) + 1);
    }
    const alerts: DropAlert[] = [];
    for (const [key, totalPast] of past) {
      const baseline = totalPast / previousDays.length;
      if (baseline < minBaseline) continue;
      const now = current.get(key) ?? 0;
      const dropPct = ((baseline - now) / baseline) * 100;
      if (dropPct >= thresholdPct) {
        alerts.push({ scope, label: key, baseline, current: now, dropPct });
      }
    }
    return alerts.sort((a, b) => b.dropPct - a.dropPct);
  };

  return [
    ...build("servico", (r) => r.servico || "—"),
    ...build("hora", (r) => `${String(new Date(r.created_at).getHours()).padStart(2, "0")}h`),
  ];
}
