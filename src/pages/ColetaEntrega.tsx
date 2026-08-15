import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { PoliticaAtendimentoBlock } from "@/components/PoliticaAtendimentoBlock";
import { IMAGES } from "@/lib/images";
import { Link } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ExperienciaBadge } from "@/components/social-proof/ExperienciaBadge";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  MessageCircle, ArrowRight, Truck, Shield, Clock, CheckCircle2,
  MapPin, Package, AlertTriangle, Phone, ClipboardList,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  COLETA_TAXA_MINIMA_LABEL,
  DIAGNOSTICO_VALOR_LABEL,
  EQUIPAMENTOS_COLETA,
  PRAZOS,
  REGRA_ESTIMATIVA_GRATIS,
} from "@/lib/coletaConfig";

const WHATSAPP_NUMBER = "5541997086380";
const WHATSAPP_MESSAGE = "Preciso avaliar coleta e entrega para um computador ou notebook.";

const faqItems = [
  { q: "Quais equipamentos podem usar a coleta e entrega?", a: "Computadores de mesa e notebooks que precisam de diagnóstico, manutenção ou reparo em bancada. É a modalidade indicada quando o serviço não pode ser concluído no local." },
  { q: "Quando a coleta é mais adequada que o atendimento no local?", a: "Quando o caso exige bancada, ferramentas específicas ou tempo estendido de diagnóstico — por exemplo reparo de placa, troca de tela ou recuperação de dados." },
  { q: "Como funciona o agendamento?", a: `Fazemos uma triagem pelo WhatsApp antes de agendar. Na coleta, identificamos o equipamento e registramos os acessórios recebidos. A taxa mínima pré-aprovada é de ${COLETA_TAXA_MINIMA_LABEL}.` },
  { q: "O reparo é executado direto?", a: "Não. Após o recebimento fazemos o diagnóstico e a execução só acontece depois da sua aprovação do valor do serviço. Peças e componentes, quando necessários, ficam fora do valor-base." },
  { q: "Qual o prazo?", a: `${PRAZOS[0].equipamentos}: ${PRAZOS[0].prazo}. ${PRAZOS[1].equipamentos}: ${PRAZOS[1].prazo}. O prazo depende do tipo de falha e da fila do laboratório.` },
  { q: "E se eu desistir após o diagnóstico?", a: `Você paga apenas o valor do diagnóstico (${DIAGNOSTICO_VALOR_LABEL}) e agendamos a devolução do equipamento.` },
];

