import {
  MOTIVO_CLASSIFICACAO,
  TERMOS_LABORATORIO_RESUMO,
  TERMOS_VISITA,
  termosLaboratorio,
  type TipoAtendimentoOs,
} from "@/lib/os/termosOs";

interface TermosOsViewProps {
  tipo: TipoAtendimentoOs;
  protocolo: string;
}

/**
 * Exibição clean dos termos da O.S. — todos os itens visíveis e legíveis,
 * sem colapsar conteúdo jurídico.
 */
export function TermosOsView({ tipo, protocolo }: TermosOsViewProps) {
  return (
    <section className="mt-8 space-y-6" data-testid="os-termos" data-tipo={tipo}>
      <p className="text-sm leading-relaxed text-muted-foreground">{MOTIVO_CLASSIFICACAO[tipo]}</p>

      {tipo === "visita" ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">{TERMOS_VISITA.titulo}</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {TERMOS_VISITA.escopo.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ▸
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-5 sm:p-6">
            <h3 className="font-heading text-base font-semibold text-foreground">Estacionamento</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{TERMOS_VISITA.estacionamento}</p>
          </div>

          <div className="rounded-xl border-2 border-accent/60 bg-accent/5 p-5 sm:p-6">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Regras de segurança durante o atendimento
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/90">
              {TERMOS_VISITA.seguranca.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ▸
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {TERMOS_LABORATORIO_RESUMO.titulo}
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {TERMOS_LABORATORIO_RESUMO.itens.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ▸
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border-2 border-accent/60 bg-accent/5 p-5 sm:p-6">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Termos completos do reparo em laboratório
            </h3>
            <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground/90">
              {termosLaboratorio(protocolo)}
            </pre>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Os dados de pagamento são enviados apenas no atendimento privado por WhatsApp.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
