import { useMemo } from "react";
import { Link } from "@/lib/router-compat";
import { MessageCircle, CheckCircle, Zap, Shield, Clock, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "5541997086380";

const benefits = [
  { icon: Clock, text: "Mais de 20 anos de experiência", description: "Profissional experiente no mercado" },
  { icon: Shield, text: "Técnico identificado e de confiança", description: "Segurança para sua residência" },
  { icon: ThumbsUp, text: "Venda de serviços, não de peças", description: "Foco na sua real necessidade" },
  { icon: Zap, text: "Atendimento rápido e sem enrolação", description: "Resolução no primeiro contato" },
];

const headlines: { text: string; path: string }[] = [
  { text: "Computador lento? Não liga? Travando ou com vírus?", path: "/servicos/computador-lento" },
  { text: "Notebook esquentando? Tela preta? Sem Wi-Fi?", path: "/problemas/notebook-superaquecendo-curitiba" },
  { text: "PC travou de vez? Perdeu arquivos? Tela azul?", path: "/problemas/tela-azul-windows-curitiba" },
  { text: "Vírus no computador? Pop-ups? Dados em risco?", path: "/servicos/remocao-de-virus" },
  { text: "Computador não liga? Fazendo barulho? Lento demais?", path: "/servicos/computador-nao-liga" },
  { text: "Notebook caiu? Teclado parou? Bateria viciada?", path: "/servicos/manutencao-de-computador" },
  { text: "Smart TV sem sinal? Celular travando? Monitor apagou?", path: "/servicos/manutencao-tv" },
  { text: "Tela quebrada? Placa queimou? HD com defeito?", path: "/servicos/conserto-placa" },
  { text: "Computador reiniciando sozinho? Desligando do nada?", path: "/problemas/computador-reiniciando-sozinho-curitiba" },
  { text: "Wi-Fi caindo toda hora? Internet lenta demais?", path: "/servicos/redes-e-wifi" },
  { text: "Impressora não imprime? Rede fora do ar?", path: "/servicos/redes-e-wifi" },
  { text: "Notebook não carrega? Fonte queimou? Conector solto?", path: "/servicos/manutencao-de-computador" },
  { text: "PC com erro de Windows? Sistema corrompido?", path: "/servicos/formatacao" },
  { text: "Arquivos sumiram? HD fazendo barulho estranho?", path: "/servicos/recuperacao-de-dados" },
  { text: "Câmera de segurança parou? DVR sem imagem?", path: "/cftv" },
  { text: "Computador pegando vírus toda hora? Sem proteção?", path: "/servicos/remocao-de-virus" },
  { text: "Tela azul da morte? Erro crítico no sistema?", path: "/problemas/tela-azul-windows-curitiba" },
  { text: "PC novo e já está lento? Muitos programas?", path: "/servicos/computador-lento" },
  { text: "Notebook superaquecendo? Ventilador barulhento?", path: "/problemas/notebook-superaquecendo-curitiba" },
  { text: "Mouse e teclado sem funcionar? USB com defeito?", path: "/servicos/manutencao-de-computador" },
];

export const PainSection = () => {
  const headline = useMemo(() => headlines[Math.floor(Math.random() * headlines.length)], []);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Meu computador está com problema e preciso de ajuda técnica urgente.")}`;

  const handleWhatsAppClick = () => {
    trackCTAClick("whatsapp", "pain_section");
  };

  return (
    <section className="py-14 md:py-18 lg:py-24 bg-muted relative overflow-hidden spotlight-sweep mesh-gradient-warm noise-overlay" aria-labelledby="pain-heading">
      {/* Morphing blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.04] morph-blob pointer-events-none blur-[100px]" />
      <div data-parallax="0.08" className="absolute -top-10 -left-10 w-[350px] h-[350px] rounded-full bg-accent/[0.03] blur-[80px] pointer-events-none orb-float" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            id="pain-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 tracking-tight reveal-text"
          >
            <Link to={headline.path} className="hover:text-accent transition-colors duration-300 underline-grow">
              {headline.text}
            </Link>
          </h2>
          
          <p className="text-lg md:text-xl text-accent font-semibold mb-3 reveal-text" data-reveal-delay="100">
            Fale direto com técnico. Sem call center. Sem enrolação.
          </p>

          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Oferecemos <strong className="text-foreground">assistência técnica de informática</strong> profissional em <strong className="text-foreground">Curitiba</strong> e região. 
            Atendimento a <strong className="text-foreground">domicílio</strong> para <strong className="text-foreground">conserto de computador</strong>, 
            <strong className="text-foreground"> formatação</strong>, <strong className="text-foreground">remoção de vírus</strong> e muito mais.
          </p>

          {/* Glowing separator */}
          <div className="glow-separator max-w-xs mx-auto mb-8" />
          
          <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 glass-card gradient-border rounded-xl px-4 py-4 text-left hover:-translate-y-2 hover:scale-[1.03] card-shine animated-border hover-streak transition-all duration-300 group slide-up-stagger"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="bg-accent/10 p-2.5 rounded-xl flex-shrink-0 group-hover:bg-accent/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative">
                  <benefit.icon className="h-5 w-5 text-accent icon-bounce" />
                  <div className="absolute inset-0 rounded-xl bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                <div>
                  <span className="text-foreground font-semibold block text-[15px]">{benefit.text}</span>
                  <span className="text-muted-foreground text-sm">{benefit.description}</span>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="whatsapp" 
            size="xl"
            className="animate-pulse-soft ripple-container shadow-lg hover:shadow-xl hover:scale-[1.05] transition-all duration-300 btn-feedback ring-pulse elastic-click hover-streak"
            asChild
            onClick={handleWhatsAppClick}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Resolver problema pelo WhatsApp">
              <MessageCircle className="h-5 w-5" />
              Resolver meu problema agora
            </a>
          </Button>

          <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-trust" />
            Atendimento em até 5 minutos • Sem compromisso
          </p>
        </div>
      </div>
    </section>
  );
};
