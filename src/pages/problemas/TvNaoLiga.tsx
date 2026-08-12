import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Tv } from "lucide-react";
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

const PATH = "/problemas/tv-nao-liga";
const TITLE = "TV Não Liga? Diagnóstico Técnico de TV em Curitiba";
const DESCRIPTION =
  "TV que não liga, com LED piscando, som sem imagem ou desligando sozinha: entenda o que é fonte, placa principal, backlight ou painel, o que verificar antes do atendimento e quando o reparo não compensa.";

const WA_MESSAGE =
  "Olá! Vim da página sobre TV que não liga. Minha televisão está com problema e preciso de diagnóstico.";

const SINTOMAS = [
  {
    titulo: "LED aceso, mas nada acontece na tela",
    desc: "A fonte entrega tensão de espera, porém o equipamento não completa a inicialização. A investigação se concentra na placa principal e nas tensões de partida, não no painel.",
  },
  {
    titulo: "LED piscando em sequência repetida",
    desc: "Piscadas em padrão constante costumam ser sinalização de proteção. O que importa registrar é o número de piscadas e o intervalo entre elas, porque o padrão muda conforme a marca e a plataforma.",
  },
  {
    titulo: "Som normal e tela totalmente escura",
    desc: "Se o áudio funciona e o menu responde no escuro, a eletrônica de processamento está viva. O grupo suspeito passa a ser a iluminação da tela — a etapa que mais recebe reparo viável em TVs.",
  },
  {
    titulo: "Imagem aparece por segundos e some",
    desc: "Comportamento típico de proteção atuando logo após a partida, frequentemente ligada à etapa de iluminação ou à fonte trabalhando fora da faixa esperada.",
  },
  {
    titulo: "Desliga sozinha depois de alguns minutos",
    desc: "Pode ser proteção térmica, capacitor perdendo característica quando aquece ou configuração de economia ativada. Um desses cenários é gratuito de descartar antes de qualquer abertura.",
  },
  {
    titulo: "Não liga depois de queda de energia ou tempestade",
    desc: "Oscilações elétricas atingem primeiro a fonte. É o cenário com maior chance de reparo pontual, e também o mais comum nos meses de chuva forte em Curitiba.",
  },
];

const CAUSAS = [
  "Capacitores da fonte com perda de característica após anos de uso",
  "Fusível ou proteção de entrada aberto após oscilação da rede elétrica",
  "Etapa de iluminação da tela com uma das barras interrompida",
  "Placa principal com falha na sequência de partida",
  "Firmware corrompido depois de atualização interrompida por queda de energia",
  "Conector ou cabo flat interno com mau contato",
  "Fonte de alimentação externa (nas TVs que usam adaptador) fora da tensão correta",
  "Configuração de temporizador ou economia de energia ativada por engano",
  "Painel com dano físico — cenário sem reparo viável",
];

const VERIFICACOES = [
  "Testar em outra tomada, sem extensão, filtro de linha ou estabilizador no caminho.",
  "Observar se o LED de espera acende, apaga ou pisca — e contar as piscadas em sequência.",
  "Tentar ligar pelo botão físico da TV, e não apenas pelo controle remoto.",
  "Encostar o ouvido próximo à tela para perceber se há resposta de áudio no volume alto.",
  "No escuro, iluminar a tela de lado com uma lanterna e verificar se aparece imagem apagada.",
  "Anotar marca, modelo, tamanho e se a falha começou depois de uma queda de energia.",
];

