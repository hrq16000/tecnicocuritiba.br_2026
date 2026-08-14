import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Painel interno: status de indexação por rota comercial.
 * Lê `public/route-gate-status.json` (gerado por
 * `scripts/generate-route-gate-status.mjs`) e mostra, por URL, se está
 * APTA para o sitemap ou BLOQUEADA — com o motivo exato (originalidade,
 * prova visual, imagens de IA, diferenciação ou redirects).
 *
 * Rota interna: noindex, sem link público.
 */

interface Rota {
  path: string;
  apta: boolean;
  motivos: string[];
  sinais: {
    palavras: number | null;
    minPalavras: number | null;
    fotosReais: number | null;
    imagensSuspeitas: number | null;
    statusHttp: number | null;
    title: string | null;
  };
}

interface Payload {
  generatedAt: string;
  fontes: Record<string, string | null>;
  totals: { rotas: number; aptas: number; bloqueadas: number };
  rotas: Rota[];
}

type Filtro = "todas" | "aptas" | "bloqueadas";

const CATEGORIAS = ["originalidade", "prova visual", "imagens", "diferenciação", "redirects"] as const;

const categoriaDe = (motivo: string) =>
  CATEGORIAS.find((c) => motivo.startsWith(c)) ?? "outros";

export default function AdminIndexStatus() {
  const [data, setData] = useState<Payload | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("bloqueadas");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    document.title = "Status de indexação por rota | Admin";
    fetch("/route-gate-status.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setData)
      .catch((e: Error) => setErro(e.message));
  }, []);

  const rotas = useMemo(() => {
    if (!data) return [];
    const termo = busca.trim().toLowerCase();
    return data.rotas
      .filter((r) => (filtro === "todas" ? true : filtro === "aptas" ? r.apta : !r.apta))
      .filter((r) => !termo || r.path.toLowerCase().includes(termo) || r.motivos.some((m) => m.toLowerCase().includes(termo)));
  }, [data, filtro, busca]);

  const porCategoria = useMemo(() => {
    const acc = new Map<string, number>();
    for (const r of data?.rotas ?? []) {
      for (const m of r.motivos) acc.set(categoriaDe(m), (acc.get(categoriaDe(m)) ?? 0) + 1);
    }
    return [...acc.entries()].sort((a, b) => b[1] - a[1]);
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-2xl font-bold text-foreground">Status de indexação por rota</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Apta para o sitemap somente quando todos os gates passam: originalidade, prova visual real,
          ausência de indício de imagem por IA, diferenciação e redirects saudáveis.
        </p>

        {erro && (
          <p className="mt-6 flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" /> Não foi possível carregar o relatório ({erro}). Rode{" "}
            <code>npm run report:route-gates</code>.
          </p>
        )}

        {!data && !erro && (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
          </p>
        )}

        {data && (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Rotas curadas", value: data.totals.rotas },
                { label: "Aptas", value: data.totals.aptas },
                { label: "Bloqueadas", value: data.totals.bloqueadas },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{c.value}</p>
                </div>
              ))}
            </div>

            {porCategoria.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {porCategoria.map(([cat, n]) => (
                  <span key={cat} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {cat}: {n}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {(["bloqueadas", "aptas", "todas"] as Filtro[]).map((f) => (
                <Button key={f} size="sm" variant={filtro === f ? "default" : "outline"} onClick={() => setFiltro(f)}>
                  {f}
                </Button>
              ))}
              <div className="relative ml-auto w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Filtrar por rota ou motivo"
                  className="pl-9"
                  aria-label="Filtrar rotas"
                />
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {rotas.map((r) => (
                <li key={r.path} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start gap-2">
                    {r.apta ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{r.path}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.sinais.palavras ?? "—"} palavras
                        {r.sinais.minPalavras ? ` (mín. ${r.sinais.minPalavras})` : ""} ·{" "}
                        {r.sinais.fotosReais ?? "—"} foto(s) real(is) ·{" "}
                        {r.sinais.imagensSuspeitas ?? 0} imagem(ns) suspeita(s) · HTTP {r.sinais.statusHttp ?? "—"}
                      </p>
                      {r.motivos.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm text-destructive">
                          {r.motivos.map((m) => (
                            <li key={m}>• {m}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
              {rotas.length === 0 && <li className="text-sm text-muted-foreground">Nenhuma rota neste filtro.</li>}
            </ul>

            <p className="mt-6 text-xs text-muted-foreground">
              Relatório gerado em {new Date(data.generatedAt).toLocaleString("pt-BR")}. Recrawl automático das
              rotas aptas: <code>npm run indexing:request</code>.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
