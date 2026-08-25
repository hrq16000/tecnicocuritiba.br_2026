import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ESTADO_LABEL, SEM_DADO, type MarcoResumo, type MarcoUrl } from "./types";

/**
 * Comparação lado a lado entre dois marcos (padrão: os dois mais recentes,
 * ex.: D7 × D14) com deltas por URL, por cluster e no Tier A.
 *
 * Somente leitura sobre snapshots congelados. Nenhum número é recalculado a
 * partir de fonte viva: o que não existe no snapshot aparece como "sem dado".
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
}

interface MarcoComparavel extends MarcoResumo {
  clusters?: Grupo[];
}

const delta = (a: number | null | undefined, b: number | null | undefined) =>
  typeof a === "number" && typeof b === "number" ? b - a : null;

const Delta = ({
  valor,
  menorEhMelhor = false,
}: {
  valor: number | null;
  menorEhMelhor?: boolean;
}) => {
  if (valor === null) return <span className="text-muted-foreground">{SEM_DADO}</span>;
  if (valor === 0) return <span className="text-muted-foreground">0</span>;
  const bom = menorEhMelhor ? valor < 0 : valor > 0;
  return (
    <span className={bom ? "font-medium text-emerald-600" : "font-medium text-destructive"}>
      {valor > 0 ? "+" : ""}
      {Math.round(valor * 10) / 10}
    </span>
  );
};

export function ComparacaoMarcos({ marcos }: { marcos: MarcoComparavel[] }) {
  const comUrls = marcos.filter((m) => (m.urls?.length ?? 0) > 0);
  const [de, setDe] = useState(comUrls[comUrls.length - 2]?.marco ?? "");
  const [para, setPara] = useState(comUrls[comUrls.length - 1]?.marco ?? "");
  const [somenteMudancas, setSomenteMudancas] = useState(true);

  const A = comUrls.find((m) => m.marco === de) ?? null;
  const B = comUrls.find((m) => m.marco === para) ?? null;

  const linhas = useMemo(() => {
    if (!A || !B) return [];
    const mapaA = new Map((A.urls ?? []).map((u) => [u.path, u]));
    const paths = [...new Set([...(A.urls ?? []).map((u) => u.path), ...(B.urls ?? []).map((u) => u.path)])].sort();
    const mapaB = new Map((B.urls ?? []).map((u) => [u.path, u]));
    return paths.map((path) => {
      const a = mapaA.get(path) ?? null;
      const b = mapaB.get(path) ?? null;
      return {
        path,
        a,
        b,
        cluster: b?.cluster ?? a?.cluster ?? null,
        tier: b?.tier ?? a?.tier ?? null,
        mudouEstado: Boolean(a && b) && a?.estado !== b?.estado,
        deltaImpressoes: delta(a?.impressions, b?.impressions),
        deltaInbound: delta(a?.inbound ?? null, b?.inbound ?? null),
        deltaPosicao: delta(a?.position ?? null, b?.position ?? null),
        entrou: !a && Boolean(b),
        saiu: Boolean(a) && !b,
      };
    });
  }, [A, B]);

  const clusters = useMemo(() => {
    if (!A?.clusters || !B?.clusters) return [];
    const mapaA = new Map(A.clusters.map((c) => [c.chave, c]));
    return B.clusters.map((c) => {
      const a = mapaA.get(c.chave) ?? null;
      return {
        chave: c.chave,
        total: c.total,
        indexadasA: a?.indexadas ?? null,
        indexadasB: c.indexadas,
        deltaIndexadas: delta(a?.indexadas, c.indexadas),
        deltaTaxa: delta(a?.taxaIndexacao ?? null, c.taxaIndexacao ?? null),
        deltaImpressoes: delta(a?.impressoes, c.impressoes),
      };
    });
  }, [A, B]);

  const tierA = useMemo(() => {
    const conta = (m: MarcoComparavel | null, estado: string) =>
      m?.urls ? m.urls.filter((u) => u.tier === "A" && u.estado === estado).length : null;
    const total = (m: MarcoComparavel | null) =>
      m?.urls ? m.urls.filter((u) => u.tier === "A").length : null;
    return {
      totalA: total(A),
      totalB: total(B),
      estados: ["indexed", "discovered", "unknown", "crawled_not_indexed"].map((e) => ({
        estado: e,
        a: conta(A, e),
        b: conta(B, e),
        d: delta(conta(A, e), conta(B, e)),
      })),
      movimentacoes: linhas.filter((l) => l.tier === "A" && l.mudouEstado),
    };
  }, [A, B, linhas]);

  if (comUrls.length < 2) {
    return (
      <section id="comparacao" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold">Comparação entre marcos (deltas)</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {SEM_DADO} — são necessários dois marcos com estados por URL. O
          próximo marco desbloqueia esta tela automaticamente.
        </p>
      </section>
    );
  }

  const visiveis = somenteMudancas
    ? linhas.filter((l) => l.mudouEstado || l.entrou || l.saiu || (l.deltaImpressoes ?? 0) !== 0)
    : linhas;

  return (
    <section id="comparacao" className="mt-10 scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          Comparação {A?.marco} × {B?.marco}
        </h2>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <select
            value={de}
            onChange={(e) => setDe(e.target.value)}
            aria-label="Marco base"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
          >
            {comUrls.map((m) => (
              <option key={m.marco} value={m.marco}>{m.marco}</option>
            ))}
          </select>
          <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <select
            value={para}
            onChange={(e) => setPara(e.target.value)}
            aria-label="Marco comparado"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
          >
            {comUrls.map((m) => (
              <option key={m.marco} value={m.marco}>{m.marco}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={somenteMudancas}
              onChange={(e) => setSomenteMudancas(e.target.checked)}
            />
            Somente URLs com mudança
          </label>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {A && B
          ? `${A.marco} em ${new Date(A.registradoEm).toLocaleString("pt-BR")} · ${B.marco} em ${new Date(B.registradoEm).toLocaleString("pt-BR")}`
          : SEM_DADO}
      </p>

      {/* Tier A */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tierA.estados.map((e) => (
          <div key={e.estado} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Tier A · {ESTADO_LABEL[e.estado] ?? e.estado}
            </p>
            <p className="mt-2 text-xl font-semibold">
              {e.b === null ? SEM_DADO : `${e.b}/${tierA.totalB ?? "—"}`}
            </p>
            <p className="mt-1 text-xs">
              {A?.marco}: {e.a ?? SEM_DADO} ·{" "}
              <Delta valor={e.d} menorEhMelhor={e.estado !== "indexed"} />
            </p>
          </div>
        ))}
      </div>

      {tierA.movimentacoes.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {tierA.movimentacoes.map((m) => (
            <li key={m.path}>
              <span className="font-mono text-xs">{m.path}</span> ·{" "}
              {ESTADO_LABEL[m.a?.estado ?? ""] ?? SEM_DADO} →{" "}
              <span className="font-medium">{ESTADO_LABEL[m.b?.estado ?? ""] ?? SEM_DADO}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Clusters */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Deltas por cluster entre os marcos</caption>
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Cluster</th>
              <th className="p-3">Total</th>
              <th className="p-3">{A?.marco} indexadas</th>
              <th className="p-3">{B?.marco} indexadas</th>
              <th className="p-3">Δ indexadas</th>
              <th className="p-3">Δ taxa (pp)</th>
              <th className="p-3">Δ impressões</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((c) => (
              <tr key={c.chave} className="border-t border-border">
                <td className="p-3">{c.chave}</td>
                <td className="p-3">{c.total}</td>
                <td className="p-3">{c.indexadasA ?? SEM_DADO}</td>
                <td className="p-3">{c.indexadasB}</td>
                <td className="p-3"><Delta valor={c.deltaIndexadas} /></td>
                <td className="p-3"><Delta valor={c.deltaTaxa} /></td>
                <td className="p-3"><Delta valor={c.deltaImpressoes} /></td>
              </tr>
            ))}
            {!clusters.length && (
              <tr>
                <td colSpan={7} className="p-4 text-muted-foreground">
                  {SEM_DADO} — marcos sem agregação por cluster.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* URLs lado a lado */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Deltas por URL entre os marcos</caption>
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">URL</th>
              <th className="p-3">Cluster</th>
              <th className="p-3">Tier</th>
              <th className="p-3">{A?.marco}</th>
              <th className="p-3">{B?.marco}</th>
              <th className="p-3">Δ impr.</th>
              <th className="p-3">Δ inbound</th>
              <th className="p-3">Δ posição</th>
              <th className="p-3">Evidência</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.map((l) => (
              <tr key={l.path} className="border-t border-border align-top">
                <td className="p-3 font-mono text-xs">{l.path}</td>
                <td className="p-3 text-xs">{l.cluster ?? "—"}</td>
                <td className="p-3 text-xs">{l.tier ?? "—"}</td>
                <td className="p-3 text-xs">{l.a ? (ESTADO_LABEL[l.a.estado] ?? l.a.estado) : SEM_DADO}</td>
                <td className={`p-3 text-xs ${l.mudouEstado ? "font-semibold" : ""}`}>
                  {l.b ? (ESTADO_LABEL[l.b.estado] ?? l.b.estado) : SEM_DADO}
                </td>
                <td className="p-3 text-xs"><Delta valor={l.deltaImpressoes} /></td>
                <td className="p-3 text-xs"><Delta valor={l.deltaInbound} /></td>
                <td className="p-3 text-xs"><Delta valor={l.deltaPosicao} menorEhMelhor /></td>
                <td className="p-3 text-[11px] text-muted-foreground">
                  <Evidencia rotulo={A?.marco ?? "A"} url={l.a} />
                  <Evidencia rotulo={B?.marco ?? "B"} url={l.b} />
                </td>
              </tr>
            ))}
            {!visiveis.length && (
              <tr>
                <td colSpan={9} className="p-4 text-muted-foreground">
                  Nenhuma URL mudou de estado, impressões, inbound ou posição
                  entre {A?.marco} e {B?.marco} — estabilidade confirmada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Evidencia({ rotulo, url }: { rotulo: string; url: MarcoUrl | null }) {
  if (!url) return <span className="block">{rotulo}: {SEM_DADO}</span>;
  return (
    <span className="block">
      {rotulo}: crawl {url.lastCrawl ? new Date(url.lastCrawl).toLocaleDateString("pt-BR") : SEM_DADO} · canonical{" "}
      {url.canonicalSelf === null ? SEM_DADO : url.canonicalSelf ? "self" : "externo"} · HTTP{" "}
      {url.http ?? SEM_DADO}
    </span>
  );
}

export default ComparacaoMarcos;
