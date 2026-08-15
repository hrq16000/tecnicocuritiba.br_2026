import { Link } from "@/lib/router-compat";
import { ShieldCheck, MapPin, Wrench, BadgeCheck } from "lucide-react";
import { GESTOR, hasPersonAuthority } from "@/lib/gestorResponsavel";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Seção reutilizável de responsabilidade técnica (autoria institucional).
 * Sem dados inventados: certificações só aparecem se cadastradas.
 */
export const GestorResponsavelSection = ({
  compact = false,
}: {
  compact?: boolean;
}) => {
  const g = GESTOR;
  const pessoal = hasPersonAuthority(g);

  return (
    <section className="py-12 md:py-16" aria-labelledby="gestor-responsavel">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 id="gestor-responsavel" className="text-2xl font-bold md:text-3xl">
              {pessoal ? `${g.nome} — ${g.cargo}` : "Responsabilidade técnica"}
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.brandName} · atuação em informática desde {siteConfig.foundedYear}
          </p>

          <div className="mt-5 space-y-3 text-muted-foreground">
            {(compact ? g.bio.slice(0, 2) : g.bio).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {!compact && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Wrench className="h-4 w-4 text-primary" aria-hidden="true" />
                  Escopo técnico
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {g.escopoTecnico.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  Área de atuação
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                  {g.areaAtuacao.map((a) => (
                    <li
                      key={a}
                      className="rounded-full border border-border px-3 py-1 text-muted-foreground"
                    >
                      {a}
                    </li>
                  ))}
                </ul>

                {g.certificacoes.length > 0 && (
                  <>
                    <h3 className="mt-6 flex items-center gap-2 font-semibold">
                      <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                      Certificações
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {g.certificacoes.map((c) => (
                        <li key={c.nome}>
                          <span className="font-medium text-foreground">{c.nome}</span>{" "}
                          — {c.emissor}
                          {c.ano ? ` (${c.ano})` : ""}
                          {c.url && (
                            <>
                              {" · "}
                              <a
                                href={c.url}
                                rel="noopener noreferrer nofollow"
                                target="_blank"
                                className="text-primary underline"
                              >
                                verificar
                              </a>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}

          {compact && (
            <Link
              to="/gestor-responsavel"
              className="mt-6 inline-block font-medium text-primary underline"
            >
              Conhecer a responsabilidade técnica
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default GestorResponsavelSection;
