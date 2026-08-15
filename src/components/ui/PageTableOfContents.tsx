interface TocItem {
  id: string;
  label: string;
}

/**
 * Rodada 3P — navegação interna "Nesta página".
 * Puramente visual/navegacional: não cria URLs, não altera conteúdo
 * editorial e não emite schema. Usada em páginas longas (preços e
 * pilotos visuais de serviço/sintoma) para melhorar a compreensão.
 */
export const PageTableOfContents = ({
  items,
  title = "Nesta página",
  className = "",
}: {
  items: TocItem[];
  title?: string;
  className?: string;
}) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className={`rounded-xl border border-border bg-card p-5 ${className}`}
    >
      <p className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-medium text-foreground transition-colors hover:text-[hsl(var(--accent))] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="text-[hsl(var(--accent))]" aria-hidden="true">
                ▸
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PageTableOfContents;
