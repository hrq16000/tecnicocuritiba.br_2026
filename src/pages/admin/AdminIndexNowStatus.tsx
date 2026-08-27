import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";

/**
 * Painel interno de submissões IndexNow.
 * Lê `public/indexnow-status.json`, gerado por `scripts/indexnow-submit.mjs`
 * a cada execução (inclusive --dry-run). Rota interna: noindex, sem link público.
 */

interface UrlMotivo {
  path: string;
  lastmod: string | null;
  motivo: string;
}

interface Execucao {
  executadoEm: string;
  host: string;
  modo: string;
  dryRun: boolean;
  totais: {
    sitemap: number;
    novas: number;
    alteradas: number;
    puladasPorLastmod: number;
    puladasPorConteudo: number;
    ignoradas: number;
    candidatas: number;
    enviadas: number;
    aceitas: number;
    falhas: number;
  };
  urls: {
    novas: UrlMotivo[];
    alteradas: UrlMotivo[];
    puladas: UrlMotivo[];
    inalteradas: UrlMotivo[];
    ignoradas: { path: string; motivo: string }[];
    enviadas: string[];
  };
  chunks: { urls: number; status: number; tentativas: number; ok: boolean }[];
  erros: { chunk: number; status: number; tentativas: number; erro: string }[];
}

interface Payload {
  atualizadoEm: string;
  ultimaExecucao: Execucao;
  historico: (Execucao["totais"] & { executadoEm: string; modo: string; dryRun: boolean; erros: number })[];
}

const Card = ({ label, value, tone = "default" }: { label: string; value: string | number; tone?: "default" | "alert" }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className={`text-2xl font-bold ${tone === "alert" ? "text-destructive" : "text-foreground"}`}>{value}</p>
  </div>
);

const dataHora = (iso: string) => new Date(iso).toLocaleString("pt-BR");

export default function AdminIndexNowStatus() {
  const [data, setData] = useState<Payload | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregar = () => {
    setCarregando(true);
    fetch("/indexnow-status.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json: Payload) => {
        setData(json);
        setErro(null);
      })
      .catch((e: Error) =>
        setErro(`Relatório indisponível (${e.message}). Rode "npm run indexnow:submit:dry" ou aguarde o próximo deploy.`),
      )
      .finally(() => setCarregando(false));
  };

  useEffect(carregar, []);

  const linhas = useMemo(() => {
    const exec = data?.ultimaExecucao;
    if (!exec) return [] as (UrlMotivo & { grupo: string })[];
    const enviadas = new Set(exec.urls.enviadas);
    const todas = [
      ...exec.urls.novas.map((u) => ({ ...u, grupo: "nova" })),
      ...exec.urls.alteradas.map((u) => ({ ...u, grupo: "alterada" })),
      ...exec.urls.puladas.map((u) => ({ ...u, grupo: "pulada (lastmod)" })),
      ...exec.urls.inalteradas.map((u) => ({ ...u, grupo: "sem mudança" })),
      ...exec.urls.ignoradas.map((u) => ({ path: u.path, lastmod: null, motivo: u.motivo, grupo: "ignorada" })),
    ].map((u) => ({ ...u, grupo: enviadas.has(u.path) ? `${u.grupo} · enviada` : u.grupo }));
    const q = busca.trim().toLowerCase();
    return q ? todas.filter((u) => u.path.toLowerCase().includes(q) || u.motivo.toLowerCase().includes(q)) : todas;
  }, [data, busca]);

  const exec = data?.ultimaExecucao;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Status do IndexNow</h1>
            <p className="text-sm text-muted-foreground">
              Histórico de submissões, motivos por URL e erros por execução.
              {data ? ` Atualizado em ${dataHora(data.atualizadoEm)}.` : ""}
            </p>
          </div>
          <button
            onClick={carregar}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" /> Recarregar
          </button>
        </div>

        {carregando && (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </p>
        )}

        {erro && (
          <p className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {erro}
          </p>
        )}

        {exec && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Card label="URLs no sitemap" value={exec.totais.sitemap} />
              <Card label="Novas" value={exec.totais.novas} />
              <Card label="Alteradas" value={exec.totais.alteradas} />
              <Card label="Puladas (lastmod)" value={exec.totais.puladasPorLastmod} />
              <Card label="Sem mudança de conteúdo" value={exec.totais.puladasPorConteudo} />
              <Card label="Enviadas" value={exec.totais.enviadas} />
              <Card label="Aceitas" value={exec.totais.aceitas} />
              <Card label="Falhas" value={exec.totais.falhas} tone={exec.totais.falhas ? "alert" : "default"} />
            </div>

            <p className="mb-6 text-sm text-muted-foreground">
              Última execução: <strong>{dataHora(exec.executadoEm)}</strong> · modo <strong>{exec.modo}</strong>
              {exec.dryRun ? " (nenhum ping enviado)" : ""} · host {exec.host}
            </p>

            {exec.erros.length > 0 && (
              <section className="mb-8 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
                <h2 className="mb-2 flex items-center gap-2 font-semibold text-destructive">
                  <AlertTriangle className="h-4 w-4" /> Erros de submissão
                </h2>
                <ul className="space-y-1 text-sm text-destructive">
                  {exec.erros.map((e) => (
                    <li key={e.chunk}>
                      chunk {e.chunk} · HTTP {e.status} · {e.tentativas} tentativa(s) · {e.erro}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {exec.chunks.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-2 text-lg font-semibold text-foreground">Chunks enviados</h2>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {exec.chunks.map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {c.ok ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                      {c.urls} URL(s) · HTTP {c.status} · {c.tentativas} tentativa(s)
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mb-8">
              <h2 className="mb-2 text-lg font-semibold text-foreground">URLs desta execução</h2>
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Filtrar por caminho ou motivo…"
                className="mb-3 max-w-sm"
              />
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="p-2 font-medium">URL</th>
                      <th className="p-2 font-medium">Situação</th>
                      <th className="p-2 font-medium">Motivo</th>
                      <th className="p-2 font-medium">lastmod</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.slice(0, 400).map((u) => (
                      <tr key={`${u.grupo}-${u.path}`} className="border-t border-border">
                        <td className="p-2 font-mono text-xs">{u.path}</td>
                        <td className="p-2">{u.grupo}</td>
                        <td className="p-2 text-muted-foreground">{u.motivo}</td>
                        <td className="p-2 text-muted-foreground">{u.lastmod ?? "—"}</td>
                      </tr>
                    ))}
                    {linhas.length === 0 && (
                      <tr>
                        <td className="p-3 text-muted-foreground" colSpan={4}>
                          Nenhuma URL nesta execução.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">Histórico de execuções</h2>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="p-2 font-medium">Quando</th>
                      <th className="p-2 font-medium">Modo</th>
                      <th className="p-2 font-medium">Novas</th>
                      <th className="p-2 font-medium">Alteradas</th>
                      <th className="p-2 font-medium">Puladas</th>
                      <th className="p-2 font-medium">Enviadas</th>
                      <th className="p-2 font-medium">Erros</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...(data?.historico ?? [])].reverse().map((h) => (
                      <tr key={h.executadoEm} className="border-t border-border">
                        <td className="p-2">{dataHora(h.executadoEm)}</td>
                        <td className="p-2">{h.modo}</td>
                        <td className="p-2">{h.novas}</td>
                        <td className="p-2">{h.alteradas}</td>
                        <td className="p-2">{h.puladasPorLastmod}</td>
                        <td className="p-2">{h.enviadas}</td>
                        <td className={`p-2 ${h.erros ? "text-destructive" : ""}`}>{h.erros}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
