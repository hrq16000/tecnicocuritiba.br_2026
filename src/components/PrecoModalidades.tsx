import { Link } from "@/lib/router-compat";
import { Home, Timer, Truck } from "lucide-react";
import {
  MODALIDADES,
  REGRA_CANCELAMENTO,
  QUANDO_VISITA_COMPATIVEL,
  REGRA_SEM_BALCAO,
  GATILHO_COLETA_SEM_CUSTO,
  TERMOS_URL,
} from "@/lib/precosConfig";

const icons = {
  "visita-avulsa": Home,
  "pacote-2h": Timer,
  "coleta-diagnostico": Truck,
} as const;

/**
 * Bloco canônico das 3 modalidades de atendimento e valores.
 * Consome exclusivamente src/lib/precosConfig.ts — não duplicar valores.
 */
export const PrecoModalidades = ({ className = "" }: { className?: string }) => (
  <section className={className} aria-labelledby="modalidades-atendimento">
    <h2 id="modalidades-atendimento" className="font-heading text-2xl font-bold text-foreground">
      Modalidades de atendimento e valores
    </h2>
    <p className="mt-2 text-sm text-muted-foreground">
      Três formatos, sem margem de erro sobre o que está incluso. Peças, componentes e licenças nunca estão inclusas.
    </p>

    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {MODALIDADES.map((m) => {
        const Icon = icons[m.id];
        return (
          <article key={m.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
            <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
            <h3 className="mt-3 font-heading text-base font-bold text-foreground">{m.titulo}</h3>
            <p className="mt-2 text-lg font-bold text-accent">{m.valorLabel}</p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.unidade}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.resumo}</p>
            <ul className="mt-3 flex-1 space-y-1.5 text-sm text-muted-foreground">
              {m.detalhes.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-accent" aria-hidden="true">▸</span>
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">Indicado quando:</strong> {m.indicadoQuando}
            </p>
          </article>
        );
      })}
    </div>

    <div className="mt-5 space-y-3 rounded-xl border border-accent/25 bg-accent/[0.05] p-5 text-sm text-muted-foreground">
      <p>
        <strong className="text-foreground">Coleta e entrega é o caminho da maioria dos casos.</strong>{" "}
        {QUANDO_VISITA_COMPATIVEL} {GATILHO_COLETA_SEM_CUSTO}
      </p>
      <p>
        <strong className="text-foreground">Logística:</strong> {REGRA_SEM_BALCAO}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        <strong className="text-foreground">Cancelamento:</strong> {REGRA_CANCELAMENTO}
      </p>
      <p>
        <Link to={TERMOS_URL} className="font-semibold text-accent underline underline-offset-2">
          Ver termos, condições, valores e prazos completos →
        </Link>
      </p>
    </div>
  </section>
);

export default PrecoModalidades;
