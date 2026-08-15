import { useEffect, useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import { RealImageSection } from "@/components/RealImageSection";
import { Button } from "@/components/ui/button";
import { trackPageView, trackCTAClick, trackFaqToggle } from "@/lib/analytics";
import cftvHero from "@/assets/cftv-hero.jpg";
import {
  MessageCircle,
  Shield,
  Eye,
  Smartphone,
  Moon,
  HardDrive,
  CheckCircle2,
  
  AlertTriangle,
  Clock,
  MapPin,
  
  Camera,
  Lock,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";
const WHATSAPP_CFTV_MESSAGE = "Olá! Tenho interesse no Kit 4 Câmeras Intelbras com instalação. Gostaria de mais informações.";

const CFTVPage = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_CFTV_MESSAGE)}`;

  useEffect(() => {
    document.title = "Kit 4 Câmeras de Segurança Intelbras | Instalação Profissional em Curitiba e Região | R$ 1.350";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content",
        "Kit 4 Câmeras Intelbras com instalação profissional inclusa e acesso remoto pelo celular. R$ 1.350 completo. Atendemos Curitiba, São José dos Pinhais, Itapoá e Guaratuba. Desde 1998. WhatsApp."
      );
    }
    trackPageView("/cftv", "CFTV");
  }, []);

  const handleCTAClick = (location: string) => {
    trackCTAClick("whatsapp", location);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title="Kit 4 Câmeras de Segurança Intelbras | Instalação Profissional em Curitiba e Região | R$ 1.350" description="Kit 4 Câmeras Intelbras com instalação profissional inclusa e acesso remoto pelo celular. R$ 1.350 completo. Atendemos Curitiba, São José dos Pinhais, Itapoá e Guaratuba. Desde 1998. WhatsApp." path="/cftv" noindex breadcrumbs={[{ name: "Início", path: "/" }, { name: "CFTV", path: "/cftv" }]} />
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Kit 4 Câmeras de Segurança Intelbras com Instalação",
        "description": "Kit completo com 4 câmeras Intelbras, DVR, HD, cabos e instalação profissional inclusa. Acesso remoto pelo celular.",
        "brand": { "@type": "Brand", "name": "Intelbras" },
        "offers": {
          "@type": "Offer",
          "price": "1350.00",
          "priceCurrency": "BRL",
          "availability": "https://schema.org/InStock",
          "seller": { "@type": "Organization", "name": "Mileuma Soluções / Mestre dos Serviços" }
        }
        // aggregateRating removido: sem reviews reais verificadas para este produto.
      })}} />

      <Header />

      <main>
        {/* HERO */}
        <section className="relative pt-10 md:pt-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={cftvHero} alt="Câmeras de segurança Intelbras instaladas" className="w-full h-full object-cover" loading="eager" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
          </div>

          <div className="container mx-auto relative z-10 py-16 md:py-24 lg:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-accent text-sm font-semibold">Desde 1998 protegendo patrimônios</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
                Sua Família e Patrimônio Protegidos <span className="text-accent">24 Horas por Dia</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl">
                Kit 4 Câmeras Intelbras com <strong>instalação profissional inclusa</strong> e acesso remoto pelo celular. Tudo por um investimento único.
              </p>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl md:text-5xl font-bold text-accent">R$ 1.350</span>
                <span className="text-white/70 text-lg">pacote completo</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="heroWhatsapp" size="xl" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleCTAClick("hero")}>
                    <MessageCircle className="h-6 w-6" />
                    Quero Proteger Meu Imóvel
                  </a>
                </Button>
                <Button variant="heroCta" size="xl" asChild>
                  <a href="#oferta">
                    <Eye className="h-6 w-6" />
                    Ver Detalhes do Kit
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 mt-8 text-white/80 text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Instalação conforme a disponibilidade da agenda</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Garantia de 1 ano</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Sem mensalidade</span>
              </div>
            </div>
          </div>
        </section>

        {/* DOR / PROBLEMAS */}
        <section className="py-12 md:py-20 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
                Você Ainda Deixa Seu Imóvel <span className="text-destructive">Desprotegido?</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A cada 5 minutos, um imóvel sem monitoramento é alvo de tentativa de invasão no Brasil.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: AlertTriangle, title: "Medo ao sair de casa", desc: "Você sai para trabalhar e fica com aquela sensação de que algo pode acontecer. Sem câmeras, não tem como saber o que está ocorrendo." },
                { icon: Moon, title: "Noites inseguras", desc: "Barulhos durante a madrugada e nenhuma visibilidade do que acontece do lado de fora. A escuridão é aliada dos invasores." },
                { icon: Lock, title: "Comércio vulnerável", desc: "Funcionários, estoque, caixa — tudo exposto. Sem vigilância, qualquer incidente vira prejuízo sem provas." },
              ].map((item, i) => (
                <div key={i} className="bg-background rounded-xl p-6 border border-destructive/10 shadow-xs">
                  <div className="bg-destructive/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUÇÃO - O KIT */}
        <section id="oferta" className="py-12 md:py-20 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
                Kit Completo de Segurança <span className="text-accent">Intelbras</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tudo o que você precisa para monitorar seu imóvel 24h, de qualquer lugar do mundo.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-6">
              {[
                { icon: Camera, title: "4 Câmeras HD Intelbras", desc: "Câmeras de alta definição da marca amplamente utilizada no Brasil. Imagem nítida em qualquer condição." },
                { icon: Moon, title: "Visão Noturna Infravermelho", desc: "Enxergue tudo mesmo no escuro total. As câmeras captam imagens de alta qualidade em até 30 metros." },
                { icon: HardDrive, title: "DVR + HD para Gravação 24h", desc: "Gravador digital com HD incluso. Armazena dias de gravação contínua com acesso ao histórico." },
                { icon: Smartphone, title: "Acesso Remoto pelo Celular", desc: "Veja suas câmeras ao vivo de qualquer lugar pelo app no celular. Android e iPhone." },
                { icon: Zap, title: "Instalação Profissional Inclusa", desc: "Técnicos especializados fazem toda a instalação, fiação e configuração. Você não precisa se preocupar." },
                { icon: Shield, title: "Garantia de 1 Ano", desc: "Garantia completa no equipamento e na mão de obra. Suporte técnico sempre que precisar." },
              ].map((item, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-6 border border-primary/5 hover:border-accent/30 transition-all hover:shadow-md">
                  <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* PREÇO DESTAQUE */}
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-8 md:p-10 text-center shadow-xl">
              <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Investimento Único</p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl md:text-6xl font-bold text-accent">R$ 1.350</span>
              </div>
              <p className="text-white/70 mb-6">Kit completo + Instalação + Configuração remota</p>

              <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
                {[
                  "4 Câmeras HD Intelbras",
                  "DVR 4 canais + HD de gravação",
                  "Cabos, conectores e fonte",
                  "Instalação profissional completa",
                  "Configuração do app no celular",
                  "Garantia de 1 ano",
                  "Sem mensalidade — é seu para sempre",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button variant="heroWhatsapp" size="xl" className="w-full sm:w-auto animate-pulse-soft" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleCTAClick("oferta")}>
                  <MessageCircle className="h-6 w-6" />
                  Garantir Meu Kit Agora
                </a>
              </Button>

              <p className="text-white/80 text-xs mt-4">* Vagas limitadas por semana. Instalação sujeita a agenda.</p>
            </div>
          </div>
        </section>

        {/* PÚBLICO-ALVO */}
        <section className="py-8 md:py-10 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary text-center mb-6">
              Para Quem É Este Kit?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { emoji: "🏠", title: "Residências", desc: "Proteja sua família e seu lar. Saiba quem está na porta antes de abrir." },
                { emoji: "🏪", title: "Comércios", desc: "Monitore funcionários, clientes e estoque. Reduza furtos e tenha provas." },
                { emoji: "🏢", title: "Condomínios", desc: "Segurança nas áreas comuns, portaria e garagem. Valorize o imóvel." },
                { emoji: "💼", title: "Escritórios", desc: "Controle o acesso e proteja documentos e equipamentos da empresa." },
              ].map((item, i) => (
                <div key={i} className="bg-background rounded-xl p-6 border border-primary/5 text-center hover:shadow-md transition-shadow">
                  <span className="text-4xl mb-4 block">{item.emoji}</span>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROVA SOCIAL */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3">
                Por que instalar seu CFTV com a gente
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Atendimento local e direto em Curitiba e região, com projeto adequado ao seu imóvel,
                valor aprovado antes da instalação e sem promessa que não podemos cumprir.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {[
                { title: "Projeto sob medida", desc: "Definimos pontos de câmera e cobertura conforme a planta do seu imóvel." },
                { title: "Acesso pelo celular", desc: "Configuramos o monitoramento remoto para você ver as imagens de onde estiver." },
                { title: "Instalação organizada", desc: "Cabeamento limpo, equipamentos testados e orientação de uso na entrega." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* COBERTURA */}
        <section className="py-8 md:py-10 bg-muted/50">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
              Onde Atendemos
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Instalação profissional em toda a região. Agende e receba o técnico no dia combinado.
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {["Curitiba", "São José dos Pinhais", "Araucária", "Campo Largo", "Pinhais", "Itapoá", "Guaratuba", "Litoral do PR"].map((city) => (
                <span key={city} className="inline-flex items-center gap-1.5 bg-background border border-primary/10 rounded-full px-4 py-2 text-sm text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  {city}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Cidades Atendidas */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary text-center mb-4">
              CFTV na Sua Cidade
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
              Páginas dedicadas com informações de instalação para cada região atendida.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { name: "Curitiba", path: "/cftv/curitiba" },
                { name: "São José dos Pinhais", path: "/cftv/sao-jose-dos-pinhais" },
                { name: "Araucária", path: "/cftv/araucaria" },
                { name: "Campo Largo", path: "/cftv/campo-largo" },
                { name: "Pinhais", path: "/cftv/pinhais" },
                { name: "Litoral do PR", path: "/cftv/litoral" },
                { name: "Guaratuba", path: "/cftv/guaratuba" },
              ].map((city) => (
                <a key={city.path} href={city.path} className="flex items-center gap-2 bg-muted/30 border border-primary/10 rounded-xl px-5 py-4 hover:border-accent/30 hover:shadow-md transition-all group">
                  <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium text-sm group-hover:text-accent transition-colors">{city.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Artigos Relacionados */}
        <section className="py-8 md:py-10 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary text-center mb-4">
              Artigos Sobre Segurança Eletrônica
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { title: "Câmera Wi-Fi ou DVR: Qual Escolher?", slug: "diferenca-camera-wifi-dvr-qual-escolher", excerpt: "Entenda as diferenças técnicas entre câmeras Wi-Fi e sistemas DVR." },
                { title: "Segurança em Casas de Praia", slug: "seguranca-casas-praia-itapoa-guaratuba", excerpt: "Imóveis de veraneio ficam meses desocupados e são alvos fáceis." },
                { title: "Como Escolher o Melhor Kit de Câmeras", slug: "como-escolher-melhor-kit-cameras-seguranca", excerpt: "Guia completo para escolher o kit ideal de CFTV." },
                { title: "Monitoramento 24 Horas", slug: "monitoramento-24-horas-como-funciona", excerpt: "Saiba como funciona a gravação contínua e o acesso remoto." },
                { title: "Equipe Especializada no Litoral", slug: "equipe-especializada-cftv-litoral-parana", excerpt: "Por que contratar profissionais para instalação no litoral." },
              ].map((article) => (
                <a key={article.slug} href={`/blog/${article.slug}`} className="bg-background rounded-xl p-5 border border-primary/5 hover:border-accent/30 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-foreground text-sm mb-1">{article.title}</h3>
                  <p className="text-muted-foreground text-xs">{article.excerpt}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />

        {/* MATÉRIA EDUCATIVA */}
        <ArticleSection />

        {/* CTA FINAL */}
        <section className="py-10 md:py-24 hero-gradient">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Não Espere Acontecer Para Agir
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Proteja quem você ama e o que é seu. Kit completo Intelbras com instalação por <strong className="text-accent">R$ 1.350</strong>.
            </p>
            <Button variant="heroWhatsapp" size="xl" className="animate-pulse-soft" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => handleCTAClick("cta_final")}>
                <MessageCircle className="h-6 w-6" />
                Quero Garantir Meu Atendimento Agora
              </a>
            </Button>
            <p className="text-white/80 text-sm mt-4">Vagas limitadas por semana • Instalação sujeita a agenda</p>
          </div>
        </section>
      </main>

      <RealImageSection imageKey="cameraSeguranca" caption="Câmera de segurança CFTV instalada profissionalmente" />
      <BlocoInteligencia compact />
      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

/* ============ FAQ ============ */
const faqs = [
  { q: "Precisa pagar mensalidade?", a: "Não! O kit é 100% seu. Você paga uma única vez e tem monitoramento para sempre, sem mensalidades ou taxas recorrentes. O acesso remoto pelo celular também é gratuito." },
  { q: "Tem garantia?", a: "Sim. Todos os equipamentos possuem garantia de 1 ano do fabricante (Intelbras). A instalação também tem garantia de mão de obra por 1 ano." },
  { q: "Demora para instalar?", a: "A instalação padrão leva de 2 a 4 horas, dependendo da estrutura do imóvel. Agendamos o melhor dia e horário para você." },
  { q: "Funciona à noite?", a: "Sim! As câmeras possuem infravermelho que permite visão noturna de até 30 metros, mesmo em escuridão total." },
  { q: "Consigo ver pelo celular de qualquer lugar?", a: "Sim! Após a instalação, configuramos o aplicativo no seu celular (Android ou iPhone) para que você assista ao vivo e acesse gravações de qualquer lugar do mundo com internet." },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary text-center mb-6">
          Perguntas Frequentes
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-primary/10 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left bg-muted/30 hover:bg-muted/50 transition-colors"
                onClick={() => {
                  const willOpen = open !== i;
                  trackFaqToggle(faq.q, willOpen ? "open" : "close", "faq_cftv", i);
                  setOpen(willOpen ? i : null);
                }}
              >

                <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                {open === i ? <ChevronUp className="h-5 w-5 text-accent flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="p-5 bg-background text-muted-foreground text-sm leading-relaxed border-t border-primary/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ MATÉRIA EDUCATIVA ============ */
const ArticleSection = () => (
  <section className="py-12 md:py-20 bg-muted/50">
    <div className="container mx-auto max-w-3xl">
      <article>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6">
          Por Que o Índice de Roubos Cai Drasticamente em Imóveis com Câmeras Visíveis?
        </h2>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-4">
          <p>
            Dados do <strong>Anuário Brasileiro de Segurança Pública</strong> mostram que imóveis 
            com sistemas de videomonitoramento visíveis registram até <strong>67% menos tentativas de 
            invasão</strong> em comparação com propriedades sem câmeras. Esse número, que se repete 
            em estudos internacionais, revela um padrão claro: a visibilidade do equipamento funciona 
            como a primeira barreira de proteção.
          </p>
          <p>
            Pesquisadores da Universidade de Cambridge identificaram que criminosos fazem uma avaliação 
            rápida de risco antes de agir. A presença de câmeras altera diretamente esse cálculo, 
            tornando o imóvel um alvo de <strong>alto risco</strong> — e, portanto, descartado na maioria dos casos.
          </p>
          <p>
            No Paraná, o cenário é particularmente relevante. Curitiba e região metropolitana registraram 
            aumento de <strong>12% nos furtos a residências</strong> em áreas sem monitoramento eletrônico 
            nos últimos dois anos, segundo levantamento da Secretaria de Segurança Pública do Estado.
          </p>

          <h3 className="text-lg font-heading font-bold text-primary mt-6">O efeito deterrente</h3>
          <p>
            Especialistas chamam esse fenômeno de <em>"efeito deterrente"</em>: o criminoso desiste ao 
            perceber que será identificado e que as imagens podem ser usadas como prova judicial. Câmeras 
            com visão noturna e gravação contínua potencializam esse efeito, pois eliminam qualquer janela 
            de atuação "invisível".
          </p>

          <h3 className="text-lg font-heading font-bold text-primary mt-6">O monitoramento remoto como aliado</h3>
          <p>
            A evolução tecnológica permitiu que proprietários acessem as câmeras em tempo real pelo celular, 
            de qualquer lugar do mundo. Isso significa que, mesmo em viagens ou durante o horário comercial, 
            o imóvel está sob vigilância constante. Casos em que moradores acionaram a Polícia Militar ao 
            vivo, observando invasores pelas câmeras remotas, já são rotina em boletins de ocorrência.
          </p>

          <h3 className="text-lg font-heading font-bold text-primary mt-6">O investimento que se paga</h3>
          <p>
            Um kit de 4 câmeras profissionais com instalação inclusa custa, em média, menos do que o 
            prejuízo de um único furto residencial. Quando se considera que o equipamento funciona 24 horas 
            por dia, 365 dias por ano, sem mensalidade, o retorno sobre o investimento é inquestionável.
          </p>

          <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mt-6">
            <p className="text-foreground font-semibold text-sm">
              💡 A Mileuma Soluções / Mestre dos Serviços realiza instalação profissional de kits Intelbras em 
              Curitiba, São José dos Pinhais e Litoral do Paraná desde 1998. Kit completo a partir de R$ 1.350 
              com garantia de 1 ano.
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
);

export default CFTVPage;
