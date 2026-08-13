import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { PoliticaAtendimentoBlock } from "@/components/PoliticaAtendimentoBlock";
import { IMAGES } from "@/lib/images";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExperienciaBadge } from "@/components/social-proof/ExperienciaBadge";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Phone,
  Search,
  Calendar,
  ClipboardCheck,
  Wrench,
  Shield,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Monitor,
  ShieldCheck,
  HardDrive,
  Wifi,
  Database,
  Clock,
  Users,
  Eye,
  Zap,
  BadgeCheck,
  ChevronRight,
  DollarSign,
  AlertCircle,
  AlertTriangle,
  FileText,
  Headphones,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const WHATSAPP_NUMBER = "5541997086380";

const ComoFunciona = () => {
  useEffect(() => {
    document.title = "Como Funciona o Atendimento Técnico em Curitiba";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Entenda como funciona o atendimento técnico de informática em Curitiba e região. Passo a passo completo: solicitação via WhatsApp, diagnóstico, execução e garantia. Técnico a domicílio conforme a disponibilidade da agenda."
      );
    }
    trackPageView("/como-funciona", "Como Funciona");
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de entender como funciona o atendimento técnico.")}`;

  const handleCTA = (label: string) => {
    trackCTAClick("whatsapp", `como-funciona-${label}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title="Como Funciona o Atendimento Técnico em Curitiba" description="Entenda como funciona o atendimento técnico de informática em Curitiba e região. Passo a passo completo: solicitação via WhatsApp, diagnóstico, execução e garantia. Técnico a domicílio conforme a disponibilidade da agenda." path="/como-funciona" breadcrumbs={[{ name: "Início", path: "/" }, { name: "Como Funciona", path: "/como-funciona" }]} />
      {/* JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: "https://tecnico.curitiba.br/" },
              { "@type": "ListItem", position: 2, name: "Como Funciona", item: "https://tecnico.curitiba.br/como-funciona" },
            ],
          }),
        }}
      />
      <JsonLdSchema />
      <Header />
      <Breadcrumbs items={[{ label: "Como Funciona" }]} />

      <main>
        {/* ===== 1. HERO ===== */}
        <section className="relative hero-gradient pt-10 pb-10 md:pt-12 md:pb-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <ExperienciaBadge className="mb-4" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Como Funciona o Atendimento Técnico em Curitiba e Região
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Entenda passo a passo como solicitar, quanto custa para começar e como garantimos um atendimento rápido, seguro e profissional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="heroWhatsapp" size="lg" className="text-base md:text-lg px-8" asChild onClick={() => handleCTA("hero")}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Chamar no WhatsApp
                  </a>
                </Button>
                <Button variant="heroCta" size="lg" className="text-base md:text-lg px-8" asChild>
                  <Link to="/valores">
                    <DollarSign className="h-5 w-5" />
                    Ver Preços e Condições
                  </Link>
                </Button>
              </div>
              <p className="mt-5 text-sm text-white/80">
                Quer saber quando se paga e como sai a nota fiscal?{" "}
                <Link to="/precos-e-politicas#pagamento-e-nota-fiscal" className="font-semibold text-accent underline underline-offset-4">
                  Veja pagamento e nota fiscal
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Imagem real de atendimento */}
        <section className="py-0 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto -mt-8 relative z-20">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img decoding="async" src={IMAGES.atendimentoDomiciliar} alt={IMAGES.atendimentoDomiciliarAlt} className="w-full h-48 md:h-72 object-cover" loading="eager" width="800" height="400" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. RESUMO RÁPIDO ===== */}
        <section className="py-8 md:py-10 bg-secondary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center reveal-text">
                Atendimento Simples, Rápido e Transparente
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {resumoItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-background rounded-xl p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all stagger-item" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="bg-primary rounded-lg p-3 w-fit mx-auto mb-3">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-primary text-sm md:text-base mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-xs md:text-sm">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. PASSO A PASSO DETALHADO ===== */}
        <section className="py-12 md:py-20 bg-background relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center reveal-text">
                Passo a Passo: Do Primeiro Contato à Garantia
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
                Conheça cada etapa do nosso processo de atendimento técnico em Curitiba. Transparência do início ao fim para você ter total segurança.
              </p>

              <div className="space-y-0">
                {etapas.map((etapa, i) => {
                  const Icon = etapa.icon;
                  return (
                    <div key={i} className="relative flex gap-4 md:gap-6">
                      {/* Timeline line */}
                      {i < etapas.length - 1 && (
                        <div className="absolute left-5 md:left-6 top-14 bottom-0 w-0.5 bg-border" />
                      )}
                      {/* Step number */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="bg-accent text-accent-foreground rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-sm md:text-base">
                          {i + 1}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="pb-10 md:pb-12 flex-1">
                        <div className="bg-secondary rounded-xl p-5 md:p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <Icon className="h-5 w-5 text-accent" />
                            <h3 className="text-lg md:text-xl font-bold text-primary">{etapa.title}</h3>
                          </div>
                          <ul className="space-y-2">
                            {etapa.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          {etapa.detail && (
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{etapa.detail}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-6">
                <Button variant="whatsapp" size="lg" asChild onClick={() => handleCTA("passo-a-passo")}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Iniciar Atendimento Agora
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4. BLOCO DE PREÇOS ===== */}
        <section className="py-8 md:py-10 bg-accent/5">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-background rounded-2xl p-8 md:p-10 shadow-lg border-2 border-accent/20">
                <DollarSign className="h-12 w-12 text-accent mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Quanto Custa o Atendimento?
                </h2>
                <p className="text-muted-foreground mb-3 leading-relaxed max-w-xl mx-auto">
                  A mão de obra começa a partir de <strong className="text-accent">R$ 99,99</strong> quando há visita ou diagnóstico presencial aplicável. O valor final depende da avaliação do problema, do tempo necessário e de eventuais peças, licenças ou materiais.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Os valores podem variar conforme a complexidade do serviço, a necessidade de peças e a localização. O valor do atendimento é informado antes da execução. Veja os detalhes na página de preços e políticas.
                </p>
                <Button variant="cta" size="lg" asChild>
                  <Link to="/valores">
                    <FileText className="h-5 w-5" />
                    Ver Preços e Políticas Completas
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 5. O QUE ESTÁ INCLUSO ===== */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center reveal-text">
                O Que Está Incluso no Atendimento
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {inclusosItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary rounded-lg p-4 hover:-translate-y-0.5 hover:shadow-sm transition-all stagger-item" style={{ animationDelay: `${i * 80}ms` }}>
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. O QUE PODE ALTERAR O VALOR ===== */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center reveal-text">
                O Que Pode Alterar o Valor do Serviço
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto reveal-text" data-reveal-delay="100">
                Prezamos pela transparência. Veja os fatores que podem influenciar o valor final do atendimento técnico:
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {fatoresPreco.map((fator, i) => (
                  <div key={i} className="bg-background rounded-xl p-5 flex items-start gap-3 hover:-translate-y-0.5 hover:shadow-sm transition-all stagger-item" style={{ animationDelay: `${i * 80}ms` }}>
                    <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary text-sm">{fator.title}</h3>
                      <p className="text-xs text-muted-foreground">{fator.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Em todos os casos, o valor do atendimento é informado e aprovado <strong>antes</strong> da execução do serviço. Sem surpresas.
              </p>
            </div>
          </div>
        </section>

        {/* ===== 7. REGIÕES ATENDIDAS ===== */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center reveal-text">
                Regiões Atendidas pelo Técnico de Informática
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
                Nosso atendimento técnico cobre Curitiba e toda a região metropolitana. Atendemos a domicílio ou remotamente, com agilidade e profissionalismo.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {regioes.map((r, i) => (
                  <Link
                    key={i}
                    to={r.link}
                    className="bg-secondary rounded-xl p-4 text-center hover:bg-accent/10 hover:border-accent/30 border border-transparent hover:-translate-y-1 transition-all group stagger-item"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <MapPin className="h-5 w-5 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">{r.name}</span>
                  </Link>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Também atendemos bairros específicos. <Link to="/servicos" className="text-accent hover:underline font-medium">Veja a cobertura completa →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* ===== 8. TIPOS DE SERVIÇOS ===== */}
        <section className="py-8 md:py-10 bg-secondary relative overflow-hidden">
          <div className="absolute top-1/3 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center reveal-text">
                Serviços de Informática Disponíveis
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
                Oferecemos uma gama completa de serviços técnicos para computadores, notebooks e redes. Cada serviço segue o mesmo processo transparente descrito acima.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {servicos.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={i}
                      to={s.link}
                      className="bg-background rounded-xl p-5 flex items-start gap-3 hover:shadow-md hover:border-accent/20 border border-transparent hover:-translate-y-1 transition-all group stagger-item"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="bg-primary rounded-lg p-2 flex-shrink-0 group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-shadow">
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">{s.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link to="/servicos">
                    Ver Todos os Serviços
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 9. PROVA DE CONFIANÇA ===== */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center reveal-text">
                Por Que Confiar no Nosso Atendimento
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {confiancaItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-4 items-start hover:-translate-y-0.5 transition-transform stagger-item" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="bg-accent/10 rounded-lg p-3 flex-shrink-0 group-hover:shadow-[0_0_16px_hsl(var(--accent)/0.2)] transition-shadow">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===== TIPOS DE ATENDIMENTO ===== */}
        <section id="diagnostico" className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Tipos de Atendimento Disponíveis
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Cada situação exige um tipo diferente de atendimento. Entenda as diferenças para escolher a melhor opção.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Visita Técnica a Domicílio",
                    desc: "O técnico vai até você com ferramentas profissionais. Ideal para diagnósticos rápidos, formatações, upgrades e reparos simples que podem ser resolvidos no local. Cobrança por tempo de atendimento.",
                    ideal: "Problemas de software, formatação, upgrade SSD/RAM, configuração de rede",
                  },
                  {
                    title: "Diagnóstico em Laboratório",
                    desc: "Equipamento é coletado e levado para bancada técnica. Necessário para reparos que exigem ferramentas especiais, micro-solda ou tempo estendido de análise.",
                    ideal: "Reparo de placa mãe, troca de tela, recuperação de dados, problemas complexos",
                  },
                  {
                    title: "Atendimento Remoto",
                    desc: "O técnico acessa seu computador de forma segura pela internet. Mais rápido e econômico para problemas que não envolvem hardware físico.",
                    ideal: "Lentidão, configurações, instalação de programas, remoção de vírus simples",
                  },
                  {
                    title: "Coleta e Entrega",
                    desc: "Para equipamentos que precisam de bancada, fazemos a coleta no seu endereço e devolvemos após o reparo. Logística segura com recibo detalhado.",
                    ideal: "TVs, notebooks com defeito grave, equipamentos pesados ou delicados",
                  },
                ].map((tipo, i) => (
                  <div key={i} className="bg-secondary rounded-xl p-6">
                    <h3 className="font-bold text-primary text-lg mb-2">{tipo.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{tipo.desc}</p>
                    <div className="bg-accent/10 rounded-lg p-3">
                      <span className="text-xs font-semibold text-accent">Ideal para: </span>
                      <span className="text-xs text-muted-foreground">{tipo.ideal}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6 flex flex-wrap gap-3 justify-center">
                <Link to="/coleta-e-entrega" className="text-sm text-accent hover:underline font-medium">Saiba mais sobre Coleta e Entrega →</Link>
                <Link to="/atendimento-remoto" className="text-sm text-accent hover:underline font-medium">Atendimento Remoto →</Link>
                <Link to="/atendimento-domicilio" className="text-sm text-accent hover:underline font-medium">Atendimento a Domicílio →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CENÁRIOS REAIS ===== */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Cenários Reais: Do Simples ao Complexo
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Nem todo problema é o que parece. Veja como diferentes níveis de complexidade afetam o diagnóstico, o tempo e o custo.
              </p>
              <div className="space-y-4">
                {[
                  {
                    nivel: "Simples",
                    cor: "text-accent",
                    bgCor: "bg-accent/10",
                    exemplo: "Computador lento → SSD cheio + muitos programas na inicialização",
                    tempo: "30-60 minutos",
                    solucao: "Limpeza de disco, otimização de inicialização, upgrade de SSD se necessário",
                    custo: "a partir de R$ 99,99",
                  },
                  {
                    nivel: "Médio",
                    cor: "text-yellow-800 dark:text-yellow-300",
                    bgCor: "bg-yellow-500/10",
                    exemplo: "Notebook não liga → Fonte defeituosa + bateria viciada",
                    tempo: "1-3 horas ou coleta para bancada",
                    solucao: "Diagnóstico detalhado, troca de fonte/carregador, avaliação de bateria",
                    custo: "R$ 168,99 a R$ 400",
                  },
                  {
                    nivel: "Complexo",
                    cor: "text-destructive",
                    bgCor: "bg-destructive/5",
                    exemplo: "PC com artefatos visuais → GPU com desgaste por superaquecimento crônico",
                    tempo: "3-15 dias em bancada",
                    solucao: "Diagnóstico de placa, teste de GPU, possível reballing ou substituição",
                    custo: "R$ 300 a R$ 800+",
                  },
                ].map((c, i) => (
                  <div key={i} className={`${c.bgCor} rounded-xl p-5 border-l-4 ${c.cor === "text-accent" ? "border-accent" : c.cor === "text-yellow-600" ? "border-yellow-500" : "border-destructive"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm font-bold ${c.cor} uppercase`}>{c.nivel}</span>
                    </div>
                    <p className="font-medium text-primary mb-2">{c.exemplo}</p>
                    <div className="grid sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <span><strong>Tempo:</strong> {c.tempo}</span>
                      <span><strong>Solução:</strong> {c.solucao}</span>
                      <span><strong>Custo estimado:</strong> {c.custo}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                <Link to="/problemas-reais-e-casos" className="text-accent hover:underline font-medium">Ver mais casos reais detalhados →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* ===== RISCOS TÉCNICOS ===== */}
        <section className="py-8 md:py-10 bg-accent/5">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Riscos Técnicos: O Que Pode Dar Errado
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Entender os riscos ajuda a valorizar o trabalho profissional e a evitar decisões que podem sair muito mais caras.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Usar ferramentas inadequadas", desc: "Chaves improvisadas, facas ou objetos pontiagudos podem riscar trilhas de placas, cortar cabos flat e danificar conectores permanentemente." },
                  { title: "Instalar peças incompatíveis", desc: "Memória RAM, SSD ou fonte com especificações erradas podem causar curto-circuito, queimar componentes e danificar a placa mãe." },
                  { title: "Ignorar sinais de falha", desc: "Ruídos, lentidão extrema e reinícios aleatórios são sintomas de falhas que pioram com o uso contínuo. Quanto mais tempo demora, maior o prejuízo." },
                  { title: "Tentar resolver sem diagnóstico", desc: "Formatar um computador com HD defeituoso não resolve o problema — e pode apagar dados irrecuperáveis sem necessidade." },
                ].map((r, i) => (
                  <div key={i} className="bg-background rounded-xl p-5 flex gap-4">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-foreground mb-1 text-sm">{r.title}</h3>
                      <p className="text-xs text-muted-foreground">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                <Link to="/diagnostico-tecnico" className="text-accent hover:underline font-medium">Entenda por que o diagnóstico profissional é essencial →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* ===== BACKUP E RECUPERAÇÃO DE DADOS ===== */}
        <section id="backup" className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Backup e Recuperação de Dados no Atendimento
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Antes de formatar, trocar disco ou intervir em um equipamento com falha, a primeira pergunta é sempre a
                mesma: existe algo dentro dele que você não pode perder? O tratamento dos seus arquivos segue etapas,
                prazos e limites declarados — sem promessa que não possa ser cumprida.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Database, title: "1. Levantamento do que importa", desc: "Na triagem identificamos o que precisa ser preservado: documentos, fotos, pastas de trabalho, e-mails locais e configurações. Isso define se o serviço pode ser executado direto ou se a cópia vem antes de qualquer intervenção." },
                  { icon: HardDrive, title: "2. Cópia de segurança antes de intervir", desc: "Quando o disco ainda responde, a cópia é feita para mídia externa antes de formatar, migrar para SSD ou remover infecção. Serviços que apagam dados só começam depois que essa cópia é conferida com você." },
                  { icon: ShieldCheck, title: "3. Devolução e descarte controlado", desc: "Os arquivos são devolvidos no equipamento ou na mídia combinada. Cópias temporárias usadas no processo são apagadas na entrega, salvo pedido expresso de retenção por prazo definido." },
                ].map((s, i) => (
                  <div key={i} className="bg-background rounded-xl p-5">
                    <s.icon className="h-6 w-6 text-accent mb-3" />
                    <h3 className="font-bold text-foreground mb-1 text-sm">{s.title}</h3>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-background rounded-xl p-6 border border-border">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" /> Prazos de referência
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Cópia de arquivos pessoais em disco saudável: normalmente no mesmo atendimento, variando com o volume de dados e a velocidade da mídia de destino.</li>
                    <li>• Backup antes de formatação ou migração para SSD: executado dentro do próprio serviço, antes de qualquer escrita no disco original.</li>
                    <li>• Disco com setores defeituosos ou leitura instável: exige bancada e leitura em ritmo reduzido; o prazo é informado depois da avaliação inicial, e atualizado se o quadro mudar.</li>
                    <li>• Falha física severa (ruído mecânico, disco não reconhecido): avaliação primeiro, sem prazo prometido antes de saber se há leitura possível.</li>
                  </ul>
                </div>
                <div className="bg-background rounded-xl p-6 border border-border">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" /> Limites seguros e o que não prometemos
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Não existe garantia de recuperação integral em disco com falha física ou em arquivos sobrescritos: o resultado depende do estado da mídia.</li>
                    <li>• Dados criptografados por ransomware não são "desbloqueados": o trabalho se limita a preservar o que estiver íntegro e reconstruir o ambiente.</li>
                    <li>• Continuar usando o equipamento depois da perda reduz as chances de recuperação — desligar cedo é a atitude que mais ajuda.</li>
                    <li>• Não acessamos conteúdo além do necessário para executar o serviço, e não retemos cópias sem combinação prévia.</li>
                    <li>• Backup feito no atendimento é ponto de partida, não rotina: para proteção contínua, a recomendação é manter uma cópia externa e uma em nuvem.</li>
                  </ul>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Casos de perda já ocorrida seguem por{" "}
                <Link to="/servicos/recuperacao-de-dados" className="text-accent hover:underline font-medium">recuperação de dados</Link>
                {" "}· rotina de proteção em{" "}
                <Link to="/blog/backup-como-proteger-seus-arquivos" className="text-accent hover:underline font-medium">como proteger seus arquivos</Link>
                {" "}· condições em{" "}
                <Link to="/precos-e-politicas" className="text-accent hover:underline font-medium">preços e políticas</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* ===== QUANDO COMPENSA REPARAR ===== */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Quando Compensa Reparar — E Quando Não
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-accent/5 rounded-xl p-6 border-2 border-accent/20">
                  <h3 className="font-bold text-accent text-lg mb-3">✅ Compensa reparar quando:</h3>
                  <ul className="space-y-2">
                    {[
                      "Equipamento tem menos de 5 anos",
                      "Problema é pontual (1 componente)",
                      "Custo do reparo < 40% do valor de um novo",
                      "Dados importantes no equipamento",
                      "Problemas de software (formatação, vírus)",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-destructive/5 rounded-xl p-6 border-2 border-destructive/20">
                  <h3 className="font-bold text-destructive text-lg mb-3">❌ Não compensa quando:</h3>
                  <ul className="space-y-2">
                    {[
                      "Equipamento tem mais de 8-20 anos",
                      "Múltiplos defeitos simultâneos",
                      "Custo do reparo > 40% de um novo",
                      "Peças obsoletas e caras",
                      "Painel LCD/OLED danificado por impacto",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                <Link to="/quando-nao-compensa" className="text-accent hover:underline font-medium">Guia completo: quando NÃO compensa reparar →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* ===== 10. FAQ ===== */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Perguntas Frequentes Sobre o Atendimento
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Tire suas dúvidas sobre como funciona o atendimento técnico de informática em Curitiba
              </p>
              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-xl border px-5">
                    <AccordionTrigger className="text-left font-semibold text-primary hover:text-accent">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ===== 11. CTA FINAL ===== */}
        <section className="py-10 md:py-20 bg-primary">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Precisa de Atendimento Agora?
              </h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Nossa equipe está pronta para atender você. Entre em contato pelo WhatsApp e receba suporte técnico profissional hoje mesmo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="heroWhatsapp" size="lg" className="text-base px-8" asChild onClick={() => handleCTA("cta-final")}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Chamar no WhatsApp
                  </a>
                </Button>
                <Button variant="heroCta" size="lg" className="text-base px-8" asChild>
                  <Link to="/servicos">
                    <Wrench className="h-5 w-5" />
                    Ver Serviços
                  </Link>
                </Button>
                <Button variant="heroCta" size="lg" className="text-base px-8" asChild>
                  <Link to="/valores">
                    <DollarSign className="h-5 w-5" />
                    Ver Preços
                  </Link>
                </Button>
              </div>
              <p className="text-primary-foreground/60 text-sm mt-6">
                Atendimento de segunda a sábado via WhatsApp
              </p>
              <nav aria-label="Páginas relacionadas" className="mt-8 border-t border-primary-foreground/20 pt-6 text-left">
                <h3 className="mb-3 text-base font-semibold text-primary-foreground">
                  Antes de iniciar a triagem, vale conferir
                </h3>
                <p className="mb-4 text-sm text-primary-foreground/80">
                  A triagem inicial orienta a modalidade de atendimento, mas não substitui o diagnóstico técnico:
                  a causa só é confirmada com o equipamento avaliado. Peças e materiais são tratados à parte do
                  serviço, prazos dependem de fila, complexidade, testes e disponibilidade de peça, e nenhuma
                  execução adicional acontece sem a sua autorização. Cancelamento, desistência e garantia seguem
                  as políticas vigentes, conforme o serviço efetivamente executado.
                </p>
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    { to: "/precos-e-politicas", label: "Preços e políticas" },
                    { to: "/faq", label: "Dúvidas frequentes" },
                    { to: "/contato", label: "Contato" },
                    { to: "/servicos", label: "Todos os serviços" },
                    { to: "/servicos/manutencao-de-notebook", label: "Manutenção de notebook" },
                    { to: "/servicos/manutencao-de-computador", label: "Manutenção de computador" },
                    { to: "/servicos/formatacao", label: "Formatação de computador" },
                    { to: "/problemas/notebook-nao-liga", label: "Notebook não liga" },
                    { to: "/problemas/computador-lento", label: "Computador lento" },
                  ].map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-primary-foreground/90 underline underline-offset-4 hover:text-primary-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>
        <PoliticaAtendimentoBlock variant="default" />
      </main>

      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

/* ===== DATA ===== */

const resumoItems = [
  { icon: MessageCircle, title: "Solicitação Rápida", text: "Chame via WhatsApp e explique seu problema em poucos minutos" },
  { icon: Search, title: "Diagnóstico Técnico", text: "Avaliação profissional no local ou remotamente" },
  { icon: Eye, title: "Execução Transparente", text: "Serviço realizado com sua aprovação e acompanhamento" },
  { icon: Shield, title: "Garantia do Serviço", text: "Todo serviço inclui garantia por escrito de 90 dias em mão de obra sobre o ponto reparado" },
];

const etapas = [
  {
    icon: MessageCircle,
    title: "Primeiro Contato via WhatsApp",
    items: [
      "Você entra em contato pelo WhatsApp",
      "Descreve o problema ou necessidade do seu computador",
      "Recebe orientação inicial e possíveis soluções imediatas",
    ],
    detail: "Nosso atendimento é humanizado e direto. Nada de robôs ou esperas intermináveis. Você fala diretamente com um técnico especializado que vai entender sua situação e direcionar o melhor caminho para resolver o problema.",
  },
  {
    icon: Search,
    title: "Pré-Avaliação e Orientação",
    items: [
      "O técnico analisa a descrição do problema",
      "Estima valores iniciais baseados no diagnóstico preliminar",
      "Direciona para atendimento presencial, remoto ou coleta",
    ],
    detail: "Em muitos casos, conseguimos identificar o problema e orientar uma solução já na primeira conversa. Se for algo que exija visita técnica, informamos os valores antes mesmo de agendar — sem compromisso.",
  },
  {
    icon: Calendar,
    title: "Agendamento Flexível",
    items: [
      "Definição de data e horário conforme sua disponibilidade",
      "Confirmação do endereço e detalhes de acesso",
      "Organização dos materiais e ferramentas necessários",
    ],
    detail: "Atendemos em horários flexíveis, inclusive aos sábados. O técnico chega no horário combinado, respeitando seu tempo e rotina. Para atendimento remoto, basta estar com o computador ligado e conectado à internet.",
  },
  {
    icon: ClipboardCheck,
    title: "Visita Técnica e Diagnóstico",
    items: [
      "Diagnóstico completo no local com equipamentos profissionais",
      "Testes detalhados de hardware e software",
      "Explicação clara e objetiva do problema encontrado",
    ],
    detail: "Não fazemos diagnósticos vagos. Você vai entender exatamente o que está acontecendo com seu computador, quais são as opções de solução e quanto cada uma vai custar. Transparência total antes de qualquer execução.",
  },
  {
    icon: Wrench,
    title: "Execução do Serviço com Aprovação",
    items: [
      "Serviço realizado somente após sua aprovação explícita",
      "Acompanhamento em tempo real da execução",
      "Sem cobranças surpresa — valor do atendimento previamente informado",
    ],
    detail: "Você aprova o valor e o escopo do serviço antes de qualquer execução. Se durante o atendimento surgir algo que altere o valor do atendimento, consultamos você antes de prosseguir. Essa é a nossa política de transparência.",
  },
  {
    icon: Shield,
    title: "Finalização, Testes e Garantia",
    items: [
      "Testes completos para garantir que tudo funciona perfeitamente",
      "Orientações de uso e prevenção para o futuro",
      "Garantia por escrito de 90 dias em mão de obra sobre o serviço executado",
    ],
    detail: "Antes de finalizar, fazemos uma bateria de testes para validar o serviço. Você recebe orientações para manter o computador saudável e um termo de garantia. Se algo der errado dentro do prazo, voltamos sem custo adicional.",
  },
];

const inclusosItems = [
  { title: "Diagnóstico Técnico Profissional", desc: "Avaliação completa do equipamento com identificação precisa do problema e das possíveis soluções." },
  { title: "Atendimento no Local ou Remoto", desc: "Você escolhe: o técnico vai até você ou resolve remotamente via acesso seguro ao seu computador." },
  { title: "Orientação e Suporte Especializado", desc: "Explicação detalhada de tudo que foi feito, com dicas de manutenção preventiva para o futuro." },
  { title: "Execução Mediante Aprovação", desc: "Nenhum serviço é executado sem sua autorização prévia. Você controla todo o processo do início ao fim." },
];

const fatoresPreco = [
  { title: "Complexidade do Problema", desc: "Problemas mais complexos exigem mais tempo e ferramentas especializadas." },
  { title: "Tempo de Execução", desc: "Serviços cobrados por hora técnica dependem do tempo necessário para resolução." },
  { title: "Necessidade de Peças", desc: "Se for preciso trocar componentes, o custo das peças é adicional ao serviço." },
  { title: "Urgência do Atendimento", desc: "Atendimentos emergenciais ou fora do horário comercial podem ter valores diferenciados." },
  { title: "Localização do Cliente", desc: "Deslocamentos para regiões mais distantes podem ter taxa adicional de transporte." },
  { title: "Tipo de Equipamento", desc: "Notebooks e equipamentos especializados podem ter valores diferentes de desktops." },
];

const regioes = [
  { name: "Curitiba", link: "/tecnico-informatica-curitiba" },
  { name: "São José dos Pinhais", link: "/tecnico-informatica-sao-jose-pinhais" },
  { name: "Pinhais", link: "/tecnico-informatica-pinhais" },
  { name: "Araucária", link: "/tecnico-informatica-araucaria" },
  { name: "Campo Largo", link: "/tecnico-informatica-campo-largo" },
];

const servicos = [
  { icon: Monitor, title: "Formatação de Computador", desc: "Windows + drivers + programas essenciais", link: "/servicos/formatacao" },
  { icon: ShieldCheck, title: "Remoção de Vírus", desc: "Limpeza completa de malwares e proteção", link: "/servicos/remocao-de-virus" },
  { icon: HardDrive, title: "Upgrade de SSD e RAM", desc: "Deixe seu computador até 10x mais rápido", link: "/servicos/upgrade-ssd-ram" },
  { icon: Wrench, title: "Manutenção de computador e notebook", desc: "Reparo de hardware e software", link: "/servicos/manutencao-de-computador" },
  { icon: Wifi, title: "Redes e Wi-Fi", desc: "Instalação e configuração de redes", link: "/servicos/redes-e-wifi" },
  { icon: Database, title: "Recuperação de dados", desc: "Proteção e recuperação de dados", link: "/servicos/recuperacao-de-dados" },
  { icon: Headphones, title: "Suporte Remoto", desc: "Atendimento online sem visita técnica", link: "/atendimento-remoto" },
  { icon: Zap, title: "Montagem de PC", desc: "PCs personalizados para trabalho ou jogos", link: "/servicos/montagem-pc" },
  { icon: Users, title: "Suporte técnico empresarial", desc: "Planos de TI para sua empresa", link: "/servicos/suporte-tecnico-empresarial" },
];

const confiancaItems = [
  { icon: BadgeCheck, title: "Atendimento profissional e registrado", desc: "Atuação em informática desde 1998, com escopo e valor registrados por escrito. Nota fiscal de serviço emitida mediante solicitação e garantia registrada no valor aprovado." },
  { icon: Clock, title: "Atendimento Rápido — Conforme agenda", desc: "Na maioria dos casos, conseguimos atender conforme a disponibilidade da agenda. Nosso compromisso é não deixar você esperando. Agilidade é prioridade no nosso atendimento." },
  { icon: Eye, title: "Transparência Total nos Valores", desc: "Valor informado antes da execução. Sem taxas escondidas, sem surpresas no final. Você aprova cada etapa e cada valor antes de qualquer serviço ser realizado." },
  { icon: Shield, title: "Garantia por Escrito em Todo Serviço", desc: "Todos os serviços possuem garantia de 90 dias em mão de obra sobre o ponto reparado. Se algo der errado dentro do prazo, voltamos para resolver sem custo adicional. Sua segurança é nossa prioridade." },
];

const faqItems = [
  { question: "Meus arquivos são copiados antes de formatar?", answer: "Sim, sempre que o disco ainda permite leitura. A cópia de segurança é feita para mídia externa e conferida com você antes de qualquer serviço que apague dados, como formatação, reinstalação ou migração para SSD." },
  { question: "Quanto tempo leva um backup durante o atendimento?", answer: "Em disco saudável, normalmente no mesmo atendimento, variando com o volume de dados e a velocidade da mídia de destino. Discos com setores defeituosos exigem leitura em ritmo reduzido em bancada, com prazo informado depois da avaliação inicial." },
  { question: "Existe garantia de recuperar todos os arquivos?", answer: "Não. Em disco com falha física, arquivos sobrescritos ou dados criptografados por ransomware não há garantia de recuperação integral: o resultado depende do estado da mídia. Explicamos o cenário real antes de iniciar, sem prometer o que não pode ser assegurado." },
  { question: "Vocês guardam cópias dos meus dados depois do serviço?", answer: "Não. Cópias temporárias usadas no processo são apagadas na entrega, salvo pedido expresso seu de retenção por prazo definido. O acesso ao conteúdo se limita ao necessário para executar o serviço contratado." },
  { question: "Quanto custa a visita técnica?", answer: "Quando há visita ou diagnóstico presencial aplicável, a mão de obra começa a partir de R$ 99,99. O valor final depende da avaliação do problema e do tempo necessário. Consulte os detalhes em /precos-e-politicas." },
  { question: "O valor pode mudar depois da avaliação?", answer: "Sim, mas somente com sua aprovação prévia. Se durante o atendimento identificarmos algo que altere o escopo ou o valor, consultamos você antes de prosseguir. Nosso compromisso é transparência total — nenhum serviço adicional é executado sem sua autorização." },
  { question: "Precisa pagar antes do atendimento?", answer: "Não. O pagamento é feito após a conclusão do serviço. Aceitamos PIX (preferencial), dinheiro, cartão de crédito e débito. Para empresas com contrato, oferecemos pagamento faturado." },
  { question: "Em quanto tempo conseguem atender?", answer: "Na maioria dos casos, sim. Nosso objetivo é atender conforme a disponibilidade da agenda, dependendo da disponibilidade de agenda e da sua localização. Entre em contato via WhatsApp para verificar a disponibilidade." },
  { question: "O serviço tem garantia?", answer: "Sim. Todos os serviços possuem garantia por escrito de 90 dias em mão de obra sobre o ponto reparado ou o serviço executado. Peças possuem garantia do fabricante. Se algo der errado dentro do prazo, voltamos para resolver sem custo adicional." },
  { question: "Faz atendimento remoto?", answer: "Sim. Para problemas de software, configurações e muitos outros casos, realizamos atendimento remoto seguro. O técnico acessa seu computador de forma controlada e resolve o problema enquanto você acompanha em tempo real. É rápido, prático e mais econômico." },
  { question: "Atende empresas?", answer: "Sim. Temos planos específicos para empresas de todos os portes. Oferecemos suporte contínuo, manutenção preventiva, gestão de TI e atendimento prioritário. Emitimos nota fiscal de serviço e de produto." },
  { question: "Quais formas de pagamento são aceitas?", answer: "Aceitamos PIX (forma preferencial), dinheiro, cartão de crédito e débito. Para empresas com contrato mensal, oferecemos pagamento faturado com boleto ou transferência." },
  { question: "Precisa agendar ou atende por ordem de chegada?", answer: "É necessário agendar via WhatsApp. O agendamento garante que o técnico estará disponível no horário combinado, com todos os materiais necessários. Atendemos de segunda a sábado, com horários flexíveis." },
  { question: "O técnico leva peças para o atendimento?", answer: "Sim, quando possível. Se na pré-avaliação identificarmos a necessidade de peças específicas (como SSD, memória RAM, cabos), o técnico já leva os componentes para o atendimento. Peças especiais ou sob encomenda podem necessitar de agendamento adicional." },
  { question: "Qual a área de cobertura do atendimento?", answer: "Atendemos Curitiba e toda a região metropolitana, incluindo São José dos Pinhais, Pinhais, Araucária e Campo Largo. Para bairros mais distantes, pode haver uma taxa adicional de deslocamento, sempre informada previamente." },
  { question: "Como funciona o atendimento a domicílio?", answer: "O técnico vai até sua casa ou escritório com todas as ferramentas necessárias. Realiza o diagnóstico e o reparo no local, sem que você precise levar o equipamento a uma loja. Atendimento prático, rápido e profissional." },
];

export default ComoFunciona;
