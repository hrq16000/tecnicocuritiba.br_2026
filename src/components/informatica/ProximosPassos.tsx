import { Link } from "@/lib/router-compat";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProximosPassosProps {
  waHref: string;
  onCta?: () => void;
  ctaLocation?: string;
  passos?: string[];
  atalhos?: { to: string; label: string }[];
}

const PASSOS_PADRAO = [
  "Reúna as informações da triagem: sintoma, quando começou e o que mudou antes (atualização, queda de energia, líquido, instalação recente).",
  "Envie essa descrição pelo WhatsApp. A triagem indica a família provável da falha e a modalidade de atendimento (remoto, domicílio ou bancada).",
  "Você recebe o que foi encontrado, o que será feito e o valor antes da execução. Nada é executado sem a sua aprovação.",
];

const ATALHOS_PADRAO = [
  { to: "/como-funciona", label: "Como funciona o atendimento" },
  { to: "/precos-e-politicas", label: "Preços e políticas" },
  { to: "/guia-tecnico-informatica", label: "Guia técnico de informática" },
];

export const ProximosPassos = ({
  waHref,
  onCta,
  ctaLocation = "proximos_passos",
  passos = PASSOS_PADRAO,
  atalhos = ATALHOS_PADRAO,
}: ProximosPassosProps) => (
  <section id="proximos-passos" className="scroll-mt-24 mb-12">
    <h2 className="mb-4 text-2xl font-bold text-foreground">Próximos passos</h2>
    <ol className="mb-6 space-y-4">
      {passos.map((passo, i) => (
        <li key={passo} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
            {i + 1}
          </span>
          <span className="text-sm text-muted-foreground">{passo}</span>
        </li>
      ))}
    </ol>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Button asChild size="lg" className="min-h-14">
        <a href={waHref} onClick={onCta} data-cta-location={ctaLocation}>
          <MessageCircle className="mr-2 h-5 w-5" /> Descrever meu caso agora
        </a>
      </Button>
      <div className="flex flex-wrap gap-3">
        {atalhos.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            {a.label} <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </div>
  </section>
);
