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

const PATH = "/problemas/mouse-nao-funciona";
const TITLE = "Mouse Não Funciona: Como Resolver | Curitiba";
const DESCRIPTION =
  "Mouse não funciona, cursor travado ou clique falhando sozinho? Veja como separar porta USB, receptor sem fio, driver, bateria e falha do próprio mouse antes de comprar outro, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre mouse não funciona. Meu mouse parou de responder e preciso de avaliação técnica.";

const SINTOMAS = [
  {
    titulo: "O cursor não se move em nenhuma porta",
    desc: "Quando o mouse já foi testado em outra máquina e continua parado, o defeito é do próprio periférico.",
  },
  {
    titulo: "Funciona em uma porta e não em outra",
    desc: "Porta USB sem contato ou controladora com falha parcial. É a placa que precisa de avaliação, não o mouse.",
  },
  {
    titulo: "O clique dispara duas vezes sozinho",
    desc: "Micro switch desgastado, típico de mouse com muito uso. Não é vírus nem configuração do sistema.",
  },
  {
    titulo: "O cursor trava por segundos e volta",
    desc: "Aponta para interferência no receptor sem fio, pilha fraca ou superfície inadequada para o sensor.",
  },
  {
    titulo: "Some ao acordar do modo de suspensão",
    desc: "Economia de energia desligando a porta USB. É configuração do sistema e se resolve sem peça.",
  },
  {
    titulo: "Parou junto com o teclado",
    desc: "Dois periféricos caindo ao mesmo tempo mudam a suspeita para a controladora USB ou para o sistema.",
  },
];

const CAUSAS = [
  "Cabo USB rompido internamente, quase sempre perto do conector",
  "Micro switch do botão esquerdo desgastado, gerando clique duplo",
  "Pilha fraca ou bateria interna sem carga em mouse sem fio",
  "Receptor USB longe demais ou atrás do gabinete, com sinal bloqueado",
  "Interferência de outros dispositivos sem fio na mesma faixa",
  "Sensor óptico sujo ou usado sobre vidro e superfície muito brilhante",
  "Porta USB frontal do gabinete desconectada ou com contato ruim",
  "Economia de energia do sistema desligando a porta USB para poupar consumo",
];

const VERIFICACOES = [
  "Teste o mouse em outro computador: esse é o passo que decide entre defeito do periférico e problema da máquina.",
  "Troque de porta USB e prefira as traseiras, que ligam direto na placa-mãe.",
  "Em mouse sem fio, troque a pilha antes de qualquer conclusão: pilha fraca imita defeito grave.",
  "Aproxime o receptor com um cabo extensor ou use uma porta frontal, evitando o gabinete como barreira.",
  "Limpe o sensor com um pano seco e teste sobre uma superfície fosca, nunca sobre vidro.",
  "Reinicie o computador uma vez: travamento do serviço de entrada volta ao normal com reinício.",
  "Se o teclado também falhou, informe isso — muda a suspeita para a controladora USB.",
  "Não abra o mouse para 'ajustar' o switch sem experiência: as molas soltam e a peça se perde.",
];

const OPCOES = [
  {
    titulo: "Ajuste de sistema e drivers",
    desc: "Quando a porta funciona mas o sistema desliga o dispositivo, a correção é de configuração de energia e driver, sem retirar o equipamento.",
    to: "/atendimento-remoto",
    label: "Atendimento remoto",
  },
  {
    titulo: "Reparo da porta USB",
    desc: "Porta frontal solta, conector torto ou controladora com falha parcial são serviços de bancada, com teste em todas as portas depois do reparo.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Revisão geral do computador",
    desc: "Quando periféricos caem junto com lentidão e travamento, a avaliação completa evita trocar peça por peça sem critério.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Quando o problema é o touchpad",
    desc: "Em notebook, a falha do apontador integrado tem outro roteiro de verificação e outras causas prováveis.",
    to: "/problemas/touchpad-nao-funciona",
    label: "Touchpad não funciona",
  },
];

