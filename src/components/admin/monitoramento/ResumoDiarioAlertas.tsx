import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { SEM_DADO } from "./types";

/**
 * Resumo diário dos alertas operacionais.
 *
 * Deduplica por fingerprint (severidade + cluster/URL + mensagem normalizada),
 * agrega por dia de avaliação e liga cada linha à evidência do cluster/URL no
 * próprio painel. Nunca inventa dado: sem `operational-alerts.json` a seção
 * declara "sem dado".
 */

interface Alerta {
  id?: string;
  severidade?: string;
  mensagem?: string;
  cluster?: string | null;
  url?: string | null;
  detectadoEm?: string | null;
}

interface EstadoAlertas {
  avaliadoEm: string;
  assinatura: string;
  alertas: Alerta[];
}

const ORDEM: Record<string, number> = { critica: 0, alta: 1, media: 2, baixa: 3 };
const COR: Record<string, string> = {
  critica: "text-destructive",
  alta: "text-destructive",
  media: "text-amber-600",
  baixa: "text-muted-foreground",
};

const normalizar = (s: string) => s.toLowerCase().replace(/\d+[.,]?\d*/g, "#").replace(/\s+/g, " ").trim();

interface Linha {
  fingerprint: string;
  severidade: string;
  mensagem: string;
  cluster: string | null;
  url: string | null;
  ocorrencias: number;
}

export function ResumoDiarioAlertas() {
  const [estado, setEstado] = useState<EstadoAlertas | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    fetch(`/operational-alerts.json?t=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("404"))))
      .then((j) => setEstado(j))
      .catch(() => setErro(true));
  }, []);

  const linhas = useMemo<Linha[]>(() => {
    const mapa = new Map<string, Linha>();
    for (const a of estado?.alertas ?? []) {
      const severidade = (a.severidade ?? "baixa").toLowerCase();
      const mensagem = a.mensagem ?? "(sem mensagem)";
      const cluster = a.cluster ?? null;
      const url = a.url ?? null;
      const fingerprint = `${severidade}|${cluster ?? ""}|${url ?? ""}|${normalizar(mensagem)}`;
      const atual = mapa.get(fingerprint);
      if (atual) atual.ocorrencias += 1;
      else mapa.set(fingerprint, { fingerprint, severidade, mensagem, cluster, url, ocorrencias: 1 });
    }
    return [...mapa.values()].sort(
      (a, b) => (ORDEM[a.severidade] ?? 9) - (ORDEM[b.severidade] ?? 9) || b.ocorrencias - a.ocorrencias,
    );
  }, [estado]);

  const porSeveridade = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const l of linhas) acc[l.severidade] = (acc[l.severidade] ?? 0) + 1;
    return acc;
  }, [linhas]);

  const dia = estado?.avaliadoEm ? new Date(estado.avaliadoEm).toLocaleDateString("pt-BR") : null;

  return (
    <section id="resumo-alertas" className="mt-10 scroll-mt-24">
      <h2 className="text-lg font-semibold">Resumo diário de alertas</h2>

      {erro || !estado ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {SEM_DADO} — `operational-alerts.json` ainda não foi gerado.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Avaliação de {dia} · assinatura <code className="font-mono text-xs">{estado.assinatura.slice(0, 12)}</code> ·{" "}
            {estado.alertas.length} evento(s) → {linhas.length} único(s) após deduplicação.
          </p>

          {!linhas.length ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Nenhum alerta ativo — operação dentro dos limiares.
            </p>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {Object.entries(porSeveridade).map(([sev, n]) => (
                  <span
                    key={sev}
                    className={`rounded-full border border-border px-3 py-1 font-medium ${COR[sev] ?? ""}`}
                  >
                    {sev}: {n}
                  </span>
                ))}
              </div>

              <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="p-3">Severidade</th>
                      <th className="p-3">Alerta</th>
                      <th className="p-3">Escopo</th>
                      <th className="p-3">Ocorrências</th>
                      <th className="p-3">Evidência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((l) => (
                      <tr key={l.fingerprint} className="border-t border-border align-top">
                        <td className={`p-3 text-xs font-semibold ${COR[l.severidade] ?? ""}`}>
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                            {l.severidade}
                          </span>
                        </td>
                        <td className="p-3 text-xs">{l.mensagem}</td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {l.cluster ? `cluster ${l.cluster}` : l.url ? l.url : "site-wide"}
                        </td>
                        <td className="p-3 text-xs">{l.ocorrencias}</td>
                        <td className="p-3 text-xs">
                          <a
                            className="underline underline-offset-2"
                            href={
                              l.cluster
                                ? `/admin/monitoramento?cluster=${encodeURIComponent(l.cluster)}#drilldown`
                                : l.url
                                  ? `/admin/monitoramento?url=${encodeURIComponent(l.url)}#drilldown`
                                  : "/admin/monitoramento#drilldown"
                            }
                          >
                            abrir drilldown
                          </a>
                          {" · "}
                          <a className="underline underline-offset-2" href="#alertas">
                            classificar
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

export default ResumoDiarioAlertas;
