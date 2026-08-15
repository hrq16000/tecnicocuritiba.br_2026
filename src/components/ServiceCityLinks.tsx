import { Link } from "@/lib/router-compat";
import { MapPin, Briefcase, ChevronDown } from "lucide-react";
import { SERVICOS, CIDADES, getServico, getCidade } from "@/lib/servicoCidadeData";

interface ServiceCityLinksProps {
  servicoSlug: string;
  cidadeSlug: string;
}

export const ServiceCityLinks = ({ servicoSlug, cidadeSlug }: ServiceCityLinksProps) => {
  const servico = getServico(servicoSlug);
  const cidade = getCidade(cidadeSlug);
  if (!servico || !cidade) return null;

  const outrasCidades = CIDADES.filter(c => c.slug !== cidadeSlug);
  const outrosServicos = SERVICOS.filter(s => s.slug !== servicoSlug);

  return (
    <section className="py-14 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Bloco A — Mesmo serviço em outras cidades */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              {servico.nome} em outras cidades da região metropolitana
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {outrasCidades.map(c => (
                <Link
                  key={c.slug}
                  to={`/servicos/${servicoSlug}/${c.slug}`}
                  className="px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground hover:border-accent hover:bg-accent/5 transition-colors"
                >
                  {servico.nome} em {c.nome}
                </Link>
              ))}
            </div>
          </div>

          {/* Bloco B — Outros serviços na mesma cidade */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-accent" />
              Outros serviços de informática em {cidade.nome}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {outrosServicos.map(s => (
                <Link
                  key={s.slug}
                  to={`/servicos/${s.slug}/${cidadeSlug}`}
                  className="px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground hover:border-accent hover:bg-accent/5 transition-colors"
                >
                  {s.nome}
                </Link>
              ))}
            </div>
          </div>

          {/* Bloco C — Grid completo colapsável */}
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-accent font-medium hover:underline">
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              Ver todos os serviços em todas as cidades
            </summary>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 bg-secondary text-primary font-bold sticky left-0">Serviço</th>
                    {CIDADES.map(c => (
                      <th key={c.slug} className="p-2 bg-secondary text-primary font-medium whitespace-nowrap">
                        {c.nome}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SERVICOS.map(s => (
                    <tr key={s.slug} className="border-t border-border">
                      <td className="p-2 font-medium text-foreground whitespace-nowrap sticky left-0 bg-background">
                        {s.nome}
                      </td>
                      {CIDADES.map(c => {
                        const isCurrent = s.slug === servicoSlug && c.slug === cidadeSlug;
                        return (
                          <td key={c.slug} className="p-2 text-center">
                            {isCurrent ? (
                              <span className="text-accent font-bold" aria-current="page">●</span>
                            ) : (
                              <Link
                                to={`/servicos/${s.slug}/${c.slug}`}
                                className="text-muted-foreground hover:text-accent transition-colors"
                                title={`${s.nome} em ${c.nome}`}
                              >
                                →
                              </Link>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default ServiceCityLinks;
