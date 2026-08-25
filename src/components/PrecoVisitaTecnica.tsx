import { Link } from "@/lib/router-compat";
import { Truck, ArrowRight, MessageCircle } from "lucide-react";
import {
  COLETA_TAXA_MINIMA_LABEL,
  VISITA_MINIMA_LABEL,
  PRAZOS,
  REGRA_ESTIMATIVA_GRATIS,
  isColetaCategory,
  CATEGORIAS_COLETA_SLUGS,
} from "@/lib/coletaConfig";

interface PrecoVisitaTecnicaProps {
  tipo: "padrao" | "coleta";
  className?: string;
  showLink?: boolean;
  compact?: boolean;
}

export const PrecoVisitaTecnica = ({ tipo, className = "", showLink = true, compact = false }: PrecoVisitaTecnicaProps) => {
  if (tipo === "coleta") {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-accent flex-shrink-0" />
          <span className={`${compact ? "text-sm" : "text-base"} text-foreground font-medium`}>
            Sem visita técnica. Coleta e entrega inclusa — taxa mínima <span className="text-accent font-bold">{COLETA_TAXA_MINIMA_LABEL}</span> pré-aprovada.
          </span>
        </div>
        <div className={`ml-6 mt-1.5 space-y-1 ${compact ? "text-xs" : "text-sm"}`}>
          <p className="text-muted-foreground flex items-center gap-1.5">
            <MessageCircle className="h-3 w-3 text-accent flex-shrink-0" />
            {REGRA_ESTIMATIVA_GRATIS}. Valor preciso após coleta.
          </p>
          {PRAZOS.map((p, i) => (
            <p key={i} className="text-muted-foreground">
              {i === 0 ? "📱" : "📺"} {p.equipamentos}: <strong className="text-foreground">{p.prazo}</strong>
            </p>
          ))}
        </div>
        {showLink && (
          <Link to="/coleta-e-entrega" className="text-accent text-sm hover:underline inline-flex items-center gap-1 mt-2 ml-6">
            Ver detalhes <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <span className={`${compact ? "text-sm" : "text-base"} text-foreground font-medium`}>
        Visita técnica a partir de <span className="text-accent font-bold">{VISITA_MINIMA_LABEL}</span>
      </span>
      <p className={`${compact ? "text-xs" : "text-sm"} text-muted-foreground mt-0.5`}>
        {REGRA_ESTIMATIVA_GRATIS}. Diagnóstico presencial é pago.
      </p>
      {showLink && (
        <Link to="/valores" className="text-accent text-sm hover:underline inline-flex items-center gap-1 mt-1">
          Ver tabela de valores <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
};

// Re-export for backward compatibility
export { isColetaCategory, CATEGORIAS_COLETA_SLUGS as CATEGORIAS_COLETA };
