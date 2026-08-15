import { Link } from "@/lib/router-compat";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FloatingParticles } from "@/components/FloatingParticles";
import { brandsData } from "@/lib/brandsData";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";
import {
  ArrowRight, Monitor, Cpu, HardDrive, Smartphone, Wifi,
  Shield, Wrench, MessageCircle, ChevronRight, Building2, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP = "5541997086380";

const categorias = [
  {
    titulo: "Computadores & Notebooks",
    descricao: "Dell, HP, Lenovo, ASUS, Acer, Positivo, Apple, MSI, Gigabyte",
    icon: Monitor,
    slugs: ["dell", "hp", "lenovo", "asus", "acer", "positivo", "apple", "msi", "gigabyte"],
  },
  {
    titulo: "Processadores & Componentes",
    descricao: "Intel, AMD, NVIDIA, Kingston, Corsair, MSI, Gigabyte",
    icon: Cpu,
    slugs: ["intel", "amd", "nvidia", "kingston", "corsair", "msi", "gigabyte"],
  },
  {
    titulo: "Periféricos & Gaming",
    descricao: "Razer, Logitech, Corsair",
    icon: Smartphone,
    slugs: ["razer", "logitech", "corsair"],
  },
  {
    titulo: "Smartphones & Celulares",
    descricao: "Samsung, Motorola, Xiaomi, Apple",
    icon: Smartphone,
    slugs: ["samsung", "motorola", "xiaomi", "apple"],
  },
  {
    titulo: "TVs & Entretenimento",
    descricao: "Samsung, LG, Sony",
    icon: Monitor,
    slugs: ["samsung", "lg", "sony"],
  },
  {
    titulo: "Armazenamento",
    descricao: "Western Digital, Seagate, Kingston, Samsung",
    icon: HardDrive,
    slugs: ["western-digital", "seagate", "kingston", "samsung"],
  },
  {
    titulo: "Redes & Segurança",
    descricao: "TP-Link, Intelbras, ASUS",
    icon: Wifi,
    slugs: ["tp-link", "intelbras", "asus"],
  },
  {
    titulo: "Software & Sistemas",
    descricao: "Microsoft Windows, Office 365, drivers",
    icon: HardDrive,
    slugs: ["microsoft"],
  },
];

const Marcas = () => {
  useEffect(() => {
    trackPageView("/marcas", "Marcas Atendidas");
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá! Preciso de assistência técnica para meu equipamento.")}`;

  return (
    <div className="min-h-screen bg-background">
      <PageSEO noindex
        title="Marcas Atendidas | Assistência Técnica Especializada em Curitiba"
        description="Assistência técnica especializada nas principais marcas: Dell, HP, Lenovo, ASUS, Samsung, LG, Apple, Intel, AMD, NVIDIA e mais. Atendimento a domicílio em Curitiba e região."
        path="/marcas"
        breadcrumbs={[{ name: "Início", path: "/" }, { name: "Marcas", path: "/marcas" }]}
      />
      <Header />

      <main>
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 premium-gradient" />
          <FloatingParticles count={20} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.06] blur-[120px] animate-breathe" />
            <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px] animate-float" />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />

          <div className="container mx-auto relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 px-4">
            <AnimatedSection animation="fade-up">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm text-white/80 mb-6 border border-white/15">
                  <Shield className="h-3.5 w-3.5" /> {brandsData.length}+ marcas atendidas com especialização
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] mb-5">
                  Marcas que{" "}
                  <span className="gradient-text">Atendemos</span>
                  <span className="block text-xl md:text-2xl text-white/85 font-normal mt-3">
                    Assistência técnica especializada por marca
                  </span>
                </h1>

                <p className="text-white/55 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                  Mais de 20 anos de experiência com as principais marcas do mercado. Cada marca tem suas particularidades — e nós conhecemos todas.
                </p>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white rounded-full px-8 py-6 text-base shadow-lg cta-pulse">
                    <MessageCircle className="h-5 w-5" /> Falar sobre a minha marca
                  </Button>
                </a>
              </div>
            </AnimatedSection>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* ═══ Grid de Todas as Marcas ═══ */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 text-center">
                Todas as <span className="gradient-text">Marcas</span>
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
                Clique em uma marca para ver serviços especializados, problemas comuns, dicas de manutenção e novidades.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {brandsData.map((brand, i) => (
                <AnimatedSection key={brand.slug} delay={60 * i}>
                  <Link
                    to={`/marcas/${brand.slug}`}
                    className="group flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border hover:border-accent/40 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at center, ${brand.color}10 0%, transparent 70%)` }}
                    />

                    <div
                      className="relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${brand.color}15`, border: `1.5px solid ${brand.color}30` }}
                    >
                      <svg viewBox="0 0 24 24" className="w-7 h-7" fill={brand.color} stroke="none">
                        <path d={brand.logoPath} />
                        {brand.logoPath2 && <path d={brand.logoPath2} />}
                      </svg>
                    </div>

                    <div className="text-center relative z-10">
                      <h3 className="font-bold text-foreground text-sm group-hover:text-accent transition-colors">{brand.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {brand.servicos.length} serviços
                      </p>
                    </div>

                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Categorias ═══ */}
        <section className="py-16 bg-muted/30 border-y border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/[0.02] rounded-full blur-[120px]" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 text-center">
                Marcas por <span className="gradient-text">Categoria</span>
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
                Encontre a assistência certa para o seu tipo de equipamento.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {categorias.map((cat, i) => {
                const Icon = cat.icon;
                const marcasDaCategoria = brandsData.filter(b => cat.slugs.includes(b.slug));
                return (
                  <AnimatedSection key={cat.titulo} delay={100 * i}>
                    <div className="rounded-xl bg-card border border-border p-6 hover:border-accent/30 hover:shadow-lg transition-all duration-300 h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-sm">{cat.titulo}</h3>
                          <p className="text-xs text-muted-foreground">{cat.descricao}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {marcasDaCategoria.map(brand => (
                          <Link
                            key={brand.slug}
                            to={`/marcas/${brand.slug}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:text-foreground hover:bg-accent/10 border border-transparent hover:border-accent/30 transition-all duration-200"
                          >
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0" fill={brand.color} stroke="none">
                              <path d={brand.logoPath} />
                            </svg>
                            {brand.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ Destaques rápidos ═══ */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 text-center">
                <Wrench className="inline h-6 w-6 text-accent mr-2 -mt-1" />
                O que Fazemos por <span className="gradient-text">Cada Marca</span>
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
                Cada página de marca traz conteúdo exclusivo e aprofundado.
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {[
                { icon: Wrench, titulo: "Serviços Especializados", desc: "Lista completa de serviços para cada marca, com detalhes técnicos" },
                { icon: Shield, titulo: "Problemas Comuns", desc: "Os defeitos mais frequentes e soluções comprovadas para cada fabricante" },
                { icon: Building2, titulo: "Novidades & Lançamentos", desc: "Últimas notícias, novos modelos e atualizações de cada marca" },
                { icon: Calendar, titulo: "Dicas de Manutenção", desc: "Orientações preventivas para prolongar a vida útil do seu equipamento" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <AnimatedSection key={item.titulo} delay={80 * i}>
                    <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-accent/20 hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-bold text-foreground text-sm mb-2">{item.titulo}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ Top 5 marcas destaque ═══ */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-10 text-center">
                Marcas Mais <span className="gradient-text">Procuradas</span>
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {brandsData.slice(0, 6).map((brand, i) => (
                <AnimatedSection key={brand.slug} delay={100 * i}>
                  <Link to={`/marcas/${brand.slug}`} className="group block">
                    <div className="rounded-xl bg-card border border-border p-6 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden">
                      <div
                        className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `${brand.color}10` }}
                      />

                      <div className="flex items-start gap-4 mb-4 relative z-10">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${brand.color}15`, border: `1.5px solid ${brand.color}30` }}
                        >
                          <svg viewBox="0 0 24 24" className="w-6 h-6" fill={brand.color} stroke="none">
                            <path d={brand.logoPath} />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{brand.name}</h3>
                          <p className="text-xs text-muted-foreground">{brand.fundacao} · {brand.sede.split(",")[0]}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 relative z-10">
                        {brand.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
                        {brand.servicos.slice(0, 3).map((s, j) => (
                          <span key={j} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center text-xs text-accent font-medium group-hover:gap-2 transition-all relative z-10">
                        Ver página completa <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <AnimatedSection animation="fade-up">
          <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 premium-gradient opacity-95" />
            <FloatingParticles count={12} />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/[0.06] blur-[120px] animate-breathe" />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                  Não encontrou sua marca?
                </h2>
                <p className="text-white/85 mb-8 text-lg">
                  Atendemos todas as marcas de computadores, notebooks, celulares e TVs. Entre em contato e informe o modelo do seu equipamento.
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

export default Marcas;
