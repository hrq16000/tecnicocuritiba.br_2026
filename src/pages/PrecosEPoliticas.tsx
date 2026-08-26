import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Link } from "@/lib/router-compat";
import { Header } from "@/components/Header";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { RealImageSection } from "@/components/RealImageSection";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { PrecosServiceSchema } from "@/components/PrecosServiceSchema";
import { PrecoModalidades } from "@/components/PrecoModalidades";
import { TermosConteudo } from "@/components/TermosConteudo";
import { ExperienciaBadge } from "@/components/social-proof/ExperienciaBadge";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";

import { PAGAMENTO, NOTA_FISCAL, SUPORTE_GERENCIADO } from "@/lib/politicaComercial";

import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { 
  Check, 
  AlertTriangle, 
  Clock, 
  Truck, 
  CreditCard, 
  FileText, 
  Monitor,
  Shield,
  HardDrive,
  Wrench,
  Wifi,
  Database,
  Building2,
  Headphones,
  MapPin,
  Star,
  BadgeCheck,
  MessageCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COLETA_TAXA_MINIMA_LABEL,
  DIAGNOSTICO_VALOR_LABEL,
  EQUIPAMENTOS_COLETA,
  PRAZOS,
  REGRA_ESTIMATIVA_GRATIS,
} from "@/lib/coletaConfig";

const WHATSAPP_NUMBER = "5541997086380";

const servicosPrecos = [
  {
    categoria: "Formatação e Sistema",
    icon: Monitor,
    servicos: [
      { nome: "Formatação completa", valor: "a partir de R$ 99,99", obs: "Windows + drivers essenciais • Licença não inclusa" },
      { nome: "Reinstalação de sistema", valor: "a partir de R$ 99,99", obs: "Mantendo dados do usuário quando possível" },
      { nome: "Configuração de PC novo", valor: "a partir de R$ 99,99", obs: "Ajustes iniciais e programas essenciais" },
    ]
  },
  {
    categoria: "Segurança e Vírus",
    icon: Shield,
    servicos: [
      { nome: "Remoção de vírus", valor: "a partir de R$ 99,99", obs: "Casos complexos podem exigir mais tempo" },
      { nome: "Instalação de antivírus", valor: "a partir de R$ 99,99", obs: "Solução gratuita ou licenciada" },
      { nome: "Limpeza + proteção", valor: "sob avaliação", obs: "Escopo definido conforme o caso" },
    ]
  },
  {
    categoria: "Hardware e Upgrades",
    icon: HardDrive,
    servicos: [
      { nome: "Upgrade de SSD (mão de obra)", valor: "a partir de R$ 99,99", obs: "Peça não inclusa" },
      { nome: "Upgrade de memória RAM", valor: "a partir de R$ 99,99", obs: "Peça não inclusa" },
      { nome: "Troca de HD por SSD", valor: "a partir de R$ 99,99", obs: "Clonagem conforme o volume de dados" },
      { nome: "Limpeza interna + pasta térmica", valor: "sob avaliação", obs: "Notebook ou desktop" },
    ]
  },
  {
    categoria: "Redes e Wi-Fi",
    icon: Wifi,
    servicos: [
      { nome: "Configuração de roteador", valor: "a partir de R$ 99,99", obs: "Wi-Fi + segurança básica" },
      { nome: "Melhoria de sinal Wi-Fi", valor: "a partir de R$ 99,99", obs: "Repetidor / mesh" },
      { nome: "Rede cabeada", valor: "sob avaliação", obs: "Por ponto de rede" },
    ]
  },
  {
    categoria: "Backup e Dados",
    icon: Database,
    servicos: [
      { nome: "Backup de dados", valor: "sob avaliação", obs: "Pode influenciar prazo e valor do atendimento" },
      { nome: "Recuperação de dados", valor: "sob avaliação", obs: "Somente após análise • Recuperação não garantida" },
      { nome: "Configuração de backup em nuvem", valor: "a partir de R$ 99,99", obs: "OneDrive, Google Drive e similares" },
    ]
  },
  {
    categoria: "Suporte e Empresas",
    icon: Building2,
    servicos: [
      { nome: "Suporte técnico remoto", valor: "a partir de R$ 99,99", obs: "Para problemas resolvíveis à distância" },
      { nome: "Plano Essencial de suporte gerenciado", valor: `${SUPORTE_GERENCIADO.planos[0].valorLabel}/mês`, obs: `Por computador gerenciado • mínimo de ${SUPORTE_GERENCIADO.minimoEquipamentos} computadores` },
      { nome: "Plano Pro de suporte gerenciado", valor: `${SUPORTE_GERENCIADO.planos[1].valorLabel}/mês`, obs: `Por computador gerenciado • mínimo de ${SUPORTE_GERENCIADO.minimoEquipamentos} computadores` },
      { nome: "Plano Premium de suporte gerenciado", valor: `${SUPORTE_GERENCIADO.planos[2].valorLabel}/mês`, obs: `Por computador gerenciado • mínimo de ${SUPORTE_GERENCIADO.minimoEquipamentos} computadores` },
      { nome: "Consultoria de TI", valor: "sob consulta", obs: "Projetos específicos" },
    ]
  },
];

