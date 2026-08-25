import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SEM_DADO } from "./types";

/**
 * Dashboard de tendências entre marcos.
 *
 * Mostra a evolução do funil de indexação (Indexed / Unknown / Discovered /
 * Crawled-not-indexed) e da performance de busca (Impressões, Cliques, CTR,
 * posição média) em janelas equivalentes de 28 dias — a mesma janela que o
 * snapshot congela em cada marco, para que a comparação seja legítima.
 *
 * Regra: nada é interpolado. Marco sem coleta simplesmente não aparece na
 * série, e métrica ausente vira "sem dado" nos cartões de delta.
 */

interface MarcoTendencia {
  marco: string;
  registradoEm: string;
  denominador?: { curadas?: number };
  google: {
    indexed: number;
    unknown: number;
    discovered: number;
    crawled_not_indexed: number;
    impressoes28d: number;
    cliques28d: number;
    ctr28d?: number | null;
    posicaoMedia28d?: number | null;
  };
}

type Aba = "cobertura" | "performance";

function delta(a: number | null | undefined, b: number | null | undefined) {
  if (a === null || a === undefined || b === null || b === undefined) return null;
  return Math.round((b - a) * 100) / 100;
}

export function TendenciasMarcos({ marcos }: { marcos: MarcoTendencia[] }) {
  const [aba, setAba] = useState<Aba>("cobertura");

  const serie = useMemo(
    () =>
      marcos.map((m) => ({
        marco: m.marco,
        Indexadas: m.google.indexed,
        Unknown: m.google.unknown,
        Discovered: m.google.discovered,
        "Crawled n/i": m.google.crawled_not_indexed,
        Impressões: m.google.impressoes28d,
        Cliques: m.google.cliques28d,
        "CTR (%)": m.google.ctr28d ?? null,
        "Posição média": m.google.posicaoMedia28d ?? null,
      })),
    [marcos],
  );

  const primeiro = marcos[0] ?? null;
  const ultimo = marcos[marcos.length - 1] ?? null;

  const cartoes = [
    { label: "Indexadas", d: delta(primeiro?.google.indexed, ultimo?.google.indexed), atual: ultimo?.google.indexed },
    { label: "Unknown", d: delta(primeiro?.google.unknown, ultimo?.google.unknown), atual: ultimo?.google.unknown, menorEhMelhor: true },
    { label: "Discovered", d: delta(primeiro?.google.discovered, ultimo?.google.discovered), atual: ultimo?.google.discovered, menorEhMelhor: true },
    { label: "Impressões 28d", d: delta(primeiro?.google.impressoes28d, ultimo?.google.impressoes28d), atual: ultimo?.google.impressoes28d },
    { label: "Cliques 28d", d: delta(primeiro?.google.cliques28d, ultimo?.google.cliques28d), atual: ultimo?.google.cliques28d },
    { label: "CTR 28d (%)", d: delta(primeiro?.google.ctr28d, ultimo?.google.ctr28d), atual: ultimo?.google.ctr28d ?? null },
  ];

  const linhas =
    aba === "cobertura"
      ? [
          { k: "Indexadas", cor: "hsl(var(--primary))" },
          { k: "Unknown", cor: "hsl(var(--muted-foreground))" },
          { k: "Discovered", cor: "hsl(var(--chart-3, 220 70% 50%))" },
          { k: "Crawled n/i", cor: "hsl(var(--destructive))" },
        ]
      : [
          { k: "Impressões", cor: "hsl(var(--primary))" },
          { k: "Cliques", cor: "hsl(var(--destructive))" },
          { k: "CTR (%)", cor: "hsl(var(--muted-foreground))" },
        ];

  return (
    <section id="tendencias" className="mt-10 scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Tendências entre marcos</h2>
          <p className="text-sm text-muted-foreground">
            Evolução do funil de indexação e da performance em janelas de 28
            dias equivalentes. {primeiro && ultimo ? `${primeiro.marco} → ${ultimo.marco}.` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {(["cobertura", "performance"] as Aba[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAba(a)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                aba === a
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {a === "cobertura" ? "Cobertura" : "Performance"}
            </button>
          ))}
        </div>
      </div>

      {serie.length < 2 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {SEM_DADO} — são necessários ao menos dois marcos registrados para
          desenhar uma tendência.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cartoes.map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {c.label}
                </p>
                <p className="mt-2 text-xl font-semibold">
                  {c.atual === null || c.atual === undefined ? SEM_DADO : c.atual}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.d === null
                    ? `vs ${primeiro?.marco ?? "—"}: ${SEM_DADO}`
                    : `vs ${primeiro?.marco}: ${c.d > 0 ? "+" : ""}${c.d} ${
                        (c.menorEhMelhor ? c.d <= 0 : c.d >= 0) ? "✓" : "⚠"
                      }`}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 h-72 rounded-xl border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serie}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="marco" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                {linhas.map((l) => (
                  <Line
                    key={l.k}
                    type="monotone"
                    dataKey={l.k}
                    stroke={l.cor}
                    strokeWidth={2}
                    dot
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Marco</th>
                  <th className="p-3">Curadas</th>
                  <th className="p-3">Indexadas</th>
                  <th className="p-3">Unknown</th>
                  <th className="p-3">Discovered</th>
                  <th className="p-3">Crawled n/i</th>
                  <th className="p-3">Impressões</th>
                  <th className="p-3">Cliques</th>
                  <th className="p-3">CTR</th>
                  <th className="p-3">Posição</th>
                </tr>
              </thead>
              <tbody>
                {marcos.map((m) => (
                  <tr key={m.marco} className="border-t border-border">
                    <td className="p-3 font-medium">{m.marco}</td>
                    <td className="p-3">{m.denominador?.curadas ?? SEM_DADO}</td>
                    <td className="p-3">{m.google.indexed}</td>
                    <td className="p-3">{m.google.unknown}</td>
                    <td className="p-3">{m.google.discovered}</td>
                    <td className="p-3">{m.google.crawled_not_indexed}</td>
                    <td className="p-3">{m.google.impressoes28d}</td>
                    <td className="p-3">{m.google.cliques28d}</td>
                    <td className="p-3">
                      {m.google.ctr28d === null || m.google.ctr28d === undefined
                        ? SEM_DADO
                        : `${m.google.ctr28d}%`}
                    </td>
                    <td className="p-3">
                      {m.google.posicaoMedia28d ?? SEM_DADO}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
