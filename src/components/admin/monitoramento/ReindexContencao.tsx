import { useCallback, useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

/**
 * Solicitação auditada de `reindex:snapshots` em MODO DE CONTENÇÃO.
 *
 * O painel nunca executa o job diretamente (não há shell no browser): ele
 * registra a solicitação com escopo (cluster ou URL) e motivo em
 * `public.reindex_solicitacoes` — trilha append-only — e devolve o comando
 * exato a ser executado pelo operador/CI. Sem motivo, nada é registrado
 * (fail-closed), e o escopo global não é oferecido nesta tela.
 */

interface Solicitacao {
  id: string;
  marco: string | null;
  escopo_tipo: string;
  escopo_valor: string | null;
  modo_contencao: boolean;
  motivo: string;
  comando: string;
  status: string;
  solicitado_por_email: string | null;
  created_at: string;
}

function comandoDe(tipo: "cluster" | "url", valor: string) {
  const alvo = valor.trim();
  return `npm run reindex:snapshots -- --conter=${tipo}:${alvo}`;
}

export function ReindexContencao({ marcoAtual }: { marcoAtual: string | null }) {
  const [registros, setRegistros] = useState<Solicitacao[] | null>(null);
  const [tipo, setTipo] = useState<"cluster" | "url">("cluster");
  const [valor, setValor] = useState("");
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    const { data } = await supabase
      .from("reindex_solicitacoes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25);
    setRegistros((data as Solicitacao[]) ?? []);
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function registrar() {
    const alvo = valor.trim();
    const razao = motivo.trim();
    if (!alvo || razao.length < 10) {
      toast.error("Informe o escopo e um motivo com pelo menos 10 caracteres.");
      return;
    }
    setEnviando(true);
    try {
      const { data: sess } = await supabase.auth.getUser();
      const uid = sess.user?.id;
      if (!uid) {
        toast.error("Sessão administrativa expirada.");
        return;
      }
      const comando = comandoDe(tipo, alvo);
      const { error } = await supabase.from("reindex_solicitacoes").insert({
        marco: marcoAtual,
        escopo_tipo: tipo,
        escopo_valor: alvo,
        modo_contencao: true,
        motivo: razao,
        comando,
        status: "solicitado",
        solicitado_por: uid,
        solicitado_por_email: sess.user?.email ?? null,
      });
      if (error) throw error;
      await navigator.clipboard?.writeText(comando).catch(() => undefined);
      toast.success("Solicitação registrada. Comando copiado para a área de transferência.");
      setValor("");
      setMotivo("");
      void carregar();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao registrar solicitação.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="reindex-contencao" className="mt-10 scroll-mt-24">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Reindexação em modo de contenção
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Registra o pedido com escopo limitado (cluster ou URL) e motivo. O job só
        roda fora do painel, com o comando gerado abaixo — snapshot saudável nunca
        é substituído por snapshot inválido.
      </p>

      <div className="mt-4 grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[160px_1fr]">
        <div className="flex gap-2">
          {(["cluster", "url"] as const).map((t) => (
            <Button
              key={t}
              type="button"
              size="sm"
              variant={tipo === t ? "default" : "outline"}
              onClick={() => setTipo(t)}
            >
              {t === "cluster" ? "Cluster" : "URL"}
            </Button>
          ))}
        </div>
        <Input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder={tipo === "cluster" ? "SERVICO, PROBLEMA, BAIRRO…" : "/servicos/formatacao"}
          aria-label={tipo === "cluster" ? "Cluster alvo" : "URL alvo"}
        />
        <div className="text-xs text-muted-foreground md:pt-2">Motivo (auditoria)</div>
        <Textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={2}
          placeholder="Ex.: divergência de hash no cluster PROBLEMA após reprocessamento do D7."
        />
        <div />
        <div className="flex items-center gap-3">
          <Button type="button" onClick={registrar} disabled={enviando}>
            {enviando && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            Registrar e gerar comando
          </Button>
          {valor.trim() && (
            <code className="truncate font-mono text-[11px] text-muted-foreground">
              {comandoDe(tipo, valor)}
            </code>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Quando</th>
              <th className="p-3">Escopo</th>
              <th className="p-3">Marco</th>
              <th className="p-3">Motivo</th>
              <th className="p-3">Comando</th>
              <th className="p-3">Quem</th>
            </tr>
          </thead>
          <tbody>
            {!registros?.length ? (
              <tr>
                <td colSpan={6} className="p-3 text-sm text-muted-foreground">
                  Nenhuma solicitação registrada.
                </td>
              </tr>
            ) : (
              registros.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="p-3 text-xs">{new Date(r.created_at).toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-xs font-medium">
                    {r.escopo_tipo}: {r.escopo_valor ?? "—"}
                  </td>
                  <td className="p-3 text-xs">{r.marco ?? "—"}</td>
                  <td className="p-3 text-xs text-muted-foreground">{r.motivo}</td>
                  <td className="p-3 font-mono text-[11px]">{r.comando}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {r.solicitado_por_email ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ReindexContencao;
