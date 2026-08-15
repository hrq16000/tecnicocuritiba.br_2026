import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { RealImageSection } from "@/components/RealImageSection";
import { PrecoVisitaTecnica } from "@/components/PrecoVisitaTecnica";
import { ServiceGallery } from "@/components/gallery/ServiceGallery";
import { Link } from "@/lib/router-compat";
import { Tv, CheckCircle, AlertCircle, MessageCircle, ArrowRight, Clock } from "lucide-react";
import { COLETA_TAXA_MINIMA_LABEL, PRAZO_LONGO, DIAGNOSTICO_VALOR_LABEL } from "@/lib/coletaConfig";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "5541997086380";

const tvGalleryImages = [
  {
    src: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=70",
    alt: "Smart TV com backlight testado após reparo em laboratório",
    caption: "Teste de backlight após reparo — imagem uniforme e sem manchas",
  },
  {
    src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=70",
    alt: "Placa T-CON de TV LED aberta na bancada com equipamento de diagnóstico",
    caption: "Bancada com placa T-CON, fonte e mainboard sob análise",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=70",
    alt: "Medição de tensão em capacitores de fonte de Smart TV com multímetro",
    caption: "Medição de tensões e identificação de capacitores estufados",
  },
  {
    src: "https://images.unsplash.com/photo-1580982327559-c1202864eb05?auto=format&fit=crop&w=600&q=70",
    alt: "Painel de tela LCD de TV Smart sendo posicionado durante troca",
    caption: "Troca de painel LCD com bancada climatizada e ferramental de precisão",
  },
  {
    src: "https://images.unsplash.com/photo-1571415060716-baff5f717068?auto=format&fit=crop&w=600&q=70",
    alt: "Técnico realizando reflow em placa de Smart TV com estação de ar quente",
    caption: "Reflow controlado em placa principal com estação SMD",
  },
  {
    src: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=600&q=70",
    alt: "Smart TV instalada de volta na sala do cliente após reparo",
    caption: "TV reinstalada no cliente após reparo, com garantia por escrito",
  },
];

const tvTriagemFaq = [
  {
    q: "O que fazer antes de chamar o técnico para uma TV com defeito?",
    a: "Antes de solicitar coleta: 1) confirme se a TV liga no botão do painel (não só no controle); 2) teste em uma tomada diferente sem estabilizador; 3) desconecte todos os cabos HDMI/USB e ligue apenas na energia; 4) anote marca, modelo, ano e o comportamento exato (LED aceso? tela preta? listras?). Envie fotos/vídeo pelo WhatsApp — ajuda a confirmar se o caso é elétrico, de placa ou de painel.",
  },
  {
    q: "Quais sinais indicam problema de fonte, backlight, T-CON ou painel?",
    a: "Fonte: TV não liga, LED de standby apagado ou piscando. Backlight: LED de standby acende mas a tela fica preta (com áudio funcionando). T-CON/flat cable: linhas horizontais/verticais fixas ou dobras estranhas na imagem. Painel LCD: manchas escuras, sombras permanentes ou trincos visíveis — nesse último caso o reparo raramente compensa.",
  },
  {
    q: "Como definimos o valor do atendimento e a taxa mínima de coleta?",
    a: `A taxa mínima de coleta é ${COLETA_TAXA_MINIMA_LABEL} e cobre a retirada, o transporte seguro e o diagnóstico em bancada. O valor do reparo em si é informado por escrito após identificar o componente defeituoso e nunca é executado sem sua aprovação. Prazo padrão: ${PRAZO_LONGO}. O diagnóstico custa ${DIAGNOSTICO_VALOR_LABEL} e é abatido do serviço se aprovado.`,
  },
  {
    q: "Quando não vale a pena consertar uma Smart TV?",
    a: "Não compensa quando o painel LCD está trincado (custo próximo ao de uma TV nova), quando a TV tem 8+ anos e há múltiplas placas com falha, ou em TVs menores que 32\" — nesses casos, orientamos a compra de um modelo novo com transparência, sem cobrar reparo desnecessário.",
  },
];



