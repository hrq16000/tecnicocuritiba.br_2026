import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { TechnicalCase, TechnicalCasePhoto } from "@/lib/technicalCases";
import { validateTechnicalCase } from "@/lib/technicalCases";

/**
 * COMPONENTES DE PROVA TÉCNICA (Rodada 3G — preparação).
 *
 * Fail-closed: cada componente só renderiza a partir de um caso que
 * passe em validateTechnicalCase(). Sem caso aprovado, nada aparece —
 * por isso nenhum deles está montado em rota pública nesta rodada.
 */

const AVISO_VARIACAO =
  "Resultados variam conforme equipamento, estado de conservação e histórico de uso. Este registro descreve um atendimento específico.";

/** Componente 1 — Caso técnico resumido. */
export const TechnicalCaseSummary = ({ caso }: { caso: TechnicalCase }) => {
  if (!validateTechnicalCase(caso).ok) return null;

  const linhas: Array<[string, string]> = [
    ["Equipamento", [caso.equipment.brand, caso.equipment.model, caso.equipment.approximateYear].filter(Boolean).join(" · ") || caso.equipment.category],
    ["Sintoma informado", caso.reportedSymptoms.join("; ")],
    ["Diagnóstico confirmado", caso.confirmedDiagnosis.join("; ")],
    ["Solução aplicada", caso.proceduresPerformed.join("; ")],
    ["Resultado observado", caso.observedResult.join("; ")],
    ["Limitações", caso.limitations.join("; ")],
    ["Localidade", [caso.location.neighborhood, caso.location.city].filter(Boolean).join(", ")],
  ];

  return (
    <article className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-heading text-lg font-bold text-foreground">{caso.title}</h3>
      <dl className="mt-4 space-y-2 text-sm">
        {linhas.map(([k, v]) => (
          <div key={k} className="grid gap-1 md:grid-cols-[190px_1fr]">
            <dt className="font-semibold text-foreground">{k}</dt>
            <dd className="text-muted-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">{AVISO_VARIACAO}</p>
      <Link
        to={`/servicos/${caso.serviceSlug}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        Serviço relacionado <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
};

/** Componente 2 — Evidência visual. */
export const TechnicalCaseEvidence = ({ photo }: { photo: TechnicalCasePhoto }) => {
  if (!photo?.src || !photo.alt?.trim() || !photo.caption?.trim() || !photo.kind) return null;
  if (!photo.exifStripped || !photo.screenReviewed) return null;

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card">
      <img decoding="async" src={photo.src} alt={photo.alt} loading="lazy" className="h-auto w-full object-cover" />
      <figcaption className="space-y-1 p-4 text-sm">
        <span className="block text-muted-foreground">{photo.caption}</span>
        <span className="block text-xs font-medium text-foreground/80">
          {photo.fromService ? "Imagem do atendimento" : "Imagem ilustrativa"}
        </span>
      </figcaption>
    </figure>
  );
};

/** Componente 3 — Processo aplicado (teste → constatação → intervenção → validação). */
export const TechnicalCaseProcess = ({ caso }: { caso: TechnicalCase }) => {
  if (!validateTechnicalCase(caso).ok) return null;

  const etapas: Array<[string, string[]]> = [
    ["Teste", caso.checksPerformed],
    ["Constatação", caso.confirmedDiagnosis],
    ["Intervenção", caso.proceduresPerformed],
    ["Validação", caso.observedResult],
  ];

  return (
    <section className="rounded-2xl border border-border bg-muted/30 p-6">
      <h3 className="font-heading text-lg font-bold text-foreground">Processo aplicado</h3>
      <ol className="mt-4 space-y-4">
        {etapas.map(([titulo, itens]) => (
          <li key={titulo}>
            <p className="text-sm font-semibold text-foreground">{titulo}</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {itens.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {caso.measurements?.length ? (
        <div className="mt-5 space-y-2 text-sm text-muted-foreground">
          {caso.measurements.map((m) => (
            <p key={m.label}>
              <strong className="text-foreground">{m.label}:</strong>{" "}
              {[m.before && `antes ${m.before}${m.unit}`, m.after && `depois ${m.after}${m.unit}`]
                .filter(Boolean)
                .join(" · ")}{" "}
              — medido com {m.tool} ({m.method}, {m.measuredAt}). {m.limitations}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
};
