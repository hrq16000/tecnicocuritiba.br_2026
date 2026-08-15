import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Link } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import { RealImageSection } from "@/components/RealImageSection";
import { Button } from "@/components/ui/button";
import { trackPageView } from "@/lib/analytics";
import cftvHero from "@/assets/cftv-hero.jpg";
import {
  MessageCircle, Shield, Camera, Smartphone, Moon, HardDrive,
  CheckCircle2, Star, MapPin, Award, ArrowRight,
} from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";

interface CFTVCityPageProps {
  city: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  neighborhoods: string[];
  cityDescription: string;
  localStats: string;
  testimonial: { name: string; location: string; text: string };
}

const CFTVCityTemplate = ({ city, slug, metaTitle, metaDescription, neighborhoods, cityDescription, localStats, testimonial }: CFTVCityPageProps) => {
  const whatsappMessage = `Olá! Tenho interesse no Kit 4 Câmeras Intelbras com instalação em ${city}. Gostaria de mais informações.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    document.title = metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", metaDescription);
    trackPageView(`/cftv/${slug}`, `CFTV ${city}`);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={metaTitle} description={metaDescription} path={`/cftv/${slug}`} noindex breadcrumbs={[{ name: "Início", path: "/" }, { name: "CFTV", path: "/cftv" }, { name: city, path: `/cftv/${slug}` }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Instalação de Câmeras de Segurança em ${city}`,
        "provider": { "@type": "Organization", "name": "Mileuma Soluções / Mestre dos Serviços" },
        "areaServed": { "@type": "City", "name": city },
        "offers": { "@type": "Offer", "price": "1350.00", "priceCurrency": "BRL" }
      })}} />

      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-10 md:pt-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={cftvHero} alt={`Câmeras de segurança em ${city}`} className="w-full h-full object-cover" loading="eager" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
          </div>
          <div className="container mx-auto relative z-10 py-16 md:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-accent text-sm font-semibold">{city} e região</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-6">
                Câmeras de Segurança em <span className="text-accent">{city}</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl">
                Kit 4 Câmeras Intelbras com instalação profissional inclusa. Proteja seu imóvel em {city} por um investimento único.
              </p>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl md:text-5xl font-bold text-accent">R$ 1.350</span>
                <span className="text-white/70 text-lg">pacote completo</span>
              </div>
              <Button variant="heroWhatsapp" size="xl" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-6 w-6" />
                  Solicitar Instalação em {city}
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Local Info */}
        <section className="py-8 md:py-10 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6 text-center">
              Segurança Eletrônica em {city}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{cityDescription}</p>
            <p className="text-muted-foreground leading-relaxed mb-8">{localStats}</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Camera, title: "4 Câmeras HD Intelbras", desc: "Imagem nítida dia e noite" },
                { icon: Moon, title: "Visão Noturna IR", desc: "Até 30m no escuro total" },
                { icon: HardDrive, title: "DVR + HD Gravação", desc: "Armazena dias de gravação" },
                { icon: Smartphone, title: "Acesso pelo Celular", desc: "Monitore de qualquer lugar" },
                { icon: Shield, title: "Garantia 1 Ano", desc: "Equipamento e mão de obra" },
                { icon: CheckCircle2, title: "Sem Mensalidade", desc: "Pague uma vez, use sempre" },
              ].map((item, i) => (
                <div key={i} className="bg-background rounded-xl p-5 border border-primary/5">
                  <item.icon className="h-6 w-6 text-accent mb-3" />
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bairros */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6">
              Bairros Atendidos em {city}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {neighborhoods.map((b) => (
                <span key={b} className="bg-muted/50 border border-primary/10 rounded-full px-4 py-2 text-sm text-foreground">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-8 md:py-10 bg-muted/50">
          <div className="container mx-auto max-w-2xl">
            <div className="bg-background rounded-xl p-8 border border-primary/5 text-center">
              <div className="flex justify-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-accent text-accent" />)}
              </div>
              <p className="text-foreground/80 italic mb-4 leading-relaxed">"{testimonial.text}"</p>
              <p className="font-semibold text-foreground">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.location}</p>
            </div>
          </div>
        </section>

        {/* Authority */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto max-w-3xl">
            <div className="flex flex-col md:flex-row items-center gap-6 bg-primary/5 rounded-xl p-6 md:p-8 border border-primary/10">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-primary text-lg mb-2">Mestre dos Serviços — Desde 1998</h3>
                <p className="text-muted-foreground text-sm">
                  Mais de 25 anos protegendo patrimônios em {city} e região. Equipe especializada da Mileuma Soluções 
                  com instalação profissional, garantia real e suporte contínuo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Artigos Relacionados */}
        <section className="py-8 md:py-10 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-8 text-center">
              Artigos Sobre Segurança Eletrônica
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Câmera Wi-Fi ou DVR: Qual Escolher?", slug: "diferenca-camera-wifi-dvr-qual-escolher", desc: "Entenda as diferenças técnicas e descubra qual sistema é mais seguro." },
                { title: "Como Escolher o Melhor Kit de Câmeras", slug: "como-escolher-melhor-kit-cameras-seguranca", desc: "Guia completo com critérios técnicos para proteger seu imóvel." },
                { title: "Monitoramento 24 Horas: Como Funciona", slug: "monitoramento-24-horas-como-funciona", desc: "Saiba como funciona a gravação contínua e o acesso remoto pelo celular." },
              ].map((article) => (
                <Link key={article.slug} to={`/blog/${article.slug}`} className="bg-background rounded-xl p-5 border border-primary/5 hover:border-accent/30 hover:shadow-md transition-all group">
                  <ArrowRight className="h-5 w-5 text-accent mb-3 group-hover:translate-x-1 transition-transform" />
                  <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-accent transition-colors">{article.title}</h3>
                  <p className="text-muted-foreground text-xs">{article.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-10 md:py-24 hero-gradient">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Proteja Seu Imóvel em {city} Hoje
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Kit 4 Câmeras Intelbras com instalação profissional por <strong className="text-accent">R$ 1.350</strong>
            </p>
            <Button variant="heroWhatsapp" size="xl" className="animate-pulse-soft" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-6 w-6" />
                Garantir Instalação em {city}
              </a>
            </Button>
          </div>
        </section>
      </main>
      <RealImageSection imageKey="cameraSeguranca" caption="Instalação profissional de CFTV e monitoramento" />
      <BlocoInteligencia compact />
      <Footer />
    </div>
  );
};

export default CFTVCityTemplate;
