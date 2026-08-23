import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, Tv, MessageCircle } from "lucide-react";
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

const PATH = "/problemas/tv-com-imagem-escura";
const TITLE = "TV com Imagem Escura: Causas e Conserto | Curitiba";
const DESCRIPTION =
  "TV com imagem escura, som normal e tela quase apagada? Veja como separar backlight queimado, placa de fonte, ajuste de brilho e falha do painel antes de trocar o aparelho, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre TV com imagem escura. A tela da minha TV está muito escura e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Som normal e imagem quase invisível",
    desc: "Se com lanterna no escuro você enxerga a imagem se mexendo, o painel está funcionando e a iluminação de fundo é a suspeita principal.",
  },
  {
    titulo: "Metade da tela escura, metade normal",
    desc: "Escurecimento em faixa ou em uma lateral indica um trecho da iluminação apagado, e não a tela inteira em falha.",
  },
  {
    titulo: "Escurece depois de alguns minutos ligada",
    desc: "Quando começa normal e escurece com o aquecimento, a suspeita recai sobre a placa de fonte ou o driver de iluminação.",
  },
  {
    titulo: "Manchas escuras nos cantos",
    desc: "Sombras localizadas costumam ser difusor deslocado ou iluminação com peças desalinhadas dentro do conjunto.",
  },
  {
    titulo: "Imagem escura só em determinada entrada",
    desc: "Se o escurecimento acompanha apenas uma entrada HDMI, cabo e aparelho conectado entram na conta antes da TV.",
  },
  {
    titulo: "Escureceu depois de uma queda de energia",
    desc: "Oscilação da rede castiga a fonte e o driver de iluminação, e é uma das origens mais frequentes que recebemos.",
  },
];

const CAUSAS = [
  "Iluminação de fundo com trecho queimado, causa mais comum em televisores com anos de uso",
  "Placa de fonte com capacitor estufado, típica após oscilação de energia",
  "Driver de iluminação em proteção, apagando a tela e mantendo o som ativo",
  "Configuração de brilho, economia de energia ou sensor de ambiente mal ajustado",
  "Modo loja ou modo cinema com perfil de imagem muito escuro para o ambiente",
  "Cabo HDMI com contato ruim entregando sinal fora do padrão de cor",
  "Difusor ou película interna deslocada após transporte sem embalagem adequada",
  "Painel em falha, cenário menos comum e o único sem reparo viável",
];

const VERIFICACOES = [
  "No escuro, aponte uma lanterna para a tela com a TV ligada. Se a imagem aparece de leve, o painel está vivo.",
  "Confira se o som continua normal. Som presente com tela escura reforça a suspeita de iluminação.",
  "Entre no menu e verifique brilho, contraste, economia de energia e sensor de luz ambiente.",
  "Restaure o perfil de imagem para o padrão de fábrica antes de considerar defeito de hardware.",
  "Teste outra entrada HDMI e outro cabo para descartar o aparelho conectado.",
  "Observe se a tela escurece só depois de aquecer: esse detalhe muda a suspeita.",
  "Não abra a TV: a placa de fonte guarda carga elevada mesmo com o aparelho desligado da tomada.",
  "Anote o modelo do aparelho e há quanto tempo o problema começou.",
];

const OPCOES = [
  {
    titulo: "Reparo da iluminação de fundo",
    desc: "Substituição das barras de iluminação e revisão do conjunto óptico é serviço de bancada, com teste de uniformidade antes da devolução.",
    to: "/servicos/conserto-tv",
    label: "Conserto de TV",
  },
  {
    titulo: "Placa de fonte e driver",
    desc: "Capacitor estufado e driver em proteção exigem medição de tensão em bancada. O relatório mostra o que foi medido e o que foi trocado.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Quando a TV não mostra nada",
    desc: "Se em vez de escura a tela fica totalmente apagada e o aparelho não responde, o roteiro começa pela alimentação.",
    to: "/problemas/tv-nao-liga",
    label: "TV não liga",
  },
  {
    titulo: "Quando há som mas nenhuma imagem",
    desc: "Som presente com tela completamente preta tem outro conjunto de causas e outra ordem de verificação.",
    to: "/problemas/tv-com-som-sem-imagem",
    label: "TV com som e sem imagem",
  },
];

