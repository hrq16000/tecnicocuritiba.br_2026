import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Check, ClipboardCopy, Download, FileDown, FileUp, Layers, Loader2, Plus, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import {
  TECHNICAL_CASE_CATEGORIES,
  type TechnicalCaseCategory,
  type TechnicalCasePhotoKind,
  type TechnicalCaseStatus,
} from "@/lib/technicalCases";
import {
  anonymizeDraft,
  auditEvidenceSet,
  buildChecklist,
  canTransition,
  checkEvidenceUrl,
  evaluateDraft,
  newDraft,
  processEvidenceFile,
  readDrafts,
  removeDraft,
  upsertDraft,
  validatePhotoMetadata,
  type DraftCase,
} from "@/lib/technicalCaseDraftStore";
import {
  buildAuditPackage,
  buildRequirements,
  CASE_FORM_TEMPLATE,
  MIN_REVIEWED_PHOTOS,
  reviewedPhotoCount,
  scoreCase,
} from "@/lib/technicalCaseAudit";
import { downloadCasePdf, generateProofBlockPdf } from "@/lib/technicalCasePdf";
import { downloadBlob } from "@/lib/pdfDoc";
import {
  importCases,
  IMPORT_CSV_TEMPLATE,
  IMPORT_JSON_TEMPLATE,
} from "@/lib/technicalCaseImport";
import {
  evaluateBlock,
  newBlock,
  readBlocks,
  removeBlock,
  upsertBlock,
  type ProofBlock,
} from "@/lib/technicalCaseProofBlocks";
import {
  TechnicalCaseSummary,
  TechnicalCaseEvidence,
  TechnicalCaseProcess,
} from "@/components/casos/TechnicalCaseBlocks";



const PHOTO_KINDS: TechnicalCasePhotoKind[] = [
  "equipamento-recebido",
  "detalhe-externo-do-defeito",
  "componente-danificado",
  "poeira-e-refrigeracao",
  "armazenamento-substituido",
  "bancada",
  "teste-tecnico",
  "organizacao-interna",
  "resultado-fisico",
];

const STATUS: TechnicalCaseStatus[] = ["draft", "review", "approved", "rejected"];

const statusTone: Record<TechnicalCaseStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  review: "bg-amber-500/15 text-amber-600",
  approved: "bg-emerald-500/15 text-emerald-600",
  rejected: "bg-red-500/15 text-red-600",
};

const toList = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);
const fromList = (a: string[]) => a.join("\n");

function ListField({
  label, value, onChange, placeholder,
}: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Textarea
        rows={3}
        value={fromList(value)}
        placeholder={placeholder ?? "Um item por linha"}
        onChange={(e) => onChange(toList(e.target.value))}
      />
    </label>
  );
}

