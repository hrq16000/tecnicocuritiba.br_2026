import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Circle, Loader2, Upload } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";

/**
 * Fila de prova visual por bairro (painel interno, noindex).
 *
 * Lê `public/bairro-photo-queue.json` (gerado por
 * `npm run report:fotos-bairros`) e permite anexar as fotos reais exigidas por
 * seção antes de liberar a indexação do bairro. Os arquivos vão para o bucket
 * privado `provas-bairros`; nenhuma imagem entra no site sem passar depois
 * pelo gate `check:real-images`.
 */

interface SecaoFila {
  id: string;
  titulo: string;
  minimo: number;
  exigencia: string;
  cobertas: number;
  ok: boolean;
}

interface ItemFila {
  path: string;
  slug: string;
  nome: string;
  noSitemap: boolean;
  onda: string | null;
  fotosValidas: number;
  minimoTotal: number;
  secoes: SecaoFila[];
  problemasGate: string[];
  status: "completo" | "pendente" | "sem-avaliacao";
  liberavel: boolean;
}

interface Payload {
  generatedAt: string;
  regras: { MINIMO_TOTAL: number };
  totals: Record<string, number>;
  fila: ItemFila[];
}

interface ProvaEnviada {
  id: string;
  bairro_slug: string;
  secao: string;
  storage_path: string;
  legenda: string | null;
  aprovada: boolean;
  created_at: string;
}

const AdminFotosBairros = () => {
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [data, setData] = useState<Payload | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [provas, setProvas] = useState<ProvaEnviada[]>([]);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    document.title = "Fila de prova visual por bairro | Painel interno";
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";

    fetch("/bairro-photo-queue.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setData)
      .catch(() =>
        setErro("bairro-photo-queue.json ainda não foi gerado. Rode `npm run report:fotos-bairros`."),
      );
  }, []);

  const carregarProvas = useCallback(async () => {
    if (!isAdmin) return;
    const { data: rows } = await supabase
      .from("bairro_photo_proofs")
      .select("id,bairro_slug,secao,storage_path,legenda,aprovada,created_at")
      .order("created_at", { ascending: false });
    setProvas((rows as ProvaEnviada[]) ?? []);
  }, [isAdmin]);

  useEffect(() => {
    void carregarProvas();
  }, [carregarProvas]);

  const enviarFoto = async (item: ItemFila, secao: SecaoFila, file: File) => {
    const chave = `${item.slug}:${secao.id}`;
    setEnviando(chave);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const storagePath = `${item.slug}/${secao.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("provas-bairros")
        .upload(storagePath, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { error: insErr } = await supabase.from("bairro_photo_proofs").insert({
        bairro_slug: item.slug,
        route_path: item.path,
        secao: secao.id,
        storage_path: storagePath,
        legenda: file.name,
      });
      if (insErr) throw insErr;
      await carregarProvas();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao enviar a foto.");
    } finally {
      setEnviando(null);
    }
  };

  const fila = useMemo(() => {
    if (!data) return [];
    const termo = busca.trim().toLowerCase();
    return data.fila.filter((i) => (termo ? i.nome.toLowerCase().includes(termo) || i.slug.includes(termo) : true));
  }, [data, busca]);

  const enviadasPorSecao = (slug: string, secao: string) =>
    provas.filter((p) => p.bairro_slug === slug && p.secao === secao).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-heading font-bold">Fila de prova visual por bairro</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cada bairro só é liberado para indexação com foto própria em todas as seções obrigatórias.
          Nada de banco de imagens ou geração por IA: os arquivos enviados aqui alimentam o gate
          <code className="mx-1">check:real-images</code>.
        </p>

        {erro && (
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-amber-500/10 p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" aria-hidden="true" />
            <span>{erro}</span>
          </div>
        )}

        {!authLoading && !isAdmin && (
          <div className="mt-6 rounded-xl border border-border p-4 text-sm text-muted-foreground">
            Entre com uma conta administradora em <code>/admin/login</code> para enviar fotos.
            A fila abaixo continua visível apenas como checklist.
          </div>
        )}

        {!data && !erro && (
          <div className="mt-10 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Carregando fila…
          </div>
        )}

        {data && (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {Object.entries(data.totals).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border p-3">
                  <div className="text-2xl font-bold">{v}</div>
                  <div className="text-xs text-muted-foreground">{k}</div>
                </div>
              ))}
            </div>

            <Input
              className="mt-6"
              placeholder="Filtrar por bairro…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <ul className="mt-6 space-y-4">
              {fila.map((item) => (
                <li key={item.path} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="font-heading font-semibold">{item.nome}</h2>
                      <p className="text-xs text-muted-foreground">
                        {item.path} · {item.fotosValidas}/{item.minimoTotal} foto(s) aprovada(s) no gate
                        {item.onda ? ` · onda ${item.onda}` : ""}
                        {item.noSitemap ? " · no sitemap" : " · fora do sitemap"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.liberavel
                          ? "bg-emerald-500/15 text-emerald-600"
                          : item.status === "pendente"
                            ? "bg-amber-500/15 text-amber-600"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.liberavel ? "prova completa" : item.status}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {item.secoes.map((secao) => {
                      const enviadas = enviadasPorSecao(item.slug, secao.id);
                      const ok = secao.ok || enviadas >= secao.minimo;
                      const chave = `${item.slug}:${secao.id}`;
                      return (
                        <li key={secao.id} className="rounded-lg border border-border/60 p-3">
                          <div className="flex items-start gap-2">
                            {ok ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" aria-hidden="true" />
                            ) : (
                              <Circle className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {secao.titulo}{" "}
                                <span className="text-xs font-normal text-muted-foreground">
                                  (mínimo {secao.minimo} · {secao.cobertas} no gate · {enviadas} enviada(s))
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground">{secao.exigencia}</p>
                              {isAdmin && (
                                <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-[hsl(var(--accent))]">
                                  {enviando === chave ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                  ) : (
                                    <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                                  )}
                                  Enviar foto real
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="sr-only"
                                    disabled={enviando === chave}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) void enviarFoto(item, secao, file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {item.problemasGate.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs text-red-600">
                      {item.problemasGate.map((p) => (
                        <li key={p}>• {p}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs text-muted-foreground">
              Relatório gerado em {new Date(data.generatedAt).toLocaleString("pt-BR")}. Depois de
              enviar as fotos, otimize e publique com <code>npm run fotos:otimizar</code> e revalide
              com <code>npm run check:real-images</code>.
            </p>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminFotosBairros;
