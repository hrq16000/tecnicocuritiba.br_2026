import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingParticles } from "@/components/FloatingParticles";
import { trackCTAClick } from "@/lib/analytics";
import type { HeroImageSet } from "@/pages/arrumar-pc/cityImages";
import { LicensedPhotoCaption } from "@/components/LicensedPhotoCaption";

const WHATSAPP_NUMBER = "5541997086380";
const WHATSAPP_MESSAGE = "Olá! Preciso de suporte técnico.";

interface PageHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  /** Mensagem contextual usada no link do WhatsApp (default: genérica). */
  whatsappMessage?: string;
  /**
   * Hero image. Accepts either a simple string URL (legacy) or a responsive
   * HeroImageSet with srcset variants for better LCP performance.
   */
  heroImage?: string | HeroImageSet;
  heroImageAlt?: string;
}

export const PageHero = ({ title, subtitle, ctaText = "Chame no WhatsApp", whatsappMessage = WHATSAPP_MESSAGE, heroImage, heroImageAlt }: PageHeroProps) => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleWhatsAppClick = () => {
    trackCTAClick('whatsapp', 'page_hero');
  };

  const heroSet: HeroImageSet | undefined =
    typeof heroImage === "object" && heroImage !== null ? heroImage : undefined;
  const heroSrc: string | undefined =
    typeof heroImage === "string" ? heroImage : heroSet?.src;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 premium-gradient" />
      <FloatingParticles count={20} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.07] blur-[120px] animate-breathe" />
        <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[100px] animate-breathe" style={{ animationDelay: "2.5s" }} />
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
      
      <div className="container mx-auto relative z-10 pt-14 pb-20 md:pt-20 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="glow-separator max-w-[160px] mx-auto mb-8" />
          
          <Button
            variant="heroWhatsapp"
            size="lg"
            className="text-base md:text-lg px-8 shadow-[0_0_30px_rgba(37,211,102,0.25)] hover:shadow-[0_0_40px_rgba(37,211,102,0.4)] hover:scale-[1.03] transition-all duration-300 elastic-click"
            asChild
            onClick={handleWhatsAppClick}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              {ctaText}
            </a>
          </Button>

          {heroSrc && (
            <figure className="mt-10 md:mt-12 max-w-3xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
                <picture>
                  {heroSet?.webpSrcset && (
                    <source
                      type="image/webp"
                      srcSet={heroSet.webpSrcset}
                      sizes={heroSet.sizes}
                    />
                  )}
                  {heroSet?.jpgSrcset && (
                    <source
                      type="image/jpeg"
                      srcSet={heroSet.jpgSrcset}
                      sizes={heroSet.sizes}
                    />
                  )}
                  <img
                    src={heroSrc}
                    alt={heroImageAlt ?? title}
                    width={heroSet?.width ?? 1536}
                    height={heroSet?.height ?? 768}
                    loading="eager"
                    decoding="async"
                    className="w-full h-auto block"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <LicensedPhotoCaption src={heroSrc} className="mt-2 text-center text-xs text-white/90" />
            </figure>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
};
