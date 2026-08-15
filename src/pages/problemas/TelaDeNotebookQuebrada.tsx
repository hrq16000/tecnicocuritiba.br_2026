import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, MessageCircle, MonitorSmartphone } from "lucide-react";
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

const PATH = "/problemas/tela-de-notebook-quebrada";
const TITLE = "Tela de Notebook Quebrada: Troca, Custo e Riscos | Curitiba";
const DESCRIPTION =
  "Tela trincada, com manchas ou linhas? Entenda a diferença entre painel danificado, cabo flat e placa de vídeo, o que a troca resolve, o que não resolve e como funciona a coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre tela de notebook quebrada. Quero avaliação para troca de tela do meu notebook.";

const SINTOMAS = [
  {
    titulo: "Trinca com mancha escura que se espalha",
    desc: "É o cristal líquido vazando dentro do painel. A mancha cresce com o uso e não tem reparo parcial: o painel é substituído inteiro. Continuar usando só amplia a área comprometida.",
  },
  {
    titulo: "Vidro estilhaçado, imagem ainda visível",
    desc: "Frequente em modelos com touch. A camada de vidro e o painel podem ser peças separadas ou coladas, e isso muda bastante o custo. Só a abertura revela qual construção o seu aparelho usa.",
  },
  {
    titulo: "Linhas verticais ou horizontais fixas",
    desc: "Linhas que permanecem no mesmo lugar em qualquer imagem apontam para o painel ou para o conector. Se mudam ao mover a tampa, a suspeita passa para o cabo flat.",
  },
  {
    titulo: "Tela apagada, mas com imagem fraca contra a luz",
    desc: "Painel íntegro e iluminação sem alimentação. Não é caso de troca de tela: o defeito está no circuito de backlight ou no cabo, e trocar o painel não resolveria.",
  },
  {
    titulo: "Imagem tremendo ou piscando ao abrir a tampa",
    desc: "Sinal clássico de cabo flat com rompimento parcial nas dobras da dobradiça. Peça barata perto de um painel, e o diagnóstico correto evita uma troca desnecessária.",
  },
  {
    titulo: "Tampa desalinhada ou dobradiça estourada",
    desc: "Dobradiça travada arranca o suporte do painel e rompe o flat com o tempo. Trocar só a tela nesse cenário devolve o problema em poucas semanas.",
  },
];

const CAUSAS = [
  "Queda ou impacto direto com o notebook aberto",
  "Pressão sobre a tampa fechada, como peso dentro da mochila",
  "Objeto esquecido sobre o teclado no momento de fechar o aparelho",
  "Dobradiça travada que força a estrutura do painel a cada abertura",
  "Cabo flat rompido nas dobras após anos de abre e fecha",
  "Conector de vídeo mal encaixado depois de manutenção anterior",
  "Falha da placa de vídeo, que imita defeito de tela em alguns modelos",
  "Painel com defeito de fabricação, mais raro e geralmente precoce",
];

const VERIFICACOES = [
  "Ligue um monitor externo: se a imagem externa está perfeita, o problema está na tela, no flat ou no conector — não na placa de vídeo.",
  "Observe se as linhas mudam ao mover a tampa devagar; movimento que altera a imagem aponta para o cabo flat.",
  "Ilumine a tela apagada com uma lanterna em ângulo: se aparecer imagem fraca, o painel está vivo e o problema é de iluminação.",
  "Verifique se a mancha escura cresceu desde o primeiro dia — cristal vazando avança e confirma painel comprometido.",
  "Teste se a dobradiça abre com esforço anormal ou estala; isso muda o escopo do reparo.",
  "Evite usar o aparelho com vidro estilhaçado: cacos soltos podem cortar e alcançar o teclado.",
  "Faça backup antes de encaminhar, ou peça a cópia dos arquivos junto com o serviço.",
  "Anote o modelo exato do notebook: o painel é específico e a compra depende dessa informação.",
];

