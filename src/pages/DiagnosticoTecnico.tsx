import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { IMAGES } from "@/lib/images";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Search, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight,
  MessageCircle, DollarSign, Clock, Eye, Wrench, Monitor,
  HardDrive, Zap, Ban, CircleDollarSign,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const WHATSAPP_NUMBER = "5541997086380";

const DiagnosticoTecnico = () => {
  useEffect(() => {
    document.title = "Diagnóstico Técnico de Computador e Notebook em Curitiba";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content",
        "Diagnóstico técnico para identificar falhas em computadores e notebooks, avaliar a viabilidade do serviço e orientar o valor do atendimento."
      );
    }
    trackPageView("/diagnostico-tecnico", "Diagnóstico Técnico");
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Preciso solicitar um diagnóstico técnico para meu equipamento.")}`;
  const handleCTA = (label: string) => trackCTAClick("whatsapp", `diagnostico-${label}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title="Diagnóstico Técnico de Computador e Notebook em Curitiba" description="Diagnóstico técnico para identificar falhas em computadores e notebooks, avaliar a viabilidade do serviço e orientar o valor do atendimento." path="/diagnostico-tecnico" breadcrumbs={[{ name: "Início", path: "/" }, { name: "Diagnóstico Técnico", path: "/diagnostico-tecnico" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map(f => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://tecnico.curitiba.br/" },
          { "@type": "ListItem", position: 2, name: "Diagnóstico Técnico", item: "https://tecnico.curitiba.br/diagnostico-tecnico" },
        ],
      })}} />
      <JsonLdSchema />
      <Header />
      <Breadcrumbs items={[{ label: "Diagnóstico Técnico" }]} />

      <main>
        {/* HERO */}
        <section className="relative hero-gradient pt-10 pb-10 md:pt-12 md:pb-12">
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Diagnóstico técnico antes do reparo
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Antes de qualquer solução, é preciso entender o problema com precisão. Descubra por que o diagnóstico profissional é pago, como ele funciona e como evita prejuízos maiores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("hero")}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" /> Solicitar Diagnóstico
                  </a>
                </Button>
                <Button variant="heroCta" size="lg" asChild>
                  <Link to="/valores">
                    <DollarSign className="h-5 w-5" /> Ver Valores
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Imagem diagnóstico real */}
        <section className="py-0 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto -mt-8 relative z-20">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img decoding="async" src={IMAGES.diagnostico} alt={IMAGES.diagnosticoAlt} className="w-full h-48 md:h-64 object-cover" loading="eager" width="800" height="400" />
              </div>
            </div>
          </div>
        </section>

        {/* O QUE É DIAGNÓSTICO */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                O Que É o Diagnóstico Técnico?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  O diagnóstico técnico é o processo de <strong className="text-foreground">identificação precisa da causa de um problema</strong> em um equipamento eletrônico. Não se trata de um "chute" ou de tentar coisas aleatórias — é uma investigação metódica que envolve testes com equipamentos profissionais, análise de componentes e experiência técnica acumulada.
                </p>
                <p>
                  Muitos clientes confundem diagnóstico com valor do atendimento. <strong className="text-foreground">São coisas diferentes.</strong> Um valor do atendimento é uma estimativa de valor. O diagnóstico é o trabalho técnico real de descobrir o que está errado. Sem diagnóstico correto, qualquer reparo é um tiro no escuro.
                </p>
                <p>
                  Em Curitiba e região metropolitana, nosso diagnóstico técnico pode ser realizado no local (visita a domicílio), remotamente (para problemas de software) ou em laboratório (para casos que exigem bancada e equipamentos específicos).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* POR QUE É PAGO */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Por Que o Diagnóstico Tem Custo?
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Diagnóstico profissional envolve tempo, conhecimento técnico, ferramentas especializadas e responsabilidade. Veja o que está por trás desse investimento:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Clock, title: "Tempo Técnico Dedicado", desc: "Cada diagnóstico exige de 30 minutos a várias horas de análise. O técnico dedica atenção exclusiva ao seu equipamento." },
                  { icon: Wrench, title: "Ferramentas Profissionais", desc: "Multímetros, fontes de teste, software especializado, estação de solda — equipamentos que custam milhares de reais." },
                  { icon: Eye, title: "Conhecimento Especializado", desc: "Anos de experiência permitem identificar padrões de falha que técnicos amadores não reconhecem. Isso evita trocas desnecessárias." },
                  { icon: ShieldCheck, title: "Responsabilidade Técnica", desc: "Um diagnóstico correto orienta o cliente sobre a melhor decisão: reparar, trocar peça ou adquirir equipamento novo." },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-background rounded-xl p-5 flex gap-4">
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

        {/* DIFERENÇA DIAGNÓSTICO vs EXECUÇÃO */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Diagnóstico ≠ Execução do Reparo
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-secondary rounded-xl p-6 border-l-4 border-accent">
                  <Search className="h-8 w-8 text-accent mb-3" />
                  <h3 className="text-xl font-bold text-foreground mb-3">Diagnóstico</h3>
                  <ul className="space-y-2">
                    {[
                      "Identifica a causa do problema",
                      "Testa componentes individualmente",
                      "Avalia riscos e viabilidade",
                      "Informa ao cliente a situação real",
                      "Gera valor do atendimento fundamentado",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-secondary rounded-xl p-6 border-l-4 border-primary">
                  <Wrench className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-bold text-foreground mb-3">Execução do Reparo</h3>
                  <ul className="space-y-2">
                    {[
                      "Somente após diagnóstico aprovado",
                      "Troca de peças ou componentes",
                      "Instalação e configuração",
                      "Testes pós-reparo",
                      "Garantia do serviço realizado",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                <strong>Importante:</strong> O reparo só é executado com aprovação do cliente. Se o diagnóstico indicar que não compensa reparar, você paga apenas o diagnóstico.
              </p>
            </div>
          </div>
        </section>

        {/* RISCOS DE NÃO DIAGNOSTICAR */}
        <section className="py-8 md:py-10 bg-accent/5">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Riscos de Não Fazer um Diagnóstico Profissional
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Muitos clientes tentam economizar pulando o diagnóstico. Veja o que pode acontecer:
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: "Troca desnecessária de peças", desc: "Sem saber a causa real, técnicos amadores trocam peças que estão funcionando — e o problema continua." },
                  { title: "Dano maior ao equipamento", desc: "Tentar reparar sem diagnóstico pode causar curto-circuito, queima de componentes ou perda total." },
                  { title: "Perda de dados permanente", desc: "Um HD com setores defeituosos precisa de tratamento especial. Mexer sem diagnóstico pode tornar dados irrecuperáveis." },
                  { title: "Gasto duplo ou triplo", desc: "O cliente paga um reparo errado, depois outro, e acaba gastando muito mais do que o diagnóstico custaria." },
                  { title: "Equipamento condenado", desc: "Um simples problema de capacitor vira uma placa toda queimada quando alguém tenta resolver sem preparo." },
                  { title: "Tempo perdido", desc: "Semanas tentando soluções caseiras que não funcionam, enquanto um diagnóstico resolve em minutos." },
                ].map((item, i) => (
                  <div key={i} className="bg-background rounded-xl p-5 border border-destructive/20">
                    <AlertTriangle className="h-5 w-5 text-destructive mb-2" />
                    <h3 className="font-bold text-primary text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EXEMPLOS REAIS */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Exemplos Reais: Quando o Diagnóstico Salvou o Equipamento
              </h2>
              <div className="space-y-4">
                {[
                  { caso: "Notebook não liga", aparente: "Placa mãe queimada", real: "Capacitor de alimentação com defeito — R$ 120 no reparo, economia de R$ 2.500 em placa nova." },
                  { caso: "PC reiniciando sozinho", aparente: "Vírus ou sistema corrompido", real: "Fonte de alimentação instável — troca da fonte por R$ 180 resolveu, sem necessidade de formatação." },
                  { caso: "TV com tela escura", aparente: "Painel LCD queimado", real: "LEDs de retroiluminação defeituosos — reparo por R$ 250 ao invés de trocar TV de R$ 3.000." },
                  { caso: "Computador lento", aparente: "Precisa trocar tudo", real: "HD com setores defeituosos — upgrade para SSD por R$ 200 deixou o PC como novo." },
                ].map((ex, i) => (
                  <div key={i} className="bg-background rounded-xl p-5">
                    <h3 className="font-bold text-foreground mb-2">{ex.caso}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-destructive/5 rounded-lg p-3">
                        <span className="text-xs font-semibold text-destructive">❌ Aparência:</span>
                        <p className="text-sm text-muted-foreground">{ex.aparente}</p>
                      </div>
                      <div className="bg-accent/10 rounded-lg p-3">
                        <span className="text-xs font-semibold text-accent">✅ Diagnóstico real:</span>
                        <p className="text-sm text-muted-foreground">{ex.real}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-secondary rounded-2xl p-8 border-2 border-accent/20">
                <CircleDollarSign className="h-10 w-10 text-accent mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Quanto Custa o Diagnóstico?
                </h2>
                <div className="space-y-3 mb-6 text-left max-w-md mx-auto">
                  <div className="flex justify-between items-center bg-background rounded-lg p-3">
                    <span className="text-sm font-medium">Diagnóstico Presencial</span>
                    <span className="font-bold text-accent">R$ 99,99</span>
                  </div>
                  <div className="flex justify-between items-center bg-background rounded-lg p-3">
                    <span className="text-sm font-medium">Diagnóstico com Coleta</span>
                    <span className="font-bold text-accent">R$ 99,99 - R$ 100</span>
                  </div>
                  <div className="flex justify-between items-center bg-background rounded-lg p-3">
                    <span className="text-sm font-medium">Diagnóstico Remoto</span>
                    <span className="font-bold text-accent">A partir de R$ 79,99</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  O valor do diagnóstico é <strong>abatido do reparo</strong> quando aprovado. Se não aprovar, paga apenas o diagnóstico.
                </p>
                <Button variant="cta" size="lg" asChild>
                  <Link to="/valores">
                    Ver Tabela Completa <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* TÉCNICO AMADOR vs PROFISSIONAL */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Técnico Amador vs Técnico Profissional
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-background rounded-xl p-6 border-2 border-destructive/20">
                  <Ban className="h-8 w-8 text-destructive mb-3" />
                  <h3 className="text-lg font-bold text-foreground mb-3">Técnico Amador</h3>
                  <ul className="space-y-2">
                    {[
                      "Tenta adivinhar o problema",
                      "Troca peças por tentativa e erro",
                      "Usa ferramentas improvisadas",
                      "Não oferece garantia real",
                      "Pode causar mais danos",
                      "Cobra barato mas resolve pouco",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-background rounded-xl p-6 border-2 border-accent/20">
                  <ShieldCheck className="h-8 w-8 text-accent mb-3" />
                  <h3 className="text-lg font-bold text-foreground mb-3">Técnico Profissional</h3>
                  <ul className="space-y-2">
                    {[
                      "Diagnostica com método e precisão",
                      "Troca apenas o necessário",
                      "Usa equipamentos profissionais",
                      "Oferece garantia por escrito",
                      "Preserva o equipamento",
                      "Custo real é menor no longo prazo",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Perguntas Frequentes Sobre Diagnóstico Técnico
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-secondary rounded-xl border-none px-5">
                    <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Links relacionados */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <h2 className="mb-5 text-center text-xl md:text-2xl font-bold text-foreground">
              Depois do diagnóstico
            </h2>
            <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto text-sm">
              O diagnóstico avalia a causa provável, a condição e a viabilidade. A execução só
              acontece após a sua aprovação — e algumas falhas podem ser intermitentes, com
              recuperação e reparo não garantidos.
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {[
                { label: "Como funciona", to: "/como-funciona" },
                { label: "Preços e políticas", to: "/precos-e-politicas" },
                { label: "Quando não compensa reparar", to: "/quando-nao-compensa" },
                { label: "Equipamentos atendidos", to: "/equipamentos-atendidos" },
                { label: "Manutenção de computador", to: "/servicos/manutencao-de-computador" },
                { label: "Manutenção de notebook", to: "/servicos/manutencao-de-notebook" },
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
              Precisa de um Diagnóstico Profissional?
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Não arrisque seu equipamento com soluções improvisadas. Solicite um diagnóstico técnico profissional agora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("cta-final")}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
                </a>
              </Button>
              <Button variant="heroCta" size="lg" asChild>
                <Link to="/como-funciona">
                  Como Funciona <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

const faqItems = [
  { q: "O diagnóstico é pago mesmo?", a: "Sim. O diagnóstico envolve tempo técnico, ferramentas e conhecimento profissional. O valor é abatido do reparo quando aprovado." },
  { q: "Posso ter um valor sem diagnóstico?", a: "Estimativas podem ser feitas via WhatsApp com base na descrição do problema. Porém, o valor final depende do diagnóstico presencial." },
  { q: "E se eu não aprovar o reparo?", a: "Você paga apenas o valor do diagnóstico. Não há obrigação de realizar o reparo." },
  { q: "Quanto tempo demora o diagnóstico?", a: "Diagnóstico presencial: 30 a 60 minutos. Em laboratório: 1 a 5 dias úteis dependendo da complexidade." },
  { q: "O diagnóstico pode ser feito remotamente?", a: "Sim, para problemas de software, lentidão e configurações. Para problemas de hardware, é necessário diagnóstico presencial." },
  { q: "O valor do diagnóstico é abatido do reparo?", a: "Sim! Se o reparo for aprovado, o valor pago pelo diagnóstico é descontado do total do serviço." },
  { q: "Por que não oferecem diagnóstico grátis?", a: "Diagnóstico profissional exige tempo, ferramentas e experiência. Oferecer gratuitamente desvaloriza o trabalho e geralmente resulta em diagnósticos superficiais e incorretos." },
  { q: "Meu equipamento pode piorar durante o diagnóstico?", a: "Não. O diagnóstico é feito com cuidado e equipamentos adequados. O objetivo é identificar, não intervir." },
  { q: "O que acontece se o equipamento não tiver conserto?", a: "O técnico informa a situação real e orienta sobre as melhores opções: compra de peça, troca do equipamento ou aproveitamento de partes." },
  { q: "Vocês dão nota fiscal?", a: "Sim, emitimos nota fiscal para todos os serviços, inclusive diagnóstico." },
];

export default DiagnosticoTecnico;
