import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, Wrench, MessageCircle } from "lucide-react";
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

const PATH = "/problemas/dobradica-do-notebook-quebrada";
const TITLE = "Dobradiça do Notebook Quebrada: Conserto | Curitiba";
const DESCRIPTION =
  "Dobradiça do notebook quebrada, carcaça estufando ou tampa que não para em pé? Veja como avaliar o dano na estrutura, o risco para o cabo de vídeo e o que realmente resolve, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre dobradiça de notebook quebrada. A tampa do meu notebook está solta e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "A tampa não para no ângulo escolhido",
    desc: "Dobradiça com folga interna ou parafuso arrancado da base plástica. Ainda é o estágio mais barato de correção.",
  },
  {
    titulo: "A carcaça estufa perto da dobradiça",
    desc: "Sinal clássico de bucha de fixação arrancada: a força passou a ser feita pelo plástico e ele está cedendo.",
  },
  {
    titulo: "Estalo alto ao abrir ou fechar",
    desc: "Mecanismo travado por sujeira ou eixo empenado. Continuar forçando transfere o esforço para a tela e para o cabo.",
  },
  {
    titulo: "A tela pisca ao mexer na tampa",
    desc: "O cabo de vídeo passa dentro da dobradiça. Piscar ao movimentar indica cabo pinçado — pare de abrir e feche o equipamento.",
  },
  {
    titulo: "A moldura da tela descolou de um lado",
    desc: "A dobradiça já está puxando o conjunto da tela. Sem correção, o próximo dano costuma ser a própria tela.",
  },
  {
    titulo: "A tampa caiu para trás por completo",
    desc: "Rompimento total do suporte. Nesse ponto a avaliação precisa incluir tela, cabo, webcam e antenas de Wi-Fi.",
  },
];

const CAUSAS = [
  "Abertura pelo canto da tampa, que concentra toda a força em um único lado",
  "Bucha metálica arrancada da carcaça plástica por uso contínuo",
  "Queda com o notebook aberto, comum em transporte dentro de mochila",
  "Parafusos frouxos por longos períodos, que folgam a fixação aos poucos",
  "Mecanismo endurecido por sujeira e falta de lubrificação de fábrica",
  "Reparo anterior feito só com cola, que solta e volta a arrancar o encaixe",
  "Modelos de carcaça fina, em que a dobradiça é o ponto estrutural mais frágil",
  "Fechar o notebook com objeto sobre o teclado, torcendo o conjunto",
];

const VERIFICACOES = [
  "Pare de abrir e fechar o notebook. Cada ciclo aumenta o dano quando a fixação já cedeu.",
  "Observe se a carcaça está estufando perto da dobradiça: isso indica bucha arrancada e não apenas parafuso solto.",
  "Verifique se a tela pisca, apaga ou muda de cor ao movimentar a tampa — se piscar, deixe o equipamento fechado.",
  "Confira se a moldura da tela está descolando em algum canto, sinal de que o conjunto já está sendo puxado.",
  "Cheque se algum parafuso da base ficou visivelmente saltado ou faltando.",
  "Não use cola instantânea nem fita na carcaça: cola endurece o plástico e inviabiliza o reparo estruturado.",
  "Se precisar transportar, feche a tampa com cuidado e leve o notebook deitado, nunca de pé na mochila.",
  "Fotografe a região danificada antes de qualquer tentativa. Isso ajuda a avaliação preliminar.",
];

const OPCOES = [
  {
    titulo: "Reforço estrutural da fixação",
    desc: "Quando a bucha foi arrancada, o reparo recompõe o ponto de fixação da carcaça e devolve firmeza à tampa, sem depender de cola aparente.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Troca da dobradiça",
    desc: "Eixo empenado ou mecanismo travado exige peça nova. A disponibilidade depende do modelo e é confirmada antes da aprovação.",
    to: "/coleta-e-entrega",
    label: "Como funciona a coleta",
  },
  {
    titulo: "Avaliação do conjunto da tela",
    desc: "Se o cabo de vídeo foi pinçado ou a tela trincou junto, o orçamento passa a incluir o conjunto e não só a estrutura.",
    to: "/problemas/tela-de-notebook-quebrada",
    label: "Tela de notebook quebrada",
  },
  {
    titulo: "Quando a tampa já não dá imagem",
    desc: "Tela preta ao abrir depois do dano na dobradiça costuma ser cabo rompido, e o roteiro de verificação é outro.",
    to: "/problemas/notebook-com-tela-preta",
    label: "Notebook com tela preta",
  },
];

