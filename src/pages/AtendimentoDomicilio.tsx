import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageSEO } from "@/components/PageSEO";
import { PoliticaAtendimentoBlock } from "@/components/PoliticaAtendimentoBlock";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { TrustSection } from "@/components/TrustSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { PilarEditorialLinks } from "@/components/editorial/PilarEditorialLinks";
import { InterlinkingBlock } from "@/components/InterlinkingBlock";
import { BlocoInteligencia } from "@/components/BlocoInteligencia";
import { RealImageSection } from "@/components/RealImageSection";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { EeatProofsSection } from "@/components/EeatProofsSection";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import { siteConfig, absoluteUrl } from "@/lib/siteConfig";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, Clock, Shield, Home, User, Briefcase, CheckCircle, Truck, AlertTriangle, ArrowRight, Camera } from "lucide-react";

const WHATSAPP_NUMBER = "5541997086380";
const WHATSAPP_MESSAGE = "Preciso verificar a possibilidade de atendimento técnico em domicílio.";

const benefits = [
  {
    icon: MapPin,
    title: "Atendimento em Toda Curitiba",
    description: "Vamos até você em qualquer bairro de Curitiba e região metropolitana. Técnico perto de você, sempre disponível.",
  },
  {
    icon: Clock,
    title: "Horário Flexível",
    description: "Agendamos conforme sua disponibilidade, inclusive aos sábados. Você não precisa perder um dia de trabalho.",
  },
  {
    icon: Shield,
    title: "Técnico Identificado",
    description: "Nosso profissional chega identificado, com crachá e uniforme. Segurança e confiança para você e sua família.",
  },
  {
    icon: Home,
    title: "Sem Deslocamento",
    description: "Você não precisa carregar seu computador. Resolvemos tudo no conforto da sua casa ou escritório.",
  },
];

const publicoAlvo = [
  {
    icon: Home,
    title: "Residências",
    description: "Famílias que precisam de suporte técnico sem complicação. Resolvemos problemas de vírus, lentidão, formatação e muito mais.",
  },
  {
    icon: User,
    title: "Profissionais Liberais",
    description: "Advogados, médicos, contadores e outros profissionais que dependem do computador para trabalhar e não podem ficar parados.",
  },
  {
    icon: Briefcase,
    title: "Home Office",
    description: "Quem trabalha de casa precisa de equipamento funcionando 100%. Configuramos VPN, rede, impressora e todo seu ambiente de trabalho.",
  },
];

const noLocal = [
  "Equipamento que não liga ou desliga sozinho",
  "Placa-mãe com micro-solda ou dano por líquido",
  "Troca de tela de notebook",
  "Recuperação de dados de HD/SSD danificado",
  "Diagnóstico complexo que exige bancada e tempo estendido",
];

/** Serviços que costumam ser resolvidos na casa/escritório, com o limite real de cada um. */
const SERVICOS_NO_ENDERECO = [
  {
    titulo: "Computador lento, travando ou cheio de pop-up",
    desc: "Limpeza de sistema, remoção de vírus e programas indesejados, ajuste de inicialização e atualização do Windows.",
    limite: "Se houver suspeita de disco ou memória com defeito, o teste segue para bancada.",
  },
  {
    titulo: "Wi-Fi fraco, oscilando ou sem sinal em parte do imóvel",
    desc: "Avaliação do posicionamento do roteador, canais, configuração de rede e repetidor já existente.",
    limite: "Passagem de cabo, obra e ponto de rede novo dependem de avaliação separada.",
  },
  {
    titulo: "Impressora não imprime ou some da rede",
    desc: "Reinstalação de driver, compartilhamento, fila travada e configuração em mais de um computador.",
    limite: "Defeito mecânico ou de cabeça de impressão exige assistência da marca.",
  },
  {
    titulo: "Backup, migração e organização de arquivos",
    desc: "Configuração de backup em nuvem ou HD externo e transferência de arquivos entre equipamentos.",
    limite: "Recuperação de dados de disco danificado é feita em laboratório.",
  },
  {
    titulo: "Configuração de computador novo",
    desc: "Instalação de programas de trabalho, contas, e-mail, impressora e transferência do que estava na máquina antiga.",
    limite: "Montagem e upgrade de hardware podem exigir bancada.",
  },
  {
    titulo: "Monitor, periféricos e posto de trabalho",
    desc: "Segundo monitor, dock, teclado, mouse, headset e organização do posto de home office já existente.",
    limite: "Reparo interno de monitor ou de periférico com defeito físico não é feito no local.",
  },

];

