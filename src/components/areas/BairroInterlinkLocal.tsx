import { Link } from "@/lib/router-compat";
import { ArrowRight, MapPin, Wrench } from "lucide-react";
import { REGIOES_COBERTURA, SERVICOS_INTERLINK_LOCAL } from "@/lib/bairrosBaseline";

interface BairroInterlinkLocalProps {
  /** Slug do bairro atual (usado para localizar região e vizinhos). */
  slug: string;
  nome: string;
}

/**
 * Interlinking básico obrigatório do template baseline de localidade:
 * bairro → serviços principais, bairro → bairros vizinhos da mesma região e
 * bairro → hub /areas-atendidas. Todos os destinos são validados pelo gate
 * `npm run check:rotas-localidades` (zero 404).
 */
export const BairroInterlinkLocal = ({ slug, nome }: BairroInterlinkLocalProps) => {
  const regiao = REGIOES_COBERTURA.find((r) => r.itens.some((i) => i.slug === slug));
  const vizinhos = (regiao?.itens ?? []).filter((i) => i.slug !== slug).slice(0, 8);

  return (
    <section className="py-10 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-heading font-bold text-foreground mb-4">
              <Wrench className="h-4 w-4 text-accent" aria-hidden="true" />
              Serviços atendidos em {nome}
            </h2>
            <ul className="grid gap-2">
              {SERVICOS_INTERLINK_LOCAL.map((servico) => (
                <li key={servico.to}>
                  <Link
                    to={servico.to}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {servico.label}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-lg font-heading font-bold text-foreground mb-4">
              <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
              {regiao ? `Outros bairros — ${regiao.titulo}` : "Outras regiões atendidas"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {vizinhos.map((v) => (
                <Link
                  key={v.to}
                  to={v.to}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  {v.nome}
                </Link>
              ))}
            </div>
            <Link
              to="/areas-atendidas"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent mt-4"
            >
              Ver todas as áreas atendidas
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
