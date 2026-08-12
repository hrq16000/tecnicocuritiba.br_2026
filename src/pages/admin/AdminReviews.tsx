import { SkeletonText } from "@/components/motion/Skeletons";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, Download, Plus, Check, EyeOff, Eye, Trash2, ShieldCheck, Star, MessageCircle } from "lucide-react";
import {
  t24WaLink,
  t72WaLink,
  reviewWindow,
  osFollowUpWaLink,
  reviewReminderWaLink,
  reviewPublishedWaLink,
  shouldRemind,
} from "@/lib/reviewRequest";
import { pingIndexNow } from "@/lib/indexNow";

type Review = {
  id: string;
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  comment: string | null;
  service_slug: string | null;
  city: string | null;
  neighborhood: string | null;
  source: string | null;
  google_review_url: string | null;
  verified: boolean;
  published: boolean;
  review_date: string | null;
  created_at: string;
  client_phone: string | null;
  service_closed_at: string | null;
  authorized_publication?: boolean | null;
  origin_protocol?: string | null;

};

type Filter = "all" | "pending" | "published" | "hidden" | "unauthorized";

const emptyForm: Partial<Review> = {
  author_name: "",
  rating: 5,
  comment: "",
  service_slug: "",
  city: "Curitiba",
  neighborhood: "",
  source: "google",
  google_review_url: "",
  verified: true,
  published: true,
  review_date: new Date().toISOString().slice(0, 10),
  client_phone: "",
  service_closed_at: null,
};

/** URLs a notificar no IndexNow quando uma review entra no ar. */
function indexNowUrlsForReview(r: Pick<Review, "service_slug" | "neighborhood">): string[] {
  const urls = new Set<string>(["/", "/avaliacoes", "/sobre"]);
  if (r.service_slug) {
    const slug = r.service_slug.startsWith("/") ? r.service_slug : `/servicos/${r.service_slug}`;
    urls.add(slug);
  }
  if (r.neighborhood) {
    const slug = r.neighborhood.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    urls.add(`/bairros/${slug}`);
  }
  return [...urls];
}