const OPCOES = [
  {
    titulo: "Troca do painel",
    desc: "Cenário mais comum em trinca com mancha. Substituímos por painel de mesma resolução e tipo de conector, testamos ângulo, uniformidade e ausência de pixels mortos antes de fechar o aparelho.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Substituição do cabo flat",
    desc: "Quando a imagem falha por movimento da tampa. Custo bem menor que o do painel, e é exatamente por isso que testamos antes: trocar tela sem checar o flat é erro caro e evitável.",
    to: "/servicos/manutencao-de-notebook",
    label: "Diagnóstico de vídeo",
  },
  {
    titulo: "Reparo do circuito de vídeo na placa",
    desc: "Casos em que o painel está íntegro e a falha vem da alimentação do backlight ou do controlador na placa. Exige medição ponto a ponto e microssolda, com registro do que foi feito.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Recuperar os arquivos antes de decidir",
    desc: "Se a troca não compensar diante do valor do aparelho, a unidade de armazenamento é lida à parte e seus arquivos são entregues em mídia separada, sem depender do notebook voltar a funcionar.",
    to: "/servicos/recuperacao-de-dados",
    label: "Recuperação de dados",
  },
];

const FAQS = [
  {
    question: "Dá para consertar a tela trincada sem trocar o painel?",
    answer:
      "Não. Painel de notebook é um conjunto selado: a matriz, a iluminação e o filtro polarizador formam uma peça só. Quando há trinca com mancha escura, o cristal líquido já vazou e nenhuma técnica devolve a área perdida. O que existe de reparo real é a troca do painel completo. Quem oferece 'conserto de trinca' geralmente está falando de troca de vidro em telas touch, que é outra situação e nem sempre é possível.",
  },
  {
    question: "Como vocês sabem se é a tela ou a placa de vídeo?",
    answer:
      "Pelo teste com monitor externo, que separa os dois caminhos em minutos. Se a imagem externa sai limpa, a parte gráfica da placa está funcionando e a falha está no painel, no cabo flat ou no conector. Se o monitor externo repete o mesmo defeito, o problema é da placa e trocar a tela não resolveria nada. Esse teste é feito antes de qualquer orçamento de peça.",
  },
  {
    question: "Quanto custa trocar a tela do meu notebook?",
    answer:
      "O valor depende do painel do seu modelo, e a variação é grande: resolução, tipo de conector, presença de touch e disponibilidade de peça mudam o preço mais do que a mão de obra. Pelo WhatsApp damos a faixa provável a partir do modelo, e o valor fechado sai depois da inspeção, com peça identificada. Nada é executado sem sua aprovação.",
  },
  {
    question: "A tela nova fica igual à original?",
    answer:
      "Trabalhamos com painel de mesma resolução, mesmo tamanho e mesmo tipo de conector do original. Quando o painel disponível tiver característica diferente da peça de fábrica — por exemplo, variação de ângulo de visão em modelos antigos — informamos antes da compra, e você decide. Não instalamos painel de resolução inferior sem aviso.",
  },
  {
    question: "Vale a pena trocar a tela de um notebook antigo?",
    answer:
      "Depende da relação entre o custo do painel e o valor do aparelho funcionando. Em notebooks antigos, o painel às vezes representa boa parte do valor de mercado do equipamento, e nesse caso dizemos isso com clareza em vez de empurrar o serviço. Uma alternativa honesta em muitos casos é usar o aparelho com monitor externo e migrar os dados quando fizer sentido trocar de máquina.",
  },
  {
    question: "Preciso levar o notebook até vocês?",
    answer:
      "Não existe atendimento presencial em balcão. O serviço é feito com coleta e entrega: você aciona pelo WhatsApp, combinamos a retirada no endereço informado, o aparelho é avaliado e reparado em bancada e devolvido no mesmo endereço. Para transporte com vidro estilhaçado, orientamos como embalar sem espalhar cacos.",
  },
  {
    question: "Qual é a garantia da troca de tela?",
    answer:
      "90 dias sobre a mão de obra e sobre o painel aplicado, escopados ao serviço executado. A garantia cobre defeito da peça e da instalação — não cobre novo impacto, pressão sobre a tampa ou queda posterior, porque são danos novos e não falha do reparo. Esse limite é informado antes, por escrito, junto do orçamento.",
  },
  {
    question: "Meus arquivos correm risco durante a troca?",
    answer:
      "A troca de painel não mexe na unidade de armazenamento, então em condições normais os arquivos permanecem intactos. Ainda assim, recomendamos backup antes de qualquer serviço, porque um aparelho que sofreu queda pode ter outros danos que só se manifestam ao ser aberto. Se você não tiver como fazer o backup, fazemos a cópia junto do serviço.",
  },
];

