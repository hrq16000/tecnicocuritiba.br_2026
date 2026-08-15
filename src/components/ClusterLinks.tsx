import { Link } from "@/lib/router-compat";
import { buildCluster, type ClusterOptions } from "@/lib/seoCluster";

interface Props extends ClusterOptions {
  titulo?: string;
  /** Categoria/sintoma da página, usada para escolher os serviços do cluster. */
  categoria?: string;
}

/**
 * Bloco de links internos automáticos (cluster SEO):
 * sintoma → serviços → modalidades → bairros/cidades.
 */
export const ClusterLinks = ({
  titulo = "Continue pelo tema relacionado",
  categoria,
  contexto,
  currentPath,
  currentCidadeSlug,
}: Props) => {
  const grupos = buildCluster({
    contexto: [categoria, contexto].filter(Boolean).join(" "),
    currentPath,
    currentCidadeSlug,
  });

  if (!grupos.length) return null;

  return (
    <section className="border-t border-border py-12" aria-labelledby="cluster-links">
      <div className="container mx-auto px-4">
        <h2 id="cluster-links" className="text-2xl font-bold md:text-3xl">
          {titulo}
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {grupos.map((g) => (
            <nav key={g.titulo} aria-label={g.titulo}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {g.titulo}
              </h3>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClusterLinks;