const defeitos = [
  { titulo: "TV não liga", desc: "Pode ser problema na fonte de alimentação, placa principal ou capacitores estufados. Requer bancada.", tipo: "Laboratório" },
  { titulo: "TV liga mas sem imagem", desc: "LED de standby acende mas a tela fica preta. Backlight queimado, placa T-CON ou LVDS.", tipo: "Laboratório" },
  { titulo: "Imagem com linhas ou manchas", desc: "Linhas horizontais/verticais indicam problema na placa T-CON, flat cable ou painel LCD.", tipo: "Laboratório" },
  { titulo: "Som sem imagem ou imagem sem som", desc: "Falha isolada em placa de áudio ou backlight. Diagnóstico diferenciado necessário.", tipo: "Laboratório" },
  { titulo: "TV reiniciando sozinha", desc: "Fonte instável, superaquecimento ou firmware corrompido. Pode precisar de reprogramação.", tipo: "Laboratório" },
  { titulo: "Smart TV lenta ou travando", desc: "Apps demoram para abrir, Netflix trava. Pode ser atualização de firmware ou reset de fábrica.", tipo: "Pode ser remoto" },
];

const ManutencaoTV = () => {
  useEffect(() => {
    document.title = "Manutenção e Conserto de TV em Curitiba | LED, LCD, Smart TV | Técnico Curitiba";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Conserto de TV LED, LCD e Smart TV em Curitiba. Diagnóstico em bancada, reparo de placa, fonte e backlight. Coleta e entrega. Técnico com experiência.");
    }
    trackPageView("/servicos/manutencao-tv", "Manutenção de TV");
  }, []);

  const handleWhatsApp = () => {
    trackCTAClick("whatsapp", "manutencao-tv");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Minha TV está com defeito. Podem avaliar?")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Rodada 3Y: /servicos/conserto-tv é a URL canônica e indexável de TV.
          Esta rota herdada permanece ativa (nunca removida), porém noindex,follow
          e com self-canonical — quem indexa é a página canônica. */}
      <PageSEO noindex title="Manutenção e Conserto de TV em Curitiba | LED, LCD, Smart TV | Técnico Curitiba" description="Conserto de TV LED, LCD e Smart TV em Curitiba. Diagnóstico em bancada, reparo de placa, fonte e backlight. Coleta e entrega. Técnico com experiência." path="/servicos/manutencao-tv"  breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Serviços", path: "/servicos" },
        { name: "Manutenção de TV", path: "/servicos/manutencao-tv" }
      ]} />
      <Header />
      <Breadcrumbs items={[{ label: "Serviços", href: "/servicos" }, { label: "Manutenção de TV" }]} />

      <section className="pt-10 pb-10 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6 shimmer">
              <Tv className="h-5 w-5" />
              <span className="font-medium">Reparo Especializado</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 reveal-text">
              Manutenção e Conserto de TV em Curitiba
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
              Reparo de TVs LED, LCD e Smart TV com diagnóstico em bancada. Coleta e entrega disponível para toda a região metropolitana.
            </p>
            <div className="reveal-text" data-reveal-delay="200">
              <Button size="lg" variant="cta" onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-5 w-5" /> Minha TV Está Com Defeito
              </Button>
            </div>
          </div>
        </div>
      </section>
      <RealImageSection imageKey="smartTv" caption="Manutenção profissional de Smart TV" />

      {/* Aviso importante */}
      <section className="py-6 bg-accent/5 border-y border-accent/10">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <PrecoVisitaTecnica tipo="coleta" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">⚠️ Importante:</strong> A maioria dos reparos de TV exige <strong className="text-foreground">bancada (laboratório)</strong>. 
              Não é possível resolver no local na maioria dos casos.
            </p>
          </div>
        </div>
      </section>

      {/* Defeitos */}
      <section className="py-12 md:py-16 bg-background relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center reveal-text">
              Defeitos Mais Comuns em TVs
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {defeitos.map((d, i) => (
                <div key={i} className="bg-secondary rounded-xl p-5 border border-border hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 stagger-item" style={{ animationDelay: `${i * 80}ms` }}>
                  <h3 className="font-semibold text-foreground mb-2">{d.titulo}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{d.desc}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                    <Clock className="h-3 w-3" /> {d.tipo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RealImageSection imageKey="diagnostico" caption="Diagnóstico de placa eletrônica de TV" />

      {/* Como funciona TV */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center reveal-text">
              Como Funciona o Reparo de TV
            </h2>
            <div className="space-y-4">
              {[
                { step: "1", titulo: "Contato pelo WhatsApp", desc: "Descreva o defeito, modelo e marca da TV. Envie fotos ou vídeos se possível — ajuda muito no pré-diagnóstico." },
                { step: "2", titulo: "Coleta do equipamento", desc: "Agendamos a coleta no seu endereço. O técnico transporta com cuidado profissional." },
                { step: "3", titulo: "Diagnóstico em bancada", desc: "Análise detalhada da placa-fonte, T-CON, mainboard e backlight. Identificação precisa do componente defeituoso." },
                { step: "4", titulo: "Valor e aprovação", desc: `Valor informado antes de qualquer reparo. Taxa mínima ${COLETA_TAXA_MINIMA_LABEL} pré-aprovada. Prazo: ${PRAZO_LONGO}.` },
                { step: "5", titulo: "Reparo e devolução", desc: "Após aprovação, executamos o reparo e devolvemos a TV no seu endereço com garantia." },
              ].map((s, i) => (
                <div key={s.step} className="flex items-start gap-4 bg-background rounded-lg p-5 border border-border hover:-translate-y-0.5 hover:shadow-lg hover:border-accent/20 transition-all duration-300 group stagger-item" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{s.step}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{s.titulo}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quando vale / não vale */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center reveal-text">Quando Compensa Consertar a TV?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-secondary rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 stagger-item">
                <h3 className="font-bold text-accent mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Geralmente Compensa</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• TV de 40" ou maior (custo de nova é alto)</li>
                  <li>• Defeito isolado na fonte ou backlight</li>
                  <li>• TV com menos de 5 anos de uso</li>
                  <li>• Marcas boas (Samsung, LG, Sony)</li>
                </ul>
              </div>
              <div className="bg-secondary rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 stagger-item" style={{ animationDelay: "100ms" }}>
                <h3 className="font-bold text-destructive mb-3 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Pode Não Compensar</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Painel LCD trincado ou danificado</li>
                  <li>• TV de 32" ou menor (nova custa pouco)</li>
                  <li>• Múltiplas placas com defeito</li>
                  <li>• TV muito antiga (8+ anos)</li>
                </ul>
              </div>
            </div>
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Leia mais em <Link to="/quando-nao-compensa" className="text-accent hover:underline">Quando Não Compensa Reparar</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-breathe" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 reveal-text">TV Com Defeito? Fale Conosco</h2>
          <p className="text-white/80 mb-6">Envie modelo, marca e descrição do problema. Orientamos pelo WhatsApp.</p>
          <Button size="lg" variant="cta" onClick={handleWhatsApp}>
            <MessageCircle className="mr-2 h-5 w-5" /> Enviar Detalhes da TV
          </Button>
        </div>
      </section>

      <ServiceGallery
        id="galeria-tv"
        title="O que está incluso no reparo de TV Smart"
        subtitle="Do diagnóstico em bancada à devolução: veja o processo real de reparo e troca de tela."
        images={tvGalleryImages}
      />

      {/* FAQ de triagem — o que fazer antes da coleta, sinais de falha, critério de valor do atendimento */}
      <section className="py-10 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
              Antes de chamar o técnico — perguntas frequentes
            </h2>
            <div className="space-y-3">
              {tvTriagemFaq.map((item) => (
                <details key={item.q} className="bg-background rounded-xl border border-border group">
                  <summary className="p-4 font-semibold text-foreground cursor-pointer list-none flex items-center justify-between hover:text-accent transition-colors">
                    {item.q}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BlocoInteligencia />
      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default ManutencaoTV;

