import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "@/lib/router-compat";
import { Helmet } from "react-helmet";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, RefreshCw, Download, ShieldCheck } from "lucide-react";

/**
 * Auditoria das consultas públicas de OS.
 * Mostra volume, taxa de erro, latência (SLA) e uso por rota, além dos códigos
 * de confirmação pendentes que o técnico precisa enviar no WhatsApp.
 */

type Attempt = {
  id: string;
  created_at: string;
  found: boolean;
  path: string | null;
  outcome: string | null;
  latency_ms: number | null;
};

type PendingCode = {
  id: string;
  created_at: string;
  expires_at: string;
  attempts: number;
  code_plain: string | null;
  telefone_masked: string | null;
};

const JANELAS = [
  { value: "24", label: "Últimas 24 horas" },
  { value: "168", label: "Últimos 7 dias" },
  { value: "720", label: "Últimos 30 dias" },
];

const OK_OUTCOMES = new Set(["ok_verificado", "ok_restrito"]);

const p95 = (values: number[]) => {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(s.length * 0.95))];
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export default function AdminOsAudit() {
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [janela, setJanela] = useState("168");
  const [carregando, setCarregando] = useState(true);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [codigos, setCodigos] = useState<PendingCode[]>([]);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const desde = new Date(Date.now() - Number(janela) * 3_600_000).toISOString();
    const [{ data: att }, { data: cods }] = await Promise.all([
      supabase
        .from("os_lookup_attempts")
        .select("id, created_at, found, path, outcome, latency_ms")
        .gte("created_at", desde)
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("os_verification_codes")
        .select("id, created_at, expires_at, attempts, code_plain, telefone_masked")
        .is("consumed_at", null)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    setAttempts((att ?? []) as Attempt[]);
    setCodigos((cods ?? []) as PendingCode[]);
    setCarregando(false);
  }, [janela]);

  useEffect(() => {
    if (isAdmin) void carregar();
  }, [isAdmin, carregar]);

  const kpis = useMemo(() => {
    const total = attempts.length;
    const erros = attempts.filter((a) => a.outcome && !OK_OUTCOMES.has(a.outcome)).length;
    const bloqueadas = attempts.filter((a) => a.outcome === "rate_limited").length;
    const encontrou = attempts.filter((a) => a.found).length;
    const lat = attempts.map((a) => a.latency_ms ?? 0).filter((v) => v > 0);
    return {
      total,
      erros,
      bloqueadas,
      taxaErro: total ? (erros / total) * 100 : 0,
      taxaSucessoBusca: total ? (encontrou / total) * 100 : 0,
      latenciaP95: p95(lat),
      latenciaMedia: lat.length ? Math.round(lat.reduce((s, v) => s + v, 0) / lat.length) : 0,
      foraSla: lat.filter((v) => v > 2000).length,
    };
  }, [attempts]);

  const serie = useMemo(() => {
    const buckets = new Map<string, { hora: string; consultas: number; erros: number }>();
    for (const a of attempts) {
      const d = new Date(a.created_at);
      const chave =
        Number(janela) <= 24
          ? `${d.getHours().toString().padStart(2, "0")}h`
          : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      const atual = buckets.get(chave) ?? { hora: chave, consultas: 0, erros: 0 };
      atual.consultas += 1;
      if (a.outcome && !OK_OUTCOMES.has(a.outcome)) atual.erros += 1;
      buckets.set(chave, atual);
    }
    return Array.from(buckets.values()).reverse();
  }, [attempts, janela]);

  const porRota = useMemo(() => {
    const map = new Map<string, { rota: string; consultas: number; erros: number; latencias: number[] }>();
    for (const a of attempts) {
      const rota = a.path || "(não informada)";
      const atual = map.get(rota) ?? { rota, consultas: 0, erros: 0, latencias: [] };
      atual.consultas += 1;
      if (a.outcome && !OK_OUTCOMES.has(a.outcome)) atual.erros += 1;
      if (a.latency_ms) atual.latencias.push(a.latency_ms);
      map.set(rota, atual);
    }
    return Array.from(map.values()).sort((a, b) => b.consultas - a.consultas);
  }, [attempts]);

  const exportarCsv = () => {
    const linhas = [
      "data,rota,desfecho,encontrou,latencia_ms",
      ...attempts.map((a) =>
        [a.created_at, a.path ?? "", a.outcome ?? "", a.found ? "sim" : "nao", a.latency_ms ?? ""].join(","),
      ),
    ];
    const blob = new Blob([linhas.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `auditoria-consultas-os-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <>
      <Helmet>
        <title>Auditoria de consultas de OS | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Auditoria das consultas públicas de OS</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Volume, erros, latência e uso por rota da consulta pública, sem expor dados pessoais.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={janela} onValueChange={setJanela}>
              <SelectTrigger className="w-[190px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JANELAS.map((j) => (
                  <SelectItem key={j.value} value={j.value}>{j.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => void carregar()} aria-label="Recarregar">
              <RefreshCw className={`h-4 w-4 ${carregando ? "animate-spin" : ""}`} aria-hidden />
            </Button>
            <Button variant="outline" onClick={exportarCsv} disabled={!attempts.length}>
              <Download className="h-4 w-4" aria-hidden /> CSV
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Consultas", valor: kpis.total.toString() },
            { label: "Taxa de erro", valor: `${kpis.taxaErro.toFixed(1)}%` },
            { label: "Latência p95", valor: `${kpis.latenciaP95} ms` },
            { label: "Fora do SLA (>2s)", valor: kpis.foraSla.toString() },
          ].map((k) => (
            <Card key={k.label} className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{k.valor}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-4">
          <h2 className="text-sm font-semibold text-foreground">Consultas e erros ao longo do tempo</h2>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serie}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="hora" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="consultas" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                <Area type="monotone" dataKey="erros" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="mt-6 p-4">
          <h2 className="text-sm font-semibold text-foreground">Uso por rota</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2">Rota</th>
                  <th className="py-2">Consultas</th>
                  <th className="py-2">Erros</th>
                  <th className="py-2">Latência p95</th>
                </tr>
              </thead>
              <tbody>
                {porRota.map((r) => (
                  <tr key={r.rota} className="border-t border-border">
                    <td className="py-2 font-mono text-xs">{r.rota}</td>
                    <td className="py-2">{r.consultas}</td>
                    <td className="py-2">{r.erros}</td>
                    <td className="py-2">{p95(r.latencias)} ms</td>
                  </tr>
                ))}
                {!porRota.length ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-muted-foreground">
                      Nenhuma consulta registrada nesta janela.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="mt-6 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
            Códigos de confirmação pendentes
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Envie o código pelo WhatsApp para o número correspondente. Ele expira sozinho e é apagado
            assim que o cliente confirma.
          </p>
          <div className="mt-3 space-y-2">
            {codigos.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
                <div>
                  <p className="font-mono text-lg font-bold tracking-widest text-foreground">
                    {c.code_plain ?? "••••••"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.telefone_masked ?? "—"} · pedido em {fmt(c.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">expira {fmt(c.expires_at)}</Badge>
                  {c.attempts > 0 ? <Badge variant="destructive">{c.attempts} tentativa(s)</Badge> : null}
                </div>
              </div>
            ))}
            {!codigos.length ? (
              <p className="text-sm text-muted-foreground">Nenhum código pendente.</p>
            ) : null}
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
}
