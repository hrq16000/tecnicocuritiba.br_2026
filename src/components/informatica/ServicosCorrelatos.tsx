import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";

export interface ServicoCorrelato {
  to: string;
  titulo: string;
  desc: string;
}

interface Props {
  titulo?: string;
  intro?: string;
  itens: ServicoCorrelato[];
}

/**
 * Bloco de serviços correlatos do cluster de informática.
 * Objetivo: distribuir link equity das páginas de sintoma/suporte para as
 * páginas comerciais prioritárias sem alterar copy comercial existente.
 */
export const ServicosCorrelatos = ({
  titulo = "Serviços relacionados a este problema",
  intro = "Depois do diagnóstico, o atendimento segue por uma destas frentes. Cada página explica o escopo, o processo e o que influencia o valor.",
  itens,
}: Props) => {
  if (!itens.length) return null;

  return (
    <section className="mb-12" aria-labelledby="servicos-correlatos">
      <h2 id="servicos-correlatos" className="mb-3 text-2xl font-bold text-foreground">
        {titulo}
      </h2>
      <p className="mb-6 text-muted-foreground">{intro}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {itens.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
          >
            <h3 className="font-heading text-base font-bold text-foreground group-hover:text-accent">
              {item.titulo}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              Ver página <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ServicosCorrelatos;
