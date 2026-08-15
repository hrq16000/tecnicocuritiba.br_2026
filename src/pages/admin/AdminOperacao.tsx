import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "@/lib/router-compat";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Copy, Truck, Gauge, MessageSquare, FileCheck2, ShieldAlert } from "lucide-react";
import {
  CATEGORIAS_OPERACIONAIS,
  calcularCapacidade,
  categoriaPorEquipamento,
  getCategoria,
  limiteSlaDias,
  prazoEstimadoLabel,
  scriptAceite,
  scriptLaudo,
  scriptPrimeiroContato,
  scriptRecusa,
  scriptRecusadoComAlternativa,
  scriptTriagemPerguntas,
  type CategoriaOperacional,
} from "@/lib/operacaoCategorias";
import { CONTRATOS_OPERACIONAIS } from "@/lib/contratosOperacionais";

import {
  CHECKLIST_COLETA,
  CHECKLIST_ENTREGA,
  FAIXAS_LOGISTICAS,
  MOVIMENTACOES,
  RAIO_MAXIMO_KM,
} from "@/lib/logisticaColeta";

/**
 * Painel operacional interno (Rodada 3X).
 * Leads por categoria, SLA em tempo quase real (refresh automático de 30s),
 * scripts de WhatsApp por categoria e checklist logístico por faixa até 30 km.
 */

type Lead = {
  id: string;
  created_at: string;
  equipamento: string | null;
  sintoma: string | null;
  status_atendimento: string;
  requires_coleta: boolean;
};

type Ordem = {
  id: string;
  protocolo: string;
  created_at: string;
  status: string;
  equipamento: string | null;
  modalidade: string | null;
  cliente_nome: string | null;
  previsao_conclusao: string | null;
};

const JANELAS = [
  { value: "168", label: "Últimos 7 dias" },
  { value: "720", label: "Últimos 30 dias" },
  { value: "2160", label: "Últimos 90 dias" },
];

const REFRESH_MS = 30_000;
const STATUS_FINALIZADOS = new Set(["entregue", "concluida", "concluída", "finalizada", "cancelada"]);

