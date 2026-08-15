import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "@/lib/router-compat";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Loader2, Download, Search, RefreshCw, LogOut, Filter, FileText, FileSpreadsheet, ChevronDown,
} from "lucide-react";



type Submission = {
  id: string;
  created_at: string;
  session_id: string;
  equipamento: string | null;
  marca: string | null;
  sintoma: string | null;
  requires_coleta: boolean;
  media_paths: unknown;
  wa_message: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  status_atendimento: string;
  notas_admin: string | null;
  atendido_em: string | null;
};

const STATUS_OPTIONS = ["novo", "contatado", "agendado", "fechado", "perdido"] as const;
const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  novo: "default",
  contatado: "secondary",
  agendado: "secondary",
  fechado: "outline",
  perdido: "destructive",
};

const PAGE_SIZE = 25;

const AdminFunnel = () => {
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [equipFilter, setEquipFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [coletaFilter, setColetaFilter] = useState<string>("all");
  const [waFilter, setWaFilter] = useState<string>("all");
  const [sintomaFilter, setSintomaFilter] = useState<string>("all");

  const [selected, setSelected] = useState<Submission | null>(null);


  const fetchData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    let query = supabase
      .from("funnel_submissions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (equipFilter !== "all") query = query.eq("equipamento", equipFilter);
    if (statusFilter !== "all") query = query.eq("status_atendimento", statusFilter);
    if (coletaFilter === "yes") query = query.eq("requires_coleta", true);
    if (coletaFilter === "no") query = query.eq("requires_coleta", false);
    if (waFilter === "yes") query = query.not("wa_message", "is", null);
    if (waFilter === "no") query = query.is("wa_message", null);
    if (sintomaFilter !== "all") query = query.eq("sintoma", sintomaFilter);
    if (search.trim()) {
      const s = `%${search.trim()}%`;
      query = query.or(`wa_message.ilike.${s},marca.ilike.${s},utm_campaign.ilike.${s},sintoma.ilike.${s}`);
    }

    const { data, error, count: c } = await query;
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
      return;
    }
    setRows((data || []) as Submission[]);
    setCount(c || 0);
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, equipFilter, statusFilter, coletaFilter, waFilter, sintomaFilter, isAdmin]);

  const distinctSintoma = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.sintoma && s.add(r.sintoma));
    return Array.from(s);
  }, [rows]);


  const distinctEquip = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.equipamento && s.add(r.equipamento));
    return Array.from(s);
  }, [rows]);

  const openDetail = (row: Submission) => {
    setSelected(row);
  };


  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("funnel_submissions")
      .update({
        status_atendimento: status,
        atendido_em: new Date().toISOString(),
        atendido_por: session?.user.id ?? null,
      })
      .eq("id", id);
    if (error) {
      toast({ title: "Falha ao atualizar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Status atualizado" });
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status_atendimento: status } : r)));
    if (selected?.id === id) setSelected({ ...selected, status_atendimento: status });
  };

  const saveNotes = async (id: string, notas: string) => {
    const { error } = await supabase
      .from("funnel_submissions")
      .update({ notas_admin: notas })
      .eq("id", id);
    if (error) {
      toast({ title: "Falha ao salvar notas", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Notas salvas" });
  };

  const csvColumns: { key: keyof Submission | "wa_message"; label: string }[] = [
    { key: "created_at", label: "Data" },
    { key: "equipamento", label: "Equipamento" },
    { key: "marca", label: "Marca" },
    { key: "sintoma", label: "Sintoma" },
    { key: "requires_coleta", label: "Coleta" },
    { key: "status_atendimento", label: "Status" },
    { key: "utm_source", label: "UTM Source" },
    { key: "utm_medium", label: "UTM Medium" },
    { key: "utm_campaign", label: "UTM Campaign" },
    { key: "gclid", label: "gclid" },
    { key: "atendido_em", label: "Atendido em" },
    { key: "notas_admin", label: "Notas" },
    { key: "wa_message", label: "Mensagem WhatsApp" },
  ];

  const exportCsv = () => {
    const csv = [
      csvColumns.map((c) => c.label).join(","),
      ...rows.map((r) =>
        csvColumns.map((c) => {
          const v = (r as unknown as Record<string, unknown>)[c.key];
          const s = v == null ? "" : String(v).replace(/"/g, '""').replace(/\r?\n/g, " ⏎ ");
          return `"${s}"`;
        }).join(","),
      ),
    ].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `funnel-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = async () => {
    const [{ default: jsPDF }, autoTableMod] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const autoTable = (autoTableMod as { default: (doc: unknown, opts: unknown) => void }).default;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    const generatedAt = new Date().toLocaleString("pt-BR");
    doc.setFontSize(14);
    doc.text("Leads do funil — Técnico Curitiba", 40, 40);
    doc.setFontSize(9);
    doc.setTextColor(100);
    const filters: string[] = [];
    if (equipFilter !== "all") filters.push(`equipamento=${equipFilter}`);
    if (statusFilter !== "all") filters.push(`status=${statusFilter}`);
    if (coletaFilter !== "all") filters.push(`coleta=${coletaFilter}`);
    if (waFilter !== "all") filters.push(`envio_wa=${waFilter}`);
    if (sintomaFilter !== "all") filters.push(`sintoma=${sintomaFilter}`);
    if (search.trim()) filters.push(`busca="${search.trim()}"`);
    const filterLine = filters.length ? `Filtros: ${filters.join(" · ")}` : "Sem filtros aplicados";
    doc.text(`Gerado em ${generatedAt} · ${rows.length} registros · ${filterLine}`, 40, 56);

    autoTable(doc, {
      startY: 70,
      head: [["Data", "Equipamento", "Marca", "Sintoma", "Coleta", "Envio WA", "Status", "UTM", "Atendido"]],
      body: rows.map((r) => [
        new Date(r.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
        r.equipamento || "—",
        r.marca || "—",
        r.sintoma || "—",
        r.requires_coleta ? "SIM" : "—",
        r.wa_message ? "Gerada" : "—",
        r.status_atendimento,
        [r.utm_source, r.utm_campaign].filter(Boolean).join(" / ") || "direct",
        r.atendido_em ? new Date(r.atendido_em).toLocaleDateString("pt-BR") : "—",
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // Apêndice: mensagem WhatsApp completa por lead
    doc.addPage();
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Apêndice — Mensagens WhatsApp", 40, 40);
    let y = 60;
    doc.setFontSize(9);
    rows.forEach((r, idx) => {
      const header = `${idx + 1}. ${new Date(r.created_at).toLocaleString("pt-BR")} · ${r.equipamento || "—"} · ${r.sintoma || "—"} · status: ${r.status_atendimento}`;
      const body = r.wa_message || "(mensagem não gerada)";
      const lines = doc.splitTextToSize(body, 760);
      const blockHeight = 18 + lines.length * 10 + 8;
      if (y + blockHeight > 560) {
        doc.addPage();
        y = 40;
      }
      doc.setFont(undefined, "bold");
      doc.text(header, 40, y);
      doc.setFont(undefined, "normal");
      doc.text(lines, 40, y + 14);
      y += blockHeight;
    });

    doc.save(`funnel-submissions-${new Date().toISOString().slice(0, 10)}.pdf`);
  };



  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Acesso negado</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Sua conta não tem permissão de administrador.
          </p>
          <Button variant="outline" onClick={signOut}>Sair</Button>
          <p className="mt-4 text-xs">
            <Link to="/" className="underline">Voltar ao site</Link>
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Funil — Admin | Técnico Curitiba</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Leads do funil</h1>
            <p className="text-xs text-muted-foreground">
              {count} submissões · página {page + 1} de {totalPages}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchData()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" /> Exportar <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportCsv} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" /> CSV (Excel)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void exportPdf()} className="gap-2">
                  <FileText className="h-4 w-4" /> PDF (relatório)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={signOut} className="gap-1">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
          <form
            onSubmit={(e) => { e.preventDefault(); setPage(0); void fetchData(); }}
            className="flex gap-1"
          >
            <Input
              placeholder="Buscar mensagem, marca, campanha…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" size="icon" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Select value={equipFilter} onValueChange={(v) => { setPage(0); setEquipFilter(v); }}>
            <SelectTrigger><SelectValue placeholder="Equipamento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos equipamentos</SelectItem>
              {distinctEquip.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setPage(0); setStatusFilter(v); }}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={coletaFilter} onValueChange={(v) => { setPage(0); setColetaFilter(v); }}>
            <SelectTrigger><SelectValue placeholder="Coleta" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="yes">Exige coleta</SelectItem>
              <SelectItem value="no">Sem coleta</SelectItem>
            </SelectContent>
          </Select>
          <Select value={waFilter} onValueChange={(v) => { setPage(0); setWaFilter(v); }}>
            <SelectTrigger><SelectValue placeholder="Envio WhatsApp" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos envios</SelectItem>
              <SelectItem value="yes">Mensagem gerada</SelectItem>
              <SelectItem value="no">Sem mensagem</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sintomaFilter} onValueChange={(v) => { setPage(0); setSintomaFilter(v); }}>
            <SelectTrigger><SelectValue placeholder="Sintoma" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos sintomas</SelectItem>
              {distinctSintoma.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>


        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">Data</th>
                  <th className="px-3 py-2 text-left">Equipamento</th>
                  <th className="px-3 py-2 text-left">Sintoma</th>
                  <th className="px-3 py-2 text-left">Coleta</th>
                  <th className="px-3 py-2 text-left">WA</th>
                  <th className="px-3 py-2 text-left">Origem</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {loading && rows.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-6 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Carregando…
                  </td></tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-6 text-muted-foreground">
                    <Filter className="h-4 w-4 inline mr-2" /> Nenhum lead encontrado
                  </td></tr>
                )}
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/40">
                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-3 py-2">{r.equipamento || "—"}<div className="text-[10px] text-muted-foreground">{r.marca || ""}</div></td>
                    <td className="px-3 py-2 text-xs">{r.sintoma || "—"}</td>
                    <td className="px-3 py-2">{r.requires_coleta ? <Badge variant="destructive" className="text-[10px]">Coleta</Badge> : <span className="text-xs text-muted-foreground">—</span>}</td>
                    <td className="px-3 py-2">
                      {r.wa_message
                        ? <Badge variant="secondary" className="text-[10px]">Enviada</Badge>
                        : <Badge variant="outline" className="text-[10px]">—</Badge>}
                    </td>
                    <td className="px-3 py-2 text-[10px] text-muted-foreground">
                      {r.utm_source || "direct"}{r.utm_campaign ? ` · ${r.utm_campaign}` : ""}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={STATUS_VARIANT[r.status_atendimento] ?? "default"} className="text-[10px]">
                        {r.status_atendimento}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button size="sm" variant="outline" onClick={() => openDetail(r)}>Abrir</Button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 text-xs">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
          <span>{page + 1} / {totalPages}</span>
          <Button size="sm" variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
        </div>
      </main>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Lead {selected.equipamento || "—"}</SheetTitle>
                <SheetDescription>
                  {new Date(selected.created_at).toLocaleString("pt-BR")} · session {selected.session_id.slice(0, 14)}…
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-4 text-sm">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Status</div>
                  <Select
                    value={selected.status_atendimento}
                    onValueChange={(v) => updateStatus(selected.id, v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border border-border bg-card/50 p-3 space-y-1 text-xs">
                  <div className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Respostas da triagem</div>
                  <p>📦 <strong>Equipamento:</strong> {selected.equipamento || "—"}</p>
                  <p>🏷️ <strong>Marca/tipo:</strong> {selected.marca || "—"}</p>
                  <p>⚠️ <strong>Sintoma:</strong> {selected.sintoma || "—"}</p>
                  <p>
                    📦 <strong>Coleta e Entrega:</strong>{" "}
                    {selected.requires_coleta
                      ? <span className="text-amber-700 dark:text-amber-400 font-semibold">Obrigatória · autorizada pelo cliente</span>
                      : <span className="text-muted-foreground">Não exigida</span>}
                  </p>
                  <p>
                    💬 <strong>Envio WhatsApp:</strong>{" "}
                    {selected.wa_message
                      ? <Badge variant="secondary" className="text-[10px]">Mensagem gerada</Badge>
                      : <Badge variant="outline" className="text-[10px]">Sem mensagem</Badge>}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Field label="UTM Source" value={selected.utm_source} />
                  <Field label="UTM Campaign" value={selected.utm_campaign} />
                  <Field label="UTM Medium" value={selected.utm_medium} />
                  <Field label="gclid" value={selected.gclid} />
                  <Field label="Atendido em" value={selected.atendido_em ? new Date(selected.atendido_em).toLocaleString("pt-BR") : null} />
                  <Field label="Session" value={selected.session_id} />
                </div>

                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Mensagem WhatsApp (pré-preenchida)</div>
                  <pre className="text-[11px] whitespace-pre-wrap bg-muted p-2 rounded max-h-60 overflow-y-auto">{selected.wa_message || "— (não gerada)"}</pre>
                </div>


                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Notas internas</div>
                  <textarea
                    defaultValue={selected.notas_admin ?? ""}
                    rows={3}
                    className="w-full text-xs p-2 rounded border border-border bg-background"
                    onBlur={(e) => {
                      if (e.target.value !== (selected.notas_admin ?? "")) {
                        void saveNotes(selected.id, e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="rounded border border-border p-2">
    <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
    <div className="truncate">{value || "—"}</div>
  </div>
);

export default AdminFunnel;
