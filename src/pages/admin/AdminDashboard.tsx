import { SkeletonStats } from "@/components/motion/Skeletons";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "@/lib/router-compat";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { filtrarComerciais } from "@/lib/qaExclusion";
import { aggregateByHour, dedupeClickEvents, detectDropAlerts } from "@/lib/clickInsights";
import { Loader2, RefreshCw, Download, LogOut, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";


type ClickEvent = {
  id: string;
  created_at: string;
  event_type: "wa_click" | "call_click" | "funnel_open" | string;
  servico: string | null;
  bairro: string | null;
  cidade: string | null;
  cta_location: string | null;
  modalidade: string | null;
  equipamento: string | null;
  problema: string | null;
  path: string | null;
  session_id: string | null;
  route_type: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};


const RANGES: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const ALL = "__all__";

const AdminDashboard = () => {
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [allRows, setAllRows] = useState<ClickEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<keyof typeof RANGES | "custom">("30d");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [bairro, setBairro] = useState(ALL);
  const [servico, setServico] = useState(ALL);
  const [routeFilter, setRouteFilter] = useState(ALL);
  const [campaignFilter, setCampaignFilter] = useState(ALL);
  const [pathQuery, setPathQuery] = useState("");
  const [dedupOn, setDedupOn] = useState(true);


  const fetchData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    let query = supabase.from("click_events").select("*");
    if (range === "custom") {
      if (dateFrom) query = query.gte("created_at", new Date(`${dateFrom}T00:00:00`).toISOString());
      if (dateTo) query = query.lte("created_at", new Date(`${dateTo}T23:59:59`).toISOString());
    } else {
      const since = new Date();
      since.setDate(since.getDate() - RANGES[range]);
      query = query.gte("created_at", since.toISOString());
    }
    const { data, error } = await query.order("created_at", { ascending: false }).limit(5000);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
      return;
    }
    // Regime pós-4D.1: exclui sessões de QA/cutover das análises comerciais.
    setAllRows(filtrarComerciais((data || []) as ClickEvent[]));
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, range, dateFrom, dateTo]);

  const bairroOptions = useMemo(
    () => [...new Set(allRows.map((r) => r.bairro).filter(Boolean) as string[])].sort(),
    [allRows],
  );
  const servicoOptions = useMemo(
    () => [...new Set(allRows.map((r) => r.servico).filter(Boolean) as string[])].sort(),
    [allRows],
  );
  const routeOptions = useMemo(
    () => [...new Set(allRows.map((r) => r.route_type).filter(Boolean) as string[])].sort(),
    [allRows],
  );
  const campaignOptions = useMemo(
    () => [...new Set(allRows.map((r) => r.utm_campaign).filter(Boolean) as string[])].sort(),
    [allRows],
  );

  /** Linhas filtradas (todos os tipos de evento) — bairro, serviço, rota, campanha e path. */
  const filteredAll = useMemo(() => {
    const q = pathQuery.trim().toLowerCase();
    return allRows.filter(
      (r) =>
        (bairro === ALL || (r.bairro || "—") === bairro) &&
        (servico === ALL || (r.servico || "—") === servico) &&
        (routeFilter === ALL || (r.route_type || "—") === routeFilter) &&
        (campaignFilter === ALL || (r.utm_campaign || "—") === campaignFilter) &&
        (!q || (r.path || "").toLowerCase().includes(q)),
    );
  }, [allRows, bairro, servico, routeFilter, campaignFilter, pathQuery]);

  /** Deduplicação analítica: cliques idênticos da mesma sessão em até 30s contam uma vez. */
  const dedup = useMemo(() => dedupeClickEvents(filteredAll), [filteredAll]);
  const workingRows = dedupOn ? dedup.unique : filteredAll;

  /** Somente cliques de conversão (wa/ligação) — base das tabelas e das exportações. */
  const rows = useMemo(
    () => workingRows.filter((r) => r.event_type === "wa_click" || r.event_type === "call_click"),
    [workingRows],
  );

  const byHour = useMemo(() => aggregateByHour(rows), [rows]);
  const maxHour = Math.max(1, ...byHour.map((h) => h.total));
  const dropAlerts = useMemo(() => detectDropAlerts(rows), [rows]);


  /**
   * Funil: aberturas (`funnel_open`) × conversões (`wa_click`) por sessão,
   * com mediana do tempo entre a primeira abertura e a primeira conversão.
   */
  const funnelStats = useMemo(() => {
    const opens = filteredAll.filter((r) => r.event_type === "funnel_open");
    const firstOpen = new Map<string, number>();
    for (const r of opens) {
      if (!r.session_id) continue;
      const t = new Date(r.created_at).getTime();
      const cur = firstOpen.get(r.session_id);
      if (cur === undefined || t < cur) firstOpen.set(r.session_id, t);
    }
    const firstConv = new Map<string, number>();
    for (const r of filteredAll) {
      if (r.event_type !== "wa_click" || !r.session_id) continue;
      const t = new Date(r.created_at).getTime();
      const cur = firstConv.get(r.session_id);
      if (cur === undefined || t < cur) firstConv.set(r.session_id, t);
    }
    const deltas: number[] = [];
    let converted = 0;
    for (const [sid, openAt] of firstOpen) {
      const conv = firstConv.get(sid);
      if (conv === undefined || conv < openAt) continue;
      converted++;
      deltas.push((conv - openAt) / 1000);
    }
    deltas.sort((a, b) => a - b);
    const median = deltas.length
      ? deltas.length % 2
        ? deltas[(deltas.length - 1) / 2]
        : (deltas[deltas.length / 2 - 1] + deltas[deltas.length / 2]) / 2
      : null;
    const sessions = firstOpen.size;
    return {
      opens: opens.length,
      sessions,
      converted,
      rate: sessions ? (converted / sessions) * 100 : 0,
      medianSeconds: median,
    };
  }, [filteredAll]);



  // Agregações
  /** Conversões por tipo de rota (home, PF, PJ, serviço, local, institucional). */
  const byRouteType = useMemo(() => {
    const map = new Map<string, { key: string; wa: number; call: number; total: number }>();
    for (const r of rows) {
      const key = r.route_type || "—";
      const cur = map.get(key) || { key, wa: 0, call: 0, total: 0 };
      if (r.event_type === "wa_click") cur.wa++;
      else cur.call++;
      cur.total++;
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [rows]);

  /** Conversões por campanha (utm_source / utm_medium / utm_campaign). */
  const byCampaign = useMemo(() => {
    const map = new Map<
      string,
      { source: string; medium: string; campaign: string; wa: number; call: number; total: number }
    >();
    for (const r of rows) {
      const source = r.utm_source || "—";
      const medium = r.utm_medium || "—";
      const campaign = r.utm_campaign || "—";
      const key = `${source}::${medium}::${campaign}`;
      const cur = map.get(key) || { source, medium, campaign, wa: 0, call: 0, total: 0 };
      if (r.event_type === "wa_click") cur.wa++;
      else cur.call++;
      cur.total++;
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [rows]);

  const byBairroServico = useMemo(() => {
    const map = new Map<string, { bairro: string; servico: string; wa: number; call: number; total: number }>();
    for (const r of rows) {
      const key = `${r.bairro || "—"}::${r.servico || "—"}`;
      const cur = map.get(key) || { bairro: r.bairro || "—", servico: r.servico || "—", wa: 0, call: 0, total: 0 };
      if (r.event_type === "wa_click") cur.wa++;
      else cur.call++;
      cur.total++;
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [rows]);

  const byDay = useMemo(() => {
    const map = new Map<string, { day: string; wa: number; call: number }>();
    for (const r of rows) {
      const day = r.created_at.slice(0, 10);
      const cur = map.get(day) || { day, wa: 0, call: 0 };
      if (r.event_type === "wa_click") cur.wa++;
      else cur.call++;
      map.set(day, cur);
    }
    return [...map.values()].sort((a, b) => a.day.localeCompare(b.day));
  }, [rows]);

  const totals = useMemo(() => {
    const wa = rows.filter(r => r.event_type === "wa_click").length;
    const call = rows.filter(r => r.event_type === "call_click").length;
    return { wa, call, total: rows.length };
  }, [rows]);

  const maxDay = Math.max(1, ...byDay.map(d => d.wa + d.call));

  const exportCsv = () => {
    const cols: (keyof ClickEvent)[] = ["created_at", "event_type", "route_type", "servico", "bairro", "cidade", "cta_location", "modalidade", "equipamento", "problema", "path", "utm_source", "utm_medium", "utm_campaign"];
    const csv = [
      cols.join(","),
      ...rows.map(r => cols.map(c => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(",")),

    ].join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `click-events-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /** Exporta o mesmo recorte em JSON, com metadados do filtro e da deduplicação. */
  const exportJson = () => {
    const payload = {
      generated_at: new Date().toISOString(),
      filters: { range, dateFrom, dateTo, bairro, servico, routeFilter, campaignFilter, pathQuery, dedup: dedupOn },
      totals,
      dedup: { duplicates: dedup.duplicates.length, duplicate_rate_pct: Number(dedup.duplicateRate.toFixed(2)) },
      by_hour: byHour,
      by_day: byDay,
      alerts: dropAlerts,
      events: rows,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `click-events-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };



  const signOut = async () => { await supabase.auth.signOut(); };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Acesso negado</h1>
          <Button variant="outline" onClick={signOut}>Sair</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Dashboard — Admin | Técnico Curitiba</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Dashboard de Conversão</h1>
            <p className="text-xs text-muted-foreground">
              Cliques em WhatsApp e Ligar por bairro e serviço · {totals.total} eventos
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Select value={range} onValueChange={(v) => setRange(v as keyof typeof RANGES | "custom")}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="custom">Período personalizado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
              <Download className="h-4 w-4" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportJson} className="gap-1">
              <Download className="h-4 w-4" /> JSON
            </Button>

            <Link to="/admin/funnel"><Button variant="outline" size="sm">Leads</Button></Link>
            <Button variant="outline" size="sm" onClick={signOut} className="gap-1">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-end mb-6 rounded-lg border border-border p-4">
          {range === "custom" && (
            <>
              <label className="text-xs text-muted-foreground flex flex-col gap-1">
                De
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                />
              </label>
              <label className="text-xs text-muted-foreground flex flex-col gap-1">
                Até
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                />
              </label>
            </>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Bairro</span>
            <Select value={bairro} onValueChange={setBairro}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos os bairros</SelectItem>
                {bairroOptions.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Serviço</span>
            <Select value={servico} onValueChange={setServico}>
              <SelectTrigger className="w-52"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos os serviços</SelectItem>
                {servicoOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Tipo de rota</span>
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas as rotas</SelectItem>
                {routeOptions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Campanha</span>
            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas as campanhas</SelectItem>
                {campaignOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="text-xs text-muted-foreground flex flex-col gap-1">
            Página (path contém)
            <input
              type="search"
              value={pathQuery}
              onChange={(e) => setPathQuery(e.target.value)}
              placeholder="/servicos/"
              className="h-9 w-52 rounded-md border border-input bg-background px-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground h-9">
            <input
              type="checkbox"
              checked={dedupOn}
              onChange={(e) => setDedupOn(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Deduplicar cliques (30s)
          </label>
          {(bairro !== ALL || servico !== ALL || routeFilter !== ALL || campaignFilter !== ALL || pathQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setBairro(ALL);
                setServico(ALL);
                setRouteFilter(ALL);
                setCampaignFilter(ALL);
                setPathQuery("");
              }}
            >
              Limpar filtros
            </Button>
          )}
          <p className="text-xs text-muted-foreground ml-auto">
            {rows.length} de {allRows.length} eventos · {dedup.duplicates.length} duplicatas
            {" "}({dedup.duplicateRate.toFixed(1)}%)
          </p>
        </div>

        {/* Alertas de queda */}
        {dropAlerts.length > 0 && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 mb-6">
            <h2 className="font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Quedas bruscas detectadas
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              Último dia comparado à média diária anterior no mesmo recorte (queda ≥ 50%).
            </p>
            <ul className="space-y-1 text-sm">
              {dropAlerts.slice(0, 8).map((a) => (
                <li key={`${a.scope}-${a.label}`} className="flex flex-wrap gap-2">
                  <span className="font-medium">{a.scope === "servico" ? "Serviço" : "Horário"}: {a.label}</span>
                  <span className="text-muted-foreground">
                    média {a.baseline.toFixed(1)}/dia → {a.current} hoje ({a.dropPct.toFixed(0)}% de queda)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}



        {/* KPIs */}
        {loading && allRows.length === 0 ? (
          <SkeletonStats count={3} className="sm:grid-cols-3 lg:grid-cols-3 mb-6" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Cliques WhatsApp</p>
              <p className="text-3xl font-bold text-accent">{totals.wa}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Cliques Ligar</p>
              <p className="text-3xl font-bold text-primary">{totals.call}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Total no período</p>
              <p className="text-3xl font-bold">{totals.total}</p>
            </div>
          </div>
        )}

        {/* Conversão do funil WhatsApp */}
        <div className="rounded-lg border border-border p-4 mb-6">
          <h2 className="font-semibold mb-1">Conversão do funil WhatsApp</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Sessões que abriram a triagem × sessões que chegaram ao clique de WhatsApp, no
            período e filtros selecionados.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Aberturas do funil</p>
              <p className="text-2xl font-bold">{funnelStats.opens}</p>
              <p className="text-[11px] text-muted-foreground">{funnelStats.sessions} sessões</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sessões convertidas</p>
              <p className="text-2xl font-bold text-accent">{funnelStats.converted}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Taxa de conversão</p>
              <p className="text-2xl font-bold">{funnelStats.rate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tempo mediano até converter</p>
              <p className="text-2xl font-bold">
                {funnelStats.medianSeconds === null
                  ? "—"
                  : funnelStats.medianSeconds < 60
                    ? `${Math.round(funnelStats.medianSeconds)}s`
                    : `${Math.floor(funnelStats.medianSeconds / 60)}m ${Math.round(funnelStats.medianSeconds % 60)}s`}
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary" aria-hidden="true">
            <div className="h-full bg-accent" style={{ width: `${Math.min(100, funnelStats.rate)}%` }} />
          </div>
        </div>



        {/* Timeline */}
        <div className="rounded-lg border border-border p-4 mb-6">
          <h2 className="font-semibold mb-3">Evolução por dia</h2>
          {byDay.length === 0 && <p className="text-sm text-muted-foreground">Sem eventos no período.</p>}
          <div className="space-y-1">
            {byDay.map(d => {
              const totalDay = d.wa + d.call;
              const waPct = (d.wa / maxDay) * 100;
              const callPct = (d.call / maxDay) * 100;
              return (
                <div key={d.day} className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-muted-foreground">{d.day}</span>
                  <div className="flex-1 flex h-4 rounded overflow-hidden bg-muted">
                    <div className="bg-accent" style={{ width: `${waPct}%` }} title={`WhatsApp: ${d.wa}`} />
                    <div className="bg-primary" style={{ width: `${callPct}%` }} title={`Ligar: ${d.call}`} />
                  </div>
                  <span className="w-12 text-right tabular-nums">{totalDay}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribuição por hora */}
        <div className="rounded-lg border border-border p-4 mb-6">
          <h2 className="font-semibold mb-1">Conversões por hora do dia</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Horário local do visitante agregado no período e filtros selecionados.
          </p>
          <div className="flex items-end gap-1 h-32">
            {byHour.map((h) => (
              <div key={h.hour} className="flex-1 flex flex-col justify-end items-center gap-1">
                <div
                  className="w-full rounded-t bg-accent"
                  style={{ height: `${(h.total / maxHour) * 100}%` }}
                  title={`${String(h.hour).padStart(2, "0")}h — WhatsApp: ${h.wa} · Ligar: ${h.call}`}
                />
                <span className="text-[9px] text-muted-foreground tabular-nums">{h.hour}</span>
              </div>
            ))}
          </div>
        </div>



        {/* Conversões por tipo de rota */}
        <div className="rounded-lg border border-border overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Conversões por tipo de rota</h2>
            <p className="text-xs text-muted-foreground">
              Home, PF, PJ, serviço, local e institucional — segmentação usada no GA4.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">Tipo de rota</th>
                  <th className="px-3 py-2 text-right">WhatsApp</th>
                  <th className="px-3 py-2 text-right">Ligar</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {byRouteType.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">Nenhum evento no período.</td></tr>
                )}
                {byRouteType.map((r) => (
                  <tr key={r.key} className="border-t border-border">
                    <td className="px-3 py-2">{r.key}</td>
                    <td className="px-3 py-2 text-right text-accent font-medium">{r.wa}</td>
                    <td className="px-3 py-2 text-right text-primary font-medium">{r.call}</td>
                    <td className="px-3 py-2 text-right font-bold">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversões por campanha */}
        <div className="rounded-lg border border-border overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Conversões por campanha (UTM)</h2>
            <p className="text-xs text-muted-foreground">
              Origem, mídia e campanha capturadas no primeiro hit da sessão.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">Origem</th>
                  <th className="px-3 py-2 text-left">Mídia</th>
                  <th className="px-3 py-2 text-left">Campanha</th>
                  <th className="px-3 py-2 text-right">WhatsApp</th>
                  <th className="px-3 py-2 text-right">Ligar</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {byCampaign.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-6 text-muted-foreground">Nenhum evento no período.</td></tr>
                )}
                {byCampaign.map((r) => (
                  <tr key={`${r.source}-${r.medium}-${r.campaign}`} className="border-t border-border">
                    <td className="px-3 py-2">{r.source}</td>
                    <td className="px-3 py-2">{r.medium}</td>
                    <td className="px-3 py-2">{r.campaign}</td>
                    <td className="px-3 py-2 text-right text-accent font-medium">{r.wa}</td>
                    <td className="px-3 py-2 text-right text-primary font-medium">{r.call}</td>
                    <td className="px-3 py-2 text-right font-bold">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agregado bairro × serviço */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Cliques por bairro × serviço</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">Bairro</th>
                  <th className="px-3 py-2 text-left">Serviço</th>
                  <th className="px-3 py-2 text-right">WhatsApp</th>
                  <th className="px-3 py-2 text-right">Ligar</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {byBairroServico.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">Nenhum evento agregado.</td></tr>
                )}
                {byBairroServico.map(r => (
                  <tr key={`${r.bairro}-${r.servico}`} className="border-t border-border">
                    <td className="px-3 py-2">{r.bairro}</td>
                    <td className="px-3 py-2">{r.servico}</td>
                    <td className="px-3 py-2 text-right text-accent font-medium">{r.wa}</td>
                    <td className="px-3 py-2 text-right text-primary font-medium">{r.call}</td>
                    <td className="px-3 py-2 text-right font-bold">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
