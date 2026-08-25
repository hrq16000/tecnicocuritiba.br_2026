import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SEM_DADO } from "./types";

/**
 * Planejamento e execução de experimentos controlados (decisão "C / INVESTIGATE").
 *
 * Governança da fase de observação:
 *  - UMA mudança única por experimento — se houver duas, são dois experimentos;
 *  - TEST GROUP e CONTROL GROUP explícitos, sem sobreposição de URLs;
 *  - métrica de sucesso declarada ANTES de iniciar, nunca escolhida depois;
 *  - experimento só é liberado a partir do marco D14.
 *
 * Persistido em `experimentos_indexacao` (acesso só admin).
 */

const STATUS = ["planejado", "em_execucao", "concluido", "abortado"] as const;
type Status = (typeof STATUS)[number];

const STATUS_LABEL: Record<Status, string> = {
  planejado: "Planejado",
  em_execucao: "Em execução",
  concluido: "Concluído",
  abortado: "Abortado",
};

const RESULTADOS = ["sem_efeito", "positivo", "negativo", "inconclusivo"] as const;

interface Experimento {
  id: string;
  marco: string;
  titulo: string;
  hipotese: string;
  mudanca_unica: string;
  metrica_sucesso: string;
  criterio_sucesso: string | null;
  grupo_teste: unknown;
  grupo_controle: unknown;
  cluster: string | null;
  status: string;
  iniciado_em: string | null;
  encerrado_em: string | null;
  resultado: string | null;
  conclusao: string | null;
  created_at: string;
}

const vazio = {
  titulo: "",
  hipotese: "",
  mudanca_unica: "",
  metrica_sucesso: "",
  criterio_sucesso: "",
  cluster: "",
  grupoTeste: "",
  grupoControle: "",
};

function paraLista(valor: unknown): string[] {
  if (Array.isArray(valor)) return valor.filter((v): v is string => typeof v === "string");
  return [];
}

