import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "@/lib/router-compat";
import { Helmet } from "react-helmet";
import { Loader2, ShieldCheck, Upload, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  PROVAS_MONITOR,
  avaliarProvasMonitor,
  novoDossieMonitor,
  lerDossies,
  gravarDossie,
  removerDossie,
  type DossieMonitor,
  type ProvaMonitorId,
} from "@/lib/provasMonitor";

/**
 * Painel interno — validação das provas visuais do conserto de monitor.
 *
 * Política fail-closed: o status do lead/OS só pode ser liberado quando as
 * quatro provas obrigatórias (entrada, placa lógica, teste final e embalagem)
 * estiverem anexadas e validadas por um administrador. Os arquivos vão para o
 * bucket privado `os-midias`; o dossiê fica no navegador do operador.
 */
const BUCKET = "os-midias";

const AdminProvasMonitor = () => {
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [dossies, setDossies] = useState<DossieMonitor[]>([]);
  const [protocolo, setProtocolo] = useState("");
  const [enviando, setEnviando] = useState<string | null>(null);

  useEffect(() => {
    setDossies(lerDossies());
  }, []);

  const salvar = useCallback((d: DossieMonitor) => {
    gravarDossie(d);
    setDossies(lerDossies());
  }, []);

  const criar = () => {
    const p = protocolo.trim().toUpperCase();
    if (p.length < 4) {
      toast({ title: "Protocolo inválido", description: "Informe o protocolo da OS.", variant: "destructive" });
      return;
    }
    if (dossies.some((d) => d.protocolo === p)) {
      toast({ title: "Já existe", description: `O dossiê ${p} já está aberto.` });
      return;
    }
    salvar(novoDossieMonitor(p));
    setProtocolo("");
  };

  const anexar = async (d: DossieMonitor, prova: ProvaMonitorId, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Arquivo inválido", description: "Envie uma foto (JPG ou PNG).", variant: "destructive" });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "Arquivo grande demais", description: "Limite de 8 MB por foto.", variant: "destructive" });
      return;
    }
    setEnviando(`${d.protocolo}:${prova}`);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `monitor/${d.protocolo}/${prova}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    setEnviando(null);
    if (error) {
      toast({ title: "Falha no upload", description: error.message, variant: "destructive" });
      return;
    }
    salvar({
      ...d,
      provas: { ...d.provas, [prova]: { path, validada: false, anexadaEm: new Date().toISOString() } },
      liberado: false,
    });
    toast({ title: "Prova anexada", description: "Falta validar antes de liberar o status." });
  };

  const alternarValidacao = (d: DossieMonitor, prova: ProvaMonitorId) => {
    const atual = d.provas[prova];
    if (!atual) return;
    salvar({
      ...d,
      provas: { ...d.provas, [prova]: { ...atual, validada: !atual.validada } },
      liberado: atual.validada ? false : d.liberado,
    });
  };

  const remover = (d: DossieMonitor, prova: ProvaMonitorId) => {
    const restante = { ...d.provas };
    delete restante[prova];
    salvar({ ...d, provas: restante, liberado: false });
  };

  const liberar = (d: DossieMonitor) => {
    const check = avaliarProvasMonitor(d);
    if (!check.ok) {
      toast({ title: "Liberação bloqueada", description: check.pendencias.join(" · "), variant: "destructive" });
      return;
    }
    salvar({ ...d, liberado: true, liberadoEm: new Date().toISOString() });
    toast({ title: "Status liberado", description: `Dossiê ${d.protocolo} completo.` });
  };

  const resumo = useMemo(() => {
    const total = dossies.length;
    const liberados = dossies.filter((d) => d.liberado).length;
    return { total, liberados, bloqueados: total - liberados };
  }, [dossies]);

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
        <title>Provas visuais de monitor | Painel interno</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
          Provas visuais — conserto de monitor
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Fail-closed: nenhum status de lead ou OS de monitor é liberado sem as quatro provas
          anexadas e validadas — entrada, placa lógica, teste final e embalagem.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">{resumo.total} dossiês</Badge>
          <Badge variant="secondary">{resumo.liberados} liberados</Badge>
          <Badge variant="destructive">{resumo.bloqueados} bloqueados</Badge>
        </div>
      </header>

      <Card className="mb-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <Input
          value={protocolo}
          onChange={(e) => setProtocolo(e.target.value)}
          placeholder="Protocolo da OS (ex.: OS-2026-0142)"
          className="sm:max-w-xs"
        />
        <Button onClick={criar}>Abrir dossiê</Button>
      </Card>

      <div className="space-y-6">
        {dossies.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum dossiê aberto ainda.</p>
        )}
        {dossies.map((d) => {
          const check = avaliarProvasMonitor(d);
          return (
            <Card key={d.protocolo} className="p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">{d.protocolo}</h2>
                  <p className="text-xs text-muted-foreground">
                    {check.validadas} de {PROVAS_MONITOR.length} provas validadas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {d.liberado ? (
                    <Badge className="gap-1">
                      <ShieldCheck className="h-3 w-3" aria-hidden /> Status liberado
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Bloqueado</Badge>
                  )}
                  <Button size="sm" onClick={() => liberar(d)} disabled={!check.ok || d.liberado}>
                    Liberar status
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Remover dossiê ${d.protocolo}`}
                    onClick={() => {
                      removerDossie(d.protocolo);
                      setDossies(lerDossies());
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {PROVAS_MONITOR.map((p) => {
                  const anexo = d.provas[p.id];
                  const carregando = enviando === `${d.protocolo}:${p.id}`;
                  return (
                    <div key={p.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-bold text-foreground">{p.titulo}</span>
                        {anexo?.validada ? (
                          <Check className="h-4 w-4 text-primary" aria-label="validada" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" aria-label="pendente" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{p.exigencia}</p>

                      {anexo ? (
                        <div className="mt-3 space-y-2">
                          <p className="break-all text-[11px] text-muted-foreground">{anexo.path}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => alternarValidacao(d, p.id)}>
                              {anexo.validada ? "Invalidar" : "Validar"}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => remover(d, p.id)}>
                              Remover
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary">
                          {carregando ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          ) : (
                            <Upload className="h-4 w-4" aria-hidden />
                          )}
                          Anexar foto
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void anexar(d, p.id, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor={`nota-${d.protocolo}`}>
                  Observações da validação
                </label>
                <Textarea
                  id={`nota-${d.protocolo}`}
                  value={d.notas}
                  onChange={(e) => salvar({ ...d, notas: e.target.value })}
                  rows={2}
                  className="mt-1"
                  placeholder="Ex.: painel sem avaria no recebimento; teste final de 2h em duas entradas."
                />
              </div>

              {!check.ok && (
                <p className="mt-3 text-xs text-destructive">Pendências: {check.pendencias.join(" · ")}</p>
              )}
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default AdminProvasMonitor;
