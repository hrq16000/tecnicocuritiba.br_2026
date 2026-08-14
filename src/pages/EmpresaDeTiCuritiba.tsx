import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PilarEditorialLinks } from "@/components/editorial/PilarEditorialLinks";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import {
  EmpresaTrustBar,
  EmpresaSinaisSection,
  EmpresaPassosSection,
  EmpresaContextosSection,
  EmpresaSegmentosSection,

} from "@/components/empresa/EmpresaConversao";

import { ContextosEmpresariaisSection, RegistrarAntesSection } from "@/components/empresa/ContextosEmpresariaisSection";
import { PilaresOperacionaisSection, MapaServicosEmpresariaisSection } from "@/components/empresa/HubEmpresarialBlocos";
import { siteConfig } from "@/lib/siteConfig";
import { EMPRESARIAL_HUB_HERO, EMPRESARIAL_CONTEXTO_CARDS } from "@/lib/visualEmpresarial3s";
import { NOTA_FISCAL } from "@/lib/politicaComercial";
import { EeatProofsSection } from "@/components/EeatProofsSection";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import {
  MessageCircle,
  Building2,
  Server,
  ShieldCheck,
  Network,
  Printer,
  HardDrive,
  MapPin,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const PATH = "/empresa-de-ti-curitiba";
const TITLE = "Empresa de TI em Curitiba | Soluções para Pequenas Empresas";
const DESCRIPTION =
  "Soluções de informática para empresas em Curitiba: diagnóstico do ambiente, computadores, redes, manutenção e organização do suporte técnico.";

const whatsappMessage =
  "Quero avaliar as necessidades de informática da minha empresa em Curitiba.";
const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

const servicos = [
  {
    icon: ShieldCheck,
    title: "Diagnóstico do ambiente",
    desc: "Avaliamos como está a informática da empresa hoje — equipamentos, rede e rotinas — antes de propor qualquer solução.",
  },
  {
    icon: Server,
    title: "Computadores e estações",
    desc: "Organização, padronização básica e manutenção das estações de trabalho para reduzir travamentos e paradas.",
  },
  {
    icon: Network,
    title: "Redes e Wi-Fi",
    desc: "Cabeamento, roteadores, repetidores e organização de rede para conexão estável em todo o escritório.",
  },
  {
    icon: HardDrive,
    title: "Manutenção preventiva",
    desc: "Rotinas para antecipar falhas e reduzir surpresas, no formato pontual ou recorrente sob consulta.",
  },
  {
    icon: Printer,
    title: "Suporte remoto e presencial",
    desc: "Atendimento remoto para ajustes do dia a dia e presencial quando a situação exige avaliação no local.",
  },
  {
    icon: Building2,
    title: "Orientação de melhoria",
    desc: "Ajudamos a organizar as necessidades técnicas e orientamos sobre substituição ou melhoria de equipamentos.",
  },
];

const bairros = [
  { label: "Batel", to: "/bairros/batel" },
  { label: "CIC", to: "/bairros/cic" },
  { label: "Água Verde", to: "/bairros/agua-verde" },
  { label: "Centro", to: "/bairros/centro" },
  { label: "Portão", to: "/bairros/portao" },
];

const cidades = [
  { label: "Curitiba", to: "/tecnico-informatica-curitiba" },
  { label: "São José dos Pinhais", to: "/tecnico-informatica-sao-jose-pinhais" },
  { label: "Pinhais", to: "/tecnico-informatica-pinhais" },
  { label: "Colombo", to: "/tecnico-informatica-colombo" },
  { label: "Araucária", to: "/tecnico-informatica-araucaria" },
  { label: "Campo Largo", to: "/tecnico-informatica-campo-largo" },
];

const relacionados = [
  { label: "Suporte técnico empresarial", to: "/servicos/suporte-tecnico-empresarial" },
  { label: "Redes e Wi-Fi para empresas", to: "/servicos/redes-e-wifi" },
  { label: "Manutenção preventiva para empresas", to: "/servicos/manutencao-preventiva-empresas" },
  { label: "Backup para empresas", to: "/servicos/backup-para-empresas" },
  { label: "Montagem de PC e workstation", to: "/servicos/montagem-de-pc" },
  { label: "Suporte para home office", to: "/servicos/suporte-home-office" },
  { label: "Manutenção de computador", to: "/servicos/manutencao-de-computador" },
  { label: "Manutenção de notebook", to: "/servicos/manutencao-de-notebook" },
  { label: "Conserto de placa e solda", to: "/servicos/conserto-placa" },
  { label: "Segurança dos dados", to: "/seguranca-dos-dados" },
  { label: "Suporte remoto", to: "/atendimento-remoto" },
  { label: "Preços e políticas", to: "/precos-e-politicas" },
  { label: "Como funciona", to: "/como-funciona" },
  { label: "Diagnóstico técnico", to: "/diagnostico-tecnico" },
  { label: "Equipamentos atendidos", to: "/equipamentos-atendidos" },
];

const faqs = [
  {
    question: "O que faz uma empresa de TI em Curitiba?",
    answer:
      "Cuida da parte de tecnologia do seu negócio: manutenção de computadores e notebooks, rede e Wi-Fi, servidores locais, impressoras, backup de dados e segurança. O objetivo é manter a operação funcionando com o mínimo de paradas.",
  },
  {
    question: "Vocês atendem suporte de TI recorrente ou só emergência?",
    answer:
      "Os dois. Atendemos chamados pontuais quando algo para de funcionar e também manutenção preventiva recorrente sob consulta, que costuma sair mais barato do que resolver tudo no modo emergência.",
  },
  {
    question: "Atendem empresas de qual porte?",
    answer:
      "Trabalhamos com autônomos, escritórios, comércios e pequenas e médias empresas de Curitiba e região metropolitana. O escopo é adequado ao número de máquinas e à complexidade da rede.",
  },
  {
    question: "Como funciona o valor do atendimento do suporte de TI?",
    answer:
      "Começa com uma avaliação para entender o ambiente e a demanda. A partir daí apresentamos o valor do atendimento, que só é executado após a sua aprovação. O diagnóstico começa a partir de " +
      siteConfig.minPriceLabel + ".",
  },
  {
    question: "Vocês atendem no local da empresa?",
    answer:
      "Sim, atendemos presencialmente em Curitiba e região, e também remotamente para ajustes que não exigem visita. Reparos de bancada podem usar coleta e entrega.",
  },
  {
    question: "O suporte pode ser avulso?",
    answer:
      "Pode. Muitas empresas começam com um chamado único — uma máquina parada, um usuário sem acesso, a impressora fora da rede — e só depois avaliam um acompanhamento recorrente. Não exigimos vínculo para atender.",
  },
  {
    question: "Vocês atendem computadores de funcionários?",
    answer:
      "Sim, desde que sejam os equipamentos usados no trabalho e que a empresa autorize o atendimento. Organizamos por lote e prioridade para que a operação não pare inteira durante o serviço.",
  },
  {
    question: "Redes e Wi-Fi fazem parte do atendimento?",
    answer:
      "Fazem. Instabilidade, cobertura irregular, compartilhamento e impressoras em rede são tratados na página de redes e Wi-Fi, que detalha o levantamento do ambiente e os limites do que conseguimos executar.",
  },
  {
    question: "Como funciona o diagnóstico?",
    answer:
      "Começa pela triagem, com a descrição do que está acontecendo, quais máquinas e desde quando. Em seguida avaliamos o ambiente ou o equipamento, explicamos o que foi encontrado e apresentamos o valor. Nada é executado sem a sua autorização.",
  },
  {
    question: "Quais informações devo registrar antes de pedir suporte?",
    answer:
      "Equipamento e usuário afetados, horário aproximado do início do problema, mensagem de erro, programa envolvido, alteração recente, impacto na operação, quantas pessoas estão paradas, se o acesso remoto é possível, se existe backup recente, quem autoriza alterações e o contato do fornecedor do sistema quando o problema for dele. Senhas e códigos de autenticação não devem ser enviados por mensagem.",
  },
  {
    question: "Vocês atendem escritórios de diferentes segmentos?",
    answer:
      "Sim, atendemos escritórios, recepções, comércios e profissionais autônomos de segmentos variados em Curitiba e região. O que avaliamos é o contexto operacional — quantas estações, quais arquivos não podem parar e quais sistemas externos estão envolvidos —, e não uma especialização setorial. Não prometemos conformidade regulatória nem suporte especializado a plataformas de um setor específico.",
  },
  {
    question: "Vocês prestam suporte a qualquer sistema empresarial?",
    answer:
      "Não. Atuamos na camada do computador, da rede e do acesso: instalar, conectar, corrigir sessão, ajustar permissão, impressora ou navegador. O funcionamento interno de sistemas mantidos por terceiros — contábil, judicial, prontuário, ERP, CRM, certificado digital, e-mail corporativo — é responsabilidade do fornecedor da plataforma. Registramos a constatação por escrito para a empresa acionar quem mantém o sistema.",
  },
  {
    question: "Há emissão de nota fiscal?",
    answer: NOTA_FISCAL.servicoLabel,
  },
];

const hubSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "name": "Soluções de TI para empresas em Curitiba",
      "serviceType": "Soluções e infraestrutura de informática para empresas",
      "provider": {
        "@type": "LocalBusiness",
        "name": siteConfig.brandName,
        "telephone": siteConfig.phoneE164,
        "areaServed": siteConfig.serviceArea.map((name) => ({ "@type": "Place", name })),
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Curitiba",
          "addressRegion": "PR",
          "addressCountry": "BR",
        },
      },
      "areaServed": { "@type": "City", "name": "Curitiba" },
      "url": `${siteConfig.baseUrl}${PATH}`,
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer },
      })),
    },
  ],
};

