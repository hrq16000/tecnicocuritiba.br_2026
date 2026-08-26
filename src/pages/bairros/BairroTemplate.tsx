import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { AnimatedSection } from "@/components/AnimatedSection";
import { IMAGES } from "@/lib/images";
import { Link } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { TrustSection } from "@/components/TrustSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { BairroInterlinkLocal } from "@/components/areas/BairroInterlinkLocal";
import { bairroPathPorNome } from "@/lib/bairroLinks";
import { REGIOES_COBERTURA } from "@/lib/bairrosBaseline";
import { whatsappDeepLink } from "@/lib/whatsappDeepLink";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { PricingBanner } from "@/components/PricingBanner";
import { GeoSpecificFAQs, bairroFAQs } from "@/components/GeoSpecificFAQs";
import { LocalFAQSection } from "@/components/LocalFAQSection";
import { ServiceLocalLinks } from "@/components/ServiceLocalLinks";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  MapPin, 
  Clock, 
  Shield, 
  CheckCircle,
  Wrench,
  Monitor,
  HardDrive,
  ArrowRight,
  Star,
  Zap
} from "lucide-react";


interface BairroData {
  nome: string;
  slug: string;
  cidade: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitulo: string;
  descricaoLonga: string;
  pontosReferencia: string[];
  tempoDeslocamento: string;
  servicosDestaque: string[];
  conteudoExclusivo?: string;
  problemasComuns?: string[];
  dicasLocais?: string[];
  /** Quando true, o bairro é âncora indexável (conteúdo único ≥300 palavras) */
  indexavel?: boolean;
}

interface BairroTemplateProps {
  data: BairroData;
}

const servicePath = (label: string) => {
  const key = label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (key.includes("format")) return "/servicos/formatacao";
  if (key.includes("virus") || key.includes("malware")) return "/servicos/remocao-de-virus";
  if (key.includes("ssd") || key.includes("memoria")) return "/servicos/upgrade-ssd-ram";
  if (key.includes("notebook")) return "/servicos/manutencao-de-notebook";
  if (key.includes("backup") || key.includes("recuperacao")) return "/servicos/recuperacao-de-dados";
  if (key.includes("wifi") || key.includes("rede")) return "/servicos/redes-e-wifi";
  if (key.includes("computador") || key.includes("manutencao")) return "/servicos/manutencao-de-computador";
  return null;
};

