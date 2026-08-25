import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { Header } from "@/components/Header";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { BAIRROS_MAPEADOS, enrichmentStatus, seoDepth } from "@/lib/bairrosBaseline";

/**
 * /admin/bairros — revisão editorial das páginas de localidade (painel interno,
 * noindex).
 *
 * Regras de governança implementadas aqui:
 *  - o status EXIBIDO combina o gate real do código (`seoDepth`, fail-closed
 *    por prova visual) com a decisão editorial registrada no banco;
 *  - promover de SHALLOW (`pending`/noindex) para RICH (`ready`/index,follow)
 *    exige Double Opt-in explícito e só grava a intenção; a troca do selo
 *    público continua sendo feita pelo job `npm run enriquecer:bairros`, que
 *    revalida originalidade e prova visual antes de liberar o índice.
 */

type Filtro = "todos" | "pending" | "ready" | "curated" | "baseline";

interface Registro {
  slug: string;
  enrichment_status: "pending" | "ready";
  notas: string | null;
  palavras: number | null;
  originalidade: number | null;
  double_opt_in: boolean;
  decidido_em: string | null;
  decidido_por_email: string | null;
}

const AdminBairros = () => {
  const { loading: authLoading, isAdmin, session } = useAdminAuth();
  const [registros, setRegistros] = useState<Record<string, Registro>>({});
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [salvando, setSalvando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from("bairro_enriquecimento")
      .select("slug,enrichment_status,notas,palavras,originalidade,double_opt_in,decidido_em,decidido_por_email");
    if (error) setErro(error.message);
    const mapa: Record<string, Registro> = {};
    for (const linha of data ?? []) mapa[linha.slug] = linha as Registro;
    setRegistros(mapa);
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (isAdmin) void carregar();
  }, [isAdmin, carregar]);

  const linhas = useMemo(() => {
    const termo = busca
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    return BAIRROS_MAPEADOS.filter((b) => b.slug).map((b) => {
      const slug = b.slug!;
      const registro = registros[slug];
      const codigo = seoDepth(slug);
      const editorial = registro?.enrichment_status ?? enrichmentStatus(slug);
      return { ...b, slug, codigo, editorial, registro };
    })
      .filter((l) => {
        if (filtro === "pending" || filtro === "ready") return l.editorial === filtro;
        if (filtro === "curated" || filtro === "baseline") return l.codigo === filtro;
        return true;
      })
      .filter((l) => {
        if (!termo) return true;
        const alvo = `${l.nome} ${l.slug} ${l.regiaoTitulo}`
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
        return alvo.includes(termo);
      });
  }, [registros, filtro, busca]);

  const definirStatus = async (
    slug: string,
    nome: string,
    regiao: string,
    status: "pending" | "ready",
  ) => {
    setSalvando(slug);
    setErro(null);
    const { error } = await supabase.from("bairro_enriquecimento").upsert(
      {
        slug,
        nome,
        regiao,
        enrichment_status: status,
        double_opt_in: status === "ready",
        decidido_por: session?.user?.id ?? null,
        decidido_por_email: session?.user?.email ?? null,
        decidido_em: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
    if (error) setErro(error.message);
    setSalvando(null);
    setConfirmando(null);
    await carregar();
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden="true" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <PageSEO title="Revisão de bairros" description="Painel interno." path="/admin/bairros" noindex />
        <Header />
        <main className="container mx-auto max-w-2xl px-4 py-16">
          <h1 className="font-heading text-2xl font-bold text-foreground">Acesso restrito</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Entre com uma conta administradora para revisar o conteúdo das páginas de bairro.
          </p>
          <Link to="/admin/login" className="mt-4 inline-block text-sm font-semibold text-accent underline">
            Ir para o login
          </Link>
        </main>
      </div>
    );
  }

  const totais = {
    ready: Object.values(registros).filter((r) => r.enrichment_status === "ready").length,
    curated: BAIRROS_MAPEADOS.filter((b) => b.slug && seoDepth(b.slug) === "curated").length,
    total: BAIRROS_MAPEADOS.filter((b) => b.slug).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Revisão editorial de bairros | Painel interno"
        description="Painel interno de revisão de conteúdo por bairro e controle de indexabilidade."
        path="/admin/bairros"
        noindex
      />
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Revisão editorial de bairros
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {totais.curated} de {totais.total} páginas estão indexáveis no código (gate fail-closed de prova visual).{" "}
          {totais.ready} têm decisão editorial <strong>ready</strong> registrada aqui. Marcar como ready não publica
          nada sozinho: o job <code>npm run enriquecer:bairros</code> revalida originalidade e prova visual antes de
          trocar o selo de <code>noindex</code> para <code>index, follow</code>.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar bairro ou região"
            className="max-w-xs"
            aria-label="Buscar bairro"
          />
          {(["todos", "pending", "ready", "curated", "baseline"] as Filtro[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filtro === f ? "default" : "outline"}
              onClick={() => setFiltro(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {erro ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" /> {erro}
          </p>
        ) : null}

        {carregando ? (
          <p className="mt-8 text-sm text-muted-foreground">Carregando registros…</p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Status de conteúdo e indexabilidade por bairro</caption>
              <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Bairro</th>
                  <th scope="col" className="px-4 py-3">Região</th>
                  <th scope="col" className="px-4 py-3">Selo no código</th>
                  <th scope="col" className="px-4 py-3">Decisão editorial</th>
                  <th scope="col" className="px-4 py-3">Ação</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((l) => (
                  <tr key={l.slug} className="border-t border-border/60">
                    <td className="px-4 py-3">
                      <Link to={l.to} className="font-semibold text-foreground underline underline-offset-4">
                        {l.nome}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{l.regiaoTitulo}</td>
                    <td className="px-4 py-3">
                      {l.codigo === "curated" ? (
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" /> RICH · index, follow
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <ShieldAlert className="h-4 w-4" aria-hidden="true" /> SHALLOW · noindex
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">{l.editorial}</span>
                      {l.registro?.decidido_por_email ? (
                        <span className="block text-xs text-muted-foreground">
                          por {l.registro.decidido_por_email}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {confirmando === l.slug ? (
                        <div className="rounded-lg border border-accent/50 bg-accent/5 p-3">
                          <p className="text-xs leading-relaxed text-foreground">
                            Confirmar promoção de <strong>{l.nome}</strong> para <strong>ready</strong>? Isto declara
                            que o conteúdo é autoral e que existe prova visual real. A indexação só muda depois do
                            job de enriquecimento revalidar os gates.
                          </p>
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              disabled={salvando === l.slug}
                              onClick={() => void definirStatus(l.slug, l.nome, l.regiao, "ready")}
                            >
                              Confirmar promoção
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setConfirmando(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : l.editorial === "ready" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={salvando === l.slug}
                          onClick={() => void definirStatus(l.slug, l.nome, l.regiao, "pending")}
                        >
                          Voltar para pending
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setConfirmando(l.slug)}>
                          Promover para ready…
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminBairros;
