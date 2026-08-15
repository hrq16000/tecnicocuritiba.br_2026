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

const PATH = "/problemas/tv-com-linhas-na-tela";
const TITLE = "TV com Linhas na Tela: Tem Conserto? | Curitiba";
const DESCRIPTION =
  "Televisor com linhas verticais, horizontais ou faixas coloridas na imagem? Entenda quando é conexão do painel, placa T-CON ou dano interno sem reparo viável, e como funciona a avaliação por coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre TV com linhas na tela. Minha televisão está com linhas na imagem e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Linhas verticais coloridas e fixas",
    desc: "Faixas que não mudam de lugar ao trocar de canal ou de entrada. Costumam vir da conexão entre a placa de controle da imagem e o painel, ou de um driver de coluna com contato ruim.",
  },
  {
    titulo: "Linhas horizontais que atravessam a tela",
    desc: "Traços finos e permanentes na largura da imagem apontam para o lado das linhas do painel. É o cenário com a menor taxa de reparo viável entre todos os quadros de linhas.",
  },
  {
    titulo: "Faixa larga escura ou branca em um dos lados",
    desc: "Bloco inteiro comprometido, e não apenas um traço. Aparece com frequência depois de transporte, movimentação do aparelho ou pressão sobre a moldura.",
  },
  {
    titulo: "Linhas que aparecem e somem conforme a temperatura",
    desc: "Falha intermitente que surge nos primeiros minutos e desaparece depois, ou o contrário. Indica solda fadigada ou contato dilatando com o calor — cenário frequentemente reparável.",
  },
  {
    titulo: "Imagem tremida com listras finas em movimento",
    desc: "Diferente das linhas fixas: aqui a interferência acompanha o conteúdo. Vale testar outra fonte e outro cabo, porque parte dos casos é do aparelho conectado, não da TV.",
  },
  {
    titulo: "Linhas que só aparecem em uma entrada",
    desc: "Se o defeito muda ao trocar HDMI, receptor ou console, o televisor pode estar íntegro. Esse teste simples separa problema de painel de problema de sinal, e evita chamado desnecessário.",
  },
];

const CAUSAS = [
  "Conector do painel com mau contato após transporte ou vibração",
  "Placa T-CON com falha no circuito que comanda linhas e colunas",
  "Solda fadigada por ciclos de aquecimento e resfriamento",
  "Cabo flat entre placa e painel com trilha rompida",
  "Driver de coluna do painel com contato deteriorado",
  "Pressão ou impacto sobre a tela, com dano interno na matriz",
  "Umidade infiltrada em ambiente sem ventilação",
  "Cabo HDMI ou aparelho externo gerando interferência na imagem",
];

const VERIFICACOES = [
  "Troque de entrada e de aparelho conectado: se as linhas somem, o televisor não é o problema.",
  "Abra o menu interno da TV — se as linhas aparecem sobre o menu, a falha é do aparelho e não da fonte de vídeo.",
  "Fotografe a tela com o menu aberto: essa imagem é a informação mais útil para a triagem antes da coleta.",
  "Observe se as linhas mudam com o tempo ligado, o que sugere falha térmica em vez de dano físico.",
  "Verifique se houve transporte, mudança ou queda recente do aparelho.",
  "Não pressione a tela para 'ajustar' a imagem: a pressão transforma falha de contato em dano definitivo.",
  "Não bata na lateral nem na traseira do gabinete tentando restabelecer contato.",
  "Não desmonte a moldura por conta própria — o painel trinca com muito pouca força fora da bancada.",
];

