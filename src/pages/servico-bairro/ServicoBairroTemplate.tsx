import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { AnimatedSection } from "@/components/AnimatedSection";
import { IMAGES } from "@/lib/images";
import { Link } from "@/lib/router-compat";
import { 
  CheckCircle, Clock, Shield, ArrowRight, MessageCircle, 
  MapPin, Star, Award, Users, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackPageView } from "@/lib/analytics";
import { trackWaClick } from "@/lib/funnelAnalytics";
import { buildCategoryMessage, type TemplateCategory } from "@/lib/whatsappTemplates";

const CANONICAL_BASE = "https://tecnico.curitiba.br";

/** Categoria de template a partir do slug de serviço (sem inventar dados). */
function categoriaFromServico(slug: string): TemplateCategory {
  if (slug.includes("redes") || slug.includes("wifi")) return "rede";
  if (slug.includes("empresa")) return "empresa";
  if (slug.includes("backup") || slug.includes("dados")) return "dados";
  if (slug.includes("celular")) return "celular";
  if (slug.includes("tv")) return "tv";
  return "pc";
}


export interface ServicoBairroData {
  metaTitle: string;
  metaDescription: string;
  servico: string;
  servicoSlug: string;
  bairro: string;
  bairroSlug: string;
  cidade: string;
  cidadeSlug?: string;
  h1: string;
  subtitulo: string;
  precoBase: string;
  precoDescricao: string;
  descricaoLonga: string;
  beneficios: string[];
  processoPasso: { titulo: string; descricao: string }[];
  faq: { pergunta: string; resposta: string }[];
  pontosReferencia: string[];
  tempoAtendimento: string;
  servicosRelacionados: { nome: string; slug: string }[];
  bairrosProximos: { nome: string; slug: string }[];
  /** Se true, sobrescreve `noindex` do PageSEO (default false = noindex). */
  indexable?: boolean;
}


