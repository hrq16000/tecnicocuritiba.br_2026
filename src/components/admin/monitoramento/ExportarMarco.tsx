import { useMemo, useState } from "react";
import { Download, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPdf, downloadBlob } from "@/lib/pdfDoc";
import { ESTADO_LABEL, SEM_DADO, type MarcoResumo } from "./types";

/**
 * Exportação de um marco (D0/D7/D14/D30) em CSV ou PDF.
 *
 * Exporta exatamente o que o snapshot congelou: funil, clusters, tiers,
 * transições em relação ao marco anterior, Tier A e alertas operacionais.
 * Nada é recalculado nem estimado — ausência vira "sem dado".
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

export interface MarcoExportavel extends MarcoResumo {
  nota?: string | null;
  commit?: string | null;
  denominador?: { curadas: number };
  google?: Record<string, number | string | null>;
  clusters?: Grupo[];
  tiers?: Grupo[];
}

interface Alerta {
  id: string;
  severidade: string;
  mensagem: string;
}

const csvEscape = (v: unknown) => {
  const s = v === null || v === undefined || v === "" ? SEM_DADO : String(v);
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function baixarTexto(conteudo: string, nome: string, mime: string) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Transições entre o marco anterior e o marco exportado, URL a URL. */
export function calcularTransicoes(
  anterior: MarcoResumo | null,
  atual: MarcoResumo | null,
) {
  if (!atual?.urls?.length) return [];
  const antes = new Map((anterior?.urls ?? []).map((u) => [u.path, u.estado]));
  return atual.urls.map((u) => {
    const de = antes.get(u.path) ?? null;
    return {
      path: u.path,
      cluster: u.cluster,
      tier: u.tier,
      de,
      para: u.estado,
      transicao: de ? `${de.toUpperCase()} → ${u.estado.toUpperCase()}` : SEM_DADO,
      mudou: Boolean(de) && de !== u.estado,
      impressions: u.impressions,
      clicks: u.clicks,
    };
  });
}

