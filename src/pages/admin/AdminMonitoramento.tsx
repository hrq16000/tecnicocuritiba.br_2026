import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Download,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { DrilldownUrls } from "@/components/admin/monitoramento/DrilldownUrls";
import { DiffSnapshots } from "@/components/admin/monitoramento/DiffSnapshots";
import { ComparacaoMarcos } from "@/components/admin/monitoramento/ComparacaoMarcos";
import { ExportarMarco } from "@/components/admin/monitoramento/ExportarMarco";
import { JobRuns } from "@/components/admin/monitoramento/JobRuns";
import { QuickWinsBacklog } from "@/components/admin/monitoramento/QuickWinsBacklog";
import { TendenciasMarcos } from "@/components/admin/monitoramento/TendenciasMarcos";
import { ExperimentosControlados } from "@/components/admin/monitoramento/ExperimentosControlados";
import { ClassificacaoAlertas } from "@/components/admin/monitoramento/ClassificacaoAlertas";
import { ResumoDiarioAlertas } from "@/components/admin/monitoramento/ResumoDiarioAlertas";
import { ReindexContencao } from "@/components/admin/monitoramento/ReindexContencao";
import { IntervencoesRegistradas } from "@/components/admin/monitoramento/IntervencoesRegistradas";
import { FreezeV2Status } from "@/components/admin/monitoramento/FreezeV2Status";

import type { MarcoUrl } from "@/components/admin/monitoramento/types";
import { Navigate } from "@/lib/router-compat";
import { useAdminAuth } from "@/hooks/useAdminAuth";

/**
 * Painel interno de monitoramento operacional D0 → D7 → D14 → D30.
 *
 * Lê `public/operacao-marcos.json`, gerado por `scripts/snapshot-marco.mjs`.
 * Regra da fase de operação: o painel não calcula nada por conta própria e
 * nunca preenche lacuna com zero — fonte ausente aparece como "sem dado".
 *
 * Rota interna: noindex, sem link público.
 */

interface Grupo {
  chave: string;
  total: number;
  indexadas: number;
  unknown: number;
  discovered: number;
  crawledNaoIndexadas: number;
  taxaIndexacao: number | null;
  impressoes: number;
  cliques: number;
  posicaoMedia: number | null;
}

interface Marco {
  marco: string;
  registradoEm: string;
  nota: string | null;
  deploymentId: string | null;
  commit: string | null;
  denominador: { curadas: number; observacao: string };
  google: {
    indexed: number;
    unknown: number;
    discovered: number;
    crawled_not_indexed: number;
    duplicate: number;
    redirect: number;
    soft_404: number;
    canonical_different: number;
    outros: number;
    impressoes28d: number;
    cliques28d: number;
    ctr28d: number | null;
    posicaoMedia28d: number | null;
    erro: string | null;
  };
  clusters: Grupo[];
  tiers: Grupo[];
  qualidade: { faixas: Record<string, number>; piso: unknown } | null;
  doorway: {
    alto: number | null;
    medio: number | null;
    baixo: number | null;
  } | null;
  grafo: {
    urls: number;
    orfas: number;
    subLinkadas: number;
    linksParaRedirect: number;
  } | null;
  consolidacao: { total: number; pass: number; falhas: number } | null;
  indexnow: {
    executadoEm: string | null;
    eligible: number | null;
    submitted: number;
    accepted: number | null;
    failed: number | null;
  } | null;
  bing: Record<string, unknown> | null;
  serpSignals: { geradoEm: string | null; urls: number } | null;
  serpSnapshot: string | null;
  /** Estado por URL congelado no marco (ausente em marcos antigos). */
  urls?: MarcoUrl[];
}

interface SnapshotIndex {
  geradoEm: string;
  verificacao: {
    status: "ok" | "falhou";
    executadoEm: string;
    marcos: string[];
    totalEntradas: number;
    memorias: number;
    urlsCuradas: number | null;
    urlsNoMarcoAtual: number | null;
    amostragem: { solicitada: number; conferidas: number; ok: boolean };
    falhas: string[];
    avisos: string[];
  };
  itens: { tipo: string; path: string; marco?: string; hash: string }[];
}