const faqs = [
  {
    question: "Quais serviços podem ser feitos no local?",
    answer:
      "Instalação e configuração de programas, ajustes de rede e Wi-Fi, remoção de vírus, backup, configuração de impressora e a maioria dos problemas de software costumam ser resolvidos na sua casa ou escritório. A confirmação depende da triagem prévia.",
  },
  {
    question: "Quando o equipamento precisa ser coletado?",
    answer:
      "Casos que exigem bancada — como equipamento que não liga, reparo de placa, troca de tela ou recuperação de dados — normalmente não são resolvidos no local e seguem para coleta e entrega, com diagnóstico em laboratório.",
  },
  {
    question: "O atendimento em domicílio garante a resolução na hora?",
    answer:
      "Nem sempre. O atendimento no local resolve boa parte dos casos de software, mas alguns problemas só são confirmados durante a avaliação e podem exigir peças, coleta ou tempo adicional.",
  },
  {
    question: "Como funciona a triagem antes da visita?",
    answer:
      "Antes de agendar, conversamos pelo WhatsApp sobre o sintoma. Enviar informações e fotos do equipamento ajuda a avaliar se o caso é adequado para atendimento no local ou se será melhor por coleta.",
  },
  {
    question: "As peças estão incluídas na visita?",
    answer:
      "Não automaticamente. A visita cobre a mão de obra e a avaliação; peças e materiais, quando necessários, são informados à parte e só trocados após a sua aprovação.",
  },
  {
    question: "Preciso desmontar ou preparar alguma coisa antes da visita?",
    answer:
      "Não. Basta deixar o equipamento acessível e ligado à energia, com a senha de acesso à mão. Se o problema for de rede ou Wi-Fi, ter o acesso ao roteador (ou o contato da operadora) agiliza bastante o atendimento no local.",
  },
  {
    question: "Vocês atendem em apartamento, condomínio e escritório?",
    answer:
      "Sim. Em condomínios e prédios comerciais com controle de acesso, o agendamento é combinado com antecedência para você liberar a entrada na portaria. Informe pelo WhatsApp se houver regra específica do prédio.",
  },
  {
    question: "O que acontece se o problema não for resolvido no local?",
    answer:
      "A avaliação feita na visita é aproveitada: você recebe o diagnóstico do que foi encontrado e a orientação do próximo passo — coleta para bancada, valor do atendimento de peça ou indicação de substituição quando o reparo não compensa. Nada segue sem a sua aprovação.",
  },
  {
    question: "Qual a área de atendimento?",
    answer:
      "Atendemos Curitiba e a Região Metropolitana. A localização pode influenciar o agendamento e o deslocamento, combinados antes da visita.",
  },
  {
    question: "É necessário levar o equipamento até vocês?",
    answer:
      "Na modalidade em domicílio, não: o atendimento acontece no seu endereço. O equipamento só sai do local quando a avaliação indica bancada, e nesse caso a coleta é combinada com você antes.",
  },
  {
    question: "Posso solicitar atendimento para vários computadores?",
    answer:
      "Sim. Informe na triagem a quantidade de equipamentos e o sintoma de cada um. Isso influencia o tempo previsto da visita e o escopo do atendimento, que é combinado antes do agendamento.",
  },
  {
    question: "É necessário ter alguém no local durante o atendimento?",
    answer:
      "Sim. É preciso uma pessoa responsável presente para liberar o acesso, autorizar os procedimentos e conferir o resultado ao final. Em empresas, quem autoriza alterações deve estar disponível ao menos por contato.",
  },
  {
    question: "O técnico precisa acessar meus arquivos?",
    answer:
      "Somente quando o serviço exige, como em backup, migração ou formatação. O acesso é limitado ao necessário e sempre com a sua autorização. As práticas completas estão descritas na página de segurança dos dados.",
  },
  {
    question: "Como funciona o cancelamento da visita?",
    answer:
      "Avise pelo WhatsApp com a maior antecedência possível para reagendar sem transtorno. Cancelamento após o técnico já estar em deslocamento pode implicar cobrança do deslocamento, conforme as condições publicadas em preços e políticas.",
  },
  {
    question: "O valor pode mudar após a avaliação no local?",
    answer:
      "O valor da visita e da avaliação é informado antes. Se a avaliação revelar um serviço maior, peça necessária ou necessidade de bancada, o novo escopo é apresentado e só é executado após a sua aprovação.",
  },
];