const OPCOES = [
  {
    titulo: "Reparo da fonte de alimentação",
    desc: "É a intervenção mais frequente e a de melhor relação custo-benefício quando o problema surge após oscilação elétrica. Envolve teste de tensões, substituição de componentes específicos e verificação sob carga antes da devolução.",
    to: "/servicos/conserto-tv",
    label: "Conserto de TV",
  },
  {
    titulo: "Reparo da placa principal",
    desc: "Indicado quando a fonte entrega as tensões corretas e a partida não acontece. A avaliação mede ponto a ponto antes de qualquer intervenção, porque nem toda falha de placa principal tem reparo viável.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Reparo da iluminação da tela",
    desc: "Cabe no clássico \"som sim, imagem não\". Depende da disponibilidade do conjunto compatível com o modelo e do estado do painel, verificado antes de qualquer orçamento — não é procedimento garantido para todo aparelho.",
    to: "/servicos/conserto-tv",
    label: "Ver reparo de iluminação",
  },
  {
    titulo: "Revisão de firmware e configuração",
    desc: "Cobre atualização interrompida, temporizador ativado e modo de economia. É a hipótese mais barata de descartar e por isso é sempre testada antes de abrir o aparelho.",
    to: "/servicos/conserto-tv",
    label: "Revisão de sistema da TV",
  },
];

const FAQS = [
  {
    question: "TV que não liga tem conserto?",
    answer:
      "Depende de onde a falha está. Problemas de fonte, de iluminação da tela e parte das falhas de placa principal têm reparo viável. Dano físico no painel — tela trincada, mancha grande ou linhas fixas por impacto — não tem reparo que compense, e dizemos isso já na triagem, antes de qualquer deslocamento.",
  },
  {
    question: "O que significa o LED piscando na frente da TV?",
    answer:
      "É uma sinalização de proteção: o aparelho interrompeu a partida porque alguma tensão saiu da faixa esperada. O padrão de piscadas varia por marca e plataforma, então ele orienta a investigação, mas não substitui a medição. Contar quantas piscadas ocorrem em sequência ajuda bastante na triagem.",
  },
  {
    question: "Tem som mas não tem imagem: é o painel?",
    answer:
      "Nem sempre — e essa é a distinção mais importante. Se com uma lanterna incidindo de lado no escuro é possível ver a imagem apagada, o processamento está funcionando e o problema está na iluminação da tela, que costuma ter reparo. Painel comprometido é outro cenário, e nele o custo se aproxima do valor de um aparelho novo.",
  },
  {
    question: "Vocês trocam painel de TV?",
    answer:
      "Não. Troca de painel raramente compensa: a peça representa a maior parte do valor do aparelho e o risco de dano no transporte e na montagem é alto. Quando o diagnóstico aponta painel, informamos abertamente e explicamos por que a substituição do aparelho é a decisão mais racional.",
  },
  {
    question: "A TV parou de ligar depois de uma tempestade. Isso é comum?",
    answer:
      "Muito comum. Oscilações e picos na rede atingem primeiro a fonte de alimentação, que é justamente a etapa com maior chance de reparo pontual. Ligar a TV em tomada com aterramento adequado e evitar filtros de linha genéricos reduz a recorrência, mas não elimina o risco em descargas próximas.",
  },
  {
    question: "Preciso levar a TV até algum endereço?",
    answer:
      "Não atendemos em balcão. O contato começa pelo WhatsApp com marca, modelo, tamanho e descrição do sintoma, e o aparelho é retirado e devolvido no endereço combinado, com as condições descritas na página de coleta e entrega.",
  },
  {
    question: "Dá para orçar antes de ver a TV?",
    answer:
      "Não com precisão. Fonte, iluminação e placa principal são intervenções com custo bem diferente, e o mesmo sintoma pode vir de qualquer uma delas. O que fazemos na triagem é indicar quais cenários são compatíveis com o que você descreveu e qual deles não compensaria seguir.",
  },
  {
    question: "Qual a garantia do reparo de TV?",
    answer:
      "90 dias de garantia sobre a mão de obra do serviço executado, limitada ao defeito efetivamente tratado. Peças e componentes seguem a garantia do fornecedor. A garantia não cobre outra falha que apareça em etapa diferente do aparelho nem dano físico posterior no painel.",
  },
  {
    question: "Vale a pena consertar uma TV antiga?",
    answer:
      "O critério é a relação entre o custo do reparo e o valor de um aparelho equivalente hoje. Reparo de fonte em uma TV grande costuma compensar com folga; intervenção extensa em modelo pequeno e antigo raramente compensa. Apresentamos essa conta antes de você autorizar qualquer serviço.",
  },
];

