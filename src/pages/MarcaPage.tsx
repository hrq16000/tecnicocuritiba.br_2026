import { useEffect } from "react";
import { useParams, Link } from "@/lib/router-compat";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getBrandBySlug, brandsData } from "@/lib/brandsData";
import { trackPageView } from "@/lib/analytics";
import {
  ArrowRight, Calendar, Wrench, AlertTriangle, Lightbulb,
  Newspaper, CheckCircle, MessageCircle, ChevronRight, Building2, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP = "5541997086380";

const MarcaPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const brand = getBrandBySlug(slug || "");

  useEffect(() => {
    if (brand) {
      document.title = `Assistência Técnica ${brand.name} em Curitiba | Técnico Especializado`;
      trackPageView(`/marcas/${brand.slug}`, `Marca — ${brand.name}`);
    }
  }, [brand]);

  if (!brand) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Marca não encontrada</h1>
          <Link to="/blog" className="text-accent hover:underline">Voltar ao portal de conteúdo</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Preciso de assistência técnica para meu equipamento ${brand.name}.`)}`;

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        noindex
        title={`Assistência Técnica ${brand.name} em Curitiba | Conserto e Manutenção`}
        description={`Assistência técnica especializada ${brand.name} em Curitiba e região. ${brand.servicos.slice(0, 3).join(", ")}. Atendimento a domicílio.`}
        path={`/marcas/${brand.slug}`}
      />
      <Header />

      <main>
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 premium-gradient" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-[15%] w-[400px] h-[400px] rounded-full blur-[120px] animate-breathe" style={{ background: `${brand.color}15` }} />
            <div className="absolute bottom-0 right-[10%] w-[300px] h-[300px] rounded-full bg-accent/[0.06] blur-[100px] animate-float" />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />

          <div className="container mx-auto relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 px-4">
            <AnimatedSection animation="fade-up">
              <div className="max-w-3xl mx-auto text-center">
                {/* Brand Logo Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg" style={{ background: `${brand.color}20`, border: `2px solid ${brand.color}40` }}>
                  <svg viewBox="0 0 24 24" className="w-10 h-10" fill={brand.color} stroke="none">
                    <path d={brand.logoPath} />
                    {brand.logoPath2 && <path d={brand.logoPath2} />}
                  </svg>
                </div>

                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm text-white/80 mb-5 border border-white/15">
                  <Building2 className="h-3.5 w-3.5" /> Fundada em {brand.fundacao} • <MapPin className="h-3.5 w-3.5" /> {brand.sede}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] mb-5">
                  Assistência Técnica{" "}
                  <span style={{ color: brand.color === "#000000" ? "hsl(var(--accent))" : brand.color }}>{brand.name}</span>
                  <span className="block text-xl md:text-2xl text-white/85 font-normal mt-3">em Curitiba e Região Metropolitana</span>
                </h1>

                <p className="text-white/85 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">{brand.description}</p>

                <div className="flex flex-wrap justify-center gap-4">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white rounded-full px-8 py-6 text-base shadow-lg cta-pulse">
                      <MessageCircle className="h-5 w-5" /> Chamar o técnico dessa marca
                    </Button>
                  </a>
                  <Link to="/servicos">
                    <Button variant="outline" className="gap-2 rounded-full px-8 py-6 text-base border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 font-semibold backdrop-blur-xs">
                      Ver Serviços <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* ═══ Serviços que oferecemos ═══ */}
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 text-center">
                Serviços <span className="gradient-text">{brand.name}</span> que Realizamos
              </h2>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {brand.servicos.map((s, i) => (
                <AnimatedSection key={i} delay={80 * i}>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <Wrench className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{s}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Novidades ═══ */}
        <section className="py-14 bg-muted/30 border-y border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-[100px]" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2 text-center">
                <Newspaper className="inline h-6 w-6 text-accent mr-2 -mt-1" />
                Novidades {brand.name}
              </h2>
              <p className="text-center text-muted-foreground mb-8">Últimas atualizações e lançamentos</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {brand.novidades.map((n, i) => (
                <AnimatedSection key={i} delay={120 * i}>
                  <article className="rounded-xl bg-card border border-border p-6 h-full hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{new Date(n.data).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2 text-base">{n.titulo}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{n.texto}</p>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Problemas Comuns ═══ */}
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 text-center">
                <AlertTriangle className="inline h-6 w-6 text-accent mr-2 -mt-1" />
                Problemas Comuns em {brand.name}
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {brand.problemasComuns.map((p, i) => (
                <AnimatedSection key={i} delay={100 * i}>
                  <div className="rounded-xl bg-card border border-border p-6 h-full hover:border-accent/30 hover:shadow-md transition-all duration-300">
                    <h3 className="font-bold text-foreground mb-3 text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      {p.problema}
                    </h3>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.solucao}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Dicas de Manutenção ═══ */}
        <section className="py-14 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 text-center">
                <Lightbulb className="inline h-6 w-6 text-accent mr-2 -mt-1" />
                Dicas de Manutenção {brand.name}
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {brand.dicasManutencao.map((d, i) => (
                <AnimatedSection key={i} delay={80 * i}>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/20 transition-all duration-300">
                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-accent">{i + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Outras marcas ═══ */}
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h3 className="text-lg font-heading font-bold text-foreground mb-5 text-center">
                Outras Marcas que Atendemos
              </h3>
            </AnimatedSection>
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {brandsData.filter((b) => b.slug !== brand.slug).map((b) => (
                <Link
                  key={b.slug}
                  to={`/marcas/${b.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:border-accent/30 border border-transparent transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill={b.color} stroke="none">
                    <path d={b.logoPath} />
                  </svg>
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <AnimatedSection animation="fade-up">
          <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 premium-gradient opacity-95" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] animate-breathe" style={{ background: `${brand.color}10` }} />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                  Precisa de Assistência {brand.name}?
                </h2>
                <p className="text-white/85 mb-8 text-lg">
                  Técnico especializado com mais de 20 anos de experiência. Atendimento a domicílio em Curitiba e região.
                </p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white rounded-full px-10 py-6 text-lg shadow-lg cta-pulse">
                    <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default MarcaPage;
