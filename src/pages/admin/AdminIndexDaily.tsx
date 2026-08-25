import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Gauge, Loader2, RefreshCw, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

/**
 * Painel interno: acompanhamento diário de descoberta e indexação.
 *
 * Lê `public/indexation-daily.json`, gerado por
 * `scripts/report-consolidated-final.mjs` (que consolida Search Console,
 * IndexNow, latência de crawl e a auditoria de valor). O painel nunca calcula
 * métricas por conta própria e nunca preenche lacuna com zero: quando a fonte
 * não existe, exibe "sem dado".
 *
 * Rota interna: noindex, sem link público.
 */

interface ClusterRow {
  cluster: string;
  total: number;
  indexadas: number;
  descobertas: number;
  desconhecidas: number;
  outras: number;
  cliques: number;
  impressoes: number;
  scoreMediano: number | null;
}

interface Payload {
  geradoEm: string;
  totais: { urls: number | null; indexadas: number; descobertas: number; desconhecidas: number; outras: number };
  clusters: ClusterRow[];
  historico: Array<{ dia: string; urls: number | null; indexadas: number; descobertas: number; desconhecidas: number }>;
  latencia: { escopo: string; limiarMs: number; medidas: number; p50: number; p75: number; p95: number; falhas: number } | null;
  indexnow: { executadoEm: string | null; enviadas: number; falhas: number; novas: number; mudadas: number; ignoradas: number } | null;
  qualidade: {
    faixas: Record<string, number>;
    scoreMedianoGeral?: number | null;
    piores: Array<{ path: string; score: number; faixa: string; causas: string[] }>;
  } | null;
  doorway: { total: number; alto: number; medio: number; baixo: number; ok: number; consolidadas?: number } | null;
  tiers?: Array<{
    tier: string;
    total: number;
    indexadas: number;
    descobertas: number;
    desconhecidas: number;
    taxaIndexacao: number | null;
  }>;
  pisoQualidade?: { score: number; textoExclusivoRatio: number; similaridadeMax: number } | null;
  consolidacao?: { total: number; urlsAntes: number; urlsDepois: number } | null;
}


const SEM_DADO = <span className="text-muted-foreground">sem dado</span>;

