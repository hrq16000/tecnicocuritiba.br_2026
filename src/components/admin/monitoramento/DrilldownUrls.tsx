import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ESTADO_LABEL,
  SEM_DADO,
  type MarcoResumo,
  type MarcoUrl,
} from "./types";
import { ChecklistAuditoria } from "./ChecklistAuditoria";

/**
 * Drilldown por URL: cada URL curada com o estado registrado em cada marco,
 * a transição entre eles e as evidências técnicas congeladas no snapshot.
 *
 * Somente leitura — nenhuma ação daqui altera site, sitemap ou IndexNow.
 * Marco sem estados por URL (registrado antes desta instrumentação) aparece
 * como "sem dado", nunca como zero.
 */

const ESTADOS = ["indexed", "discovered", "unknown", "crawled_not_indexed"];

const corEstado = (estado: string | undefined) => {
  if (estado === "indexed") return "text-emerald-600";
  if (estado === "crawled_not_indexed" || estado === "soft_404")
    return "text-destructive";
  if (estado === "discovered") return "text-amber-600";
  return "text-muted-foreground";
};

export function DrilldownUrls({
  marcos,
  clusterInicial,
}: {
  marcos: MarcoResumo[];
  clusterInicial?: string | null;
}) {
  const [busca, setBusca] = useState("");
  const [cluster, setCluster] = useState(clusterInicial ?? "todos");
  const [tier, setTier] = useState("todos");
  const [estado, setEstado] = useState("todos");
  const [aberta, setAberta] = useState<string | null>(null);

  const comUrls = marcos.filter((m) => (m.urls?.length ?? 0) > 0);
  const ultimo = comUrls[comUrls.length - 1] ?? null;

  const linhas = useMemo(() => {
    if (!ultimo?.urls) return [];
    const porMarco = new Map(
      comUrls.map((m) => [
        m.marco,
        new Map((m.urls ?? []).map((u) => [u.path, u])),
      ]),
    );
    return ultimo.urls.map((u) => ({
      atual: u,
      estados: comUrls.map((m) => ({
        marco: m.marco,
        estado: porMarco.get(m.marco)?.get(u.path)?.estado ?? null,
      })),
    }));
  }, [comUrls, ultimo]);

  const clusters = useMemo(
    () => [...new Set(linhas.map((l) => l.atual.cluster ?? "—"))].sort(),
    [linhas],
  );
  const tiers = useMemo(
    () => [...new Set(linhas.map((l) => l.atual.tier ?? "—"))].sort(),
    [linhas],
  );

  const filtradas = linhas.filter((l) => {
    const u = l.atual;
    if (busca && !u.path.toLowerCase().includes(busca.toLowerCase()))
      return false;
    if (cluster !== "todos" && (u.cluster ?? "—") !== cluster) return false;
    if (tier !== "todos" && (u.tier ?? "—") !== tier) return false;
    if (estado !== "todos" && u.estado !== estado) return false;
    return true;
  });

  if (!ultimo) {
    return (
      <section id="drilldown" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold">Drilldown por URL</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {SEM_DADO} — nenhum marco registrou estados por URL ainda. Rode{" "}
          <code>npm run snapshot:marco -- --marco=D7 --overwrite</code>.
        </p>
      </section>
    );
  }

  return (
    <section id="drilldown" className="mt-10 scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          Drilldown por URL ({filtradas.length})
        </h2>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar caminho…"
              className="h-9 w-56 pl-8"
              aria-label="Buscar URL"
            />
          </div>
          <select
            value={cluster}
            onChange={(e) => setCluster(e.target.value)}
            aria-label="Filtrar por cluster"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
          >
            <option value="todos">Todos os clusters</option>
            {clusters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            aria-label="Filtrar por tier"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
          >
            <option value="todos">Todos os tiers</option>
            {tiers.map((t) => (
              <option key={t} value={t}>
                Tier {t}
              </option>
            ))}
          </select>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            aria-label="Filtrar por estado"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
          >
            <option value="todos">Todos os estados</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {ESTADO_LABEL[e]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">URL</th>
              <th className="p-3">Cluster</th>
              <th className="p-3">Tier</th>
              {comUrls.map((m) => (
                <th key={m.marco} className="p-3">
                  {m.marco}
                </th>
              ))}
              <th className="p-3">Impr.</th>
              <th className="p-3">Cliques</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((l) => {
              const u = l.atual;
              const expandida = aberta === u.path;
              return (
                <FragmentRow
                  key={u.path}
                  url={u}
                  estados={l.estados}
                  marco={ultimo.marco}
                  expandida={expandida}
                  onToggle={() => setAberta(expandida ? null : u.path)}
                />
              );
            })}
            {!filtradas.length && (
              <tr>
                <td
                  className="p-4 text-muted-foreground"
                  colSpan={5 + comUrls.length}
                >
                  Nenhuma URL para os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FragmentRow({
  url,
  estados,
  marco,
  expandida,
  onToggle,
}: {
  url: MarcoUrl;
  estados: { marco: string; estado: string | null }[];
  marco: string | null;
  expandida: boolean;
  onToggle: () => void;
}) {
  const evidencias: [string, string | number | null][] = [
    ["Cobertura GSC", url.gscCoverage],
    [
      "Último crawl",
      url.lastCrawl ? new Date(url.lastCrawl).toLocaleString("pt-BR") : null,
    ],
    ["HTTP", url.http],
    ["TTFB (ms)", url.ttfbMs],
    ["Canonical", url.canonical],
    [
      "Canonical self",
      url.canonicalSelf === null ? null : url.canonicalSelf ? "sim" : "não",
    ],
    ["Canonical do Google", url.googleCanonical],
    ["noindex", url.noindex === null ? null : url.noindex ? "sim" : "não"],
    ["Links internos", url.inbound],
    ["Links contextuais", url.inboundContextual],
    ["Profundidade", url.depth],
    ["lastmod", url.lastmod],
    ["Posição média", url.position],
  ];

  return (
    <>
      <tr className="border-t border-border">
        <td className="p-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-1 text-left font-mono text-xs hover:underline"
          >
            {expandida ? (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {url.path}
          </button>
        </td>
        <td className="p-3 text-xs">{url.cluster ?? "—"}</td>
        <td className="p-3 text-xs">{url.tier ?? "—"}</td>
        {estados.map((e) => (
          <td
            key={e.marco}
            className={`p-3 text-xs ${corEstado(e.estado ?? undefined)}`}
          >
            {e.estado ? (ESTADO_LABEL[e.estado] ?? e.estado) : SEM_DADO}
          </td>
        ))}
        <td className="p-3">{url.impressions}</td>
        <td className="p-3">{url.clicks}</td>
      </tr>
      {expandida && (
        <tr className="border-t border-border bg-muted/30">
          <td colSpan={5 + estados.length} className="p-4">
            <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {evidencias.map(([label, valor]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="truncate text-xs">
                    {valor === null || valor === "" ? SEM_DADO : String(valor)}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 flex gap-2 print:hidden">
              <Button asChild variant="outline" size="sm">
                <a href={url.path} target="_blank" rel="noreferrer">
                  Abrir página
                </a>
              </Button>
            </div>
            <ChecklistAuditoria url={url} marco={marco} />
          </td>
        </tr>
      )}
    </>
  );
}

export default DrilldownUrls;
