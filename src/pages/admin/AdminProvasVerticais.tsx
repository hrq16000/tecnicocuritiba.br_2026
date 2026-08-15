import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "@/lib/router-compat";
import { Helmet } from "react-helmet";
import { Loader2, ShieldCheck, Upload, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  CHECKLIST_PROVAS,
  VERTICAIS,
  avaliarDossie,
  gravarDossieVertical,
  lerDossiesVerticais,
  novoDossieVertical,
  type DossieVertical,
  type ProvaId,
  type VerticalProva,
} from "@/lib/provasVerticais";

/**
 * Painel interno — validação fail-closed das galerias de TV e placas.
 *
 * A galeria pública de uma vertical só é liberada quando as cinco provas
 * (bancada, entrada, placa, teste final e embalagem) estiverem anexadas,
 * comprovadamente de bancada própria, com protocolo, alt factual,
 * autorização do cliente e validação manual do administrador.
 */
const BUCKET = "os-midias";

const AdminProvasVerticais = () => {
  const { loading: authLoading, session, isAdmin } = useAdminAuth();
  const [dossies, setDossies] = useState<DossieVertical[]>([]);
  const [enviando, setEnviando] = useState<string | null>(null);

  useEffect(() => {
    setDossies(lerDossiesVerticais());
  }, []);

  const salvar = useCallback((d: DossieVertical) => {
    gravarDossieVertical(d);
    setDossies(lerDossiesVerticais());
  }, []);

  const dossieDe = useCallback(
    (v: VerticalProva) => dossies.find((d) => d.vertical === v) ?? novoDossieVertical(v),
    [dossies],
  );

  const anexar = async (d: DossieVertical, prova: ProvaId, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Arquivo inválido", description: "Envie uma foto JPG ou PNG.", variant: "destructive" });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "Arquivo grande demais", description: "Limite de 8 MB por foto.", variant: "destructive" });
      return;
    }
    setEnviando(`${d.vertical}:${prova}`);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `galeria/${d.vertical}/${prova}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    setEnviando(null);
    if (error) {
      toast({ title: "Falha no upload", description: error.message, variant: "destructive" });
      return;
    }
    salvar({
      ...d,
      publicado: false,
      provas: {
        ...d.provas,
        [prova]: {
          path,
          protocolo: "",
          origemPropria: false,
          autorizacaoCliente: false,
          validada: false,
          anexadaEm: new Date().toISOString(),
          alt: "",
        },
      },
    });
  };

  const atualizar = (d: DossieVertical, prova: ProvaId, patch: Record<string, unknown>) => {
    const atual = d.provas[prova];
    if (!atual) return;
    salvar({ ...d, publicado: false, provas: { ...d.provas, [prova]: { ...atual, ...patch } } });
  };

  const publicar = (d: DossieVertical) => {
    const check = avaliarDossie(d);
    if (!check.ok) {
      toast({ title: "Publicação bloqueada", description: check.pendencias.join(" · "), variant: "destructive" });
      return;
    }
    salvar({ ...d, publicado: true, publicadoEm: new Date().toISOString() });
    toast({ title: "Galeria liberada", description: `Checklist completo para ${d.vertical}.` });
  };

  const resumo = useMemo(
    () => ({
      liberadas: VERTICAIS.filter((v) => dossieDe(v.id).publicado).length,
      total: VERTICAIS.length,
    }),
    [dossieDe],
  );

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
        <title>Provas visuais por vertical | Painel interno</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
          Provas visuais — TV, placas e monitor
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Fail-closed: nenhuma galeria pública é publicada sem as cinco provas de bancada própria
          — bancada, entrada, placa, teste final e embalagem — com protocolo, texto alternativo,
          autorização do cliente e validação manual.
        </p>
        <Badge variant="secondary" className="mt-3">
          {resumo.liberadas} de {resumo.total} galerias liberadas
        </Badge>
      </header>

      <div className="space-y-6">
        {VERTICAIS.map((v) => {
          const d = dossieDe(v.id);
          const check = avaliarDossie(d);
          return (
            <Card key={v.id} className="p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground">{v.rotulo}</h2>
                  <p className="text-xs text-muted-foreground">
                    {v.rota} · {check.validadas} de {check.total} provas validadas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {d.publicado ? (
                    <Badge className="gap-1">
                      <ShieldCheck className="h-3 w-3" aria-hidden /> Galeria liberada
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Bloqueada</Badge>
                  )}
                  <Button size="sm" onClick={() => publicar(d)} disabled={!check.ok || d.publicado}>
                    Liberar galeria
                  </Button>
                </div>
              </div>

              <ul className="space-y-3">
                {CHECKLIST_PROVAS.map((spec) => {
                  const anexo = d.provas[spec.id];
                  const carregando = enviando === `${v.id}:${spec.id}`;
                  return (
                    <li key={spec.id} className="rounded-lg border border-border p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{spec.titulo}</p>
                          <p className="text-xs text-muted-foreground">{spec.exigencia}</p>
                        </div>
                        {anexo ? (
                          anexo.validada ? (
                            <Badge className="gap-1">
                              <Check className="h-3 w-3" aria-hidden /> Validada
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <X className="h-3 w-3" aria-hidden /> Pendente
                            </Badge>
                          )
                        ) : (
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold">
                            {carregando ? (
                              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                            ) : (
                              <Upload className="h-3 w-3" aria-hidden />
                            )}
                            Anexar foto
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) void anexar(d, spec.id, f);
                              }}
                            />
                          </label>
                        )}
                      </div>

                      {anexo && (
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <Input
                            value={anexo.protocolo}
                            placeholder="Protocolo da OS de origem"
                            onChange={(e) => atualizar(d, spec.id, { protocolo: e.target.value })}
                          />
                          <Input
                            value={anexo.alt}
                            placeholder="Texto alternativo factual"
                            onChange={(e) => atualizar(d, spec.id, { alt: e.target.value })}
                          />
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Checkbox
                              checked={anexo.origemPropria}
                              onCheckedChange={(c) => atualizar(d, spec.id, { origemPropria: c === true })}
                            />
                            Foto da bancada própria (não é banco de imagem)
                          </label>
                          <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Checkbox
                              checked={anexo.autorizacaoCliente}
                              onCheckedChange={(c) => atualizar(d, spec.id, { autorizacaoCliente: c === true })}
                            />
                            Autorização do cliente registrada
                          </label>
                          <Button
                            size="sm"
                            variant={anexo.validada ? "outline" : "default"}
                            onClick={() => atualizar(d, spec.id, { validada: !anexo.validada })}
                          >
                            {anexo.validada ? "Revogar validação" : "Validar prova"}
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {!check.ok && (
                <p className="mt-3 text-xs text-destructive">{check.pendencias.join(" · ")}</p>
              )}
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default AdminProvasVerticais;