export const ServicoBairroTemplate = ({ data }: { data: ServicoBairroData }) => {
  const path = `/servicos/${data.servicoSlug}/${data.bairroSlug}`;
  const canonical = `${CANONICAL_BASE}${path}`;

  useEffect(() => {
    trackPageView(path, `${data.servico} - ${data.bairro}`);
  }, [path, data.servico, data.bairro]);

  /**
   * Prévia da mensagem enviada ao WhatsApp: já contextualizada com serviço,
   * bairro, cidade, modalidade e resumo do atendimento. Exibida na página
   * antes do envio e usada como preset do funil obrigatório V5.
   */
  const waPreview = buildCategoryMessage(
    {
      cat: categoriaFromServico(data.servicoSlug),
      sym: data.servico,
      cidade: data.cidade,
      bairro: data.bairro,
      servico: data.servicoSlug,
    },
    `Modalidade: atendimento local no ${data.bairro}. Resumo: ${data.subtitulo}`,
  );

  /**
   * CTA WhatsApp → passa pelo funil obrigatório V5. Analytics resiliente:
   * trackWaClick faz fallback para "unknown" quando modalidade/problema
   * ainda não foram capturados na sessão.
   */
  const handleWhatsAppClick = () => {
    const location = `${data.servicoSlug}-${data.bairroSlug}`;
    trackWaClick(location, {
      servico: data.servicoSlug,
      bairro: data.bairroSlug,
      cidade: data.cidadeSlug || "curitiba",
      utm_medium: "cta",
    });
    window.dispatchEvent(
      new CustomEvent("wa-funnel:open", {
        detail: { location, message: waPreview },
      }),
    );
  };


  // Preço numérico normalizado (aceita "R$ 99,99" ou "R$ 299,99")
  const priceNumeric = data.precoBase.replace(/[^\d,]/g, "").replace(",", ".");

  // LocalBusiness, Service e BreadcrumbList são emitidos uma única vez pelo
  // head estático da rota (seoHead / inject-route-head). Emitir o grafo aqui
  // duplicava LocalBusiness e o @id `#service` no HTML servido.

  return (
    <div className="min-h-screen bg-background">
      <PageSEO noindex={!data.indexable} title={data.metaTitle} description={data.metaDescription} path={`/servicos/${data.servicoSlug}/${data.bairroSlug}`} breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Serviços", path: "/servicos" },
        { name: data.servico, path: `/servicos/${data.servicoSlug}` },
        { name: data.bairro, path: `/servicos/${data.servicoSlug}/${data.bairroSlug}` }
      ]} />

      
      <Header />
      <Breadcrumbs
        items={[
          { label: "Serviços", href: "/servicos" },
          { label: data.servico, href: `/servicos/${data.servicoSlug}` },
          { label: data.bairro },
        ]}
      />
      
      {/* ═══ HERO — Premium with glow blobs ═══ */}
      <section className="relative pt-10 pb-10 hero-gradient overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px] animate-breathe" />
          <div className="absolute bottom-1/3 left-1/5 w-56 h-56 bg-primary/8 rounded-full blur-[80px] animate-breathe" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6 shimmer">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-sm">{data.bairro}, {data.cidade}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 reveal-text">
              {data.h1}
            </h1>
            
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
              {data.subtitulo}
            </p>

            {/* Trust indicators with glass cards */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 reveal-text" data-reveal-delay="200">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/10 px-4 py-2 rounded-lg">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="text-white text-sm font-medium">Atendimento local direto</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/10 px-4 py-2 rounded-lg">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-white text-sm">{data.tempoAtendimento}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/10 px-4 py-2 rounded-lg">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-white text-sm">Garantia inclusa</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-text" data-reveal-delay="300">
              <Button size="lg" variant="whatsapp" onClick={handleWhatsAppClick} className="hover:scale-105 transition-transform">
                <MessageCircle className="mr-2 h-5 w-5" />
                Agendar no {data.bairro}
              </Button>
            </div>

            {/* Prévia da mensagem que será enviada (transparência + contexto) */}
            <div
              className="mt-6 max-w-2xl mx-auto text-left bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4"
              data-testid="wa-message-preview"
            >
              <p className="text-white/70 text-xs uppercase tracking-wide mb-2">
                Prévia da mensagem no WhatsApp
              </p>
              <p className="text-white/90 text-sm whitespace-pre-line">{waPreview}</p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ Pricing strip ═══ */}
      <AnimatedSection>
        <section className="py-6 bg-accent/5 border-y border-accent/10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-accent" />
              {data.servico} a partir de <span className="text-accent">{data.precoBase}</span>
            </p>
            <p className="text-muted-foreground mt-2">{data.precoDescricao}</p>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ Content with image ═══ */}
      <AnimatedSection>
        <section className="py-10 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-6 reveal-text">
                    {data.servico} no {data.bairro}: Por Que Nos Escolher?
                  </h2>
                  <div className="prose prose-lg text-muted-foreground">
                    <p>{data.descricaoLonga}</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg group">
                  <img decoding="async" 
                    src={data.servicoSlug.includes("conserto") ? IMAGES.notebookReparo 
                      : data.servicoSlug.includes("formatacao") ? IMAGES.tecnicoTrabalhando
                      : data.servicoSlug.includes("virus") ? IMAGES.segurancaDigital
                      : data.servicoSlug.includes("upgrade") ? IMAGES.componentesSsd
                      : data.servicoSlug.includes("redes") ? IMAGES.redesWifi
                      : data.servicoSlug.includes("backup") ? IMAGES.diagnostico
                      : data.servicoSlug.includes("montagem") ? IMAGES.desktopMontado
                      : IMAGES.tecnicoTrabalhando}
                    alt={`${data.servico} profissional no ${data.bairro}, ${data.cidade}`}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width="800"
                    height="400"
                  />
                </div>
              </div>
              
              {/* Location tags with stagger */}
              <div className="mt-8 p-6 bg-secondary/50 backdrop-blur-xs rounded-xl border border-border">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  Atendemos perto de:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.pontosReferencia.map((ponto, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-background rounded-full text-sm text-muted-foreground border border-border hover:border-accent/30 hover:bg-accent/5 transition-colors stagger-item"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {ponto}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ Benefits with hover effects ═══ */}
      <AnimatedSection>
        <section className="py-10 bg-secondary relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.03] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-10 reveal-text">
              O Que Está Incluso?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {data.beneficios.map((beneficio, index) => (
                <div 
                  key={index} 
                  className="flex gap-4 p-4 bg-background rounded-xl border border-border hover:border-accent/20 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] transition-all duration-300 stagger-item"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{beneficio}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ Process steps with animated numbers ═══ */}
      <AnimatedSection>
        <section className="py-10 bg-background relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-accent/[0.04] rounded-full blur-[80px] translate-x-1/2 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-10 reveal-text">
              Como Funciona o Atendimento no {data.bairro}?
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {data.processoPasso.map((passo, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 bg-secondary rounded-xl border border-border hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all duration-300 group stagger-item"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all duration-300">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{passo.titulo}</h3>
                  <p className="text-muted-foreground text-sm">{passo.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ FAQ with glass cards ═══ */}
      <AnimatedSection>
        <section className="py-10 bg-secondary relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-accent/[0.03] rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-10 reveal-text">
              Perguntas Frequentes: {data.servico} no {data.bairro}
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {data.faq.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-background p-6 rounded-xl border border-border hover:border-accent/20 hover:-translate-y-0.5 transition-all duration-300 stagger-item"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <h3 className="font-bold text-foreground mb-2">{item.pergunta}</h3>
                  <p className="text-muted-foreground">{item.resposta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ CTA with glow ═══ */}
      <AnimatedSection>
        <section className="relative py-12 hero-gradient overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-heading font-bold text-white mb-4 reveal-text">
              Precisa de {data.servico} no {data.bairro}?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
              Entre em contato agora e agende seu atendimento. Técnico especializado com chegada rápida!
            </p>
            <Button size="lg" variant="whatsapp" onClick={handleWhatsAppClick} className="hover:scale-105 transition-transform reveal-text" data-reveal-delay="200">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chamar Técnico no {data.bairro}
            </Button>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══ Related links with hover effects ═══ */}
      <AnimatedSection>
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8 reveal-text">
              Outros Serviços no {data.bairro}
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {data.servicosRelacionados.map((servico, index) => (
                <Link 
                  key={index}
                  to={`/servicos/${servico.slug}/${data.bairroSlug}`} 
                  className="px-5 py-3 bg-secondary rounded-lg border border-border hover:border-accent/30 hover:bg-accent/10 hover:-translate-y-0.5 transition-all duration-300 text-sm stagger-item"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {servico.nome} no {data.bairro}
                </Link>
              ))}
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8 reveal-text">
              {data.servico} em Bairros Próximos
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {data.bairrosProximos.map((bairro, index) => (
                <Link 
                  key={index}
                  to={`/servicos/${data.servicoSlug}/${bairro.slug}`} 
                  className="px-5 py-3 bg-secondary rounded-lg border border-border hover:border-accent/30 hover:bg-accent/10 hover:-translate-y-0.5 transition-all duration-300 text-sm stagger-item"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {data.servico} no {bairro.nome}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <BlocoInteligencia />
      <Footer />
    </div>
  );
};