const ColetaEntrega = () => {
  useEffect(() => {
    document.title = "Coleta e Entrega de Computador e Notebook em Curitiba";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content",
        "Coleta e entrega agendada para computadores e notebooks que precisam de diagnóstico, manutenção ou serviço técnico em bancada."
      );
    }
    trackPageView("/coleta-e-entrega", "Coleta e Entrega");
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  const handleCTA = (label: string) => trackCTAClick("whatsapp", `coleta-${label}`);

  return (
    <div className="min-h-screen bg-background">
      <LocalBusinessJsonLd
        scriptId="ld-localbusiness-coleta"
        path="/coleta-e-entrega"
        name="Técnico em Curitiba — Coleta e entrega"
        description="Coleta e entrega de equipamentos em Curitiba e região metropolitana para reparos que exigem bancada, com prazo e condições informados na triagem."
        services={[
          { name: "Coleta e entrega de equipamentos", url: "/coleta-e-entrega" },
          { name: "Manutenção de notebook", url: "/servicos/manutencao-de-notebook" },
          { name: "Recuperação de dados", url: "/servicos/recuperacao-de-dados" },
        ]}
      />
      <PageSEO title="Coleta e Entrega de Computador e Notebook em Curitiba" description="Coleta e entrega agendada para computadores e notebooks que precisam de diagnóstico, manutenção ou serviço técnico em bancada." path="/coleta-e-entrega" breadcrumbs={[{ name: "Início", path: "/" }, { name: "Serviços", path: "/servicos" }, { name: "Coleta e Entrega", path: "/coleta-e-entrega" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://tecnico.curitiba.br/" },
          { "@type": "ListItem", position: 2, name: "Serviços", item: "https://tecnico.curitiba.br/servicos" },
          { "@type": "ListItem", position: 3, name: "Coleta e Entrega", item: "https://tecnico.curitiba.br/coleta-e-entrega" },
        ],
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://tecnico.curitiba.br/coleta-e-entrega#service",
        name: "Coleta e Entrega de Equipamentos para Reparo",
        serviceType: "Logística reversa de equipamentos eletrônicos para conserto em bancada",
        description: "Coleta no endereço do cliente, reparo em laboratório com diagnóstico completo e devolução do equipamento funcionando. Cobre Curitiba e região metropolitana.",
        areaServed: [
          { "@type": "City", name: "Curitiba" },
          { "@type": "AdministrativeArea", name: "Região Metropolitana de Curitiba" },
        ],
        provider: { "@id": "https://tecnico.curitiba.br/#localbusiness" },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: "300.00",
          url: "https://tecnico.curitiba.br/coleta-e-entrega",
          availability: "https://schema.org/InStock",
          priceSpecification: [
            { "@type": "PriceSpecification", name: "Reparo mínimo com coleta", price: "300.00", priceCurrency: "BRL", description: "Faixa pré-aprovada R$ 300–R$ 500. Acima disso, autorização do cliente." },
            { "@type": "PriceSpecification", name: "Diagnóstico em bancada (se desistir)", price: "90.00", priceCurrency: "BRL" },
          ],
        },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      })}} />
      <JsonLdSchema />
      <Header />
      <Breadcrumbs items={[{ label: "Coleta e Entrega" }]} />

      <main>
        {/* HERO */}
        <section className="relative hero-gradient pt-10 pb-10 md:pt-12 md:pb-12">
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <ExperienciaBadge className="mb-4" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Coleta e entrega agendada para equipamentos de informática
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Não pode trazer seu equipamento? Nós buscamos na sua casa ou empresa, realizamos o serviço em laboratório e devolvemos funcionando. Comodidade total com segurança.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("hero")}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" /> Agendar Coleta
                  </a>
                </Button>
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 font-bold gap-2">
                  <Link to="/coleta-formulario">
                    <ClipboardList className="h-5 w-5" /> Preencher Formulário Online
                  </Link>
                </Button>
              </div>
              <p className="mt-5 text-sm text-white/80">
                {REGRA_ESTIMATIVA_GRATIS}.{" "}
                <Link to="/precos-e-politicas#pagamento-e-nota-fiscal" className="font-semibold text-accent underline underline-offset-4">
                  Pagamento e nota fiscal
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Imagem coleta */}
        <section className="py-0 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto -mt-8 relative z-20">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img decoding="async" src={IMAGES.coletaEntrega} alt={IMAGES.coletaEntregaAlt} className="w-full h-48 md:h-64 object-cover" loading="eager" width="800" height="400" />
              </div>
            </div>
          </div>
        </section>

        {/* QUANDO É NECESSÁRIO */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                Quando a Coleta e Entrega É Necessária?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Nem todo reparo pode ser feito no local. Alguns serviços exigem <strong className="text-foreground">bancada de laboratório</strong>, ferramentas especializadas ou tempo estendido de diagnóstico. Nesses casos, a coleta e entrega é a solução ideal.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {[
                  "Reparo de placa mãe com micro-solda",
                  "Troca de tela de notebook ou TV",
                  "Recuperação de dados de HD danificado",
                  "Diagnóstico complexo (múltiplos componentes)",
                  "Limpeza ultrassônica de placa após líquido",
                  "Reballing ou reflow de GPU",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 bg-secondary rounded-lg p-4">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Como Funciona o Processo
              </h2>
              <div className="space-y-0">
                {[
                  { icon: Phone, title: "1. Contato Inicial", desc: `Você descreve o problema via WhatsApp. O técnico faz uma estimativa gratuita e informa as condições. valor preciso somente com compromisso (taxa mínima ${COLETA_TAXA_MINIMA_LABEL} pré-aprovada).` },
                  { icon: Truck, title: "2. Coleta no Local", desc: "Agendamos a coleta no seu endereço, em horário conveniente. O equipamento é embalado com proteção profissional para transporte seguro." },
                  { icon: Shield, title: "3. Diagnóstico e Aprovação", desc: `Em laboratório, o técnico realiza diagnóstico completo. Se estiver dentro do valor pré-aprovado (${COLETA_TAXA_MINIMA_LABEL}), o reparo é realizado. Acima disso, consultamos antes.` },
                  { icon: Package, title: "4. Entrega com Garantia", desc: "Equipamento reparado, testado e devolvido no seu endereço. Garantia por escrito de todo o serviço realizado." },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="relative flex gap-4 md:gap-6">
                      {i < 3 && <div className="absolute left-5 md:left-6 top-14 bottom-0 w-0.5 bg-border" />}
                      <div className="relative z-10 flex-shrink-0">
                        <div className="bg-accent text-accent-foreground rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                      </div>
                      <div className="pb-10 md:pb-12 flex-1">
                        <div className="bg-background rounded-xl p-5 md:p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="h-5 w-5 text-accent" />
                            <h3 className="text-lg font-bold text-primary">{step.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SEGURANÇA */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Segurança no Transporte
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: "Embalagem Profissional", desc: "Cada equipamento é embalado com proteção anti-impacto, espuma e plástico bolha profissional." },
                  { icon: MapPin, title: "Transporte Dedicado", desc: "O equipamento vai direto do seu endereço ao laboratório, sem escalas ou depósitos intermediários." },
                  { icon: Clock, title: "Prazo Informado", desc: `${PRAZOS[0].equipamentos}: ${PRAZOS[0].prazo}. ${PRAZOS[1].equipamentos}: ${PRAZOS[1].prazo}, dependendo da complexidade.` },
                  { icon: CheckCircle2, title: "Recibo de Entrega", desc: "Emitimos recibo detalhado na coleta com descrição do equipamento, acessórios e estado de conservação." },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-secondary rounded-xl p-5 flex gap-4">
                      <div className="bg-primary rounded-lg p-2 h-fit flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* REGIÕES */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Regiões Atendidas para Coleta e Entrega
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Coletamos e entregamos em toda Curitiba e região metropolitana:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Curitiba", "São José dos Pinhais", "Pinhais", "Araucária", "Campo Largo", "Colombo", "Almirante Tamandaré", "Fazenda Rio Grande"].map((cidade, i) => (
                  <div key={i} className="bg-background rounded-lg p-3 text-center">
                    <MapPin className="h-4 w-4 text-accent mx-auto mb-1" />
                    <span className="text-sm font-medium text-primary">{cidade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                Quanto Custa a Coleta e Entrega?
              </h2>
              <div className="bg-secondary rounded-2xl p-6 md:p-8 border-2 border-accent/20 text-center">
                <p className="text-muted-foreground mb-4">
                  A coleta e entrega está <strong className="text-accent">inclusa no valor do reparo</strong> quando o serviço é aprovado. {REGRA_ESTIMATIVA_GRATIS}. valor preciso somente com compromisso.
                </p>
                <div className="bg-accent/10 rounded-xl p-4 mb-4">
                  <p className="text-sm text-foreground font-medium">
                    Taxa mínima pré-aprovada: <strong className="text-accent">{COLETA_TAXA_MINIMA_LABEL}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reparos dentro desse valor são executados automaticamente. Acima, consultamos antes.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {PRAZOS.map((p, i) => (
                    <div key={i} className="bg-background rounded-lg p-3 text-center border border-border/50">
                      <span className="text-xs text-muted-foreground block mb-1">{p.equipamentos}</span>
                      <span className="text-sm font-bold text-accent">Prazo: {p.prazo}</span>
                    </div>
                  ))}
                </div>
                <Button variant="cta" size="lg" asChild>
                  <Link to="/valores">
                    Ver Tabela de Preços <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Perguntas Frequentes
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-xl border-none px-5">
                    <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Serviços relacionados */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <h2 className="mb-5 text-center text-xl md:text-2xl font-bold text-foreground">
              Serviços relacionados à coleta
            </h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {[
                { label: "Manutenção de notebook", to: "/servicos/manutencao-de-notebook" },
                { label: "Manutenção de computador", to: "/servicos/manutencao-de-computador" },
                { label: "Recuperação de dados", to: "/servicos/recuperacao-de-dados" },
                { label: "Diagnóstico técnico", to: "/diagnostico-tecnico" },
                { label: "Como funciona", to: "/como-funciona" },
                { label: "Preços e políticas", to: "/precos-e-politicas" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {l.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* CTA FINAL */}
        <section className="py-10 md:py-20 bg-primary">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Precisa de Coleta e Entrega?
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Agende agora a coleta do seu equipamento. Sem complicação, com segurança e garantia.
            </p>
            <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("cta-final")}>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Agendar Coleta pelo WhatsApp
              </a>
            </Button>
          </div>
        </section>
        <PoliticaAtendimentoBlock variant="coleta" />
      </main>

      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default ColetaEntrega;
