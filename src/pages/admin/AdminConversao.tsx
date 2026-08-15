import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "@/lib/router-compat";
import { Helmet } from "react-helmet";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { filtrarComerciais } from "@/lib/qaExclusion";

/**
 * Painel de conversão por CTA (Rodada 4B).
 *
 * Lê `click_events` e cruza os recortes que faltavam: rota (foco em
 * /servicos/conserto-tv e /servicos/conserto-placa), posição do CTA,
 * faixa de viewport, origem/UTM e variação de copy do experimento.
 * Mostra também o funil por etapa (clique no CTA → triagem →
 * autorização → execução) para localizar onde o lead desiste.
 */

type Evento = {
  created_at: string;
  event_type: string;
  path: string | null;
  cta_location: string | null;
  cta_position: string | null;
  viewport_bucket: string | null;
  funnel_stage: string | null;
  variant: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  attribution_channel: string | null;
  session_id: string | null;
};

const ROTAS_FOCO = [
  { value: "all", label: "Todas as rotas" },
  { value: "/servicos/conserto-tv", label: "Conserto de TV" },
  { value: "/servicos/conserto-placa", label: "Conserto de placa" },
  { value: "/servicos/conserto-monitor", label: "Conserto de monitor" },
];

const ETAPAS: { id: string; label: string }[] = [
  { id: "cta_click", label: "1. Clique no CTA" },
  { id: "triagem", label: "2. Triagem" },
  { id: "autorizacao", label: "3. Autorização" },
  { id: "execucao", label: "4. Execução" },
];

const hojeMenos = (dias: number) => {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
};

const pct = (parte: number, total: number) => (total ? Math.round((parte / total) * 100) : 0);

