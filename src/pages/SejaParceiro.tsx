import { useEffect, useState, useCallback } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FloatingParticles } from "@/components/FloatingParticles";
import { trackPageView } from "@/lib/analytics";
import {
  Users, CheckCircle, ArrowRight, MessageCircle, Wrench, MapPin,
  Shield, TrendingUp, Clock, Star, Briefcase, Award, Zap, ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WHATSAPP = "5541997086380";

const beneficios = [
  { icon: TrendingUp, title: "Demanda constante", desc: "Receba chamados técnicos de clientes qualificados na sua região, sem precisar investir em marketing." },
  { icon: Shield, title: "Suporte e retaguarda", desc: "Conte com apoio técnico, documentação e processos padronizados para atendimentos mais complexos." },
  { icon: Clock, title: "Flexibilidade de horários", desc: "Você define sua disponibilidade — atenda quando e onde quiser, sem compromisso de horário fixo." },
  { icon: Star, title: "Avaliações e reputação", desc: "Construa sua reputação com avaliações dos clientes e ganhe destaque na rede de parceiros." },
  { icon: MapPin, title: "Cobertura regional", desc: "Cubra bairros e cidades da sua região — quanto mais disponível, mais chamados recebe." },
  { icon: Award, title: "Selo de parceiro", desc: "Após a aprovação no processo interno, você passa a constar como técnico parceiro da rede." },
];

const requisitos = [
  "Experiência comprovada em manutenção de PCs, notebooks ou celulares",
  "Ferramentas próprias para diagnóstico e reparo",
  "Disponibilidade para atendimento a domicílio na região de Curitiba",
  "Boa comunicação e comprometimento com prazos",
  "Conduta profissional e ética no atendimento ao cliente",
  "Atuação formalizada (desejável, mas não obrigatório)",
];

const especialidades = [
  "Formatação e instalação de sistemas",
  "Conserto de PC e Notebook",
  "Conserto de celular",
  "Redes e Wi-Fi",
  "CFTV / Câmeras de segurança",
  "Manutenção de TV",
  "Conserto de placa eletrônica",
  "Montagem de PC",
  "Backup e recuperação de dados",
  "Outro",
];

const SejaParceiro = () => {
  const [form, setForm] = useState({
    nome: "",
    cidade: "",
    especialidade: "",
    experiencia: "",
    temFerramentas: "",
    observacoes: "",
  });

  useEffect(() => {
    document.title = "Seja Técnico Parceiro | Técnico Curitiba";
    trackPageView("/seja-parceiro", "Seja Parceiro");
  }, []);

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const buildWhatsAppMessage = useCallback(() => {
    const lines = [
      "🔧 *QUERO SER TÉCNICO PARCEIRO*",
      "",
      `👤 *Nome:* ${form.nome || "(não informado)"}`,
      `📍 *Cidade/Região:* ${form.cidade || "(não informado)"}`,
      `🛠️ *Especialidade:* ${form.especialidade || "(não informado)"}`,
      `⏱️ *Experiência:* ${form.experiencia || "(não informado)"}`,
      `🔧 *Tem ferramentas próprias:* ${form.temFerramentas || "(não informado)"}`,
    ];
    if (form.observacoes.trim()) {
      lines.push(`📝 *Observações:* ${form.observacoes}`);
    }
    lines.push("", "Gostaria de saber mais sobre a parceria!");
    return encodeURIComponent(lines.join("\n"));
  }, [form]);

  const isFormValid = form.nome.trim() && form.cidade.trim() && form.especialidade;

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Seja Técnico Parceiro | Trabalhe Conosco | Técnico Curitiba"
        description="Quer ser técnico parceiro? Cadastre-se e receba chamados técnicos na sua região. Flexibilidade, demanda constante e suporte profissional."
        path="/seja-parceiro"
        breadcrumbs={[{ name: "Início", path: "/" }, { name: "Seja Parceiro", path: "/seja-parceiro" }]}
      />
      <Header />

      <main>
        {/* ═══ Hero ═══ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 premium-gradient" />
          <FloatingParticles count={25} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-[10%] w-[500px] h-[500px] rounded-full bg-accent/[0.07] blur-[120px] animate-breathe" />
            <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[100px] animate-breathe" style={{ animationDelay: "2.5s" }} />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />

          <div className="container mx-auto relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 px-4">
            <AnimatedSection animation="fade-up">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-sm font-medium text-white/90 mb-6 border border-white/15 shimmer">
                  <Users className="h-4 w-4 text-accent" />
                  <span>Programa de Parceiros</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] mb-5">
                  <span className="block">Quer Ser</span>
                  <span className="block gradient-text-animated text-4xl md:text-6xl lg:text-7xl">Técnico Parceiro?</span>
                </h1>
                <p className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed mb-8">
                  Faça parte da maior rede de assistência técnica de Curitiba e região metropolitana. 
                  Receba chamados, cresça profissionalmente e atenda clientes qualificados.
                </p>
                <a href="#formulario">
                  <Button className="gap-2 bg-accent text-accent-foreground rounded-full px-8 py-6 text-base shadow-lg hover:scale-105 transition-transform cta-pulse">
                    Quero me cadastrar <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </AnimatedSection>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
              <path d="M0 60L48 52C96 44 192 28 288 22C384 16 480 20 576 28C672 36 768 48 864 50C960 52 1056 44 1152 36C1248 28 1344 20 1392 16L1440 12V60H0Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* ═══ Benefícios ═══ */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 text-center">
                Por Que Ser <span className="gradient-text">Parceiro</span>?
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
                Vantagens exclusivas para técnicos que fazem parte da nossa rede
              </p>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {beneficios.map((b, i) => (
                <AnimatedSection key={i} delay={100 * i}>
                  <div className="glass-card gradient-border rounded-xl p-6 h-full hover:-translate-y-2 hover:shadow-[var(--shadow-lg)] transition-all duration-300 group">
                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                      <b.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Como Funciona ═══ */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-10 text-center">
                Como Funciona a <span className="gradient-text">Parceria</span>
              </h2>
            </AnimatedSection>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { step: "1", title: "Cadastro", desc: "Preencha o formulário abaixo com seus dados e especialidades", icon: Briefcase },
                { step: "2", title: "Avaliação", desc: "Nossa equipe analisa seu perfil e entra em contato pelo WhatsApp", icon: Shield },
                { step: "3", title: "Integração", desc: "Você recebe orientações, acesso aos processos e inicia como parceiro", icon: Zap },
                { step: "4", title: "Chamados", desc: "Receba chamados técnicos na sua região e atenda com autonomia", icon: TrendingUp },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={120 * i}>
                  <div className="glass-card gradient-border rounded-xl p-6 text-center hover:-translate-y-2 transition-all duration-300 group">
                    <div className="bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-3 shadow-xs group-hover:scale-110 group-hover:shadow-[0_0_20px_hsl(var(--accent)/0.4)] transition-all duration-300">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Requisitos ═══ */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 text-center">
                <Wrench className="inline h-6 w-6 text-accent mr-2 -mt-1" />
                Requisitos Para Ser Parceiro
              </h2>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {requisitos.map((r, i) => (
                <AnimatedSection key={i} delay={80 * i}>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/20 transition-all duration-300">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{r}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Formulário WhatsApp ═══ */}
        <section id="formulario" className="py-16 bg-muted/30 border-y border-border scroll-mt-20">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3 text-center">
                <MessageCircle className="inline h-6 w-6 text-accent mr-2 -mt-1" />
                Cadastre-se Como Parceiro
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
                Preencha o formulário e envie pelo WhatsApp. Nossa equipe retorna em até 24 horas.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <div className="max-w-xl mx-auto">
                <div className="glass-card gradient-border rounded-2xl p-6 md:p-8 space-y-5">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-foreground font-medium">Nome completo *</Label>
                    <Input
                      id="nome"
                      value={form.nome}
                      onChange={(e) => handleChange("nome", e.target.value)}
                      placeholder="Seu nome completo"
                      className="bg-background"
                    />
                  </div>

                  {/* Cidade */}
                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-foreground font-medium">Cidade / Região de atuação *</Label>
                    <Input
                      id="cidade"
                      value={form.cidade}
                      onChange={(e) => handleChange("cidade", e.target.value)}
                      placeholder="Ex: Curitiba, São José dos Pinhais, Araucária..."
                      className="bg-background"
                    />
                  </div>

                  {/* Especialidade */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Principal especialidade *</Label>
                    <Select value={form.especialidade} onValueChange={(v) => handleChange("especialidade", v)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecione sua especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map((e) => (
                          <SelectItem key={e} value={e}>{e}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experiência */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Tempo de experiência</Label>
                    <Select value={form.experiencia} onValueChange={(v) => handleChange("experiencia", v)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Quanto tempo de experiência?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Menos de 1 ano">Menos de 1 ano</SelectItem>
                        <SelectItem value="1 a 3 anos">1 a 3 anos</SelectItem>
                        <SelectItem value="3 a 5 anos">3 a 5 anos</SelectItem>
                        <SelectItem value="5 a 10 anos">5 a 10 anos</SelectItem>
                        <SelectItem value="Mais de 10 anos">Mais de 10 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ferramentas */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Possui ferramentas próprias?</Label>
                    <Select value={form.temFerramentas} onValueChange={(v) => handleChange("temFerramentas", v)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sim, completas">Sim, completas</SelectItem>
                        <SelectItem value="Sim, básicas">Sim, básicas</SelectItem>
                        <SelectItem value="Não, preciso adquirir">Não, preciso adquirir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Observações */}
                  <div className="space-y-2">
                    <Label htmlFor="obs" className="text-foreground font-medium">Observações (opcional)</Label>
                    <Textarea
                      id="obs"
                      value={form.observacoes}
                      onChange={(e) => handleChange("observacoes", e.target.value)}
                      placeholder="Conte mais sobre você, sua experiência, certificações, etc."
                      className="bg-background min-h-[100px]"
                    />
                  </div>

                  {/* Enviar pelo WhatsApp */}
                  <a
                    href={isFormValid ? `https://wa.me/${WHATSAPP}?text=${buildWhatsAppMessage()}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (!isFormValid) e.preventDefault(); }}
                  >
                    <Button
                      disabled={!isFormValid}
                      className="w-full gap-3 bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white rounded-xl px-8 py-6 text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all duration-300 cta-pulse btn-feedback elastic-click"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Enviar Cadastro pelo WhatsApp
                    </Button>
                  </a>

                  <p className="text-xs text-muted-foreground text-center">
                    * Campos obrigatórios. Ao enviar, você será redirecionado ao WhatsApp com os dados preenchidos.
                  </p>
                </div>

                {/* ═══ Botão Preciso de Um ═══ */}
                <div className="mt-8 text-center">
                  <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Ou cadastre-se diretamente na nossa plataforma de prestadores:
                    </p>
                    <a
                      href="https://precisodeum.com.br"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        className="w-full gap-3 bg-accent text-accent-foreground rounded-xl px-8 py-6 text-base shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold btn-feedback elastic-click"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Faça o seu cadastro
                      </Button>
                    </a>
                    <p className="text-[11px] text-muted-foreground">
                      Plataforma Preciso de Um — conectando prestadores a clientes em todo o Brasil
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══ CTA Final ═══ */}
        <AnimatedSection animation="fade-up">
          <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 premium-gradient opacity-95" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/[0.06] rounded-full blur-[120px] animate-breathe" />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                  Junte-se à Nossa Rede
                </h2>
                <p className="text-white/85 mb-8 text-lg">
                  Mais de 20 anos de experiência compartilhada. Cresça com quem entende do mercado.
                </p>
                <a href="#formulario">
                  <Button className="gap-2 bg-accent text-accent-foreground rounded-full px-10 py-6 text-lg shadow-lg hover:scale-105 transition-transform">
                    Cadastrar agora <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default SejaParceiro;
