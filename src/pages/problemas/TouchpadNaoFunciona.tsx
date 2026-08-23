import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, MousePointer2, MessageCircle } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import ProximosProblemas from "@/components/problemas/ProximosProblemas";

const PATH = "/problemas/touchpad-nao-funciona";
const TITLE = "Touchpad Não Funciona no Notebook | Curitiba";
const DESCRIPTION =
  "Touchpad do notebook parou de responder, funciona pela metade ou só o clique falhou? Veja como separar atalho desativado, driver, cabo flat solto e falha física antes de orçar, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre touchpad que não funciona. O touchpad do meu notebook parou de responder e quero avaliação.";

const SINTOMAS = [
  {
    titulo: "Parou totalmente, sem reação a nenhum toque",
    desc: "Ausência completa de resposta é, na maior parte das vezes, touchpad desativado por atalho de teclado ou driver removido em uma atualização — não peça queimada.",
  },
  {
    titulo: "Cursor move, mas o clique não funciona",
    desc: "Movimento preservado com clique morto indica microswitch desgastado ou configuração de toque desativada, dois cenários com custos bem diferentes.",
  },
  {
    titulo: "Funciona apenas em parte da superfície",
    desc: "Área morta localizada aponta para trilha rompida na própria placa do touchpad, geralmente após impacto, pressão no gabinete ou entrada de líquido.",
  },
  {
    titulo: "Cursor pula ou clica sozinho",
    desc: "Movimento errático costuma ser resíduo na superfície, umidade sob a peça ou cabo flat mal encaixado gerando leitura instável.",
  },
  {
    titulo: "Parou depois de uma atualização do Windows",
    desc: "Atualização que substitui o driver específico do fabricante por um driver genérico é uma das causas mais frequentes e se resolve em software.",
  },
  {
    titulo: "Parou depois de derramar líquido",
    desc: "Nesse caso o touchpad é sintoma, não a causa. A prioridade passa a ser a placa: líquido em contato com trilhas provoca corrosão progressiva.",
  },
];

const CAUSAS = [
  "Touchpad desativado por atalho de teclado (tecla de função com ícone de touchpad)",
  "Driver do fabricante substituído por driver genérico após atualização do sistema",
  "Toque para clicar desativado nas configurações do sistema",
  "Cabo flat solto ou mal encaixado após queda, abertura ou transporte",
  "Microswitch de clique desgastado por uso intenso",
  "Trilha rompida na placa do touchpad após impacto ou pressão no gabinete",
  "Oxidação por líquido derramado sobre a área do apoio de mãos",
  "Conflito com mouse externo configurado para desativar o touchpad",
];

const VERIFICACOES = [
  "Procure a tecla de função com o ícone de touchpad e pressione junto com a tecla Fn: esse atalho resolve boa parte dos casos em segundos.",
  "Desconecte qualquer mouse externo e reinicie: alguns notebooks desativam o touchpad automaticamente quando detectam um mouse.",
  "Abra as configurações de mouse e touchpad do sistema e confirme se o dispositivo está habilitado e com o toque para clicar ativo.",
  "Reinstale o driver oficial do touchpad pelo site do fabricante do notebook, não pela busca automática do Windows.",
  "Limpe a superfície com pano levemente umedecido e seco em seguida; gordura e resíduo alteram a leitura capacitiva.",
  "Teste um mouse USB: se ele funciona normalmente, o sistema está bem e o problema está isolado no touchpad.",
  "Se o notebook sofreu queda ou pancada recente, informe isso: cabo flat solto é a hipótese principal nesse contexto.",
  "Se houve contato com líquido, não continue usando: a corrosão avança enquanto o aparelho fica energizado.",
];

const OPCOES = [
  {
    titulo: "Correção por software e reinstalação de driver",
    desc: "Atalho, configuração e driver oficial cobrem a maior parte dos chamados e podem ser resolvidos por acesso remoto, sem retirar o notebook do endereço.",
    to: "/atendimento-remoto",
    label: "Atendimento remoto",
  },
  {
    titulo: "Reencaixe do cabo flat em bancada",
    desc: "Quando o touchpad sumiu depois de queda, abertura ou transporte, a abertura controlada e o reencaixe do flat resolvem sem troca de peça.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Troca do módulo do touchpad",
    desc: "Área morta e clique arrebentado exigem substituição do módulo. Confirmamos disponibilidade da peça para o modelo antes de indicar o serviço.",
    to: "/servicos/upgrade-ssd-ram",
    label: "Peças e upgrades",
  },
  {
    titulo: "Limpeza de placa após contato com líquido",
    desc: "Se houve derramamento, o touchpad é o aviso e a placa é o paciente. O procedimento é limpeza técnica com inspeção de trilhas, descrito na página de notebook molhado.",
    to: "/problemas/notebook-molhado",
    label: "Notebook molhado",
  },
];

