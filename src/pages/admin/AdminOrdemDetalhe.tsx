import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  OS_PAGAMENTO, OS_STATUS_LABEL, calcularValores, formatarBRL, proximosStatus, type OsStatus,
} from "@/lib/os/statusOs";
import {
  OS_TEMPLATES, OS_TEMPLATE_LABEL, linkWhatsAppOs, montarMensagemOs, type OsTemplate,
} from "@/lib/os/whatsappOs";
import { baixarPdfOrdemAdmin } from "@/lib/os/osAdminPdf";
import {
  alterarStatusOrdem, atualizarOrdem, concluirLembrete, obterOrdem, registrarMensagemPreparada,
  registrarPdfOrdem, salvarLembrete, type OsAdminRow, type OsEvento, type OsLembrete,
} from "@/lib/os/osAdmin.functions";
import { ArrowLeft, Check, FileDown, MessageCircle, Plus, Save, Trash2 } from "lucide-react";

interface Peca { descricao: string; quantidade: number; valorUnitario: number }

const numero = (v: string) => {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const AdminOrdemDetalhe = () => {
  const { protocolo = "" } = useParams();
  const { loading: authLoading, session, isAdmin } = useAdminAuth();

  const [ordem, setOrdem] = useState<OsAdminRow | null>(null);
  const [eventos, setEventos] = useState<OsEvento[]>([]);
  const [lembretes, setLembretes] = useState<OsLembrete[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState<Record<string, string>>({});
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [novoStatus, setNovoStatus] = useState("");
  const [confirmarStatus, setConfirmarStatus] = useState<string | null>(null);
  const [previa, setPrevia] = useState<{ template: OsTemplate; texto: string; link: string } | null>(null);
  const [lembreteTipo, setLembreteTipo] = useState("");
  const [lembreteQuando, setLembreteQuando] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const r = await obterOrdem({ data: { protocolo } });
      if (!r) {
        setErro("Ordem de serviço não encontrada.");
        return;
      }
      setOrdem(r.ordem);
      setEventos(r.eventos);
      setLembretes(r.lembretes);
      setPecas(r.ordem.pecas);
      setForm({
        clienteNome: r.ordem.clienteNome ?? "",
        telefone: r.ordem.telefone ?? "",
        equipamento: r.ordem.equipamento ?? "",
        marcaModelo: r.ordem.marcaModelo ?? "",
        numeroSerie: r.ordem.numeroSerie ?? "",
        sintomas: r.ordem.sintomas ?? "",
        diagnostico: r.ordem.diagnostico ?? "",
        servicoExecutado: r.ordem.servicoExecutado ?? "",
        observacoes: r.ordem.observacoes ?? "",
        tecnicoResponsavel: r.ordem.tecnicoResponsavel ?? "",
        modalidade: r.ordem.modalidade ?? "",
        previsaoConclusao: r.ordem.previsaoConclusao ?? "",
        valorServicos: String(r.ordem.valorServicos ?? 0),
        desconto: String(r.ordem.desconto ?? 0),
        pagamentoStatus: r.ordem.pagamentoStatus ?? "pendente",
      });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao carregar a ordem.");
    } finally {
      setCarregando(false);
    }
  }, [protocolo]);

  useEffect(() => {
    if (isAdmin) void carregar();
  }, [isAdmin, carregar]);

  const set = (campo: string) => (v: string) => setForm((f) => ({ ...f, [campo]: v }));

  let valores = { valorServicos: 0, valorPecas: 0, desconto: 0, total: 0 };
  let erroValores: string | null = null;
  try {
    valores = calcularValores({
      valorServicos: numero(form["valorServicos"] ?? "0"),
      pecas,
      desconto: numero(form["desconto"] ?? "0"),
    });
  } catch (e) {
    erroValores = e instanceof Error ? e.message : "Valores inválidos.";
  }

  const salvar = async () => {
    if (erroValores) {
      toast({ title: "Corrija os valores", description: erroValores, variant: "destructive" });
      return;
    }
    setSalvando(true);
    try {
      await atualizarOrdem({
        data: {
          protocolo,
          dados: {
            clienteNome: form["clienteNome"] ?? "",
            telefone: form["telefone"] ?? "",
            equipamento: form["equipamento"] ?? "",
            marcaModelo: form["marcaModelo"] ?? "",
            numeroSerie: form["numeroSerie"] ?? "",
            sintomas: form["sintomas"] ?? "",
            diagnostico: form["diagnostico"] ?? "",
            servicoExecutado: form["servicoExecutado"] ?? "",
            observacoes: form["observacoes"] ?? "",
            tecnicoResponsavel: form["tecnicoResponsavel"] ?? "",
            modalidade: form["modalidade"] ?? "",
            previsaoConclusao: form["previsaoConclusao"] ?? "",
            pecas,
            valorServicos: numero(form["valorServicos"] ?? "0"),
            desconto: numero(form["desconto"] ?? "0"),
            pagamentoStatus: (form["pagamentoStatus"] ?? "pendente") as "pendente",
          },
        },
      });
      toast({ title: "Ordem atualizada", description: "As alterações foram registradas." });
      await carregar();
    } catch (e) {
      toast({
        title: "Não foi possível salvar",
        description: e instanceof Error ? e.message : "Erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  const aplicarStatus = async (status: string) => {
    try {
      await alterarStatusOrdem({ data: { protocolo, status: status as OsStatus, nota: "" } });
      toast({ title: "Status atualizado" });
      setNovoStatus("");
      await carregar();
    } catch (e) {
      toast({
        title: "Transição recusada",
        description: e instanceof Error ? e.message : "Erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const gerarPdf = async () => {
    if (!ordem) return;
    try {
      const hash = await baixarPdfOrdemAdmin({ ...ordem, pecas, ...valores });
      const { versao } = await registrarPdfOrdem({ data: { protocolo, docHash: hash } });
      toast({ title: `PDF gerado (versão ${versao})` });
      await carregar();
    } catch (e) {
      toast({
        title: "Falha ao gerar PDF",
        description: e instanceof Error ? e.message : "Erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const prepararMensagem = (template: OsTemplate) => {
    if (!ordem) return;
    try {
      const texto = montarMensagemOs(template, {
        protocolo: ordem.protocolo,
        primeiroNome: form["clienteNome"] ?? ordem.clienteNome,
        equipamento: form["equipamento"] ?? ordem.equipamento,
        marcaModelo: form["marcaModelo"] ?? ordem.marcaModelo,
        diagnostico: form["diagnostico"] ?? ordem.diagnostico,
        servicoExecutado: form["servicoExecutado"] ?? ordem.servicoExecutado,
        total: valores.total,
        previsao: form["previsaoConclusao"] ?? ordem.previsaoConclusao,
      });
      const link = linkWhatsAppOs(form["telefone"] ?? ordem.telefone, texto);
      if (!link) {
        toast({
          title: "Telefone inválido",
          description: "Cadastre um telefone válido antes de preparar a mensagem.",
          variant: "destructive",
        });
        return;
      }
      setPrevia({ template, texto, link });
    } catch (e) {
      toast({
        title: "Mensagem bloqueada",
        description: e instanceof Error ? e.message : "Erro inesperado.",
        variant: "destructive",
      });
    }
  };

  const abrirWhatsApp = async () => {
    if (!previa) return;
    window.open(previa.link, "_blank", "noopener,noreferrer");
    try {
      await registrarMensagemPreparada({ data: { protocolo, template: previa.template } });
    } catch {
      /* o registro da timeline não deve bloquear o atendimento */
    }
    setPrevia(null);
    await carregar();
  };

  const criarLembrete = async () => {
    if (!lembreteTipo.trim() || !lembreteQuando) {
      toast({ title: "Informe tipo e data do lembrete", variant: "destructive" });
      return;
    }
    try {
      await salvarLembrete({
        data: { protocolo, tipo: lembreteTipo.trim(), quando: lembreteQuando, responsavel: "", observacao: "" },
      });
      setLembreteTipo("");
      setLembreteQuando("");
      toast({ title: "Lembrete criado", description: "Nenhuma mensagem é enviada automaticamente." });
      await carregar();
    } catch (e) {
      toast({
        title: "Falha ao criar lembrete",
        description: e instanceof Error ? e.message : "Erro inesperado.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-10 w-64" />
      </div>
    );
  }
  if (!session || !isAdmin) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>O.S. {protocolo} — painel interno</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <Link
          to="/admin/ordens"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Todas as ordens
        </Link>

        {carregando ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-72" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : erro || !ordem ? (
          <Card className="p-8 text-center text-sm text-destructive">{erro}</Card>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-mono text-2xl font-bold text-foreground">{ordem.protocolo}</h1>
                <p className="text-sm text-muted-foreground">
                  Aberta em {new Date(ordem.abertaEm).toLocaleString("pt-BR")}
                </p>
              </div>
              <Badge variant="secondary">
                {OS_STATUS_LABEL[ordem.status as OsStatus] ?? ordem.status}
              </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-6">
                <Card className="space-y-4 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cliente</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Nome" value={form["clienteNome"] ?? ""} onChange={(e) => set("clienteNome")(e.target.value)} />
                    <Input placeholder="Telefone" value={form["telefone"] ?? ""} onChange={(e) => set("telefone")(e.target.value)} />
                  </div>
                  <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Equipamento</h2>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input placeholder="Tipo" value={form["equipamento"] ?? ""} onChange={(e) => set("equipamento")(e.target.value)} />
                    <Input placeholder="Marca/modelo" value={form["marcaModelo"] ?? ""} onChange={(e) => set("marcaModelo")(e.target.value)} />
                    <Input placeholder="Número de série" value={form["numeroSerie"] ?? ""} onChange={(e) => set("numeroSerie")(e.target.value)} />
                  </div>
                </Card>

                <Card className="space-y-4 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Atendimento</h2>
                  <Textarea placeholder="Problema relatado" rows={3} value={form["sintomas"] ?? ""} onChange={(e) => set("sintomas")(e.target.value)} />
                  <Textarea placeholder="Diagnóstico técnico" rows={3} value={form["diagnostico"] ?? ""} onChange={(e) => set("diagnostico")(e.target.value)} />
                  <Textarea placeholder="Serviço executado" rows={3} value={form["servicoExecutado"] ?? ""} onChange={(e) => set("servicoExecutado")(e.target.value)} />
                  <Textarea placeholder="Observações internas" rows={2} value={form["observacoes"] ?? ""} onChange={(e) => set("observacoes")(e.target.value)} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input placeholder="Técnico responsável" value={form["tecnicoResponsavel"] ?? ""} onChange={(e) => set("tecnicoResponsavel")(e.target.value)} />
                    <Input placeholder="Previsão (texto livre)" value={form["previsaoConclusao"] ?? ""} onChange={(e) => set("previsaoConclusao")(e.target.value)} />
                  </div>
                </Card>

                <Card className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Peças e valores</h2>
                    <Button variant="outline" size="sm" onClick={() => setPecas((p) => [...p, { descricao: "", quantidade: 1, valorUnitario: 0 }])}>
                      <Plus className="mr-1 h-4 w-4" /> Peça
                    </Button>
                  </div>
                  {pecas.map((p, i) => (
                    <div key={i} className="grid grid-cols-[1fr_70px_100px_40px] items-center gap-2">
                      <Input
                        placeholder="Descrição"
                        value={p.descricao}
                        onChange={(e) => setPecas((arr) => arr.map((x, j) => (j === i ? { ...x, descricao: e.target.value } : x)))}
                      />
                      <Input
                        type="number" min={1} value={p.quantidade}
                        onChange={(e) => setPecas((arr) => arr.map((x, j) => (j === i ? { ...x, quantidade: Math.max(1, Number(e.target.value) || 1) } : x)))}
                      />
                      <Input
                        type="number" min={0} step="0.01" value={p.valorUnitario}
                        onChange={(e) => setPecas((arr) => arr.map((x, j) => (j === i ? { ...x, valorUnitario: numero(e.target.value) } : x)))}
                      />
                      <Button variant="ghost" size="icon" aria-label="Remover peça" onClick={() => setPecas((arr) => arr.filter((_, j) => j !== i))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input type="number" min={0} step="0.01" placeholder="Serviços (R$)" value={form["valorServicos"] ?? ""} onChange={(e) => set("valorServicos")(e.target.value)} />
                    <Input type="number" min={0} step="0.01" placeholder="Desconto (R$)" value={form["desconto"] ?? ""} onChange={(e) => set("desconto")(e.target.value)} />
                    <Select value={form["pagamentoStatus"] ?? "pendente"} onValueChange={set("pagamentoStatus")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {OS_PAGAMENTO.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {erroValores ? (
                    <p className="text-sm text-destructive">{erroValores}</p>
                  ) : (
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                      <div className="flex justify-between"><span>Serviços</span><span>{formatarBRL(valores.valorServicos)}</span></div>
                      <div className="flex justify-between"><span>Peças</span><span>{formatarBRL(valores.valorPecas)}</span></div>
                      <div className="flex justify-between"><span>Desconto</span><span>− {formatarBRL(valores.desconto)}</span></div>
                      <div className="mt-1 flex justify-between border-t border-border pt-1 font-semibold text-foreground">
                        <span>Total</span><span>{formatarBRL(valores.total)}</span>
                      </div>
                    </div>
                  )}
                  <Button onClick={() => void salvar()} disabled={salvando}>
                    <Save className="mr-2 h-4 w-4" /> {salvando ? "Salvando…" : "Salvar alterações"}
                  </Button>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="space-y-3 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Status</h2>
                  <Select value={novoStatus} onValueChange={setNovoStatus}>
                    <SelectTrigger><SelectValue placeholder="Avançar para…" /></SelectTrigger>
                    <SelectContent>
                      {proximosStatus((ordem.status as OsStatus) ?? "ABERTA").map((s) => (
                        <SelectItem key={s} value={s}>{OS_STATUS_LABEL[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full"
                    variant="outline"
                    disabled={!novoStatus}
                    onClick={() => setConfirmarStatus(novoStatus)}
                  >
                    Aplicar status
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => void gerarPdf()}>
                    <FileDown className="mr-2 h-4 w-4" /> Gerar PDF
                  </Button>
                </Card>

                <Card className="space-y-2 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">WhatsApp</h2>
                  <p className="text-xs text-muted-foreground">
                    Nada é enviado automaticamente: a mensagem é revisada por você e aberta no WhatsApp.
                  </p>
                  {OS_TEMPLATES.map((t) => (
                    <Button key={t} variant="ghost" size="sm" className="w-full justify-start" onClick={() => prepararMensagem(t)}>
                      <MessageCircle className="mr-2 h-4 w-4" /> {OS_TEMPLATE_LABEL[t]}
                    </Button>
                  ))}
                </Card>

                <Card className="space-y-3 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Lembretes</h2>
                  {lembretes.length === 0 && (
                    <p className="text-xs text-muted-foreground">Nenhum lembrete agendado.</p>
                  )}
                  {lembretes.map((l) => (
                    <div key={l.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2 text-xs">
                      <span>
                        <strong className="text-foreground">{l.tipo}</strong>
                        <br />
                        {new Date(l.quando).toLocaleString("pt-BR")} · {l.status}
                      </span>
                      {l.status !== "concluido" && (
                        <Button size="icon" variant="ghost" aria-label="Concluir lembrete" onClick={async () => { await concluirLembrete({ data: { id: l.id } }); await carregar(); }}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Input placeholder="Tipo (ex.: retorno prometido)" value={lembreteTipo} onChange={(e) => setLembreteTipo(e.target.value)} />
                  <Input type="datetime-local" value={lembreteQuando} onChange={(e) => setLembreteQuando(e.target.value)} />
                  <Button variant="outline" size="sm" className="w-full" onClick={() => void criarLembrete()}>
                    Criar lembrete
                  </Button>
                </Card>

                <Card className="space-y-3 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Histórico</h2>
                  {eventos.length === 0 && <p className="text-xs text-muted-foreground">Sem eventos.</p>}
                  <ol className="space-y-2 text-xs">
                    {eventos.map((ev) => (
                      <li key={ev.id} className="border-l-2 border-border pl-3">
                        <p className="font-medium text-foreground">{ev.descricao}</p>
                        <p className="text-muted-foreground">
                          {new Date(ev.em).toLocaleString("pt-BR")}
                          {ev.ator ? ` · ${ev.ator}` : ""}
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />

      <Dialog open={!!previa} onOpenChange={(o) => !o && setPrevia(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisar mensagem</DialogTitle>
            <DialogDescription>
              Destinatário: {form["telefone"] ?? ""} · Modelo: {previa ? OS_TEMPLATE_LABEL[previa.template] : ""}
            </DialogDescription>
          </DialogHeader>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm">
            {previa?.texto}
          </pre>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrevia(null)}>Cancelar</Button>
            <Button onClick={() => void abrirWhatsApp()}>Abrir no WhatsApp</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmarStatus} onOpenChange={(o) => !o && setConfirmarStatus(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar mudança de status</AlertDialogTitle>
            <AlertDialogDescription>
              A ordem passará para{" "}
              {confirmarStatus ? OS_STATUS_LABEL[confirmarStatus as OsStatus] : ""}. O histórico é preservado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const alvo = confirmarStatus;
                setConfirmarStatus(null);
                if (alvo) void aplicarStatus(alvo);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOrdemDetalhe;
