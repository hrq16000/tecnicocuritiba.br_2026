import { 
  MapPin, UserCheck, FileText, Receipt, CreditCard, Shield
} from "lucide-react";
import { FloatingParticles } from "@/components/FloatingParticles";
import { siteConfig } from "@/lib/siteConfig";
import { GARANTIA, NOTA_FISCAL, experienciaLabelCurto } from "@/lib/politicaComercial";

const trustItems = [
  { icon: MapPin, title: "Atendimento Local", description: "Curitiba e região metropolitana" },
  { icon: UserCheck, title: "Técnico Identificado", description: "Atendimento com identificação" },
  { icon: FileText, title: "Garantia por Escrito", description: GARANTIA.servicoLabel },
  { icon: Receipt, title: "Nota Fiscal", description: NOTA_FISCAL.servicoLabel },
  { icon: CreditCard, title: "Pagamento Facilitado", description: "PIX, cartão, dinheiro e transferência" },
  { icon: Shield, title: "Sem Surpresas", description: "Valor antes de executar" },
];

/**
 * Dados verificáveis (não são métricas de marketing).
 * Proibido publicar nº de clientes, % de satisfação ou nota inventada.
 */
const dadosVerificaveis = [
  { valor: experienciaLabelCurto, label: "Atuação em informática" },
  { valor: "Curitiba", label: "Base de atendimento" },
  { valor: "PF e PJ", label: "Residencial e empresarial" },
];

export const TrustSection = () => {
  return (
    <section className="py-10 md:py-14 premium-gradient relative overflow-hidden noise-overlay">
      {/* Floating particles */}
      <FloatingParticles count={20} />
      {/* Morphing ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/[0.04] blur-[100px] pointer-events-none morph-blob" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/[0.03] blur-[80px] pointer-events-none orb-float" />

      <div className="container mx-auto relative z-10">
        {/* Dados verificáveis */}
        <div className="flex flex-wrap justify-center gap-10 md:gap-20 mb-12 md:mb-16">
          {dadosVerificaveis.map((item, i) => (
            <div key={i} className="text-center slide-up-stagger" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="text-xl md:text-3xl font-heading font-bold text-white tracking-tight">
                {item.valor}
              </div>
              <p className="text-white/80 text-sm mt-1.5 tracking-wide uppercase text-[11px] font-medium">{item.label}</p>
              {/* Glowing underline */}
              <div className="glow-separator mt-2 w-12 mx-auto" />
            </div>
          ))}
        </div>


        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-3 tracking-tight reveal-text">
            Por que escolher a gente?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
            Compromisso com qualidade e transparência
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="text-center bg-white/[0.06] backdrop-blur-xs border border-white/[0.08] rounded-xl p-4 md:p-5 hover:bg-white/[0.12] hover:border-white/[0.18] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.06] shimmer hover-streak slide-up-stagger group"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="inline-flex items-center justify-center bg-accent/90 rounded-xl p-2.5 mb-3 shadow-xs relative group-hover:shadow-[0_0_20px_hsl(var(--accent)/0.4)] transition-shadow duration-300">
                  <Icon className="h-5 w-5 md:h-5 md:w-5 text-white icon-bounce" />
                </div>
                <h3 className="font-heading font-bold text-white text-sm md:text-[15px] mb-1">
                  {item.title}
                </h3>
                <p className="text-white/55 text-xs md:text-[13px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
