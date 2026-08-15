import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { RealImageSection } from "@/components/RealImageSection";
import { Link } from "@/lib/router-compat";
import { Power, CheckCircle, AlertCircle, MessageCircle, ArrowRight, Wrench, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import Breadcrumbs from "@/components/Breadcrumbs";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "5541997086380";

const sintomas = [
  { titulo: "Não liga de jeito nenhum", desc: "Nenhum LED acende, nenhum som. Pode ser fonte queimada, curto na placa-mãe ou problema no botão power.", gravidade: "Médio a complexo" },
  { titulo: "Liga mas tela fica preta", desc: "Ventoinha gira, LEDs acendem, mas não aparece nada no monitor. GPU, memória RAM ou BIOS podem ser a causa.", gravidade: "Médio" },
  { titulo: "Liga e desliga sozinho", desc: "Inicia por alguns segundos e desliga. Superaquecimento, fonte instável ou curto-circuito.", gravidade: "Médio a complexo" },
  { titulo: "Tela azul ao iniciar", desc: "Windows inicia mas dá erro (BSOD). Driver corrompido, HD/SSD com defeito ou atualização com bug.", gravidade: "Simples a médio" },
  { titulo: "Bips ao ligar", desc: "Sequência de bips indica qual componente falhou. Cada padrão aponta para memória, vídeo ou processador.", gravidade: "Médio" },
  { titulo: "Fica na tela do logo e trava", desc: "Boot loop ou freeze no logotipo. Pode ser Windows corrompido, disco falhando ou BIOS desatualizada.", gravidade: "Simples a médio" },
];

const ComputadorNaoLiga = () => {
  useEffect(() => {
    document.title = "Computador Não Liga? Causas e Soluções | Técnico em Curitiba";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Computador ou notebook não liga? Veja as causas mais comuns e quando procurar um técnico. Diagnóstico profissional em Curitiba e região. Atendimento a domicílio.");
    }
    trackPageView("/servicos/computador-nao-liga", "Computador Não Liga");
  }, []);

  const handleWhatsApp = () => {
    trackCTAClick("whatsapp", "computador-nao-liga");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Meu computador/notebook não está ligando. Podem me ajudar?")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO noindex title="Computador Não Liga? Causas e Soluções | Técnico em Curitiba" description="Computador ou notebook não liga? Veja as causas mais comuns e quando procurar um técnico. Diagnóstico profissional em Curitiba e região. Atendimento a domicílio." path="/servicos/computador-nao-liga"  breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Serviços", path: "/servicos" },
        { name: "Computador Não Liga", path: "/servicos/computador-nao-liga" }
      ]} />
      <Header />
      <Breadcrumbs items={[{ label: "Serviços", href: "/servicos" }, { label: "Computador Não Liga" }]} />

      <section className="pt-10 pb-10 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-destructive/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-destructive/20 text-white px-4 py-2 rounded-full mb-6 shimmer">
              <Power className="h-5 w-5" />
              <span className="font-medium">Diagnóstico Urgente</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 reveal-text">
              Computador Não Liga? Calma — Tem Solução
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
              Antes de desesperar, saiba que a maioria dos casos tem solução. Nosso técnico diagnostica a causa real e resolve — sem achismo.
            </p>
            <div className="reveal-text" data-reveal-delay="200">
              <Button size="lg" variant="cta" onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-5 w-5" /> Meu PC Não Liga — Preciso de Ajuda
              </Button>
            </div>
          </div>
        </div>
      </section>
      <RealImageSection imageKey="bancadaTecnica" caption="Bancada técnica para diagnóstico completo" />

      {/* O que verificar antes */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center reveal-text">
              O Que Verificar Antes de Chamar o Técnico
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Verifique se o cabo de energia está bem conectado",
                "Teste em outra tomada (de preferência com aterramento)",
                "Se for notebook, tente ligar só na tomada, sem bateria",
                "Verifique se o monitor está ligado e no canal correto (HDMI/VGA)",
                "Desconecte periféricos USB e tente novamente",
                "Se desligou após queda de energia, espere 5 minutos e tente",
              ].map((dica, i) => (
                <div key={i} className="flex items-start gap-3 bg-background rounded-lg p-4 border border-border hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{dica}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Testou tudo e continua sem funcionar? Então provavelmente é algo que precisa de diagnóstico técnico.
            </p>
          </div>
        </div>
      </section>

      <RealImageSection imageKey="ferramentas" caption="Ferramentas profissionais de reparo eletrônico" />

      {/* Sintomas */}
      <section className="py-12 md:py-16 bg-background relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center reveal-text">
              Qual é o Sintoma do Seu Computador?
            </h2>
            <p className="text-center text-muted-foreground mb-10">Identifique o comportamento para entender o nível de complexidade</p>
            <div className="grid md:grid-cols-2 gap-4">
              {sintomas.map((s, i) => (
                <div key={i} className="bg-secondary rounded-xl p-5 border border-border hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 stagger-item" style={{ animationDelay: `${i * 80}ms` }}>
                  <h3 className="font-semibold text-foreground mb-2">{s.titulo}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.desc}</p>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">Complexidade: {s.gravidade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Aviso importante */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto bg-destructive/5 border border-destructive/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-destructive mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 animate-pulse" /> Cuidado com Tentativas Amadoras
            </h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Abrir o computador sem conhecimento pode piorar o problema. Riscos comuns:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Curto-circuito por descarga eletrostática</li>
                <li>Dano em conectores e trilhas da placa-mãe</li>
                <li>Perda de garantia do equipamento</li>
                <li>Componente bom danificado durante a tentativa</li>
              </ul>
              <p className="font-medium text-foreground mt-3">O diagnóstico profissional custa R$ 99,99 — muito menos do que o prejuízo de uma tentativa errada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-foreground mb-6 text-center">Páginas Relacionadas</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: "Manutenção de Computador", to: "/servicos/manutencao-de-computador" },
                { label: "Diagnóstico Técnico", to: "/diagnostico-tecnico" },
                { label: "Quando Não Compensa Reparar", to: "/quando-nao-compensa" },
                { label: "Preços e Políticas", to: "/precos-e-politicas" },
                { label: "Coleta e Entrega", to: "/coleta-e-entrega" },
                { label: "Como Funciona", to: "/como-funciona" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="flex items-center gap-2 bg-secondary rounded-lg p-3 text-sm font-medium text-foreground hover:text-accent hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                  <ArrowRight className="h-4 w-4 text-accent" />{link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-breathe" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 reveal-text">Seu Computador Não Liga?</h2>
          <p className="text-white/80 mb-6">Nosso técnico identifica o problema com diagnóstico preciso. Atendimento em Curitiba e região.</p>
          <Button size="lg" variant="cta" onClick={handleWhatsApp}>
            <MessageCircle className="mr-2 h-5 w-5" /> Falar com Técnico Agora
          </Button>
        </div>
      </section>

      <BlocoInteligencia />
      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default ComputadorNaoLiga;
