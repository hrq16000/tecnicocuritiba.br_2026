import { useEffect, useMemo, useState } from "react";
import { Loader2, AlertTriangle, CheckCircle2, Circle, Camera, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Painel interno de status de publicação por URL (rascunho → em prova →
 * pronto → publicado). Lê `public/publish-status.json`, gerado por
 * `scripts/generate-publish-status.mjs` a partir dos gates de originalidade,
 * prova visual real e controle de ondas.
 *
 * Rota interna: noindex, sem link público.
 */

type Estado = "rascunho" | "em-prova" | "pronto" | "publicado" | "publicado-com-pendencia";

interface UrlStatus {
  path: string;
  family: string | null;
  noSitemap: boolean;
  originalidade: { words: number | null; minWords: number | null; ok: boolean | null; reasons: string[] };
  provaVisual: { avaliada: boolean; fotos: number | null; ok: boolean | null; problems: string[] };
  onda: { week: string | null; approved: boolean | null; problems: string[] };
  bloqueios: string[];
  estado: Estado;
}

interface OndaStatus {
  week: string;
  paths: string[];
  approved: boolean;
  problems: string[];
  urls: { path: string; estado: Estado; bloqueios: string[]; ok: boolean }[];
  prontasParaLote: number;
  podeAprovarEmLote: boolean;
  liberada: boolean;
  liberadaEm: string | null;
  comando: string;
}

interface Payload {
  generatedAt: string;
  fontes: Record<string, string | null>;
  regras: { WAVE_MIN: number; WAVE_MAX: number };
  totals: Record<string, number>;
  ondas?: OndaStatus[];
  urls: UrlStatus[];
}

const ESTADOS: { id: Estado | "todos"; label: string }[] = [
  { id: "todos", label: "Todas" },
  { id: "publicado-com-pendencia", label: "Publicadas com pendência" },
  { id: "pronto", label: "Prontas para o sitemap" },
  { id: "em-prova", label: "Em prova" },
  { id: "rascunho", label: "Rascunho" },
  { id: "publicado", label: "Publicadas OK" },
];

const badge = (estado: Estado) => {
  const map: Record<Estado, string> = {
    publicado: "bg-emerald-500/15 text-emerald-600",
    "publicado-com-pendencia": "bg-red-500/15 text-red-600",
    pronto: "bg-accent/15 text-accent",
    "em-prova": "bg-amber-500/15 text-amber-600",
    rascunho: "bg-muted text-muted-foreground",
  };
  return map[estado];
};

interface AuditCheck {
  id: string;
  label: string;
  ok: boolean | null;
  detalhe: string;
}

interface AuditPayload {
  generatedAt: string;
  urls: { path: string; checklist: AuditCheck[]; aprovada: boolean }[];
}

const AdminPublishStatus = () => {
  const [data, setData] = useState<Payload | null>(null);
  const [audit, setAudit] = useState<AuditPayload | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Estado | "todos">("publicado-com-pendencia");
  const [busca, setBusca] = useState("");
  const [copiada, setCopiada] = useState<string | null>(null);

  const auditPorPath = useMemo(
    () => new Map((audit?.urls ?? []).map((u) => [u.path, u])),
    [audit],
  );


  useEffect(() => {
    document.title = "Status de publicação | Painel interno";
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";

    fetch("/publish-status.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setData)
      .catch(() => setErro("publish-status.json ainda não foi gerado. Rode `npm run report:publish-status`."));
  }, []);

  const urls = useMemo(() => {
    if (!data) return [];
    const termo = busca.trim().toLowerCase();
    return data.urls
      .filter((u) => (filtro === "todos" ? true : u.estado === filtro))
      .filter((u) => (termo ? u.path.toLowerCase().includes(termo) : true));
  }, [data, filtro, busca]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-heading font-bold">Status de publicação por URL</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Checklist consolidado antes de cada onda: originalidade do corpo, prova visual real,
          aprovação da onda e presença no sitemap curado.
        </p>

        {erro && (
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-amber-500/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" aria-hidden="true" />
            <span>{erro}</span>
          </div>
        )}

        {!data && !erro && (
          <div className="mt-10 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Carregando relatório…
          </div>
        )}

        {data && (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {Object.entries(data.totals).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border p-3">
                  <div className="text-2xl font-bold">{v}</div>
                  <div className="text-xs text-muted-foreground">{k}</div>
                </div>
              ))}
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-heading font-semibold">Aprovar onda em lote</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A liberação só fica disponível quando <strong>todas</strong> as URLs da onda passam em
                originalidade, prova visual real e provas mínimas. Enquanto não for liberada, o gerador
                mantém as URLs fora do sitemap.
              </p>

              {(data.ondas ?? []).length === 0 && (
                <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Nenhuma onda declarada em <code>scripts/lib/content-waves.mjs</code>.
                </p>
              )}

              <ul className="mt-4 space-y-3">
                {(data.ondas ?? []).map((onda) => (
                  <li key={onda.week} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          onda.liberada
                            ? "bg-emerald-500/15 text-emerald-600"
                            : onda.podeAprovarEmLote
                              ? "bg-accent/15 text-accent"
                              : "bg-amber-500/15 text-amber-600"
                        }`}
                      >
                        {onda.liberada ? "liberada" : onda.podeAprovarEmLote ? "pronta" : "bloqueada"}
                      </span>
                      <strong className="text-sm">Semana {onda.week}</strong>
                      <span className="text-xs text-muted-foreground">
                        {onda.prontasParaLote}/{onda.paths.length} URLs aprovadas
                      </span>
                      <Button
                        size="sm"
                        className="ml-auto"
                        disabled={!onda.podeAprovarEmLote || copiada === onda.week}
                        onClick={() => {
                          navigator.clipboard?.writeText(onda.comando).catch(() => undefined);
                          setCopiada(onda.week);
                          window.setTimeout(() => setCopiada(null), 2500);
                        }}
                      >
                        {onda.liberada
                          ? "Já liberada"
                          : copiada === onda.week
                            ? "Comando copiado"
                            : "Aprovar onda em lote"}
                      </Button>
                    </div>

                    {onda.podeAprovarEmLote && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Execute para gravar a liberação: <code>{onda.comando}</code>
                      </p>
                    )}
                    {onda.liberada && onda.liberadaEm && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Liberada em {new Date(onda.liberadaEm).toLocaleString("pt-BR")} — as URLs entram no
                        próximo build do sitemap.
                      </p>
                    )}

                    <ul className="mt-3 space-y-1 text-xs">
                      {onda.urls.map((u) => (
                        <li key={u.path} className="flex items-start gap-1.5">
                          {u.ok ? (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                          ) : (
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                          )}
                          <span>
                            <code>{u.path}</code>
                            {!u.ok && u.bloqueios.length > 0 && (
                              <span className="text-muted-foreground"> — {u.bloqueios.join("; ")}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {onda.problems.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-red-600">
                        {onda.problems.map((p) => (
                          <li key={p}>✗ {p}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {ESTADOS.map((e) => (
                <Button
                  key={e.id}
                  size="sm"
                  variant={filtro === e.id ? "default" : "outline"}
                  onClick={() => setFiltro(e.id)}
                >
                  {e.label}
                </Button>
              ))}
              <Input
                className="ml-auto w-full sm:w-64"
                placeholder="Filtrar por URL…"
                value={busca}
                onChange={(ev) => setBusca(ev.target.value)}
              />
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Relatório gerado em {new Date(data.generatedAt).toLocaleString("pt-BR")} · ondas de{" "}
              {data.regras.WAVE_MIN}–{data.regras.WAVE_MAX} URLs por semana
            </p>

            <ul className="mt-4 space-y-3">
              {urls.map((u) => (
                <li key={u.path} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge(u.estado)}`}>
                      {u.estado}
                    </span>
                    <code className="text-sm">{u.path}</code>
                    {u.family && <span className="text-xs text-muted-foreground">{u.family}</span>}
                  </div>

                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      corpo: {u.originalidade.words ?? "?"}/{u.originalidade.minWords ?? "?"} palavras
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                      fotos reais: {u.provaVisual.avaliada ? u.provaVisual.fotos : "não avaliada"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {u.noSitemap ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Circle className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      sitemap: {u.noSitemap ? "sim" : "fora"} {u.onda.week ? `· onda ${u.onda.week}` : ""}
                    </span>
                  </div>

                  {auditPorPath.get(u.path) && (
                    <ul className="mt-3 space-y-1 text-xs">
                      {auditPorPath.get(u.path)!.checklist.map((c) => (
                        <li key={c.id} className="flex items-start gap-1.5">
                          {c.ok === true ? (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                          ) : c.ok === false ? (
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" aria-hidden="true" />
                          ) : (
                            <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                          )}
                          <span>
                            {c.label}
                            <span className="text-muted-foreground"> — {c.detalhe}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {u.bloqueios.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs text-red-600">
                      {u.bloqueios.map((b) => (
                        <li key={b}>✗ {b}</li>
                      ))}
                    </ul>
                  )}

                </li>
              ))}
              {urls.length === 0 && (
                <li className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  Nenhuma URL neste filtro.
                </li>
              )}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPublishStatus;
