import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import { AnimatedSection } from "@/components/AnimatedSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { Link } from "@/lib/router-compat";
import {
  MessageCircle, Smartphone, Shield, Clock, CheckCircle,
  AlertTriangle, Wrench, Users, Truck
} from "lucide-react";
import {
  COLETA_TAXA_MINIMA_LABEL,
  PRAZO_RAPIDO,
  REGRA_ESTIMATIVA_GRATIS,
  REGRA_COLETA_SEM_VISITA,
  MSG_COLETA_RESUMO,
} from "@/lib/coletaConfig";

const WHATSAPP_NUMBER = "5541997086380";

const marcasAtendidas = [
  "Apple (iPhone)", "Samsung", "Motorola", "Xiaomi", "LG",
  "Huawei", "Realme", "Poco", "Nokia", "Asus"
];

const problemasComuns = [
  { titulo: "Tela quebrada ou trincada", descricao: "Troca de display (tela + touch) original ou compatível de qualidade." },
  { titulo: "Bateria viciada", descricao: "Substituição de bateria para restaurar a autonomia original do aparelho." },
  { titulo: "Celular não carrega", descricao: "Pode ser problema no conector de carga, flex ou placa. Diagnóstico identifica a causa." },
  { titulo: "Celular caiu na água", descricao: "Limpeza ultrassônica e secagem profissional. Quanto antes, maiores as chances de recuperação." },
  { titulo: "Celular lento ou travando", descricao: "Pode ser memória cheia, sistema desatualizado ou problema de hardware." },
  { titulo: "Câmera com defeito", descricao: "Troca de módulo de câmera traseira ou frontal. Restauramos a qualidade original." },
];

const cidades = [
  { nome: "Curitiba", slug: "curitiba" },
  { nome: "São José dos Pinhais", slug: "sao-jose-dos-pinhais" },
  { nome: "Araucária", slug: "araucaria" },
  { nome: "Colombo", slug: "colombo" },
  { nome: "Pinhais", slug: "pinhais" },
  { nome: "Campo Largo", slug: "campo-largo" },
  { nome: "Fazenda Rio Grande", slug: "fazenda-rio-grande" },
  { nome: "Almirante Tamandaré", slug: "almirante-tamandare" },
  { nome: "Piraquara", slug: "piraquara" },
  { nome: "Campo Magro", slug: "campo-magro" },
  { nome: "Quatro Barras", slug: "quatro-barras" },
];