const FAQS = [
  {
    question: "Meu mouse parou de funcionar de repente. Preciso comprar outro?",
    answer:
      "Ainda não. O teste que resolve a dúvida leva um minuto: ligue o mouse em outro computador. Se funcionar lá, o periférico está bom e o problema é da porta USB ou do sistema da sua máquina. Comprar mouse novo nesse cenário só repete a falha.",
  },
  {
    question: "O clique está dando dois cliques sozinho. Tem conserto?",
    answer:
      "Esse comportamento é desgaste do micro switch do botão, e existe troca da peça em mouses de melhor qualidade. Em mouse de entrada, o custo do serviço costuma passar do valor de um aparelho novo, e dizemos isso quando é o caso, em vez de empurrar reparo.",
  },
  {
    question: "Mouse sem fio travando é defeito ou é a pilha?",
    answer:
      "Pilha fraca é a causa mais comum e imita defeito grave: o cursor anda aos pulos e trava por segundos. Antes de qualquer conclusão, troque a pilha e aproxime o receptor. Se o comportamento continuar com pilha nova e receptor próximo, aí sim entram interferência e falha do módulo.",
  },
  {
    question: "O mouse funciona nas portas de trás mas não nas da frente. Isso é grave?",
    answer:
      "Grave não é, mas é físico. Portas frontais dependem de um cabo interno ligado na placa-mãe, e esse conector se solta com facilidade em gabinetes que já foram abertos. Recolocar e testar é serviço rápido de bancada, sem troca de componente na maioria dos casos.",
  },
  {
    question: "Mouse e teclado pararam ao mesmo tempo. Pode ser vírus?",
    answer:
      "É pouco provável. Dois periféricos caindo juntos aponta para a controladora USB, para uma atualização que substituiu drivers ou para falha na alimentação das portas. O diagnóstico começa testando os dois em outra máquina, o que separa hardware de sistema sem gastar nada.",
  },
  {
    question: "O cursor some quando o computador volta da suspensão. O que fazer?",
    answer:
      "Esse é o efeito da economia de energia desligando as portas USB. A correção é ajustar essa política no sistema, e costuma ser feita por atendimento remoto, sem retirar o equipamento do lugar.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Fazemos retirada e devolução no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Boa parte dos casos de periférico se resolve remotamente, e avisamos quando esse é o caminho.",
  },
];

const MouseNaoFunciona = () => {
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
      name: "Mouse não funciona: porta USB, receptor, driver ou o próprio mouse",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-mouse-nao-funciona-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Mouse não funciona" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Mouse não funciona: porta USB, receptor, driver ou o próprio mouse
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Antes de comprar outro periférico, um teste de um minuto separa defeito do mouse de falha da porta USB
            ou do sistema. Esta página mostra essa ordem.
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
        imageKey="diagnostico"
        secondaryImageKey="ferramentas"
        layout="duo"
        caption="Teste do periférico em outra máquina e em portas diferentes antes de qualquer troca de peça"
        secondaryCaption="Bancada usada na revisão de conectores USB frontais e da controladora da placa-mãe"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "ordem", label: "A ordem certa de investigar" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="ordem" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">A ordem certa de investigar um mouse parado</h2>
          <p className="mb-3 text-muted-foreground">
            Periférico é o sintoma em que mais se gasta dinheiro à toa. O teste que decide tudo é gratuito: levar o
            mouse para outro computador. Funcionando lá, o periférico está bom e a investigação passa para porta USB,
            energia e sistema.
          </p>
          <p className="mb-3 text-muted-foreground">
            O segundo divisor é a quantidade de dispositivos afetados. Só o mouse aponta para o próprio aparelho ou
            para uma porta específica. Mouse e teclado juntos apontam para a controladora USB ou para uma
            atualização que trocou drivers.
          </p>
          <p className="text-muted-foreground">
            Se além do mouse o computador está lento ou instável, vale conferir{" "}
            <Link to="/problemas/computador-travando" className="font-medium text-accent hover:underline">
              computador travando
            </Link>
            . Para ajustes que não exigem coleta, veja{" "}
            <Link to="/atendimento-remoto" className="font-medium text-accent hover:underline">
              atendimento remoto
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
            Cabo rompido junto ao conector e micro switch desgastado respondem pela maior parte dos mouses com fio.
            Em modelos sem fio, pilha fraca e receptor mal posicionado dominam a lista.
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
            <MousePointer2 className="h-6 w-6 text-accent" /> Verificações seguras antes de comprar outro mouse
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhum passo abaixo exige abrir equipamento nem instalar programa. Siga na ordem e pare assim que
            identificar o cenário.
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
            O que não recomendamos: instalar programas que prometem consertar drivers automaticamente, forçar o
            conector em porta que já está com folga e comprar periférico novo antes do teste em outra máquina.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">O que resolve cada cenário</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {OPCOES.map((o) => (
              <div key={o.titulo} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{o.titulo}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{o.desc}</p>
                <Link
                  to={o.to}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
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
              <h3 className="mb-2 font-semibold text-foreground">Teste gratuito antes de gastar</h3>
              <p className="text-sm text-muted-foreground">
                Orientamos o teste em outra máquina antes de qualquer atendimento pago. Se o periférico for o
                culpado, dizemos e você não gasta com serviço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Remoto quando cabe</h3>
              <p className="text-sm text-muted-foreground">
                Política de energia, driver e configuração de entrada se resolvem sem retirar o computador do
                lugar.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia do serviço executado</h3>
              <p className="text-sm text-muted-foreground">
                Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo realizado. Sem balcão:
                retirada e devolução no endereço informado.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: garantia sobre periféricos que não fornecemos, reparo de mouse de entrada quando
            o custo supera o aparelho novo e prazo fixo antes da avaliação.
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
          <h2 className="mb-3 text-2xl font-bold">Conte o que já foi testado</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Se o mouse já foi testado em outro computador, se é com fio ou sem fio e se o teclado também falhou,
            isso encurta bastante o diagnóstico.
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

export default MouseNaoFunciona;