const OPCOES = [
  {
    titulo: "Avaliação de conexão e placa de controle",
    desc: "Primeira etapa em bancada: inspeção dos conectores, do cabo flat e da placa que comanda a imagem. Parte real dos casos termina em reconexão ou reparo de solda, sem substituir peça grande.",
    to: "/servicos/conserto-tv",
    label: "Conserto de TV",
  },
  {
    titulo: "Reparo em nível de componente",
    desc: "Quando o defeito está no circuito da placa de controle, o caminho é reparo com estação de retrabalho, não troca do conjunto inteiro. Testamos a imagem por tempo prolongado antes de devolver.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Recusa declarada em dano de painel",
    desc: "Quando a matriz do painel está comprometida, não existe reparo viável e não trocamos painel de televisor. Nesse caso informamos com clareza e devolvemos o aparelho sem cobrar tentativa inútil.",
    to: "/quando-nao-compensa",
    label: "Quando não compensa reparar",
  },
  {
    titulo: "Coleta e devolução no endereço",
    desc: "Televisor não é transportado por você. Retiramos embalado no endereço informado, avaliamos em bancada e devolvemos no mesmo endereço, com o resultado explicado antes de qualquer execução.",
    to: "/coleta-e-entrega",
    label: "Como funciona a coleta",
  },
];

const FAQS = [
  {
    question: "TV com linhas na tela tem conserto?",
    answer:
      "Depende de onde a falha está. Quando a origem é conexão do painel, cabo flat ou placa de controle da imagem, o reparo costuma ser viável e o aparelho volta com imagem normal. Quando o dano está dentro da matriz do painel, não há reparo possível — e trocar o painel raramente compensa diante do valor de um televisor novo. Por isso a avaliação em bancada vem antes de qualquer orçamento: é ela que separa os dois mundos.",
  },
  {
    question: "Linha vertical e linha horizontal têm a mesma causa?",
    answer:
      "Não, e essa diferença muda bastante a expectativa. Linhas verticais têm relação com o comando das colunas, um circuito que em muitos modelos passa por conexões acessíveis e por isso apresenta taxa maior de reparo. Linhas horizontais costumam vir do lado das linhas do painel, com componentes integrados à estrutura da tela, onde a intervenção é bem mais limitada. Sinalizamos a expectativa real antes de iniciar.",
  },
  {
    question: "As linhas apareceram depois que eu mudei de casa. É coincidência?",
    answer:
      "Provavelmente não. Transporte é uma das causas mais frequentes de linhas em televisor: a vibração solta conectores e a flexão da tela durante o manuseio compromete contatos internos. A boa notícia é que casos de mau contato após movimentação estão entre os mais reparáveis. A má notícia é que pressão sobre a tela durante o transporte, quando marca a matriz, produz um dano sem volta.",
  },
  {
    question: "Vale a pena consertar ou é melhor comprar outra TV?",
    answer:
      "O critério que usamos é objetivo: quando o custo do reparo se aproxima do valor de um aparelho equivalente, não indicamos o serviço. Reparos de conexão e de placa costumam ficar bem abaixo desse limite e compensam. Dano de painel, ao contrário, quase nunca compensa. Damos a orientação com o número na mão depois da avaliação, mesmo quando a resposta significa não fazer o serviço.",
  },
  {
    question: "As linhas somem sozinhas depois de um tempo ligada. Isso melhora?",
    answer:
      "Não melhora, mas é uma informação valiosa. Falha que varia com o aquecimento indica solda fadigada ou contato dilatando, e esse é justamente o grupo com maior chance de reparo bem-sucedido. O padrão típico é piorar aos poucos: começa aparecendo só nos primeiros minutos e passa a ficar permanente. Avaliar enquanto ainda é intermitente costuma resultar em serviço mais simples.",
  },
  {
    question: "Preciso levar a TV até vocês?",
    answer:
      "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Televisor transportado sem embalagem adequada é uma das principais causas de dano de painel. O atendimento começa pelo WhatsApp com a foto da tela, e a retirada acontece no endereço informado. A devolução é feita no mesmo endereço depois do serviço aprovado.",
  },
  {
    question: "Vocês trocam o painel do televisor?",
    answer:
      "Não trabalhamos com substituição de painel. É uma peça cara, frágil, frequentemente indisponível para modelos com alguns anos e com risco alto de dano na aplicação — o resultado quase nunca justifica o custo para o cliente. Preferimos declarar essa limitação antes de recolher o aparelho a cobrar por uma tentativa que sabemos improvável.",
  },
  {
    question: "Qual a garantia do reparo de imagem?",
    answer:
      "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco em que atuamos. Se o reparo foi na placa de controle da imagem, é esse conjunto que está coberto. Falha posterior em outro circuito é avaliada como caso novo. Impacto, queda ou pressão sobre a tela depois da entrega caracterizam dano novo e não estão cobertos pela garantia.",
  },
];