const TvNaoLiga = () => {
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
      name: "TV não liga: como separar fonte, placa, iluminação e painel",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-tv-nao-liga-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "TV não liga" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            TV não liga: como separar fonte, placa, iluminação e painel
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Em uma TV, "não liga" descreve pelo menos quatro situações diferentes — e cada uma leva a um custo e a um
            desfecho distintos. Esta página mostra o que o LED, o som e um teste simples com lanterna já revelam antes
            de qualquer abertura, quais falhas têm reparo viável e em qual cenário somos diretos ao dizer que trocar o
            aparelho sai mais barato do que consertar.
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
        caption="Smart TV em avaliação técnica antes da abertura do gabinete"
        secondaryCaption="Bancada de solda usada no reparo de fonte e de placa de TV"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "quatro-cenarios", label: "Os quatro cenários" },
            { id: "sintomas", label: "Sintomas que separam as causas" },
            { id: "causas", label: "Causas possíveis" },
            { id: "opcoes", label: "O que resolve cada causa" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="quatro-cenarios" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Os quatro cenários por trás de "a TV não liga"</h2>
          <p className="mb-3 text-muted-foreground">
            O primeiro é a ausência total de reação: nenhum LED, nenhum clique, nada. Aqui a energia não está sendo
            convertida, e a fonte concentra a suspeita. O segundo é o LED aceso sem partida — energia de espera existe,
            mas a inicialização não completa, o que direciona à placa principal.
          </p>
          <p className="mb-3 text-muted-foreground">
            O terceiro é o mais mal interpretado: som funcionando e tela escura. Muita gente conclui que a TV
            "queimou", quando na prática o processamento está intacto e falta apenas a iluminação da tela. Esse
            cenário costuma ter o melhor desfecho de reparo entre todos.
          </p>
          <p className="text-muted-foreground">
            O quarto é o painel comprometido — trinca, mancha extensa ou linhas fixas por impacto. Não há reparo que
            compense: a peça vale quase o aparelho. Dizemos isso antes de qualquer deslocamento, seguindo o critério de{" "}
            <Link to="/quando-nao-compensa" className="font-medium text-accent hover:underline">
              quando não compensa reparar
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
            As origens abaixo respondem pela maior parte dos atendimentos de TV. Nenhuma delas é confirmada por
            descrição: elas orientam por onde a medição começa.
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
            Nenhuma dessas verificações exige abrir o aparelho, e o teste da lanterna sozinho já muda o rumo da
            triagem em boa parte dos casos.
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
            O que não recomendamos: abrir o gabinete por conta própria — há componentes que retêm carga mesmo com o
            aparelho desligado da tomada —, dar tapas na lateral para "voltar a imagem" e apoiar a TV deitada sobre a
            tela, prática que danifica o painel de forma irreversível.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">O que resolve cada tipo de causa</h2>
          <div className="space-y-4">
            {OPCOES.map((o) => (
              <div key={o.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{o.titulo}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{o.desc}</p>
                <Link to={o.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                  {o.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <AlertTriangle className="h-6 w-6 text-destructive" /> Quando não insistir em ligar
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Cheiro de queimado, estalo alto ou fumaça ao conectar o aparelho na tomada.</li>
            <li>• Disjuntor desarmando toda vez que a TV é ligada.</li>
            <li>• Tela trincada, com mancha grande ou linhas fixas após impacto ou queda.</li>
            <li>• TV que sofreu contato com água, infiltração ou uso em área aberta durante chuva.</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Nesses cenários, tentativas repetidas de ligar tendem a ampliar o dano e transformar um reparo pontual em
            um caso sem viabilidade.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <ShieldCheck className="h-6 w-6 text-accent" /> Como é feito o diagnóstico e o que influencia o valor
          </h2>
          <p className="mb-3 text-muted-foreground">
            A avaliação verifica a tomada e o cabo, mede as tensões de saída da fonte, acompanha a sequência de
            partida, testa a etapa de iluminação e confere a resposta do painel. O que separa um reparo simples de um
            caso sem viabilidade é exatamente em qual dessas etapas a falha aparece.
          </p>
          <p className="mb-3 text-muted-foreground">
            O esforço muda conforme o tamanho e a plataforma do aparelho, e a disponibilidade de peça compatível pesa
            no prazo. Nada é executado sem a sua autorização — o fluxo está em{" "}
            <Link to="/como-funciona" className="font-medium text-accent hover:underline">
              como funciona o atendimento
            </Link>{" "}
            e as condições em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas
            </Link>
            . A retirada e a devolução seguem o descrito em{" "}
            <Link to="/coleta-e-entrega" className="font-medium text-accent hover:underline">
              coleta e entrega
            </Link>
            .
          </p>
          <p className="text-muted-foreground">
            Quando o custo do reparo se aproxima do valor de um aparelho equivalente, recomendamos a substituição sem
            rodeios. Preferimos perder o serviço a entregar uma conta que não fecha para você.
          </p>
        </section>

        <section className="mb-12 rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="mb-3 text-2xl font-bold text-foreground">Serviços e conteúdos relacionados</h2>
          <p className="mb-4 text-muted-foreground">
            Se o problema é de imagem parcial, de aplicativos travando ou de conexão com a internet, o caminho começa
            em outro lugar.
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/servicos/conserto-tv" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Conserto de TV <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link to="/servicos/conserto-placa" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Conserto de placa eletrônica <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link to="/servicos/redes-e-wifi" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Redes e Wi-Fi <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link to="/equipamentos-atendidos" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Equipamentos atendidos <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-12 rounded-xl border border-accent/30 bg-accent/5 p-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Critérios objetivos antes de você decidir</h2>
          <p className="mb-5 text-muted-foreground">
            Valem para qualquer atendimento de TV, do primeiro contato até a devolução, e estão publicados na íntegra
            em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Processo em etapas</h3>
              <p className="text-sm text-muted-foreground">
                Triagem pelo WhatsApp com marca, modelo e sintoma, verificação de viabilidade antes do deslocamento,
                medição em bancada e execução somente depois da sua autorização expressa.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Tempo estimado</h3>
              <p className="text-sm text-muted-foreground">
                Reparo de fonte costuma ser concluído em poucos dias úteis. Intervenções que dependem de peça
                específica têm prazo informado antes do início, sem estimativa fechada por telefone.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia declarada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre a mão de obra do serviço executado, restrita ao defeito tratado. Peças seguem a garantia
                do fornecedor. Painel e dano físico posterior não estão cobertos.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: troca de painel, reparo de aparelho com dano por líquido generalizado e prazo
            fechado antes da medição em bancada.
          </p>
        </section>

        <ServicosCorrelatos
          itens={[
            {
              to: "/servicos/conserto-tv",
              titulo: "Conserto de TV",
              desc: "Reparo de fonte, placa e iluminação de tela, com critério declarado de recusa quando o painel está comprometido.",
            },
            {
              to: "/servicos/conserto-placa",
              titulo: "Conserto de placa eletrônica",
              desc: "Medição ponto a ponto e reparo em bancada de placas de TV, notebook e desktop.",
            },
            {
              to: "/coleta-e-entrega",
              titulo: "Coleta e entrega",
              desc: "Como o aparelho é retirado e devolvido, já que o atendimento não acontece em balcão.",
            },
            {
              to: "/quando-nao-compensa",
              titulo: "Quando não compensa reparar",
              desc: "O critério objetivo usado para recomendar a substituição em vez do conserto.",
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
          <h2 className="mb-3 text-2xl font-bold">Descreva o comportamento da sua TV</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe marca, modelo e tamanho, conte se o LED acende ou pisca, se há som com a tela escura e se a falha
            começou depois de alguma queda de energia.
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

export default TvNaoLiga;