const TelaDeNotebookQuebrada = () => {
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
      name: "Tela de notebook quebrada: quando trocar e quando não é a tela",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-tela-notebook-quebrada-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Tela de notebook quebrada" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Tela de notebook quebrada: quando trocar e quando não é a tela
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Nem toda falha de imagem é painel quebrado, e nem todo painel quebrado precisa do orçamento mais caro. Um
            teste de monitor externo e uma observação da tampa separam, em minutos, três cenários com custos muito
            diferentes: painel, cabo flat e circuito de vídeo. Esta página explica como identificar cada um antes de
            aprovar qualquer peça.
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
        secondaryImageKey="bancadaTecnica"
        layout="duo"
        caption="Notebook aberto em bancada para verificação de painel, cabo flat e conector de vídeo"
        secondaryCaption="Teste de imagem em monitor externo antes de qualquer orçamento de peça"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "tres-cenarios", label: "Três cenários diferentes" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="tres-cenarios" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Três cenários que parecem o mesmo defeito</h2>
          <p className="mb-3 text-muted-foreground">
            Quem procura por tela quebrada normalmente já viu a trinca, e nesse caso o caminho é claro. O problema
            aparece na outra metade dos atendimentos: imagem com linhas, tela apagada ou imagem tremendo sem nenhum
            impacto no histórico. Aí existem três origens possíveis, e apenas uma delas é o painel.
          </p>
          <p className="mb-3 text-muted-foreground">
            A primeira é o painel em si, que falha por impacto, pressão ou desgaste. A segunda é o cabo flat que
            atravessa a dobradiça — ele se rompe aos poucos com o abre e fecha e produz uma imagem instável que muda
            conforme o ângulo da tampa. A terceira está na placa: alimentação do backlight ou controlador de vídeo, com
            painel perfeitamente íntegro.
          </p>
          <p className="text-muted-foreground">
            Separar as três antes de comprar peça é a parte que economiza dinheiro. O procedimento completo de
            diagnóstico e reparo está descrito em{" "}
            <Link to="/servicos/manutencao-de-notebook" className="font-medium text-accent hover:underline">
              manutenção de notebook
            </Link>
            , e casos de falha na placa seguem para{" "}
            <Link to="/servicos/conserto-placa" className="font-medium text-accent hover:underline">
              conserto de placa
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">Causas mais comuns nos aparelhos que recebemos</h2>
          <p className="mb-4 text-muted-foreground">
            A lista abaixo cobre a origem da maior parte dos casos. Nenhuma delas é confirmada por descrição: a
            inspeção com monitor externo e a abertura da tampa é que definem o escopo real do reparo.
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
            <MonitorSmartphone className="h-6 w-6 text-accent" /> Verificações que você mesmo pode fazer
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhuma delas exige ferramenta, e as respostas encurtam o diagnóstico — às vezes evitam o serviço.
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
            O que não recomendamos: pressionar a mancha para "espalhar de volta", colar película sobre vidro
            estilhaçado achando que estabiliza o painel e comprar tela pela internet antes do diagnóstico — painel
            incompatível costuma não ter troca depois de aberto.
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">Critérios objetivos antes de você aprovar</h2>
          <p className="mb-5 text-muted-foreground">
            Valem para qualquer troca de tela, da triagem à entrega, e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Diagnóstico antes da peça</h3>
              <p className="text-sm text-muted-foreground">
                O painel só é comprado depois do teste com monitor externo e da verificação do cabo flat. Isso evita
                trocar tela em um defeito que era de conector.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. Retiramos e devolvemos no endereço informado, com orientação
                de embalagem quando há vidro estilhaçado.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia escopada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre a mão de obra e o painel aplicado. Novo impacto ou pressão sobre a tampa são danos
                novos e não estão cobertos — dito antes, não depois.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: reparo de trinca sem troca de painel, prazo fixo antes de confirmar disponibilidade
            da peça e painel idêntico ao de fábrica em modelos descontinuados sem avisar você antes.
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
          <h2 className="mb-3 text-2xl font-bold">Descreva o que aparece na sua tela</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo do notebook, se houve queda, se a imagem muda ao mover a tampa e o que aparece em um
            monitor externo. Com esses quatro dados já conseguimos indicar o cenário provável e a faixa de custo.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TelaDeNotebookQuebrada;
