import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";
import { CTASection } from "@/components/CTASection";
import { trackPageView } from "@/lib/analytics";
import { ShieldCheck, Zap, MapPin, MessageCircle, CheckCircle2, Wrench } from "lucide-react";
import type { CityData } from "./ArrumarPCCityTemplate";
import type { ServicoData } from "./services";

const WHATSAPP_NUMBER = "5541997086380";

interface Props {
  servico: ServicoData;
  cidade: CityData;
}

export const ArrumarPCServicoCidadeTemplate = ({ servico, cidade }: Props) => {
  const path = `/arrumar-pc/servico/${servico.slug}/${cidade.slug}`;
  const title = `${servico.nome} em ${cidade.cidade} ${cidade.estado} — Técnico online | Técnico Curitiba`;
  const description = `${servico.nome} para ${cidade.cidade}/${cidade.estado} via WhatsApp + acesso remoto seguro. ${servico.descricao} atendimento sem compromisso, paga só se resolver.`;
  const msg = `Olá! Estou em ${cidade.cidade}/${cidade.estado} e preciso de ${servico.nome.toLowerCase()} pelo atendimento remoto.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  useEffect(() => {
    trackPageView(path, title);
  }, [path, title]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${servico.nome} online em ${cidade.cidade}`,
    serviceType: servico.nome,
    provider: {
      "@type": "Organization",
      name: "Técnico Curitiba",
      url: "https://tecnico.curitiba.br",
    },
    areaServed: {
      "@type": "City",
      name: cidade.cidade,
      containedInPlace: { "@type": "State", name: cidade.estadoNome },
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
      q: `Vocês fazem ${servico.nome.toLowerCase()} em ${cidade.cidade}?`,
      a: `Sim. O serviço de ${servico.nome.toLowerCase()} é feito 100% remoto via WhatsApp + AnyDesk/TeamViewer e funciona em qualquer bairro de ${cidade.cidade}/${cidade.estado}.`,
    },
    {
      q: `Quanto custa ${servico.nome.toLowerCase()} em ${cidade.cidade}?`,
      a: `O diagnóstico é gratuito. Você recebe o valor antes do serviço e só paga se aprovar e o problema for resolvido. Pagamento por PIX, cartão ou boleto.`,
    },
    {
      q: "É seguro deixar acessar meu computador?",
      a: "Sim. Usamos AnyDesk e TeamViewer (oficiais), sessão autorizada por você a cada acesso. Você vê tudo na tela e pode encerrar quando quiser.",
    },
    {
      q: "Tem garantia?",
      a: "Sim. Todo serviço executado tem garantia. Se o mesmo problema voltar, refazemos sem custo adicional.",
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

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={title}
        description={description}
        path={path}
        noindex
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Arrumar PC", path: "/arrumar-pc" },
          { name: cidade.cidade, path: `/arrumar-pc/${cidade.slug}` },
          { name: servico.nomeCurto, path },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <MapPin className="h-4 w-4" /> Atendimento online para {cidade.cidade}/{cidade.estado}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-5">
                {servico.nome} em {cidade.cidade}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {servico.descricao}
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                Chamar técnico no WhatsApp
              </a>
              <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-accent" /> Sessão autorizada</span>
                <span className="inline-flex items-center gap-1"><Zap className="h-4 w-4 text-accent" /> Resposta em minutos</span>
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-accent" /> Paga só se resolver</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEMAS */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Quando chamar para {servico.verbo} em {cidade.cidade}
            </h2>
            <p className="text-muted-foreground">
              Resolvemos remotamente os principais cenários abaixo. Se o seu caso for outro, mande mensagem mesmo assim — o diagnóstico é gratuito.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {servico.problemas.map((p) => (
              <a
                key={p}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-accent transition-colors">{p}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Chamar técnico agora →</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="bg-secondary/40 py-14">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Como funciona em {cidade.cidade}
            </h2>
            <ol className="grid md:grid-cols-4 gap-6 text-center">
              {[
                { t: "1. WhatsApp", d: `Você chama no WhatsApp dizendo que está em ${cidade.cidade}.` },
                { t: "2. Diagnóstico", d: "Conectamos no seu PC via AnyDesk/TeamViewer e analisamos o problema." },
                { t: "3. Valor do atendimento", d: "Passamos preço e prazo antes de executar qualquer serviço." },
                { t: "4. Solução", d: "Resolvemos na hora. Paga só depois, por PIX, cartão ou boleto." },
              ].map((s) => (
                <li key={s.t} className="bg-card border border-border rounded-xl p-5">
                  <p className="font-bold text-foreground mb-2">{s.t}</p>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Perguntas frequentes — {servico.nomeCurto} em {cidade.cidade}
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group p-5 rounded-xl border border-border bg-card hover:border-accent/40 transition-colors">
                  <summary className="cursor-pointer font-semibold text-foreground list-none flex justify-between items-center gap-4">
                    {f.q}
                    <span className="text-accent text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* INTERLINKING */}
        <section className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-foreground mb-3">Outros serviços em {cidade.cidade}</h3>
                <ul className="space-y-1.5 text-sm">
                  <li><Link to={`/arrumar-pc/${cidade.slug}`} className="text-accent hover:underline">→ Ver todos os serviços em {cidade.cidade}</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-3">{servico.nomeCurto} em outras cidades</h3>
                <ul className="grid grid-cols-2 gap-1.5 text-sm">
                  {["sao-paulo","rio-de-janeiro","belo-horizonte","brasilia","porto-alegre","florianopolis","salvador","recife","fortaleza","manaus"]
                    .filter(c => c !== cidade.slug)
                    .slice(0, 8)
                    .map(c => (
                      <li key={c}>
                        <Link to={`/arrumar-pc/servico/${servico.slug}/${c}`} className="text-muted-foreground hover:text-accent transition-colors">
                          → {c.replace(/-/g, " ")}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default ArrumarPCServicoCidadeTemplate;
