import { useEffect, useState } from "react";
import { SEM_DADO } from "./types";

/**
 * Diff automático de identidade de SERP entre dois marcos
 * (title / description / canonical / robots / H1 / tipos de JSON-LD).
 *
 * Fonte: `public/diff-marcos.json`, gerado por `scripts/diff-marcos.mjs`.
 * Zero mudança é o resultado esperado durante a fase de observação.
 */

interface Mudanca {
  path: string;
  campo: string;
  severidade: "alta" | "media" | "baixa";
  antes: string | null;
  depois: string | null;
  nota?: string;
}

interface DiffPayload {
  geradoEm: string;
  de: string | null;
  para: string | null;
  disponivel: boolean;
  motivo: string | null;
  urlsComparadas: number | null;
  total: number;
  alta: number;
  media: number;
  baixa: number;
  mudancas: Mudanca[];
}

const COR: Record<string, string> = {
  alta: "text-destructive",
  media: "text-amber-600",
  baixa: "text-muted-foreground",
};

export function DiffSnapshots() {
  const [diff, setDiff] = useState<DiffPayload | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    fetch(`/diff-marcos.json?t=${Date.now()}`)
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(String(r.status))),
      )
      .then(setDiff)
      .catch(() => setErro(true));
  }, []);

  return (
    <section id="diff" className="mt-10 scroll-mt-24">
      <h2 className="text-lg font-semibold">
        Diff entre snapshots (title · H1 · canonical · schema)
      </h2>

      {(!diff || erro) && (
        <p className="mt-2 text-sm text-muted-foreground">
          {SEM_DADO} — rode <code>npm run report:diff-marcos</code> para
          comparar os dois marcos mais recentes.
        </p>
      )}

      {diff && !erro && (
        <>
          <p className="mt-2 text-sm">
            {diff.disponivel ? (
              <>
                <span className="font-medium">
                  {diff.de} × {diff.para}
                </span>{" "}
                · {diff.urlsComparadas ?? SEM_DADO} URL(s) comparadas ·{" "}
                <span
                  className={
                    diff.total
                      ? "font-semibold"
                      : "font-semibold text-emerald-600"
                  }
                >
                  {diff.total} mudança(s)
                </span>{" "}
                (alta {diff.alta} · média {diff.media} · baixa {diff.baixa}) ·
                gerado em {new Date(diff.geradoEm).toLocaleString("pt-BR")}
              </>
            ) : (
              diff.motivo
            )}
          </p>

          {diff.disponivel && diff.total === 0 && (
            <p className="mt-3 rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3 text-sm">
              Identidade de SERP estável entre os marcos — nenhuma alteração de
              title, H1, canonical, robots ou schema.
            </p>
          )}

          {diff.total > 0 && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-3">URL</th>
                    <th className="p-3">Campo</th>
                    <th className="p-3">Severidade</th>
                    <th className="p-3">Antes</th>
                    <th className="p-3">Depois</th>
                  </tr>
                </thead>
                <tbody>
                  {diff.mudancas.map((m, i) => (
                    <tr
                      key={`${m.path}-${m.campo}-${i}`}
                      className="border-t border-border align-top"
                    >
                      <td className="p-3 font-mono text-xs">{m.path}</td>
                      <td className="p-3 text-xs">{m.campo}</td>
                      <td
                        className={`p-3 text-xs font-medium ${COR[m.severidade]}`}
                      >
                        {m.severidade}
                      </td>
                      <td className="max-w-xs p-3 text-xs text-muted-foreground">
                        {m.antes ?? "—"}
                      </td>
                      <td className="max-w-xs p-3 text-xs">
                        {m.depois ?? "—"}
                        {m.nota && (
                          <span className="block text-[11px] text-muted-foreground">
                            {m.nota}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default DiffSnapshots;
