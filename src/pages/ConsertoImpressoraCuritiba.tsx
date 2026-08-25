import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { ServiceLandingSchema } from "@/components/ServiceLandingSchema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Printer, MessageCircle, CalendarCheck, CheckCircle, Clock, Shield, ArrowRight } from "lucide-react";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const WHATSAPP = "5541997086380";
const PATH = "/conserto-impressora-curitiba";

const TITLE = "Conserto de Impressora em Curitiba | Técnico no Conforme agenda";
const DESC =
  "Conserto de impressoras a jato de tinta, laser e multifuncionais em Curitiba a partir de R$ 99,99. HP, Epson, Brother, Canon, Samsung. Atendimento domiciliar conforme a disponibilidade da agenda.";

const FAQS = [
  { question: "Quanto custa consertar uma impressora em Curitiba?", answer: "O atendimento começa em R$ 99,99 para diagnóstico + limpeza. Trocas de cabeça de impressão, fusor ou rolo de tração variam por modelo — valor sempre fechado antes do conserto, sem surpresa." },
  { question: "Vocês trabalham com qual marca de impressora?", answer: "HP, Epson, Brother, Canon, Samsung, Lexmark, Ricoh, Xerox e Pantum. Fazemos jato de tinta, tanque de tinta (EcoTank, Smart Tank, MegaTank), laser mono/colorida e multifuncionais." },
  { question: "Minha impressora não puxa papel, é caro consertar?", answer: "Geralmente não. Na maioria dos casos é a borrachinha do rolo de tração ressecada (R$ 99 a R$ 180 já com peça). Em casos de engrenagem quebrada o valor pode subir, mas avaliamos antes." },
  { question: "Atendem em domicílio ou só na loja?", answer: "Atendemos em domicílio em toda Curitiba e região metropolitana, com deslocamento médio de 30 a 60 minutos. Para impressoras corporativas grandes também fazemos coleta e entrega." },
  { question: "Vale a pena consertar minha impressora ou comprar uma nova?", answer: "Como regra: se o conserto ficar abaixo de 60% do valor de uma equivalente nova, vale consertar. Em impressoras com tanque de tinta (EcoTank, Smart Tank) quase sempre compensa pelo custo da tinta original." },
  { question: "Vocês recarregam cartucho ou trocam toner?", answer: "Sim. Recarga de cartucho a partir de R$ 49,99, toner original e compatível em estoque. Também instalamos sistemas de bulk ink (tanque externo) com garantia do fornecedor do sistema." },
];

