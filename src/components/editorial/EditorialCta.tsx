import { Link } from "@/lib/router-compat";
import { ArrowRight, MessageSquare } from "lucide-react";
import {
  EDITORIAL_CLUSTERS,
  getEditorialEntry,
  type CtaBranch,
} from "@/lib/editorialClusters";
import { isEditorialApproved, getApprovedSlugs } from "@/lib/blogEditorialRegistry";

/**
 * CTA editorial da Rodada 4F.
 * - Nunca abre WhatsApp diretamente: dispara o evento do funil de triagem.
 * - Preserva a origem (artigo) e o ramo PF/PJ sugerido pelo cluster.
 * - Sempre acompanhado do pilar comercial correspondente.
 */
export function EditorialCta({
  slug,
  titulo,
  variante = "avaliacao",
}: {
  slug: string;
  titulo: string;
  variante?: "avaliacao" | "orientacao" | "modalidade";
}) {
  const entry = getEditorialEntry(slug);
  const cluster = entry ? EDITORIAL_CLUSTERS[entry.cluster] : undefined;
  if (!cluster) return null;

  const branch: CtaBranch = cluster.ctaBranch;

  const rotulo =
    branch === "pj"
      ? "Falar com o suporte de TI para empresas"
      : variante === "orientacao"
      ? "Pedir orientação para o meu equipamento"
      : variante === "modalidade"
      ? "Verificar a modalidade adequada"
      : "Solicitar avaliação técnica";

  const abrirTriagem = () => {
    const contexto =
      branch === "pj"
        ? `Olá! Li o conteúdo "${titulo}" e preciso de suporte de TI para a minha empresa.`
        : `Olá! Li o conteúdo "${titulo}" e quero explicar o problema do meu equipamento.`;
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", {
        detail: { location: `blog/${slug}`, message: contexto },
      }),
    );
  };

  return (
    <div className="not-prose mt-12 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-background to-primary/5 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">
        {branch === "pj" ? "Atendimento empresarial" : "Próximo passo"}
      </p>
      <h3 className="font-heading font-bold text-primary text-lg md:text-xl mb-2">
        {branch === "pj"
          ? "Quer avaliar o cenário de TI da sua empresa?"
          : "Ainda com dúvida sobre o seu equipamento?"}
      </h3>
      <p className="text-muted-foreground text-sm mb-5">
        A triagem começa com perguntas simples sobre o equipamento e o sintoma. O valor
        só é informado depois da avaliação técnica — nada é executado sem sua aprovação.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={abrirTriagem}
          data-editorial-cta={branch}
          data-cta-location={`blog/${slug}`}
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          {rotulo}
        </button>
        <Link
          to={cluster.pilar}
          data-editorial-pilar={cluster.pilar}
          className="inline-flex items-center justify-center gap-2 border border-border hover:border-accent/40 text-foreground font-medium px-6 py-3 rounded-xl transition-colors"
        >
          {cluster.pilarLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Bloco "conteúdos relacionados" — no máximo 3 links.
 * Regra (Rodada 3G): só aponta para artigos com aprovação editorial válida
 * (indexáveis e canônicos). Se a progressão lógica do cluster não sobrar
 * nenhum destino aprovado, completa com outros artigos aprovados da onda.
 */
export function EditorialRelatedLinks({
  slug,
  titles,
}: {
  slug: string;
  titles: Record<string, string | undefined>;
}) {
  const entry = getEditorialEntry(slug);
  const cluster = entry ? EDITORIAL_CLUSTERS[entry.cluster] : undefined;
  const elegivel = (s: string) => s !== slug && !!titles[s] && isEditorialApproved(s);

  const preferidos = (entry?.relacionados ?? []).filter(elegivel);
  const complementos = getApprovedSlugs().filter(
    (s) => elegivel(s) && !preferidos.includes(s),
  );
  const relacionados = [...preferidos, ...complementos].slice(0, 3);
  if (!cluster || relacionados.length === 0) return null;


  return (
    <nav aria-label="Conteúdos relacionados" className="not-prose mt-10 rounded-2xl border border-border/60 bg-muted/30 p-6">
      <h3 className="font-heading font-bold text-primary text-base mb-3">
        Continue por aqui — {cluster.nome.toLowerCase()}
      </h3>
      <ul className="space-y-2">
        {relacionados.map((s) => (
          <li key={s}>
            <Link
              to={`/blog/${s}`}
              className="text-sm text-accent hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              {titles[s]}
            </Link>
          </li>
        ))}
        {cluster.pilarApoio && (
          <li>
            <Link to={cluster.pilarApoio} className="text-sm text-foreground/80 hover:text-accent hover:underline">
              Serviço relacionado: {cluster.pilarApoio.replace(/^\//, "").replace(/-/g, " ")}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
