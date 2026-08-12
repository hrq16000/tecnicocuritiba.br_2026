import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, Tv } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ServicosCorrelatos } from "@/components/informatica/ServicosCorrelatos";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const PATH = "/problemas/tv-com-som-sem-imagem";
const TITLE = "TV com Som e Sem Imagem? Diagnóstico em Curitiba";
const DESCRIPTION =
  "Televisor com som normal e tela apagada: entenda a diferença entre falha de backlight, de placa de fonte e de painel, quais testes indicam cada caso e quando o reparo realmente compensa em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre TV com som e sem imagem. Meu televisor liga, tem som, mas a tela fica apagada.";

const SINTOMAS = [
  {
    titulo: "Som normal e tela totalmente apagada",
    desc: "O aparelho responde ao controle, muda de canal e reproduz áudio, mas a tela não mostra nada. É o quadro clássico de falha na iluminação do painel, não de perda de sinal.",
  },
  {
    titulo: "Imagem aparece com lanterna apontada na tela",
    desc: "Ao iluminar a tela de perto em ambiente escuro, dá para ver o menu bem fraco. Esse teste indica que a imagem está sendo gerada e apenas a iluminação de fundo parou.",
  },
  {
    titulo: "Tela acende por um segundo e apaga",
    desc: "A iluminação tenta ligar e a proteção do circuito desliga em seguida. Costuma apontar para um trecho de LEDs em curto ou aberto, ou para a etapa que alimenta essa iluminação.",
  },
  {
    titulo: "Manchas escuras ou faixas de brilho irregular",
    desc: "Parte da tela ilumina e parte não. Aqui a investigação separa barras de LED com trechos queimados de dano físico na estrutura ótica do painel.",
  },
  {
    titulo: "Linhas verticais ou horizontais fixas",
    desc: "Quando há imagem, mas atravessada por linhas permanentes, a suspeita muda de iluminação para conexão do painel ou para o próprio painel — cenários com desfechos bem diferentes.",
  },
  {
    titulo: "Liga sozinho, reinicia ou pisca o LED frontal",
    desc: "Piscadas em sequência e reinícios acompanham falhas de alimentação. Nesses casos, a tela apagada é consequência de um problema anterior, na etapa de energia.",
  },
];

const CAUSAS = [
  "Barras de LED de iluminação com trechos abertos por desgaste térmico",
  "Etapa de alimentação da iluminação sem tensão de saída",
  "Capacitores da fonte com perda de capacidade após anos de uso",
  "Placa principal sem enviar o comando de acionamento da iluminação",
  "Conector do painel com mau contato após transporte ou movimentação",
  "Trilha interrompida por oxidação em ambiente úmido",
  "Painel com dano físico após impacto, pressão ou queda",
  "Reparo anterior com peça genérica de especificação diferente da original",
];

const VERIFICACOES = [
  "Em ambiente escuro, apontar a lanterna do celular bem perto da tela e observar se aparece imagem fraca.",
  "Trocar a fonte de vídeo (outra entrada, outro cabo, outro aparelho) para descartar problema externo.",
  "Testar em outra tomada, de preferência em circuito diferente do que estava em uso.",
  "Observar o LED frontal ao ligar: contar quantas piscadas e anotar o padrão.",
  "Verificar se há cheiro de queimado próximo às saídas de ventilação da traseira.",
  "Anotar marca, modelo e o número que aparece na etiqueta traseira antes do contato.",
  "Registrar em vídeo curto o momento de ligar — o comportamento nos primeiros segundos é informativo.",
];

const OPCOES = [
  {
    titulo: "Reparo da iluminação do painel",
    desc: "Cenário mais comum em televisor com som e sem imagem. Envolve abertura controlada, substituição das barras de iluminação com especificação equivalente e teste de brilho uniforme antes da devolução.",
    to: "/servicos/conserto-tv",
    label: "Conserto de TV",
  },
  {
    titulo: "Reparo da placa de alimentação",
    desc: "Quando a etapa que alimenta a iluminação não entrega tensão, o trabalho é em componente: medição ponto a ponto e troca das peças fora de faixa, sem substituir a placa inteira por dedução.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Reparo em nível de componente na placa principal",
    desc: "Casos em que o comando de acionamento não chega ao circuito de iluminação. Exige bancada com instrumentação e microssolda, com registro do que foi medido e do que foi substituído.",
    to: "/servicos/conserto-placa",
    label: "Reparo em bancada",
  },
  {
    titulo: "Laudo com recusa de reparo",
    desc: "Painel trincado ou com dano interno não é reparável de forma honesta: informamos isso por escrito, com foto, e não iniciamos serviço com baixa chance de sucesso apenas para faturar a tentativa.",
    to: "/precos-e-politicas",
    label: "Políticas de atendimento",
  },
];

