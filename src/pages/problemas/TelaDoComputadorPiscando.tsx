import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MonitorSmartphone, MessageCircle } from "lucide-react";
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

const PATH = "/problemas/tela-do-computador-piscando";
const TITLE = "Tela do Computador Piscando: O Que Fazer | Curitiba";
const DESCRIPTION =
  "Tela piscando, imagem tremendo ou monitor apagando por instantes? Veja como separar cabo, taxa de atualização, driver de vídeo, fonte do monitor e falha na placa antes de comprar peça, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre tela do computador piscando. A imagem do meu equipamento está piscando e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Pisca desde que liga, em qualquer tela",
    desc: "Quando o piscar aparece já na tela inicial da BIOS, a origem quase nunca é o sistema: entra cabo, monitor ou saída de vídeo.",
  },
  {
    titulo: "Pisca só depois que o Windows carrega",
    desc: "Piscar que começa após a área de trabalho aponta para driver de vídeo, taxa de atualização incompatível ou aplicativo em conflito.",
  },
  {
    titulo: "Imagem treme em faixas horizontais",
    desc: "Tremor em faixas costuma ser cabo mal encaixado, adaptador de má qualidade ou conector com pino sujo.",
  },
  {
    titulo: "Tela apaga por um instante e volta",
    desc: "Apagões curtos indicam perda momentânea de sinal, comum em cabo rompido internamente ou fonte do monitor com capacitor cansado.",
  },
  {
    titulo: "Pisca só em jogos e vídeo",
    desc: "Sob carga gráfica, o piscar acusa aquecimento da placa de vídeo ou fonte sem folga para o pico de consumo.",
  },
  {
    titulo: "Pisca quando mexe no cabo",
    desc: "Se o movimento reproduz a falha, o diagnóstico já está isolado no cabo ou no conector, e não na placa.",
  },
];

const CAUSAS = [
  "Cabo HDMI ou DisplayPort rompido internamente, quase sempre perto do plugue",
  "Adaptador genérico entre padrões diferentes de vídeo sem blindagem adequada",
  "Taxa de atualização configurada acima do que o monitor suporta de forma estável",
  "Driver de vídeo desatualizado ou substituído por versão genérica em atualização do sistema",
  "Placa de vídeo com dissipação comprometida por pasta térmica ressecada e poeira",
  "Fonte do monitor com capacitor estufado, típico em telas com anos de uso",
  "Cabo flat ou conector de tela com mau contato, no caso de notebooks",
  "Interferência elétrica de tomada compartilhada com motor ou equipamento de alta carga",
];

const VERIFICACOES = [
  "Troque o cabo de vídeo por outro conhecido antes de qualquer coisa: é a causa mais frequente e o teste mais barato.",
  "Ligue o monitor em outro computador. Se ele pisca lá também, o defeito acompanha a tela.",
  "Se possível, use outra saída de vídeo do mesmo equipamento para descartar o conector.",
  "Reduza a taxa de atualização nas configurações de vídeo e observe se o piscar para.",
  "Repare em quando pisca: sempre, só sob carga ou só ao mexer no cabo. Essa informação encurta o diagnóstico.",
  "Tire o equipamento de filtros de linha compartilhados com geladeira, ar-condicionado ou bomba d'água.",
  "Em notebook, movimente lentamente a tampa e observe se o piscar acompanha o ângulo.",
  "Não abra o monitor: a fonte interna guarda carga mesmo desligada da tomada.",
];

const OPCOES = [
  {
    titulo: "Ajuste de driver e configuração de vídeo",
    desc: "Quando o piscar só aparece depois do sistema carregar, o caminho é reinstalar o driver correto do modelo e acertar resolução e taxa de atualização.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Reparo do monitor",
    desc: "Fonte interna com capacitor estufado e conector com mau contato são serviços de bancada. Painel trincado nós não recuperamos e dizemos isso antes de recolher.",
    to: "/servicos/conserto-monitor",
    label: "Conserto de monitor",
  },
  {
    titulo: "Placa de vídeo e placa-mãe",
    desc: "Piscar sob carga com aquecimento anormal exige limpeza, revisão térmica e teste da saída de vídeo em bancada, com relatório do que foi medido.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Quando a tela não mostra nada",
    desc: "Se em vez de piscar o monitor fica totalmente sem imagem, o roteiro de verificação é outro.",
    to: "/problemas/monitor-sem-sinal",
    label: "Monitor sem sinal",
  },
];

