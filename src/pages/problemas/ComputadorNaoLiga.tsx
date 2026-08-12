import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, Power } from "lucide-react";
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

const PATH = "/problemas/computador-nao-liga";
const TITLE = "Computador de Mesa Não Liga: Diagnóstico Real | Curitiba";
const DESCRIPTION =
  "PC não liga, não dá vídeo ou liga e apaga em seguida? Entenda como separar fonte, botão, placa-mãe e memória antes de trocar peça por achismo, e como funciona a coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre computador de mesa que não liga. Quero uma avaliação técnica do meu PC.";

const SINTOMAS = [
  {
    titulo: "Nada acontece ao apertar o botão",
    desc: "Sem ventoinha, sem LED, sem ruído. Falta energia chegando à placa: cabo, filtro de linha, fonte ou o próprio botão do gabinete. É o cenário em que mais encontramos causa barata.",
  },
  {
    titulo: "Liga por um segundo e desliga",
    desc: "A fonte inicia, a placa detecta um curto ou uma tensão fora da faixa e corta imediatamente. Costuma ser fonte no fim da vida, curto em periférico ou falha no circuito de alimentação da placa.",
  },
  {
    titulo: "Ventoinhas giram, mas não aparece imagem",
    desc: "Energia existe, o POST não completa. Memória mal encaixada, placa de vídeo sem alimentação auxiliar, monitor na entrada errada ou falha na própria placa-mãe.",
  },
  {
    titulo: "Sequência de bips ou LED de diagnóstico piscando",
    desc: "O melhor sintoma possível: a placa está viva e informando onde parou. Cada fabricante tem um código, e ele encurta bastante o caminho até a causa.",
  },
  {
    titulo: "Cheiro de queimado ou estalo ao ligar",
    desc: "Pare de tentar. Insistir depois de um curto pode levar o dano da fonte para a placa-mãe e para o disco, transformando um reparo pontual em prejuízo maior.",
  },
  {
    titulo: "Só liga depois de várias tentativas",
    desc: "Falha intermitente de fonte ou capacitores no início da degradação. Funciona hoje, mas tende a piorar — e desligamentos abruptos corrompem sistema e arquivos.",
  },
];

const CAUSAS = [
  "Fonte de alimentação com saída instável ou já sem capacidade de carga",
  "Botão power do gabinete ou seu cabo com mau contato",
  "Curto em periférico, cooler ou cabo frontal do gabinete",
  "Memória RAM com contato oxidado ou mal encaixada",
  "Placa de vídeo sem o conector auxiliar de energia conectado",
  "Capacitores estufados ou regulador de tensão da placa-mãe com falha",
  "Bateria de BIOS descarregada travando o POST em placas antigas",
  "Acúmulo de poeira condutiva provocando curto entre trilhas",
];

const VERIFICACOES = [
  "Teste o cabo de força e a tomada com outro aparelho antes de qualquer coisa — filtro de linha queimado é causa frequente.",
  "Confira a chave 110/220 da fonte: chave errada impede o boot ou queima a fonte na primeira tentativa.",
  "Se houver LED na placa-mãe aceso com o PC desligado, a fonte está entregando energia de espera e o problema é adiante.",
  "Anote a sequência de bips ou o código do LED de diagnóstico: ela indica memória, vídeo ou placa.",
  "Verifique se o monitor está na entrada correta e ligado na saída da placa de vídeo, não na da placa-mãe.",
  "Se sentiu cheiro de queimado ou ouviu estalo, não ligue novamente: cada tentativa amplia o dano.",
  "Não troque a fonte por outra sem saber a potência necessária — fonte genérica de baixa qualidade danifica a placa.",
  "Evite abrir e mexer sem descarregar a estática do corpo; descarga eletrostática mata componente saudável.",
];

