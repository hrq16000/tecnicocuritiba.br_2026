import { upsertCanonical } from "@/lib/canonicalUrl";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  CheckCircle, Clock, Shield, MessageCircle, 
  MapPin, Star, ChevronDown, AlertTriangle, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RealImageSection } from "@/components/RealImageSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { SERVICOS, CIDADES, getServico, getCidade, getFaqPorServico } from "@/lib/servicoCidadeData";
import { ServiceCityLinks } from "@/components/ServiceCityLinks";
import NotFound from "@/pages/NotFound";

const WHATSAPP_NUMBER = "5541997086380";

const ServicoCidadePage = () => {
  const { servico: servicoSlug, cidade: cidadeSlug } = useParams<{ servico: string; cidade: string }>();
  
  const servico = servicoSlug ? getServico(servicoSlug) : undefined;
  const cidade = cidadeSlug ? getCidade(cidadeSlug) : undefined;

  useEffect(() => {
    if (!servico || !cidade) return;
    document.title = `${servico.nome} em ${cidade.nome} | Técnico a Domicílio | Atendimento Hoje`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content",
        `Técnico de informática em ${cidade.nome}. ${servico.nome} com atendimento a domicílio conforme a disponibilidade da agenda. Sem sair de casa. WhatsApp.`
      );
    }
    upsertCanonical(`https://tecnico.curitiba.br/servicos/${servicoSlug}/${cidadeSlug}`);
    // Página herdada serviço×cidade (thin) — não deve competir com os serviços canônicos.
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, follow";
    trackPageView(`/servicos/${servicoSlug}/${cidadeSlug}`, `${servico.nome} - ${cidade.nome}`);
  }, [servico, cidade, servicoSlug, cidadeSlug]);

  if (!servico || !cidade) return <NotFound />;

  const isSemVisita = servico.slug === "conserto-tv" || servico.slug === "conserto-celular";
  const faqs = getFaqPorServico(servico.slug, cidade.nome);
  const waMessage = encodeURIComponent(`Olá! Preciso de ${servico.nome} em ${cidade.nome}. Podem me atender hoje?`);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  const handleWhatsAppClick = () => {
    trackCTAClick("whatsapp", `${servico.slug}-${cidade.slug}`);
    window.open(waLink, "_blank");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": `Técnico de Informática em ${cidade.nome}`,
        "url": "https://tecnico.curitiba.br",
        "areaServed": cidade.nome,
        "priceRange": "$$",
        "address": { "@type": "PostalAddress", addressLocality: cidade.nome, addressRegion: "PR", addressCountry: "BR" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.pergunta,
          "acceptedAnswer": { "@type": "Answer", "text": f.resposta }
        }))
      }
    ]
  };

  const beneficios = isSemVisita ? [
    { icon: CheckCircle, titulo: "Atendimento sem Compromisso", descricao: "Avaliamos o equipamento e informamos o valor antes de executar" },
    { icon: Clock, titulo: "Prazo Transparente", descricao: "Informamos o prazo desde o início. Atualizações por WhatsApp" },
    { icon: Shield, titulo: "Garantia no Serviço", descricao: "Todo reparo conta com garantia. Peças de qualidade" },
    { icon: Star, titulo: "Atendimento Humanizado", descricao: "Explicamos o problema com clareza, sem jargão técnico" },
  ] : [
    { icon: MapPin, titulo: `Atendimento Local em ${cidade.nome}`, descricao: "Técnico vai até seu endereço com todas as ferramentas" },
    { icon: Clock, titulo: "Atendimento conforme a agenda", descricao: "Agende pelo WhatsApp e receba o técnico ainda hoje" },
    { icon: Shield, titulo: "Garantia em Todos os Serviços", descricao: "Serviço garantido. Se precisar, voltamos sem custo" },
    { icon: Star, titulo: "Valor do atendimento Grátis", descricao: "Avaliação sem compromisso. Você só paga se aprovar" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Serviços", href: "/servicos" },
          { label: servico.nome, href: servico.servicoSlugExistente ? `/servicos/${servico.servicoSlugExistente}` : "/servicos" },
          { label: cidade.nome },
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
              <span className="font-medium text-sm">{cidade.nome}, PR</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 reveal-text">
              {servico.nome} em {cidade.nome}{isSemVisita ? " – Atendimento sem Compromisso" : " – Técnico a Domicílio"}
            </h1>

            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
              {isSemVisita 
                ? `atendimento humanizado para ${servico.nome.toLowerCase()} em ${cidade.nome}. Traga o equipamento para avaliação.`
                : `Atendemos no seu endereço em ${cidade.nome} ainda hoje`
              }
            </p>

            {isSemVisita && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6 max-w-lg mx-auto">
                <div className="flex items-center gap-2 text-accent mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-bold text-sm">IMPORTANTE</span>
                </div>
                <p className="text-white/90 text-sm">
                  Para {servico.slug === "conserto-tv" ? "TVs" : "celulares"}, <strong>não realizamos visita técnica a domicílio</strong>. O atendimento é feito por coleta e entrega no seu endereço, com avaliação em bancada.
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 mb-8 reveal-text" data-reveal-delay="200">
              {(isSemVisita 
                ? [["✓ Sem compromisso"], ["✓ Todas as marcas"], ["✓ Garantia"]]
                : [["✓ Conforme agenda"], ["✓ Sem sair de casa"], ["✓ atendimento sem compromisso"]]
              ).map(([text], i) => (
                <span key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium">{text}</span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-text" data-reveal-delay="300">
              <Button size="lg" variant="whatsapp" onClick={handleWhatsAppClick} className="hover:scale-105 transition-transform">
                <MessageCircle className="mr-2 h-5 w-5" />
                {isSemVisita ? "Solicitar atendimento" : "Chamar pelo WhatsApp"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Benefits with hover effects ═══ */}
      <section className="py-10 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {beneficios.map((b, i) => (
              <div 
                key={i} 
                className="text-center p-6 bg-secondary rounded-xl border border-border hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all duration-300 group stagger-item"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="bg-accent/10 rounded-full p-3 w-fit mx-auto mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <b.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{b.titulo}</h3>
                <p className="text-sm text-muted-foreground">{b.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RealImageSection imageKey="atendimentoDomiciliar" secondaryImageKey="tecnicoTrabalhando" layout="duo" caption={`Técnico em atendimento a domicílio em ${cidade.nome}`} secondaryCaption="Diagnóstico profissional no local" />

      {/* ═══ Process steps with animated numbers ═══ */}
      <section className="py-10 bg-secondary relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.03] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-8 reveal-text">
            Como Funciona o Atendimento em {cidade.nome}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", titulo: "Chame no WhatsApp", desc: `Descreva o problema e informe sua localização em ${cidade.nome}` },
              { step: "2", titulo: "Agendamento Rápido", desc: `Definimos o melhor horário para ir até você em ${cidade.nome}` },
              { step: "3", titulo: "Serviço Concluído", desc: "Técnico resolve no local com garantia. Você acompanha tudo" },
            ].map((p, i) => (
              <div 
                key={i} 
                className="text-center p-6 bg-background rounded-xl border border-border hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all duration-300 group stagger-item"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all duration-300">
                  {p.step}
                </div>
                <h3 className="font-bold text-foreground mb-2">{p.titulo}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ with glass cards ═══ */}
      <section className="py-10 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-accent/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-8 reveal-text">
            Perguntas Frequentes: {servico.nome} em {cidade.nome}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((item, index) => (
              <details 
                key={index} 
                className="group bg-secondary rounded-xl border border-border hover:border-accent/20 transition-colors stagger-item"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-foreground">
                  {item.pergunta}
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-muted-foreground">
                  {item.resposta}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA with glow ═══ */}
      <section className="relative py-12 hero-gradient overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 reveal-text">
            Precisa de {servico.nome} em {cidade.nome}?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
            Entre em contato agora e agende seu atendimento a domicílio. Respondemos em até 15 minutos.
          </p>
          <Button size="lg" variant="whatsapp" onClick={handleWhatsAppClick} className="hover:scale-105 transition-transform reveal-text" data-reveal-delay="200">
            <MessageCircle className="mr-2 h-5 w-5" />
            Agendar {servico.nome} em {cidade.nome}
          </Button>
        </div>
      </section>

      {/* ═══ Interlinking with hover effects ═══ */}
      <ServiceCityLinks servicoSlug={servico.slug} cidadeSlug={cidade.slug} />

      <Footer />
    </div>
  );
};

export default ServicoCidadePage;
