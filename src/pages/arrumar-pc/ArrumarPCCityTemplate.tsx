import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { PageSEO } from "@/components/PageSEO";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { CTASection } from "@/components/CTASection";
import { trackPageView } from "@/lib/analytics";
import { getCityOgImage, getCityHeroImage } from "./cityImages";
import {
  ShieldCheck,
  Wifi,
  Zap,
  Wrench,
  MapPin,
  CreditCard,
} from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";

export type CityData = {
  slug: string; // e.g. "sao-paulo"
  cidade: string; // e.g. "São Paulo"
  estado: string; // e.g. "SP"
  estadoNome: string; // e.g. "São Paulo"
  regiao?: string; // e.g. "Sudeste"
};

const beneficios = [
  {
    icon: Wifi,
    title: "Atendimento 100% remoto",
    description:
      "Sem precisar sair de casa: tudo pelo WhatsApp + AnyDesk/TeamViewer com sessão autorizada por você.",
  },
  {
    icon: Zap,
    title: "Resposta rápida",
    description:
      "Diagnóstico em minutos. A maioria dos problemas é resolvida em uma única sessão.",
  },
  {
    icon: ShieldCheck,
    title: "Paga só se resolver",
    description:
      "atendimento sem compromisso antes do serviço. PIX, cartão ou boleto após o problema ser resolvido.",
  },
  {
    icon: Wrench,
    title: "Técnico de verdade",
    description:
      "+20 anos atendendo Windows, Mac e Linux. Você fala direto com o técnico, sem robô e sem call center.",
  },
];

const problemasComuns = [
  "PC ou notebook lento",
  "Tela azul / travamentos",
  "Remoção de vírus / ransomware",
  "Formatar Windows e reinstalar",
  "Wi-Fi caindo ou sem conexão",
  "Instalar impressora / drivers",
  "Recuperar arquivos apagados",
  "Configurar e-mail (Outlook / Gmail)",
  "Backup e migração para nuvem",
  "Otimização para games e trabalho",
];

