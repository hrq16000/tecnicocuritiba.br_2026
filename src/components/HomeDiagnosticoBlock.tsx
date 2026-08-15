import { Link } from "@/lib/router-compat";
import { Search, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pontos = [
  {
    icon: Search,
    title: "Diagnóstico ≠ Execução",
    desc: "O diagnóstico identifica o problema. A execução do reparo só acontece com sua aprovação prévia.",
  },
  {
    icon: AlertTriangle,
    title: "Por Que o Diagnóstico é Pago",
    desc: "Envolve tempo, conhecimento técnico e ferramentas profissionais. Diagnosticar corretamente evita prejuízos maiores.",
  },
  {
    icon: ShieldCheck,
    title: "Risco de Não Diagnosticar",
    desc: "Problemas simples podem esconder falhas graves. Sem diagnóstico profissional, o risco de danos irreversíveis aumenta.",
  },
];

export const HomeDiagnosticoBlock = () => {
  return (
    <section className="py-12 md:py-16 bg-secondary relative overflow-hidden noise-overlay">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none orb-float" />
      <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-primary/4 rounded-full blur-3xl pointer-events-none orb-float-reverse" />
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3 reveal-text">
              Diagnóstico Técnico <span className="gradient-text">Profissional</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto reveal-text" data-reveal-delay="100">
              Entenda por que um diagnóstico correto é a etapa mais importante de qualquer reparo — e por que ele tem custo.
            </p>
            <div className="glow-separator max-w-xs mx-auto mt-5" />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {pontos.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="bg-background rounded-xl p-5 border border-transparent hover:border-accent/15 hover:shadow-[var(--shadow-lg)] hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 group card-shine hover-streak animated-border slide-up-stagger" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="bg-primary rounded-lg p-2 w-fit mb-3 group-hover:bg-accent group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative">
                    <Icon className="h-5 w-5 text-primary-foreground icon-bounce" />
                    <div className="absolute inset-0 rounded-lg bg-accent/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                  <h3 className="font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-200">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button variant="outline" className="hover:scale-[1.03] hover:shadow-[var(--shadow-md)] transition-all duration-300 group elastic-click hover-streak" asChild>
              <Link to="/como-funciona">
                Entender o Processo Completo
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