interface Payload {
  atualizadoEm?: string;
  marcos: Marco[];
}

const SEM_DADO = <span className="text-muted-foreground">sem dado</span>;
const ORDEM = ["D0", "D7", "D14", "D30"];

function baixar(
  nome: string,
  conteudo: string,
  tipo = "text/csv;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminMonitoramento() {
  /* Evidência operacional (checklists, exports, logs de job, alertas) não é
   * conteúdo público: sem sessão admin o painel não renderiza nada. */
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [data, setData] = useState<Payload | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [detalhe, setDetalhe] = useState<"tiers" | "clusters">("tiers");
  // Alertas por cluster linkam para /admin/monitoramento?cluster=SERVICO
  // (lido após a hidratação para não divergir do HTML do servidor).
  const [clusterInicial, setClusterInicial] = useState<string | null>(null);
  useEffect(() => {
    setClusterInicial(
      new URLSearchParams(window.location.search).get("cluster"),
    );
  }, []);

  const carregar = () => {
    setCarregando(true);
    fetch(`/operacao-marcos.json?t=${Date.now()}`)
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

  // Verificação da reindexação de memórias/snapshots (scripts/reindex-snapshots.mjs).
  const [indice, setIndice] = useState<SnapshotIndex | null>(null);
  useEffect(() => {
    fetch(`/snapshot-index.json?t=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setIndice(j))
      .catch(() => setIndice(null));
  }, []);

  const marcos = useMemo(
    () =>
      (data?.marcos ?? [])
        .slice()
        .sort((a, b) => ORDEM.indexOf(a.marco) - ORDEM.indexOf(b.marco)),
    [data],
  );
  const atual = marcos[marcos.length - 1] ?? null;
  const d0 = marcos.find((m) => m.marco === "D0") ?? null;

  /** Série para os gráficos: só marcos realmente registrados. */
  const serie = useMemo(
    () =>
      marcos.map((m) => {
        const tierA = m.tiers.find((t) => t.chave === "A");
        return {
          marco: m.marco,
          "Tier A indexado (%)": tierA?.taxaIndexacao ?? null,
          Unknown: m.google.unknown,
          "Crawled not indexed": m.google.crawled_not_indexed,
          Indexadas: m.google.indexed,
          Impressões: m.google.impressoes28d,
          Cliques: m.google.cliques28d,
        };
      }),
    [marcos],
  );

  const exportarCsv = () => {
    const cab = [
      "marco",
      "registrado_em",
      "curadas",
      "indexadas",
      "unknown",
      "discovered",
      "crawled_not_indexed",
      "duplicate",
      "redirect",
      "soft_404",
      "impressoes_28d",
      "cliques_28d",
      "ctr_28d",
      "posicao_media_28d",
      "tier_a_total",
      "tier_a_indexadas",
      "tier_a_taxa",
      "doorway_alto",
      "links_para_redirect",
      "indexnow_submitted",
    ];
    const linhas = marcos.map((m) => {
      const a = m.tiers.find((t) => t.chave === "A");
      return [
        m.marco,
        m.registradoEm,
        m.denominador.curadas,
        m.google.indexed,
        m.google.unknown,
        m.google.discovered,
        m.google.crawled_not_indexed,
        m.google.duplicate,
        m.google.redirect,
        m.google.soft_404,
        m.google.impressoes28d,
        m.google.cliques28d,
        m.google.ctr28d ?? "",
        m.google.posicaoMedia28d ?? "",
        a?.total ?? "",
        a?.indexadas ?? "",
        a?.taxaIndexacao ?? "",
        m.doorway?.alto ?? "",
        m.grafo?.linksParaRedirect ?? "",
        m.indexnow?.submitted ?? "",
      ].join(",");
    });
    baixar(
      `operacao-marcos-${new Date().toISOString().slice(0, 10)}.csv`,
      [cab.join(","), ...linhas].join("\n"),
    );
  };

  const exportarDetalheCsv = () => {
    if (!atual) return;
    const lista = detalhe === "tiers" ? atual.tiers : atual.clusters;
    const cab = [
      "marco",
      detalhe === "tiers" ? "tier" : "cluster",
      "total",
      "indexadas",
      "unknown",
      "discovered",
      "crawled_not_indexed",
      "taxa_indexacao",
      "impressoes",
      "cliques",
      "posicao_media",
    ];
    const linhas = lista.map((g) =>
      [
        atual.marco,
        g.chave,
        g.total,
        g.indexadas,
        g.unknown,
        g.discovered,
        g.crawledNaoIndexadas,
        g.taxaIndexacao ?? "",
        g.impressoes,
        g.cliques,
        g.posicaoMedia ?? "",
      ].join(","),
    );
    baixar(
      `operacao-${atual.marco.toLowerCase()}-${detalhe}.csv`,
      [cab.join(","), ...linhas].join("\n"),
    );
  };

  const delta = (campo: keyof Marco["google"]) => {
    if (!d0 || !atual || atual === d0) return null;
    const a = atual.google[campo];
    const b = d0.google[campo];
    if (typeof a !== "number" || typeof b !== "number") return null;
    return Math.round((a - b) * 100) / 100;
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center text-muted-foreground">
        Acesso restrito a administradores.
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-10 print:py-2">
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-semibold">
              Monitoramento operacional D0 → D30
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Baseline congelado e evolução de cobertura do conjunto curado.
              {data?.atualizadoEm
                ? ` Atualizado em ${new Date(data.atualizadoEm).toLocaleString("pt-BR")}.`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={carregar}
              disabled={carregando}
            >
              {carregando ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Recarregar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportarCsv}
              disabled={!marcos.length}
            >
              <Download className="mr-2 h-4 w-4" />
              CSV dos marcos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              disabled={!marcos.length}
            >
              <FileText className="mr-2 h-4 w-4" />
              PDF (imprimir)
            </Button>
          </div>
        </div>

        {erro && (
          <p className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Não foi possível ler os marcos ({erro}). Gere com{" "}
            <code className="mx-1">npm run snapshot:marco -- --marco=D0</code>.
          </p>
        )}

        {!erro && !carregando && !marcos.length && (
          <p className="mt-6 rounded-lg border border-border p-4 text-sm text-muted-foreground">
            Nenhum marco registrado ainda.
          </p>
        )}

        <section className="mt-8">
          <FreezeV2Status
            proximoMarcoEm={(() => {
              const d0 = marcos.find((m) => m.marco === "D0")?.registradoEm;
              return d0 ? new Date(new Date(d0).getTime() + 14 * 86400000).toISOString() : null;
            })()}
          />
        </section>

        <section className="mt-8">
          <IntervencoesRegistradas />
        </section>



        {atual && (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Conjunto curado",
                  valor: atual.denominador.curadas,
                  nota: `marco ${atual.marco}`,
                },
                {
                  label: "Indexadas",
                  valor: atual.google.indexed,
                  nota: deltaLabel(delta("indexed")),
                },
                {
                  label: "Unknown",
                  valor: atual.google.unknown,
                  nota: deltaLabel(delta("unknown"), true),
                },
                {
                  label: "Crawled not indexed",
                  valor: atual.google.crawled_not_indexed,
                  nota: deltaLabel(delta("crawled_not_indexed"), true),
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{c.valor}</p>
                  <p className="text-xs text-muted-foreground">{c.nota}</p>
                </div>
              ))}
            </section>

            <p className="mt-3 text-xs text-muted-foreground">
              {atual.denominador.observacao}
            </p>

            <section className="mt-10 grid gap-8 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-sm font-semibold">Tier A indexado (%)</h2>
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={serie}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                      <XAxis dataKey="marco" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="Tier A indexado (%)"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-sm font-semibold">Cobertura por marco</h2>
                <div className="mt-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serie}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                      <XAxis dataKey="marco" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="Indexadas" fill="hsl(var(--primary))" />
                      <Bar
                        dataKey="Unknown"
                        fill="hsl(var(--muted-foreground))"
                      />
                      <Bar
                        dataKey="Crawled not indexed"
                        fill="hsl(var(--destructive))"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="mt-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">
                  Detalhe do marco {atual.marco}
                </h2>
                <div className="flex gap-2 print:hidden">
                  <Button
                    variant={detalhe === "tiers" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDetalhe("tiers")}
                  >
                    Tiers
                  </Button>
                  <Button
                    variant={detalhe === "clusters" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDetalhe("clusters")}
                  >
                    Clusters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportarDetalheCsv}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                </div>
              </div>
              <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="p-3">
                        {detalhe === "tiers" ? "Tier" : "Cluster"}
                      </th>
                      <th className="p-3">URLs</th>
                      <th className="p-3">Indexadas</th>
                      <th className="p-3">Taxa</th>
                      <th className="p-3">Unknown</th>
                      <th className="p-3">Crawled não indexadas</th>
                      <th className="p-3">Impressões</th>
                      <th className="p-3">Cliques</th>
                      <th className="p-3">Posição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(detalhe === "tiers" ? atual.tiers : atual.clusters).map(
                      (g) => (
                        <tr key={g.chave} className="border-t border-border">
                          <td className="p-3 font-medium">{g.chave}</td>
                          <td className="p-3">{g.total}</td>
                          <td className="p-3">{g.indexadas}</td>
                          <td className="p-3">
                            {g.taxaIndexacao === null
                              ? SEM_DADO
                              : `${g.taxaIndexacao}%`}
                          </td>
                          <td className="p-3">{g.unknown}</td>
                          <td className="p-3">{g.crawledNaoIndexadas}</td>
                          <td className="p-3">{g.impressoes}</td>
                          <td className="p-3">{g.cliques}</td>
                          <td className="p-3">{g.posicaoMedia ?? SEM_DADO}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-lg font-semibold">Comparação entre marcos</h2>
              <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="p-3">Marco</th>
                      <th className="p-3">Registrado</th>
                      <th className="p-3">Curadas</th>
                      <th className="p-3">Indexadas</th>
                      <th className="p-3">Unknown</th>
                      <th className="p-3">Crawled não indexadas</th>
                      <th className="p-3">Impressões 28d</th>
                      <th className="p-3">Cliques 28d</th>
                      <th className="p-3">Posição</th>
                      <th className="p-3">SERP signals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marcos.map((m) => (
                      <tr key={m.marco} className="border-t border-border">
                        <td className="p-3 font-medium">{m.marco}</td>
                        <td className="p-3">
                          {new Date(m.registradoEm).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="p-3">{m.denominador.curadas}</td>
                        <td className="p-3">{m.google.indexed}</td>
                        <td className="p-3">{m.google.unknown}</td>
                        <td className="p-3">{m.google.crawled_not_indexed}</td>
                        <td className="p-3">{m.google.impressoes28d}</td>
                        <td className="p-3">{m.google.cliques28d}</td>
                        <td className="p-3">
                          {m.google.posicaoMedia28d ?? SEM_DADO}
                        </td>
                        <td className="p-3">
                          {m.serpSignals
                            ? `${m.serpSignals.urls} URLs congeladas`
                            : SEM_DADO}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {marcos.length < 2 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Comparação antes/depois fica disponível a partir do segundo
                  marco registrado.
                </p>
              )}
            </section>

            <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Doorway ALTO", valor: atual.doorway?.alto ?? null },
                {
                  label: "Links para redirect",
                  valor: atual.grafo?.linksParaRedirect ?? null,
                },
                {
                  label: "Redirects 301 validados",
                  valor: atual.consolidacao
                    ? `${atual.consolidacao.pass}/${atual.consolidacao.total}`
                    : null,
                },
                {
                  label: "IndexNow enviadas",
                  valor: atual.indexnow?.submitted ?? null,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    {c.valor === null ? SEM_DADO : c.valor}
                  </p>
                </div>
              ))}
            </section>

            <TendenciasMarcos marcos={marcos} />

            <DrilldownUrls
              key={clusterInicial ?? "todos"}
              marcos={marcos}
              clusterInicial={clusterInicial}
            />

            <DiffSnapshots />

            <ComparacaoMarcos marcos={marcos} />

            <ExportarMarco marcos={marcos} />

            <JobRuns />

            <QuickWinsBacklog
              marcoAtual={atual.marco}
              podeAbrir={ORDEM.indexOf(atual.marco) >= ORDEM.indexOf("D14")}
            />

            <ExperimentosControlados
              marcoAtual={atual.marco}
              podeCriar={ORDEM.indexOf(atual.marco) >= ORDEM.indexOf("D14")}
              urlsDisponiveis={(atual.urls ?? []).map((u) => u.path)}
            />

            <ResumoDiarioAlertas />

            <ClassificacaoAlertas marcoAtual={atual.marco} />

            <ReindexContencao marcoAtual={atual.marco} />


            <section className="mt-10">
              <h2 className="text-lg font-semibold">
                Reindexação de memórias e snapshots
              </h2>
              {!indice ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  sem dado — rode <code>npm run reindex:snapshots</code> para
                  gerar o índice.
                </p>
              ) : (
                <>
                  <p className="mt-2 text-sm">
                    Status:{" "}
                    <span
                      className={
                        indice.verificacao.status === "ok"
                          ? "font-semibold text-emerald-600"
                          : "font-semibold text-destructive"
                      }
                    >
                      {indice.verificacao.status === "ok"
                        ? "verificado"
                        : "reprovado"}
                    </span>{" "}
                    em{" "}
                    {new Date(indice.verificacao.executadoEm).toLocaleString(
                      "pt-BR",
                    )}
                    .
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        label: "Artefatos indexados",
                        valor: indice.verificacao.totalEntradas,
                      },
                      { label: "Memórias", valor: indice.verificacao.memorias },
                      {
                        label: "URLs conferidas",
                        valor:
                          indice.verificacao.urlsNoMarcoAtual === null
                            ? null
                            : `${indice.verificacao.urlsNoMarcoAtual}/${indice.verificacao.urlsCuradas ?? "?"}`,
                      },
                      {
                        label: "Amostragem",
                        valor: `${indice.verificacao.amostragem.conferidas} ${indice.verificacao.amostragem.ok ? "✓" : "⚠"}`,
                      },
                    ].map((c) => (
                      <div
                        key={c.label}
                        className="rounded-xl border border-border bg-card p-4"
                      >
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {c.label}
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          {c.valor === null ? SEM_DADO : c.valor}
                        </p>
                      </div>
                    ))}
                  </div>
                  {indice.verificacao.falhas.length > 0 && (
                    <ul className="mt-4 space-y-1 text-sm text-destructive">
                      {indice.verificacao.falhas.map((f) => (
                        <li key={f}>✖ {f}</li>
                      ))}
                    </ul>
                  )}
                  {indice.verificacao.avisos.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {indice.verificacao.avisos.map((a) => (
                        <li key={a}>· {a}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-left">
                        <tr>
                          <th className="p-3">Tipo</th>
                          <th className="p-3">Arquivo</th>
                          <th className="p-3">Marco</th>
                          <th className="p-3">Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {indice.itens.map((i) => (
                          <tr key={i.path} className="border-t border-border">
                            <td className="p-3">{i.tipo}</td>
                            <td className="p-3 font-mono text-xs">{i.path}</td>
                            <td className="p-3">{i.marco ?? "—"}</td>
                            <td className="p-3 font-mono text-xs">
                              {i.hash.slice(0, 10)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>

            <p className="mt-8 text-xs text-muted-foreground">
              Bing:{" "}
              {atual.bing
                ? JSON.stringify(atual.bing)
                : "N/A — sem acesso ao Bing Webmaster Tools nesta execução."}
            </p>
          </>
        )}
      </main>
    </>
  );
}

function deltaLabel(valor: number | null, menorEhMelhor = false) {
  if (valor === null) return "vs D0: sem dado";
  const sinal = valor > 0 ? "+" : "";
  const bom = menorEhMelhor ? valor <= 0 : valor >= 0;
  return `vs D0: ${sinal}${valor} ${bom ? "✓" : "⚠"}`;
}