const ConsertoCelular = () => {
  useEffect(() => {
    document.title = "Conserto de Celular em Curitiba e Região | Atendimento sem Compromisso | Técnico Curitiba";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Conserto de celular e smartphone em Curitiba e região metropolitana. iPhone, Samsung, Motorola, Xiaomi. atendimento humanizado sem compromisso. Troca de tela, bateria e mais.");
    trackPageView("/servicos/conserto-celular", "Conserto de Celular");
  }, []);

  const handleWhatsAppClick = () => {
    trackCTAClick("whatsapp", "conserto-celular");
    const msg = encodeURIComponent("Olá! Preciso de atendimento para conserto de celular. Qual o procedimento?");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Conserto de Celular",
    description: "Serviço de conserto de celular e smartphone em Curitiba e região metropolitana.",
    provider: {
      "@type": "LocalBusiness",
      name: "Técnico Curitiba",
    },
    areaServed: { "@type": "City", name: "Curitiba" },
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSEO noindex
        title="Conserto de Celular em Curitiba e Região | Atendimento sem Compromisso"
        description="Conserto de celular e smartphone. iPhone, Samsung, Motorola, Xiaomi. atendimento humanizado sem compromisso."
        path="/servicos/conserto-celular"
        breadcrumbs={[{ name: "Início", path: "/" }, { name: "Serviços", path: "/servicos" }, { name: "Conserto de Celular", path: "/servicos/conserto-celular" }]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <Breadcrumbs items={[{ label: "Serviços", href: "/servicos" }, { label: "Conserto de Celular" }]} />

      {/* Hero */}
      <section className="pt-10 pb-10 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6">
              <Smartphone className="h-5 w-5" />
              <span className="font-medium">Conserto de Celular – Todas as Marcas</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
              Conserto de Celular em Curitiba e Região Metropolitana
            </h1>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Troca de tela, bateria, conector e mais. {REGRA_ESTIMATIVA_GRATIS}. Coleta e entrega disponível.
            </p>

            <div className="bg-white/10 rounded-xl p-4 mb-8 max-w-lg mx-auto">
              <div className="flex items-center gap-2 text-accent mb-2">
                <Truck className="h-5 w-5" />
                <span className="font-bold text-sm">COLETA E ENTREGA</span>
              </div>
              <p className="text-white/90 text-sm">
                {MSG_COLETA_RESUMO} Prazo para celular: <strong>{PRAZO_RAPIDO}</strong>.
              </p>
            </div>

            <Button size="lg" variant="whatsapp" onClick={handleWhatsAppClick}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar sobre meu celular
            </Button>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <AnimatedSection>
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-12">
              Como Funciona o Conserto de Celular
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { step: "1", titulo: "Contato pelo WhatsApp", desc: `Descreva o problema do celular, modelo e envie fotos. ${REGRA_ESTIMATIVA_GRATIS}.` },
                { step: "2", titulo: "Coleta do Aparelho", desc: `Organizamos a coleta no seu endereço ou combinamos o melhor horário. Taxa mínima ${COLETA_TAXA_MINIMA_LABEL} pré-aprovada.` },
                { step: "3", titulo: "Diagnóstico e valor", desc: "Avaliamos o aparelho e informamos o valor do reparo. Valor preciso somente após coleta." },
                { step: "4", titulo: "Reparo Rápido", desc: `Após aprovação, realizamos o conserto. Prazo: ${PRAZO_RAPIDO}.` },
              ].map((p, i) => (
                <div key={i} className="text-center p-6 bg-secondary rounded-xl">
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {p.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{p.titulo}</h3>
                  <p className="text-muted-foreground text-sm">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Problemas comuns */}
      <AnimatedSection>
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-12">
              Problemas Mais Comuns em Celulares
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {problemasComuns.map((p, i) => (
                <div key={i} className="bg-background p-6 rounded-xl">
                  <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-accent" />
                    {p.titulo}
                  </h3>
                  <p className="text-muted-foreground text-sm">{p.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Marcas */}
      <AnimatedSection>
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-8">
              Marcas Atendidas
            </h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {marcasAtendidas.map((marca, i) => (
                <span key={i} className="px-5 py-3 bg-secondary rounded-lg font-medium text-foreground">
                  {marca}
                </span>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Diferenciais */}
      <AnimatedSection>
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-12">
              Por Que Escolher Nosso Conserto de Celular
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Users, titulo: "Atendimento Humanizado", desc: "Explicamos o problema com clareza. Sem jargão técnico, sem pressão para aprovar." },
                { icon: Shield, titulo: "Garantia no Serviço", desc: "Todo reparo conta com garantia. Peças de qualidade e mão de obra profissional." },
                { icon: CheckCircle, titulo: "Valor Transparente", desc: "Valor informado antes de qualquer execução. Você só paga se aprovar o serviço." },
                { icon: Clock, titulo: "Prazo Rápido", desc: `Prazo para celular: ${PRAZO_RAPIDO}. Informamos desde o início.` },
              ].map((d, i) => (
                <div key={i} className="text-center p-6 bg-background rounded-xl">
                  <d.icon className="h-10 w-10 text-accent mx-auto mb-4" />
                  <h3 className="font-bold text-foreground mb-2">{d.titulo}</h3>
                  <p className="text-muted-foreground text-sm">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection>
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-12">
              Perguntas Frequentes – Conserto de Celular
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "Vocês fazem visita técnica para celular?", a: `Não. ${REGRA_COLETA_SEM_VISITA} Organizamos coleta e entrega com taxa mínima de ${COLETA_TAXA_MINIMA_LABEL}.` },
                { q: "Quanto custa o conserto?", a: `${REGRA_ESTIMATIVA_GRATIS}. Valor preciso somente após coleta do aparelho, com taxa mínima de ${COLETA_TAXA_MINIMA_LABEL} pré-aprovada.` },
                { q: "Trocam tela de iPhone?", a: "Sim. Trabalhamos com telas originais e compatíveis de alta qualidade para todos os modelos de iPhone." },
                { q: "Quanto tempo leva o reparo?", a: `Prazo padrão para celular: ${PRAZO_RAPIDO}.` },
                { q: "Quais formas de pagamento?", a: "PIX, dinheiro e cartão. Consulte condições pelo WhatsApp." },
                { q: "A garantia cobre o quê?", a: "Cobre o serviço realizado e a peça trocada pelo prazo informado no valor do atendimento." },
              ].map((faq, i) => (
                <div key={i} className="bg-secondary p-6 rounded-xl">
                  <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Cidades */}
      <AnimatedSection>
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">
              Conserto de Celular por Cidade
            </h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {cidades.map((c, i) => (
                <Link
                  key={i}
                  to={`/servicos/conserto-celular/${c.slug}`}
                  className="px-5 py-3 bg-background rounded-lg hover:bg-accent/20 transition-colors text-foreground"
                >
                  Conserto de Celular em {c.nome}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Final */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Celular com Defeito? Solicite um valor
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Entre em contato pelo WhatsApp e descreva o problema. Atendimento humanizado, valor transparente e sem compromisso.
          </p>
          <Button size="lg" variant="whatsapp" onClick={handleWhatsAppClick}>
            <MessageCircle className="mr-2 h-5 w-5" />
            Agendar o reparo do celular
          </Button>
        </div>
      </section>

      <BlocoInteligencia />
      <Footer />
    </div>
  );
};

export default ConsertoCelular;
