import { Link } from "@/lib/router-compat";
import { DollarSign, Check, ArrowRight, Sparkles, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const precos = [
  { servico: "Atendimento Flash (15min)", valor: "A partir de R$ 99,99" },
  { servico: "Visita Técnica (30min)", valor: "A partir de R$ 99,99" },
  { servico: "Formatação Completa (1h)", valor: "A partir de R$ 168,99" },
  { servico: "Remoção de Vírus", valor: "A partir de R$ 99,99" },
  { servico: "Suporte Remoto", valor: "A partir de R$ 99,99" },
  { servico: "Hora Técnica Remota", valor: "A partir de R$ 79/hora" },
];

export const HomePricingBlock = () => {
  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden spotlight-sweep mesh-gradient-warm">
      <div className="absolute -top-20 right-0 w-[350px] h-[350px] rounded-full bg-accent/[0.03] blur-[100px] pointer-events-none orb-float" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-primary/[0.04] morph-blob pointer-events-none blur-[80px]" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-accent/10 rounded-full p-3 w-fit mx-auto mb-3 shimmer">
              <DollarSign className="h-7 w-7 text-accent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3 reveal-text neon-accent">
              Preços <span className="gradient-text">Transparentes</span> e Sem Surpresas
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto reveal-text" data-reveal-delay="100">
              Valores claros desde o primeiro contato. Diagnóstico é pago — serviço só é executado com sua aprovação.
            </p>
            <div className="glow-separator max-w-xs mx-auto mt-5" />
          </div>

          {/* Top row: 3 columns on desktop, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {precos.slice(0, 3).map((p, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center text-center glass-card gradient-border rounded-xl p-5 hover:shadow-[var(--shadow-md)] hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-300 group card-shine hover-streak slide-up-stagger"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="bg-accent/10 rounded-full p-1.5 mb-2 group-hover:bg-accent/20 transition-colors duration-300 relative">
                  <Check className="h-4 w-4 text-accent group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-full bg-accent/20 blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                <span className="text-sm font-medium text-foreground mb-1">{p.servico}</span>
                <span className="text-base font-bold text-accent">{p.valor}</span>
              </div>
            ))}
          </div>
          {/* Bottom row: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {precos.slice(3).map((p, i) => (
              <div 
                key={i + 3} 
                className="flex items-center justify-between glass-card gradient-border rounded-xl p-4 hover:shadow-[var(--shadow-md)] hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-300 group card-shine hover-streak slide-up-stagger"
                style={{ animationDelay: `${(i + 3) * 70}ms` }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="bg-accent/10 rounded-full p-1 group-hover:bg-accent/20 transition-colors duration-300 relative">
                    <Check className="h-4 w-4 text-accent flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-full bg-accent/20 blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{p.servico}</span>
                </div>
                <span className="text-sm font-bold text-accent whitespace-nowrap ml-2">{p.valor}</span>
              </div>
            ))}
          </div>

          {/* Custo mínimo por região */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-3 hover:border-primary/25 transition-colors duration-300 hover-streak">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <Clock className="h-4 w-4 text-primary" />
              <strong className="text-sm text-foreground">Valor mínimo por região e horário</strong>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              O custo do atendimento inclui deslocamento. Regiões mais distantes e horários de pico podem ter acréscimo.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { regiao: "São José dos Pinhais", min: "R$ 99,99" },
                { regiao: "Curitiba Centro", min: "R$ 99,99" },
                { regiao: "Pinhais / Colombo", min: "R$ 99,99" },
                { regiao: "Araucária", min: "R$ 99,99" },
                { regiao: "Fazenda Rio Grande", min: "R$ 109,99" },
                { regiao: "Campo Largo", min: "R$ 119,99" },
              ].map((r, i) => (
                <div key={i} className="bg-background/80 rounded-lg p-2.5 text-center border border-border/50">
                  <span className="text-xs text-muted-foreground block mb-0.5">{r.regiao}</span>
                  <span className="text-sm font-bold text-accent">{r.min}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              <Link to="/valores" className="text-accent hover:underline font-medium">Ver tabela completa por região →</Link>
            </p>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-center mb-6 hover:border-accent/30 transition-colors duration-300 hover-streak">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-accent flex-shrink-0" />
              <span>
                <strong className="text-foreground">Importante:</strong> atendimento sem compromisso somente estimado via WhatsApp. 
                valor preciso somente com compromisso. Para celular, TV, placa e ferramentas: Valor do atendimento somente após coleta (taxa mínima R$ 300).
              </span>
            </p>
          </div>

          <div className="text-center">
            <Button variant="cta" size="lg" className="hover:scale-[1.03] hover:shadow-[var(--shadow-accent)] transition-all duration-300 elastic-click hover-streak" asChild>
              <Link to="/valores">
                Ver Tabela Completa de Valores
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
