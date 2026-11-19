import { BadgeCheck, FileCheck2, Wrench, Users, ClipboardCheck, ExternalLink } from "lucide-react";
import {
  dadosVerificaveis,
  compromissosOperacionais,
  equipamentosBancada,
  equipeTecnica,
  casosReais,
  hasEquipamentos,
  hasEquipe,
  hasCasos,
} from "@/lib/eeatProofs";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Seção de E-E-A-T com provas verificáveis.
 * Cada bloco só é renderizado quando houver dado real cadastrado em
 * `src/lib/eeatProofs.ts` — nunca exibimos placeholder nem prova inventada.
 */
export const EeatProofsSection = ({
  titulo = "Quem responde por este atendimento",
  descricao = "Dados verificáveis, compromissos operacionais e escopo real de trabalho — sem avaliações fabricadas nem promessas que não conseguimos cumprir.",
  className = "",
}: {
  titulo?: string;
  descricao?: string;
  className?: string;
}) => {
  if (dadosVerificaveis.length === 0 && compromissosOperacionais.length === 0) return null;

  return (
    <section
      className={`py-12 md:py-16 ${className}`}
      aria-labelledby="eeat-provas"
      data-eeat-section="true"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-6 w-6 text-accent" aria-hidden="true" />
            <h2 id="eeat-provas" className="text-2xl font-bold text-foreground md:text-3xl">
              {titulo}
            </h2>
          </div>
          <p className="mt-2 max-w-3xl text-muted-foreground">{descricao}</p>

          {dadosVerificaveis.length > 0 && (
            <div className="mt-8" data-eeat-block="dados-verificaveis">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <ClipboardCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                Dados verificáveis
              </h3>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dadosVerificaveis.map((d) => (
                  <div key={d.label} className="rounded-xl border border-border bg-card p-4">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{d.label}</dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {d.url ? (
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary underline"
                        >
                          {d.value}
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                    {d.fonte && <p className="mt-1 text-xs text-muted-foreground">Fonte: {d.fonte}</p>}
                  </div>
                ))}
              </dl>
            </div>
          )}

          {compromissosOperacionais.length > 0 && (
            <div className="mt-8" data-eeat-block="compromissos">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <FileCheck2 className="h-4 w-4 text-primary" aria-hidden="true" />
                Compromissos do atendimento
              </h3>
              <ul className="mt-4 grid gap-2 md:grid-cols-2">
                {compromissosOperacionais.map((c) => (
                  <li key={c} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasEquipamentos() && (
            <div className="mt-8" data-eeat-block="equipamentos">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Wrench className="h-4 w-4 text-primary" aria-hidden="true" />
                Estrutura de bancada
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {equipamentosBancada.map((e) => (
                  <li key={e.nome} className="rounded-xl border border-border bg-card p-4 text-sm">
                    <span className="font-medium text-foreground">{e.nome}</span>
                    <p className="mt-1 text-muted-foreground">{e.finalidade}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasEquipe() && (
            <div className="mt-8" data-eeat-block="equipe">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                Equipe técnica
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {equipeTecnica.map((m) => (
                  <li key={m.nome} className="rounded-xl border border-border bg-card p-4 text-sm">
                    <span className="font-medium text-foreground">{m.nome}</span>
                    <p className="text-muted-foreground">{m.funcao}</p>
                    <p className="mt-1 text-muted-foreground">{m.escopo}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasCasos() && (
            <div className="mt-8" data-eeat-block="casos">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <ClipboardCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                Casos reais de atendimento
              </h3>
              <ul className="mt-4 space-y-3">
                {casosReais.map((c) => (
                  <li key={c.titulo} className="rounded-xl border border-border bg-card p-5 text-sm">
                    <p className="font-medium text-foreground">
                      {c.titulo}
                      {c.local ? ` — ${c.local}` : ""}
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      <span className="font-medium text-foreground">Contexto:</span> {c.contexto}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      <span className="font-medium text-foreground">Diagnóstico:</span> {c.diagnostico}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      <span className="font-medium text-foreground">Desfecho:</span> {c.desfecho}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-8 text-sm text-muted-foreground">
            Responsabilidade técnica do {siteConfig.brandName}.{" "}
            {/* Âncoras nativas: a home é montada fora do Router (shell estático). */}
            <a href="/gestor-responsavel" className="text-primary underline">
              Ver quem responde tecnicamente
            </a>{" "}
            ·{" "}
            <a href="/precos-e-politicas" className="text-primary underline">
              política de preços e garantia
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default EeatProofsSection;
