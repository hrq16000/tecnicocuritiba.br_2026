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
  MessageCircle, ArrowRight, AlertTriangle, CheckCircle2,
  DollarSign, Clock, Ban, TrendingDown, Monitor, Laptop,
  Tv, HardDrive, Calculator, ShieldCheck,
} from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";

const cenarios = [
  {
    icon: Monitor,
    titulo: "Desktop com Mais de 8-10 Anos",
    quando: "NÃO compensa",
    motivo: "Processador obsoleto, memória DDR2/DDR3 cara e escassa, sem suporte para sistemas modernos. O custo de atualizar todos os componentes se aproxima do preço de um PC novo com desempenho 5-10x superior.",
    alternativa: "Montar um PC novo com componentes atuais. A partir de R$ 1.500 é possível ter um computador moderno, silencioso e eficiente.",
    regra: "Se o upgrade custa mais que 50% de um PC novo equivalente, é hora de trocar.",
  },
  {
    icon: Laptop,
    titulo: "Notebook com Placa Mãe Queimada",
    quando: "Depende do modelo",
    motivo: "O custo de uma placa mãe de notebook equivale a 50-80% do valor de um notebook novo. Em modelos recentes (1-3 anos), pode compensar. Em modelos antigos, raramente vale a pena.",
    alternativa: "Se o notebook tem menos de 3 anos e a placa mãe custa até 40% do valor de um novo, pode compensar. Acima disso, considere trocar.",
    regra: "Placa mãe de notebook antigo = não compensa. Notebook recente e de alto valor = vale avaliar.",
  },
  {
    icon: Tv,
    titulo: "TV com Painel LCD/OLED Danificado",
    quando: "NÃO compensa",
    motivo: "O painel é o componente mais caro da TV (60-80% do valor). Se o painel quebrou por impacto, queda ou pressão, o custo de troca se aproxima do preço de uma TV nova.",
    alternativa: "Se o problema for nos LEDs de retroiluminação ou na fonte, o reparo compensa e geralmente custa 10-25% do valor da TV. Só o diagnóstico diferencia.",
    regra: "Painel quebrado por impacto = não compensa. LEDs, fonte ou T-CON = geralmente compensa.",
  },
  {
    icon: HardDrive,
    titulo: "HD com Barulhos Mecânicos",
    quando: "Compensa para recuperação de dados",
    motivo: "O HD em si não compensa reparar — é mais barato comprar um novo (R$ 150-300). Mas se contém dados importantes e insubstituíveis, a recuperação profissional pode valer cada centavo.",
    alternativa: "Substituir o HD por um SSD (muito mais rápido e durável). Recuperar dados do HD antigo antes da troca, se necessário.",
    regra: "Nunca repare o HD — substitua. Mas recupere os dados antes, se forem importantes.",
  },
  {
    icon: DollarSign,
    titulo: "Reparo que Custa Mais que 40% do Valor de um Novo",
    quando: "Raramente compensa",
    motivo: "É a regra geral: quando o reparo custa mais que 40-50% do preço de um equipamento novo equivalente, a matemática não fecha. O equipamento reparado continua com anos de uso e outros componentes próximos do fim de vida.",
    alternativa: "Investir em um equipamento novo com garantia do fabricante. Aproveitar peças boas do equipamento antigo (SSD, memória RAM) na nova máquina.",
    regra: "Reparo > 40% do valor de um novo = não compensa na maioria dos casos.",
  },
  {
    icon: TrendingDown,
    titulo: "Múltiplos Problemas Simultâneos",
    quando: "NÃO compensa",
    motivo: "Se o equipamento tem 3+ problemas simultâneos (tela, bateria, teclado, armazenamento), o custo acumulado dos reparos sempre ultrapassa o valor de um novo. Além disso, resolver um problema pode revelar outros.",
    alternativa: "Substituir o equipamento. Se possível, recuperar dados e reaproveitar peças compatíveis.",
    regra: "Vários defeitos + equipamento antigo = hora de trocar.",
  },
];

