import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { IMAGES } from "@/lib/images";
import { Link } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  MessageCircle, ArrowRight, AlertTriangle, CheckCircle2,
  Zap, HardDrive, Cpu, Wrench, Monitor, ShieldCheck,
} from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";

const casos = [
  {
    titulo: "Upgrade de Memória RAM Que Causou Curto-Circuito",
    equipamento: "Notebook Dell Inspiron",
    problema: "Cliente comprou memória RAM incompatível pela internet e tentou instalar sozinho. Ao ligar o notebook, houve um curto-circuito que danificou o slot de memória e parte da placa mãe.",
    diagnostico: "Curto no circuito de alimentação do slot de memória RAM. A tensão foi aplicada em pinos incorretos por conta da memória incompatível (DDR4 em slot DDR3L).",
    solucao: "Reparo do circuito na placa mãe com micro-solda. Instalação da memória correta. Custo total: R$ 450. Sem o diagnóstico profissional, o notebook teria sido condenado.",
    licao: "Nem toda memória RAM serve para qualquer notebook. A compatibilidade vai além do tipo (DDR4/DDR5) — voltagem, frequência e formato físico importam. Sempre consulte um técnico antes de comprar peças.",
    icon: Zap,
  },
  {
    titulo: "GPU Desgastada Por Mineração de Criptomoedas",
    equipamento: "PC Gamer com RTX 3060",
    problema: "Cliente comprou uma placa de vídeo 'nova' por um preço muito abaixo do mercado. Após 2 semanas, o PC começou a apresentar artefatos visuais, tela congelando e reinícios aleatórios.",
    diagnostico: "GPU com desgaste prematuro por uso prolongado em mineração de criptomoedas. Memórias GDDR6 com temperatura de operação permanentemente elevada, causando degradação dos chips.",
    solucao: "A placa não tinha reparo viável — os chips de memória estavam permanentemente danificados. O cliente precisou comprar uma placa nova. Prejuízo total: Valor da placa usada + nova.",
    licao: "Placas de vídeo usadas de mineração podem parecer funcionais nos primeiros dias, mas o desgaste aparece rapidamente. Sempre verifique a procedência e, se possível, peça um diagnóstico antes de comprar hardware usado.",
    icon: Cpu,
  },
  {
    titulo: "Uso de Ferramenta Inadequada em Notebook",
    equipamento: "Notebook Lenovo IdeaPad",
    problema: "Cliente tentou abrir o notebook com uma faca de cozinha para limpar internamente. Danificou os clipes de fixação da carcaça, riscou a placa mãe e cortou um flat cable do teclado.",
    diagnostico: "Flat cable do teclado cortado, trilhas da placa mãe riscadas (2 trilhas interrompidas), clipes da carcaça quebrados. O teclado parou de funcionar e o touchpad ficou intermitente.",
    solucao: "Reparo das trilhas com micro-solda, troca do flat cable do teclado, substituição dos clipes danificados. Custo: R$ 320. Se tivesse buscado ajuda profissional para a limpeza, teria custado apenas R$ 100.",
    licao: "Notebooks possuem componentes extremamente delicados. Abrir com ferramentas inadequadas pode causar danos irreversíveis. Use sempre ferramentas profissionais (chaves de precisão, espátulas plásticas) ou procure um técnico.",
    icon: Wrench,
  },
  {
    titulo: "Placa Mãe Comprometida Por Líquido",
    equipamento: "MacBook Air M1",
    problema: "Café derramado no teclado. O cliente desligou, secou por fora e continuou usando por 3 dias. No quarto dia, o notebook não ligou mais.",
    diagnostico: "Oxidação severa na placa mãe causada pelo ácido do café. O uso contínuo após o derramamento acelerou a corrosão. Múltiplos componentes SMD oxidados e curto-circuito em 3 pontos.",
    solucao: "Limpeza ultrassônica da placa + micro-solda em componentes oxidados. Custo: R$ 800. Se o cliente tivesse desligado imediatamente e trazido para diagnóstico, a limpeza simples teria custado R$ 200.",
    licao: "Quando líquido cai em um equipamento eletrônico: 1) Desligue imediatamente. 2) NÃO tente ligar novamente. 3) Leve para diagnóstico profissional o mais rápido possível. Cada hora conta — a oxidação começa em minutos.",
    icon: AlertTriangle,
  },
  {
    titulo: "Máquina Antiga: Quando Não Compensa Reparar",
    equipamento: "Desktop com processador Core 2 Duo",
    problema: "Cliente queria 'deixar o computador rápido novamente'. O PC tinha 12 anos, HD mecânico de 160GB, 2GB de RAM DDR2 e processador Core 2 Duo.",
    diagnostico: "Equipamento em fim de vida útil. HD com setores defeituosos, memória DDR2 (fora de fabricação, cara no mercado), processador sem suporte para Windows 10/11.",
    solucao: "O técnico orientou o cliente que investir em reparo não compensava: a memória DDR2 custava quase o mesmo que DDR5 atual, o processador não suportaria sistemas modernos e o HD precisaria ser trocado. Sugestão: montar um PC novo por R$ 1.500 com desempenho 10x superior.",
    licao: "Equipamentos com mais de 8-20 anos geralmente não compensam reparo. O custo das peças antigas é alto, a disponibilidade é baixa e o desempenho nunca será satisfatório para uso moderno. Um técnico honesto orienta quando é hora de trocar.",
    icon: Monitor,
  },
  {
    titulo: "Reballing de GPU: O Mito e a Realidade",
    equipamento: "Notebook HP Pavilion Gaming",
    problema: "Cliente foi informado por outro técnico que precisava de 'reballing' na GPU. O valor do atendimento: R$ 600. O cliente buscou uma segunda opinião.",
    diagnostico: "O problema real era superaquecimento crônico por obstrução do sistema de ventilação. A pasta térmica estava completamente ressecada e a ventoinha acumulava 5mm de poeira compactada.",
    solucao: "Limpeza completa do sistema de refrigeração + troca de pasta térmica de qualidade. Custo: R$ 150. O problema nunca foi na GPU — era térmico. O 'reballing' teria sido desnecessário e arriscado.",
    licao: "Reballing é um procedimento real, mas raramente necessário. Muitos técnicos usam o termo para justificar cobranças altas. Sempre busque uma segunda opinião e peça explicações detalhadas sobre o diagnóstico.",
    icon: ShieldCheck,
  },
];