const OPCOES = [
  {
    titulo: "Teste de energia e substituição de fonte",
    desc: "Medição das tensões sob carga com fonte de referência. Só trocamos a fonte quando o teste mostra que ela é a causa, e sempre com potência compatível com o que está instalado.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Diagnóstico de POST em bancada",
    desc: "Montagem mínima fora do gabinete, com memória, vídeo e placa testados um a um. É o procedimento que separa defeito real de curto causado pelo próprio gabinete.",
    to: "/servicos/manutencao-de-computador",
    label: "Avaliar em bancada",
  },
  {
    titulo: "Reparo de placa em nível de componente",
    desc: "Quando o problema está no circuito de alimentação da placa-mãe. Avaliamos viabilidade antes: nem toda placa compensa reparar, e dizemos isso com clareza.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Resgate dos arquivos quando o PC não volta",
    desc: "Se a máquina não for viável, a unidade de armazenamento é lida à parte e os arquivos são entregues em mídia separada, antes de qualquer decisão sobre substituir o equipamento.",
    to: "/servicos/recuperacao-de-dados",
    label: "Recuperação de dados",
  },
];

const FAQS = [
  {
    question: "Meu PC não liga de jeito nenhum. É sempre a fonte?",
    answer:
      "Não é sempre, mas a fonte lidera as estatísticas nesse sintoma. Antes de concluir, testamos cabo, tomada, chave de tensão e o botão do gabinete, porque os quatro produzem exatamente o mesmo comportamento de aparelho morto. Depois vem a medição das tensões sob carga: uma fonte pode acender LED e girar ventoinha e ainda assim não sustentar o consumo real no momento do boot.",
  },
  {
    question: "O computador liga e desliga em um segundo. O que isso significa?",
    answer:
      "Significa que a proteção da fonte ou da placa cortou a alimentação ao detectar algo fora da faixa. Em bancada, o teste é montar o conjunto mínimo — placa, processador e uma memória — fora do gabinete. Se assim liga normalmente, o curto está em algo que foi removido: cooler, cabo frontal, periférico ou o próprio contato do gabinete metálico com a placa.",
  },
  {
    question: "As ventoinhas giram, mas a tela fica preta. É a placa de vídeo?",
    answer:
      "Pode ser, mas o mais comum é memória. Antes disso, vale checar a entrada selecionada no monitor e o cabo, porque muita gente liga na saída de vídeo da placa-mãe quando há placa dedicada instalada. Em bancada testamos os módulos de memória isoladamente, limpamos os contatos e verificamos se a placa de vídeo está com o conector auxiliar de energia devidamente ligado.",
  },
  {
    question: "Trocar a fonte por conta própria resolve?",
    answer:
      "Às vezes resolve e às vezes cria um problema maior. Fonte genérica de potência insuficiente ou sem proteção adequada entrega tensão irregular e pode danificar placa-mãe, disco e placa de vídeo — um reparo de baixo custo vira prejuízo grande. Se for trocar, escolha potência compatível com o que está instalado e de fabricante com proteção real contra sobretensão.",
  },
  {
    question: "Senti cheiro de queimado. Ainda tem conserto?",
    answer:
      "Frequentemente sim, desde que você pare de ligar. O cheiro indica componente queimado, e na maior parte dos casos o dano começa localizado — um capacitor, um regulador, um fusível. O que transforma isso em perda total é insistir: cada nova tentativa propaga o defeito para outros trechos do circuito. Desligue da tomada e encaminhe para inspeção.",
  },
  {
    question: "Vale a pena consertar um computador antigo que não liga?",
    answer:
      "Depende do que a inspeção encontrar e do que a máquina precisa entregar. Fonte e limpeza costumam compensar em quase qualquer idade. Reparo de placa-mãe em equipamento muito antigo, com processador defasado, muitas vezes não compensa — e nesse caso dizemos isso abertamente, entregamos o laudo e ajudamos a preservar os arquivos antes de qualquer decisão.",
  },
  {
    question: "Como funciona o atendimento? Posso levar o computador aí?",
    answer:
      "Não temos balcão de atendimento ao público. O contato começa pelo WhatsApp, com a descrição do sintoma, e a partir daí combinamos a coleta do gabinete no endereço informado. A avaliação é feita em bancada, o valor é apresentado antes da execução e a devolução acontece no mesmo endereço, com o equipamento testado.",
  },
  {
    question: "Existe garantia no serviço?",
    answer:
      "Sim, 90 dias sobre a mão de obra e as peças que aplicamos, limitados ao bloco que foi reparado. Se trocamos a fonte, a garantia cobre a fonte e o serviço relacionado; uma falha posterior em outro componente é um caso novo. Não cobrimos danos causados por pico de energia posterior à entrega, por isso recomendamos proteção adequada na instalação elétrica.",
  },
];

