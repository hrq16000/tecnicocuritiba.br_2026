import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";
import LazyMount from "@/components/LazyMount";
import { problemasRelacionados } from "@/lib/problemasRelacionados";
import { trackInternalLink } from "@/lib/analytics";
import { MOTION_DURATION, MOTION_EASING, staggerDelay } from "@/lib/motion";

interface Props {
  /** Rota atual (ex.: "/problemas/webcam-nao-funciona"). */
  path: string;
  titulo?: string;
  intro?: string;
}

/**
 * Cards de "Próximos problemas": interlinking contextual automático entre
 * sintomas relacionados. Renderizado só ao aproximar do viewport (LazyMount)
 * para não competir com o LCP, com reserva de espaço para manter CLS em 0.
 * Cada clique é medido no GA4 como `internal_link_click` (não é lead).
 */
export const ProximosProblemas = ({
  path,
  titulo = "Próximos problemas para investigar",
  intro = "Sintomas vizinhos que costumam aparecer no mesmo equipamento. Cada página explica o que muda na investigação.",
}: Props) => {
  const itens = problemasRelacionados(path);
  if (!itens.length) return null;

  return (
    <LazyMount minHeight={280} className="mb-12">
      <section aria-labelledby="proximos-problemas" className="rounded-xl border border-border bg-muted/40 p-6">
        <h2 id="proximos-problemas" className="mb-2 text-2xl font-bold text-foreground">
          {titulo}
        </h2>
        <p className="mb-5 text-muted-foreground">{intro}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {itens.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => trackInternalLink(item.to, "proximos_problemas")}
              className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/60"
              style={{
                animation: `fade-in ${MOTION_DURATION.base}ms ${MOTION_EASING.enter} both`,
                animationDelay: `${staggerDelay(i)}ms`,
              }}
            >
              <span className="mb-1.5 inline-flex items-center gap-1.5 font-semibold text-foreground group-hover:text-accent">
                {item.titulo} <ArrowRight className="h-4 w-4" />
              </span>
              <span className="block text-sm text-muted-foreground">{item.desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </LazyMount>
  );
};

export default ProximosProblemas;
