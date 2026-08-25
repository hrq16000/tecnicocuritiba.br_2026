import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Minus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SEM_DADO, type MarcoUrl } from "./types";

/**
 * Checklist de auditoria manual por URL, dentro do drilldown.
 *
 * Registra QUEM conferiu e QUANDO cada item técnico (sitemap, canonical,
 * redirect, HTTP, schema, último crawl). Nada aqui altera o site: é um livro
 * de conferência humano sobre as evidências já congeladas no snapshot.
 *
 * Persistência: tabela `url_audit_checks` (somente administradores).
 */

const ITENS = [
  { id: "sitemap", label: "Sitemap" },
  { id: "canonical", label: "Canonical" },
  { id: "redirect", label: "Redirect" },
  { id: "http", label: "HTTP" },
  { id: "schema", label: "Schema" },
  { id: "last_crawl", label: "Último crawl" },
] as const;

type ItemId = (typeof ITENS)[number]["id"];
type Resultado = "ok" | "falhou" | "na";

interface Registro {
  id: string;
  item: string;
  resultado: string;
  observacao: string | null;
  conferido_por_email: string | null;
  conferido_em: string;
  marco: string | null;
}

/** Valor observado no snapshot para dar contexto imediato à conferência. */
function evidenciaDe(url: MarcoUrl, item: ItemId): string {
  switch (item) {
    case "sitemap":
      return "presente no conjunto curado";
    case "canonical":
      return url.canonical ?? SEM_DADO;
    case "redirect":
      return url.http && [301, 302, 307, 308].includes(url.http) ? `redirect ${url.http}` : "sem redirect";
    case "http":
      return url.http ? String(url.http) : SEM_DADO;
    case "schema":
      return url.noindex === null ? SEM_DADO : url.noindex ? "noindex" : "indexável";
    case "last_crawl":
      return url.lastCrawl ? new Date(url.lastCrawl).toLocaleString("pt-BR") : SEM_DADO;
  }
}

export function ChecklistAuditoria({
  url,
  marco,
}: {
  url: MarcoUrl;
  marco: string | null;
}) {
  const [registros, setRegistros] = useState<Registro[] | null>(null);
  const [salvando, setSalvando] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from("url_audit_checks")
      .select("id, item, resultado, observacao, conferido_por_email, conferido_em, marco")
      .eq("url_path", url.path)
      .order("conferido_em", { ascending: false });
    if (error) {
      setRegistros(null);
      return;
    }
    setRegistros(data ?? []);
  }, [url.path]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const registrar = async (item: ItemId, resultado: Resultado) => {
    setSalvando(`${item}-${resultado}`);
    const { data: sessao } = await supabase.auth.getUser();
    const { error } = await supabase.from("url_audit_checks").insert({
      url_path: url.path,
      marco,
      item,
      resultado,
      observacao: `valor observado: ${evidenciaDe(url, item)}`,
      evidencia: {
        canonical: url.canonical,
        http: url.http,
        lastCrawl: url.lastCrawl,
        estado: url.estado,
      },
      conferido_por: sessao.user?.id ?? null,
      conferido_por_email: sessao.user?.email ?? null,
    });
    setSalvando(null);
    if (error) toast.error(error.message);
    else {
      toast.success(`${item} conferido`);
      void carregar();
    }
  };

  const ultimo = (item: ItemId) => registros?.find((r) => r.item === item) ?? null;

  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        Checklist de auditoria (registra quem conferiu e quando)
      </p>

      {registros === null && (
        <p className="mt-2 text-xs text-muted-foreground">
          {SEM_DADO} — checklist disponível apenas para administradores
          autenticados.
        </p>
      )}

      {registros !== null && (
        <ul className="mt-3 space-y-2">
          {ITENS.map(({ id, label }) => {
            const r = ultimo(id);
            return (
              <li key={id} className="flex flex-wrap items-center gap-2 text-xs">
                <span className="w-28 font-medium">{label}</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  {evidenciaDe(url, id)}
                </span>
                <span className="text-muted-foreground">
                  {r
                    ? `${r.resultado.toUpperCase()} · ${r.conferido_por_email ?? "admin"} · ${new Date(r.conferido_em).toLocaleString("pt-BR")}`
                    : "não conferido"}
                </span>
                <span className="flex gap-1 print:hidden">
                  {(
                    [
                      ["ok", Check, "Conferido OK"],
                      ["falhou", X, "Conferido com falha"],
                      ["na", Minus, "Sem dado / não aplicável"],
                    ] as [Resultado, typeof Check, string][]
                  ).map(([res, Icone, titulo]) => (
                    <Button
                      key={res}
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      title={titulo}
                      aria-label={`${label}: ${titulo}`}
                      disabled={salvando !== null}
                      onClick={() => void registrar(id, res)}
                    >
                      {salvando === `${id}-${res}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <Icone className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </Button>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {registros && registros.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-[11px] text-muted-foreground">
            Histórico de conferências ({registros.length})
          </summary>
          <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
            {registros.slice(0, 20).map((r) => (
              <li key={r.id}>
                {new Date(r.conferido_em).toLocaleString("pt-BR")} · {r.item} ·{" "}
                {r.resultado} · {r.conferido_por_email ?? "admin"}
                {r.marco ? ` · ${r.marco}` : ""}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export default ChecklistAuditoria;