export default function AdminIndexDaily() {
  const [data, setData] = useState<Payload | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  const carregar = () => {
    setCarregando(true);
    fetch(`/indexation-daily.json?t=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j: Payload) => {
        setData(j);
        setErro(null);
      })
      .catch((e) => setErro(String(e)))
      .finally(() => setCarregando(false));
  };

  useEffect(carregar, []);

  const variacao = useMemo(() => {
    const h = data?.historico ?? [];
    if (h.length < 2) return null;
    const hoje = h[h.length - 1];
    const anterior = h[h.length - 2];
    return {
      dia: anterior.dia,
      indexadas: hoje.indexadas - anterior.indexadas,
      desconhecidas: hoje.desconhecidas - anterior.desconhecidas,
    };
  }, [data]);

  const piores = useMemo(() => {
    const lista = data?.qualidade?.piores ?? [];
    const q = busca.trim().toLowerCase();
    return q ? lista.filter((p) => p.path.toLowerCase().includes(q)) : lista;
  }, [data, busca]);

  const pct = (n: number) => (data?.totais.urls ? `${((n / data.totais.urls) * 100).toFixed(1)}%` : "—");

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Indexação diária por cluster</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Consolidado de Search Console, IndexNow, latência de crawl e auditoria de valor.
              {data ? ` Snapshot de ${new Date(data.geradoEm).toLocaleString("pt-BR")}.` : ""}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={carregar} disabled={carregando}>
            {carregando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Recarregar
          </Button>
        </div>

        {erro && (
          <p className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Não foi possível ler o snapshot ({erro}). Gere-o com <code className="mx-1">npm run report:consolidated</code>.
          </p>
        )}

        {data && (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "URLs no sitemap", valor: data.totais.urls ?? "—", nota: "curadas" },
                { label: "Indexadas", valor: data.totais.indexadas, nota: pct(data.totais.indexadas) },
                { label: "Descobertas sem indexar", valor: data.totais.descobertas, nota: pct(data.totais.descobertas) },
                { label: "Desconhecidas pelo Google", valor: data.totais.desconhecidas, nota: pct(data.totais.desconhecidas) },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{c.valor}</p>
                  <p className="text-xs text-muted-foreground">{c.nota}</p>
                </div>
              ))}
            </section>

            {variacao && (
              <p className="mt-4 text-sm text-muted-foreground">
                Desde {new Date(variacao.dia).toLocaleDateString("pt-BR")}: indexadas{" "}
                <strong className={variacao.indexadas >= 0 ? "text-primary" : "text-destructive"}>
                  {variacao.indexadas >= 0 ? "+" : ""}
                  {variacao.indexadas}
                </strong>
                , desconhecidas{" "}
                <strong className={variacao.desconhecidas <= 0 ? "text-primary" : "text-destructive"}>
                  {variacao.desconhecidas >= 0 ? "+" : ""}
                  {variacao.desconhecidas}
                </strong>
                .
              </p>
            )}

            <section className="mt-10">
              <h2 className="text-lg font-semibold">Por cluster</h2>
              <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="p-3">Cluster</th>
                      <th className="p-3">URLs</th>
                      <th className="p-3">Indexadas</th>
                      <th className="p-3">Descobertas</th>
                      <th className="p-3">Desconhecidas</th>
                      <th className="p-3">Score mediano</th>
                      <th className="p-3">Cliques</th>
                      <th className="p-3">Impressões</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.clusters.map((c) => (
                      <tr key={c.cluster} className="border-t border-border">
                        <td className="p-3 font-medium">{c.cluster}</td>
                        <td className="p-3">{c.total}</td>
                        <td className="p-3">{c.indexadas}</td>
                        <td className="p-3">{c.descobertas}</td>
                        <td className="p-3">{c.desconhecidas}</td>
                        <td className="p-3">{c.scoreMediano ?? SEM_DADO}</td>
                        <td className="p-3">{c.cliques}</td>
                        <td className="p-3">{c.impressoes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tier A é o compromisso real de indexação: comercial + sintoma. */}
            <section className="mt-10 grid gap-6 lg:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold">Indexação por Tier</h2>
                {data.tiers?.length ? (
                  <div className="mt-4 space-y-3">
                    {data.tiers.map((t) => (
                      <div key={t.tier} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-medium">
                            Tier {t.tier}
                            {t.tier === "A" && (
                              <span className="ml-2 rounded bg-primary/15 px-2 py-0.5 text-xs text-primary">
                                compromisso
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t.indexadas}/{t.total} indexadas
                            {t.taxaIndexacao !== null ? ` · ${t.taxaIndexacao}%` : ""}
                          </p>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${t.tier === "A" ? "bg-primary" : "bg-foreground/40"}`}
                            style={{ width: `${t.taxaIndexacao ?? 0}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {t.descobertas} descoberta(s) sem indexar · {t.desconhecidas} desconhecida(s)
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm">{SEM_DADO}</p>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold">Distribuição de qualidade</h2>
                {data.qualidade ? (
                  <div className="mt-4 rounded-xl border border-border bg-card p-4">
                    <div className="space-y-3">
                      {["A", "B", "C", "D", "E"].map((faixa) => {
                        const n = data.qualidade?.faixas[faixa] ?? 0;
                        const total = Object.values(data.qualidade?.faixas ?? {}).reduce((a, b) => a + b, 0) || 1;
                        return (
                          <div key={faixa}>
                            <div className="flex items-baseline justify-between text-sm">
                              <span className="font-medium">Faixa {faixa}</span>
                              <span className="text-muted-foreground">
                                {n} URL(s) · {((n / total) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${faixa === "D" || faixa === "E" ? "bg-destructive/70" : "bg-primary"}`}
                                style={{ width: `${(n / total) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Score mediano geral: {data.qualidade.scoreMedianoGeral ?? "—"}
                      {data.pisoQualidade
                        ? ` · piso de qualidade local: score ${data.pisoQualidade.score}, exclusividade ${(data.pisoQualidade.textoExclusivoRatio * 100).toFixed(0)}%, similaridade ≤ ${data.pisoQualidade.similaridadeMax}`
                        : ""}
                    </p>
                    {data.consolidacao && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Consolidação da Fase Final: {data.consolidacao.urlsAntes} → {data.consolidacao.urlsDepois} URLs
                        curadas ({data.consolidacao.total} redirecionadas 301).
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-sm">{SEM_DADO}</p>
                )}
              </div>
            </section>



            <section className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Gauge className="h-4 w-4" /> Latência de crawl
                </p>
                {data.latencia ? (
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <li>{data.latencia.medidas} URLs não indexadas medidas</li>
                    <li>
                      TTFB p50 {data.latencia.p50} ms · p75 {data.latencia.p75} ms · p95 {data.latencia.p95} ms
                    </li>
                    <li className={data.latencia.falhas ? "text-destructive" : "text-primary"}>
                      {data.latencia.falhas
                        ? `${data.latencia.falhas} URL(s) acima de ${data.latencia.limiarMs} ms`
                        : `nenhuma acima de ${data.latencia.limiarMs} ms`}
                    </li>
                  </ul>
                ) : (
                  <p className="mt-3 text-sm">{SEM_DADO}</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" /> IndexNow
                </p>
                {data.indexnow ? (
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <li>{data.indexnow.enviadas} enviada(s), {data.indexnow.falhas} falha(s)</li>
                    <li>
                      {data.indexnow.novas} nova(s) · {data.indexnow.mudadas} alterada(s) · {data.indexnow.ignoradas} ignorada(s) por hash
                      igual
                    </li>
                    <li>
                      {data.indexnow.executadoEm ? new Date(data.indexnow.executadoEm).toLocaleString("pt-BR") : SEM_DADO}
                    </li>
                  </ul>
                ) : (
                  <p className="mt-3 text-sm">{SEM_DADO}</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4" /> Risco doorway (páginas locais)
                </p>
                {data.doorway ? (
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <li>
                      ALTO {data.doorway.alto} · MÉDIO {data.doorway.medio} · BAIXO {data.doorway.baixo} · OK {data.doorway.ok}
                    </li>
                    <li>{data.doorway.total} páginas locais avaliadas</li>
                  </ul>
                ) : (
                  <p className="mt-3 text-sm">{SEM_DADO}</p>
                )}
              </div>
            </section>

            <section className="mt-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Fila de otimização por valor</h2>
                {data.qualidade && (
                  <p className="text-sm text-muted-foreground">
                    Faixas: {["A", "B", "C", "D", "E"].map((f) => `${f} ${data.qualidade?.faixas[f] ?? 0}`).join(" · ")}
                  </p>
                )}
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="filtrar por caminho"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm"
                />
              </div>
              <ul className="mt-4 space-y-2">
                {piores.map((p) => (
                  <li key={p.path} className="rounded-lg border border-border bg-card p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{p.path}</span>
                      <span className="rounded bg-muted px-2 py-0.5 text-xs">score {p.score}</span>
                      <span className="rounded bg-muted px-2 py-0.5 text-xs">faixa {p.faixa}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{p.causas.join(", ") || "sem causa dominante"}</p>
                  </li>
                ))}
                {!piores.length && <li className="text-sm text-muted-foreground">Nenhuma URL corresponde ao filtro.</li>}
              </ul>
            </section>
          </>
        )}
      </main>
    </>
  );
}
