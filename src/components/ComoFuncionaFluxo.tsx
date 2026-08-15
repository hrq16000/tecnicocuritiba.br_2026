import { MessageCircle, Search, CheckCircle2, Wrench } from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";

const trackStep = (step: string) => {
  import("@/lib/analytics").then(({ trackCTAClick }) =>
    trackCTAClick("whatsapp", `como_funciona_${step}`),
  );
};

const steps = [
  {
    id: "contato",
    icon: MessageCircle,
    title: "1. Chame no WhatsApp",
    desc: "Conte o problema em uma mensagem. Você fala direto com o técnico, sem call center e sem espera.",
    msg: "Olá! Quero iniciar um atendimento. Pode me orientar?",
  },
  {
    id: "orientacao",
    icon: Search,
    title: "2. Orientação e diagnóstico",
    desc: "Recebe orientação inicial pelo WhatsApp. Quando necessário, agendamos diagnóstico no local ou por foto/vídeo.",
    msg: "Preciso de orientação técnica para entender o que está acontecendo no meu equipamento.",
  },
  {
    id: "aprovacao",
    icon: CheckCircle2,
    title: "3. Aprovação do valor do serviço",
    desc: "Você recebe o valor fechado por escrito. Só seguimos depois da sua aprovação — sem surpresa na conta.",
    msg: "Quero entender preço e prazo antes de aprovar o serviço.",
  },
  {
    id: "execucao",
    icon: Wrench,
    title: "4. Execução com garantia",
    desc: "Reparo realizado por técnico identificado, com 90 dias de garantia e cuidado com seus dados.",
    msg: "Quero contratar o serviço técnico agora.",
  },
] as const;

export const ComoFuncionaFluxo = () => {
  return (
    <section
      id="como-funciona-fluxo"
      aria-labelledby="como-funciona-fluxo-title"
      className="py-14 md:py-20 bg-background"
    >
      <div className="container mx-auto px-4">
        <header className="max-w-3xl mx-auto text-center mb-10">
          <h2
            id="como-funciona-fluxo-title"
            className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3"
          >
            Como funciona o atendimento
          </h2>
          <p className="text-muted-foreground">
            Fluxo transparente: WhatsApp → orientação → aprovação → execução.
            Você só paga depois de aprovar o valor do atendimento.
          </p>
        </header>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(s.msg)}`;
            return (
              <li
                key={s.id}
                className="relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mb-1.5 font-bold text-foreground">{s.title}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackStep(s.id)}
                  data-cta-location={`como_funciona_${s.id}`}
                  data-testid={`como-funciona-cta-${idx + 1}`}
                  aria-label={`WhatsApp Agora — ${s.title}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[hsl(var(--whatsapp))] px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-[hsl(var(--whatsapp-hover))]"
                >
                  <span aria-hidden="true">💬</span>
                  WhatsApp Agora
                </a>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Contato exclusivamente via WhatsApp para registro do histórico do
          atendimento e da garantia.
        </p>
      </div>
    </section>
  );
};

export default ComoFuncionaFluxo;
