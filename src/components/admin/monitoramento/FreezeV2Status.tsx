import { useEffect, useMemo, useState } from "react";

interface FreezeV2 {
  versao: string;
  selo: string;
  seladoEm: string;
  deploymentId: string;
  universoCurado: number;
  coortes: {
    CLEAN_COHORT: number;
    DIRECT_INTERVENTION: number;
    INDIRECT_DISCOVERY_INTERVENTION: number;
  };
  freezeV1: { selo: string; preservado: boolean; seladoEm: string };
}

interface Drift {
  verificadoEm: string;
  porClasse: Record<string, number>;
  publicChangeNaoRegistrado: number;
  alerta: string | null;
}

const Card = ({ titulo, valor, nota }: { titulo: string; valor: string | number; nota?: string }) => (
  <div className="rounded-lg border border-border bg-background p-3">
    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{titulo}</p>
    <p className="mt-1 text-xl font-bold text-foreground">{valor}</p>
    {nota ? <p className="mt-1 text-[11px] text-muted-foreground">{nota}</p> : null}
  </div>
);

/**
 * ETAPA 26 — estado do experimento na janela WAIT.
 * A data do próximo marco vem do selo temporal (`elegivelEm`), nunca de um
 * hardcode duplicado no front.
 */
export const FreezeV2Status = ({ proximoMarcoEm }: { proximoMarcoEm: string | null }) => {
  const [freeze, setFreeze] = useState<FreezeV2 | null>(null);
  const [drift, setDrift] = useState<Drift | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/freeze-v2.json?t=${Date.now()}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/freeze-v2-drift.json?t=${Date.now()}`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([f, d]) => {
        setFreeze(f);
        setDrift(d);
        if (!f) setErro("FREEZE_V2 ainda não selado — rode npm run freeze:v2.");
      })
      .catch(() => setErro("Não foi possível ler o estado do freeze."));
  }, []);

  const proximo = useMemo(() => {
    if (!proximoMarcoEm) return "fonte temporal indisponível";
    return `${new Date(proximoMarcoEm).toISOString().replace("T", " ").slice(0, 16)} UTC`;
  }, [proximoMarcoEm]);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-heading text-lg font-bold text-foreground">Experiment status</h2>
        <span className="rounded bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600">
          WAIT — D14 LOCKED
        </span>
      </div>

      {erro ? <p className="mt-3 text-sm text-muted-foreground">{erro}</p> : null}

      {freeze ? (
        <>
          <dl className="mt-4 grid gap-3 sm:grid-cols-4">
            <Card titulo="Clean" valor={freeze.coortes.CLEAN_COHORT} />
            <Card titulo="Direct" valor={freeze.coortes.DIRECT_INTERVENTION} />
            <Card titulo="Indirect" valor={freeze.coortes.INDIRECT_DISCOVERY_INTERVENTION} />
            <Card titulo="Total curado" valor={freeze.universoCurado} />
          </dl>

          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            <Card
              titulo="Freeze V1"
              valor={freeze.freezeV1.preservado ? "preservado" : "PERDIDO"}
              nota={`${freeze.freezeV1.selo.slice(0, 12)}…`}
            />
            <Card titulo="Freeze V2" valor="ativo" nota={`${freeze.selo.slice(0, 12)}… · ${freeze.deploymentId}`} />
            <Card
              titulo="Public drift desde V2"
              valor={drift ? drift.publicChangeNaoRegistrado : "—"}
              nota={
                drift?.alerta
                  ? drift.alerta
                  : drift
                    ? Object.entries(drift.porClasse)
                        .map(([k, v]) => `${k.replace("_CHANGE", "")}=${v}`)
                        .join(" · ") || "sem diffs"
                    : undefined
              }
            />
          </dl>

          {drift?.alerta ? (
            <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              🚨 {drift.alerta} — registre o evento em scripts/lib/intervencoes.mjs, reselo o freeze e
              classifique a coorte afetada antes do D14.
            </p>
          ) : null}

          <p className="mt-4 text-xs text-muted-foreground">
            Selado em {freeze.seladoEm} · próximo marco válido: <strong>{proximo}</strong>
          </p>
        </>
      ) : null}
    </section>
  );
};

export default FreezeV2Status;