export function ExportarMarco({
  marcos,
  alertas,
}: {
  marcos: MarcoExportavel[];
  alertas?: Alerta[];
}) {
  const [selecionado, setSelecionado] = useState<string>(
    marcos[marcos.length - 1]?.marco ?? "",
  );
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const idx = marcos.findIndex((m) => m.marco === selecionado);
  const marco = idx >= 0 ? marcos[idx] : null;
  const anterior = idx > 0 ? marcos[idx - 1] : null;

  const transicoes = useMemo(
    () => calcularTransicoes(anterior, marco),
    [anterior, marco],
  );
  const tierA = useMemo(
    () => (marco?.urls ?? []).filter((u) => u.tier === "A"),
    [marco],
  );

  if (!marco) return null;

  const resumoTransicoes = transicoes.reduce<Record<string, number>>((acc, t) => {
    acc[t.transicao] = (acc[t.transicao] ?? 0) + 1;
    return acc;
  }, {});

  const exportarCsv = () => {
    const linhas: string[] = [];
    const bloco = (titulo: string, cabecalho: string[], dados: unknown[][]) => {
      linhas.push(`# ${titulo}`);
      linhas.push(cabecalho.join(";"));
      for (const d of dados) linhas.push(d.map(csvEscape).join(";"));
      linhas.push("");
    };

    bloco("Marco", ["campo", "valor"], [
      ["marco", marco.marco],
      ["registrado_em", marco.registradoEm],
      ["urls_curadas", marco.denominador?.curadas ?? null],
      ["nota", marco.nota ?? null],
      ["commit", marco.commit ?? null],
    ]);

    bloco("Funil Google", ["estado", "urls"],
      Object.entries(marco.google ?? {}).map(([k, v]) => [k, v]));

    bloco("Clusters", ["cluster", "total", "indexadas", "taxa_%", "unknown", "discovered", "crawled_not_indexed", "impressoes", "cliques", "posicao_media"],
      (marco.clusters ?? []).map((c) => [c.chave, c.total, c.indexadas, c.taxaIndexacao, c.unknown, c.discovered, c.crawledNaoIndexadas, c.impressoes, c.cliques, c.posicaoMedia]));

    bloco("Tiers", ["tier", "total", "indexadas", "taxa_%", "unknown", "discovered", "crawled_not_indexed"],
      (marco.tiers ?? []).map((t) => [t.chave, t.total, t.indexadas, t.taxaIndexacao, t.unknown, t.discovered, t.crawledNaoIndexadas]));

    bloco("Transicoes (resumo)", ["transicao", "urls"],
      Object.entries(resumoTransicoes).sort((a, b) => b[1] - a[1]));

    bloco("Transicoes (por URL)", ["url", "cluster", "tier", "de", "para", "impressoes", "cliques"],
      transicoes.map((t) => [t.path, t.cluster, t.tier, t.de, t.para, t.impressions, t.clicks]));

    bloco("Tier A", ["url", "cluster", "estado", "cobertura_gsc", "ultimo_crawl", "inbound", "inbound_contextual", "impressoes", "cliques", "posicao"],
      tierA.map((u) => [u.path, u.cluster, u.estado, u.gscCoverage, u.lastCrawl, u.inbound, u.inboundContextual, u.impressions, u.clicks, u.position]));

    bloco("Alertas", ["id", "severidade", "mensagem"],
      (alertas ?? []).map((a) => [a.id, a.severidade, a.mensagem]));

    baixarTexto(
      `\uFEFF${linhas.join("\n")}`,
      `marco-${marco.marco.toLowerCase()}-${marco.registradoEm.slice(0, 10)}.csv`,
      "text/csv;charset=utf-8",
    );
  };

  const exportarPdf = async () => {
    setGerandoPdf(true);
    try {
      const pdf = await createPdf();
      pdf.title(`Marco ${marco.marco} — monitoramento operacional`);
      pdf.paragraph(
        `Registrado em ${new Date(marco.registradoEm).toLocaleString("pt-BR")} · ${marco.denominador?.curadas ?? SEM_DADO} URLs curadas`,
        { muted: true },
      );
      if (marco.nota) pdf.paragraph(marco.nota, { muted: true });
      pdf.rule();

      pdf.heading("Funil de indexação");
      for (const [k, v] of Object.entries(marco.google ?? {}))
        pdf.keyValue(ESTADO_LABEL[k] ?? k, v === null || v === "" ? SEM_DADO : String(v));

      pdf.heading("Clusters");
      for (const c of marco.clusters ?? [])
        pdf.bullet(
          `${c.chave}: ${c.indexadas}/${c.total} indexadas (${c.taxaIndexacao ?? SEM_DADO}%)`,
          `unknown ${c.unknown} · discovered ${c.discovered} · crawled-not-indexed ${c.crawledNaoIndexadas} · impressões ${c.impressoes}`,
        );

      pdf.heading(`Transições em relação a ${anterior?.marco ?? "marco anterior"}`);
      if (!anterior) pdf.paragraph(`${SEM_DADO} — não há marco anterior com estados por URL.`, { muted: true });
      for (const [t, n] of Object.entries(resumoTransicoes).sort((a, b) => b[1] - a[1]))
        pdf.keyValue(t, `${n} URL(s)`);
      const mudaram = transicoes.filter((t) => t.mudou);
      if (mudaram.length) {
        pdf.paragraph("URLs que mudaram de estado:");
        for (const t of mudaram.slice(0, 60)) pdf.bullet(t.path, t.transicao);
      }

      pdf.heading(`Tier A (${tierA.filter((u) => u.estado === "indexed").length}/${tierA.length} indexadas)`);
      for (const u of tierA)
        pdf.bullet(
          `${u.path} — ${ESTADO_LABEL[u.estado] ?? u.estado}`,
          `crawl ${u.lastCrawl ?? SEM_DADO} · inbound ${u.inbound ?? SEM_DADO} · impressões ${u.impressions}`,
        );

      pdf.heading("Alertas operacionais");
      if (!alertas?.length) pdf.paragraph("Nenhum alerta ativo neste marco.", { muted: true });
      for (const a of alertas ?? []) pdf.bullet(`[${a.severidade}] ${a.id}`, a.mensagem);

      pdf.footer(`tecnico.curitiba.br · marco ${marco.marco} · documento interno`);
      downloadBlob(pdf.blob(), `marco-${marco.marco.toLowerCase()}-${marco.registradoEm.slice(0, 10)}.pdf`);
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <section className="mt-10 rounded-xl border border-border bg-card p-4 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Exportar marco</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Tabelas do funil, clusters, tiers, transições, Tier A e alertas —
            exatamente como congelados no snapshot.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selecionado}
            onChange={(e) => setSelecionado(e.target.value)}
            aria-label="Marco a exportar"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
          >
            {marcos.map((m) => (
              <option key={m.marco} value={m.marco}>
                {m.marco} · {new Date(m.registradoEm).toLocaleDateString("pt-BR")}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={exportarCsv}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            CSV
          </Button>
          <Button size="sm" onClick={() => void exportarPdf()} disabled={gerandoPdf}>
            {gerandoPdf ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            PDF
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ExportarMarco;