const FAQS = [
  {
    question: "Som funcionando e tela apagada significa que a TV tem conserto?",
    answer:
      "Na maior parte dos casos, sim. Quando o áudio sai normalmente e o aparelho responde ao controle, a placa principal está funcionando e o problema costuma estar na iluminação do painel ou na etapa que a alimenta — dois cenários reparáveis. A exceção relevante é o painel com dano físico interno, que não tem reparo viável. O teste da lanterna dá a primeira indicação, e o diagnóstico em bancada confirma.",
  },
  {
    question: "O que é o teste da lanterna e por que ele importa tanto?",
    answer:
      "É apontar a lanterna do celular bem próximo da tela, em ambiente escuro, com o televisor ligado. Se aparecer uma imagem fraca do menu, a eletrônica está gerando vídeo e apenas a iluminação de fundo parou. Isso muda completamente a expectativa de custo e prazo, porque separa um reparo comum de um caso de painel. Vale registrar em foto ou vídeo e enviar junto da descrição.",
  },
  {
    question: "Trocar as barras de iluminação resolve de forma definitiva?",
    answer:
      "Resolve quando a causa é desgaste da iluminação e o restante do circuito está íntegro. O ponto crítico é a especificação: barra de tensão ou corrente diferente da original volta a falhar em pouco tempo e ainda sobrecarrega a etapa de alimentação. Por isso trabalhamos com equivalência técnica verificada e teste de uniformidade de brilho antes de fechar o aparelho.",
  },
  {
    question: "Vocês consertam painel de televisor?",
    answer:
      "Não. Painel trincado, com pressão interna ou com dano na estrutura ótica não tem reparo confiável fora da fábrica, e qualquer promessa nesse sentido é conversa de venda. Nesses casos emitimos laudo com foto do dano e explicamos por que não iniciamos o serviço. Você decide o que fazer com a informação, sem ter pagado por uma tentativa sem chance real.",
  },
  {
    question: "Como funciona o atendimento se eu não posso levar o aparelho?",
    answer:
      "Não existe atendimento presencial em balcão: trabalhamos com coleta e entrega no endereço informado. O contato começa pelo WhatsApp, com marca, modelo e descrição do comportamento. A partir daí combinamos a coleta, o aparelho é avaliado em bancada e o retorno vem com diagnóstico, valor fechado e prazo antes de qualquer intervenção.",
  },
  {
    question: "Quanto custa descobrir o que a televisão tem?",
    answer:
      "O diagnóstico em bancada tem valor informado antes da coleta e é abatido quando o reparo é aprovado. Nenhum serviço começa sem aprovação explícita do valor fechado. Se a avaliação apontar que o conserto não compensa diante do valor do aparelho, você recebe essa conclusão de forma direta, com o motivo técnico.",
  },
  {
    question: "Qual é a garantia do reparo de televisor?",
    answer:
      "90 dias sobre a mão de obra e sobre os componentes que substituímos, contados da entrega. A garantia é escopada ao que foi reparado: ela não cobre falha em outro bloco do aparelho que estava íntegro na saída, dano por surto elétrico posterior, queda, líquido nem intervenção feita por terceiros depois da devolução.",
  },
  {
    question: "Vale a pena consertar ou é melhor comprar outra?",
    answer:
      "A conta que usamos é simples e dita em voz alta: reparo que se aproxima do valor de um aparelho equivalente novo raramente compensa. Televisores maiores e mais recentes normalmente compensam o reparo de iluminação ou de alimentação; modelos pequenos e antigos frequentemente não. Damos essa leitura junto do orçamento, inclusive quando ela significa perder o serviço.",
  },
];

