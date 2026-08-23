import { lazy, Suspense, useState } from "react";
import { MessageCircle, MapPin, Clock, Shield, Star, CheckCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/analytics";
import { TechnicianAvailabilityInline } from "@/components/TechnicianAvailability";
const SchedulingModal = lazy(() => import("@/components/scheduling/SchedulingModal").then((m) => ({ default: m.SchedulingModal })));

const WHATSAPP_NUMBER = "5541997086380";
const WHATSAPP_MESSAGE = "Olá! Preciso de suporte técnico.";

const trustSignals = [
  { icon: Clock, text: "Atendimento conforme a agenda" },
  { icon: Shield, text: "Garantia em todos os serviços" },
  { icon: MapPin, text: "A domicílio ou remoto" },
];

export const HeroSection = () => {
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  
  const openChatbot = () => {
    trackCTAClick('chatbot', 'hero');
    window.dispatchEvent(new CustomEvent('openChatbot'));
  };

  return (
    <>
    {isSchedulingOpen && (
      <Suspense fallback={null}>
        <SchedulingModal isOpen={isSchedulingOpen} onClose={() => setIsSchedulingOpen(false)} />
      </Suspense>
    )}
    <section className="hero-gradient hero-gradient--lcp pt-8 pb-14 sm:pt-10 md:pt-12 md:pb-18 lg:pt-14 lg:pb-24 relative overflow-hidden noise-overlay" aria-label="Técnico de informática em Curitiba">
      {/* Lightweight critical background: no extra image request before first interaction */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[hsl(var(--hero-bg))] to-[hsl(var(--hero-bg-end))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.16),transparent_45%),radial-gradient(ellipse_at_bottom_left,hsl(var(--primary-foreground)/0.08),transparent_50%)]" />
      </div>
      
      {/* Parallax ambient lights */}
      <div data-parallax="0.08" className="absolute top-0 right-0 h-80 w-80 rounded-full bg-accent/[0.06] blur-[96px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Premium badge */}
            <div
              className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.1] rounded-full px-4 py-2 mb-5 shimmer opacity-0 animate-[heroFadeIn_0.6s_ease-out_0.1s_forwards]"
            >
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                +20 anos atendendo Curitiba e região
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-bold text-white leading-[1.15] mb-5 md:mb-6 tracking-tight motion-safe:opacity-0 motion-safe:animate-[heroFadeUp_0.7s_ease-out_0.2s_forwards]">
              Técnico de Informática
              <br />
              <span className="text-accent drop-shadow-xs">em Curitiba</span>
              <span className="block text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 mt-2 tracking-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] min-h-[1.5em] break-words">
                e Região Metropolitana
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/95 mb-5 leading-relaxed max-w-xl mx-auto lg:mx-0 motion-safe:opacity-0 motion-safe:animate-[heroFadeUp_0.6s_ease-out_0.35s_forwards] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              <strong className="text-white">Conserto de computadores e notebooks</strong> com atendimento 
              <strong className="text-white"> a domicílio</strong> conforme a disponibilidade da agenda. Formatação, remoção de vírus, 
              upgrade SSD e mais.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-6 opacity-0 animate-[heroFadeUp_0.5s_ease-out_0.45s_forwards]">
              {trustSignals.map((signal, index) => (
                <div key={index} className="flex items-center gap-1.5 bg-white/[0.07] backdrop-blur-xs border border-white/[0.08] rounded-full px-3 py-1.5 hover:bg-white/[0.12] hover:border-white/[0.15] transition-all duration-300 hover:scale-105">
                  <signal.icon className="h-3.5 w-3.5 text-accent" />
                  <span className="text-white/95 text-[13px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">{signal.text}</span>
                </div>
              ))}
            </div>

            {/* Areas served */}
            <p className="text-white/80 text-sm mb-7 opacity-0 animate-[heroFadeIn_0.5s_ease-out_0.55s_forwards] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
              <MapPin className="inline h-3.5 w-3.5 mr-1 relative -top-px" />
              Atendemos: <strong className="text-white/95">Curitiba</strong>, <strong className="text-white/95">São José dos Pinhais</strong>, <strong className="text-white/95">Araucária</strong>, <strong className="text-white/95">Campo Largo</strong> e <strong className="text-white/95">Pinhais</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start opacity-0 animate-[heroFadeUp_0.5s_ease-out_0.6s_forwards]">
              <Button variant="heroWhatsapp" className="animate-pulse-soft hover-glow-cta ripple-container shadow-lg hover:scale-[1.03] transition-transform" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chamar técnico no WhatsApp">
                  <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                  Chamar Técnico Agora
                </a>
              </Button>
              
              <Button variant="heroCta" className="ripple-container hover-glow-cta shadow-lg hover:scale-[1.03] transition-transform" onClick={() => setIsSchedulingOpen(true)} aria-label="Agendar atendimento técnico online">
                <CalendarDays className="h-5 w-5 md:h-6 md:w-6" />
                Agendar Atendimento
              </Button>
            </div>

            <div className="mt-5 opacity-0 animate-[heroFadeIn_0.5s_ease-out_0.7s_forwards]">
              <TechnicianAvailabilityInline />
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 mt-3 text-white/80 text-sm opacity-0 animate-[heroFadeIn_0.5s_ease-out_0.8s_forwards] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
              <CheckCircle className="h-3.5 w-3.5 text-trust" />
              <span>Resposta em até 5 minutos • atendimento sem compromisso</span>
            </div>
          </div>
          
          {/* Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2 opacity-0 animate-[heroScale_0.7s_ease-out_0.15s_forwards]">
            <div className="relative group">
              {/* Soft glow behind image */}
              <div className="absolute -inset-4 bg-accent/[0.08] rounded-3xl blur-2xl group-hover:bg-accent/[0.14] transition-all duration-700 pointer-events-none" />
              <img 
                alt="Técnico de informática profissional realizando conserto de computador em Curitiba" 
                className="relative w-64 sm:w-80 md:w-96 lg:w-auto lg:max-w-md rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]" 
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                width="400"
                height="400"
                src="/lovable-uploads/77ec0b6a-9ce8-4e20-b893-7eff7ec03859-480.webp"
                srcSet="/lovable-uploads/77ec0b6a-9ce8-4e20-b893-7eff7ec03859-240.webp 240w, /lovable-uploads/77ec0b6a-9ce8-4e20-b893-7eff7ec03859-360.webp 360w, /lovable-uploads/77ec0b6a-9ce8-4e20-b893-7eff7ec03859-480.webp 480w, /lovable-uploads/77ec0b6a-9ce8-4e20-b893-7eff7ec03859-800.webp 800w, /lovable-uploads/77ec0b6a-9ce8-4e20-b893-7eff7ec03859.webp 1024w"
                sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, (max-width: 1024px) 384px, 448px"
              />
              <div className="absolute -bottom-3 -right-3 bg-accent text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg animate-bounce-subtle">
                ✓ Atendimento Imediato
              </div>
              <div className="absolute -top-3 -left-3 bg-card text-foreground px-3 py-2 rounded-lg shadow-lg flex items-center gap-1">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="font-bold text-sm">Atendimento local</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};
