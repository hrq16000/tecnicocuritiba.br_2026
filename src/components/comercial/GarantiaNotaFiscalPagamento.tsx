import { Link } from "@/lib/router-compat";
import { ShieldCheck, FileText, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { GARANTIA, NOTA_FISCAL, PAGAMENTO } from "@/lib/politicaComercial";

interface Props {
  className?: string;
  /** Título opcional (h2 por padrão). */
  heading?: string;
  compact?: boolean;
}

const COLUNAS = [
  {
    icon: ShieldCheck,
    titulo: "Garantia",
    itens: [GARANTIA.servicoLabel, GARANTIA.pecasLabel, GARANTIA.registroLabel],
  },
  {
    icon: FileText,
    titulo: "Nota fiscal",
    itens: [NOTA_FISCAL.servicoLabel, NOTA_FISCAL.pecaLabel, NOTA_FISCAL.ressalvaLabel],
  },
  {
    icon: CreditCard,
    titulo: "Pagamento",
    itens: [PAGAMENTO.momentoLabel, PAGAMENTO.aprovacaoLabel, PAGAMENTO.pecasLabel],
  },
];

/**
 * Bloco reutilizável de condições comerciais.
 * Fonte única: src/lib/politicaComercial.ts — nunca escrever valores/promessas aqui.
 */
export const GarantiaNotaFiscalPagamento = ({ className, heading, compact }: Props) => (
  <section className={cn("py-10 md:py-14 bg-secondary", className)} id="garantia-nota-pagamento">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center">
          {heading ?? "Garantia, nota fiscal e pagamento"}
        </h2>
        {!compact && (
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            As mesmas regras valem para atendimento remoto, em domicílio e para coleta e entrega. Nada é
            executado nem cobrado sem a sua aprovação prévia.
          </p>
        )}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {COLUNAS.map(({ icon: Icon, titulo, itens }) => (
            <div key={titulo} className="rounded-xl border border-border bg-background p-6">
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-[hsl(var(--accent))]" aria-hidden="true" />
                <h3 className="font-heading text-lg font-bold text-foreground">{titulo}</h3>
              </div>
              <ul className="space-y-2.5">
                {itens.map((t) => (
                  <li key={t} className="text-sm leading-relaxed text-muted-foreground">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Detalhes completos em{" "}
          <Link
            to="/precos-e-politicas#pagamento-e-nota-fiscal"
            className="font-semibold text-[hsl(var(--accent))] hover:underline"
          >
            preços e políticas
          </Link>
          .
        </p>
      </div>
    </div>
  </section>
);

export default GarantiaNotaFiscalPagamento;