const TvComSomSemImagem = () => {
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
      name: "TV com som e sem imagem: iluminação, alimentação ou painel",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-tv-som-sem-imagem-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas" }, { label: "TV com som e sem imagem" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            TV com som e sem imagem: iluminação, alimentação ou painel
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Televisor que liga, responde ao controle e reproduz áudio com a tela apagada quase sempre está gerando
            imagem — o que parou foi a iluminação por trás do painel. Esta página mostra o teste caseiro que separa
            esse caso do dano de painel, o que cada sintoma sugere e em que situações recusamos o reparo por não haver
            chance real de sucesso.
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
        secondaryImageKey="estacaoSolda"
        layout="duo"
        caption="Televisor em avaliação de iluminação de painel na bancada"
        secondaryCaption="Estação de solda usada em reparo de placa de alimentação e placa principal"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "tres-cenarios", label: "Os três cenários" },
            { id: "sintomas", label: "Sintomas que separam as causas" },
            { id: "causas", label: "Causas possíveis" },
            { id: "opcoes", label: "O que resolve cada causa" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="tres-cenarios" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Os três cenários por trás da tela apagada</h2>
          <p className="mb-3 text-muted-foreground">
            O primeiro é falha da iluminação. O televisor continua processando vídeo, mas as barras de LED que
            iluminam o painel por trás pararam de acender. É o cenário mais frequente em aparelhos com quatro anos ou
            mais de uso contínuo, e o teste da lanterna quase sempre o revela antes mesmo da coleta.
          </p>
          <p className="mb-3 text-muted-foreground">
            O segundo é falha de alimentação. A etapa responsável por gerar a tensão da iluminação para de entregar
            saída, seja por capacitor degradado, seja por componente de chaveamento fora de faixa. O sintoma pode vir
            acompanhado de piscadas no LED frontal e de tentativa de ligar seguida de desligamento imediato.
          </p>
          <p className="text-muted-foreground">
            O terceiro é dano de painel, o único sem reparo viável. Trinca interna, pressão sobre a tela e impacto
            deixam marcas visíveis quando iluminadas. Nesse caso emitimos laudo e recusamos o serviço — a política
            completa está descrita em{" "}
            <Link to="/servicos/conserto-tv" className="font-medium text-accent hover:underline">
              conserto de TV
            </Link>
            .
          </p>
        </section>

        <section id="sintomas" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Sintomas que ajudam a separar as causas</h2>
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">Causas possíveis, sem afirmar diagnóstico</h2>
          <p className="mb-4 text-muted-foreground">
            As origens abaixo respondem pela maior parte dos televisores que chegam com som e sem imagem. Nenhuma é
            confirmada por descrição: elas orientam o que medir na bancada antes de propor qualquer substituição.
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
            <Tv className="h-6 w-6 text-accent" /> O que você pode verificar antes do atendimento
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhuma verificação exige abrir o aparelho, e o teste da lanterna sozinho já orienta boa parte da
            conversa.
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
            O que não recomendamos: abrir a traseira por conta própria, porque a fonte armazena carga mesmo desligada;
            insistir em ligar e desligar em sequência quando o aparelho já entra em proteção; e pressionar a tela para
            "testar" o painel, gesto que transforma um reparo comum em dano definitivo.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">O que resolve cada tipo de causa</h2>
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
            Valem para qualquer televisor recebido, da triagem pelo WhatsApp até a entrega, e estão publicados na
            íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. O aparelho é coletado no endereço informado, avaliado em
                bancada e devolvido no mesmo endereço, com embalagem adequada ao transporte.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Valor fechado antes</h3>
              <p className="text-sm text-muted-foreground">
                O reparo só começa depois de você aprovar valor e prazo. Se durante o serviço aparecer algo além do
                previsto, o trabalho para e a decisão volta para você.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia escopada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre a mão de obra e as peças aplicadas, limitados ao bloco reparado. Surto elétrico
                posterior, queda, líquido e intervenção de terceiros ficam fora.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: recuperar painel danificado, garantir peça original de linha descontinuada e
            sustentar prazo quando o componente necessário depende de importação.
          </p>
        </section>

        <ServicosCorrelatos
          itens={[
            {
              to: "/servicos/conserto-tv",
              titulo: "Conserto de TV",
              desc: "Iluminação de painel, placa de alimentação e placa principal, com recusa declarada em dano de painel.",
            },
            {
              to: "/servicos/conserto-placa",
              titulo: "Conserto de placa",
              desc: "Reparo em nível de componente com instrumentação, medição ponto a ponto e microssolda.",
            },
            {
              to: "/problemas/tv-nao-liga",
              titulo: "TV não liga",
              desc: "Quando não há som nem imagem, a investigação começa pela etapa de energia do aparelho.",
            },
            {
              to: "/como-funciona",
              titulo: "Como funciona o atendimento",
              desc: "Da triagem pelo WhatsApp até a coleta e a entrega, com as etapas descritas antes de começar.",
            },
          ]}
        />

        <section id="faq" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Perguntas frequentes</h2>
          <div className="space-y-5">
            {FAQS.map((f) => (
              <div key={f.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{f.question}</h3>
                <p className="text-sm text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Descreva como a sua televisão está se comportando</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe marca, modelo, se o som sai normalmente, o que aparece no teste da lanterna e há quanto tempo o
            comportamento começou. Com esses dados a triagem já indica o cenário mais provável.
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

export default TvComSomSemImagem;