const ComputadorNaoLiga = () => {
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
      name: "Computador de mesa não liga: diagnóstico e reparo",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-computador-nao-liga-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas" }, { label: "Computador não liga" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Computador de mesa não liga: como descobrir a causa sem trocar peça por achismo
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            &quot;Não liga&quot; descreve pelo menos quatro defeitos diferentes, com custos que vão de um cabo trocado
            a reparo de placa. A sequência abaixo separa energia, POST e hardware na mesma ordem que usamos em bancada
            — e evita o erro mais caro de todos, que é comprar peça antes do diagnóstico.
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
        imageKey="desktopMontado"
        secondaryImageKey="bancadaTecnica"
        layout="duo"
        caption="Gabinete aberto para teste de alimentação com fonte de referência"
        secondaryCaption="Montagem mínima em bancada para isolar curto no gabinete"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "quatro-defeitos", label: "Quatro defeitos, um mesmo sintoma" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="quatro-defeitos" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Quatro defeitos diferentes com o mesmo nome</h2>
          <p className="mb-3 text-muted-foreground">
            Um computador que &quot;não liga&quot; pode estar sem energia nenhuma, pode ligar e cortar em seguida, pode
            ligar sem completar o POST ou pode completar o POST sem enviar imagem ao monitor. São quatro estados
            distintos, com causas e custos que não se parecem em nada — e é por isso que trocar fonte às cegas resolve
            uma parte dos casos e desperdiça dinheiro em todo o resto.
          </p>
          <p className="mb-3 text-muted-foreground">
            Em bancada, o caminho é sempre do mais barato para o mais complexo: energia da tomada, cabo, fonte, botão,
            depois montagem mínima fora do gabinete e só então placa. Essa ordem existe porque o gabinete em si é uma
            fonte comum de curto, com espaçadores mal posicionados e cabos frontais em contato.
          </p>
          <p className="text-muted-foreground">
            O procedimento completo está descrito em{" "}
            <Link to="/servicos/manutencao-de-computador" className="font-medium text-accent hover:underline">
              manutenção de computador
            </Link>
            , e casos com falha no circuito de alimentação seguem para{" "}
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">Causas mais comuns nos casos que recebemos</h2>
          <p className="mb-4 text-muted-foreground">
            Boa parte dos atendimentos termina em energia, contato ou limpeza, sem substituição de placa. Só a
            inspeção define em qual grupo o seu caso está — a descrição por mensagem serve para orientar a urgência,
            não para fechar diagnóstico.
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
            <Power className="h-6 w-6 text-accent" /> Verificações seguras antes de abrir o gabinete
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os quatro primeiros itens não exigem ferramenta nenhuma e resolvem uma fatia real dos casos.
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
            O que não recomendamos em nenhuma hipótese: ligar repetidamente depois de estalo ou cheiro de queimado,
            usar fonte emprestada de potência menor, forçar o encaixe de memória e aplicar produto de limpeza líquido
            diretamente sobre a placa.
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
            Valem para todo atendimento de computador de mesa e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Diagnóstico antes da peça</h3>
              <p className="text-sm text-muted-foreground">
                Nenhuma peça é comprada ou trocada antes do teste que comprove a causa. Você aprova escopo e valor
                antes da execução.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. Retiramos o gabinete no endereço informado e devolvemos no
                mesmo endereço, testado.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia delimitada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e peças aplicadas, restritos ao bloco reparado. Falha posterior em outro
                componente é caso novo.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: prazo fixo antes da inspeção, valor fechado por telefone e reparo de placa quando a
            avaliação mostra que não compensa diante do valor do equipamento.
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
          <h2 className="mb-3 text-2xl font-bold">Descreva exatamente o que acontece ao apertar o botão</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe se há LED, se a ventoinha gira, se aparece imagem, se houve bips e se sentiu cheiro de queimado.
            Esses quatro dados já orientam a hipótese e a urgência da coleta.
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

export default ComputadorNaoLiga;
