import { SkeletonBlock, SkeletonText } from "@/components/motion/Skeletons";
import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AlertCircle, MessageCircle, ArrowRight, CheckCircle, Wrench, Shield, Search, TrendingDown, Microscope, Zap, ThermometerSun, Cpu, ClipboardCheck, Truck, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { ClusterLinks } from "@/components/ClusterLinks";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Helmet } from "react-helmet";
import { useCanonical } from "@/lib/canonicalUrl";
import { trackPageView } from "@/lib/analytics";
import { trackWaClick, trackProblemaServiceClick, trackProblemaLinkBroken } from "@/lib/funnelAnalytics";
import { auditInternalLink } from "@/lib/internalLinkAudit";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";
import { useCtaVisibility } from "@/hooks/useCtaVisibility";
import type { ProblemaPageData } from "@/lib/problemaPagesData";
import ReactMarkdown from "react-markdown";
import { IMAGES } from "@/lib/images";
import { RealImageSection } from "@/components/RealImageSection";
import { siteConfig, absoluteUrl } from "@/lib/siteConfig";

const BAIRROS_ATENDIDOS = [
  { to: "/bairros/batel", label: "Batel" },
  { to: "/bairros/centro", label: "Centro" },
  { to: "/bairros/agua-verde", label: "Água Verde" },
  { to: "/bairros/cic", label: "CIC" },
  { to: "/bairros/portao", label: "Portão" },
];

const WHATSAPP_NUMBER = "5541997086380";

const tipoIcon = (tipo: string) => {
  switch (tipo) {
    case "hardware": return "🔧";
    case "software": return "💻";
    case "erro-humano": return "⚠️";
    case "desgaste": return "⏳";
    default: return "❓";
  }
};

const nivelColor = (nivel: string) => {
  switch (nivel) {
    case "Simples": return "bg-green-100 text-green-800";
    case "Médio": return "bg-yellow-100 text-yellow-800";
    case "Complexo": return "bg-red-100 text-red-800";
    default: return "bg-muted text-foreground";
  }
};

const diagnosticoSteps = [
  { icon: Microscope, label: "Inspeção Visual", desc: "Análise com microscópio trinocular 7x-50x" },
  { icon: Zap, label: "Teste Elétrico", desc: "Multímetro e medição de curto-circuito" },
  { icon: ThermometerSun, label: "Câmera Térmica", desc: "Identificação de componente em curto" },
  { icon: Cpu, label: "Teste de Firmware", desc: "Leitura de BIOS/chip com programador" },
  { icon: ClipboardCheck, label: "Laudo Técnico", desc: "Relatório com diagnóstico e valor" },
];

const ProblemaPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ProblemaPageData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useCanonical(`https://tecnico.curitiba.br/problemas/${data?.slug ?? slug ?? ""}`);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let active = true;
    setLoading(true);
    import("@/lib/problemaPagesData").then(({ getProblemaPageBySlug }) => {
      if (!active) return;
      const found = getProblemaPageBySlug(slug);
      setData(found);
      setLoading(false);
    }).catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (data) {
      document.title = data.title;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", data.metaDescription);
      trackPageView(`/problemas/${data.slug}`, data.h1);
    }
  }, [data]);

  useScrollDepthTracking(data ? `/problemas/${data.slug}` : "", { problema_slug: data?.slug || "unknown" });
  const heroCtaRef = useCtaVisibility<HTMLDivElement>("whatsapp", `problema:${data?.slug || "unknown"}:hero`);
  const finalCtaRef = useCtaVisibility<HTMLDivElement>("whatsapp", `problema:${data?.slug || "unknown"}:final`);

  const validatedRelatedPages = data ? data.relatedPages.filter((link) => {
    const audit = auditInternalLink(link.to);
    if (audit.valid === true) return true;
    trackProblemaLinkBroken({
      problemaSlug: data.slug,
      targetHref: link.to,
      reason: (audit as { reason: string }).reason,
      linkLabel: link.label,
    });
    return false;
  }) : [];



  const handleRelatedClick = (href: string, label: string) => {
    if (!data) return;
    const servicoSlug = href.replace(/^\/servicos\//, "").replace(/^\//, "");
    trackProblemaServiceClick({
      problemaSlug: data.slug,
      servicoSlug,
      servicoHref: href,
      linkLabel: label,
    });
  };


  const faqItems = data ? [
    ...data.sintomas.slice(0, 3).map(s => ({
      question: `O que significa quando ${s.titulo.toLowerCase()}?`,
      answer: s.desc,
    })),
    {
      question: `Quanto custa resolver "${data.h1.split("—")[0].trim()}" em Curitiba?`,
      answer: data.cenarios.map(c => `${c.nivel}: ${c.custo} (${c.tempo})`).join(". "),
    },
    {
      question: "O diagnóstico é gratuito?",
      answer: "O diagnóstico profissional tem custo a partir de R$ 99,99, que é abatido do serviço caso aprovado. Isso garante uma análise precisa e evita reparos desnecessários.",
    },
    {
      question: "Vocês atendem em Curitiba e região metropolitana?",
      answer: "Sim. Atendemos Curitiba e região metropolitana (São José dos Pinhais, Pinhais, Colombo, Araucária e Campo Largo), presencialmente e por coleta e entrega. A modalidade é definida na triagem por WhatsApp conforme o equipamento e o problema.",
    },
    {
      question: "Quanto tempo demora após entrar em contato pelo WhatsApp?",
      answer: "Respondemos em minutos no horário comercial. Serviços remotos podem começar conforme a disponibilidade da agenda; visitas e coletas são agendadas conforme sua janela. Nada é executado sem sua aprovação explícita.",
    },
  ] : [];

  const faqSchema = data ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } : null;

  const localBusinessSchema = data ? {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ComputerRepairService"],
    name: siteConfig.brandName,
    url: absoluteUrl(`/problemas/${data.slug}`),
    telephone: siteConfig.phoneE164,
    areaServed: siteConfig.serviceArea.map((n) => ({ "@type": "City", name: n })),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.primaryCity,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
    },
    priceRange: siteConfig.minPriceLabel,
  } : null;

  const breadcrumbSchema = data ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://tecnico.curitiba.br/" },
      { "@type": "ListItem", position: 2, name: data.categoria, item: "https://tecnico.curitiba.br/servicos" },
      { "@type": "ListItem", position: 3, name: data.h1.split("—")[0].trim(), item: `https://tecnico.curitiba.br/problemas/${data.slug}` },
    ],
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-16 max-w-3xl" role="status" aria-label="Carregando conteúdo">
          <SkeletonBlock className="h-9 w-3/4" />
          <SkeletonText lines={4} className="mt-6" />
          <SkeletonBlock className="mt-8 h-52 w-full rounded-xl" />
          <SkeletonText lines={3} className="mt-6" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Página não encontrada</h1>
          <Link to="/" className="text-accent underline">Voltar ao início</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleWhatsApp = () => {
    if (data) trackWaClick(`problema:${data.slug}`, { problema_slug: data.slug });
    window.dispatchEvent(new CustomEvent("wa-funnel:open", { detail: { location: `problema:${data?.slug || "unknown"}` } }));
  };


  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta name="robots" content="noindex, follow" />
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
        {localBusinessSchema && <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>}
      </Helmet>
      <Header />
      <Breadcrumbs items={[{ label: data.categoria, href: "/servicos" }, { label: data.h1.split("—")[0].trim() }]} />

      {/* Hero */}
      <section className="pt-10 pb-10 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-accent/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">{data.categoria}</span>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">{data.h1}</h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">{data.intro.split("\n")[0]}</p>
            <div ref={heroCtaRef} className="inline-block">
              <Button size="lg" variant="cta" onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-5 w-5" /> Falar com Técnico Agora
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Imagem ilustrativa pós-hero */}
      <RealImageSection imageKey="diagnostico" secondaryImageKey="bancadaTecnica" layout="duo" caption="Diagnóstico com multímetro em placa eletrônica" secondaryCaption="Bancada técnica profissional" />

      <AnimatedSection>
      {/* Introdução completa */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-sm md:prose-base">
            {data.intro.split("\n\n").map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
            ))}
          </div>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection>
      {/* Sintomas */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 text-center">Sintomas — Identifique o Seu Caso</h2>
            <p className="text-center text-muted-foreground mb-8">Cada sintoma indica uma possível causa e nível de complexidade</p>
            <div className="grid md:grid-cols-2 gap-4">
              {data.sintomas.map((s, i) => (
                <div key={i} className="bg-background rounded-xl p-5 border border-border">
                  <h3 className="font-semibold text-foreground mb-2">{s.titulo}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.desc}</p>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">Complexidade: {s.gravidade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection>
      {/* Causas Reais */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 text-center">Causas Reais — Por Que Isso Acontece</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.causas.map((c, i) => (
                <div key={i} className="bg-secondary rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{tipoIcon(c.tipo)}</span>
                    <h3 className="font-semibold text-foreground">{c.titulo}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{c.desc}</p>
                  <span className="text-xs text-muted-foreground capitalize">Tipo: {c.tipo.replace("-", " ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Imagem de transição */}
      <RealImageSection imageKey="placaMae" caption="Reparo em nível de componente com microsoldagem" />

      <AnimatedSection>
      {/* Cenários */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 text-center">Cenários — Simples, Médio e Complexo</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {data.cenarios.map((c, i) => (
                <div key={i} className="bg-background rounded-xl p-6 border border-border text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${nivelColor(c.nivel)}`}>{c.nivel}</span>
                  <p className="text-sm text-muted-foreground mb-4">{c.desc}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>⏱ Tempo: {c.tempo}</p>
                    <p>💰 Custo: {c.custo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection>
      {/* Riscos */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-destructive mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Riscos de Não Agir ou Agir Sem Conhecimento
              </h2>
              <ul className="space-y-2">
                {data.riscos.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-destructive mt-0.5">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* ========== DIAGNÓSTICO PROFISSIONAL — Redesenhado ========== */}
      <AnimatedSection>
      <section className="py-12 md:py-16 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-accent/15 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Search className="h-4 w-4" /> Etapa 1
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Diagnóstico Profissional</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Antes de qualquer reparo, identificamos exatamente qual componente falhou. Diagnóstico preciso evita trocas desnecessárias.
              </p>
            </div>

            {/* Guia passo a passo visual */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
              {diagnosticoSteps.map((step, i) => (
                <div key={i} className="relative bg-background rounded-xl p-4 border border-border text-center hover:-translate-y-1 hover:shadow-lg hover:border-accent/30 transition-all duration-300">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <step.icon className="h-7 w-7 text-accent mx-auto mt-2 mb-2" />
                  <p className="font-semibold text-foreground text-sm mb-1">{step.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Conteúdo detalhado + imagem lado a lado */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="bg-background rounded-xl p-6 border border-border space-y-3">
                {data.diagnostico.split("\n\n").map((p, i) => (
                  <p key={i} className="text-muted-foreground text-sm leading-relaxed">{p}</p>
                ))}
              </div>
              <div className="space-y-4">
                <figure>
                  <img
                    src={IMAGES.estacaoSolda}
                    alt={IMAGES.estacaoSoldaAlt}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={400}
                    className="rounded-xl w-full h-56 md:h-64 object-cover shadow-md"
                  />
                  <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">Estação de diagnóstico com multímetro e osciloscópio</figcaption>
                </figure>
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Diagnóstico profissional</p>
                  <p className="text-2xl font-bold text-accent">a partir de R$ 99,99</p>
                  <p className="text-xs text-muted-foreground mt-1">Valor abatido do serviço caso aprovado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* ========== SOLUÇÃO PROFISSIONAL — Redesenhado ========== */}
      <AnimatedSection>
      <section className="py-12 md:py-16 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Wrench className="h-4 w-4" /> Etapa 2
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Solução Profissional</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Com o diagnóstico preciso, aplicamos a solução mais adequada com equipamento profissional e peças de qualidade.
              </p>
            </div>

            {/* Conteúdo + imagem lado a lado (invertido) */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4 md:order-1">
                <figure>
                  <img
                    src={IMAGES.microscopio}
                    alt={IMAGES.microscopioAlt}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={400}
                    className="rounded-xl w-full h-56 md:h-64 object-cover shadow-md"
                  />
                  <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">Microsoldagem sob microscópio trinocular profissional</figcaption>
                </figure>
                <figure>
                  <img
                    src={IMAGES.ferramentas}
                    alt={IMAGES.ferramentasAlt}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={400}
                    className="rounded-xl w-full h-40 md:h-48 object-cover shadow-md"
                  />
                  <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">Ferramentas de precisão para reparo de componentes SMD</figcaption>
                </figure>
              </div>
              <div className="bg-secondary rounded-xl p-6 border border-border space-y-3 md:order-0">
                {data.solucao.split("\n\n").map((p, i) => (
                  <p key={i} className="text-muted-foreground text-sm leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection>
      {/* Quando Compensa / Não Compensa */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-xl p-6 border border-green-500/20">
              <h3 className="font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Quando Compensa Reparar
              </h3>
              <p className="text-sm text-muted-foreground">{data.quandoCompensa}</p>
            </div>
            <div className="bg-background rounded-xl p-6 border border-red-500/20">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" /> Quando Não Compensa
              </h3>
              <p className="text-sm text-muted-foreground">{data.quandoNaoCompensa}</p>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* CTA Coleta e Entrega */}
      <AnimatedSection>
      <section className="py-10 bg-accent/5 border-y border-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-accent/15 text-accent px-4 py-2 rounded-full text-sm font-semibold">
              <Truck className="h-4 w-4" /> Coleta e Entrega
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              Não pode trazer o equipamento? A gente busca!
            </h3>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Trabalhamos apenas com coleta e entrega em Curitiba e região metropolitana — não temos balcão
              de atendimento ao público. Preencha o formulário online, concorde com os termos e agende a
              retirada do seu equipamento no endereço que você indicar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/coleta-formulario">
                <Button size="lg" variant="cta" className="w-full sm:w-auto">
                  <ClipboardList className="mr-2 h-5 w-5" /> Preencher Formulário de Coleta
                </Button>
              </Link>
              <Link to="/coleta-e-entrega">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-accent/30 text-accent hover:bg-accent/10">
                  Saiba Mais sobre Coleta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Conteúdo Extra (Markdown) */}
      {data.conteudoExtra && (
        <AnimatedSection>
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-sm md:prose-base prose-headings:text-primary prose-headings:font-bold">
              <ReactMarkdown>{data.conteudoExtra}</ReactMarkdown>
            </div>
          </div>
        </section>
        </AnimatedSection>
      )}

      {/* Imagem antes do FAQ */}
      <RealImageSection imageKey="clienteSatisfeito" caption="Equipamento reparado e cliente satisfeito com o resultado" />

      {/* FAQ Visível */}
      {faqItems.length > 0 && (
        <AnimatedSection>
        <section className="py-10 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Perguntas Frequentes</h2>
              <div className="space-y-4">
                {faqItems.map((item, i) => (
                  <details key={i} className="bg-background rounded-xl border border-border group">
                    <summary className="p-4 font-semibold text-foreground cursor-pointer hover:text-accent transition-colors list-none flex items-center justify-between">
                      {item.question}
                      <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{item.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
        </AnimatedSection>
      )}

      <AnimatedSection>
      {/* CTA */}
      <section className="py-12 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-breathe" />
        </div>
        <div className="container mx-auto text-center px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{data.h1.split("—")[0].trim()}?</h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">Nosso técnico identifica o problema com diagnóstico preciso. Atendimento em Curitiba e região metropolitana.</p>
          <div ref={finalCtaRef} className="inline-block">
            <Button size="lg" variant="cta" onClick={handleWhatsApp}>
              <MessageCircle className="mr-2 h-5 w-5" /> Falar com Técnico Agora
            </Button>
          </div>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection>
      {/* Cobertura local — Curitiba + bairros curados */}
      <section className="py-10 bg-background border-t border-border/60">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              <Wrench className="h-4 w-4" /> Atendimento local
            </div>
            <h2 className="mt-4 text-xl md:text-2xl font-bold text-primary">
              Onde atendemos em Curitiba e região
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto">
              Atendimento presencial em Curitiba e região metropolitana, com coleta e entrega para casos que exigem bancada.
              Confira páginas locais dos bairros mais próximos:
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                to="/tecnico-informatica-curitiba"
                className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
              >
                Técnico em Curitiba
              </Link>
              {BAIRROS_ATENDIDOS.map((b) => (
                <Link
                  key={b.to}
                  to={b.to}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-accent/50 hover:text-accent"
                >
                  {b.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection>
      {/* Links Relacionados */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-primary mb-6 text-center">Páginas Relacionadas</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {validatedRelatedPages.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => handleRelatedClick(link.to, link.label)}
                  className="flex items-center gap-2 bg-background rounded-lg p-3 text-sm font-medium text-foreground hover:text-accent hover:shadow-md transition-all border border-border"
                >
                  <ArrowRight className="h-4 w-4 text-accent flex-shrink-0" />{link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      <ClusterLinks
        titulo="Serviços, modalidades e regiões relacionadas"
        categoria={data.categoria}
        contexto={data.h1}
      />
      <BlocoInteligencia />
      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default ProblemaPage;
