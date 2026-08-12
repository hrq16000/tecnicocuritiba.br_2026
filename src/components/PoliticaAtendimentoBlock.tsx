import { AlertTriangle, Clock, PackageCheck, Truck } from "lucide-react";
import {
  GATILHO_COLETA_SEM_CUSTO,
  NOTA_VISITA_AVULSA,
  QUANDO_VISITA_COMPATIVEL,
  REGRA_CANCELAMENTO,
  REGRA_SEM_BALCAO,
  VALOR_COLETA_MINIMO_LABEL,
} from "@/lib/precosConfig";
import { Link } from "react-router-dom";

/**
 * Bloco padronizado de política de atendimento (fonte única em precosConfig).
 *
 * Usado nas páginas de atendimento para deixar explícito, sempre com o mesmo
 * texto: não há balcão ao público, a visita é de inspeção sem compromisso por
 * janela de até 30 minutos e a coleta sem custo entra quando o serviço passa
 * de 1 hora, com mínimo pré-aprovado.
 */
export const PoliticaAtendimentoBlock = ({
  variant = "default",
}: {
  /** "domicilio" destaca a visita; "coleta" destaca a bancada. */
  variant?: "default" | "domicilio" | "coleta";
}) => {
  const cards = [
    {
      icon: Truck,
      title: "Coleta e entrega no seu endereço",
      text: REGRA_SEM_BALCAO,
    },
    {
      icon: Clock,
      title: "Visita técnica sem compromisso",
      text: `${NOTA_VISITA_AVULSA} ${QUANDO_VISITA_COMPATIVEL}`,
    },
    {
      icon: PackageCheck,
      title: `Coleta sem custo · mínimo ${VALOR_COLETA_MINIMO_LABEL}`,
      text: GATILHO_COLETA_SEM_CUSTO,
    },
    {
      icon: AlertTriangle,
      title: "Cancelamento",
      text: REGRA_CANCELAMENTO,
    },
  ];

  const ordered =
    variant === "coleta" ? [cards[0], cards[2], cards[1], cards[3]] : cards;

  return (
    <section className="py-12 bg-muted/30" aria-labelledby="politica-atendimento-titulo">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2
            id="politica-atendimento-titulo"
            className="text-xl md:text-2xl font-heading font-bold text-primary mb-2"
          >
            Como funciona o atendimento na prática
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            As mesmas regras valem para todos os serviços — sem letra miúda e sem surpresa no fim.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {ordered.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-4">
                <h3 className="flex items-center gap-2 font-semibold text-primary mb-1 text-sm">
                  <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Peças, componentes e licenças não estão inclusos. Detalhamento completo em{" "}
            <Link to="/precos-e-politicas" className="text-accent hover:underline">
              preços e políticas
            </Link>{" "}
            e nos{" "}
            <Link to="/termos-e-condicoes" className="text-accent hover:underline">
              termos e condições
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default PoliticaAtendimentoBlock;
