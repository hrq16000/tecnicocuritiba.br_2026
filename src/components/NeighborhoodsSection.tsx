import { Link } from "@/lib/router-compat";
import { MapPin } from "lucide-react";
import { bairroPathPorNome } from "@/lib/bairroLinks";

/**
 * Bairros exibidos na home. A existência de página é resolvida em
 * `bairroPathPorNome` a partir de `src/lib/bairrosData.ts` — a lista aqui é só
 * de exibição, então nenhum bairro publicado fica sem link de entrada.
 */
const neighborhoods = [
  "Centro",
  "Batel",
  "Água Verde",
  "Portão",
  "Bigorrilho",
  "Mercês",
  "Campina do Siqueira",
  "Santa Felicidade",
  "Boa Vista",
  "Juvevê",
  "Alto da XV",
  "Cabral",
  "Cristo Rei",
  "Jardim das Américas",
  "Cajuru",
  "Uberaba",
  "Pinheirinho",
  "Xaxim",
  "Boqueirão",
  "Hauer",
  "Bacacheri",
  "Rebouças",
  "Novo Mundo",
  "Capão Raso",
  "Sítio Cercado",
  "Fazendinha",
  "Seminário",
  "Juvevê",
  "Campo Comprido",
  "CIC",
].filter((nome, i, arr) => arr.indexOf(nome) === i);


export const NeighborhoodsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/30 relative overflow-hidden spotlight-sweep mesh-gradient-warm">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.02] blur-[100px] pointer-events-none liquid-blob" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/[0.03] rounded-full blur-[80px] pointer-events-none orb-float-reverse" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3 reveal-text">
            Atendimento em Toda <span className="gradient-text">Curitiba</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
            Técnico de informática com atendimento presencial nos principais bairros de Curitiba e região metropolitana.
          </p>
          <div className="glow-separator max-w-xs mx-auto mt-5" />
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
          {neighborhoods.map((nome, index) => {
            const to = bairroPathPorNome(nome);
            return to ? (
              <Link
                key={nome}
                to={to}
                aria-label={`Técnico de informática em ${nome}, Curitiba`}
                className="flex items-center gap-1.5 bg-background px-3.5 py-2 rounded-full text-sm border border-primary/10 hover:border-accent hover:bg-accent/5 hover:scale-110 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] transition-all duration-300 group elastic-click slide-up-stagger"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <MapPin className="h-3.5 w-3.5 text-accent group-hover:scale-110 transition-transform duration-300" />
                <span className="text-foreground/80 group-hover:text-accent font-medium transition-colors">{nome}</span>
              </Link>
            ) : (
              <div
                key={nome}
                className="flex items-center gap-1.5 bg-background px-3.5 py-2 rounded-full text-sm border border-primary/10 hover:border-primary/30 hover:bg-accent/5 hover:scale-105 transition-all duration-300 slide-up-stagger"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <MapPin className="h-3.5 w-3.5 text-accent/60" />
                <span className="text-foreground/70">{nome}</span>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/tecnico-informatica-curitiba" 
            className="inline-flex items-center gap-2 text-accent hover:gap-3 font-semibold transition-all duration-200 underline-grow gradient-text-hover"
          >
            Ver todos os bairros atendidos em Curitiba
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          E mais bairros em Curitiba e região metropolitana • Consulte disponibilidade
        </p>
      </div>
    </section>
  );
};