const FAQS = [
  {
    question: "O touchpad parou do nada. É defeito de fábrica?",
    answer:
      "Raramente. Parar de uma hora para outra, sem queda e sem líquido, costuma ser o atalho de teclado que desativa o touchpad ou o driver substituído em uma atualização do sistema. Antes de qualquer orçamento vale testar o atalho de função e reinstalar o driver oficial do fabricante — são dois passos gratuitos que resolvem a maior parte dos casos.",
  },
  {
    question: "O cursor anda mas o clique não funciona. Precisa trocar a peça?",
    answer:
      "Nem sempre. Existem duas causas comuns: o recurso de tocar para clicar desativado nas configurações, que é ajuste de software, e o microswitch físico desgastado, que exige troca do módulo. A diferença é simples de verificar: se o clique por toque leve funciona e só o clique com pressão falhou, o desgaste é mecânico.",
  },
  {
    question: "Uma parte do touchpad não responde. Tem conserto?",
    answer:
      "Área morta localizada quase sempre significa trilha rompida dentro da própria placa do touchpad, e trilha rompida nessa peça não se recupera de forma confiável. O caminho é a substituição do módulo, condicionada à disponibilidade da peça para o modelo. Quando não há peça compatível, informamos e não improvisamos com módulo de outro modelo.",
  },
  {
    question: "Parou depois de atualizar o Windows. Como resolver?",
    answer:
      "Esse é o cenário mais fácil. A atualização costuma trocar o driver específico do fabricante por um driver genérico que não reconhece os gestos nem o clique. Reinstalar o driver oficial do modelo, baixado no site do fabricante, devolve o funcionamento. É um atendimento que fazemos remotamente, sem retirar o aparelho.",
  },
  {
    question: "Posso usar mouse externo e deixar como está?",
    answer:
      "Pode, e para muita gente é uma solução aceitável. Só existe uma ressalva importante: se o touchpad parou após contato com líquido, deixar como está é arriscado, porque a corrosão continua avançando dentro do aparelho e pode alcançar a placa principal. Nesse caso a avaliação não é opcional.",
  },
  {
    question: "O teclado também parou junto. Muda alguma coisa?",
    answer:
      "Muda bastante. Teclado e touchpad falhando ao mesmo tempo apontam para o controlador na placa ou para líquido que atingiu os dois conectores, e não para duas peças que quebraram por coincidência. Esse cenário está detalhado na página sobre teclado de notebook que não funciona e exige avaliação em bancada.",
  },
  {
    question: "Preciso levar o notebook até vocês?",
    answer:
      "Não temos balcão de atendimento ao público. Casos de driver e configuração são resolvidos por acesso remoto. Quando é preciso abrir o aparelho para reencaixar o cabo flat ou trocar o módulo, retiramos no endereço informado e devolvemos no mesmo endereço, com 90 dias de garantia sobre mão de obra e peça aplicada.",
  },
];