const QuandoNaoCompensa = () => {
  useEffect(() => {
    document.title = "Quando NÃO Compensa Reparar | Guia Técnico - Curitiba";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content",
        "Guia completo sobre quando compensa e quando NÃO compensa reparar computadores, notebooks, TVs e outros equipamentos. Dicas de um técnico profissional em Curitiba."
      );
    }
    trackPageView("/quando-nao-compensa", "Quando Não Compensa");
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Quero saber se meu equipamento compensa reparar.")}`;
  const handleCTA = (label: string) => trackCTAClick("whatsapp", `quando-nao-compensa-${label}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title="Quando NÃO Compensa Reparar | Guia Técnico - Curitiba" description="Guia completo sobre quando compensa e quando NÃO compensa reparar computadores, notebooks, TVs e outros equipamentos. Dicas de um técnico profissional em Curitiba." path="/quando-nao-compensa" breadcrumbs={[{ name: "Início", path: "/" }, { name: "Quando Não Compensa", path: "/quando-nao-compensa" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://tecnico.curitiba.br/" },
          { "@type": "ListItem", position: 2, name: "Quando Não Compensa Reparar", item: "https://tecnico.curitiba.br/quando-nao-compensa" },
        ],
      })}} />
      <JsonLdSchema />
      <Header />
      <Breadcrumbs items={[{ label: "Quando Não Compensa Reparar" }]} />

      <main>
        {/* HERO */}
        <section className="relative hero-gradient pt-10 pb-10 md:pt-12 md:pb-12">
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Quando NÃO Compensa Reparar Seu Equipamento
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Um técnico honesto sabe dizer quando não vale a pena gastar com reparo. Este guia completo ajuda você a tomar a melhor decisão — com transparência e sem pressão comercial.
              </p>
              <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("hero")}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Consultar Viabilidade
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Imagem componentes */}
        <section className="py-0 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto -mt-8 relative z-20">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img decoding="async" src={IMAGES.componentesSsd} alt={IMAGES.componentesSsdAlt} className="w-full h-48 md:h-64 object-cover" loading="eager" width="800" height="400" />
              </div>
            </div>
          </div>
        </section>

        {/* REGRA GERAL */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                A Regra de Ouro: 40% do Valor de Um Novo
              </h2>
              <div className="bg-background rounded-2xl p-6 md:p-8 border-2 border-accent/20">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Calculator className="h-8 w-8 text-accent" />
                </div>
                <p className="text-center text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-4">
                  Se o custo do reparo ultrapassa <strong className="text-accent text-lg">40% do valor de um equipamento novo equivalente</strong>, geralmente não compensa reparar. O equipamento reparado continuará com anos de uso e outros componentes próximos do fim de vida útil.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Claro, existem exceções — equipamentos com valor sentimental, dados insubstituíveis ou modelos profissionais de alto custo. <strong>O diagnóstico profissional avalia caso a caso.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CENÁRIOS */}
        {cenarios.map((cenario, i) => {
          const Icon = cenario.icon;
          return (
            <section key={i} className={`py-8 md:py-10 ${i % 2 === 0 ? "bg-background" : "bg-secondary"}`}>
              <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`rounded-xl p-3 flex-shrink-0 ${cenario.quando === "NÃO compensa" ? "bg-destructive/10" : "bg-accent/10"}`}>
                      <Icon className={`h-7 w-7 ${cenario.quando === "NÃO compensa" ? "text-destructive" : "text-accent"}`} />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-primary">{cenario.titulo}</h2>
                      <span className={`text-sm font-bold ${cenario.quando === "NÃO compensa" ? "text-destructive" : "text-accent"}`}>
                        {cenario.quando === "NÃO compensa" ? "❌ " : "⚠️ "}{cenario.quando}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-semibold text-primary text-sm mb-1">Por quê?</h3>
                      <p className="text-sm text-muted-foreground">{cenario.motivo}</p>
                    </div>
                    <div className="bg-accent/5 rounded-lg p-4">
                      <h3 className="font-semibold text-accent text-sm mb-1">Alternativa recomendada:</h3>
                      <p className="text-sm text-muted-foreground">{cenario.alternativa}</p>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3 flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground"><strong className="text-foreground">Regra:</strong> {cenario.regra}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* QUANDO COMPENSA */}
        <section className="py-8 md:py-10 bg-accent/5">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                E Quando COMPENSA Reparar?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Equipamento recente (1-3 anos)", desc: "Peças disponíveis, custo de reparo proporcionalmente baixo." },
                  { title: "Problema pontual e identificado", desc: "Um único componente defeituoso em um equipamento saudável." },
                  { title: "Reparo custa menos que 30% do novo", desc: "Relação custo-benefício favorável, especialmente em equipamentos de alto valor." },
                  { title: "Dados insubstituíveis", desc: "Fotos, documentos, projetos — a recuperação justifica o investimento." },
                  { title: "Equipamento profissional", desc: "Workstations, servidores e equipamentos profissionais têm custo alto de substituição." },
                  { title: "Problema de software", desc: "Formatação, remoção de vírus e configurações sempre compensam em qualquer equipamento funcional." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-background rounded-lg p-4">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-10 md:py-20 bg-primary">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Não Sabe Se Compensa Reparar?
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              O diagnóstico profissional é a única forma de saber com certeza. Avaliamos o equipamento e orientamos com honestidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("cta-final")}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Consultar pelo WhatsApp
                </a>
              </Button>
              <Button variant="heroCta" size="lg" asChild>
                <Link to="/diagnostico-tecnico">
                  Sobre o Diagnóstico <ArrowRight className="h-4 w-4 ml-1" />
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

export default QuandoNaoCompensa;
