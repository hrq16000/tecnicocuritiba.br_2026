import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import { RealImageSection } from "@/components/RealImageSection";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { FloatingParticles } from "@/components/FloatingParticles";
import { AnimatedSection } from "@/components/AnimatedSection";
import { trackPageView, trackFaqToggle } from "@/lib/analytics";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    category: "Preços e valor do atendimento",
    questions: [
      {
        question: "Quanto custa chamar um técnico em Curitiba?",
        answer: "Quando há visita ou diagnóstico presencial aplicável, o atendimento começa a partir de R$ 99,99. O valor final depende da avaliação do problema, do tempo necessário e de eventuais peças, licenças ou materiais. Passamos a estimativa antes de iniciar."
      },
      {
        question: "O valor do atendimento é passado antes do serviço?",
        answer: "Sim. Você recebe orientação, prazo estimado e condições antes de qualquer execução. O serviço só avança após o seu alinhamento. Estimativas iniciais são feitas pelo WhatsApp; casos que exigem análise podem precisar de diagnóstico presencial ou em laboratório."
      },
    ]
  },
  {
    category: "Serviços de Informática",
    questions: [
      {
        question: "Vocês atendem notebook e computador?",
        answer: "Sim. Trabalhamos com notebooks e computadores (PC), incluindo manutenção, formatação, limpeza, otimização e diagnóstico de problemas de hardware e software."
      },
      {
        question: "Fazem formatação com backup?",
        answer: "Sim. Fazemos formatação e reinstalação do sistema e podemos realizar backup dos seus dados antes do processo, quando solicitado. O backup pode influenciar o prazo e o valor do atendimento."
      },
      {
        question: "Fazem upgrade para SSD e memória RAM?",
        answer: "Sim. Verificamos a compatibilidade do seu equipamento e fazemos upgrade de SSD e de memória RAM. As peças não estão incluídas na mão de obra e podem ser cobradas à parte."
      },
      {
        question: "Removem vírus?",
        answer: "Sim. Fazemos varredura, remoção de ameaças e configuração de proteção adequada. Em casos complexos, pode ser necessário mais tempo de análise, o que é informado antes."
      },
      {
        question: "Recuperação de dados é garantida?",
        answer: "Não. A recuperação de dados depende do tipo e da gravidade do dano no equipamento, por isso não é possível garantir sucesso. Fazemos a análise e explicamos as possibilidades e condições antes de prosseguir."
      },
      {
        question: "Atendem Wi-Fi e redes?",
        answer: "Sim. Configuramos roteadores, redes Wi-Fi, melhoria de sinal e organização de rede para residências e empresas."
      },
    ]
  },
  {
    category: "Empresas e Regiões",
    questions: [
      {
        question: "Atendem empresas?",
        answer: "Sim. Oferecemos suporte técnico empresarial, com atendimento pontual ou escopo recorrente sob consulta, conforme a estrutura e as necessidades da empresa."
      },
      {
        question: "Quais regiões são atendidas?",
        answer: "Atendemos Curitiba e a região metropolitana, incluindo São José dos Pinhais, Pinhais, Colombo, Araucária e Campo Largo. Parte dos atendimentos também pode ser feita de forma remota."
      },
    ]
  },
  {
    category: "Atendimento e Contato",
    questions: [
      {
        question: "O atendimento começa pelo WhatsApp?",
        answer: "Sim. O atendimento é iniciado pelo funil no WhatsApp. Uma triagem entende o seu problema e organiza o pedido antes de dar sequência ao diagnóstico e à execução."
      },
      {
        question: "O número de WhatsApp fica visível no site?",
        answer: "Não. Para organizar melhor os atendimentos, o número não fica exposto no site. O contato é feito pelos botões de atendimento, que abrem a conversa diretamente."
      },
      {
        question: "Vocês atendem TV, celular ou eletrônicos?",
        answer: "Este site é focado em informática: notebook, computador/PC, formatação, upgrade de SSD/RAM, remoção de vírus, backup, recuperação de dados, redes/Wi-Fi e suporte técnico empresarial. Para outros tipos de equipamento, consulte pelo WhatsApp a disponibilidade."
      },
    ]
  },
  {
    category: "Decisões técnicas antes de autorizar um serviço",
    questions: [
      {
        question: "Formatar apaga tudo?",
        answer: "A instalação limpa apaga o conteúdo da partição do sistema, incluindo programas instalados e, na prática, os arquivos das pastas de usuário (Documentos, Downloads, Área de Trabalho). Arquivos em outra unidade física costumam ser preservados, mas não tratamos isso como garantia: se houver algo sem cópia, o backup é feito antes, e só depois o sistema é reinstalado. Licença do Windows vinculada ao equipamento normalmente é reativada sozinha; licenças de programas de terceiros precisam da chave ou do login em mãos."
      },
      {
        question: "SSD resolve computador lento?",
        answer: "Resolve quando o gargalo é o armazenamento: máquina com HD mecânico que demora para ligar, abrir programas e alternar tarefas melhora de forma clara. Não resolve quando a lentidão vem de memória insuficiente, superaquecimento com redução automática de desempenho (thermal throttling), programas indesejados na inicialização ou defeito de placa. Por isso medimos o gargalo antes de indicar a peça, em vez de vender SSD como solução universal."
      },
      {
        question: "Computador que não liga pode ser só a fonte?",
        answer: "Pode, e é um dos cenários mais comuns em desktop: nenhum LED, nenhum ruído de ventoinha e nenhuma resposta ao botão. Mas o mesmo comportamento aparece em curto na placa, botão de energia, memória mal encaixada e cabo de energia rompido. A separação começa distinguindo falha de alimentação (não dá sinal nenhum) de falha de inicialização (liga, ventila, mas não completa o boot) — são caminhos de diagnóstico diferentes."
      },
      {
        question: "Posso continuar usando o computador que está esquentando muito?",
        answer: "Uso contínuo com temperatura alta tende a agravar o quadro: o equipamento reduz desempenho para se proteger, pode desligar sem aviso e o desligamento abrupto repetido aumenta o risco de corrupção do sistema e de arquivos abertos. Se houver desligamento súbito, cheiro forte ou ruído anormal, o mais seguro é parar de usar e trazer para avaliação — insistir raramente melhora e às vezes transforma limpeza em troca de peça."
      },
      {
        question: "Meu HD está fazendo um clique repetitivo. O que faço primeiro?",
        answer: "Desligue e não ligue de novo. Ruído repetitivo costuma indicar falha física, e cada nova tentativa força um hardware já comprometido, reduzindo a chance de leitura. Não execute programas de recuperação sobre o disco original e não formate quando o sistema pedir. Se há dados importantes, essa é a situação de urgência alta: preservar o estado atual vale mais que qualquer tentativa caseira."
      },
      {
        question: "Vale a pena reparar um notebook antigo?",
        answer: "Depende de quatro fatores: custo da peça, estado geral do conjunto (tela, teclado, bateria, dobradiças), disponibilidade do componente para aquele modelo e valor de mercado do aparelho. Troca de armazenamento, memória, bateria ou limpeza costuma valer em aparelhos ainda saudáveis. Quando o orçamento se aproxima do preço de um equipamento adequado, ou quando a placa apresenta dano extenso, dizemos isso abertamente — inclusive quando a melhor decisão é migrar os dados em vez de reparar."
      },
      {
        question: "Quanto tempo demora um diagnóstico?",
        answer: "Não usamos prazo fixo, porque o tempo depende do sintoma. Falhas que se reproduzem na hora (não liga, não dá vídeo, não reconhece o disco) são identificadas mais rápido; sintomas intermitentes, como travamento ocasional e desligamento aleatório, exigem observação sob carga e testes sequenciais de memória, temperatura, alimentação e integridade do sistema. Depois da avaliação informamos a causa provável, o prazo estimado e o valor — a execução só ocorre com a sua aprovação."
      },
      {
        question: "Como sei se o problema é de software, hardware ou da internet?",
        answer: "Alguns sinais ajudam a separar. Sintoma que desaparece em outro sistema ou em modo de segurança aponta para software. Sintoma que aparece antes do Windows carregar, ou que persiste em qualquer sistema, aponta para hardware. Lentidão só em navegação, com o restante do computador respondendo bem, aponta para rede: nesse caso vale comparar cabo e Wi-Fi, testar outro dispositivo na mesma rede e observar se a queda ocorre em horários específicos. Essa separação é o primeiro passo do diagnóstico e evita pagar pelo serviço errado."
      },
    ]
  },
];


