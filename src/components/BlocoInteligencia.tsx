import { Link } from "react-router-dom";
import { IMAGES } from "@/lib/images";
import { 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  TrendingDown, 
  Wrench,
  CircleDollarSign
} from "lucide-react";

interface BlocoInteligenciaProps {
  /** Compact mode hides some sections for smaller pages */
  compact?: boolean;
}

export const BlocoInteligencia = ({ compact = false }: BlocoInteligenciaProps) => {
  return (
    <section className="py-12 bg-muted/30" aria-label="Informações importantes sobre diagnóstico e serviço técnico">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Imagem de destaque */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg max-w-3xl mx-auto">
          <img decoding="async" 
            src={IMAGES.bancadaTecnica} 
            alt={IMAGES.bancadaTecnicaAlt}
            className="w-full h-40 md:h-56 object-cover"
            loading="lazy"
            width="800"
            height="300"
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
          🧠 O Que Você Precisa Saber Antes de Contratar um Técnico
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Diagnóstico vs Execução */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Search className="w-6 h-6 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-lg text-foreground">Diagnóstico ≠ Execução</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              O <strong>diagnóstico</strong> identifica a causa real do problema. A <strong>execução</strong> é o reparo em si. 
              São etapas separadas. Sem diagnóstico correto, qualquer reparo é um tiro no escuro — e pode piorar o problema.
            </p>
          </div>

          {/* Card 2: Por que diagnóstico é pago */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <CircleDollarSign className="w-6 h-6 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-lg text-foreground">Por Que o Diagnóstico Tem Custo?</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Envolve <strong>tempo técnico</strong>, ferramentas especializadas e conhecimento acumulado. 
              O valor é abatido do reparo quando aprovado. 
              "atendimento sem compromisso" geralmente significa diagnóstico superficial — e risco de trocar peças erradas.
            </p>
          </div>

          {/* Card 3: Problemas simples viram complexos */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
              <h3 className="font-semibold text-lg text-foreground">Problemas Simples Viram Complexos</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Um PC lento pode ser apenas poeira. Mas também pode ser <strong>capacitor estufado</strong>, 
              pasta térmica ressecada causando throttling, ou SSD em falha silenciosa. 
              Ignorar sinais transforma reparo de R$100 em prejuízo de R$800+.
            </p>
          </div>

          {/* Card 4: Riscos de uso inadequado */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-lg text-foreground">Risco de Danos por Uso Inadequado</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Instalar peças incompatíveis, usar ferramentas improvisadas (chave de fenda errada, faca) 
              ou favaliar o valor conectores causa <strong>curto-circuito e danos irreversíveis</strong>. 
              Já recebemos placas destruídas por upgrades mal feitos.
            </p>
          </div>
        </div>

        {!compact && (
          <div className="bg-card rounded-xl p-6 border-2 border-primary/20 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <TrendingDown className="w-6 h-6 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-lg text-foreground">Quando Compensa Reparar vs Trocar?</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              <strong>Regra dos 40%:</strong> Se o reparo custa mais que 40% do valor de um equipamento novo equivalente, 
              geralmente não compensa. Equipamentos com mais de 8 anos ou múltiplos defeitos acumulados 
              tendem a não valer o investimento. O técnico sempre orienta com honestidade.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/quando-nao-compensa" 
                className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
              >
                <Wrench className="w-4 h-4" /> Guia: quando não compensa reparar →
              </Link>
              <Link 
                to="/diagnostico-tecnico" 
                className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
              >
                <Search className="w-4 h-4" /> Entenda o diagnóstico profissional →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