const FAQS = [
  {
    question: "Minha TV está com a imagem muito escura. É o painel?",
    answer:
      "Raramente. Na maior parte dos aparelhos que recebemos com esse sintoma o painel está intacto e a falha está na iluminação de fundo ou na placa que a alimenta. O teste da lanterna no escuro é o que separa os dois cenários em segundos: se a imagem aparece de leve, o painel está funcionando.",
  },
  {
    question: "Vale a pena consertar ou é melhor comprar outra TV?",
    answer:
      "Depende do que a avaliação encontrar e do tamanho do aparelho. Reparo de iluminação e de placa de fonte costuma compensar em televisores maiores. Quando o custo se aproxima demais do valor de um aparelho novo, dizemos isso abertamente com os números na mão, antes de você aprovar qualquer serviço.",
  },
  {
    question: "Pode ser apenas configuração de brilho?",
    answer:
      "Pode, e é a primeira coisa a descartar porque não custa nada. Modo economia de energia, sensor de luz ambiente e perfis de imagem muito escuros deixam a tela quase apagada em salas claras. Restaurar o perfil padrão resolve esse cenário sem nenhuma intervenção técnica.",
  },
  {
    question: "A TV escurece só depois de meia hora ligada. O que isso indica?",
    answer:
      "Escurecimento progressivo com o aquecimento aponta para componente que perde desempenho quente, geralmente na placa de fonte ou no driver de iluminação. É um padrão que só se confirma medindo tensão com o aparelho já aquecido, o que exige bancada.",
  },
  {
    question: "Vocês fazem o reparo na minha casa?",
    answer:
      "Abertura de televisor não é feita em domicílio. A avaliação inicial pode ser feita no endereço, mas o reparo de iluminação e de placa exige bancada, com ferramenta adequada e teste posterior antes da devolução.",
  },
  {
    question: "Quanto tempo o aparelho fica com vocês?",
    answer:
      "Não damos prazo fixo antes de avaliar, porque ele depende do que for encontrado e da disponibilidade da peça específica do modelo. Depois da avaliação você recebe o que foi encontrado, o que será feito e o valor, e nada é executado sem a sua aprovação.",
  },
  {
    question: "Como funciona o atendimento?",
    answer:
      "Não temos balcão de atendimento ao público. Retiramos e devolvemos no endereço informado em Curitiba e região, com coleta gratuita nos serviços acima de uma hora de bancada e mínimo pré-aprovado de R$ 299,99 para procedimentos de bancada. Garantia de 90 dias sobre mão de obra e peça aplicada, limitada ao reparo executado.",
  },
];

const TvComImagemEscura = () => {
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
      name: "TV com imagem escura: iluminação de fundo, fonte ou ajuste",
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
    trackCTAClick("whatsapp", `problema-tv-com-imagem-escura-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "TV com imagem escura" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            TV com imagem escura: iluminação de fundo, fonte ou ajuste
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:text-lg">
            Tela escura com som normal quase nunca é painel queimado. Este roteiro mostra o teste que separa ajuste de
            imagem, iluminação apagada e falha de placa.
          </p>
          <Button asChild size="lg" variant="secondary" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="problema_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </div>
      </section>

      <TrustStrip />

      <RealImageSection
        imageKey="smartTv"
        secondaryImageKey="bancadaTecnica"
        layout="duo"
        caption="Teste de iluminação e uniformidade antes de qualquer troca de peça"
        secondaryCaption="Bancada usada na medição de tensão da placa de fonte do televisor"
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">A ordem certa de investigar uma tela escura</h2>
          <p className="mb-3 text-muted-foreground">
            O primeiro teste é gratuito e leva segundos: no escuro, aponte uma lanterna para a tela com o aparelho
            ligado em um canal ou aplicativo. Se a imagem aparece fraca mas se move, o painel está funcionando e a
            iluminação de fundo é a suspeita principal.
          </p>
          <p className="mb-3 text-muted-foreground">
            O segundo passo é descartar configuração. Modo economia de energia, sensor de luz ambiente e perfis de
            imagem herdados de modo loja escurecem a tela sem qualquer defeito. Restaurar o padrão de fábrica elimina
            essa hipótese antes de qualquer coleta.
          </p>
          <p className="text-muted-foreground">
            Se além de escura a imagem apresenta traços verticais, vale conferir{" "}
            <Link to="/problemas/tv-com-linhas-na-tela" className="font-medium text-accent hover:underline">
              TV com linhas na tela
            </Link>
            . Para entender como funciona a retirada do aparelho, veja{" "}
            <Link to="/coleta-e-entrega" className="font-medium text-accent hover:underline">
              coleta e entrega
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
            Iluminação de fundo com trecho queimado e placa de fonte castigada por oscilação de energia respondem pela
            maioria dos aparelhos que chegam com esse sintoma.
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
            <Tv className="h-6 w-6 text-accent" /> Verificações seguras antes de trocar o aparelho
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhum passo abaixo exige abrir o televisor. Siga na ordem e pare assim que identificar o cenário.
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
            O que não recomendamos: abrir o televisor por conta própria, pressionar a tela para tentar melhorar a
            imagem e comprar peça anunciada como universal antes da avaliação do modelo.
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
              <h3 className="mb-2 font-semibold text-foreground">Teste gratuito antes de peça cara</h3>
              <p className="text-sm text-muted-foreground">
                Ajuste de imagem e teste da lanterna são descartados primeiro porque não custam nada. Só depois o
                diagnóstico avança para iluminação e placa.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Recusa declarada</h3>
              <p className="text-sm text-muted-foreground">
                Painel de televisor trincado ou com falha interna não é recuperado por nós. Quando o caso é esse,
                informamos antes de retirar o aparelho.
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
            O que não prometemos: recuperação de painel, prazo fixo antes da avaliação e garantia sobre peças
            fornecidas por terceiros.
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
          <h2 className="mb-3 text-2xl font-bold">Conte o resultado do teste da lanterna</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Se a imagem aparece de leve no escuro, o painel está vivo e o reparo costuma ser viável. Descreva o modelo
            e quando o escurecimento começou.
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

export default TvComImagemEscura;