const FAQS = [
  {
    question: "A tela do meu computador está piscando. É a placa de vídeo?",
    answer:
      "Nem sempre, e raramente é a primeira suspeita. A maior parte dos casos que recebemos se resolve no cabo, no adaptador ou na taxa de atualização. Placa de vídeo entra na conta quando o piscar aparece só sob carga gráfica, acompanhado de aquecimento e ruído de ventoinha acelerada.",
  },
  {
    question: "Trocar o cabo resolve mesmo?",
    answer:
      "Resolve em boa parte dos atendimentos. Cabos HDMI e DisplayPort rompem por dentro perto do plugue, sem nenhum sinal visível por fora. Por ser um teste rápido e sem custo relevante, é sempre o primeiro passo que orientamos antes de qualquer coleta.",
  },
  {
    question: "O monitor pisca só quando abro jogos. O que isso indica?",
    answer:
      "Piscar sob carga costuma apontar para dois cenários: dissipação comprometida na placa de vídeo ou fonte sem folga para o pico de consumo. A diferença entre eles aparece medindo temperatura e tensão em bancada. Nenhum ajuste feito por fora identifica isso com segurança.",
  },
  {
    question: "Tela de notebook piscando tem conserto?",
    answer:
      "Tem, quando a origem é o cabo flat, o conector ou a placa. Nesses casos o reparo é viável e a avaliação define a peça. Quando o painel em si está falhando, a alternativa é a substituição do conjunto de tela, e informamos o custo antes de qualquer aprovação.",
  },
  {
    question: "Pode ser problema de energia da minha casa?",
    answer:
      "Pode. Tomada compartilhada com motor, filtro de linha sobrecarregado e rede elétrica com oscilação provocam piscadas periódicas. É um cenário que vale testar mudando o equipamento de tomada antes de considerar defeito interno.",
  },
  {
    question: "Consigo resolver por atendimento remoto?",
    answer:
      "Quando a causa é driver ou configuração de vídeo, sim, e é o que indicamos por ser mais rápido e mais barato. Quando o piscar aparece antes do sistema carregar, o remoto não alcança e a avaliação precisa ser física.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado.",
  },
];

const TelaDoComputadorPiscando = () => {
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
      name: "Tela do computador piscando: cabo, driver, monitor ou placa de vídeo",
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

  const cta = (location: string) => () =>
    trackCTAClick("whatsapp", `problema-tela-do-computador-piscando-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Tela do computador piscando" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Tela do computador piscando: cabo, driver, monitor ou placa de vídeo
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:text-lg">
            Piscar de imagem tem quatro origens possíveis, e três delas custam pouco para descartar. Este roteiro
            mostra a ordem correta de teste para você não comprar peça errada.
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
        secondaryImageKey="bancadaTecnica"
        layout="duo"
        caption="Teste de cabo e saída de vídeo antes de qualquer troca de peça"
        secondaryCaption="Bancada usada na medição de temperatura e tensão da placa de vídeo"
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">A ordem certa de investigar imagem piscando</h2>
          <p className="mb-3 text-muted-foreground">
            Existe um divisor de águas simples: observar se o piscar acontece antes ou depois do sistema carregar. Se
            a tela já pisca na tela inicial da BIOS, o sistema está fora de suspeita e sobram cabo, monitor e saída de
            vídeo. Se pisca só depois da área de trabalho, driver e configuração assumem a frente.
          </p>
          <p className="mb-3 text-muted-foreground">
            O segundo divisor é a carga. Piscar que só aparece em jogo, edição de vídeo ou tela cheia aponta para
            calor e consumo, não para software. Anotar esses dois pontos antes de acionar suporte encurta bastante o
            diagnóstico e evita coleta desnecessária.
          </p>
          <p className="text-muted-foreground">
            Se o equipamento também trava junto com o piscar, vale conferir{" "}
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
            Cabo rompido internamente e adaptador genérico lideram com folga. Fonte do monitor com capacitor cansado
            aparece bastante em telas com mais de cinco anos de uso contínuo.
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
            <MonitorSmartphone className="h-6 w-6 text-accent" /> Verificações seguras antes de comprar qualquer peça
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
            O que não recomendamos: abrir o monitor por conta própria, comprar placa de vídeo antes de testar o cabo e
            forçar adaptadores em conectores que já entram com dificuldade.
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
              <h3 className="mb-2 font-semibold text-foreground">Teste barato antes de peça cara</h3>
              <p className="text-sm text-muted-foreground">
                Cabo e configuração são descartados primeiro justamente porque custam pouco. Só depois o diagnóstico
                avança para monitor e placa.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Recusa declarada</h3>
              <p className="text-sm text-muted-foreground">
                Painel de monitor trincado não é recuperado por nós. Quando o caso é esse, informamos antes de retirar
                o equipamento.
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
            O que não prometemos: recuperação de painel, prazo fixo antes da avaliação e garantia sobre cabos e
            adaptadores que não fornecemos.
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
          <h2 className="mb-3 text-2xl font-bold">Conte quando a tela começa a piscar</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Se pisca desde que liga, só depois do Windows ou apenas sob carga, essa informação muda a suspeita e
            encurta o diagnóstico.
          </p>
          <Button asChild size="lg" variant="secondary" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Falar sobre meu caso
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TelaDoComputadorPiscando;