function CheckField({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-2 text-sm text-foreground">
      <input type="checkbox" className="mt-1" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export default function AdminCasos() {
  const { loading, session, isAdmin } = useAdminAuth();
  const [drafts, setDrafts] = useState<DraftCase[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | TechnicalCaseStatus>("todos");
  const [categoryFilter, setCategoryFilter] = useState<"todas" | TechnicalCaseCategory>("todas");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importIssues, setImportIssues] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<ProofBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Casos técnicos (interno) — Admin";
    const list = readDrafts();
    setDrafts(list);
    setActiveId(list[0]?.id ?? null);
    const bl = readBlocks();
    setBlocks(bl);
    setActiveBlockId(bl[0]?.id ?? null);
  }, []);

  const active = useMemo(() => drafts.find((d) => d.id === activeId) ?? null, [drafts, activeId]);
  const gate = useMemo(() => (active ? evaluateDraft(active) : null), [active]);
  const checklist = useMemo(() => (active ? buildChecklist(active) : []), [active]);
  const requirements = useMemo(() => (active ? buildRequirements(active) : []), [active]);
  const score = useMemo(() => (active ? scoreCase(active) : null), [active]);
  const evidenceIssues = useMemo(() => (active ? auditEvidenceSet(active.evidence.photos) : []), [active]);
  const activeBlock = useMemo(() => blocks.find((b) => b.id === activeBlockId) ?? null, [blocks, activeBlockId]);
  const blockEval = useMemo(
    () => (activeBlock ? evaluateBlock(activeBlock, drafts) : null),
    [activeBlock, drafts],
  );


  const visibleDrafts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return drafts.filter((d) => {
      if (statusFilter !== "todos" && d.status !== statusFilter) return false;
      if (categoryFilter !== "todas" && d.equipment.category !== categoryFilter) return false;
      if (!q) return true;
      return [d.id, d.title, d.serviceSlug, d.equipment.category, d.evidence.workOrderReference ?? ""]
        .join(" ").toLowerCase().includes(q);
    });
  }, [drafts, query, statusFilter, categoryFilter]);


  const save = (next: DraftCase) => {
    setDrafts(upsertDraft(next));
    setActiveId(next.id);
  };

  const patch = (p: Partial<DraftCase>) => {
    if (!active) return;
    save({ ...active, ...p });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />;

  const create = () => {
    const d = newDraft("manutencao-de-notebook");
    save(d);
    setShowPreview(false);
  };

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(CASE_FORM_TEMPLATE);
      toast({ title: "Modelo copiado", description: "Cole no bloco de notas e preencha em campo." });
    } catch {
      toast({ title: "Não foi possível copiar", description: "Selecione e copie manualmente.", variant: "destructive" });
    }
  };

  const downloadAudit = () => {
    const md = buildAuditPackage(drafts);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria-casos-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Pacote de auditoria gerado", description: "Somente leitura — nada foi publicado." });
  };

  const runImport = () => {
    const res = importCases(importText);
    setImportIssues(res.issues.map((i) => `Linha ${i.row} · ${i.field}: ${i.message}`));
    if (res.drafts.length === 0) {
      toast({
        title: "Nada importado",
        description: `${res.skipped} registro(s) recusado(s) na validação.`,
        variant: "destructive",
      });
      return;
    }
    let list = drafts;
    for (const d of res.drafts) list = upsertDraft(d);
    setDrafts(list);
    setActiveId(res.drafts[0].id);
    setImportText("");
    toast({
      title: `${res.drafts.length} caso(s) importado(s)`,
      description: `${res.skipped} recusado(s). Todos entram como rascunho e ainda precisam de evidências validadas.`,
    });
  };

  const exportCasePdf = async (c: DraftCase) => {
    setBusy(true);
    try {
      await downloadCasePdf(c);
      toast({ title: "PDF do caso gerado", description: "Documento interno — nada foi publicado." });
    } catch {
      toast({ title: "Falha ao gerar o PDF", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const createBlock = () => {
    const b = newBlock(`Bloco de prova ${blocks.length + 1}`);
    setBlocks(upsertBlock(b));
    setActiveBlockId(b.id);
  };

  const toggleCaseInBlock = (caseId: string) => {
    if (!activeBlock) return;
    const has = activeBlock.caseIds.includes(caseId);
    const next: ProofBlock = {
      ...activeBlock,
      caseIds: has ? activeBlock.caseIds.filter((i) => i !== caseId) : [...activeBlock.caseIds, caseId],
    };
    setBlocks(upsertBlock(next));
  };

  const exportBlockPdf = async () => {
    if (!activeBlock || !blockEval) return;
    setBusy(true);
    try {
      const blob = await generateProofBlockPdf(
        activeBlock.name,
        blockEval.cases,
        blockEval.pendencias,
        `${blockEval.recommendation} — ${blockEval.rationale}`,
      );
      downloadBlob(blob, `${activeBlock.id}.pdf`);
      toast({ title: "PDF do bloco gerado", description: "Somente leitura — nada foi publicado." });
    } catch {
      toast({ title: "Falha ao gerar o PDF do bloco", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };


  const handleFile = async (file: File) => {
    if (!active) return;
    setBusy(true);
    const res = await processEvidenceFile(file);
    setBusy(false);
    if (!res.ok || !res.dataUrl) {
      toast({ title: "Evidência recusada", description: res.errors.join(" "), variant: "destructive" });
      return;
    }
    patch({
      evidence: {
        ...active.evidence,
        photos: [
          ...active.evidence.photos,
          {
            src: res.dataUrl,
            alt: "",
            caption: "",
            kind: "equipamento-recebido",
            fromService: true,
            exifStripped: true,
            screenReviewed: false,
            fingerprint: res.fingerprint,
            quality: res.quality,
          },
        ],
      },
    });
    toast({
      title: "Evidência processada",
      description: [`EXIF removido · ${res.width}×${res.height}px.`, ...res.warnings].join(" "),
      variant: res.warnings.length ? "destructive" : undefined,
    });
  };

  const handleUrl = async () => {
    if (!active || !urlInput.trim()) return;
    setBusy(true);
    const res = await checkEvidenceUrl(urlInput.trim());
    setBusy(false);
    if (!res.ok) {
      toast({ title: "URL recusada", description: res.errors.join(" "), variant: "destructive" });
      return;
    }
    patch({
      evidence: {
        ...active.evidence,
        photos: [
          ...active.evidence.photos,
          {
            src: urlInput.trim(),
            alt: "",
            caption: "",
            kind: "equipamento-recebido",
            fromService: true,
            exifStripped: false,
            screenReviewed: false,
            fingerprint: res.fingerprint,
            quality: res.quality,
          },
        ],
      },
    });
    setUrlInput("");
    toast({
      title: "URL validada",
      description: [`HTTP 200 · ${res.width}×${res.height}px.`, ...res.warnings].join(" "),
      variant: res.warnings.length ? "destructive" : undefined,
    });
  };


  const setStatus = (next: TechnicalCaseStatus) => {
    if (!active) return;
    const check = canTransition(active, next);
    if (!check.ok) {
      toast({ title: `Transição para "${next}" bloqueada`, description: check.reason, variant: "destructive" });
      return;
    }
    patch({
      status: next,
      reviewedAt: next === "approved" ? active.reviewedAt || new Date().toISOString().slice(0, 10) : active.reviewedAt,
    });
    toast({ title: `Status: ${next}` });
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Casos técnicos (interno) — Admin</title>
      </Helmet>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Casos técnicos — estação interna</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Registro local no seu navegador. Nenhum caso é publicado, nenhuma rota pública é criada e
              nenhum dado de cliente deve ser digitado.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void copyTemplate()}>
              <ClipboardCopy className="mr-2 h-4 w-4" /> Modelo do formulário
            </Button>
            <Button variant="outline" onClick={() => setShowImport((v) => !v)}>
              <FileUp className="mr-2 h-4 w-4" /> Importar JSON/CSV
            </Button>
            <Button variant="outline" disabled={drafts.length === 0} onClick={downloadAudit}>
              <Download className="mr-2 h-4 w-4" /> Pacote de auditoria
            </Button>
            <Button onClick={create}>
              <Plus className="mr-2 h-4 w-4" /> Novo caso
            </Button>
          </div>
        </header>

        {showImport && (
          <Card className="mb-6 space-y-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-bold text-foreground">Importação preenchível</h2>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => setImportText(IMPORT_JSON_TEMPLATE)}>
                  Modelo JSON
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setImportText(IMPORT_CSV_TEMPLATE)}>
                  Modelo CSV
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Cole um JSON (lista de casos) ou um CSV com cabeçalho. Listas em uma célula são separadas por
              <code className="mx-1">|</code>. Campos obrigatórios e varredura de dados pessoais rodam antes
              de gravar: registros com problema são recusados por inteiro.
            </p>
            <Textarea rows={10} value={importText} onChange={(e) => setImportText(e.target.value)}
              placeholder="Cole aqui o JSON ou CSV dos atendimentos" className="font-mono text-xs" />
            <div className="flex flex-wrap gap-2">
              <Button onClick={runImport} disabled={!importText.trim()}>
                <Upload className="mr-2 h-4 w-4" /> Validar e importar
              </Button>
              <Button variant="ghost" onClick={() => { setImportText(""); setImportIssues([]); }}>Limpar</Button>
            </div>
            {importIssues.length > 0 && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
                <p className="text-sm font-medium text-destructive">Registros recusados</p>
                <ul className="mt-1 list-disc pl-5 text-xs text-destructive">
                  {importIssues.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            )}
          </Card>
        )}


        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-3">
            <Input value={query} placeholder="Buscar por título, ID, OS ou serviço"
              onChange={(e) => setQuery(e.target.value)} />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}>
              <SelectTrigger><SelectValue placeholder="Serviço" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos os serviços</SelectItem>
                {TECHNICAL_CASE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {visibleDrafts.length} de {drafts.length} caso(s) · meta da coleta: 3
            </p>

            {visibleDrafts.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum caso corresponde ao filtro.</p>
            )}
            {visibleDrafts.map((d) => {
              const s = scoreCase(d);
              return (
                <button
                  key={d.id}
                  onClick={() => { setActiveId(d.id); setShowPreview(false); }}
                  className={`w-full rounded-xl border p-3 text-left text-sm transition ${
                    d.id === activeId ? "border-accent bg-accent/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <span className="block font-medium text-foreground">{d.title || "(sem título)"}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge className={statusTone[d.status]}>{d.status}</Badge>
                    <span className="text-xs text-muted-foreground">{d.equipment.category}</span>
                    <span className="text-xs text-muted-foreground">{s.total}/14</span>
                  </span>
                </button>
              );
            })}
          </aside>


          {!active ? (
            <Card className="p-6 text-sm text-muted-foreground">
              Crie um caso para começar. O fluxo é: preencher → anonimizar → validar evidências →
              checklist → rascunho de revisão interna.
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Identificação */}
              <Card className="space-y-4 p-5">
                <h2 className="font-heading text-lg font-bold text-foreground">1. Identificação</h2>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Título factual</span>
                  <Input value={active.title} onChange={(e) => patch({ title: e.target.value })}
                    placeholder="Notebook não ligava após queda de energia — falha na fonte" />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium">Categoria / serviço</span>
                    <Select
                      value={active.equipment.category}
                      onValueChange={(v) =>
                        patch({
                          equipment: { ...active.equipment, category: v as TechnicalCaseCategory },
                          serviceSlug: v as TechnicalCaseCategory,
                        })
                      }
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TECHNICAL_CASE_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium">Data do atendimento</span>
                    <Input type="date" value={active.occurredAt.slice(0, 10)}
                      onChange={(e) => patch({ occurredAt: e.target.value })} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium">Marca (opcional)</span>
                    <Input value={active.equipment.brand ?? ""}
                      onChange={(e) => patch({ equipment: { ...active.equipment, brand: e.target.value } })} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium">Modelo (opcional, sem série)</span>
                    <Input value={active.equipment.model ?? ""}
                      onChange={(e) => patch({ equipment: { ...active.equipment, model: e.target.value } })} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium">Cidade</span>
                    <Input value={active.location.city}
                      onChange={(e) => patch({ location: { ...active.location, city: e.target.value } })} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium">Região ampla (nunca endereço)</span>
                    <Input value={active.location.neighborhood ?? ""}
                      onChange={(e) => patch({ location: { ...active.location, neighborhood: e.target.value } })} />
                  </label>
                  <label className="block space-y-1.5 md:col-span-2">
                    <span className="text-sm font-medium">Referência interna do atendimento</span>
                    <Input value={active.evidence.workOrderReference ?? ""}
                      placeholder="OS-2026-014 (referência, nunca a ordem integral)"
                      onChange={(e) => patch({ evidence: { ...active.evidence, workOrderReference: e.target.value } })} />
                  </label>
                </div>
              </Card>

              {/* Conteúdo técnico */}
              <Card className="space-y-4 p-5">
                <h2 className="font-heading text-lg font-bold text-foreground">2. Registro técnico</h2>
                <ListField label="Sintoma informado" value={active.reportedSymptoms}
                  onChange={(v) => patch({ reportedSymptoms: v })} />
                <ListField label="Testes e verificações executados" value={active.checksPerformed}
                  onChange={(v) => patch({ checksPerformed: v })} />
                <ListField label="Diagnóstico confirmado" value={active.confirmedDiagnosis}
                  onChange={(v) => patch({ confirmedDiagnosis: v })} />
                <ListField label="Intervenção realizada" value={active.proceduresPerformed}
                  onChange={(v) => patch({ proceduresPerformed: v })} />
                <ListField label="Peças utilizadas (opcional)" value={active.partsUsed ?? []}
                  onChange={(v) => patch({ partsUsed: v })} />
                <ListField label="Resultado observado" value={active.observedResult}
                  onChange={(v) => patch({ observedResult: v })} />
                <ListField label="Limitações declaradas" value={active.limitations}
                  onChange={(v) => patch({ limitations: v })} />
                <ListField label="Recomendações" value={active.recommendations}
                  onChange={(v) => patch({ recommendations: v })} />
              </Card>

              {/* Evidências */}
              <Card className="space-y-4 p-5">
                <h2 className="font-heading text-lg font-bold text-foreground">3. Evidências</h2>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG ou WebP até 8 MB, mínimo 640×360. O upload é re-codificado no navegador,
                  o que descarta EXIF (GPS, aparelho, data). URLs são validadas por HTTP 200 e dimensão.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                    <Upload className="h-4 w-4" /> Enviar arquivo
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.currentTarget.value = ""; }} />
                  </label>
                  <div className="flex flex-1 items-center gap-2">
                    <Input value={urlInput} placeholder="/blog/exemplo.jpg ou https://…"
                      onChange={(e) => setUrlInput(e.target.value)} />
                    <Button variant="outline" onClick={() => void handleUrl()} disabled={busy}>
                      Validar URL
                    </Button>
                  </div>
                  {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>

                <div className="space-y-4">
                  {active.evidence.photos.map((p, i) => {
                    const errs = validatePhotoMetadata(p);
                    return (
                      <div key={i} className="grid gap-3 rounded-xl border border-border p-3 md:grid-cols-[160px_1fr]">
                        <img loading="lazy" decoding="async" src={p.src} alt={p.alt || "evidência sem alt"} className="h-28 w-full rounded-lg object-cover" />
                        <div className="space-y-2">
                          <Input value={p.alt} placeholder="Alt descritivo (mín. 15 caracteres)"
                            onChange={(e) => {
                              const photos = [...active.evidence.photos];
                              photos[i] = { ...p, alt: e.target.value };
                              patch({ evidence: { ...active.evidence, photos } });
                            }} />
                          <Input value={p.caption} placeholder="Legenda factual"
                            onChange={(e) => {
                              const photos = [...active.evidence.photos];
                              photos[i] = { ...p, caption: e.target.value };
                              patch({ evidence: { ...active.evidence, photos } });
                            }} />
                          <div className="flex flex-wrap items-center gap-3">
                            <Select value={p.kind} onValueChange={(v) => {
                              const photos = [...active.evidence.photos];
                              photos[i] = { ...p, kind: v as TechnicalCasePhotoKind };
                              patch({ evidence: { ...active.evidence, photos } });
                            }}>
                              <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {PHOTO_KINDS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <CheckField label="Do atendimento" checked={p.fromService} onChange={(v) => {
                              const photos = [...active.evidence.photos];
                              photos[i] = { ...p, fromService: v };
                              patch({ evidence: { ...active.evidence, photos } });
                            }} />
                            <CheckField label="EXIF removido" checked={p.exifStripped} onChange={(v) => {
                              const photos = [...active.evidence.photos];
                              photos[i] = { ...p, exifStripped: v };
                              patch({ evidence: { ...active.evidence, photos } });
                            }} />
                            <CheckField label="Tela/etiqueta revisada" checked={p.screenReviewed} onChange={(v) => {
                              const photos = [...active.evidence.photos];
                              photos[i] = { ...p, screenReviewed: v };
                              patch({ evidence: { ...active.evidence, photos } });
                            }} />
                            <Button size="sm" variant="ghost" onClick={() => {
                              const photos = active.evidence.photos.filter((_, j) => j !== i);
                              patch({ evidence: { ...active.evidence, photos } });
                            }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {errs.length > 0 && (
                            <p className="text-xs text-red-500">Pendências: {errs.join("; ")}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Privacidade */}
              <Card className="space-y-3 p-5">
                <h2 className="font-heading text-lg font-bold text-foreground">4. Anonimização</h2>
                <div className="grid gap-2 md:grid-cols-2">
                  <CheckField label="Nome do cliente removido" checked={active.privacy.customerNameRemoved}
                    onChange={(v) => patch({ privacy: { ...active.privacy, customerNameRemoved: v } })} />
                  <CheckField label="Número de série removido" checked={active.privacy.serialNumberRemoved}
                    onChange={(v) => patch({ privacy: { ...active.privacy, serialNumberRemoved: v } })} />
                  <CheckField label="Telefone, e-mail e endereço removidos" checked={active.privacy.personalDataRemoved}
                    onChange={(v) => patch({ privacy: { ...active.privacy, personalDataRemoved: v } })} />
                  <CheckField label="Dados em tela revisados" checked={active.privacy.screenDataReviewed}
                    onChange={(v) => patch({ privacy: { ...active.privacy, screenDataReviewed: v } })} />
                  <CheckField label="Autorização do cliente registrada" checked={active.evidence.customerAuthorization}
                    onChange={(v) => patch({ evidence: { ...active.evidence, customerAuthorization: v } })} />
                  <CheckField label="Revisão técnica concluída" checked={active.evidence.technicalReview}
                    onChange={(v) => patch({
                      evidence: { ...active.evidence, technicalReview: v },
                      reviewedAt: v ? active.reviewedAt || new Date().toISOString().slice(0, 10) : active.reviewedAt,
                    })} />
                </div>

                {gate && gate.pii.length > 0 ? (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/5 p-3 text-sm">
                    <p className="font-medium text-red-500">Possíveis dados pessoais detectados:</p>
                    <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                      {gate.pii.map((h, i) => (
                        <li key={i}>{h.field} — {h.kind}: <code>{h.sample}</code></li>
                      ))}
                    </ul>
                    <Button className="mt-3" size="sm" variant="outline"
                      onClick={() => { save(anonymizeDraft(active)); toast({ title: "Anonimização aplicada" }); }}>
                      <ShieldCheck className="mr-2 h-4 w-4" /> Anonimizar automaticamente
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-emerald-600">Varredura de PII sem ocorrências.</p>
                )}
              </Card>

              {/* Checklist + status */}
              <Card className="space-y-4 p-5">
                <h2 className="font-heading text-lg font-bold text-foreground">5. Checklist operacional</h2>
                <ul className="space-y-1.5 text-sm">
                  {checklist.map((i) => (
                    <li key={i.id} className="flex items-start gap-2">
                      {i.done
                        ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        : <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
                      <span className={i.done ? "text-muted-foreground" : "text-foreground"}>
                        {i.label}
                        {!i.done && i.hint ? <span className="block text-xs text-red-500">{i.hint}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>

                {gate && gate.failClosedReasons.length > 0 && (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
                    <p className="font-medium text-amber-600">Gate fail-closed pendente:</p>
                    <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                      {gate.failClosedReasons.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {STATUS.map((s) => (
                    <Button key={s} size="sm" variant={active.status === s ? "default" : "outline"}
                      onClick={() => setStatus(s)}>
                      {s}
                    </Button>
                  ))}
                  <Button size="sm" variant="ghost" className="ml-auto text-red-500"
                    onClick={() => {
                      const rest = removeDraft(active.id);
                      setDrafts(rest);
                      setActiveId(rest[0]?.id ?? null);
                    }}>
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir rascunho
                  </Button>
                </div>
              </Card>

              {/* Auditoria visual por caso */}
              <Card className="space-y-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    5.1 Auditoria editorial do caso
                  </h2>
                  {score && (
                    <Badge className={score.total >= 11
                      ? "bg-emerald-500/15 text-emerald-600"
                      : score.total >= 8 ? "bg-amber-500/15 text-amber-600" : "bg-muted text-muted-foreground"}>
                      {score.total}/14 · {score.recommendation}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  Fotos revisadas: {reviewedPhotoCount(active)}/{MIN_REVIEWED_PHOTOS} exigidas
                  (foto do atendimento, com alt, legenda, EXIF e tela conferidos).
                </p>

                <div className="grid gap-3 md:grid-cols-2">
                  {["Diagnóstico", "Resultado", "Limitações", "Evidências", "Privacidade", "Revisão"].map((group) => {
                    const items = requirements.filter((r) => r.group === group);
                    if (items.length === 0) return null;
                    const okCount = items.filter((i) => i.done).length;
                    return (
                      <div key={group} className="rounded-xl border border-border p-3">
                        <p className="mb-2 text-sm font-semibold text-foreground">
                          {group} <span className="text-xs font-normal text-muted-foreground">{okCount}/{items.length}</span>
                        </p>
                        <ul className="space-y-1.5 text-sm">
                          {items.map((i) => (
                            <li key={i.id} className="flex items-start gap-2">
                              {i.done
                                ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                : <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
                              <span className={i.done ? "text-muted-foreground" : "text-foreground"}>
                                {i.label}
                                {!i.done && i.missing
                                  ? <span className="block text-xs text-red-500">Falta: {i.missing}</span>
                                  : null}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {score && (
                  <div className="rounded-xl border border-border p-3">
                    <p className="mb-2 text-sm font-semibold text-foreground">Pontuação editorial</p>
                    <ul className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                      {score.criteria.map((c) => (
                        <li key={c.label}>{c.label}: <strong className="text-foreground">{c.score}</strong> — {c.note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evidenceIssues.length > 0 && (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3">
                    <p className="text-sm font-semibold text-destructive">Evidências a substituir</p>
                    <ul className="mt-1 list-disc pl-5 text-sm text-destructive">
                      {evidenceIssues.map((i) => <li key={`${i.kind}-${i.index}`}>{i.message}</li>)}
                    </ul>
                  </div>
                )}

                <Button variant="outline" disabled={busy} onClick={() => void exportCasePdf(active)}>
                  <FileDown className="mr-2 h-4 w-4" /> Exportar este caso em PDF
                </Button>
              </Card>





              {/* Rascunho de revisão interna */}
              <Card className="space-y-4 p-5">
                <h2 className="font-heading text-lg font-bold text-foreground">6. Rascunho de revisão interna</h2>
                <p className="text-sm text-muted-foreground">
                  A prévia só é liberada quando o checklist e o gate fail-closed passam. Ela existe apenas
                  aqui dentro — nenhuma rota pública, sitemap ou link é criado.
                </p>
                <Button variant="outline" disabled={!gate?.readyForInternalPreview}
                  onClick={() => setShowPreview((v) => !v)}>
                  {showPreview ? "Ocultar prévia" : "Gerar prévia interna"}
                </Button>
                {showPreview && gate?.readyForInternalPreview && (
                  <div className="space-y-5 rounded-xl border border-dashed border-border p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Prévia interna — não publicada
                    </p>
                    <TechnicalCaseSummary caso={{ ...active, status: "approved" }} />
                    <TechnicalCaseProcess caso={{ ...active, status: "approved" }} />
                    <div className="grid gap-4 md:grid-cols-2">
                      {active.evidence.photos.map((p, i) => (
                        <TechnicalCaseEvidence key={i} photo={p} />
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* Blocos de prova */}
        <Card className="mt-8 space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground">
              <Layers className="mr-2 inline h-5 w-5" /> Blocos de prova
            </h2>
            <Button variant="outline" onClick={createBlock}>
              <Plus className="mr-2 h-4 w-4" /> Novo bloco
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Agrupe casos aprovados para avaliar a recomendação editorial do conjunto. Agrupar não publica
            nada — o bloco existe só para decisão interna.
          </p>

          {blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum bloco criado.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {blocks.map((b) => (
                <button key={b.id} onClick={() => setActiveBlockId(b.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    b.id === activeBlockId ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground"
                  }`}>
                  {b.name} · {b.caseIds.length}
                </button>
              ))}
            </div>
          )}

          {activeBlock && blockEval && (
            <div className="space-y-4 rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Input value={activeBlock.name} className="max-w-xs"
                  onChange={(e) => setBlocks(upsertBlock({ ...activeBlock, name: e.target.value }))} />
                <Button variant="ghost" size="sm"
                  onClick={() => {
                    const next = removeBlock(activeBlock.id);
                    setBlocks(next);
                    setActiveBlockId(next[0]?.id ?? null);
                  }}>
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir bloco
                </Button>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                {drafts.map((d) => (
                  <label key={d.id} className="flex items-start gap-2 rounded-lg border border-border p-2 text-sm">
                    <input type="checkbox" className="mt-1" checked={activeBlock.caseIds.includes(d.id)}
                      onChange={() => toggleCaseInBlock(d.id)} />
                    <span>
                      {d.title || d.id}
                      <span className="ml-2 text-xs text-muted-foreground">{d.status} · {scoreCase(d).total}/14</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <p className="font-semibold text-foreground">
                  <ShieldCheck className="mr-2 inline h-4 w-4" /> {blockEval.recommendation}
                </p>
                <p className="mt-1 text-muted-foreground">{blockEval.rationale}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {blockEval.approvedCount} aprovado(s) · média {blockEval.averageScore}/14 ·
                  {" "}{blockEval.services.length} serviço(s)
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">Checklist único de pendências</p>
                {blockEval.pendencias.length === 0 ? (
                  <p className="mt-1 text-sm text-muted-foreground">Nenhuma pendência aberta neste bloco.</p>
                ) : (
                  <ul className="mt-1 space-y-1 text-sm">
                    {blockEval.pendencias.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <span className="text-foreground">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Button variant="outline" disabled={busy || blockEval.cases.length === 0}
                onClick={() => void exportBlockPdf()}>
                <FileDown className="mr-2 h-4 w-4" /> Exportar bloco em PDF
              </Button>
            </div>
          )}
        </Card>

      </main>
    </>
  );
}