const TouchpadNaoFunciona = () => {
  const waHref = whatsappLink(WA_MESSAGE);

  useEffect(() => {
    trackPageView(PATH, TITLE);
  }, []);

  useJsonLdSlot(
    SCHEMA_SLOTS.webPage,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl(PATH)}#webpage`,
      name: "Touchpad não funciona: atalho, driver, cabo flat ou falha física",
      description: DESCRIPTION,
      url: absoluteUrl(PATH),
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      publisher: { "@id": `${absoluteUrl("/")}#organization` },
    },
    SLOT_PRIORITY.page,
  );

  useJsonLdSlot(
    SCHEMA_SLOTS.faq,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${absoluteUrl(PATH)}#faq`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    SLOT_PRIORITY.page,
  );

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-touchpad-nao-funciona-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Touchpad não funciona" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Touchpad não funciona: atalho desativado, driver, cabo flat ou falha física
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Boa parte dos touchpads que "queimaram" está apenas desativada. Esta página mostra a sequência que separa
            software de peça antes de qualquer orçamento.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="problema_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </div>
      </section>

      <TrustStrip />

      <RealImageSection
        imageKey="notebookReparo"
        secondaryImageKey="ferramentas"
        layout="duo"
        caption="Notebook aberto em bancada para inspeção do cabo flat e do módulo do touchpad"
        secondaryCaption="Ferramental usado na abertura controlada, sem marcar o gabinete nem forçar as travas"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "como-falha", label: "Como o touchpad falha" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="como-falha" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">O touchpad falha em três camadas</h2>
          <p className="mb-3 text-muted-foreground">
            Configuração, driver e hardware. A camada de configuração é a mais comum e a mais barata: um atalho de
            teclado pressionado sem querer desativa a peça inteira. A camada de driver aparece depois de atualizações
            do sistema. Só a terceira camada envolve abrir o aparelho.
          </p>
          <p className="mb-3 text-muted-foreground">
            Testar um mouse USB divide o problema ao meio em segundos: se o mouse funciona normalmente, o sistema está
            saudável e a investigação fica restrita ao touchpad. Se nem o mouse responde, o caso é outro e envolve o
            sistema ou as portas.
          </p>
          <p className="text-muted-foreground">
            Quando teclado e touchpad param juntos, veja{" "}
            <Link to="/problemas/teclado-de-notebook-nao-funciona" className="font-medium text-accent hover:underline">
              teclado de notebook não funciona
            </Link>
            . Se houve derramamento de líquido, comece por{" "}
            <Link to="/problemas/notebook-molhado" className="font-medium text-accent hover:underline">
              notebook molhado
            </Link>
            .
          </p>
        </section>

        <section id="sintomas" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Sintomas e o que cada um costuma indicar</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SINTOMAS.map((s) => (
              <div key={s.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{s.titulo}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="causas" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Causas mais comuns nos casos que recebemos</h2>
          <p className="mb-4 text-muted-foreground">
            Atalho desativado e driver substituído lideram com folga. Cabo flat solto aparece logo depois, quase sempre
            em aparelhos que sofreram queda ou foram abertos recentemente.
          </p>
          <ul className="grid gap-2 md:grid-cols-2">
            {CAUSAS.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <MousePointer2 className="h-6 w-6 text-accent" /> Testes gratuitos antes de qualquer orçamento
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os quatro primeiros itens resolvem a maior parte dos chamados sem nenhum custo e sem abrir o
            aparelho.
          </p>
          <ol className="space-y-2">
            {VERIFICACOES.map((t, i) => (
              <li key={t} className="flex gap-3 text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            O que não recomendamos: abrir o notebook com espátula improvisada, aplicar produto de limpeza diretamente
            sobre a superfície e insistir no uso depois de contato com líquido.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">O que resolve cada cenário</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {OPCOES.map((o) => (
              <div key={o.titulo} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{o.titulo}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{o.desc}</p>
                <Link to={o.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                  {o.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-accent/30 bg-accent/5 p-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Critérios objetivos antes de você decidir</h2>
          <p className="mb-5 text-muted-foreground">
            As condições completas de atendimento estão em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Software primeiro</h3>
              <p className="text-sm text-muted-foreground">
                Só indicamos abertura do aparelho depois de esgotar atalho, configuração e driver oficial. Abrir sem
                necessidade cria risco de trava quebrada sem resolver nada.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Peça compatível ou nada</h3>
              <p className="text-sm text-muted-foreground">
                Módulo de touchpad é específico por modelo. Sem peça compatível disponível, informamos e devolvemos o
                aparelho em vez de adaptar componente de outro modelo.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e garantia</h3>
              <p className="text-sm text-muted-foreground">
                Sem balcão: retirada e devolução no endereço informado. Garantia de 90 dias sobre mão de obra e peça
                aplicada, limitada ao serviço executado.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: recuperar touchpad com trilha rompida, garantir peça para modelo fora de linha e
            prazo fixo antes de conhecer o equipamento.
          </p>
        </section>

        <section id="faq" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Perguntas frequentes</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{f.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Conte o que aconteceu antes de o touchpad parar</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo e se houve queda, líquido ou atualização recente. Com isso já dizemos se o caso é remoto
            ou de bancada.
          </p>
          <Button asChild size="lg" variant="secondary" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar sobre meu caso
            </a>
          </Button>
        </section>
        <ProximosProblemas path={PATH} />
      </main>

      <Footer />
    </div>
  );
};

export default TouchpadNaoFunciona;