const ProblemasReaisCasos = () => {
  useEffect(() => {
    document.title = "Problemas Reais e Casos Técnicos | Assistência Técnica Curitiba";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content",
        "Conheça casos reais de problemas técnicos: upgrade que causou curto, GPU desgastada, placa mãe comprometida e mais. Aprenda com exemplos reais e evite prejuízos."
      );
    }
    trackPageView("/problemas-reais-e-casos", "Problemas Reais e Casos");
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Estou com um problema no meu equipamento e gostaria de uma avaliação.")}`;
  const handleCTA = (label: string) => trackCTAClick("whatsapp", `casos-${label}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO noindex title="Problemas Reais e Casos Técnicos | Assistência Técnica Curitiba" description="Conheça casos reais de problemas técnicos: upgrade que causou curto, GPU desgastada, placa mãe comprometida e mais. Aprenda com exemplos reais e evite prejuízos." path="/problemas-reais-e-casos" breadcrumbs={[{ name: "Início", path: "/" }, { name: "Problemas Reais", path: "/problemas-reais-e-casos" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "https://tecnico.curitiba.br/" },
          { "@type": "ListItem", position: 2, name: "Problemas Reais e Casos", item: "https://tecnico.curitiba.br/problemas-reais-e-casos" },
        ],
      })}} />
      <JsonLdSchema />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas Reais e Casos" }]} />

      <main>
        {/* HERO */}
        <section className="relative hero-gradient pt-10 pb-10 md:pt-12 md:pb-12">
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Problemas Reais e Casos Técnicos: Aprenda com Exemplos
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Veja casos reais de atendimentos técnicos em Curitiba. Entenda como problemas aparentemente simples podem ser complexos — e como o diagnóstico profissional faz toda a diferença.
              </p>
              <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("hero")}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Solicitar Avaliação
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Imagem placa danificada */}
        <section className="py-0 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto -mt-8 relative z-20">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img decoding="async" src={IMAGES.placaMae} alt={IMAGES.placaMaeAlt} className="w-full h-48 md:h-64 object-cover" loading="eager" width="800" height="400" />
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                Por Que Compartilhamos Esses Casos?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Acreditamos que <strong className="text-foreground">um cliente bem informado toma decisões melhores</strong>. Ao compartilhar casos reais (sem identificar clientes), queremos mostrar:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" /> Como problemas aparentemente simples podem esconder falhas graves</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" /> Os riscos de tentar resolver sem conhecimento técnico adequado</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" /> Como o diagnóstico profissional pode economizar dinheiro</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" /> Quando compensa reparar e quando é melhor trocar</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CASOS */}
        {casos.map((caso, i) => {
          const Icon = caso.icon;
          return (
            <section key={i} className={`py-8 md:py-10 ${i % 2 === 0 ? "bg-background" : "bg-secondary"}`}>
              <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-accent/10 rounded-xl p-3 flex-shrink-0">
                      <Icon className="h-7 w-7 text-accent" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">Caso {i + 1}</span>
                      <h2 className="text-xl md:text-2xl font-bold text-primary">{caso.titulo}</h2>
                      <p className="text-sm text-muted-foreground">Equipamento: {caso.equipamento}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-destructive/5 rounded-xl p-5 border-l-4 border-destructive">
                      <h3 className="font-bold text-foreground mb-2">❌ O Problema</h3>
                      <p className="text-sm text-muted-foreground">{caso.problema}</p>
                    </div>
                    <div className="bg-accent/5 rounded-xl p-5 border-l-4 border-accent">
                      <h3 className="font-bold text-foreground mb-2">🔍 Diagnóstico Profissional</h3>
                      <p className="text-sm text-muted-foreground">{caso.diagnostico}</p>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-5 border-l-4 border-primary">
                      <h3 className="font-bold text-foreground mb-2">✅ Solução</h3>
                      <p className="text-sm text-muted-foreground">{caso.solucao}</p>
                    </div>
                    <div className="bg-secondary rounded-xl p-5 border-2 border-accent/20">
                      <h3 className="font-bold text-accent mb-2">💡 Lição</h3>
                      <p className="text-sm text-muted-foreground">{caso.licao}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* CTA FINAL */}
        <section className="py-10 md:py-20 bg-primary">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Está Com um Problema Parecido?
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Não tente resolver sozinho e arrisque piorar a situação. Solicite um diagnóstico profissional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="heroWhatsapp" size="lg" asChild onClick={() => handleCTA("cta-final")}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
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

export default ProblemasReaisCasos;