const AdminConversao = () => {
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [rows, setRows] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);
  const [inicio, setInicio] = useState(hojeMenos(29));
  const [fim, setFim] = useState(hojeMenos(0));
  const [rota, setRota] = useState("all");
  const [viewport, setViewport] = useState("all");
  const [origem, setOrigem] = useState("all");

  const carregar = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    let q = supabase
      .from("click_events")
      .select(
        "created_at,event_type,path,cta_location,cta_position,viewport_bucket,funnel_stage,variant,utm_source,utm_campaign,attribution_channel,session_id",
      )
      .gte("created_at", `${inicio}T00:00:00Z`)
      .lte("created_at", `${fim}T23:59:59Z`)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (rota !== "all") q = q.eq("path", rota);
    if (viewport !== "all") q = q.eq("viewport_bucket", viewport);
    if (origem !== "all") q = q.eq("attribution_channel", origem);
    const { data } = await q;
    // Regime pós-4D.1: sessões de QA/cutover ficam fora das taxas comerciais.
    setRows(filtrarComerciais((data as Evento[]) ?? []));
    setLoading(false);
  }, [isAdmin, inicio, fim, rota, viewport, origem]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const agregados = useMemo(() => {
    const porCta = new Map<string, { wa: number; call: number; abertura: number }>();
    const porViewport = new Map<string, { wa: number; call: number; total: number }>();
    const porOrigem = new Map<string, { wa: number; call: number; total: number }>();
    const porVariante = new Map<string, { view: number; wa: number }>();
    const etapaSessions = new Map<string, Set<string>>();

    for (const r of rows) {
      const cta = r.cta_position || r.cta_location || "sem-posicao";
      const vp = r.viewport_bucket || "desconhecido";
      const org = r.attribution_channel || r.utm_source || "direto";
      const variante = r.variant || "controle";
      const sid = r.session_id || `${r.created_at}`;

      const c = porCta.get(cta) ?? { wa: 0, call: 0, abertura: 0 };
      if (r.event_type === "wa_click") c.wa += 1;
      else if (r.event_type === "call_click") c.call += 1;
      else c.abertura += 1;
      porCta.set(cta, c);

      const v = porViewport.get(vp) ?? { wa: 0, call: 0, total: 0 };
      v.total += 1;
      if (r.event_type === "wa_click") v.wa += 1;
      if (r.event_type === "call_click") v.call += 1;
      porViewport.set(vp, v);

      const o = porOrigem.get(org) ?? { wa: 0, call: 0, total: 0 };
      o.total += 1;
      if (r.event_type === "wa_click") o.wa += 1;
      if (r.event_type === "call_click") o.call += 1;
      porOrigem.set(org, o);

      const x = porVariante.get(variante) ?? { view: 0, wa: 0 };
      x.view += 1;
      if (r.event_type === "wa_click") x.wa += 1;
      porVariante.set(variante, x);

      const etapa = r.funnel_stage || "cta_click";
      if (!etapaSessions.has(etapa)) etapaSessions.set(etapa, new Set());
      etapaSessions.get(etapa)!.add(sid);
    }

    const funil = ETAPAS.map((e) => ({ ...e, sessoes: etapaSessions.get(e.id)?.size ?? 0 }));
    const base = funil[0].sessoes;

    return {
      porCta: [...porCta.entries()].sort((a, b) => b[1].wa + b[1].call - (a[1].wa + a[1].call)),
      porViewport: [...porViewport.entries()].sort((a, b) => b[1].total - a[1].total),
      porOrigem: [...porOrigem.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 10),
      porVariante: [...porVariante.entries()].sort((a, b) => a[0].localeCompare(b[0])),
      funil: funil.map((f) => ({ ...f, taxa: pct(f.sessoes, base) })),
      totalWa: rows.filter((r) => r.event_type === "wa_click").length,
      totalCall: rows.filter((r) => r.event_type === "call_click").length,
      totalEventos: rows.length,
    };
  }, [rows]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center text-muted-foreground">
        Acesso restrito a administradores.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <Helmet>
        <title>Conversão por CTA | Painel interno</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
          Conversão por CTA e etapas do funil
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Recortes por rota, posição do CTA, faixa de viewport, origem/UTM e variação de copy.
        </p>
      </header>

      <Card className="mb-6 grid gap-3 p-4 md:grid-cols-6">
        <Input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} aria-label="Data inicial" />
        <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} aria-label="Data final" />
        <Select value={rota} onValueChange={setRota}>
          <SelectTrigger aria-label="Rota"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ROTAS_FOCO.map((r) => (
              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={viewport} onValueChange={setViewport}>
          <SelectTrigger aria-label="Viewport"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os viewports</SelectItem>
            <SelectItem value="360">360 px</SelectItem>
            <SelectItem value="390">390 px</SelectItem>
            <SelectItem value="430">430 px</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
          </SelectContent>
        </Select>
        <Select value={origem} onValueChange={setOrigem}>
          <SelectTrigger aria-label="Origem"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as origens</SelectItem>
            <SelectItem value="organic">Orgânico</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="direct">Direto</SelectItem>
            <SelectItem value="referral">Referência</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => void carregar()} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
          Atualizar
        </Button>
      </Card>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Cliques em WhatsApp</p>
          <p className="font-heading text-2xl font-bold text-foreground">{agregados.totalWa}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Cliques em ligação</p>
          <p className="font-heading text-2xl font-bold text-foreground">{agregados.totalCall}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Eventos no período</p>
          <p className="font-heading text-2xl font-bold text-foreground">{agregados.totalEventos}</p>
        </Card>
      </div>

      <Card className="mb-6 p-4">
        <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Funil por etapa</h2>
        <ul className="space-y-2">
          {agregados.funil.map((f) => (
            <li key={f.id} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">{f.label}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-[hsl(var(--accent))]" style={{ width: `${f.taxa}%` }} />
              </div>
              <span className="w-24 text-right text-sm font-semibold text-foreground">
                {f.sessoes} · {f.taxa}%
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Autorização e execução são lançadas pela operação; etapas zeradas indicam desistência antes do registro.
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Conversão por posição de CTA</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr><th className="py-1">Posição</th><th>WhatsApp</th><th>Ligação</th></tr>
            </thead>
            <tbody>
              {agregados.porCta.map(([cta, v]) => (
                <tr key={cta} className="border-t border-border">
                  <td className="py-1.5 pr-2 text-foreground">{cta}</td>
                  <td>{v.wa}</td>
                  <td>{v.call}</td>
                </tr>
              ))}
              {agregados.porCta.length === 0 && (
                <tr><td colSpan={3} className="py-3 text-muted-foreground">Sem eventos no período.</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Por faixa de viewport</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr><th className="py-1">Viewport</th><th>WhatsApp</th><th>Ligação</th><th>Eventos</th></tr>
            </thead>
            <tbody>
              {agregados.porViewport.map(([vp, v]) => (
                <tr key={vp} className="border-t border-border">
                  <td className="py-1.5 pr-2 text-foreground">{vp}</td>
                  <td>{v.wa}</td>
                  <td>{v.call}</td>
                  <td>{v.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Por origem / UTM</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr><th className="py-1">Origem</th><th>WhatsApp</th><th>Ligação</th><th>Eventos</th></tr>
            </thead>
            <tbody>
              {agregados.porOrigem.map(([o, v]) => (
                <tr key={o} className="border-t border-border">
                  <td className="py-1.5 pr-2 text-foreground">{o}</td>
                  <td>{v.wa}</td>
                  <td>{v.call}</td>
                  <td>{v.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Experimento de clareza</h2>
          <ul className="space-y-2 text-sm">
            {agregados.porVariante.map(([v, dados]) => (
              <li key={v} className="flex items-center justify-between border-t border-border py-1.5 first:border-0">
                <Badge variant="secondary">{v}</Badge>
                <span className="text-muted-foreground">
                  {dados.wa} WhatsApp em {dados.view} eventos · {pct(dados.wa, dados.view)}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </main>
  );
};

export default AdminConversao;
