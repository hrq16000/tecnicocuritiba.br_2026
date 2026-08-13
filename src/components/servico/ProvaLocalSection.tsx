import { Link } from "react-router-dom";
import { MapPin, Route, Wrench, ShieldCheck } from "lucide-react";
import { localLinksDe } from "@/lib/localLinkMap";
import { FAIXAS_LOGISTICAS, RAIO_MAXIMO_KM } from "@/lib/logisticaColeta";
import { getPublishableCases } from "@/lib/technicalCases";
import { reveal } from "@/lib/motion";

interface ProvaLocalSectionProps {
  /** Caminho canônico da página (ex.: "/servicos/formatacao"). */
  path: string;
  /** Nome do serviço, usado no texto de contexto. */
  servico: string;
}

/**
 * Prova local fixa das páginas de serviço: onde atendemos (links curados com
 * âncora natural), como o atendimento acontece na prática (faixas reais de
 * coleta e entrega) e casos técnicos publicáveis.
 *
 * Fail-closed: cada bloco só aparece quando existe evidência real registrada —
 * nunca inventa caso, avaliação ou cobertura.
 */
export const ProvaLocalSection = ({ path, servico }: ProvaLocalSectionProps) => {
  const locais = localLinksDe(path);
  const casos = getPublishableCases().slice(0, 3);

  if (locais.length === 0 && casos.length === 0) return null;

  return (
    <section className="py-12 bg-background" aria-labelledby="prova-local-titulo">
      <div className="container mx-auto max-w-5xl px-4">
        <h2
          id="prova-local-titulo"
          className="text-xl font-heading font-bold text-foreground sm:text-2xl"
        >
          Prova local: como o atendimento de {servico} acontece em Curitiba
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Operação com coleta e entrega em Curitiba e região metropolitana, sem balcão de
          atendimento ao público. Abaixo, a cobertura real por bairro, o formato do
          atendimento e os casos técnicos já documentados.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {locais.length > 0 && (
            <div className={`rounded-xl border border-border p-5 ${reveal()}`}>
              <h3 className="flex items-center gap-2 text-base font-heading font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
                Locais atendidos
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {locais.map((l) => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      className="text-foreground underline-offset-4 transition-colors hover:text-[hsl(var(--accent))] hover:underline"
                    >
                      {l.anchor}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={`rounded-xl border border-border p-5 ${reveal()}`}>
            <h3 className="flex items-center gap-2 text-base font-heading font-semibold text-foreground">
              <Route className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
              Contexto do atendimento
            </h3>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              {FAIXAS_LOGISTICAS.map((f) => (
                <li key={f.id}>
                  <span className="font-medium text-foreground">{f.nome}</span> — {f.descricao}
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Raio operacional de até {RAIO_MAXIMO_KM} km a partir de Curitiba. Coleta e entrega
              agendadas; não há atendimento presencial em balcão.
            </p>
          </div>
        </div>

        {casos.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {casos.map((c) => (
              <article key={c.id} className="rounded-xl border border-border p-5">
                <h3 className="flex items-center gap-2 text-sm font-heading font-semibold text-foreground">
                  <Wrench className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden="true" />
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProvaLocalSection;
