import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { PageSEO } from "@/components/PageSEO";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CTASection } from "@/components/CTASection";
import { trackPageView } from "@/lib/analytics";
import {
  Monitor,
  Laptop,
  ShieldCheck,
  Wifi,
  Zap,
  Wrench,
  MessageCircle,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

const WHATSAPP_NUMBER = "5541997086380";
const WHATSAPP_MSG =
  "Olá! Quero arrumar meu PC. Pode me ajudar via atendimento remoto?";
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MSG
)}`;

const beneficios = [
  {
    icon: Wifi,
    title: "Atendimento 100% online",
    description:
      "Arrume seu PC de qualquer lugar do Brasil pelo WhatsApp + acesso remoto seguro (AnyDesk/TeamViewer).",
  },
  {
    icon: Zap,
    title: "Diagnóstico em minutos",
    description:
      "Identificamos o problema rapidamente — formatação, vírus, lentidão, drivers, tela azul, Wi-Fi e mais.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia + transparência",
    description:
      "Valor antes de qualquer cobrança. Pagamento só após o problema ser resolvido. PIX, cartão ou boleto.",
  },
  {
    icon: Wrench,
    title: "Técnico de verdade",
    description:
      "+20 anos de experiência com Windows, Mac e Linux. Sem robô, sem call center — você fala direto com o técnico.",
  },
];

const problemas = [
  { slug: "pc-nao-liga", titulo: "PC ou notebook não liga" },
  { slug: "computador-lento", titulo: "Computador muito lento" },
  { slug: "tela-azul", titulo: "Tela azul / travamentos" },
  { slug: "remover-virus", titulo: "Remover vírus e ransomware" },
  { slug: "formatar-windows", titulo: "Formatar Windows / reinstalar" },
  { slug: "instalar-impressora", titulo: "Instalar impressora ou driver" },
  { slug: "wifi-nao-conecta", titulo: "Wi-Fi não conecta / cai toda hora" },
  { slug: "recuperar-arquivos", titulo: "Recuperar arquivos apagados" },
  { slug: "configurar-email", titulo: "Configurar e-mail Outlook / Gmail" },
  { slug: "backup-nuvem", titulo: "Backup e migração para nuvem" },
];

const comoFunciona = [
  {
    n: "1",
    titulo: "Chame no WhatsApp",
    desc: "Conte rapidamente o que está acontecendo com seu PC ou notebook.",
  },
  {
    n: "2",
    titulo: "Diagnóstico gratuito",
    desc: "O técnico avalia o problema e te passa o valor antes de qualquer cobrança.",
  },
  {
    n: "3",
    titulo: "Acesso remoto seguro",
    desc: "Você autoriza o acesso por AnyDesk / TeamViewer. Pode acompanhar tudo na tela.",
  },
  {
    n: "4",
    titulo: "Resolveu? Só então paga",
    desc: "PIX, cartão ou boleto. Garantia em todo serviço executado.",
  },
];

const faqs = [
  {
    q: "Vocês atendem em todo o Brasil?",
    a: "Sim. O atendimento remoto via WhatsApp + AnyDesk/TeamViewer funciona em qualquer cidade do Brasil — basta ter internet. Para visita presencial atendemos Curitiba e Região Metropolitana.",
  },
  {
    q: "É seguro deixar o técnico acessar meu PC?",
    a: "Sim. Usamos ferramentas oficiais (AnyDesk e TeamViewer) onde você precisa autorizar o acesso a cada sessão e pode encerrar com um clique. Nada é instalado sem sua permissão e você vê tudo o que o técnico faz.",
  },
  {
    q: "Quanto custa arrumar o PC online?",
    a: "Damos atendimento sem compromisso antes de iniciar. Serviços simples (configuração, instalação de driver, dicas) muitas vezes saem mais baratos que uma visita técnica. Você só paga se aprovar.",
  },
  {
    q: "Como faço o pagamento?",
    a: "PIX, cartão de crédito ou boleto. Pagamento só após o problema ser resolvido.",
  },
  {
    q: "Tem garantia?",
    a: "Sim. Todo serviço executado tem garantia. Se o mesmo problema voltar, refazemos sem custo.",
  },
];

const ArrumarPC = () => {
  useEffect(() => {
    trackPageView("/arrumar-pc", "Arrumar PC — Brasil");
  }, []);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Arrumar PC online — Técnico de informática Brasil",
    serviceType: "Suporte técnico remoto de informática",
    provider: {
      "@type": "Organization",
      name: "Técnico Curitiba",
      url: "https://tecnico.curitiba.br",
    },
    areaServed: { "@type": "Country", name: "Brasil" },
    description:
      "Atendimento remoto para arrumar PC e notebook em todo o Brasil: formatação, remoção de vírus, lentidão, tela azul, Wi-Fi, drivers, recuperação de arquivos.",
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: "https://tecnico.curitiba.br/arrumar-pc",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Arrumar PC online | Técnico de informática no Brasil"
        description="Arrume seu PC ou notebook de qualquer lugar do Brasil via WhatsApp + acesso remoto. Formatação, vírus, lentidão, tela azul, Wi-Fi. atendimento sem compromisso, paga só se resolver."
        path="/arrumar-pc"
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Arrumar PC", path: "/arrumar-pc" },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />

      <main>
        <PageHero
          title="Arrumar PC online — em qualquer lugar do Brasil"
          subtitle="Técnico de informática de verdade pelo WhatsApp + acesso remoto seguro. Diagnóstico grátis, paga só se resolver. Sem robô, sem call center."
          ctaText="Chamar Técnico no WhatsApp"
        />

        <BenefitsGrid
          benefits={beneficios}
          title="Por que arrumar seu PC com a gente"
          subtitle="Atendimento direto com o técnico, valor transparente e garantia em todo serviço."
        />

        {/* PROBLEMAS QUE RESOLVEMOS */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Problemas que resolvemos online
            </h2>
            <p className="text-muted-foreground text-lg">
              Mais de 90% dos chamados de PC são resolvidos sem o técnico sair
              do escritório — e sem você sair de casa.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {problemas.map((p) => (
              <a
                key={p.slug}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {p.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Chamar técnico agora →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="bg-secondary/40 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Como funciona o atendimento remoto
              </h2>
              <p className="text-muted-foreground text-lg">
                Simples, rápido e seguro. Você comanda o tempo todo.
              </p>
            </div>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {comoFunciona.map((step) => (
                <li
                  key={step.n}
                  className="relative p-6 rounded-2xl bg-card border border-border shadow-xs"
                >
                  <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center shadow-md">
                    {step.n}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2 mt-2">
                    {step.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap justify-center items-center gap-4 mt-10 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> Sessão autorizada por você
              </span>
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-accent" /> PIX, cartão e boleto
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> Brasil inteiro
              </span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
              Perguntas frequentes
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group p-5 rounded-xl border border-border bg-card hover:border-accent/40 transition-colors"
                >
                  <summary className="cursor-pointer font-semibold text-foreground list-none flex justify-between items-center gap-4">
                    {f.q}
                    <span className="text-accent text-2xl leading-none group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* LINKS INTERNOS — atendimento local */}
        <section className="bg-secondary/40 py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
              Está em Curitiba ou região? Atendemos a domicílio
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Para Curitiba e Região Metropolitana também temos visita técnica
              presencial.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
              {[
                ["Curitiba", "/tecnico-informatica-curitiba"],
                ["São José dos Pinhais", "/tecnico-informatica-sao-jose-dos-pinhais"],
                ["Araucária", "/tecnico-informatica-araucaria"],
                ["Pinhais", "/tecnico-informatica-pinhais"],
                ["Colombo", "/tecnico-informatica-colombo"],
                ["Campo Largo", "/tecnico-informatica-campo-largo"],
                ["Fazenda Rio Grande", "/tecnico-informatica-fazenda-rio-grande"],
                ["Almirante Tamandaré", "/tecnico-informatica-almirante-tamandare"],
              ].map(([nome, url]) => (
                <Link
                  key={url}
                  to={url}
                  className="px-3 py-2 rounded-lg border border-border bg-card hover:border-accent hover:text-accent text-center transition-colors"
                >
                  {nome}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default ArrumarPC;
