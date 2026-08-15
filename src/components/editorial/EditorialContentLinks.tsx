import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";
import { getEditorialInboundLinks } from "@/lib/editorialInboundLinks";

/**
 * Bloco discreto "Conteúdo relacionado" nas páginas comerciais.
 * Rodada 3G/A1: garante o segundo link de entrada dos artigos aprovados.
 * Não altera H1, FAQ, contrato semântico ou CTA principal da página.
 */
export const EditorialContentLinks = ({ path }: { path: string }) => {
  const itens = getEditorialInboundLinks(path);
  if (itens.length === 0) return null;

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <nav
          aria-label="Conteúdo relacionado"
          className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-muted/30 p-6"
        >
          <h2 className="mb-3 font-heading text-base font-bold text-foreground">Conteúdo relacionado</h2>
          <ul className="space-y-3">
            {itens.map((i) => (
              <li key={i.slug}>
                <Link
                  to={`/blog/${i.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  {i.label}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">{i.hint}</p>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default EditorialContentLinks;