export const ArrumarPCCityTemplate = ({ data }: { data: CityData }) => {
  const path = `/arrumar-pc/${data.slug}`;
  const title = `Arrumar PC em ${data.cidade} ${data.estado} — Técnico online | Técnico Curitiba`;
  const description = `Técnico de informática online para ${data.cidade}/${data.estado}. Formatação, vírus, lentidão, tela azul e Wi-Fi via WhatsApp + acesso remoto. atendimento sem compromisso, paga só se resolver.`;
  const msg = `Olá! Estou em ${data.cidade}/${data.estado} e preciso arrumar meu PC pelo atendimento remoto.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  useEffect(() => {
    trackPageView(path, title);
  }, [path, title]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Arrumar PC online em ${data.cidade}`,
    serviceType: "Suporte técnico remoto de informática",
    provider: {
      "@type": "Organization",
      name: "Técnico Curitiba",
      url: "https://tecnico.curitiba.br",
    },
    areaServed: {
      "@type": "City",
      name: data.cidade,
      containedInPlace: { "@type": "State", name: data.estadoNome },
    },
    description,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: `https://tecnico.curitiba.br${path}`,
    },
  };

  const faqs = [
    {
      q: `Vocês atendem em ${data.cidade}?`,
      a: `Sim. O atendimento é 100% remoto via WhatsApp + AnyDesk/TeamViewer e funciona em qualquer bairro de ${data.cidade}/${data.estado}. Basta ter internet.`,
    },
    {
      q: "Quanto custa para arrumar o PC?",
      a: "O diagnóstico é gratuito. Você recebe o valor antes do serviço e só paga se aprovar e o problema for resolvido.",
    },
    {
      q: "É seguro deixar acessar meu computador?",
      a: "Sim. Usamos AnyDesk e TeamViewer (ferramentas oficiais), sessão autorizada por você a cada acesso. Você vê tudo na tela e pode encerrar com um clique.",
    },
    {
      q: "Tem garantia?",
      a: "Sim. Todo serviço executado tem garantia. Se o mesmo problema voltar, refazemos sem custo.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const heroSet = getCityHeroImage(data.slug);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={title}
        description={description}
        path={path}
        noindex
        ogImage={getCityOgImage(data.slug)}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Arrumar PC", path: "/arrumar-pc" },
          { name: data.cidade, path },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        {heroSet && (
          <link
            rel="preload"
            as="image"
            href={heroSet.preloadHref}
            type={heroSet.preloadType}
            // @ts-expect-error - react-helmet passes attrs through
            imagesrcset={heroSet.webpSrcset || heroSet.jpgSrcset}
            imagesizes={heroSet.sizes}
            fetchPriority="high"
          />
        )}
      </Helmet>

      <Header />

      <main>
        <PageHero
          title={`Arrumar PC em ${data.cidade} — atendimento online`}
          subtitle={`Técnico de informática para ${data.cidade}/${data.estado} via WhatsApp + acesso remoto seguro. Diagnóstico grátis, paga só se resolver.`}
          ctaText="Chamar Técnico no WhatsApp"
          heroImage={heroSet}
          heroImageAlt={`Técnico online arrumando PC em ${data.cidade} - ${data.estadoNome}`}
        />



        <BenefitsGrid
          benefits={beneficios}
          title={`Por que escolher para ${data.cidade}`}
          subtitle="Atendimento direto com técnico, valor transparente, garantia em todo serviço."
        />

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Problemas que resolvemos em {data.cidade}
            </h2>
            <p className="text-muted-foreground text-lg">
              Mais de 90% dos chamados de PC e notebook em {data.estadoNome} são resolvidos
              remotamente, sem visita técnica.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {problemasComuns.map((p) => (
              <a
                key={p}
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
                    {p}
                  </p>
                  <p className="text-xs text-muted-foreground">Chamar técnico agora →</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-secondary/40 py-12">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Atendimento remoto para todo o {data.estadoNome}
            </h2>
            <p className="text-muted-foreground mb-6">
              Estamos baseados em Curitiba (PR) e atendemos clientes de {data.cidade} e
              região por acesso remoto seguro. Mesmo padrão de qualidade da nossa
              assistência presencial.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> Sessão autorizada por você
              </span>
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-accent" /> PIX, cartão e boleto
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> {data.cidade}/{data.estado}
              </span>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Serviços específicos para {data.cidade}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                ["formatacao-windows", "Formatação de Windows"],
                ["remocao-de-virus", "Remoção de Vírus"],
                ["pc-lento", "PC Lento"],
                ["tela-azul", "Tela Azul"],
                ["wifi-e-internet", "Wi-Fi e Internet"],
                ["recuperacao-de-arquivos", "Recuperação de Arquivos"],
              ].map(([slug, nome]) => (
                <Link
                  key={slug}
                  to={`/arrumar-pc/servico/${slug}/${data.slug}`}
                  className="px-4 py-3 rounded-lg border border-border bg-card hover:border-accent hover:text-accent text-sm font-medium text-center transition-colors"
                >
                  {nome} em {data.cidade}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
              Perguntas frequentes — {data.cidade}
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
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary/40 py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">
              Atendemos também outras cidades
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
              {[
                ["São Paulo", "/arrumar-pc/sao-paulo"],
                ["Rio de Janeiro", "/arrumar-pc/rio-de-janeiro"],
                ["Belo Horizonte", "/arrumar-pc/belo-horizonte"],
                ["Brasília", "/arrumar-pc/brasilia"],
                ["Porto Alegre", "/arrumar-pc/porto-alegre"],
                ["Florianópolis", "/arrumar-pc/florianopolis"],
                ["Salvador", "/arrumar-pc/salvador"],
                ["Recife", "/arrumar-pc/recife"],
                ["Fortaleza", "/arrumar-pc/fortaleza"],
                ["Manaus", "/arrumar-pc/manaus"],
              ]
                .filter(([, url]) => url !== path)
                .map(([nome, url]) => (
                  <Link
                    key={url}
                    to={url}
                    className="px-3 py-2 rounded-lg border border-border bg-card hover:border-accent hover:text-accent text-center transition-colors"
                  >
                    {nome}
                  </Link>
                ))}
            </div>
            <div className="text-center mt-6">
              <Link
                to="/arrumar-pc"
                className="text-accent font-semibold hover:underline"
              >
                Ver hub nacional — Arrumar PC Brasil →
              </Link>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default ArrumarPCCityTemplate;