const FAQS = [
  {
    question: "Dá para consertar dobradiça de notebook ou tem que trocar a carcaça inteira?",
    answer:
      "Na maior parte dos casos dá para reparar sem trocar a carcaça inteira. Quando o problema é a bucha de fixação arrancada, o ponto de apoio é recomposto e a tampa volta a firmar. A troca completa da carcaça só entra quando o plástico está fraturado em várias regiões ou quando a área de apoio não tem mais material suficiente para sustentar carga.",
  },
  {
    question: "Posso continuar usando o notebook com a dobradiça quebrada?",
    answer:
      "Não é recomendável. O cabo de vídeo, as antenas de Wi-Fi e o cabo da webcam passam por dentro da região da dobradiça. Continuar abrindo e fechando com o mecanismo solto costuma transformar um reparo estrutural em troca de tela ou de cabo, o que muda o custo do serviço de forma significativa.",
  },
  {
    question: "Colar a carcaça resolve?",
    answer:
      "Cola resolve na aparência e volta a soltar em pouco tempo, porque a dobradiça trabalha sob torção a cada abertura. Pior: cola instantânea endurece e fragiliza o plástico ao redor, e depois disso o reparo estruturado fica mais difícil. Se já houve tentativa com cola, informe na avaliação para que o técnico saiba o que vai encontrar.",
  },
  {
    question: "Quanto tempo leva o conserto?",
    answer:
      "Depende do que a avaliação encontrar e da disponibilidade da peça para o modelo. Reforço estrutural é um serviço de bancada; troca de dobradiça depende de peça específica. Não informamos prazo antes de abrir e avaliar, justamente porque o mesmo sintoma tem cenários bem diferentes por trás.",
  },
  {
    question: "A tela pisca quando movimento a tampa. Isso é grave?",
    answer:
      "É um sinal de alerta. Piscar ao mexer indica que o cabo de vídeo está sendo pressionado dentro do canal da dobradiça. O melhor a fazer é deixar o notebook fechado e pedir avaliação, porque o rompimento do cabo em geral acontece justamente numa dessas aberturas seguintes.",
  },
  {
    question: "Vale a pena consertar ou é melhor trocar o notebook?",
    answer:
      "Isso depende da idade do equipamento e do estado do resto do hardware. Em notebooks que ainda atendem bem ao uso, corrigir a estrutura costuma custar bem menos que a substituição. Quando a avaliação indica que o gasto se aproxima do valor do aparelho, dizemos isso com clareza em vez de empurrar o serviço.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. As condições completas estão em preços e políticas.",
  },
];

const DobradicaNotebookQuebrada = () => {
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
      name: "Dobradiça do notebook quebrada: carcaça, cabo de vídeo e reparo estrutural",
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
    trackCTAClick("whatsapp", `problema-dobradica-do-notebook-quebrada-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Dobradiça do notebook quebrada" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Dobradiça do notebook quebrada: carcaça, cabo de vídeo e reparo estrutural
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Dobradiça solta raramente fica igual: ela evolui para carcaça estufada, moldura descolando e cabo de vídeo
            pinçado. Esta página mostra em que estágio está o seu caso e o que muda no reparo.
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
        caption="Notebook aberto em bancada para avaliação da fixação da tampa e do canal do cabo de vídeo"
        secondaryCaption="Ferramental usado no reforço estrutural do ponto de fixação da dobradiça"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "estagios", label: "Os estágios do dano" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="estagios" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Dobradiça quebrada tem estágios, e eles custam diferente</h2>
          <p className="mb-3 text-muted-foreground">
            Quase nenhum notebook chega com a dobradiça rompida de uma vez. Primeiro a tampa deixa de parar no ângulo
            escolhido, depois a carcaça começa a estufar perto do encaixe, em seguida a moldura da tela descola de um
            lado e só então o conjunto cede por completo.
          </p>
          <p className="mb-3 text-muted-foreground">
            Essa progressão importa porque o custo do reparo acompanha o estágio. Corrigir a fixação enquanto o
            problema é estrutural é um serviço; esperar até o cabo de vídeo ser pinçado dentro do canal da dobradiça
            leva o orçamento para outro patamar, porque passa a envolver o conjunto da tela.
          </p>
          <p className="text-muted-foreground">
            Se a tela já apresenta trinca ou mancha, o roteiro correto está em{" "}
            <Link to="/problemas/tela-de-notebook-quebrada" className="font-medium text-accent hover:underline">
              tela de notebook quebrada
            </Link>
            . Para o serviço completo de bancada, veja{" "}
            <Link to="/servicos/manutencao-de-notebook" className="font-medium text-accent hover:underline">
              manutenção de notebook
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
            Abrir a tampa sempre pelo canto e transportar o notebook aberto respondem pela maior parte dos
            atendimentos. Em carcaças finas, a bucha metálica arranca do plástico bem antes de a dobradiça em si
            apresentar defeito mecânico.
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
            <Wrench className="h-6 w-6 text-accent" /> Verificações seguras antes de qualquer tentativa
          </h2>
          <p className="mb-4 text-muted-foreground">
            Todos os passos abaixo são de observação e não exigem abrir o equipamento. Siga na ordem e pare assim que
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
            O que não recomendamos: colar a carcaça, apertar parafusos com força em plástico já arrancado, forçar a
            tampa até o fim do curso e continuar usando o notebook aberto quando a tela pisca ao movimentar.
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
              <h3 className="mb-2 font-semibold text-foreground">Avaliação antes do orçamento</h3>
              <p className="text-sm text-muted-foreground">
                O conjunto é aberto para verificar fixação, cabo de vídeo e moldura. O valor só é informado depois
                dessa verificação, com o cenário real em mãos.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Peça confirmada antes</h3>
              <p className="text-sm text-muted-foreground">
                Quando a troca da dobradiça é necessária, a disponibilidade para o modelo é confirmada antes de você
                aprovar qualquer coisa.
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
            O que não prometemos: prazo fixo antes da avaliação, peça disponível para todo modelo e garantia sobre
            áreas da carcaça já danificadas por reparo anterior com cola.
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
          <h2 className="mb-3 text-2xl font-bold">Feche o notebook e fale com a gente antes</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Conte em que estágio está a tampa e se a tela pisca ao movimentar. Isso muda diretamente o que precisa ser
            reparado.
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

export default DobradicaNotebookQuebrada;
