import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";
import { articlesForPilar } from "@/lib/editorialClusters";
import { isEditorialApproved } from "@/lib/blogEditorialRegistry";

/**
 * Bloco PILAR → ARTIGOS (Rodada 4F).
 * Fail-closed: só exibe conteúdos com aprovação editorial válida.
 * Enquanto nenhum artigo estiver aprovado, o bloco não renderiza —
 * páginas comerciais nunca apontam para conteúdo noindex/rascunho.
 */
export function PilarEditorialLinks({
  pilar,
  titulo = "Dúvidas frequentes antes de contratar",
  titles = {},
}: {
  pilar: string;
  titulo?: string;
  titles?: Record<string, string | undefined>;
}) {
  const items = articlesForPilar(pilar).filter((e) => isEditorialApproved(e.slug)).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section aria-label={titulo} className="container mx-auto py-10">
      <h2 className="font-heading font-bold text-primary text-xl mb-4">{titulo}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((e) => (
          <li key={e.slug}>
            <Link
              to={`/blog/${e.slug}`}
              className="inline-flex items-start gap-2 text-sm text-accent hover:underline"
            >
              <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" />
              {titles[e.slug] ?? e.consulta}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