export const BairroTemplate = ({ data }: BairroTemplateProps) => {
  const whatsappUrl = whatsappDeepLink({
    local: data.nome,
    servico: data.servicosDestaque[0],
    extra: "Pode me passar os próximos horários disponíveis?",
  });

  useEffect(() => {
    document.title = data.metaTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", data.metaDescription);
    }
    trackPageView(`/bairros/${data.slug}`, `Bairro ${data.nome}`);
  }, [data]);

  const handleWhatsAppClick = () => {
    trackCTAClick("whatsapp", `bairro_${data.slug}`);
  };

  const benefits = [
    {
      icon: MapPin,
      title: `Atendimento Local em ${data.nome}`,
      description: `Técnico especializado com conhecimento da região. Chegamos rápido até você em ${data.nome} e arredores.`,
    },
    {
      icon: Clock,
      title: data.tempoDeslocamento,
      description: "Atendimento ágil, com horário agendado conforme sua disponibilidade. Sem longas esperas.",
    },
    {
      icon: Shield,
      title: "Profissional Identificado",
      description: "Técnico identificado, com equipamentos profissionais e registro do atendimento. Segurança para sua família.",
    },
    {
      icon: Wrench,
      title: "Resolução na Hora",
      description: "A maioria dos problemas é resolvida na primeira visita. Se precisar de peças, informamos antes.",
    },
  ];

  // Região da malha geográfica oficial — usada no BreadcrumbList
  // (Home > Cidade > Bairros > Região > Bairro) e no interlinking de vizinhos.
  const regiaoAtual = REGIOES_COBERTURA.find((r) => r.itens.some((i) => i.slug === data.slug));

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Técnico de Informática em ${data.nome}`,
    "description": data.metaDescription,
    "areaServed": {
      "@type": "Place",
      "name": data.nome,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": data.cidade,
        "addressRegion": "PR",
        "addressCountry": "BR"
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Informática",
      "itemListElement": data.servicosDestaque.map((servico) => ({
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": servico }
      }))
    }
  };

  useJsonLdSlot(SCHEMA_SLOTS.localBusiness, localSchema, SLOT_PRIORITY.page);

  const getCityLink = () => {
    switch (data.cidade) {
      case "Curitiba": return "/tecnico-informatica-curitiba";
      case "São José dos Pinhais": return "/tecnico-informatica-sao-jose-pinhais";
      case "Araucária": return "/tecnico-informatica-araucaria";
      case "Campo Largo": return "/tecnico-informatica-campo-largo";
      case "Pinhais": return "/tecnico-informatica-pinhais";
      case "Colombo": return "/tecnico-informatica-colombo";
      case "Fazenda Rio Grande": return "/tecnico-informatica-fazenda-rio-grande";
      case "Almirante Tamandaré": return "/tecnico-informatica-almirante-tamandare";
      case "Piraquara": return "/tecnico-informatica-piraquara";
      case "Campo Magro": return "/tecnico-informatica-campo-magro";
      case "Quatro Barras": return "/tecnico-informatica-quatro-barras";
      default: return "/";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO noindex={!data.indexavel} title={data.metaTitle} description={data.metaDescription} path={`/bairros/${data.slug}`} breadcrumbs={[
        { name: "Início", path: "/" },
        { name: `Técnico em ${data.cidade}`, path: getCityLink() },
        { name: data.nome, path: `/bairros/${data.slug}` }
      ]} />
      <JsonLdSchema />
      <Header />
      <Breadcrumbs
        items={[
          { label: `Técnico em ${data.cidade}`, href: getCityLink() },
          { label: "Bairros atendidos", href: "/areas-atendidas" },
          ...(regiaoAtual ? [{ label: regiaoAtual.titulo, href: "/areas-atendidas" }] : []),
          { label: data.nome },
        ]}
      />
      <main>
        {/* ═══ HERO — Premium with glow blobs & animations ═══ */}
        <section className="relative pt-10 pb-10 md:pt-14 md:pb-14 overflow-hidden hero-gradient">
          {/* Ambient glow blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px] animate-breathe" />
            <div className="absolute bottom-1/3 left-1/5 w-56 h-56 bg-primary/8 rounded-full blur-[80px] animate-breathe" style={{ animationDelay: '2s' }} />
            <div className="absolute top-2/3 right-1/6 w-40 h-40 bg-white/5 rounded-full blur-[60px] animate-breathe" style={{ animationDelay: '4s' }} />
          </div>
          {/* Dot grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Shimmer badge */}
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6 shimmer">
                <MapPin className="h-4 w-4" />
                <span className="font-medium text-sm">{data.cidade} • {data.tempoDeslocamento}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-4 reveal-text">
                {data.h1}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 reveal-text max-w-2xl mx-auto" data-reveal-delay="100">
                {data.subtitulo}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 reveal-text" data-reveal-delay="200">
                <Button
                  variant="heroWhatsapp"
                  size="lg"
                  className="text-base md:text-lg px-8 hover:scale-105 transition-transform"
                  asChild
                  onClick={handleWhatsAppClick}
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Chamar Técnico em {data.nome}
                  </a>
                </Button>
              </div>

              {/* Glass card pricing */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-5 py-3 reveal-text" data-reveal-delay="300">
                <Zap className="h-5 w-5 text-accent" />
                <p className="text-white/90 text-sm">
                  Serviços a partir de <strong className="text-accent">R$ 99,99</strong> • Atendimento hoje mesmo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Rating strip ═══ */}
        <section className="py-3 bg-accent/5 border-b border-accent/10">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Atendimento local e direto em {data.cidade} e região</span>
            </div>
          </div>
        </section>

        <AnimatedSection>
          <section className="py-6 bg-background">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto">
                <PricingBanner />
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ═══ Main content with premium image & sidebar ═══ */}
        <AnimatedSection>
          <section className="py-8 md:py-10 bg-background relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto">
                {/* Image with hover effect */}
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg group">
                  <img decoding="async" 
                    src={IMAGES.atendimentoDomiciliar} 
                    alt={`Técnico de informática realizando atendimento a domicílio no ${data.nome}, ${data.cidade}`}
                    className="w-full h-48 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width="800"
                    height="400"
                  />
                </div>
                <div className="grid lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 reveal-text">
                      Assistência Técnica em Informática no {data.nome}
                    </h2>
                    <div className="prose prose-lg text-muted-foreground">
                      <p className="mb-4">{data.descricaoLonga}</p>
                      <p className="mb-4">
                        Nosso técnico de informática atende toda a região do {data.nome} e arredores, 
                        oferecendo serviços completos de manutenção, conserto e suporte para computadores 
                        e notebooks. Seja para residências ou empresas, garantimos atendimento profissional 
                        com qualidade e pontualidade.
                      </p>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        Regiões Atendidas Próximas:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.pontosReferencia.map((ponto, index) => {
                          const destino = bairroPathPorNome(ponto);
                          const classes = "inline-flex items-center bg-secondary text-muted-foreground px-3 py-1.5 rounded-full text-sm border border-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-colors stagger-item";
                          const conteudo = <><MapPin className="h-3 w-3 mr-1 text-accent" />{ponto}</>;
                          return destino ? (
                            <Link key={index} to={destino} className={classes} style={{ animationDelay: `${index * 60}ms` }}>
                              {conteudo}
                            </Link>
                          ) : (
                            <span key={index} className={classes} style={{ animationDelay: `${index * 60}ms` }}>
                              {conteudo}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* Sticky sidebar with glass effect */}
                  <div className="lg:col-span-2">
                    <div className="bg-secondary/80 backdrop-blur-xs rounded-xl p-6 sticky top-24 border border-border shadow-[var(--shadow-lg)]">
                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-accent" />
                        Serviços em {data.nome}
                      </h3>
                      <ul className="space-y-3">
                        {data.servicosDestaque.map((servico, index) => (
                          <li 
                            key={index} 
                            className="flex items-center gap-3 stagger-item"
                            style={{ animationDelay: `${index * 80}ms` }}
                          >
                            <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                            {servicePath(servico) ? (
                              <Link to={servicePath(servico)!} className="text-foreground underline-offset-4 hover:text-accent hover:underline">
                                {servico}
                              </Link>
                            ) : (
                              <a href={whatsappDeepLink({ local: data.nome, servico })} target="_blank" rel="noopener noreferrer" onClick={handleWhatsAppClick} className="text-foreground underline-offset-4 hover:text-accent hover:underline">
                                {servico}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6">
                        <Button variant="whatsapp" className="w-full hover:scale-[1.02] transition-transform" asChild onClick={handleWhatsAppClick}>
                          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-5 w-5" />
                            Agendar atendimento no bairro
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <BenefitsGrid
            benefits={benefits}
            title={`Por Que Escolher o Técnico Curitiba em ${data.nome}?`}
            subtitle="Atendimento profissional com foco em qualidade e agilidade"
          />
        </AnimatedSection>

        {/* ═══ Content section with premium effects ═══ */}
        <AnimatedSection>
          <section className="py-8 md:py-10 bg-background relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.03] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 reveal-text">
                  Informática no {data.nome}: O Que Você Precisa Saber
                </h2>

                <div className="prose prose-lg text-muted-foreground mb-8">
                  <p>
                    Moradores e empresas do {data.nome} ({data.cidade}) enfrentam problemas de informática 
                    que, quando ignorados, se transformam em prejuízo. Um computador lento pode significar 
                    desde um HD desgastado até uma infecção silenciosa por malware. Um notebook que 
                    superaquece pode estar com a pasta térmica ressecada — ou pode ser sinal de que o 
                    componente está prestes a falhar.
                  </p>
                  <p>
                    <strong>É por isso que o diagnóstico correto faz toda a diferença.</strong> Antes de trocar 
                    peças ou formatar, é preciso entender o que realmente está acontecendo. Nosso técnico 
                    atende o {data.nome} com equipamento profissional, faz a análise no local e explica 
                    com clareza o que precisa ser feito — e o que não precisa.
                  </p>
                  <p>
                    Quando o reparo pode ser feito na hora (como formatação, troca de SSD, limpeza interna 
                    ou configuração de rede), resolvemos na primeira visita. Quando o caso exige bancada 
                    (como reparo de placa-mãe ou troca de tela), informamos prazo e valor antes de retirar 
                    o equipamento. <strong>Transparência total, sem surpresas.</strong>
                  </p>
                </div>

                {/* Problems grid with gradient border cards */}
                <div className="bg-secondary/50 backdrop-blur-xs rounded-xl p-6 md:p-8 mb-8 border border-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2 relative z-10">
                    <Shield className="h-5 w-5 text-accent" />
                    Problemas Mais Comuns no {data.nome}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 relative z-10">
                    {(data.problemasComuns || [
                      "Computador lento que trava ao abrir programas",
                      "Notebook superaquecendo e desligando sozinho",
                      "Wi-Fi que cai ou fica lento em cômodos distantes",
                      "Vírus, pop-ups e programas indesejados",
                      "Tela azul ou computador que não liga",
                      "Perda de arquivos e necessidade de backup urgente",
                    ]).map((problema, i) => (
                      <div 
                        key={i} 
                        className="flex items-start gap-3 bg-background/50 rounded-lg p-3 border border-border/50 hover:border-accent/20 hover:bg-accent/5 transition-all stagger-item"
                        style={{ animationDelay: `${i * 70}ms` }}
                      >
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{problema}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mt-4 relative z-10">
                    Se você enfrenta algum desses problemas no {data.nome}, fale com nosso técnico. 
                    Atendemos com horário agendado e resolvemos a maioria dos casos na primeira visita.
                  </p>
                </div>

                <section aria-labelledby="rotas-tecnicas" className="mb-8 rounded-xl border border-border bg-card p-6 md:p-8">
                  <h3 id="rotas-tecnicas" className="text-xl font-bold text-foreground">Entenda o sintoma antes de decidir</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Cada falha tem causas diferentes. Estes guias ajudam a separar uma configuração simples de um caso que precisa de diagnóstico, coleta ou bancada.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      { to: "/problemas/computador-lento", title: "Computador lento", desc: "HD, memória, programas ou aquecimento: veja por onde começar." },
                      { to: "/problemas/notebook-superaquecendo", title: "Notebook superaquecendo", desc: "Entenda riscos, sinais de parada e opções de manutenção." },
                      { to: "/problemas/computador-nao-liga", title: "Computador não liga", desc: "Fonte, cabo, memória ou placa: confira verificações seguras." },
                      { to: "/problemas/tela-azul-windows", title: "Tela azul no Windows", desc: "Erros de driver, disco e memória exigem abordagens diferentes." },
                    ].map((item) => (
                      <Link key={item.to} to={item.to} className="group rounded-lg border border-border/70 p-4 transition-colors hover:border-accent/50 hover:bg-accent/5">
                        <span className="font-semibold text-foreground group-hover:text-accent">{item.title}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">{item.desc}</span>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">Ver diagnóstico <ArrowRight className="h-3.5 w-3.5" /></span>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Second image with hover zoom */}
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg group">
                  <img decoding="async" 
                    src={IMAGES.notebookReparo} 
                    alt={`Conserto de notebook e manutenção de computador no ${data.nome}, ${data.cidade}`}
                    className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width="800"
                    height="350"
                  />
                </div>

                {/* Internal links with hover-streak effect */}
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { to: "/como-funciona", title: "Como Funciona", desc: "Entenda o passo a passo do atendimento técnico a domicílio.", cta: "Ver detalhes" },
                    { to: "/valores", title: "Preços e Condições", desc: "Valores claros, sem surpresas. a partir de R$ 99,99.", cta: "Ver preços" },
                    { to: "/diagnostico-tecnico", title: "Diagnóstico Técnico", desc: "Por que o diagnóstico é pago e como ele protege você.", cta: "Entender" },
                  ].map((link, i) => (
                    <Link 
                      key={i}
                      to={link.to} 
                      className="relative bg-card rounded-xl p-5 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 group overflow-hidden stagger-item"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {/* Hover streak */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-accent/5 to-transparent group-hover:left-full transition-all duration-700" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors relative z-10">{link.title}</h4>
                      <p className="text-muted-foreground text-sm relative z-10">{link.desc}</p>
                      <span className="inline-flex items-center gap-1 text-accent text-sm mt-2 group-hover:gap-2 transition-all relative z-10">
                        {link.cta} <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ═══ Conteúdo exclusivo local (bairros âncora indexáveis) ═══ */}
        {(data.conteudoExclusivo || data.dicasLocais) && (
          <AnimatedSection>
            <section className="py-8 md:py-10 bg-secondary relative overflow-hidden">
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                  {data.conteudoExclusivo && (
                    <div className="prose prose-lg max-w-none text-muted-foreground mb-8 whitespace-pre-line">
                      {data.conteudoExclusivo}
                    </div>
                  )}
                  {data.dicasLocais && (
                    <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
                      <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-accent" />
                        Dicas para quem é do {data.nome}
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        {data.dicasLocais.map((dica) => (
                          <li key={dica} className="flex gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                            <span>{dica}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </AnimatedSection>
        )}



        {/* ═══ Services grid with icon animations ═══ */}
        <AnimatedSection>
          <section className="py-8 md:py-10 bg-secondary relative overflow-hidden">
            <div className="absolute top-0 left-1/2 w-96 h-96 bg-accent/[0.03] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center reveal-text">
                  Principais Serviços no {data.nome}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: Monitor, title: "Formatação", desc: "Instalação limpa do Windows, drivers e programas. Computador como novo." },
                    { icon: Shield, title: "Remoção de Vírus", desc: "Limpeza completa de malwares, trojans e ransomware. Proteção instalada." },
                    { icon: HardDrive, title: "Upgrade SSD", desc: "Troca de HD por SSD. Seu computador 10x mais rápido." },
                  ].map((service, i) => (
                    <div 
                      key={i}
                      className="bg-card rounded-xl p-6 text-center border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 group stagger-item"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="bg-accent/10 rounded-full p-4 w-fit mx-auto mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                        <service.icon className="h-8 w-8 text-accent group-hover:rotate-6 transition-transform duration-300" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          {bairroFAQs[data.slug] ? (
            <GeoSpecificFAQs bairroSlug={data.slug} bairroNome={data.nome} cidadeNome={data.cidade} />
          ) : (
            <LocalFAQSection
              title={`Perguntas Frequentes - ${data.nome}`}
              faqs={[
                { question: `Vocês atendem a domicílio no ${data.nome}?`, answer: `Sim. Fazemos atendimento a domicílio no ${data.nome} (${data.cidade}) com horário agendado. Levamos ferramentas e fazemos diagnóstico no local sempre que possível.` },
                { question: `Quanto tempo demora para o técnico chegar no ${data.nome}?`, answer: `Em geral, ${data.tempoDeslocamento.toLowerCase()}. O tempo pode variar conforme trânsito e disponibilidade do dia.` },
                { question: `Quais serviços vocês fazem no ${data.nome}?`, answer: `Os mais comuns são ${data.servicosDestaque.slice(0, 4).join(", ")}. Também realizamos diagnóstico e manutenção preventiva.` },
                { question: `Qual o valor da visita técnica no ${data.nome}?`, answer: "A visita técnica começa em R$ 99,99. Após o diagnóstico, informamos o valor informado antes de executar qualquer serviço adicional." },
              ]}
            />
          )}
        </AnimatedSection>

        <AnimatedSection>
          <BairroInterlinkLocal slug={data.slug} nome={data.nome} />
        </AnimatedSection>

        <AnimatedSection>
          <ServiceLocalLinks currentCity={data.cidade} currentNeighborhood={data.nome} />
        </AnimatedSection>

        <AnimatedSection><TrustSection /></AnimatedSection>
        <AnimatedSection><CTASection /></AnimatedSection>
      </main>
      <BlocoInteligencia compact />
      <Footer />
      <WhatsAppChat />
    </div>
  );
};

export default BairroTemplate;