const EmpresaDeTiCuritiba = () => {
  useJsonLdSlot(SCHEMA_SLOTS.service, hubSchema, SLOT_PRIORITY.page);

  useEffect(() => {
    trackPageView(PATH, "Empresa de TI em Curitiba");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Empresa de TI em Curitiba", path: PATH },
        ]}
      />
      <LocalBusinessJsonLd path={PATH} description={DESCRIPTION} />
      <JsonLdSchema />
      <Header />
      <Breadcrumbs items={[{ label: "Empresa de TI em Curitiba" }]} />

      <main>
        {/* ═══ HERO ═══ */}
        <section className="relative pt-6 pb-7 md:pt-14 md:pb-14 overflow-hidden hero-gradient">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px] animate-breathe" />
            <div className="absolute bottom-1/3 left-1/5 w-56 h-56 bg-primary/8 rounded-full blur-[80px] animate-breathe" style={{ animationDelay: "2s" }} />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-6">
                <Building2 className="h-4 w-4" />
                <span className="font-medium text-xs md:text-sm">{EMPRESARIAL_HUB_HERO.contexto}</span>
              </div>
              <h1 className="text-[1.6rem] leading-tight sm:text-4xl md:text-5xl font-heading font-bold text-white mb-3 md:mb-4">
                Soluções de TI para empresas em Curitiba
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-5 md:mb-8 max-w-2xl mx-auto">
                Como organizar e melhorar a informática da sua empresa: diagnóstico do
                ambiente, computadores, redes, manutenção preventiva e a organização do
                suporte técnico — com orientação clara antes de qualquer investimento.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  variant="heroWhatsapp"
                  size="lg"
                  className="min-h-14 w-full sm:w-auto text-base md:text-lg px-8 hover:scale-105 transition-transform"
                  asChild
                  onClick={() => trackCTAClick("whatsapp", "empresa_ti_hub_hero")}
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    {EMPRESARIAL_HUB_HERO.ctaPrimario}
                  </a>
                </Button>
                <Link
                  to={EMPRESARIAL_HUB_HERO.ctaSecundario.to}
                  data-cta-secundario="empresarial"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent"
                >
                  {EMPRESARIAL_HUB_HERO.ctaSecundario.label}
                </Link>
              </div>
              <p className="mt-5 text-sm text-white/70">{EMPRESARIAL_HUB_HERO.condicoes}</p>
            </div>
          </div>
        </section>

        {/* ═══ Prova rápida (abaixo do hero) ═══ */}
        <EmpresaTrustBar />

        {/* Rodada 3S — contexto B2B (decisão, escopo e limites) logo abaixo do hero */}
        <section className="border-b border-border bg-secondary py-8" aria-label="Contexto do atendimento empresarial">
          <div className="container mx-auto grid gap-4 px-4 md:grid-cols-3">
            {EMPRESARIAL_CONTEXTO_CARDS.map((card) => (
              <div key={card.titulo} className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{card.titulo}</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{card.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ Sumário navegável (apresentação — não cria URLs nem schema) ═══ */}
        <section className="bg-background pt-8">
          <div className="container mx-auto px-4">
            <PageTableOfContents
              className="mx-auto max-w-3xl"
              items={[
                { id: "pilares", label: "Pilares do atendimento empresarial" },
                { id: "escopo", label: "O que abrange a solução de TI" },
                { id: "contextos", label: "Contextos atendidos" },
                { id: "mapa-servicos", label: "Mapa dos serviços empresariais" },
                { id: "cobertura", label: "Bairros e cidades atendidas" },
                { id: "relacionados", label: "Serviços relacionados" },
                { id: "faq", label: "Perguntas frequentes" },
              ]}
            />
          </div>
        </section>


        {/* ═══ Rodada 3S — pilares operacionais (caminhos reais) ═══ */}
        <AnimatedSection>
          <PilaresOperacionaisSection />
        </AnimatedSection>

        {/* ═══ Intro ═══ */}

        <AnimatedSection>
          <section className="py-12 md:py-14 bg-background">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl space-y-4">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  Como organizar e melhorar a informática da sua empresa
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Esta é a página para quem precisa estruturar, organizar ou melhorar o ambiente
                  de informática do negócio — e não apenas resolver um chamado pontual. Atuamos
                  como a TI de apoio de escritórios, comércios e pequenas empresas em Curitiba e na
                  Região Metropolitana, com uma visão do conjunto: equipamentos, rede e rotinas.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  O trabalho começa sempre pelo diagnóstico do ambiente: entender os equipamentos,
                  a rede e as reais necessidades antes de propor qualquer solução. A partir daí,
                  organizamos as prioridades, a manutenção preventiva e a orientação para
                  substituição ou melhoria de equipamentos. Você aprova o escopo antes da execução
                  e escolhe entre atendimento pontual ou acompanhamento recorrente sob consulta.
                  Para resolver problemas técnicos específicos do dia a dia, o
                  {" "}
                  <Link to="/servicos/suporte-tecnico-empresarial" className="text-accent underline underline-offset-2">
                    suporte técnico empresarial
                  </Link>
                  {" "}
                  é a oferta operacional indicada.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ═══ Serviços ═══ */}
        <AnimatedSection>
          <section id="escopo" className="scroll-mt-24 py-12 md:py-14 bg-secondary">
            <div className="container mx-auto px-4">
              <h2 className="mb-8 text-center text-2xl md:text-3xl font-heading font-bold text-foreground">
                O que abrange a solução de TI da sua empresa
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                {servicos.map((s) => (
                  <div key={s.title} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                    <s.icon className="h-8 w-8 text-accent mb-3" />
                    <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ═══ Sinais + CTA de meio de página ═══ */}
        <AnimatedSection>
          <EmpresaSinaisSection whatsappUrl={whatsappUrl} />
        </AnimatedSection>

        {/* ═══ Como funciona em 4 passos ═══ */}
        <AnimatedSection>
          <EmpresaPassosSection />
        </AnimatedSection>

        {/* ═══ Contextos atendidos (necessidade real, sem novas URLs) ═══ */}
        <AnimatedSection>
          <div id="contextos" className="scroll-mt-24" />
          <EmpresaContextosSection />
        </AnimatedSection>

        {/* ═══ Segmentos atendidos ═══ */}
        <AnimatedSection>
          <EmpresaSegmentosSection />
        </AnimatedSection>

        {/* ═══ Rodada 3N — contextos empresariais (sem landing por profissão) ═══ */}
        <AnimatedSection>
          <ContextosEmpresariaisSection />
        </AnimatedSection>

        {/* ═══ Rodada 3N — o que registrar antes de solicitar suporte ═══ */}
        <AnimatedSection>
          <RegistrarAntesSection />
        </AnimatedSection>


        {/* ═══ Rodada 3S — mapa dos serviços empresariais ═══ */}
        <AnimatedSection>
          <MapaServicosEmpresariaisSection />
        </AnimatedSection>

        {/* ═══ Cobertura — bairros e cidades (links internos) ═══ */}

        <AnimatedSection>
          <section id="cobertura" className="scroll-mt-24 py-12 md:py-14 bg-background">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-2 text-center text-2xl md:text-3xl font-heading font-bold text-foreground">
                  Atendimento de TI em Curitiba e Região Metropolitana
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted-foreground">
                  Atendemos empresas nos principais bairros de Curitiba e nas cidades da RMC.
                  Escolha a sua região:
                </p>

                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Bairros de Curitiba
                </h3>
                <div className="mb-8 flex flex-wrap gap-3">
                  {bairros.map((b) => (
                    <Link
                      key={b.to}
                      to={b.to}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <MapPin className="h-4 w-4" />
                      {b.label}
                    </Link>
                  ))}
                </div>

                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Cidades da Região Metropolitana
                </h3>
                <div className="flex flex-wrap gap-3">
                  {cidades.map((c) => (
                    <Link
                      key={c.to}
                      to={c.to}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <MapPin className="h-4 w-4" />
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ═══ Serviços relacionados ═══ */}
        <AnimatedSection>
          <section id="relacionados" className="scroll-mt-24 py-10 bg-secondary">
            <div className="container mx-auto px-4">
              <h2 className="mb-5 text-center text-xl font-heading font-bold text-foreground">
                Serviços relacionados
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {relacionados.map((r) => (
                  <Link
                    key={r.to}
                    to={r.to}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {r.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ═══ FAQ ═══ */}
        <AnimatedSection>
          <section id="faq" className="scroll-mt-24 py-14 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl">
                <h2 className="mb-8 text-center text-2xl md:text-3xl font-heading font-bold text-foreground">
                  Perguntas frequentes sobre TI para empresas
                </h2>
                <div className="space-y-4">
                  {faqs.map((f) => (
                    <div key={f.question} className="rounded-xl border border-border bg-card p-6">
                      <h3 className="mb-2 flex items-start gap-2 text-lg font-bold text-foreground">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                        {f.question}
                      </h3>
                      <p className="pl-7 text-muted-foreground leading-relaxed">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <EeatProofsSection
          titulo="Com quem sua empresa vai contratar"
          descricao="Dados cadastrais, canal oficial e compromissos operacionais — o mínimo que um responsável por compras precisa conferir antes de abrir um chamado."
          className="bg-background"
        />

        {/* ═══ CTA final ═══ */}
        <section className="py-14 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl md:text-3xl font-heading font-bold text-foreground">
              Quer avaliar a estrutura de TI da sua empresa em Curitiba?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Fale pelo WhatsApp, conte como está a informática hoje e receba uma avaliação do
              ambiente com orientação transparente sobre os próximos passos.
            </p>
            <Button
              variant="whatsapp"
              size="lg"
              className="px-8 hover:scale-105 transition-transform"
              asChild
              onClick={() => trackCTAClick("whatsapp", "empresa_ti_hub_footer")}
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Conversar sobre a estrutura de TI
              </a>
            </Button>
          </div>
        </section>
        <PilarEditorialLinks pilar="/empresa-de-ti-curitiba" />
      </main>

      <Footer />
    </div>
  );
};

export default EmpresaDeTiCuritiba;