/** Dias úteis decorridos entre duas datas (aprox., exclui sábado e domingo). */
function diasUteis(desde: string, ate = new Date()): number {
  const inicio = new Date(desde);
  let dias = 0;
  const cursor = new Date(inicio);
  while (cursor < ate) {
    cursor.setDate(cursor.getDate() + 1);
    const d = cursor.getDay();
    if (d !== 0 && d !== 6) dias += 1;
  }
  return dias;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export default function AdminOperacao() {
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [janela, setJanela] = useState("720");
  const [carregando, setCarregando] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);
  const [categoriaScript, setCategoriaScript] = useState<string>("tv");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const carregar = useCallback(async () => {
    const desde = new Date(Date.now() - Number(janela) * 3_600_000).toISOString();
    const [{ data: subs }, { data: os }] = await Promise.all([
      supabase
        .from("funnel_submissions")
        .select("id, created_at, equipamento, sintoma, status_atendimento, requires_coleta")
        .gte("created_at", desde)
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("ordens_servico")
        .select("id, protocolo, created_at, status, equipamento, modalidade, cliente_nome, previsao_conclusao")
        .order("created_at", { ascending: false })
        .limit(300),
    ]);
    setLeads((subs ?? []) as Lead[]);
    setOrdens((os ?? []) as Ordem[]);
    setAtualizadoEm(new Date());
    setCarregando(false);
  }, [janela]);

  useEffect(() => {
    if (!isAdmin) return;
    void carregar();
    const t = setInterval(() => void carregar(), REFRESH_MS);
    return () => clearInterval(t);
  }, [isAdmin, carregar]);

  const capacidade = useMemo(() => calcularCapacidade(), []);

  const porCategoria = useMemo(() => {
    return CATEGORIAS_OPERACIONAIS.map((cat) => {
      const catLeads = leads.filter((l) => categoriaPorEquipamento(l.equipamento)?.id === cat.id);
      const abertas = ordens.filter(
        (o) =>
          categoriaPorEquipamento(o.equipamento)?.id === cat.id &&
          !STATUS_FINALIZADOS.has((o.status || "").toLowerCase()),
      );
      const limite = limiteSlaDias(cat);
      const foraSla = abertas.filter((o) => diasUteis(o.created_at) > limite);
      const emRisco = abertas.filter((o) => {
        const d = diasUteis(o.created_at);
        return d > limite * 0.8 && d <= limite;
      });
      const wip = capacidade.find((c) => c.categoria.id === cat.id)?.wipMax ?? 0;
      return {
        cat,
        leads: catLeads.length,
        novos: catLeads.filter((l) => l.status_atendimento === "novo").length,
        abertas: abertas.length,
        emRisco: emRisco.length,
        foraSla: foraSla.length,
        wipMax: wip,
        ocupacao: wip ? Math.round((abertas.length / wip) * 100) : 0,
        lista: abertas,
      };
    });
  }, [leads, ordens, capacidade]);

  const totais = useMemo(() => {
    const abertas = porCategoria.reduce((s, c) => s + c.abertas, 0);
    const foraSla = porCategoria.reduce((s, c) => s + c.foraSla, 0);
    return {
      leads: porCategoria.reduce((s, c) => s + c.leads, 0),
      abertas,
      foraSla,
      cumprimento: abertas ? Math.round(((abertas - foraSla) / abertas) * 100) : 100,
    };
  }, [porCategoria]);

  const categoriaSel: CategoriaOperacional =
    getCategoria(categoriaScript) ?? CATEGORIAS_OPERACIONAIS[0];

  const copiar = async (texto: string, rotulo: string) => {
    await navigator.clipboard.writeText(texto);
    toast({ title: `${rotulo} copiado`, description: "Cole no WhatsApp do cliente." });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Painel operacional — leads, SLA e logística</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main id="conteudo-principal" className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Painel operacional</h1>
            <p className="text-sm text-muted-foreground">
              Leads por categoria, SLA em tempo quase real e logística de coleta até {RAIO_MAXIMO_KM} km.
              {atualizadoEm && ` Atualizado às ${atualizadoEm.toLocaleTimeString("pt-BR")}.`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={janela} onValueChange={setJanela}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {JANELAS.map((j) => (
                  <SelectItem key={j.value} value={j.value}>{j.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => void carregar()} disabled={carregando}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${carregando ? "animate-spin" : ""}`} aria-hidden="true" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Leads na janela", valor: totais.leads },
            { label: "OS abertas", valor: totais.abertas },
            { label: "Fora do SLA", valor: totais.foraSla },
            { label: "Cumprimento de SLA", valor: `${totais.cumprimento}%` },
          ].map((k) => (
            <Card key={k.label} className="p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{k.valor}</p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="sla">
          <TabsList>
            <TabsTrigger value="sla"><Gauge className="mr-1.5 h-4 w-4" aria-hidden="true" />Leads e SLA</TabsTrigger>
            <TabsTrigger value="scripts"><MessageSquare className="mr-1.5 h-4 w-4" aria-hidden="true" />Scripts</TabsTrigger>
            <TabsTrigger value="logistica"><Truck className="mr-1.5 h-4 w-4" aria-hidden="true" />Logística</TabsTrigger>
            <TabsTrigger value="contratos"><FileCheck2 className="mr-1.5 h-4 w-4" aria-hidden="true" />Contratos</TabsTrigger>
          </TabsList>


          {/* ---------------- LEADS + SLA ---------------- */}
          <TabsContent value="sla" className="mt-4 space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {porCategoria.map((c) => (
                <Card key={c.cat.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        <span aria-hidden="true">{c.cat.emoji}</span> {c.cat.nome}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        SLA interno: {limiteSlaDias(c.cat)} dias úteis · meta {Math.round(c.cat.sla.metaCumprimento * 100)}%
                      </p>
                    </div>
                    <Badge variant={c.foraSla ? "destructive" : c.emRisco ? "secondary" : "outline"}>
                      {c.foraSla ? `${c.foraSla} fora do SLA` : c.emRisco ? `${c.emRisco} em risco` : "no prazo"}
                    </Badge>
                  </div>

                  <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-md border border-border bg-card/50 p-2">
                      <dt className="text-muted-foreground">Leads</dt>
                      <dd className="text-base font-bold text-foreground">{c.leads}</dd>
                    </div>
                    <div className="rounded-md border border-border bg-card/50 p-2">
                      <dt className="text-muted-foreground">Novos</dt>
                      <dd className="text-base font-bold text-foreground">{c.novos}</dd>
                    </div>
                    <div className="rounded-md border border-border bg-card/50 p-2">
                      <dt className="text-muted-foreground">OS abertas</dt>
                      <dd className="text-base font-bold text-foreground">{c.abertas}</dd>
                    </div>
                  </dl>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Ocupação da bancada</span>
                      <span>{c.ocupacao}% de {c.wipMax} OS</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${c.ocupacao >= 80 ? "bg-destructive" : "bg-primary"}`}
                        style={{ width: `${Math.min(100, c.ocupacao)}%` }}
                      />
                    </div>
                    {c.ocupacao >= 80 && (
                      <p className="mt-1 text-[11px] font-medium text-destructive">
                        Gatilho de contenção: pare de prometer prazo curto nesta categoria.
                      </p>
                    )}
                  </div>

                  {c.lista.length > 0 && (
                    <ul className="mt-3 space-y-1 text-[11px]">
                      {c.lista.slice(0, 4).map((o) => {
                        const d = diasUteis(o.created_at);
                        const limite = limiteSlaDias(c.cat);
                        const cor = d > limite ? "text-destructive" : d > limite * 0.8 ? "text-amber-600" : "text-foreground/70";
                        return (
                          <li key={o.id} className="flex items-center justify-between gap-2">
                            <span className="truncate text-foreground/80">
                              {o.protocolo} · {o.status}
                            </span>
                            <span className={`whitespace-nowrap font-medium ${cor}`}>{d}/{limite} dias úteis</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ---------------- SCRIPTS ---------------- */}
          <TabsContent value="scripts" className="mt-4 space-y-4">
            <Select value={categoriaScript} onValueChange={setCategoriaScript}>
              <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIAS_OPERACIONAIS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.emoji} {c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Card className="p-4">
              <p className="text-sm font-semibold text-foreground">Prazo estimado</p>
              <p className="mt-1 text-sm text-foreground/75">{prazoEstimadoLabel(categoriaSel)}.</p>
            </Card>

            {[
              { titulo: "Perguntas de triagem", texto: scriptTriagemPerguntas(categoriaSel) },
              { titulo: "Primeiro contato (triagem + orientação)", texto: scriptPrimeiroContato(categoriaSel) },
              {
                titulo: "Caso ACEITO (abre coleta)",
                texto: scriptAceite(categoriaSel, {
                  faixa: FAIXAS_LOGISTICAS[0].nome,
                  janelas: FAIXAS_LOGISTICAS[0].janelas,
                  taxa: FAIXAS_LOGISTICAS[0].taxaLabel,
                  prazoColetaDias: FAIXAS_LOGISTICAS[0].prazoColetaDias,
                }),
              },
              {
                titulo: "Caso RECUSADO (com alternativa)",
                texto: scriptRecusadoComAlternativa(categoriaSel, categoriaSel.recusa[0].toLowerCase()),
              },
              {
                titulo: "Recusa técnica (curta)",
                texto: scriptRecusa(categoriaSel, categoriaSel.recusa[0].toLowerCase()),
              },
              {
                titulo: "Laudo pronto",
                texto: scriptLaudo(categoriaSel, "[achado técnico]", "[valor do atendimento]"),
              },
            ].map((s) => (

              <Card key={s.titulo} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{s.titulo}</p>
                  <Button size="sm" variant="outline" onClick={() => void copiar(s.texto, s.titulo)}>
                    <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />Copiar
                  </Button>
                </div>
                <pre className="mt-2 whitespace-pre-wrap rounded-md border border-border bg-card/50 p-3 text-xs leading-relaxed text-foreground/85">
                  {s.texto}
                </pre>
              </Card>
            ))}

            <Card className="p-4">
              <p className="text-sm font-semibold text-foreground">Critérios de recusa — {categoriaSel.nome}</p>
              <ul className="mt-2 space-y-1 text-xs text-foreground/80">
                {categoriaSel.recusa.map((r) => (
                  <li key={r} className="flex items-start justify-between gap-3">
                    <span>• {r}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void copiar(scriptRecusa(categoriaSel, r.toLowerCase()), "Script de recusa")}
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">Copiar script de recusa</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          {/* ---------------- LOGÍSTICA ---------------- */}
          <TabsContent value="logistica" className="mt-4 space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {FAIXAS_LOGISTICAS.map((f) => (
                <Card key={f.id} className="p-4">
                  <p className="font-semibold text-foreground">{f.nome}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{f.taxaLabel}</p>
                  <dl className="mt-2 space-y-1 text-xs text-foreground/80">
                    <div><dt className="inline font-semibold">Janelas: </dt><dd className="inline">{f.janelas}</dd></div>
                    <div><dt className="inline font-semibold">Coleta em: </dt><dd className="inline">{f.prazoColetaDias} dia(s) útil(eis)</dd></div>
                    <div><dt className="inline font-semibold">Regiões: </dt><dd className="inline">{f.regioes.join(", ")}</dd></div>
                  </dl>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <p className="text-sm font-semibold text-foreground">Status de movimentação</p>
              <ol className="mt-3 flex flex-wrap gap-2">
                {MOVIMENTACOES.map((m, i) => (
                  <li key={m.id} className="flex items-center gap-2">
                    <Badge variant={m.pausaSla ? "secondary" : "outline"} className="text-[11px]">
                      {i + 1}. {m.label}{m.pausaSla ? " (SLA pausado)" : ""}
                    </Badge>
                  </li>
                ))}
              </ol>
            </Card>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                { titulo: "Checklist de coleta", itens: CHECKLIST_COLETA },
                { titulo: "Checklist de entrega", itens: CHECKLIST_ENTREGA },
              ].map((bloco) => (
                <Card key={bloco.titulo} className="p-4">
                  <p className="text-sm font-semibold text-foreground">{bloco.titulo}</p>
                  <ul className="mt-2 space-y-2">
                    {bloco.itens.map((item) => (
                      <li key={item.id}>
                        <label className="flex cursor-pointer items-start gap-2 text-xs leading-snug">
                          <Checkbox
                            checked={!!checklist[item.id]}
                            onCheckedChange={(v) => setChecklist((s) => ({ ...s, [item.id]: !!v }))}
                            className="mt-0.5"
                            aria-label={item.label}
                          />
                          <span className="text-foreground/85">
                            {item.label}
                            {item.obrigatorio && <span className="ml-1 text-destructive">*</span>}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ---------------- CONTRATOS OPERACIONAIS (fail-closed) ---------------- */}
          <TabsContent value="contratos" className="mt-4 space-y-4">
            <Card className="border-amber-500/40 bg-amber-500/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldAlert className="h-4 w-4 text-amber-600" aria-hidden="true" />
                Regra fail-closed
              </p>
              <p className="mt-1 text-xs text-foreground/80">
                Nenhum checkpoint avança com item obrigatório (*) pendente. Na dúvida, o fluxo para: vira recusa ou
                pedido de informação. Documento interno — não publicar em página indexável.
              </p>
            </Card>

            {CONTRATOS_OPERACIONAIS.map((contrato) => (
              <Card key={contrato.categoria} className="p-4 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      Contrato de triagem e autorização — {contrato.nome}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/70">{contrato.resumo}</p>
                  </div>
                  <Badge variant="outline">v{contrato.versao} · {contrato.atualizadoEm}</Badge>
                </div>

                <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3">
                  <p className="text-xs font-semibold text-foreground">Paradas imediatas (recusa automática)</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-foreground/80">
                    {contrato.paradasImediatas.map((p) => <li key={p}>• {p}</li>)}
                  </ul>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  {contrato.checkpoints.map((cp) => (
                    <div key={cp.id} className="rounded-md border border-border bg-card/50 p-3">
                      <p className="text-sm font-semibold text-foreground">{cp.nome}</p>
                      <p className="mt-0.5 text-xs text-foreground/70">{cp.objetivo}</p>
                      <ul className="mt-2 space-y-1.5 text-xs">
                        {cp.itens.map((item) => (
                          <li key={item.id}>
                            <span className="text-foreground/85">
                              • {item.label}
                              {item.obrigatorio && <span className="ml-1 text-destructive">*</span>}
                            </span>
                            <span className="block pl-3 text-[11px] text-muted-foreground">
                              Se falhar: {item.seFalhar}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 rounded border border-emerald-500/30 bg-emerald-500/10 p-2 text-[11px] text-foreground/85">
                        Libera quando: {cp.liberaQuando}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs font-semibold text-foreground">Limitações de validação</p>
                    <ul className="mt-1 space-y-1 text-[11px] text-foreground/80">
                      {contrato.limitacoesValidacao.map((l) => (
                        <li key={l.titulo}><strong className="text-foreground">{l.titulo}:</strong> {l.descricao}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="text-xs font-semibold text-foreground">Garantia por tipo de reparo</p>
                    <ul className="mt-1 space-y-1 text-[11px] text-foreground/80">
                      {contrato.garantias.map((g) => (
                        <li key={g.tipo}>
                          <strong className="text-foreground">{g.tipo}</strong> — {g.prazo}. Cobre: {g.cobre} Não cobre: {g.naoCobre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
