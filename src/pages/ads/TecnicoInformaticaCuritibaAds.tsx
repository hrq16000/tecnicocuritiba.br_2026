import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, Shield, Clock, MapPin, ShieldCheck } from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";
const WHATSAPP_MESSAGE = "Olá! Vi o anúncio e preciso de um técnico de informática em Curitiba. Serviço: [DESCREVA O PROBLEMA]";

const TecnicoInformaticaCuritibaAds = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  useEffect(() => {
    document.title = "Técnico de Informática em Curitiba | Atendimento Hoje | R$ 99,99";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Técnico de informática em Curitiba com atendimento hoje. Serviços a partir de R$ 99,99. Formatação, remoção de vírus, conserto. Chame no WhatsApp!"
      );
    }
    trackPageView("/ads/tecnico-informatica-curitiba", "Landing Ads Curitiba");
  }, []);

  const handleWhatsAppClick = () => {
    trackCTAClick("whatsapp", "ads_landing_hero");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title="Técnico de Informática em Curitiba | Atendimento Hoje | R$ 99,99" description="Técnico de informática em Curitiba com atendimento hoje. Serviços a partir de R$ 99,99. Formatação, remoção de vírus, conserto. Chame no WhatsApp!" path="/tecnico-informatica-curitiba-ads" />
      {/* Minimal Header - No Navigation */}
      <header className="bg-primary py-4">
        <div className="container mx-auto text-center">
          <img loading="eager" fetchPriority="high" decoding="async"
            alt="Técnico Curitiba"
            src="/logo.webp"
            className="h-12 mx-auto"
          />
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-gradient py-16 md:py-24">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm mb-6">
                <ShieldCheck className="h-4 w-4 text-white" />
                Atendimento local e direto em Curitiba
              </div>


              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-6">
                Técnico de Informática em Curitiba
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Atendimento <strong>Hoje Mesmo</strong> • A Partir de <strong className="text-accent">R$ 99,99</strong>
              </p>

              <Button
                variant="heroWhatsapp"
                size="lg"
                className="text-lg md:text-xl px-10 py-6 h-auto animate-pulse"
                asChild
                onClick={handleWhatsAppClick}
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-6 w-6" />
                  Chamar Técnico Agora
                </a>
              </Button>

              <p className="text-white/70 text-sm mt-4">
                Resposta em menos de 5 minutos
              </p>
            </div>
          </div>
        </section>

        {/* Trust Bullets */}
        <section className="py-12 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Atendimento Rápido</h3>
                    <p className="text-sm text-muted-foreground">Visita agendada para hoje ou amanhã</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Garantia por Escrito</h3>
                    <p className="text-sm text-muted-foreground">Todos os serviços com garantia</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Atendimento Local</h3>
                    <p className="text-sm text-muted-foreground">Técnico vai até você em Curitiba</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-12 bg-background">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
                Serviços Que Resolvemos
              </h2>

              <div className="grid grid-cols-2 gap-4 text-left mb-8">
                {[
                  "Computador lento",
                  "Remoção de vírus",
                  "Formatação Windows",
                  "Upgrade SSD/Memória",
                  "Notebook não liga",
                  "Tela azul da morte",
                  "Backup de dados",
                  "Configuração Wi-Fi",
                ].map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{service}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="whatsapp"
                size="lg"
                className="text-lg px-8"
                asChild
                onClick={handleWhatsAppClick}
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Solicitar Atendimento
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Info */}
        <section className="py-8 bg-accent/10 border-y border-accent/20">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg text-foreground">
                💰 <strong>Serviços a partir de R$ 99,99</strong> (30 min de visita técnica)
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Pagamento após o serviço • Aceitamos PIX, cartão e dinheiro
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 hero-gradient">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Não Espere Seu Computador Piorar
              </h2>
              <p className="text-white/90 mb-8">
                Chame agora e resolva seu problema hoje mesmo
              </p>

              <Button
                variant="heroWhatsapp"
                size="lg"
                className="text-lg md:text-xl px-10 py-6 h-auto"
                asChild
                onClick={handleWhatsAppClick}
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-6 w-6" />
                  Chamar no WhatsApp
                </a>
              </Button>

              <div className="flex items-center justify-center gap-6 mt-8 text-white/80 text-sm">
                <span>✓ Sem compromisso</span>
                <span>✓ Resposta rápida</span>
                <span>✓ atendimento sem compromisso</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Técnico Curitiba • Assistência Técnica em Informática
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TecnicoInformaticaCuritibaAds;