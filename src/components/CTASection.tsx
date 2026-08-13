import { MessageCircle, Bot, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "5541997086380";
const WHATSAPP_MESSAGE = "Olá! Preciso de suporte técnico.";

export const CTASection = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  
  const openChatbot = () => {
    trackCTAClick('chatbot', 'final_cta');
    window.dispatchEvent(new CustomEvent('openChatbot'));
  };

  return (
    <section className="py-10 md:py-14 bg-muted relative overflow-hidden transition-all duration-500 section-divider group/cta spotlight-sweep noise-overlay">
      {/* Morphing blob backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/[0.05] morph-blob pointer-events-none blur-[80px]" />
      <div data-parallax="0.15" className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[100px] pointer-events-none orb-float" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-[80px] pointer-events-none orb-float-reverse" />

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-6 shimmer-sweep float-badge">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Atendimento Imediato</span>
          </div>
          
          <img decoding="async" 
            alt="Técnico Curitiba" 
            className="h-16 md:h-20 mx-auto mb-7 hover:scale-105 transition-transform duration-300" 
            src="/lovable-uploads/b702f033-fd78-4d1e-ae32-2ad60f672710.webp"
            width="200"
            height="80"
            loading="lazy"
          />
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 tracking-tight reveal-text neon-accent">
            Precisa resolver agora?
          </h2>
          
          <p className="text-lg md:text-xl text-accent font-semibold mb-4 reveal-text" data-reveal-delay="100">
            Fale direto com o técnico. Sem call center. Sem enrolação.
          </p>

          {/* Urgency indicator */}
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-9">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-trust opacity-75 pulse-dot" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-trust" />
            </span>
            <Zap className="h-3.5 w-3.5 text-trust" />
            <span>Técnicos disponíveis agora</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="heroWhatsapp" className="animate-pulse-soft ripple-container shadow-lg hover:shadow-xl hover:scale-[1.05] transition-all duration-300 btn-feedback ring-pulse elastic-click hover-streak" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" data-cta-location="final_cta" data-wa-source="whatsapp_cta" onClick={() => trackCTAClick('whatsapp', 'final_cta')}>
                <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                WhatsApp Imediato
              </a>
            </Button>
            
            <Button variant="heroCta" className="ripple-container shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 btn-feedback elastic-click hover-streak" onClick={openChatbot}>
              <Bot className="h-5 w-5 md:h-6 md:w-6" />
              Atendimento Rápido
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
