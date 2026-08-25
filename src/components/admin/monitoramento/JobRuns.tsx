import { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SEM_DADO } from "./types";

/**
 * Logs de execução dos jobs da fase de operação (coleta de marco, reindexação,
 * análise D7/D14, diff de snapshots): quando rodou, duração, resultado do
 * fail-closed e o que foi verificado.
 *
 * Fonte: `public/job-runs.json`, escrito por `scripts/lib/job-log.mjs`.
 */

interface Execucao {
  id: string;
  job: string;
  marco: string | null;
  executadoEm: string;
  duracaoMs: number;
  status: "ok" | "aviso" | "falhou";
  failClosed: boolean | null;
  contagens: Record<string, number | null>;
  logs: string[];
}

const COR: Record<string, string> = {
  ok: "text-emerald-600",
  aviso: "text-amber-600",
  falhou: "text-destructive",
};

export function JobRuns() {
  const [execucoes, setExecucoes] = useState<Execucao[] | null>(null);
  const [aberta, setAberta] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/job-runs.json?t=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setExecucoes(j?.execucoes ?? null))
      .catch(() => setExecucoes(null));
  }, []);

  return (
    <section id="jobs" className="mt-10 scroll-mt-24">
      <h2 className="text-lg font-semibold">Execução de jobs</h2>
      {!execucoes?.length ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {SEM_DADO} — nenhuma execução registrada. Os jobs gravam aqui ao rodar
          (<code>snapshot:marco</code>, <code>reindex:snapshots</code>,{" "}
          <code>report:diff-marcos</code>).
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Job</th>
                <th className="p-3">Marco</th>
                <th className="p-3">Executado</th>
                <th className="p-3">Duração</th>
                <th className="p-3">Status</th>
                <th className="p-3">Fail-closed</th>
                <th className="p-3">Verificado</th>
              </tr>
            </thead>
            <tbody>
              {execucoes.slice(0, 20).map((e) => {
                const expandida = aberta === e.id;
                return (
                  <Fragment key={e.id}>
                    <tr className="border-t border-border">
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => setAberta(expandida ? null : e.id)}
                          className="flex items-center gap-1 font-mono text-xs hover:underline"
                        >
                          {expandida ? (
                            <ChevronDown
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronRight
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          )}
                          {e.job}
                        </button>
                      </td>
                      <td className="p-3 text-xs">{e.marco ?? "—"}</td>
                      <td className="p-3 text-xs">
                        {new Date(e.executadoEm).toLocaleString("pt-BR")}
                      </td>
                      <td className="p-3 text-xs">
                        {(e.duracaoMs / 1000).toFixed(1)}s
                      </td>
                      <td
                        className={`p-3 text-xs font-medium ${COR[e.status]}`}
                      >
                        {e.status}
                      </td>
                      <td className="p-3 text-xs">
                        {e.failClosed === null
                          ? "N/A"
                          : e.failClosed
                            ? "passou"
                            : "reprovou"}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {Object.entries(e.contagens ?? {})
                          .map(([k, v]) => `${k}: ${v ?? "N/A"}`)
                          .join(" · ") || "—"}
                      </td>
                    </tr>
                    {expandida && (
                      <tr className="border-t border-border bg-muted/30">
                        <td colSpan={7} className="p-4">
                          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-muted-foreground">
                            {e.logs.length
                              ? e.logs.join("\n")
                              : "sem linhas de log registradas"}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default JobRuns;