const AtendimentoDomicilio = () => {
  useEffect(() => {
    trackPageView("/atendimento-domicilio", "Atendimento Domicílio");
  }, []);

  useJsonLdSlot(
    SCHEMA_SLOTS.faq,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${absoluteUrl("/atendimento-domicilio")}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    SLOT_PRIORITY.page,
  );


  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  const handleCTAClick = () => {
    trackCTAClick("whatsapp", "domicilio-cta");
  };

  return (
    <div className="min-h-screen bg-background">
      <LocalBusinessJsonLd
        scriptId="ld-localbusiness-domicilio"
        path="/atendimento-domicilio"
        name="Técnico em Curitiba — Atendimento em domicílio"
        description="Atendimento técnico de informática em domicílio em Curitiba e região metropolitana, com diagnóstico no local antes de informar o valor."
        services={[
          { name: "Atendimento técnico em domicílio", url: "/atendimento-domicilio" },
          { name: "Manutenção de computador", url: "/servicos/manutencao-de-computador" },
          { name: "Redes e Wi-Fi", url: "/servicos/redes-e-wifi" },
        ]}
      />
      <PageSEO title="Técnico de Informática em Domicílio em Curitiba | Atendimento" description="Atendimento técnico de informática em domicílio em Curitiba para computadores, redes e situações que possam ser avaliadas no local." path="/atendimento-domicilio" breadcrumbs={[{ name: "Início", path: "/" }, { name: "Serviços", path: "/servicos" }, { name: "Atendimento a Domicílio", path: "/atendimento-domicilio" }]} />
      <JsonLdSchema />
      <Header />
      <main>
        <PageHero
          title="Atendimento técnico de informática em domicílio em Curitiba"
          subtitle="Atendimento na sua casa ou escritório para o que pode ser avaliado no local — com triagem prévia pelo WhatsApp para indicar a melhor modalidade."
          ctaText="Verificar atendimento em domicílio"
          whatsappMessage={WHATSAPP_MESSAGE}
        />

        <BenefitsGrid
          benefits={benefits}
          title="Vantagens do Atendimento em Domicílio"
          subtitle="Por que escolher o técnico que vai até você?"
        />

        {/* Limitações e triagem */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
                Quando o atendimento no local é indicado?
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                A visita é ideal para problemas de software, rede e configurações que possam ser
                avaliados no seu endereço. Casos que exigem bancada ou ambiente controlado são
                melhor resolvidos por coleta.
              </p>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 mb-6">
                <h3 className="flex items-center gap-2 font-bold text-foreground mb-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  O que normalmente exige coleta ou bancada
                </h3>
                <ul className="space-y-2">
                  {noLocal.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-secondary p-5">
                <h3 className="flex items-center gap-2 font-bold text-foreground mb-2">
                  <Camera className="h-5 w-5 text-accent" />
                  Triagem antes de agendar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Antes de marcar a visita, conversamos pelo WhatsApp sobre o sintoma. Enviar
                  informações e fotos do equipamento ajuda a avaliar a modalidade certa. O
                  atendimento em domicílio não garante resolução imediata, e peças e materiais
                  não estão automaticamente incluídos — quando necessários, são informados à parte.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Como Funciona */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Como Funciona o Atendimento em Domicílio?
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4 items-start bg-background rounded-xl p-5">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Entre em Contato pelo WhatsApp</h3>
                    <p className="text-muted-foreground">
                      Descreva o problema do seu computador e informe seu endereço em Curitiba. Respondemos rapidamente com disponibilidade e valor estimado.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-background rounded-xl p-5">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Agendamos a Visita</h3>
                    <p className="text-muted-foreground">
                      Escolha o melhor dia e horário para você. Nosso técnico chegará pontualmente, identificado e com todas as ferramentas necessárias.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start bg-background rounded-xl p-5">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Resolvemos na Hora</h3>
                    <p className="text-muted-foreground">
                      A maioria dos problemas é resolvida em uma única visita. Se precisar de peças ou serviço mais complexo, informamos antes de continuar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button variant="whatsapp" size="lg" asChild>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCTAClick}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Agendar Visita Agora
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Público Alvo */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Para Quem é o Atendimento em Domicílio?
              </h2>
              <p className="text-muted-foreground text-lg">
                Ideal para quem precisa de comodidade e não quer carregar equipamentos
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {publicoAlvo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-secondary rounded-xl p-6 text-center hover:shadow-lg transition-all"
                  >
                    <div className="bg-primary rounded-full p-4 w-fit mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Serviços em Domicílio */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                O Que Podemos Resolver na Sua Casa?
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Formatação de computador e notebook",
                  "Remoção de vírus e malwares",
                  "Computador lento ou travando",
                  "Problemas de inicialização",
                  "Upgrade de memória e SSD",
                  "Configuração de rede e Wi-Fi",
                  "Instalação de programas",
                  "Backup e recuperação de dados",
                  "Configuração de impressora",
                  "Suporte para home office",
                  "Limpeza interna e troca de pasta térmica",
                  "Diagnóstico de hardware",
                ].map((servico, index) => (
                  <div key={index} className="flex items-center gap-3 bg-background rounded-lg p-4">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{servico}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Preparação, peças e fatores de valor */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-2xl md:text-3xl font-bold text-foreground">
                Preparação antes da visita, peças e o que influencia o valor
              </h2>
              <p className="mb-6 text-muted-foreground">
                Uma visita bem preparada rende muito mais. Deixe o equipamento acessível e ligado à energia, tenha a
                senha do computador à mão, garanta a presença de uma pessoa responsável no local e, em condomínio ou
                prédio comercial, avise a portaria com antecedência. Se o caso envolve rede, o acesso ao roteador — ou
                o contato da operadora — evita que o atendimento pare no meio.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-background p-5">
                  <h3 className="mb-2 font-semibold text-foreground">Acesso ao equipamento e autorização</h3>
                  <p className="text-sm text-muted-foreground">
                    Nada é executado sem a sua aprovação. Procedimentos que alteram o conteúdo do equipamento, como
                    formatação ou troca de armazenamento, são explicados antes, com o risco envolvido. O tratamento de
                    arquivos e credenciais está detalhado em{" "}
                    <Link to="/seguranca-dos-dados" className="font-semibold text-accent hover:underline">
                      segurança dos dados
                    </Link>
                    .
                  </p>
                </div>
                <div className="rounded-xl bg-background p-5">
                  <h3 className="mb-2 font-semibold text-foreground">Peças e materiais</h3>
                  <p className="text-sm text-muted-foreground">
                    A visita cobre deslocamento, avaliação e mão de obra. Peças, cabos e materiais não estão incluídos
                    automaticamente: quando necessários, são informados à parte e só adquiridos ou trocados após a sua
                    autorização. Peça indisponível no momento pode exigir retorno agendado.
                  </p>
                </div>
                <div className="rounded-xl bg-background p-5">
                  <h3 className="mb-2 font-semibold text-foreground">Fatores que influenciam o valor</h3>
                  <p className="text-sm text-muted-foreground">
                    Complexidade do problema confirmado, quantidade de equipamentos, tempo previsto no local,
                    necessidade de peça, localização e eventual retorno. As condições comerciais vigentes estão em{" "}
                    <Link to="/precos-e-politicas" className="font-semibold text-accent hover:underline">
                      preços e políticas
                    </Link>
                    .
                  </p>
                </div>
                <div className="rounded-xl bg-background p-5">
                  <h3 className="mb-2 font-semibold text-foreground">Área atendida</h3>
                  <p className="text-sm text-muted-foreground">
                    Curitiba e Região Metropolitana. A distância influencia o agendamento e o deslocamento, ambos
                    combinados antes da visita. Veja também quais aparelhos entram no escopo em{" "}
                    <Link to="/equipamentos-atendidos" className="font-semibold text-accent hover:underline">
                      equipamentos atendidos
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços relacionados */}
        <section className="py-8 md:py-10 bg-background">
          <div className="container mx-auto">
            <h2 className="mb-5 text-center text-xl md:text-2xl font-bold text-foreground">
              Serviços e modalidades relacionadas
            </h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {[
                { label: "Equipamentos atendidos", to: "/equipamentos-atendidos" },
                { label: "Suporte para home office", to: "/servicos/suporte-home-office" },
                { label: "Como funciona", to: "/como-funciona" },
                { label: "Redes e Wi-Fi", to: "/servicos/redes-e-wifi" },
                { label: "Coleta e entrega", to: "/coleta-e-entrega" },
                { label: "Preços e políticas", to: "/precos-e-politicas" },
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

        {/* FAQ */}
        <section className="py-8 md:py-10 bg-secondary">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                Perguntas frequentes sobre atendimento em domicílio
              </h2>
              <div className="space-y-4">
                {faqs.map((f) => (
                  <div key={f.question} className="rounded-xl border border-border bg-background p-5">
                    <h3 className="flex items-start gap-2 font-bold text-foreground mb-2">
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

        {/* Serviços resolvidos no endereço — exclusivo desta modalidade */}
        <section className="py-10 md:py-14 bg-background" aria-labelledby="servicos-no-endereco">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <h2 id="servicos-no-endereco" className="text-2xl md:text-3xl font-bold text-foreground">
                O que costuma ser resolvido no seu endereço
              </h2>
              <p className="mt-2 max-w-3xl text-muted-foreground">
                Estes são os casos em que a visita técnica compensa: o problema é confirmado e tratado
                no local, sem tirar o equipamento de casa ou do escritório. Cada item abaixo passa por
                triagem no WhatsApp antes do agendamento.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {SERVICOS_NO_ENDERECO.map((item) => (
                  <article key={item.titulo} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground">{item.titulo}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Quando não dá no local:</span> {item.limite}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-6 text-center">
                <p className="text-foreground font-medium">
                  Não sabe se o seu caso resolve no local? Descreva o sintoma — a triagem indica
                  visita ou coleta antes de qualquer agendamento.
                </p>
                <div className="mt-4 flex justify-center">
                  <Button variant="whatsapp" size="lg" asChild onClick={() => trackCTAClick("whatsapp", "domicilio_servicos_endereco")}>
                    <a
                      href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                        "Olá! Quero saber se o meu caso resolve em atendimento no meu endereço.",
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta-location="domicilio_servicos_endereco"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Avaliar meu caso no WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EeatProofsSection
          titulo="Quem vai até o seu endereço"
          descricao="Atendimento no seu endereço exige confiança. Estes são os dados verificáveis da empresa e as regras que valem para toda visita técnica."
          className="bg-secondary/40"
        />

        <TrustSection />
        <CTASection />
        <PilarEditorialLinks pilar="/atendimento-domicilio" />
        <PoliticaAtendimentoBlock variant="domicilio" />
      </main>
      <RealImageSection imageKey="atendimentoDomiciliar" secondaryImageKey="tecnicoTrabalhando" layout="duo" caption="Atendimento técnico diretamente na sua casa" secondaryCaption="Diagnóstico profissional a domicílio" />
      <BlocoInteligencia />
      <InterlinkingBlock />
      <Footer />
    </div>
  );
};

export default AtendimentoDomicilio;
