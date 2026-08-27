import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, Send } from "lucide-react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";

/**
 * Painel interno de status de SEO / indexação (Rodada 4).
 * Lê `public/indexacao-auditoria.json`, gerado por
 * `scripts/report-indexacao-auditoria.mjs` no pós-deploy e no CI.
 * Rota interna: noindex, sem link público.
 */

interface UrlRow {
  path: string;
  sitemap: string;
  lastmod: string | null;
  noindex: boolean | null;
  canonical: string | null;
  title: string | null;
  anomalias: string[];
}

interface Payload {
  generatedAt: string;
  totals: {
    sitemapUrls: number;
    comLastmod: number;
    anomalias: number;
    noindexNoSitemap: number;
    indexnowConhecidas: number;
    indexnowPendentes: number;
    gscCoverage: number | null;
    gscIndexadas: number | null;
    naoAvaliadas?: number;
  };
  urls: UrlRow[];
  indexnow: {
    ultimasSubmissoes: { path: string; lastSubmitted: string | null; submissions: number }[];
    pendentes: string[];
  };
  sitemapSubmissions: {
    at: string;
    site: string;
    sitemap: string;
    errors: number;
    warnings: number;
    urlsSubmitted: number;
    lastDownloaded: string | null;
  }[];
}

const Card = ({ label, value, tone = "default" }: { label: string; value: string | number; tone?: "default" | "alert" }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className={`text-2xl font-bold ${tone === "alert" ? "text-destructive" : "text-foreground"}`}>{value}</p>
  </div>
);

export default function AdminSeoStatus() {
  const [data, setData] = useState<Payload | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregar = () => {
    setCarregando(true);
    fetch("/indexacao-auditoria.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json: Payload) => {
        setData(json);
        setErro(null);
      })
      .catch((e: Error) =>
        setErro(
          `Relatório indisponível (${e.message}). Rode "node scripts/report-indexacao-auditoria.mjs dist" após o build.`,
        ),
      )
      .finally(() => setCarregando(false));
  };

  useEffect(carregar, []);

  const linhas = useMemo(() => {
    if (!data) return [];
    const termo = busca.trim().toLowerCase();
    return data.urls
      .filter((u) => !termo || u.path.toLowerCase().includes(termo))
      .sort((a, b) => b.anomalias.length - a.anomalias.length || a.path.localeCompare(b.path));
  }, [data, busca]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Status de SEO e indexação</h1>
            <p className="text-sm text-muted-foreground">
              Sitemap × build × submissões (IndexNow e Search Console).
              {data && ` Gerado em ${new Date(data.generatedAt).toLocaleString("pt-BR")}.`}
            </p>
          </div>
          <button
            onClick={carregar}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" /> Recarregar
          </button>
        </div>

        {carregando && (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando relatório…
          </p>
        )}
        {erro && (
          <p className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {erro}
          </p>
        )}

        {data && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card label="URLs no sitemap" value={data.totals.sitemapUrls} />
              <Card label="Com lastmod real" value={data.totals.comLastmod} />
              <Card
                label="Anomalias de rastreio"
                value={data.totals.anomalias}
                tone={data.totals.anomalias ? "alert" : "default"}
              />
              <Card
                label="noindex dentro do sitemap"
                value={data.totals.noindexNoSitemap}
                tone={data.totals.noindexNoSitemap ? "alert" : "default"}
              />
              <Card label="URLs conhecidas no IndexNow" value={data.totals.indexnowConhecidas} />
              <Card
                label="Pendentes de IndexNow"
                value={data.totals.indexnowPendentes}
                tone={data.totals.indexnowPendentes ? "alert" : "default"}
              />
              <Card label="Cobertura GSC (snapshot)" value={data.totals.gscCoverage ?? "—"} />
              <Card label="Indexadas (snapshot)" value={data.totals.gscIndexadas ?? "—"} />
              <Card label="Não avaliadas (sem build)" value={data.totals.naoAvaliadas ?? 0} />
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Histórico de envio do sitemap (Search Console)</h2>
              {data.sitemapSubmissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma submissão registrada ainda.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary text-left">
                      <tr>
                        <th className="p-2">Quando</th>
                        <th className="p-2">Propriedade</th>
                        <th className="p-2">URLs enviadas</th>
                        <th className="p-2">Erros</th>
                        <th className="p-2">Último download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sitemapSubmissions.map((s) => (
                        <tr key={s.at} className="border-t border-border">
                          <td className="p-2">{new Date(s.at).toLocaleString("pt-BR")}</td>
                          <td className="p-2">{s.site}</td>
                          <td className="p-2">{s.urlsSubmitted || "—"}</td>
                          <td className={`p-2 ${s.errors ? "text-destructive font-semibold" : ""}`}>{s.errors}</td>
                          <td className="p-2">{s.lastDownloaded ? new Date(s.lastDownloaded).toLocaleString("pt-BR") : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Send className="h-4 w-4" /> Últimas submissões ao IndexNow
              </h2>
              <ul className="grid gap-1 text-sm md:grid-cols-2">
                {data.indexnow.ultimasSubmissoes.slice(0, 20).map((s) => (
                  <li key={s.path} className="flex justify-between gap-3 rounded border border-border px-3 py-1.5">
                    <span className="truncate font-mono text-xs">{s.path}</span>
                    <span className="text-muted-foreground text-xs">
                      {s.lastSubmitted ? new Date(s.lastSubmitted).toLocaleDateString("pt-BR") : "—"} · {s.submissions}x
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-lg font-semibold text-foreground">Integridade por URL antes do ar</h2>
                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Filtrar por caminho…"
                  className="max-w-xs"
                />
              </div>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left">
                    <tr>
                      <th className="p-2">URL</th>
                      <th className="p-2">Sitemap</th>
                      <th className="p-2">lastmod</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((u) => (
                      <tr key={u.path} className="border-t border-border align-top">
                        <td className="p-2 font-mono text-xs">{u.path}</td>
                        <td className="p-2 text-xs text-muted-foreground">{u.sitemap}</td>
                        <td className="p-2 text-xs">{u.lastmod ?? "—"}</td>
                        <td className="p-2">
                          {u.anomalias.length === 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" /> OK
                            </span>
                          ) : (
                            <ul className="space-y-0.5 text-xs text-destructive">
                              {u.anomalias.map((a) => (
                                <li key={a}>• {a}</li>
                              ))}
                            </ul>
                          )}
                        </td>
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