interface PrecosEPoliticasProps {
  /** Rota efetiva (alias /termos-e-condicoes aponta canonical para /precos-e-politicas). */
  path?: string;
}

const PrecosEPoliticas = ({ path = "/precos-e-politicas" }: PrecosEPoliticasProps) => {
  useEffect(() => {
    document.title = "Termos, Condições, Valores e Prazos | Técnico em Curitiba";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Ponto único de termos, condições, valores e prazos: visita técnica de inspeção a partir de R$ 99,99 por 30 min, pacote de até 2h por R$ 279,99 e diagnóstico com coleta e entrega a partir de R$ 299,99, com cancelamento em até 24h."
      );
    }
    trackPageView(path, "Termos, Condições, Valores e Prazos");
  }, [path]);

  const whatsappMessage = "Olá! Vi a página de preços e políticas e gostaria de solicitar um valor para [DESCREVA O SERVIÇO].";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title="Termos, Condições, Valores e Prazos | Técnico em Curitiba" description="Ponto único de termos, condições, valores e prazos: visita técnica de inspeção a partir de R$ 99,99 por 30 min, pacote de até 2h por R$ 279,99 e diagnóstico com coleta e entrega a partir de R$ 299,99, com cancelamento em até 24h." path="/precos-e-politicas" breadcrumbs={[{ name: "Início", path: "/" }, { name: "Termos, Condições, Valores e Prazos", path: "/precos-e-politicas" }]} />
      <JsonLdSchema />
      <LocalBusinessJsonLd path="/precos-e-politicas" description="Termos, condições, valores e prazos do atendimento técnico de informática em Curitiba e Região Metropolitana." />
      <PrecosServiceSchema path="/precos-e-politicas" />

      <Header />
      <main>
        {/* Hero */}
        <section className="hero-gradient pt-10 pb-10 md:pt-12 md:pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.15),transparent_60%)] pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <ExperienciaBadge className="mb-4" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-4 reveal-text">
                Termos, Condições, Valores e Prazos
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 reveal-text" data-reveal-delay="100">
                Ponto único de consulta: modalidades, valores, condições, prazos e regras de cancelamento
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { icon: BadgeCheck, text: "Valores de referência" },
                  { icon: Star, text: "Valor informado após avaliação" },
                  { icon: FileText, text: "Regras transparentes" },
                ].map((badge, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-2 stagger-item hover:bg-white/15 transition-colors" style={{ animationDelay: `${i * 100}ms` }}>
                    <badge.icon className="h-5 w-5 text-accent" />
                    <span className="text-white text-sm">{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* Rodada 3P — CTA de triagem visível já no topo da página. */}
              <div className="mt-7">
                <Button asChild size="lg" className="min-h-14">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTAClick("whatsapp", "precos_hero")}
                    data-cta-location="precos_hero"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" /> Iniciar atendimento no WhatsApp
                  </a>
                </Button>
                <p className="mt-3 text-sm text-white/80">
                  Diagnóstico a partir de R$ 99,99 • Valor aprovado antes de qualquer serviço
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rodada 3P — sumário de navegação da página (sem novas URLs). */}
        <section className="py-8 bg-background">
          <div className="container mx-auto">
            <PageTableOfContents
              className="max-w-4xl mx-auto"
              items={[
                { id: "visita-tecnica", label: "Visita técnica e serviços rápidos" },
                { id: "coleta-e-entrega", label: "Coleta e entrega de equipamentos" },
                { id: "tabela-de-servicos", label: "Tabela completa de serviços" },
                { id: "politicas-de-atendimento", label: "Políticas de atendimento" },
                { id: "pagamento-e-nota-fiscal", label: "Pagamento e nota fiscal" },
                { id: "termos", label: "Termos e condições" },
              ]}
            />
          </div>
        </section>

        {/* Modalidades e valores — fonte única */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <PrecoModalidades className="max-w-4xl mx-auto" />
          </div>
        </section>


        {/* Link para Como Funciona */}

        <section className="py-6 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center bg-background rounded-xl p-6 border border-accent/20">
              <p className="text-muted-foreground mb-3">
                Não entendeu como funciona o atendimento? Veja o passo a passo completo.
              </p>
              <Link to="/como-funciona" className="inline-flex items-center gap-2 text-accent font-semibold hover:underline">
                Ver Como Funciona →
              </Link>
            </div>
          </div>
        </section>

        {/* VISITA TÉCNICA — Serviços Rápidos */}
        <section id="visita-tecnica" className="scroll-mt-24 py-8 md:py-10 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center reveal-text">
                ⚡ Visita Técnica — Serviços Rápidos
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto reveal-text" data-reveal-delay="100">
                Ideal para serviços rápidos como formatação, upgrade, configuração de rede e remoção de vírus.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { tempo: "até 30 minutos", valor: "R$ 99,99" },
                ].map((t, i) => (
                  <div key={i} className={`bg-secondary rounded-xl p-6 text-center hover:-translate-y-1 transition-all stagger-item ${i === 0 ? "ring-2 ring-accent shadow-[0_0_20px_hsl(var(--accent)/0.15)]" : ""}`} style={{ animationDelay: `${i * 100}ms` }}>
                    <Zap className="h-6 w-6 text-accent mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground block mb-1">{t.tempo}</span>
                    <div className="text-2xl font-bold text-accent">{t.valor}</div>
                    {i === 0 && <span className="text-xs text-accent mt-1 block shimmer">Mais popular</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VISITA TÉCNICA — Serviços com Execução no Local */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                🛠️ Serviços com Execução no Local
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Para serviços que exigem mais tempo no local: formatações, configurações de rede, upgrades com peça já em mãos.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { tempo: "cada 30 minutos (avulso)", valor: "R$ 99,99" },
                  { tempo: "pacote pré-acordado de até 2 horas", valor: "R$ 279,99" },
                ].map((t, i) => (
                  <div key={i} className="bg-background rounded-xl p-6 text-center">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground block mb-1">{t.tempo}</span>
                    <div className="text-2xl font-bold text-accent">{t.valor}</div>
                  </div>
                ))}
              </div>
              <div className="bg-accent/5 rounded-xl p-4 mt-6 border border-accent/20">
                <p className="text-sm text-muted-foreground text-center">
                  <strong className="text-foreground">Como funciona:</strong> a cobrança é pelo tempo técnico aplicado no endereço, sem promessa de solução no local e sem peças inclusas. O que não for resolvível em visita é convertido em coleta e entrega.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EXCEÇÃO — Coleta e Entrega */}
        <section id="coleta-e-entrega" className="scroll-mt-24 py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                🚚 Equipamentos com Coleta e Entrega
              </h2>
                <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Para estes equipamentos, <strong className="text-foreground">não há cobrança de visita técnica</strong>. O serviço é realizado em laboratório com coleta e entrega no seu endereço.
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {EQUIPAMENTOS_COLETA.map((item, i) => (
                    <div key={i} className="bg-secondary rounded-xl p-4 flex items-center gap-3">
                      <Truck className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-foreground font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-accent/5 rounded-xl p-5 mt-6 border border-accent/20 space-y-3">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong className="text-foreground">Taxa mínima pré-aprovada:</strong> <strong className="text-accent">{COLETA_TAXA_MINIMA_LABEL}</strong> com coleta e entrega inclusa. {REGRA_ESTIMATIVA_GRATIS}.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {PRAZOS.map((p, i) => (
                      <div key={i} className="bg-background rounded-lg p-3 text-center border border-border/50">
                        <span className="text-xs text-muted-foreground block mb-1">{p.equipamentos}</span>
                        <span className="text-sm font-bold text-accent">Prazo: {p.prazo}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    <Link to="/coleta-e-entrega" className="text-accent hover:underline">Saiba mais sobre Coleta e Entrega →</Link>
                  </p>
                </div>
            </div>
          </div>
        </section>

        {/* DIAGNÓSTICO COM COMPROMISSO */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Diagnóstico com Compromisso
              </h2>
              <div className="bg-background rounded-2xl p-6 md:p-8 border-2 border-accent/20">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Como funciona:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        Diagnóstico custa <strong>{DIAGNOSTICO_VALOR_LABEL}</strong> em caso de desistência
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <strong>NÃO</strong> existe atendimento sem compromisso presencial — {REGRA_ESTIMATIVA_GRATIS.toLowerCase()}
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        Taxa mínima pré-aprovada: <strong>{COLETA_TAXA_MINIMA_LABEL}</strong> (somente com coleta e entrega)
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        Se o reparo estiver dentro do pré-aprovado, é realizado automaticamente
                      </li>
                    </ul>
                  </div>
                  <div className="bg-accent/10 rounded-xl p-5">
                    <h3 className="font-bold text-accent mb-2">Importante entender:</h3>
                    <p className="text-sm text-muted-foreground">
                      Estimativas gratuitas são feitas somente via WhatsApp. O diagnóstico presencial envolve deslocamento, tempo técnico e ferramentas profissionais — por isso tem custo. Se o reparo for aprovado, o valor do diagnóstico é abatido do total.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4">
                <Link to="/diagnostico-tecnico" className="text-accent text-sm hover:underline font-medium">
                  Entenda tudo sobre o diagnóstico técnico →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Tabela Completa de Serviços */}
        <section id="tabela-de-servicos" className="scroll-mt-24 py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center reveal-text">
                Tabela Completa de Serviços
              </h2>

              <div className="space-y-8">
                {servicosPrecos.map((categoria, catIndex) => {
                  const Icon = categoria.icon;
                  return (
                    <div key={catIndex} className="bg-secondary rounded-xl overflow-hidden stagger-item hover:shadow-lg transition-shadow" style={{ animationDelay: `${catIndex * 100}ms` }}>
                      <div className="bg-primary px-6 py-4 flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                        <h3 className="text-lg font-bold text-primary-foreground">
                          {categoria.categoria}
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-secondary/50">
                            <tr>
                              <th className="text-left p-4 font-semibold text-foreground">Serviço</th>
                              <th className="text-left p-4 font-semibold text-foreground">Valor</th>
                              <th className="text-left p-4 font-semibold text-foreground hidden sm:table-cell">Observação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {categoria.servicos.map((servico, servIndex) => (
                              <tr key={servIndex} className="hover:bg-background/50 transition-colors">
                                <td className="p-4">
                                  <span className="font-medium text-foreground">{servico.nome}</span>
                                  <span className="block sm:hidden text-xs text-muted-foreground mt-1">{servico.obs}</span>
                                </td>
                                <td className="p-4 text-accent font-bold whitespace-nowrap">{servico.valor}</td>
                                <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">{servico.obs}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-muted-foreground mt-6 text-center">
                * Valores sujeitos a variação conforme complexidade. Valor do atendimento sempre informado antes do serviço.
              </p>
            </div>
          </div>
        </section>

        {/* Políticas */}
        <section id="politicas-de-atendimento" className="scroll-mt-24 py-8 md:py-10 bg-secondary relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center reveal-text">
                Políticas de Atendimento
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Visita Técnica */}
                <div className="bg-background rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary rounded-lg p-2">
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">Visita Técnica Presencial</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">a partir de R$ 99,99 (serviços rápidos de até 15 minutos)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Serviços rápidos (formatação, vírus) geralmente 15-30 min</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Tempo cronometrado a partir da chegada do técnico</span>
                    </li>
                  </ul>
                </div>

                {/* Coleta e Entrega */}
                <div className="bg-background rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary rounded-lg p-2">
                      <Truck className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">Diagnóstico com Coleta</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Para reparos que exigem bancada ou peças específicas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Valor do atendimento pré-aprovado de até R$ 300 em reparos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Coleta e entrega inclusas no valor do reparo</span>
                    </li>
                  </ul>
                </div>

                {/* Cancelamento */}
                <div className="bg-background rounded-xl p-6 border-2 border-accent/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-accent rounded-lg p-2">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">Política de Cancelamento</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-accent/10 rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-2">Desistência após agendamento de coleta:</p>
                      <p className="text-muted-foreground">
                        Será cobrada taxa de diagnóstico de <strong className="text-accent">R$ 99,99</strong>, 
                        que inclui logística de coleta e entrega do equipamento.
                      </p>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-2">Visita técnica presencial:</p>
                      <p className="text-muted-foreground">
                        Cobrança proporcional ao tempo de atendimento 
                        (a partir de <strong className="text-accent">R$ 99,99</strong>).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pagamento */}
                <div className="bg-background rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary rounded-lg p-2">
                      <CreditCard className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">Formas de Pagamento</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">PIX (pagamento imediato - preferencial)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Dinheiro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Cartão de crédito e débito</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Pagamento faturado (empresas com contrato)</span>
                    </li>
                  </ul>
                </div>

                {/* Nota Fiscal */}
                <div className="bg-background rounded-xl p-6 md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary rounded-lg p-2">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">Nota Fiscal e Garantia</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Emitimos nota fiscal de serviços para todos os atendimentos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Nota fiscal de produto para peças quando aplicável</span>
                      </li>
                    </ul>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Garantia de mão de obra conforme o tipo de serviço</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Peças seguem garantia do fabricante</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recuperação de dados e casos que exigem análise */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Casos que exigem análise
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Alguns atendimentos — como recuperação de dados, defeitos intermitentes ou problemas de hardware mais profundos — só podem ser informados após avaliação do equipamento.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-secondary rounded-xl p-6">
                  <h3 className="font-bold text-foreground mb-3">Como tratamos:</h3>
                  <ul className="space-y-2">
                    {[
                      "Avaliação antes de qualquer execução",
                      "Explicação clara das possibilidades e limites",
                      "Recuperação de dados não é garantida",
                      "Valor do atendimento e prazo informados antes de prosseguir",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-secondary rounded-xl p-6">
                  <h3 className="font-bold text-foreground mb-3">O que pode variar:</h3>
                  <ul className="space-y-2">
                    {[
                      "Prazo conforme a complexidade e a condição do equipamento",
                      "Disponibilidade de peças, licenças e materiais",
                      "Necessidade de backup, que pode influenciar prazo e valor",
                      "Atualizações do andamento via WhatsApp",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pagamento e nota fiscal */}
        <section id="pagamento-e-nota-fiscal" className="py-8 md:py-12 bg-secondary scroll-mt-24">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Pagamento e nota fiscal
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Quando o valor é cobrado, o que entra na conta e como funciona a emissão do documento fiscal. Regras válidas para atendimento remoto, em domicílio e para coleta e entrega.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-background rounded-xl p-6 border border-border/60">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-accent" />
                    <h3 className="font-bold text-foreground">Como funciona o pagamento</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      PAGAMENTO.momentoLabel,
                      PAGAMENTO.aprovacaoLabel,
                      PAGAMENTO.formasLabel,
                      PAGAMENTO.pecasLabel,
                      PAGAMENTO.desistenciaLabel,
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground border-t border-border/60 pt-4">
                    <Shield className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>{PAGAMENTO.seguraLabel}</span>
                  </p>
                </div>

                <div className="bg-background rounded-xl p-6 border border-border/60">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-accent" />
                    <h3 className="font-bold text-foreground">Nota fiscal do atendimento</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      NOTA_FISCAL.servicoLabel,
                      NOTA_FISCAL.pecaLabel,
                      NOTA_FISCAL.ressalvaLabel,
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground border-t border-border/60 pt-4">
                    Precisa de nota fiscal em nome da empresa? Informe os dados do tomador ainda na triagem, antes da conclusão do serviço — assim o documento sai correto de primeira.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <Link to="/como-funciona" className="text-accent font-semibold hover:underline">
                      Ver o passo a passo do atendimento →
                    </Link>
                    <Link to="/coleta-e-entrega" className="text-accent font-semibold hover:underline">
                      Regras de coleta e entrega →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Termos, condições e FAQ — conteúdo fundido (fonte única) */}
        <section id="termos" className="py-10 md:py-14 bg-background scroll-mt-24">
          <TermosConteudo withModalidades={false} />
        </section>

        {/* CTA Final */}
        <section className="py-8 md:py-10 bg-primary">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Solicite seu atendimento agora
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                Envie os detalhes do seu problema e receba o valor personalizado
              </p>
              <Button variant="heroWhatsapp" size="lg" asChild>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-location="precos-termos-final"
                  onClick={() => trackCTAClick("whatsapp", "precos-termos-final")}
                >
                  <MessageCircle className="h-5 w-5" />
                  Escolher a modalidade no WhatsApp
                </a>
              </Button>
              <p className="text-primary-foreground/60 text-sm mt-4">
                Fale conosco pelo WhatsApp
              </p>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <RealImageSection imageKey="bancadaTecnica" secondaryImageKey="ferramentas" layout="duo" caption="Bancada técnica profissional equipada" secondaryCaption="Ferramentas especializadas para cada serviço" />
      <InterlinkingBlock />
      <Footer />
      <WhatsAppChat />
    </div>
  );
};

export default PrecosEPoliticas;