function parsearUrls(texto: string): string[] {
  return Array.from(
    new Set(
      texto
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}

export function ExperimentosControlados({
  marcoAtual,
  podeCriar,
  urlsDisponiveis,
}: {
  marcoAtual: string | null;
  podeCriar: boolean;
  urlsDisponiveis: string[];
}) {
  const [itens, setItens] = useState<Experimento[] | null>(null);
  const [form, setForm] = useState({ ...vazio });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from("experimentos_indexacao")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setItens(null);
      return;
    }
    setItens((data ?? []) as Experimento[]);
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const teste = useMemo(() => parsearUrls(form.grupoTeste), [form.grupoTeste]);
  const controle = useMemo(() => parsearUrls(form.grupoControle), [form.grupoControle]);
  const sobreposicao = useMemo(
    () => teste.filter((u) => controle.includes(u)),
    [teste, controle],
  );
  const foraDoConjunto = useMemo(
    () =>
      urlsDisponiveis.length
        ? [...teste, ...controle].filter((u) => !urlsDisponiveis.includes(u))
        : [],
    [teste, controle, urlsDisponiveis],
  );

  const criar = async () => {
    if (!form.titulo.trim() || !form.hipotese.trim() || !form.mudanca_unica.trim() || !form.metrica_sucesso.trim()) {
      toast.error("Título, hipótese, mudança única e métrica de sucesso são obrigatórios.");
      return;
    }
    if (teste.length === 0 || controle.length === 0) {
      toast.error("Defina ao menos uma URL no grupo de teste e uma no grupo de controle.");
      return;
    }
    if (sobreposicao.length > 0) {
      toast.error(`URLs em ambos os grupos: ${sobreposicao.join(", ")}`);
      return;
    }
    setSalvando(true);
    const { error } = await supabase.from("experimentos_indexacao").insert({
      marco: marcoAtual ?? "D14",
      titulo: form.titulo.trim(),
      hipotese: form.hipotese.trim(),
      mudanca_unica: form.mudanca_unica.trim(),
      metrica_sucesso: form.metrica_sucesso.trim(),
      criterio_sucesso: form.criterio_sucesso.trim() || null,
      cluster: form.cluster.trim() || null,
      grupo_teste: teste,
      grupo_controle: controle,
    });
    setSalvando(false);
    if (error) {
      toast.error(`Não foi possível salvar: ${error.message}`);
      return;
    }
    toast.success("Experimento planejado.");
    setForm({ ...vazio });
    setMostrarForm(false);
    void carregar();
  };

  const atualizar = async (id: string, patch: Record<string, unknown>) => {
    const { error } = await supabase.from("experimentos_indexacao").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else void carregar();
  };

  const remover = async (id: string) => {
    const { error } = await supabase.from("experimentos_indexacao").delete().eq("id", id);
    if (error) toast.error(error.message);
    else void carregar();
  };

  return (
    <section id="experimentos" className="mt-10 scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Experimentos controlados</h2>
          <p className="text-sm text-muted-foreground">
            Use quando a decisão do marco for <strong>C / INVESTIGATE</strong>: uma
            mudança única, grupo de teste e grupo de controle, métrica declarada
            antes de começar.
          </p>
        </div>
        <Button
          size="sm"
          variant={mostrarForm ? "secondary" : "default"}
          disabled={!podeCriar}
          onClick={() => setMostrarForm((v) => !v)}
        >
          <Plus className="mr-1 h-4 w-4" />
          {mostrarForm ? "Cancelar" : "Planejar experimento"}
        </Button>
      </div>

      {!podeCriar && (
        <p className="mt-2 text-sm text-muted-foreground">
          Experimentos só são liberados a partir do marco D14 — antes disso a
          leitura ainda é ruído.
        </p>
      )}

      {mostrarForm && podeCriar && (
        <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4">
          <Input
            placeholder="Título do experimento"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
          <Textarea
            placeholder="Hipótese — o que se acredita que está travando a indexação e por quê"
            value={form.hipotese}
            onChange={(e) => setForm({ ...form, hipotese: e.target.value })}
          />
          <Textarea
            placeholder="Mudança única aplicada apenas ao grupo de teste (uma só)"
            value={form.mudanca_unica}
            onChange={(e) => setForm({ ...form, mudanca_unica: e.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Métrica de sucesso (ex.: URLs indexadas no grupo)"
              value={form.metrica_sucesso}
              onChange={(e) => setForm({ ...form, metrica_sucesso: e.target.value })}
            />
            <Input
              placeholder="Critério (ex.: +3 indexadas até D30)"
              value={form.criterio_sucesso}
              onChange={(e) => setForm({ ...form, criterio_sucesso: e.target.value })}
            />
          </div>
          <Input
            placeholder="Cluster afetado (opcional)"
            value={form.cluster}
            onChange={(e) => setForm({ ...form, cluster: e.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Test group ({teste.length} URLs)
              </label>
              <Textarea
                className="mt-1 font-mono text-xs"
                rows={5}
                placeholder="/servicos/... (uma URL por linha)"
                value={form.grupoTeste}
                onChange={(e) => setForm({ ...form, grupoTeste: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Control group ({controle.length} URLs)
              </label>
              <Textarea
                className="mt-1 font-mono text-xs"
                rows={5}
                placeholder="/servicos/... (uma URL por linha)"
                value={form.grupoControle}
                onChange={(e) => setForm({ ...form, grupoControle: e.target.value })}
              />
            </div>
          </div>
          {sobreposicao.length > 0 && (
            <p className="text-sm text-destructive">
              ✖ URLs presentes nos dois grupos: {sobreposicao.join(", ")}
            </p>
          )}
          {foraDoConjunto.length > 0 && (
            <p className="text-xs text-muted-foreground">
              ⚠ Fora do conjunto curado do marco: {foraDoConjunto.slice(0, 5).join(", ")}
              {foraDoConjunto.length > 5 ? ` (+${foraDoConjunto.length - 5})` : ""}
            </p>
          )}
          <div>
            <Button size="sm" onClick={criar} disabled={salvando}>
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar experimento
            </Button>
          </div>
        </div>
      )}

      {itens === null ? (
        <p className="mt-4 text-sm text-muted-foreground">
          {SEM_DADO} — sem acesso aos experimentos (é preciso estar autenticado como admin).
        </p>
      ) : itens.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Nenhum experimento planejado.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {itens.map((e) => {
            const t = paraLista(e.grupo_teste);
            const c = paraLista(e.grupo_controle);
            return (
              <article key={e.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{e.titulo}</h3>
                    <p className="text-xs text-muted-foreground">
                      {e.marco} · criado em {new Date(e.created_at).toLocaleString("pt-BR")}
                      {e.cluster ? ` · cluster ${e.cluster}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
                      value={e.status}
                      onChange={(ev) => {
                        const status = ev.target.value as Status;
                        void atualizar(e.id, {
                          status,
                          iniciado_em:
                            status === "em_execucao" && !e.iniciado_em
                              ? new Date().toISOString()
                              : e.iniciado_em,
                          encerrado_em:
                            status === "concluido" || status === "abortado"
                              ? new Date().toISOString()
                              : null,
                        });
                      }}
                    >
                      {STATUS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                    <Button size="icon" variant="ghost" onClick={() => remover(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Hipótese</dt>
                    <dd>{e.hipotese}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Mudança única</dt>
                    <dd>{e.mudanca_unica}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Métrica de sucesso</dt>
                    <dd>
                      {e.metrica_sucesso}
                      {e.criterio_sucesso ? ` — ${e.criterio_sucesso}` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase text-muted-foreground">Janela</dt>
                    <dd>
                      {e.iniciado_em ? new Date(e.iniciado_em).toLocaleDateString("pt-BR") : SEM_DADO}
                      {" → "}
                      {e.encerrado_em ? new Date(e.encerrado_em).toLocaleDateString("pt-BR") : "em aberto"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs uppercase text-muted-foreground">
                      Test group ({t.length})
                    </p>
                    <ul className="mt-1 space-y-0.5 font-mono text-xs">
                      {t.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs uppercase text-muted-foreground">
                      Control group ({c.length})
                    </p>
                    <ul className="mt-1 space-y-0.5 font-mono text-xs">
                      {c.map((u) => (
                        <li key={u}>{u}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
                    value={e.resultado ?? ""}
                    onChange={(ev) =>
                      void atualizar(e.id, { resultado: ev.target.value || null })
                    }
                  >
                    <option value="">Resultado: sem dado</option>
                    {RESULTADOS.map((r) => (
                      <option key={r} value={r}>
                        {r.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  <Input
                    className="max-w-md"
                    placeholder="Conclusão registrada no fechamento"
                    defaultValue={e.conclusao ?? ""}
                    onBlur={(ev) => {
                      const v = ev.target.value.trim();
                      if (v !== (e.conclusao ?? "")) void atualizar(e.id, { conclusao: v || null });
                    }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