const TvComLinhasNaTela = () => {
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
      name: "TV com linhas na tela: causas, reparo e limites",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-tv-com-linhas-na-tela-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "TV com linhas na tela" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            TV com linhas na tela: quando é conexão, quando é placa e quando não tem reparo
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Linha vertical, linha horizontal e faixa escura parecem o mesmo defeito, mas têm origens diferentes e
            desfechos que vão de um reparo simples de contato até a ausência total de solução viável. Esta página
            mostra os testes que você faz em casa antes de acionar alguém e o que declaramos que não fazemos.
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
        imageKey="smartTv"
        secondaryImageKey="microscopio"
        layout="duo"
        caption="Televisor em avaliação de imagem na bancada, com teste por entrada"
        secondaryCaption="Inspeção de solda e conexões da placa de controle sob microscópio"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "tres-origens", label: "Três origens possíveis" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="tres-origens" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Três origens possíveis, com desfechos muito diferentes</h2>
          <p className="mb-3 text-muted-foreground">
            A primeira origem é a conexão: conectores e cabos entre a placa de controle da imagem e o painel. É a
            causa mais comum depois de transporte ou mudança, e também a de reparo mais simples. A segunda é a própria
            placa de controle, com solda fadigada ou circuito comprometido — reparável em nível de componente, com
            teste prolongado antes da devolução.
          </p>
          <p className="mb-3 text-muted-foreground">
            A terceira é o painel. Quando a matriz da tela está danificada por impacto, pressão ou falha interna, não
            existe reparo viável, e não trabalhamos com substituição de painel. Preferimos dizer isso antes de
            recolher o aparelho a cobrar por uma tentativa que sabemos improvável — a mesma postura que aplicamos em{" "}
            <Link to="/servicos/conserto-monitor" className="font-medium text-accent hover:underline">
              conserto de monitor
            </Link>
            .
          </p>
          <p className="text-muted-foreground">
            Se além das linhas a tela apagou por completo mantendo o som, o quadro é outro e está descrito em{" "}
            <Link to="/problemas/tv-com-som-sem-imagem" className="font-medium text-accent hover:underline">
              TV com som e sem imagem
            </Link>
            . Se o aparelho nem responde ao controle, comece por{" "}
            <Link to="/problemas/tv-nao-liga" className="font-medium text-accent hover:underline">
              TV não liga
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
            Transporte recente, aparelho com muitos anos de uso e ambiente úmido são os três contextos que mais
            aparecem. Só a inspeção define se o caso é de contato, de placa ou de painel — a foto da tela com o menu
            aberto ajuda a orientar a expectativa, mas não fecha diagnóstico.
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
            <MonitorSmartphone className="h-6 w-6 text-accent" /> Testes que você pode fazer antes de acionar alguém
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os três primeiros itens já separam problema de sinal de problema do televisor.
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
            O que não recomendamos em nenhuma hipótese: pressionar a tela, aquecer a moldura com secador, apoiar o
            televisor deitado sobre a face de vídeo e transportar o aparelho sem proteção rígida nas bordas.
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
            Valem para todo atendimento de televisor e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Limite declarado</h3>
              <p className="text-sm text-muted-foreground">
                Não trocamos painel de televisor. Identificado dano de painel, informamos e devolvemos o aparelho sem
                cobrar tentativa de reparo.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. O televisor é retirado embalado no endereço informado e
                devolvido no mesmo endereço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia com escopo</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado. Impacto posterior é dano novo e
                não está coberto.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: recuperar painel danificado, garantir disponibilidade de peça de linha descontinuada
            e fechar diagnóstico apenas pela foto enviada no WhatsApp.
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
          <h2 className="mb-3 text-2xl font-bold">Envie a foto da tela com o menu aberto</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo, se houve transporte recente e se as linhas mudam com o tempo ligado. Com a foto do menu
            já conseguimos orientar a expectativa antes mesmo da coleta.
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

export default TvComLinhasNaTela;
