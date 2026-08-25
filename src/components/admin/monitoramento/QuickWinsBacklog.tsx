import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SEM_DADO } from "./types";

/**
 * Backlog gerenciável de quick wins da fase de observação.
 *
 * Regra de governança: no máximo 5 itens ABERTOS ao mesmo tempo e quick wins
 * só são abertos a partir do D14 — o backlog é uma fila de decisão, não uma
 * lista de desejos. Persistido em `quick_wins_backlog` (acesso só admin).
 */

const LIMITE_ABERTOS = 5;
const STATUS = ["aberto", "em_andamento", "concluido", "descartado"] as const;
type Status = (typeof STATUS)[number];

const STATUS_LABEL: Record<Status, string> = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  descartado: "Descartado",
};

interface Item {
  id: string;
  marco: string;
  url_path: string;
  cluster: string | null;
  titulo: string;
  hipotese: string;
  evidencia: string | null;
  acao: string | null;
  prioridade: number;
  status: string;
  responsavel: string | null;
  resultado: string | null;
  created_at: string;
}

const vazio = {
  marco: "D14",
  url_path: "",
  cluster: "",
  titulo: "",
  hipotese: "",
  evidencia: "",
  acao: "",
  prioridade: 3,
};

export function QuickWinsBacklog({ marcoAtual, podeAbrir }: { marcoAtual: string | null; podeAbrir: boolean }) {
  const [itens, setItens] = useState<Item[] | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ ...vazio, marco: marcoAtual ?? "D14" });
  const [mostrarForm, setMostrarForm] = useState(false);

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from("quick_wins_backlog")
      .select("*")
      .order("status", { ascending: true })
      .order("prioridade", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      setItens(null);
      return;
    }
    setItens((data ?? []) as Item[]);
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const abertos = (itens ?? []).filter((i) => i.status === "aberto" || i.status === "em_andamento").length;
  const bloqueado = !podeAbrir || abertos >= LIMITE_ABERTOS;

  const criar = async () => {
    if (!form.url_path.trim() || !form.titulo.trim() || !form.hipotese.trim()) {
      toast.error("URL, título e hipótese são obrigatórios.");
      return;
    }
    setSalvando(true);
    const { error } = await supabase.from("quick_wins_backlog").insert({
      marco: form.marco,
      url_path: form.url_path.trim(),
      cluster: form.cluster.trim() || null,
      titulo: form.titulo.trim(),
      hipotese: form.hipotese.trim(),
      evidencia: form.evidencia.trim() || null,
      acao: form.acao.trim() || null,
      prioridade: Number(form.prioridade) || 3,
    });
    setSalvando(false);
    if (error) {
      toast.error(`Não foi possível salvar: ${error.message}`);
      return;
    }
    toast.success("Quick win adicionado ao backlog.");
    setForm({ ...vazio, marco: marcoAtual ?? "D14" });
    setMostrarForm(false);
    void carregar();
  };

  const atualizarStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("quick_wins_backlog").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else void carregar();
  };

  const remover = async (id: string) => {
    const { error } = await supabase.from("quick_wins_backlog").delete().eq("id", id);
    if (error) toast.error(error.message);
    else void carregar();
  };

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Backlog de quick wins</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Máximo de {LIMITE_ABERTOS} itens ativos · abertos hoje: {itens === null ? SEM_DADO : abertos}
            {podeAbrir ? "" : " · quick wins só são abertos a partir do marco D14 (fase de observação)"}
          </p>
        </div>
        <Button
          size="sm"
          variant={mostrarForm ? "outline" : "default"}
          onClick={() => setMostrarForm((v) => !v)}
          disabled={bloqueado && !mostrarForm}
          className="print:hidden"
        >
          <Plus className="mr-2 h-4 w-4" />
          {mostrarForm ? "Cancelar" : "Novo quick win"}
        </Button>
      </div>

      {itens === null && (
        <p className="mt-3 text-sm text-muted-foreground">
          {SEM_DADO} — backlog acessível apenas para administradores autenticados.
        </p>
      )}

      {mostrarForm && (
        <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 print:hidden">
          <Input
            value={form.url_path}
            onChange={(e) => setForm({ ...form, url_path: e.target.value })}
            placeholder="/servicos/exemplo"
            aria-label="Caminho da URL"
          />
          <Input
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Título curto do quick win"
            aria-label="Título"
          />
          <Input
            value={form.cluster}
            onChange={(e) => setForm({ ...form, cluster: e.target.value })}
            placeholder="Cluster (opcional)"
            aria-label="Cluster"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="qw-prioridade" className="text-xs text-muted-foreground">
              Prioridade (1 = maior)
            </label>
            <Input
              id="qw-prioridade"
              type="number"
              min={1}
              max={5}
              value={form.prioridade}
              onChange={(e) => setForm({ ...form, prioridade: Number(e.target.value) })}
              className="w-20"
            />
          </div>
          <Textarea
            value={form.hipotese}
            onChange={(e) => setForm({ ...form, hipotese: e.target.value })}
            placeholder="Hipótese: por que esta URL não converte em indexação/clique?"
            aria-label="Hipótese"
          />
          <Textarea
            value={form.evidencia}
            onChange={(e) => setForm({ ...form, evidencia: e.target.value })}
            placeholder="Evidência observada (GSC, inventário, diff de snapshot)"
            aria-label="Evidência"
          />
          <Textarea
            value={form.acao}
            onChange={(e) => setForm({ ...form, acao: e.target.value })}
            placeholder="Ação proposta (mínima, reversível)"
            aria-label="Ação proposta"
            className="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <Button onClick={criar} disabled={salvando || bloqueado}>
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar ao backlog
            </Button>
            {bloqueado && (
              <span className="ml-3 text-xs text-muted-foreground">
                Limite de {LIMITE_ABERTOS} itens ativos atingido ou marco anterior ao D14.
              </span>
            )}
          </div>
        </div>
      )}

      {itens && itens.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Prior.</th>
                <th className="p-3">URL</th>
                <th className="p-3">Quick win</th>
                <th className="p-3">Hipótese / evidência</th>
                <th className="p-3">Marco</th>
                <th className="p-3">Status</th>
                <th className="p-3 print:hidden" />
              </tr>
            </thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.id} className="border-t border-border align-top">
                  <td className="p-3">{i.prioridade}</td>
                  <td className="p-3 font-mono text-xs">{i.url_path}</td>
                  <td className="p-3">
                    <span className="font-medium">{i.titulo}</span>
                    {i.acao && <span className="block text-xs text-muted-foreground">Ação: {i.acao}</span>}
                  </td>
                  <td className="max-w-sm p-3 text-xs text-muted-foreground">
                    {i.hipotese}
                    {i.evidencia && <span className="mt-1 block">Evidência: {i.evidencia}</span>}
                  </td>
                  <td className="p-3 text-xs">{i.marco}</td>
                  <td className="p-3">
                    <select
                      value={i.status}
                      onChange={(e) => void atualizarStatus(i.id, e.target.value as Status)}
                      aria-label={`Status de ${i.titulo}`}
                      className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                    >
                      {STATUS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 print:hidden">
                    <Button variant="ghost" size="sm" onClick={() => void remover(i.id)} aria-label={`Remover ${i.titulo}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {itens && itens.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          Nenhum quick win no backlog — comportamento esperado enquanto a decisão do marco for WAIT.
        </p>
      )}
    </section>
  );
}

export default QuickWinsBacklog;
