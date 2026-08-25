import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SEM_DADO } from "./types";

/**
 * Triagem dos alertas operacionais como verdadeiro ou falso positivo.
 *
 * Cada classificação exige justificativa e fica ligada ao cluster/URL afetado,
 * ao marco e à assinatura do conjunto de alertas — assim o histórico mostra se
 * um limiar está gerando ruído recorrente antes de qualquer ajuste.
 *
 * Fonte dos alertas: `public/operational-alerts.json`
 * (scripts/monitor-operational-alerts.mjs). Persistência: `alerta_classificacoes`.
 */

interface Alerta {
  id: string;
  severidade: string;
  mensagem: string;
  cluster?: string | null;
  url?: string | null;
}

interface EstadoAlertas {
  avaliadoEm: string;
  assinatura: string;
  alertas: Alerta[];
}

interface Classificacao {
  id: string;
  alerta_id: string;
  assinatura: string | null;
  marco: string | null;
  cluster: string | null;
  url_path: string | null;
  severidade: string | null;
  mensagem: string | null;
  classificacao: string;
  justificativa: string;
  created_at: string;
}

const SEVERIDADE_CLASSE: Record<string, string> = {
  alta: "text-destructive",
  critica: "text-destructive",
  media: "text-amber-600",
  baixa: "text-muted-foreground",
};

export function ClassificacaoAlertas({ marcoAtual }: { marcoAtual: string | null }) {
  const [estado, setEstado] = useState<EstadoAlertas | null>(null);
  const [registros, setRegistros] = useState<Classificacao[] | null>(null);
  const [aberto, setAberto] = useState<string | null>(null);
  const [form, setForm] = useState({ classificacao: "true_positive", justificativa: "", cluster: "", url: "" });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch(`/operational-alerts.json?t=${Date.now()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setEstado(j))
      .catch(() => setEstado(null));
  }, []);

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from("alerta_classificacoes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setRegistros(null);
      return;
    }
    setRegistros((data ?? []) as Classificacao[]);
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const porAlerta = useMemo(() => {
    const mapa = new Map<string, Classificacao>();
    for (const r of registros ?? []) if (!mapa.has(r.alerta_id)) mapa.set(r.alerta_id, r);
    return mapa;
  }, [registros]);

  const salvar = async (alerta: Alerta) => {
    if (!form.justificativa.trim()) {
      toast.error("A justificativa é obrigatória.");
      return;
    }
    setSalvando(true);
    const { data: sessao } = await supabase.auth.getUser();
    const { error } = await supabase.from("alerta_classificacoes").insert({
      alerta_id: alerta.id,
      assinatura: estado?.assinatura ?? null,
      marco: marcoAtual,
      cluster: form.cluster.trim() || alerta.cluster || null,
      url_path: form.url.trim() || alerta.url || null,
      severidade: alerta.severidade,
      mensagem: alerta.mensagem,
      classificacao: form.classificacao,
      justificativa: form.justificativa.trim(),
      classificado_por: sessao.user?.id ?? null,
      classificado_por_email: sessao.user?.email ?? null,
    });
    setSalvando(false);
    if (error) {
      toast.error(`Não foi possível salvar: ${error.message}`);
      return;
    }
    toast.success("Alerta classificado.");
    setForm({ classificacao: "true_positive", justificativa: "", cluster: "", url: "" });
    setAberto(null);
    void carregar();
  };

  return (
    <section id="alertas" className="mt-10 scroll-mt-24">
      <h2 className="text-lg font-semibold">Alertas e classificação</h2>
      <p className="text-sm text-muted-foreground">
        Cada alerta ativo precisa ser classificado como verdadeiro ou falso
        positivo, com justificativa e o cluster/URL afetado.
      </p>

      {!estado ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {SEM_DADO} — rode <code>npm run monitor:operacao</code> para gerar o
          estado de alertas.
        </p>
      ) : (
        <>
          <p className="mt-3 text-xs text-muted-foreground">
            Avaliado em {new Date(estado.avaliadoEm).toLocaleString("pt-BR")} ·
            assinatura <code>{estado.assinatura.slice(0, 12)}</code>
          </p>
          {estado.alertas.length === 0 ? (
            <p className="mt-3 text-sm text-emerald-600">
              Nenhum alerta ativo — operação dentro dos limiares.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {estado.alertas.map((a) => {
                const ja = porAlerta.get(a.id);
                return (
                  <article key={a.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          <span className={SEVERIDADE_CLASSE[a.severidade] ?? ""}>
                            [{a.severidade}]
                          </span>{" "}
                          {a.id}
                        </p>
                        <p className="text-sm text-muted-foreground">{a.mensagem}</p>
                        {ja && (
                          <p className="mt-1 text-xs">
                            Classificado como{" "}
                            <strong>
                              {ja.classificacao === "true_positive"
                                ? "verdadeiro positivo"
                                : "falso positivo"}
                            </strong>{" "}
                            em {new Date(ja.created_at).toLocaleString("pt-BR")} — {ja.justificativa}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={aberto === a.id ? "secondary" : "outline"}
                        onClick={() => setAberto(aberto === a.id ? null : a.id)}
                      >
                        {aberto === a.id ? "Cancelar" : ja ? "Reclassificar" : "Classificar"}
                      </Button>
                    </div>

                    {aberto === a.id && (
                      <div className="mt-3 grid gap-3">
                        <div className="flex gap-2">
                          {[
                            { v: "true_positive", l: "Verdadeiro positivo" },
                            { v: "false_positive", l: "Falso positivo" },
                          ].map((o) => (
                            <button
                              key={o.v}
                              type="button"
                              onClick={() => setForm({ ...form, classificacao: o.v })}
                              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                form.classificacao === o.v
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {o.l}
                            </button>
                          ))}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            placeholder="Cluster afetado (opcional)"
                            value={form.cluster}
                            onChange={(e) => setForm({ ...form, cluster: e.target.value })}
                          />
                          <Input
                            placeholder="URL afetada (opcional)"
                            value={form.url}
                            onChange={(e) => setForm({ ...form, url: e.target.value })}
                          />
                        </div>
                        <Textarea
                          placeholder="Justificativa — que evidência sustenta essa classificação"
                          value={form.justificativa}
                          onChange={(e) => setForm({ ...form, justificativa: e.target.value })}
                        />
                        <div>
                          <Button size="sm" disabled={salvando} onClick={() => salvar(a)}>
                            {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar classificação
                          </Button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {registros && registros.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Quando</th>
                <th className="p-3">Alerta</th>
                <th className="p-3">Marco</th>
                <th className="p-3">Cluster / URL</th>
                <th className="p-3">Classificação</th>
                <th className="p-3">Justificativa</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-3 font-mono text-xs">{r.alerta_id}</td>
                  <td className="p-3">{r.marco ?? "—"}</td>
                  <td className="p-3 font-mono text-xs">
                    {r.cluster ?? "—"}
                    {r.url_path ? ` · ${r.url_path}` : ""}
                  </td>
                  <td className="p-3">
                    {r.classificacao === "true_positive" ? (
                      <span className="text-destructive">verdadeiro positivo</span>
                    ) : (
                      <span className="text-muted-foreground">falso positivo</span>
                    )}
                  </td>
                  <td className="p-3">{r.justificativa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