const ConsertoImpressoraCuritiba = () => {
  useEffect(() => {
    document.title = TITLE;
    trackPageView(PATH, "Conserto de Impressora Curitiba");
  }, []);

  const waClick = () => {
    trackCTAClick("whatsapp", "conserto-impressora");
    const msg = encodeURIComponent("Olá! Minha impressora está com problema, gostaria de agendar atendimento.");
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
  };
  const callClick = () => {
    trackCTAClick("whatsapp", "conserto-impressora-agendar");
    const msg = encodeURIComponent("Olá! Quero agendar conserto de impressora em Curitiba.");
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={TITLE}
        description={DESC}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Conserto de Impressora", path: PATH },
        ]}
      />
      <ServiceLandingSchema
        serviceName="Conserto de Impressora"
        description={DESC}
        path={PATH}
        priceFrom={99.99}
        faqs={FAQS}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Conserto de Impressora" }]} />

      <section className="pt-14 pb-12 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full mb-6">
            <Printer className="w-5 h-5" /> <span className="font-medium">Atendimento conforme a agenda</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Conserto de Impressora em Curitiba
          </h1>
          <p className="tldr text-xl text-white/90 max-w-3xl mx-auto mb-8" data-speakable="true">
            Conserto, limpeza e recarga de impressoras HP, Epson, Brother, Canon e Samsung
            em Curitiba e região, <strong>a partir de R$ 99,99</strong>. Visita técnica
            domiciliar em até 60 minutos, valor fechado antes do conserto e garantia de 90 dias.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={waClick} className="bg-[#25D366] hover:bg-[#128C7E] text-white">
              <MessageCircle className="mr-2 w-5 h-5" /> WhatsApp agora
            </Button>
            <Button size="lg" variant="outline" onClick={callClick} className="bg-white text-primary hover:bg-white/90">
              <CalendarCheck className="mr-2 w-5 h-5" /> Agendar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 bg-accent/10 border-y border-accent/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl font-bold text-primary">
            Diagnóstico + limpeza a partir de <span className="text-accent">R$ 99,99</span>
          </p>
          <p className="text-muted-foreground mt-2">Garantia de 90 dias no serviço · atendimento sem compromisso</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">
            Problemas que resolvemos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { t: "Impressora não puxa papel", d: "Troca do rolo de tração e limpeza do mecanismo." },
              { t: "Imprime borrado ou com falhas", d: "Limpeza profunda da cabeça de impressão ou troca quando necessário." },
              { t: "Erro de driver / não conecta no Wi-Fi", d: "Reinstalação e configuração de IP fixo na rede." },
              { t: "Cartucho não reconhece", d: "Reset de chip, recarga ou troca por original/compatível." },
              { t: "Atolamento constante de papel", d: "Limpeza dos sensores e troca de roletes desgastados." },
              { t: "Instalação de bulk ink (tanque)", d: "Sistema com 6 meses de garantia, economia de até 90% em tinta." },
            ].map((p) => (
              <div key={p.t} className="p-5 rounded-xl border bg-card hover:shadow-md transition">
                <CheckCircle className="w-6 h-6 text-accent mb-2" />
                <h3 className="font-bold text-primary mb-1">{p.t}</h3>
                <p className="text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">
            Tabela de preços orientativa
          </h2>
          <div className="max-w-3xl mx-auto overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-sm" data-speakable="true">
              <thead className="bg-muted">
                <tr><th className="text-left p-3">Serviço</th><th className="text-right p-3">A partir de</th></tr>
              </thead>
              <tbody>
                {[
                  ["Diagnóstico + limpeza geral", "R$ 99,99"],
                  ["Troca de rolo de tração", "R$ 129,99"],
                  ["Limpeza/troca de cabeça de impressão", "R$ 189,99"],
                  ["Recarga de cartucho (par)", "R$ 89,99"],
                  ["Instalação de bulk ink (tanque externo)", "R$ 249,99"],
                  ["Conserto de fusor (laser)", "R$ 299,99"],
                  ["Configuração de impressão Wi-Fi / em rede", "R$ 99,99"],
                ].map(([s, p]) => (
                  <tr key={s} className="border-t"><td className="p-3">{s}</td><td className="p-3 text-right font-semibold text-primary">{p}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Valores orientativos para Curitiba e região. Valor fechado antes do conserto.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">Por que escolher a Técnico Curitiba</h2>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { i: <Clock className="w-7 h-7 text-accent" />, t: "Atendimento conforme a agenda", d: "Visita domiciliar em 30-60 min em toda Curitiba." },
              { i: <Shield className="w-7 h-7 text-accent" />, t: "Garantia de 90 dias", d: "Em serviços e peças trocadas, formalizada por escrito." },
              { i: <CheckCircle className="w-7 h-7 text-accent" />, t: "Valor antes", d: "Você só paga se aprovar. Sem taxa surpresa." },
            ].map((b) => (
              <div key={b.t} className="text-center p-6 rounded-xl border bg-card">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">{b.i}</div>
                <h3 className="font-bold mb-1">{b.t}</h3>
                <p className="text-sm text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((f) => (
              <details key={f.question} className="group bg-background rounded-xl border p-5">
                <summary className="cursor-pointer font-semibold text-foreground flex justify-between items-center">
                  {f.question}
                  <ArrowRight className="w-4 h-4 transition group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">Sua impressora parou no meio de um trabalho?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Chame agora — atendemos conforme a disponibilidade da agenda em toda Curitiba e região.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={waClick} className="bg-[#25D366] hover:bg-[#128C7E] text-white">
              <MessageCircle className="mr-2 w-5 h-5" /> Falar no WhatsApp
            </Button>
            <Button size="lg" variant="outline" onClick={callClick} className="bg-white text-primary hover:bg-white/90">
              <CalendarCheck className="mr-2 w-5 h-5" /> Agendar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ConsertoImpressoraCuritiba;
