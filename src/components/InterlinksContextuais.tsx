import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { interlinksDe } from "@/lib/interlinksGerados";
import { trackInternalLink } from "@/lib/analytics";

/**
 * Bloco de interlinkagem contextual gerado automaticamente.
 *
 * As âncoras vêm de `src/lib/interlinksGerados.ts` (gerado por
 * `npm run interlinks` a partir do conteúdo real de cada destino), então
 * cada link usa o título verdadeiro da página — nunca "clique aqui" nem
 * âncora repetida. Cliques disparam `internal_link_click`
 * (`non_interaction: true`), sem interferir na contagem de conversões.
 */
export const InterlinksContextuais = () => {
  const { pathname } = useLocation();
  const links = interlinksDe(pathname);

  if (links.length < 2) return null;

  return (
    <nav aria-label="Conteúdos relacionados" className="border-t border-white/10 bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-sm font-heading font-semibold uppercase tracking-wide text-white/70 mb-4">
          Relacionados a esta página
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                onClick={() => trackInternalLink(link.href, "interlinks-contextuais")}
                className="group flex items-start gap-2 rounded-lg px-3 py-2 text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-11"
              >
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span>{link.anchor}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default InterlinksContextuais;