const AdminReviews = () => {
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [bairroFilter, setBairroFilter] = useState("all");
  const [servicoFilter, setServicoFilter] = useState("all");
  const [search, setSearch] = useState("");
  // Prazo configurável (horas) para sugerir o reenvio do link de avaliação.
  const [reminderHours, setReminderHours] = useState(() => {
    const saved = Number(localStorage.getItem("review_reminder_hours"));
    return Number.isFinite(saved) && saved > 0 ? saved : 48;
  });
  const REMINDER_HOURS = reminderHours;
  const [form, setForm] = useState<Partial<Review>>(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } else {
      setReviews((data as Review[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) void fetchReviews();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (filter === "pending" && (r.verified || !r.published)) {
        // pendente = ainda não verificado
        if (r.verified) return false;
      }
      if (filter === "published" && !(r.verified && r.published)) return false;
      if (filter === "hidden" && r.published) return false;
      if (filter === "unauthorized" && !(r.source === "site" && !r.authorized_publication)) return false;
      if (bairroFilter !== "all" && (r.neighborhood ?? "—") !== bairroFilter) return false;
      if (servicoFilter !== "all" && (r.service_slug ?? "—") !== servicoFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = `${r.author_name} ${r.comment ?? ""} ${r.neighborhood ?? ""} ${r.city ?? ""} ${r.service_slug ?? ""} ${r.origin_protocol ?? ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [reviews, filter, bairroFilter, servicoFilter, search]);

  const bairroOptions = useMemo(
    () => [...new Set(reviews.map((r) => r.neighborhood ?? "—"))].sort(),
    [reviews],
  );
  const servicoOptions = useMemo(
    () => [...new Set(reviews.map((r) => r.service_slug ?? "—"))].sort(),
    [reviews],
  );


  const stats = useMemo(() => {
    const pub = reviews.filter((r) => r.verified && r.published);
    const avg = pub.length
      ? (pub.reduce((a, r) => a + r.rating, 0) / pub.length).toFixed(2)
      : "—";
    return {
      total: reviews.length,
      published: pub.length,
      pending: reviews.filter((r) => !r.verified).length,
      hidden: reviews.filter((r) => !r.published).length,
      avg,
    };
  }, [reviews]);

  /** Reviews vindas do site só podem ir ao ar com autorização explícita do cliente. */
  function canPublish(r: Review) {
    return r.source !== "site" || r.authorized_publication === true;
  }

  async function togglePublished(r: Review) {
    const next = !r.published;
    if (next && !canPublish(r)) {
      return toast({
        title: "Sem autorização de publicação",
        description: "O cliente não autorizou publicar este comentário no site.",
        variant: "destructive",
      });
    }
    const { error } = await supabase
      .from("reviews")
      .update({ published: next })
      .eq("id", r.id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, published: next } : x)));
    if (next && r.verified) void pingIndexNow(indexNowUrlsForReview(r));
  }

  async function approve(r: Review) {
    const publicar = canPublish(r);
    const { error } = await supabase
      .from("reviews")
      .update({ verified: true, published: publicar })
      .eq("id", r.id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    setReviews((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, verified: true, published: publicar } : x)),
    );
    if (publicar) void pingIndexNow(indexNowUrlsForReview(r));
    toast({
      title: publicar ? "Review aprovada" : "Review verificada (não publicada)",
      description: publicar
        ? "IndexNow notificado para Bing/Yandex."
        : "Cliente não autorizou a publicação — fica apenas como feedback interno.",
    });
  }

  async function reject(r: Review) {
    if (!confirm("Rejeitar esta avaliação? Ela fica registrada, mas nunca vai ao ar.")) return;
    const { error } = await supabase
      .from("reviews")
      .update({ verified: false, published: false })
      .eq("id", r.id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    setReviews((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, verified: false, published: false } : x)),
    );
    toast({ title: "Avaliação rejeitada", description: "Mantida apenas como registro interno." });
  }



  async function remove(id: string) {
    if (!confirm("Excluir esta review permanentemente?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    setReviews((prev) => prev.filter((x) => x.id !== id));
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(r: Review) {
    setEditingId(r.id);
    setForm(r);
    setDialogOpen(true);
  }

  async function save() {
    if (!form.author_name || !form.rating) {
      return toast({ title: "Nome e nota são obrigatórios", variant: "destructive" });
    }
    const payload = {
      author_name: form.author_name!,
      author_photo_url: form.author_photo_url || null,
      rating: Number(form.rating),
      comment: form.comment || null,
      service_slug: form.service_slug || null,
      city: form.city || null,
      neighborhood: form.neighborhood || null,
      source: form.source || "google",
      google_review_url: form.google_review_url || null,
      verified: !!form.verified,
      published: !!form.published,
      review_date: form.review_date || null,
      client_phone: form.client_phone ? form.client_phone.replace(/\D/g, "") : null,
      service_closed_at: form.service_closed_at || null,
    };
    if (editingId) {
      const { error } = await supabase.from("reviews").update(payload).eq("id", editingId);
      if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      const { error } = await supabase.from("reviews").insert(payload);
      if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
    setDialogOpen(false);
    void fetchReviews();
    if (payload.verified && payload.published) {
      void pingIndexNow(indexNowUrlsForReview(payload));
    }
    toast({ title: editingId ? "Review atualizada" : "Review criada" });
  }

  function exportCsv() {
    const headers = [
      "id", "author_name", "rating", "comment", "service_slug",
      "city", "neighborhood", "source", "verified", "published", "review_date", "created_at",
    ];
    const rows = filtered.map((r) =>
      headers.map((h) => {
        const v = (r as Record<string, unknown>)[h];
        const s = v == null ? "" : String(v).replace(/"/g, '""').replace(/\n/g, " ");
        return `"${s}"`;
      }).join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviews-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Acesso negado</h1>
          <p className="text-muted-foreground">Você não tem permissão de administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Reviews | Técnico Curitiba</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background pt-8 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-primary" /> Gestão de Reviews
              </h1>
              <p className="text-sm text-muted-foreground">
                Aprove, oculte e exporte avaliações. Reviews publicadas alimentam o AggregateRating no JSON-LD.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportCsv}>
                <Download className="w-4 h-4 mr-1" /> CSV
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreate}>
                    <Plus className="w-4 h-4 mr-1" /> Nova
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Editar review" : "Nova review"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Nome" value={form.author_name ?? ""} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="col-span-2" />
                    <Input type="number" min={1} max={5} placeholder="Nota 1-5" value={form.rating ?? 5} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
                    <Input type="date" value={form.review_date ?? ""} onChange={(e) => setForm({ ...form, review_date: e.target.value })} />
                    <Input placeholder="Cidade" value={form.city ?? ""} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    <Input placeholder="Bairro" value={form.neighborhood ?? ""} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
                    <Input placeholder="Serviço (slug)" value={form.service_slug ?? ""} onChange={(e) => setForm({ ...form, service_slug: e.target.value })} className="col-span-2" />
                    <Input placeholder="URL da review Google" value={form.google_review_url ?? ""} onChange={(e) => setForm({ ...form, google_review_url: e.target.value })} className="col-span-2" />
                    <Input placeholder="WhatsApp do cliente (ex: 5541999999999)" value={form.client_phone ?? ""} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} />
                    <Input type="datetime-local" placeholder="Fechado em" value={form.service_closed_at ? new Date(form.service_closed_at).toISOString().slice(0,16) : ""} onChange={(e) => setForm({ ...form, service_closed_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                    <Textarea placeholder="Comentário" value={form.comment ?? ""} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="col-span-2" rows={3} />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} /> Verificada</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publicada</label>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={save}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { k: "Total", v: stats.total },
              { k: "Publicadas", v: stats.published },
              { k: "Pendentes", v: stats.pending },
              { k: "Ocultas", v: stats.hidden },
              { k: "Média", v: stats.avg },
            ].map((s) => (
              <div key={s.k} className="rounded-lg border bg-card p-3">
                <div className="text-xs text-muted-foreground">{s.k}</div>
                <div className="text-xl font-bold">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:flex-wrap gap-3 mb-4">
            <Input placeholder="Buscar por nome, comentário, bairro ou nº da OS..." value={search} onChange={(e) => setSearch(e.target.value)} className="md:max-w-md" />
            <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <SelectTrigger className="md:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pending">Pendentes (não verificadas)</SelectItem>
                <SelectItem value="published">Publicadas</SelectItem>
                <SelectItem value="hidden">Ocultas</SelectItem>
                <SelectItem value="unauthorized">Sem autorização do cliente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={bairroFilter} onValueChange={setBairroFilter}>
              <SelectTrigger className="md:w-48"><SelectValue placeholder="Bairro" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {bairroOptions.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={servicoFilter} onValueChange={setServicoFilter}>
              <SelectTrigger className="md:w-56"><SelectValue placeholder="Serviço" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os serviços</SelectItem>
                {servicoOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Reenviar após
              <Input
                type="number"
                min={1}
                max={720}
                value={reminderHours}
                onChange={(e) => {
                  const v = Math.max(1, Math.min(720, Number(e.target.value) || 1));
                  setReminderHours(v);
                  localStorage.setItem("review_reminder_hours", String(v));
                }}
                className="w-20"
                aria-label="Prazo em horas para sugerir o reenvio do link de avaliação"
              />
              h
            </label>
          </div>



          {loading ? (
            <div className="space-y-3" role="status" aria-label="Carregando avaliações">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-4">
                  <SkeletonText lines={3} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">Nenhuma review encontrada.</div>
              )}
              {filtered.map((r) => (
                <article key={r.id} className="rounded-lg border bg-card p-4 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold">{r.author_name}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map((n) => (
                          <Star key={n} className={`w-4 h-4 ${n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      {r.verified ? <Badge variant="default">Verificada</Badge> : <Badge variant="secondary">Pendente</Badge>}
                      {r.published ? <Badge variant="outline">Publicada</Badge> : <Badge variant="destructive">Oculta</Badge>}
                      {r.source === "site" && (
                        r.authorized_publication
                          ? <Badge variant="outline">Autorizada pelo cliente</Badge>
                          : <Badge variant="destructive">Sem autorização</Badge>
                      )}
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground mb-2">"{r.comment}"</p>}
                    <div className="text-xs text-muted-foreground flex gap-3 flex-wrap">
                      {r.neighborhood && <span>📍 {r.neighborhood}</span>}
                      {r.city && <span>{r.city}</span>}
                      {r.service_slug && <span>🔧 {r.service_slug}</span>}
                      {r.review_date && <span>📅 {new Date(r.review_date).toLocaleDateString("pt-BR")}</span>}
                      {r.source && <span>· {r.source}</span>}
                      {r.origin_protocol && <span>· OS {r.origin_protocol}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 md:flex-col md:w-40">
                    {!r.verified && (
                      <>
                        <Button size="sm" onClick={() => approve(r)} className="flex-1"><Check className="w-4 h-4 mr-1" />Aprovar</Button>
                        <Button size="sm" variant="secondary" onClick={() => reject(r)} className="flex-1">Rejeitar</Button>
                      </>

                    )}
                    <Button size="sm" variant="outline" onClick={() => togglePublished(r)} className="flex-1">
                      {r.published ? <><EyeOff className="w-4 h-4 mr-1" />Ocultar</> : <><Eye className="w-4 h-4 mr-1" />Publicar</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(r)} className="flex-1">Editar</Button>
                    {(() => {
                      const baseDate = r.service_closed_at ?? r.review_date ?? r.created_at;
                      const win = reviewWindow(baseDate);
                      const ctx = {
                        clientName: r.author_name,
                        service: r.service_slug ?? undefined,
                        neighborhood: r.neighborhood ?? undefined,
                      };
                      const hasPhone = !!r.client_phone && r.client_phone.replace(/\D/g, "").length >= 10;
                      const sendWa = (kind: "t24" | "t72") => {
                        if (!hasPhone) {
                          toast({ title: "Telefone ausente", description: "Edite a review e preencha o WhatsApp do cliente.", variant: "destructive" });
                          return;
                        }
                        const url = kind === "t24" ? t24WaLink(r.client_phone!, ctx) : t72WaLink(r.client_phone!, ctx);
                        window.open(url, "_blank", "noopener,noreferrer");
                      };
                      const tipPhone = hasPhone ? "" : " · telefone não cadastrado";
                      const waParams = {
                        clientName: r.author_name,
                        protocolo: r.origin_protocol ?? undefined,
                        servico: r.service_slug ?? undefined,
                        bairro: r.neighborhood ?? undefined,
                      };
                      const openWa = (url: string) =>
                        window.open(url, "_blank", "noopener,noreferrer");
                      const sendReminder = () => {
                        if (!hasPhone) {
                          toast({ title: "Telefone ausente", description: "Edite a review e preencha o WhatsApp do cliente.", variant: "destructive" });
                          return;
                        }
                        openWa(reviewReminderWaLink(r.client_phone!, waParams));
                      };
                      const sendPublished = () => {
                        if (!hasPhone) {
                          toast({ title: "Telefone ausente", description: "Edite a review e preencha o WhatsApp do cliente.", variant: "destructive" });
                          return;
                        }
                        openWa(reviewPublishedWaLink(r.client_phone!, waParams));
                      };
                      const remindDue = shouldRemind(baseDate, REMINDER_HOURS);
                      const sendOsFollowUp = () => {

                        if (!hasPhone) {
                          toast({ title: "Telefone ausente", description: "Edite a review e preencha o WhatsApp do cliente.", variant: "destructive" });
                          return;
                        }
                        window.open(
                          osFollowUpWaLink(r.client_phone!, {
                            clientName: r.author_name,
                            protocolo: r.origin_protocol ?? undefined,
                            servico: r.service_slug ?? undefined,
                            bairro: r.neighborhood ?? undefined,
                          }),
                          "_blank",
                          "noopener,noreferrer",
                        );
                      };
                      return (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!hasPhone}
                            onClick={sendOsFollowUp}
                            className="flex-1"
                            title={"Enviar link de avaliação no site (pós-OS)" + tipPhone}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />Pós-OS
                          </Button>
                          <Button
                            size="sm"
                            variant={remindDue && !r.comment ? "default" : "outline"}
                            disabled={!hasPhone}
                            onClick={sendReminder}
                            className="flex-1"
                            title={
                              (remindDue
                                ? `Reenviar link de avaliação (passaram ${REMINDER_HOURS}h)`
                                : `Reenvio sugerido após ${REMINDER_HOURS}h`) + tipPhone
                            }
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />Reenviar
                          </Button>
                          {r.verified && r.published && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!hasPhone}
                              onClick={sendPublished}
                              className="flex-1"
                              title={"Avisar o cliente que a avaliação foi publicada" + tipPhone}
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />Avisar publicada
                            </Button>
                          )}



                          <Button
                            size="sm"
                            variant={win === "t24" ? "default" : "outline"}
                            disabled={win === "wait" || !hasPhone}
                            onClick={() => sendWa("t24")}
                            className="flex-1"
                            title={(win === "wait" ? "Aguarde 24h após o atendimento" : "Pedir review T+24h") + tipPhone}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />T+24h
                          </Button>
                          <Button
                            size="sm"
                            variant={win === "t72" ? "default" : "outline"}
                            disabled={win === "wait" || win === "t24" || !hasPhone}
                            onClick={() => sendWa("t72")}
                            className="flex-1"
                            title={(win === "expired" ? "Janela expirada (>7d)" : "Lembrete T+72h") + tipPhone}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />T+72h
                          </Button>
                        </>
                      );
                    })()}
                    <Button size="sm" variant="destructive" onClick={() => remove(r.id)} className="flex-1"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminReviews;