const FAQ = () => {
  useEffect(() => {
    document.title = "FAQ Técnico Curitiba | Preço, Prazo e Garantia";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Dúvidas sobre preço, prazo, garantia, formatação, vírus e atendimento técnico em Curitiba. Veja respostas rápidas e chame no WhatsApp."
      );
    }
    trackPageView("/faq", "FAQ");
  }, []);

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap(cat => 
      cat.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    )
  };

  useJsonLdSlot(SCHEMA_SLOTS.faq, faqSchema, SLOT_PRIORITY.page);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title="FAQ Técnico Curitiba | Preço, Prazo e Garantia" description="Dúvidas sobre preço, prazo, garantia, formatação, vírus e atendimento técnico em Curitiba. Veja respostas rápidas e chame no WhatsApp." path="/faq" breadcrumbs={[{ name: "Início", path: "/" }, { name: "FAQ", path: "/faq" }]} />
      <JsonLdSchema />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 premium-gradient" />
          <FloatingParticles count={20} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.07] blur-[120px] animate-breathe" />
            <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[100px] animate-breathe" style={{ animationDelay: "2.5s" }} />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
          <div className="container mx-auto relative z-10 pt-14 pb-20 md:pt-20 md:pb-24">
            <AnimatedSection animation="fade-up">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-sm font-medium text-white/90 mb-6 border border-white/15 shimmer">
                  <HelpCircle className="h-4 w-4 text-accent" />
                  <span>Tire suas dúvidas</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-5">
                  FAQ Técnico Curitiba: <span className="gradient-text-animated">preço, prazo e garantia</span>
                </h1>
                <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                  Tire suas dúvidas sobre nossos serviços de informática
                </p>
                <div className="glow-separator max-w-[200px] mx-auto mt-6" />
              </div>
            </AnimatedSection>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-8 md:py-10 bg-background relative overflow-hidden">
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto">
              {faqCategories.map((category, catIndex) => (
                <div key={catIndex} className="mb-10 stagger-item" style={{ animationDelay: `${catIndex * 120}ms` }}>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 reveal-text">
                    {category.category}
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="space-y-3"
                    onValueChange={(value) => {
                      if (!value) return;
                      const qIdx = Number(value.split("-")[1]);
                      const q = category.questions[qIdx];
                      if (q) trackFaqToggle(q.question, "open", `faq_${category.category}`, qIdx);
                    }}
                  >

                    {category.questions.map((item, qIndex) => (
                      <AccordionItem
                        key={qIndex}
                        value={`${catIndex}-${qIndex}`}
                        className="glass-card gradient-border rounded-xl border-none px-5 hover:shadow-[var(--shadow-md)] transition-all duration-300"
                      >
                        <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent hover:no-underline py-4">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Não encontrou */}
        <section className="py-8 md:py-10 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.06),transparent_60%)] pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 reveal-text">
                Não Encontrou Sua Dúvida?
              </h2>
              <p className="text-muted-foreground mb-6 reveal-text" data-reveal-delay="100">
                Entre em contato pelo WhatsApp e tire suas dúvidas diretamente com nossa equipe
              </p>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <RealImageSection imageKey="diagnostico" caption="Diagnóstico técnico profissional com equipamentos especializados" />
      <BlocoInteligencia />
      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default FAQ;
