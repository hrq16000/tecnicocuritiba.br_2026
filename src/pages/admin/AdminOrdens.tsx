import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { OS_STATUS, OS_STATUS_LABEL, formatarBRL, type OsStatus } from "@/lib/os/statusOs";
import { alterarStatusEmLote, listarOrdens, type OsAdminRow } from "@/lib/os/osAdmin.functions";
import { AlertCircle, Inbox, RefreshCw, Search } from "lucide-react";

const POR_PAGINA = 20;

const tomStatus = (s: string) =>
  s === "CANCELADA"
    ? "bg-destructive/10 text-destructive"
    : s === "ENTREGUE" || s === "CONCLUIDA"
      ? "bg-primary/10 text-primary"
      : "bg-muted text-muted-foreground";

/** Painel administrativo de ordens de serviço (privado, fora do índice). */
const AdminOrdens = () => {
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [itens, setItens] = useState<OsAdminRow[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("todos");
  const [tecnico, setTecnico] = useState("");
  const [desde, setDesde] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [statusLote, setStatusLote] = useState("");
  const [aplicandoLote, setAplicandoLote] = useState(false);
  const [resultadoLote, setResultadoLote] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const r = await listarOrdens({
        data: {
          busca,
          status: status === "todos" ? "" : status,
          tecnico,
          desde: desde ? new Date(desde).toISOString() : "",
          pagina,
          porPagina: POR_PAGINA,
        },
      });
      setItens(r.itens);
      setTotal(r.total);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao carregar ordens.");
    } finally {
      setCarregando(false);
    }
  }, [busca, status, tecnico, desde, pagina]);

  useEffect(() => {
    if (isAdmin) void carregar();
  }, [isAdmin, carregar]);

  const alternarSelecao = useCallback((protocolo: string) => {
    setSelecionados((atual) =>
      atual.includes(protocolo)
        ? atual.filter((p) => p !== protocolo)
        : [...atual, protocolo],
    );
  }, []);

  const aplicarLote = useCallback(async () => {
    if (!statusLote || selecionados.length === 0) return;
    setAplicandoLote(true);
    setResultadoLote(null);
    try {
      const r = await alterarStatusEmLote({
        data: { protocolos: selecionados, status: statusLote as OsStatus, nota: "" },
      });
      const falhas = r.falhas
        .map((f) => `${f.protocolo}: ${f.motivo}`)
        .join(" · ");
      setResultadoLote(
        `${r.aplicados.length} atualizada(s).` +
          (r.falhas.length ? ` ${r.falhas.length} recusada(s) — ${falhas}` : ""),
      );
      setSelecionados([]);
      await carregar();
    } catch (e) {
      setResultadoLote(e instanceof Error ? e.message : "Falha ao aplicar em lote.");
    } finally {
      setAplicandoLote(false);
    }
  }, [statusLote, selecionados, carregar]);

  const paginas = useMemo(() => Math.max(1, Math.ceil(total / POR_PAGINA)), [total]);

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
        <title>Ordens de serviço — painel interno</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Ordens de serviço</h1>
            <p className="text-sm text-muted-foreground">
              {total} ordem(ns) registrada(s) · uso interno
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void carregar()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
            </Button>
            <Button size="sm" asChild>
              <Link to="/admin/ordens/nova">Nova O.S.</Link>
            </Button>
          </div>
        </div>

        <Card className="mb-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Protocolo, cliente, telefone…"
              value={busca}
              onChange={(e) => {
                setPagina(1);
                setBusca(e.target.value);
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setPagina(1);
              setStatus(v);
            }}
          >
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {OS_STATUS.map((s) => (
                <SelectItem key={s} value={s}>{OS_STATUS_LABEL[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Técnico responsável"
            value={tecnico}
            onChange={(e) => {
              setPagina(1);
              setTecnico(e.target.value);
            }}
          />
          <Input
            type="date"
            aria-label="A partir de"
            value={desde}
            onChange={(e) => {
              setPagina(1);
              setDesde(e.target.value);
            }}
          />
        </Card>

        {erro && (
          <Card className="mb-6 flex items-center gap-3 border-destructive/40 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> {erro}
          </Card>
        )}

        {carregando ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : itens.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 p-12 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-foreground">Nenhuma ordem encontrada</p>
            <p className="text-sm text-muted-foreground">
              Ajuste os filtros ou abra uma nova ordem de serviço.
            </p>
          </Card>
        ) : (
          <>
            {selecionados.length > 0 && (
              <Card className="mb-4 flex flex-wrap items-center gap-3 border-primary/40 p-4">
                <span className="text-sm font-medium text-foreground">
                  {selecionados.length} ordem(ns) selecionada(s)
                </span>
                <Select value={statusLote} onValueChange={setStatusLote}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Novo status" />
                  </SelectTrigger>
                  <SelectContent>
                    {OS_STATUS.map((s) => (
                      <SelectItem key={s} value={s}>{OS_STATUS_LABEL[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  disabled={!statusLote || aplicandoLote}
                  onClick={() => void aplicarLote()}
                >
                  {aplicandoLote ? "Aplicando…" : "Aplicar status"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelecionados([])}>
                  Limpar seleção
                </Button>
                {resultadoLote && (
                  <p className="w-full text-xs text-muted-foreground">{resultadoLote}</p>
                )}
              </Card>
            )}

            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                id="selecionar-todos"
                className="h-4 w-4 accent-primary"
                checked={selecionados.length === itens.length && itens.length > 0}
                onChange={(e) =>
                  setSelecionados(e.target.checked ? itens.map((o) => o.protocolo) : [])
                }
              />
              <label htmlFor="selecionar-todos">Selecionar todas desta página</label>
            </div>

            <ul className="space-y-3">
              {itens.map((os) => (
                <li key={os.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    aria-label={`Selecionar ordem ${os.protocolo}`}
                    className="mt-5 h-4 w-4 shrink-0 accent-primary"
                    checked={selecionados.includes(os.protocolo)}
                    onChange={() => alternarSelecao(os.protocolo)}
                  />
                  <Link
                    to={`/admin/ordens/${os.protocolo}`}
                    className="block flex-1 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {os.protocolo}
                      </span>
                      <Badge className={tomStatus(os.status)} variant="secondary">
                        {OS_STATUS_LABEL[os.status as OsStatus] ?? os.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-foreground">
                      {os.clienteNome || "Cliente não informado"}
                      {os.equipamento ? ` · ${os.equipamento}` : ""}
                      {os.marcaModelo ? ` ${os.marcaModelo}` : ""}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                      <span>Aberta em {new Date(os.abertaEm).toLocaleDateString("pt-BR")}</span>
                      {os.tecnicoResponsavel && <span>Técnico: {os.tecnicoResponsavel}</span>}
                      <span>Total: {formatarBRL(os.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {paginas > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {pagina} de {paginas}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagina >= paginas}
              onClick={() => setPagina((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminOrdens;
