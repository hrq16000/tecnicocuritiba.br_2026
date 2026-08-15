import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { PageSEO } from "@/components/PageSEO";
import { PoliticaAtendimentoBlock } from "@/components/PoliticaAtendimentoBlock";
import { Header } from "@/components/Header";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { InlineTriageCTA } from "@/components/servico/InlineTriageCTA";
import { Blocos3U } from "@/components/servico/Blocos3U";
import { blocos3U, cta3U } from "@/lib/blocos3u";
import { TrustSection } from "@/components/TrustSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { RealImageSection } from "@/components/RealImageSection";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { absoluteUrl, whatsappLink } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { MessageCircle, Zap, Download, MapPinOff, ShieldCheck, ArrowRight, Lock } from "lucide-react";

const PATH = "/atendimento-remoto";
const TITLE = "Suporte Remoto de Informática em Curitiba | Online";
const DESCRIPTION =
  "Suporte remoto de informática em Curitiba para configurações, sistema, programas, e-mail, impressora já conectada, orientação e home office — com autorização e acompanhamento.";

const WHATSAPP_MESSAGE = "Preciso de suporte remoto de informática.";

const fatoresValor = [
  { titulo: "Complexidade do problema", desc: "Um ajuste pontual é diferente de reconfigurar sistema, contas e programas de trabalho." },
  { titulo: "Tempo de sessão", desc: "Casos que exigem atualizações longas ou várias reinicializações ocupam mais tempo." },
  { titulo: "Quantidade de equipamentos", desc: "Atender uma máquina é diferente de padronizar várias estações de uma empresa." },
  { titulo: "Qualidade da conexão", desc: "Conexão instável alonga a sessão e, em alguns casos, inviabiliza o atendimento remoto." },
  { titulo: "Necessidade de retorno", desc: "Quando o remoto revela causa física, o caso migra para visita ou coleta, com escopo próprio." },
];

const faqs = [
  {
    question: "O que pode ser resolvido remotamente?",
    answer:
      "Configurações do sistema, erros do Windows, atualizações, drivers, instalação de programas legítimos, e-mail, impressora já conectada, acesso a arquivos e pastas, ajustes de navegador, orientação ao usuário e o diagnóstico inicial de lentidão ligada a software.",
  },
  {
    question: "Meu computador precisa estar funcionando?",
    answer:
      "Sim. O atendimento remoto depende de o equipamento ligar, o sistema carregar e existir conexão de internet estável. Sem esses três itens não há como estabelecer a sessão, e o caso passa para atendimento presencial ou coleta.",
  },
  {
    question: "O técnico consegue ver meus arquivos?",
    answer:
      "Durante a sessão, a tela do seu computador fica visível para quem atende, e alguns serviços exigem abrir pastas ou configurações. O acesso é limitado ao necessário para executar o que foi combinado, e você acompanha cada passo.",
  },
  {
    question: "Preciso informar minha senha?",
    answer:
      "Apenas a senha do próprio computador, quando o serviço não puder ser executado sem ela — e no momento do atendimento. Senhas bancárias, códigos de autenticação em duas etapas e credenciais sensíveis não devem ser enviados por mensagem.",
  },
  {
    question: "O programa de acesso fica instalado depois?",
    answer:
      "Não precisa ficar. Encerramos o acesso ao final do atendimento e, se você preferir, orientamos a remoção do programa. Não mantemos acesso permanente nem monitoramento contínuo do seu equipamento.",
  },
  {
    question: "Problemas de hardware podem ser resolvidos remotamente?",
    answer:
      "Não. Equipamento que não liga, tela sem imagem, aquecimento, dano por líquido, bateria, fonte, placa-mãe ou disco fisicamente danificado exigem avaliação presencial ou coleta. O remoto pode, no máximo, ajudar a levantar indícios antes da visita.",
  },
  {
    question: "O atendimento remoto possui garantia?",
    answer:
      "O serviço executado tem garantia sobre aquilo que foi feito, nas condições descritas na página de preços e políticas. A garantia não cobre novo problema de causa diferente nem alterações feitas depois por outra pessoa.",
  },
  {
    question: "O valor é informado antes do início?",
    answer:
      "Sim. Depois da triagem, confirmamos se o caso é compatível com acesso remoto e apresentamos o valor do atendimento. A sessão só começa após a sua aprovação.",
  },
];

const benefits = [
  {
    icon: MessageCircle,
    title: "Triagem pelo WhatsApp",
    description: "Você descreve o problema e confirmamos se ele é compatível com acesso remoto",
  },
  {
    icon: Zap,
    title: "Sem espera por deslocamento",
    description: "Casos compatíveis começam assim que a sessão é autorizada e agendada",
  },
  {
    icon: Download,
    title: "Sistema, programas e contas",
    description: "Configurações, atualizações, drivers, e-mail e programas legítimos ajustados",
  },
  {
    icon: MapPinOff,
    title: "Curitiba e região",
    description: "Atendimento remoto para residências, home office e empresas da região",
  },
];

