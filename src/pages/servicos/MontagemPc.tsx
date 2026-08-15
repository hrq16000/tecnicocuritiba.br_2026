import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Link } from "@/lib/router-compat";
import { Monitor, CheckCircle, Cpu, Gamepad2, Briefcase, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { RealImageSection } from "@/components/RealImageSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "5541997086380";

const MontagemPc = () => {
  useEffect(() => {
    document.title = "Montagem de PC Gamer e Workstation em Curitiba | Técnico Curitiba";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Montagem de PC Gamer e Workstation em Curitiba. Computador personalizado para jogos, trabalho ou edição. Configuração ideal para seu atendimento.");
    }
    trackPageView("/servicos/montagem-pc", "Montagem de PC");
  }, []);

  const handleWhatsAppClick = () => {
    trackCTAClick("whatsapp", "montagem-pc");
    const message = encodeURIComponent("Olá! Quero montar um PC personalizado. Podem me ajudar?");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO noindex title="Montagem de PC Gamer e Workstation em Curitiba | Técnico Curitiba" description="Montagem de PC Gamer e Workstation em Curitiba. Computador personalizado para jogos, trabalho ou edição. Configuração ideal para seu atendimento." path="/servicos/montagem-pc"  breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Serviços", path: "/servicos" },
        { name: "Montagem de PC", path: "/servicos/montagem-pc" }
      ]} />
      <Header />
      <Breadcrumbs items={[{ label: "Serviços", href: "/servicos" }, { label: "Montagem de PC" }]} />
      
      {/* Hero Section */}
      <section className="pt-10 pb-10 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6 shimmer">
              <Cpu className="h-5 w-5" />
              <span className="font-medium">PC Personalizado</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 reveal-text">
              Montagem de PC Gamer e Workstation em Curitiba
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
              Computador montado sob medida para suas necessidades. PC Gamer, Workstation para edição, ou PC para trabalho e estudo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-text" data-reveal-delay="200">
              <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white shadow-[0_0_24px_rgba(37,211,102,0.3)] hover:shadow-[0_0_32px_rgba(37,211,102,0.5)] transition-all duration-300" onClick={handleWhatsAppClick}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Montar meu PC com o técnico
              </Button>
            </div>
          </div>
        </div>
      </section>
      <RealImageSection imageKey="desktopMontado" caption="PC montado sob medida com componentes premium" />

      {/* Tipos de PC */}
      <section className="py-10 bg-background relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-6 reveal-text">
            Montamos o PC Ideal Para Você
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { Icon: Gamepad2, title: "PC Gamer", desc: "Para jogos em alta performance, streaming e realidade virtual.", items: ["Placa de vídeo dedicada", "SSD NVMe rápido", "Memória RAM alta", "Gabinete com RGB", "Refrigeração eficiente"], price: "A partir de R$3.500", highlight: false },
              { Icon: Monitor, title: "Workstation", desc: "Para edição de vídeo, 3D, design e aplicações profissionais.", items: ["Processador multi-core", "32GB+ de RAM", "GPU profissional", "Armazenamento amplo", "Estabilidade total"], price: "A partir de R$5.000", highlight: true },
              { Icon: Briefcase, title: "PC Trabalho", desc: "Para escritório, home office, navegação e tarefas do dia a dia.", items: ["Processador eficiente", "8-16GB RAM", "SSD rápido", "Silencioso", "Consumo baixo"], price: "A partir de R$1.800", highlight: false },
            ].map((card, idx) => (
              <div key={idx} className={`bg-secondary p-8 rounded-xl text-center group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 stagger-item ${card.highlight ? "border-2 border-accent shadow-[0_0_20px_rgba(var(--accent)/0.15)]" : ""}`} style={{ animationDelay: `${idx * 120}ms` }}>
                <card.Icon className="h-16 w-16 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-foreground mb-4">{card.title}</h3>
                <p className="text-muted-foreground mb-6">{card.desc}</p>
                <ul className="text-left space-y-2 mb-6">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xl font-bold text-accent">{card.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RealImageSection imageKey="placaMae" caption="Componentes de alta performance selecionados" />

      {/* O que está incluso */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-6 reveal-text">
            O Que Está Incluso no Serviço
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Consultoria", desc: "Ajudamos a escolher as peças ideais para seu uso" },
              { title: "Montagem", desc: "Montagem profissional com cuidado" },
              { title: "Sistema", desc: "Windows instalado e configurado" },
              { title: "Testes", desc: "Testes de estresse e estabilidade" },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-background rounded-xl group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 stagger-item" style={{ animationDelay: `${index * 80}ms` }}>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-6 reveal-text">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Conversa", desc: "Entendemos sua necessidade e valor do atendimento" },
              { step: "2", title: "Valor do atendimento", desc: "Montamos a configuração ideal" },
              { step: "3", title: "Aprovação", desc: "Você aprova as peças escolhidas" },
              { step: "4", title: "Montagem", desc: "Montamos, testamos e entregamos" },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-secondary rounded-xl group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 stagger-item" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-6 reveal-text">
            Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { q: "Posso escolher as peças?", a: "Claro! Você pode trazer suas peças ou escolher junto conosco. Damos sugestões baseadas no seu atendimento e necessidade." },
              { q: "Vocês vendem as peças?", a: "Podemos ajudar na compra das peças em lojas parceiras com bons preços, ou você pode adquirir por conta própria." },
              { q: "Qual a garantia?", a: "As peças têm garantia do fabricante. O serviço de montagem tem garantia de 90 dias." },
              { q: "Quanto tempo demora?", a: "Com todas as peças disponíveis, a montagem leva de 1 a 2 dias úteis." },
              { q: "Vocês entregam?", a: "Sim! Entregamos o PC pronto na sua casa em toda Curitiba e região." },
            ].map((item, index) => (
              <div key={index} className="bg-background p-6 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 stagger-item" style={{ animationDelay: `${index * 80}ms` }}>
                <h3 className="font-bold text-foreground mb-2">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-10 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-breathe" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-heading font-bold text-white mb-4 reveal-text">
            Quer um PC Sob Medida?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Entre em contato e monte o computador dos seus sonhos com a gente!
          </p>
          <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white shadow-[0_0_24px_rgba(37,211,102,0.3)] hover:shadow-[0_0_32px_rgba(37,211,102,0.5)] transition-all duration-300" onClick={handleWhatsAppClick}>
            <MessageCircle className="mr-2 h-5 w-5" />
            Agendar a montagem do PC
          </Button>
        </div>
      </section>



      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default MontagemPc;
