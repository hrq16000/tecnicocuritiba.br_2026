import { useEffect, useState } from "react";

interface EventoIntervencao {
  id: string;
  tipo: string;
  timestamp: string;
  urlsDiretas: string[];
  urlsIndiretas: string[];
  mudanca: string;
  motivo: string;
  coorte: string;
  impacto: Record<string, string>;
}

interface Ledger {
  eventos: EventoIntervencao[];
  coortes: {
    CLEAN_COHORT: { total: number };
    INTERVENTION_COHORT: { total: number };
    INDIRECT_DISCOVERY_COHORT: { total: number };
  };
  politica: { declaracaoObrigatoriaNoD14: string };
  universoCurado: number;
  selo: string;
}

/**
 * Painel interno: intervenções públicas registradas desde o D0.
 * Nunca exposto publicamente — vive apenas em /admin/monitoramento.
 */
export const IntervencoesRegistradas = () => {
  const [ledger, setLedger] = useState<Ledger | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/intervencoes-d0.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setLedger)
      .catch(() => setErro("Ledger de intervenções indisponível."));
  }, []);

  if (erro) return <p className="text-sm text-muted-foreground">{erro}</p>;
  if (!ledger) return <p className="text-sm text-muted-foreground">Carregando intervenções…</p>;

  const { CLEAN_COHORT, INTERVENTION_COHORT, INDIRECT_DISCOVERY_COHORT } = ledger.coortes;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Intervenções desde o D0: {ledger.eventos.length}
        </h2>
        <span className="text-xs text-muted-foreground">selo {ledger.selo.slice(0, 12)}…</span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">{ledger.politica.declaracaoObrigatoriaNoD14}</p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          ["Universo curado", ledger.universoCurado],
          ["Coorte limpa", CLEAN_COHORT.total],
          ["Intervenção direta", INTERVENTION_COHORT.total],
          ["Descoberta indireta", INDIRECT_DISCOVERY_COHORT.total],
        ].map(([label, valor]) => (
          <div key={String(label)} className="rounded-lg border border-border bg-background p-3">
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-xl font-bold text-foreground">{valor}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-5 space-y-3">
        {ledger.eventos.map((ev) => (
          <li key={ev.id} className="rounded-lg border border-border bg-background p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded bg-accent/15 px-2 py-0.5 font-bold text-accent">{ev.tipo}</span>
              <span className="text-muted-foreground">{new Date(ev.timestamp).toISOString()}</span>
              <span className="rounded border border-border px-2 py-0.5 text-muted-foreground">
                {ev.mudanca}
              </span>
              <span className="rounded border border-border px-2 py-0.5 text-muted-foreground">
                {ev.coorte}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-foreground">
              Direta: {ev.urlsDiretas.join(", ")}
              {ev.urlsIndiretas.length > 0 && (
                <span className="font-normal text-muted-foreground">
                  {" "}· indireta: {ev.urlsIndiretas.length} URL(s)
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{ev.motivo}</p>
            <ul className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
              {Object.entries(ev.impacto).map(([k, v]) => (
                <li key={k}>
                  <strong className="text-foreground">{k}:</strong> {v}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IntervencoesRegistradas;