const AtendimentoRemoto = () => {
  const cfg3u = blocos3U(PATH);
  const waHref = whatsappLink(WHATSAPP_MESSAGE);
  const toc = [
    ...(cfg3u?.tocExtra ?? []),
    { id: "sistemas-terceiros", label: "Sistemas de terceiros" },
    { id: "fatores-valor", label: "Valores e autorização" },
    { id: "faq", label: "Perguntas frequentes" },
  ];
  const handleHeroCta = () => trackCTAClick("whatsapp", "atendimento-remoto_hero");
  const handleMeioCta = () => trackCTAClick("whatsapp", "atendimento-remoto_meio");

  useEffect(() => {
    trackPageView(PATH, "Atendimento Remoto");
  }, []);

  useJsonLdSlot(
    SCHEMA_SLOTS.faq,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${absoluteUrl(PATH)}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    SLOT_PRIORITY.page,
  );

  return (
    <div className="min-h-screen bg-background">
      <LocalBusinessJsonLd
        scriptId="ld-localbusiness-remoto"
        path={PATH}
        name="Técnico em Curitiba — Suporte remoto"
        description="Suporte técnico remoto para sistemas, programas, configurações e orientações, atendendo Curitiba e região metropolitana."
        services={[
          { name: "Suporte remoto", url: "/atendimento-remoto" },
          { name: "Formatação e reinstalação de sistema", url: "/servicos/formatacao" },
          { name: "Remoção de vírus", url: "/servicos/remocao-de-virus" },
        ]}
      />
      <PageSEO
        title={TITLE}
        description={DESCRIPTION}
        path={PATH}
        breadcrumbs={[
          { name: "Início", path: "/" },
          { name: "Serviços", path: "/servicos" },
          { name: "Atendimento Remoto", path: PATH },
        ]}
      />
      <JsonLdSchema />
      <Header />
      <main>
        {/* Rodada 3U — hero de modalidade: eyebrow, H1, resumo curto e CTA
            dentro da primeira dobra em 360, 390 e 430 px. */}
        <section className="bg-[hsl(var(--hero-bg))] text-white">
          <div className="container mx-auto max-w-4xl px-4 py-7 md:py-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark md:text-sm">
              {cfg3u?.eyebrow ?? "Modalidade de atendimento"} · Curitiba e região
            </p>
            <h1 className="mb-3 text-[1.6rem] font-bold leading-tight md:mb-4 md:text-4xl">
              Suporte remoto de informática para residências e empresas
            </h1>
            <p className="mb-5 text-sm leading-relaxed opacity-95 md:text-base">
              Modalidade indicada quando o equipamento liga, o sistema carrega e há internet: configurações,
              sistema, programas, e-mail, impressora já conectada e orientação — com a sua autorização e o seu
              acompanhamento na tela.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleHeroCta}
              data-cta-location="atendimento-remoto_hero"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-7 text-base font-bold text-accent-foreground transition-transform hover:scale-[1.02] sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {cta3U(PATH)?.label ?? "Verificar se o atendimento remoto é adequado"}
            </a>
          </div>
        </section>

        <TrustStrip variant="compact" />

        <section className="bg-background py-8">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Resumo da modalidade
                </p>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {(cfg3u?.resumo ?? []).map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </dt>
                      <dd className="text-sm font-medium text-foreground">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <PageTableOfContents items={toc} />
            </div>
          </div>
        </section>

        <Blocos3U path={PATH} />

        {cta3U(PATH) && (
          <InlineTriageCTA
            href={waHref}
            titulo={cta3U(PATH).titulo}
            texto={cta3U(PATH).texto}
            label={cta3U(PATH).label}
            location="atendimento-remoto_meio"
            onClick={handleMeioCta}
          />
        )}

        <BenefitsGrid
          benefits={benefits}
          title="Por que escolher o atendimento remoto"
          subtitle="Solução prática para problemas de software, configuração e orientação"
        />

        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="mb-4 text-2xl md:text-3xl font-bold text-foreground">O que é atendimento remoto</h2>
              <p className="mb-3 text-muted-foreground leading-relaxed">
                Atendimento remoto é o suporte técnico executado à distância, com um programa de acesso que permite ao
                técnico operar o seu computador enquanto você acompanha tudo na tela. É a modalidade indicada quando o
                equipamento liga, o sistema carrega e existe conexão de internet estável — ou seja, quando o problema
                está no software, na configuração ou no uso, e não em uma peça.
              </p>
              <p className="mb-3 text-muted-foreground leading-relaxed">
                A vantagem é objetiva: sem deslocamento, o atendimento pode ser combinado para o horário que funciona
                para você e costuma resolver em uma única sessão o que exigiria uma visita inteira. Para quem trabalha
                em casa, isso significa voltar a produzir sem perder o dia esperando alguém chegar.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A limitação também é objetiva e é dita antes: nenhum acesso remoto conserta hardware. Se durante a
                triagem ficar claro que a causa é física, indicamos{" "}
                <Link to="/atendimento-domicilio" className="font-semibold text-accent hover:underline">
                  atendimento em domicílio
                </Link>{" "}
                ou{" "}
                <Link to="/coleta-e-entrega" className="font-semibold text-accent hover:underline">
                  coleta e entrega
                </Link>{" "}
                em vez de iniciar uma sessão que não resolveria o caso.
              </p>
            </div>
          </div>
        </section>

        <section id="sistemas-terceiros" className="scroll-mt-24 py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="mb-4 flex items-center gap-2 text-2xl md:text-3xl font-bold text-foreground">
                <Lock className="h-6 w-6 text-accent" /> Sistemas de terceiros e limites da sessão
              </h2>
              <p className="mb-3 text-muted-foreground leading-relaxed">
                Durante a sessão podemos verificar o computador, o acesso local, a configuração, as permissões
                disponíveis e a mensagem de erro exibida na tela. Já erro interno da plataforma, licença, conta,
                autenticação e disponibilidade do servidor dependem do fornecedor do sistema — nesse caso, o registro
                do que foi verificado é entregue para você acionar quem mantém a aplicação.
              </p>
              <p className="text-sm text-muted-foreground">
                As práticas completas de tratamento de arquivos, credenciais e cópias temporárias estão descritas em{" "}
                <Link to="/seguranca-dos-dados" className="font-semibold text-accent hover:underline">
                  segurança dos dados
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto grid gap-5 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-2 text-lg font-bold text-foreground">Atendimento residencial</h2>
                <p className="text-sm text-muted-foreground">
                  Computador da família com sistema travando, programas para instalar, e-mail desconfigurado ou dúvida
                  de uso: resolvido em sessão acompanhada, sem ninguém precisar sair de casa.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-2 text-lg font-bold text-foreground">Atendimento empresarial</h2>
                <p className="text-sm text-muted-foreground">
                  Usuários com problema pontual de sistema, e-mail ou programa. Demandas de estrutura, servidores e
                  padronização seguem no{" "}
                  <Link to="/servicos/suporte-tecnico-empresarial" className="font-semibold text-accent hover:underline">
                    suporte técnico empresarial
                  </Link>
                  .
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-2 text-lg font-bold text-foreground">Home office</h2>
                <p className="text-sm text-muted-foreground">
                  Câmera, microfone, reuniões, e-mail e arquivos de trabalho. O contexto completo está em{" "}
                  <Link to="/servicos/suporte-home-office" className="font-semibold text-accent hover:underline">
                    suporte para home office
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="fatores-valor" className="scroll-mt-24 py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="mb-5 text-2xl md:text-3xl font-bold text-foreground">
                Fatores que influenciam o valor do atendimento
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {fatoresValor.map((f) => (
                  <div key={f.titulo} className="rounded-xl bg-background p-5">
                    <h3 className="mb-1 font-semibold text-foreground">{f.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                As condições comerciais vigentes estão publicadas em{" "}
                <Link to="/precos-e-politicas" className="font-semibold text-accent hover:underline">
                  preços e políticas
                </Link>{" "}
                e o valor é apresentado antes da sessão começar. Veja também{" "}
                <Link to="/como-funciona" className="font-semibold text-accent hover:underline">
                  como funciona o atendimento
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <h2 className="mb-5 text-center text-xl md:text-2xl font-bold text-foreground">
              Serviços e modalidades relacionadas
            </h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {[
                { label: "Suporte para home office", to: "/servicos/suporte-home-office" },
                { label: "Suporte empresarial", to: "/servicos/suporte-tecnico-empresarial" },
                { label: "Segurança dos dados", to: "/seguranca-dos-dados" },
                { label: "Como funciona", to: "/como-funciona" },
                { label: "Preços e políticas", to: "/precos-e-politicas" },
                { label: "Remoção de vírus", to: "/servicos/remocao-de-virus" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {l.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Perguntas frequentes sobre suporte remoto
              </h2>
              <div className="space-y-4">
                {faqs.map((f) => (
                  <div key={f.question} className="rounded-xl border border-border bg-background p-5">
                    <h3 className="flex items-start gap-2 font-bold text-foreground mb-2">
                      <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                      {f.question}
                    </h3>
                    <p className="pl-7 text-muted-foreground leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TrustSection />
        <CTASection />
        <PoliticaAtendimentoBlock variant="default" />
      </main>
      <RealImageSection imageKey="suporteRemoto" caption="Suporte técnico remoto profissional" />
      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default AtendimentoRemoto;
