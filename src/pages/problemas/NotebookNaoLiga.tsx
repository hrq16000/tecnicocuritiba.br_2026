import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { AlertTriangle, ArrowRight, CheckCircle2, MessageCircle, Search, ShieldCheck } from "lucide-react";
import { ChecklistPdfCard } from "@/components/problemas/ChecklistPdfCard";
import { DIAGNOSTICO_CHECKLISTS } from "@/lib/diagnosticoChecklists";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ServicosCorrelatos } from "@/components/informatica/ServicosCorrelatos";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import ProximosProblemas from "@/components/problemas/ProximosProblemas";

const PATH = "/problemas/notebook-nao-liga";
const TITLE = "Notebook Não Liga? Assistência Técnica em Curitiba";
const DESCRIPTION =
  "Notebook não liga ou liga sem imagem? Entenda os sinais, as causas possíveis, os testes externos seguros e como funciona o diagnóstico técnico em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre notebook que não liga. Meu notebook não está ligando e preciso de diagnóstico.";

const SINAIS = [
  {
    titulo: "Nenhuma reação ao botão de energia",
    desc: "Sem LED, sem som de ventoinha e sem vibração. Pode estar relacionado a carregador, conector de energia, bateria ou circuito de entrada da placa.",
  },
  {
    titulo: "LED acende, mas a tela permanece apagada",
    desc: "Há energia chegando ao equipamento. Entre as causas possíveis estão memória, tela, cabo de vídeo interno, vídeo integrado ou falha de inicialização (POST).",
  },
  {
    titulo: "Liga por alguns segundos e desliga",
    desc: "Comportamento típico de proteção do próprio equipamento. Pode envolver alimentação instável, aquecimento ou componente em curto — insistir tende a agravar.",
  },
  {
    titulo: "Para no logo do fabricante ou na tela do sistema",
    desc: "Nesse caso há energia e vídeo. A investigação passa por armazenamento, BIOS/firmware e integridade do sistema operacional.",
  },
  {
    titulo: "Faz sons, piscadas ou bipes em sequência",
    desc: "Muitos fabricantes usam códigos de piscada ou bipe para indicar a área da falha. Registrar esse padrão ajuda bastante o diagnóstico.",
  },
];

const CAUSAS = [
  "Carregador com cabo rompido, ponta danificada ou fonte sem saída",
  "Tomada, filtro de linha ou extensão sem energia estável",
  "Conector de energia do notebook solto, oxidado ou com mau contato",
  "Bateria degradada, inchada ou impedindo a inicialização",
  "Circuito de entrada de energia da placa com falha",
  "Memória mal encaixada ou com defeito, impedindo o POST",
  "Botão de energia com falha mecânica",
  "Tela, cabo de vídeo interno ou saída de vídeo sem imagem",
  "BIOS ou firmware corrompido",
  "Armazenamento (HD ou SSD) com falha, quando o equipamento liga mas não inicia o sistema",
  "Placa-mãe com dano por líquido, oxidação ou componente em curto",
  "Aquecimento e desligamento por proteção térmica",
  "Falha do sistema operacional, quando há energia e vídeo mas o Windows não carrega",
];

const TESTES = [
  "Testar outra tomada, de preferência ligada diretamente na parede.",
  "Observar se algum LED acende, pisca ou muda de cor ao conectar o carregador.",
  "Remover pendrives, HDs externos, cabos HDMI, docas e outros periféricos e tentar novamente.",
  "Conferir se o cabo do carregador está íntegro e se a ponta encaixa com firmeza.",
  "Registrar sons, piscadas, mensagens na tela ou cheiro incomum — isso orienta o diagnóstico.",
  "Manter o notebook em superfície rígida e ventilada durante qualquer tentativa.",
];

const NAO_INSISTIR = [
  "Houve contato com líquido, mesmo que pouco: cada nova tentativa aumenta a corrosão.",
  "Existe cheiro de queimado, estalo, fumaça ou aquecimento anormal.",
  "A bateria está visivelmente inchada ou a carcaça deformada.",
  "O equipamento sofreu queda recente ou oscilação forte de energia.",
  "Há dados importantes sem cópia — nesse cenário, preservar o armazenamento vem antes de qualquer teste.",
];

const FAQS = [
  {
    question: "Notebook não liga, mas a luz acende. O que pode ser?",
    answer:
      "A luz acesa indica que há energia chegando, mas não confirma que o equipamento inicializa. Entre as causas possíveis estão memória, tela, cabo de vídeo interno, vídeo integrado, BIOS ou falha de inicialização. A separação entre 'não liga' e 'liga sem imagem' só é confirmada em diagnóstico.",
  },
  {
    question: "Notebook não liga depois de cair líquido. Posso tentar novamente?",
    answer:
      "Não é recomendado. Cada nova tentativa com resíduo interno pode ampliar a corrosão e o dano na placa. O procedimento mais seguro é desligar, não usar secador e encaminhar o equipamento para avaliação o quanto antes.",
  },
  {
    question: "O carregador pode ser a causa?",
    answer:
      "Pode estar relacionado, sim. Cabo rompido internamente, ponta danificada ou fonte sem saída são cenários frequentes. Ainda assim, trocar o carregador por suposição não substitui o teste técnico: sintomas parecidos também aparecem em conector de energia e em circuito de entrada da placa.",
  },
  {
    question: "É possível recuperar os arquivos?",
    answer:
      "Em muitos casos os arquivos continuam preservados, porque a falha está na energia, na tela ou na placa — e não no armazenamento. Quando a suspeita recai sobre o HD ou SSD, a prioridade passa a ser preservar os dados antes de qualquer intervenção no sistema.",
  },
  {
    question: "O valor pode ser informado antes do diagnóstico?",
    answer:
      "Não com precisão. O mesmo sintoma pode ter causas de custo muito diferente. O que informamos antes é a regra de diagnóstico e as condições comerciais vigentes, publicadas na página de preços e políticas. O valor do reparo é apresentado depois da causa confirmada e depende da sua autorização.",
  },
  {
    question: "Quando o reparo pode não compensar?",
    answer:
      "Quando o custo estimado do reparo se aproxima do valor de mercado do equipamento, quando a placa apresenta dano extenso por líquido ou quando a peça necessária é escassa para o modelo. Nesses casos explicamos o cenário e as alternativas, incluindo a migração dos seus dados.",
  },
];

const NotebookNaoLiga = () => {
  const waHref = whatsappLink(WA_MESSAGE);

  useEffect(() => {
    trackPageView(PATH, "Notebook não liga");
  }, []);

  useJsonLdSlot(
    SCHEMA_SLOTS.webPage,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${absoluteUrl(PATH)}#webpage`,
      name: "Notebook não liga: sinais, causas possíveis e diagnóstico",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-notebook-nao-liga-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Notebook não liga" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Notebook não liga: o que pode estar acontecendo e como é feito o diagnóstico
          </h1>
          {/* Resumo do hero derivado da introdução aprovada — o texto completo permanece no corpo. */}
          <p className="mb-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:text-base">
            Sem sinal de energia, com a luz acesa e a tela apagada ou ligando e desligando: esta página separa esses
            cenários, mostra o que dá para verificar por fora com segurança e como é feita a avaliação antes de
            qualquer valor.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="problema_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </div>
      </section>

      {/* Padrão visual de sintoma (piloto /problemas/computador-lento): confiança + sumário. */}
      <TrustStrip />

      <RealImageSection
        imageKey="notebookReparo"
        secondaryImageKey="diagnostico"
        layout="duo"
        caption="Notebook aberto em bancada para verificação de energia"
        secondaryCaption="Medição em placa para separar falha de energia de falha de imagem"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "energia-vs-imagem", label: "Não liga x liga sem imagem" },
            { id: "sinais", label: "Sinais observáveis" },
            { id: "causas", label: "Causas possíveis" },
            { id: "nao-insistir", label: "Quando não insistir em ligar" },
            { id: "testes", label: "Verificações externas seguras" },
            { id: "arquivos", label: "Risco para os dados" },
            { id: "diagnostico", label: "Como funciona o diagnóstico" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="energia-vs-imagem" className="mb-12 scroll-mt-24">
          <p className="tldr mb-6 text-muted-foreground" data-speakable>
            Um notebook que não dá sinal de energia, que acende a luz e fica com a tela apagada ou que liga e desliga
            em seguida costuma assustar — principalmente quando há trabalho ou estudo dentro dele. Esta página explica
            os sinais que ajudam a separar os cenários, as causas que podem estar envolvidas, o que dá para verificar
            por fora com segurança, o que não deve ser tentado e como funciona a avaliação técnica antes de qualquer
            valor. Nenhum diagnóstico é feito à distância: a solução depende da causa confirmada em bancada ou no
            atendimento.
          </p>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            "Não liga" e "liga sem imagem" são problemas diferentes
          </h2>
          <p className="mb-3 text-muted-foreground">
            A primeira separação que fazemos é entre ausência total de energia e ausência de imagem. Quando o
            equipamento não reage de nenhuma forma — sem LED, sem ventoinha, sem vibração —, a investigação começa pela
            alimentação: carregador, tomada, conector de energia, bateria e circuito de entrada da placa.
          </p>
          <p className="mb-3 text-muted-foreground">
            Quando existe algum sinal de vida, o cenário muda. LED aceso, ventoinha girando ou som de inicialização
            indicam que a energia chegou, e a investigação passa para memória, vídeo, tela, cabo interno, BIOS e
            armazenamento. Essa distinção evita o erro mais caro que vemos na prática: trocar peça por suposição.
          </p>
          <p className="text-muted-foreground">
            Por isso a triagem inicial pede a descrição exata do que acontece ao pressionar o botão de energia. Ela não
            substitui o diagnóstico, mas orienta a modalidade de atendimento e o que deve ser testado primeiro.
          </p>
        </section>

        <section id="sinais" className="mb-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Sinais observáveis que ajudam no diagnóstico</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SINAIS.map((s) => (
              <div key={s.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{s.titulo}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="causas" className="mb-12 scroll-mt-24">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Causas possíveis, sem afirmar diagnóstico</h2>
          <p className="mb-4 text-muted-foreground">
            A lista abaixo reúne as origens mais comuns para esse sintoma. Nenhuma delas pode ser confirmada apenas
            pela descrição: sintomas idênticos aparecem em causas de complexidade e custo muito diferentes.
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

        {/* Alerta de risco vem antes das orientações gerais (regra do cluster de sintomas). */}
        <section
          id="nao-insistir"
          role="alert"
          className="mb-12 scroll-mt-24 rounded-xl border border-destructive/30 bg-destructive/5 p-6"
        >
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" /> Quando não insistir em ligar
          </h2>
          <p className="mb-4 text-muted-foreground">
            Quando há líquido, cheiro incomum, aquecimento extremo, estalos ou bateria deformada, insistir em ligar
            pode ampliar o dano. Desconecte a energia quando for seguro e solicite avaliação.
          </p>
          <ul className="space-y-2">
            {NAO_INSISTIR.map((n) => (
              <li key={n} className="text-muted-foreground">
                • {n}
              </li>
            ))}
          </ul>
        </section>

        <section id="testes" className="mb-12 scroll-mt-24">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Testes externos que você pode fazer com segurança</h2>
          <p className="mb-4 text-muted-foreground">
            São verificações que não exigem abrir o equipamento e não aumentam o risco. Se nenhuma delas mudar o
            comportamento, o passo seguinte é a avaliação técnica.
          </p>
          <ol className="space-y-2">
            {TESTES.map((t, i) => (
              <li key={t} className="flex gap-3 text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Não recomendamos desmontagem, medições com o aparelho energizado, intervenções na fonte, ressolda ou
            qualquer procedimento interno. Além do risco pessoal, essas tentativas costumam transformar um reparo
            simples em um reparo caro.
          </p>
        </section>

        <div className="mb-12">
          <ChecklistPdfCard checklist={DIAGNOSTICO_CHECKLISTS["notebook-nao-liga"]} />
        </div>





        <section id="diagnostico" className="mb-12 scroll-mt-24">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <Search className="h-6 w-6 text-accent" /> Como funciona o diagnóstico
          </h2>
          <p className="mb-3 text-muted-foreground">
            A avaliação segue uma ordem lógica: primeiro confirma-se se há energia entrando no equipamento, depois se
            ele executa a inicialização e, por fim, se apresenta imagem e carrega o sistema. Cada etapa elimina
            hipóteses e reduz a chance de troca desnecessária de peça.
          </p>
          <p className="mb-3 text-muted-foreground">
            Alimentação e periféricos são testados de forma isolada, memória e armazenamento são verificados fora do
            conjunto quando necessário e sinais de líquido, oxidação ou aquecimento são inspecionados visualmente. Só
            depois disso é possível dizer se o caso é de peça, de reparo em placa ou de software.
          </p>
          <p className="text-muted-foreground">
            Ao final, você recebe a explicação do que foi encontrado e o valor correspondente. Nada é executado sem
            a sua autorização — o fluxo completo está descrito em{" "}
            <Link to="/como-funciona" className="font-medium text-accent hover:underline">
              como funciona o atendimento
            </Link>
            , e as condições comerciais em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas
            </Link>
            .
          </p>
        </section>

        {/* CTA intermediário — mesmo fluxo e contexto do hero. */}
        <div className="mb-12 rounded-xl border border-border bg-muted/40 p-6 text-center">
          <p className="mb-4 text-muted-foreground">
            Já sabe o que acontece ao apertar o botão de energia? Descrever esse comportamento é o que define o
            próximo passo do diagnóstico.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("meio")} data-cta-location="problema_meio">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </div>

        <section id="arquivos" className="mb-12 scroll-mt-24">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <ShieldCheck className="h-6 w-6 text-accent" /> Seus arquivos podem continuar preservados
          </h2>
          <p className="mb-3 text-muted-foreground">
            Em boa parte dos casos de notebook que não liga, o armazenamento está intacto: a falha está na energia, na
            tela ou na placa. Isso significa que documentos, fotos e trabalhos normalmente continuam gravados no HD ou
            no SSD, mesmo com o equipamento sem ligar.
          </p>
          <p className="text-muted-foreground">
            Quando a suspeita recai sobre o próprio armazenamento, a ordem muda: preservar os dados passa a ser
            prioridade antes de qualquer tentativa de reinstalação. Nenhum procedimento com risco para os seus arquivos
            é executado sem que você seja avisado.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">O que influencia o reparo e quando pode não compensar</h2>
          <p className="mb-3 text-muted-foreground">
            O esforço e o valor variam conforme a causa confirmada, o modelo do equipamento, a disponibilidade da peça
            e a necessidade de bancada. Um conector de energia, uma memória e um circuito de alimentação da placa são
            três níveis distintos de intervenção — por isso não existe valor único para o sintoma.
          </p>
          <p className="mb-3 text-muted-foreground">
            Também pesam a modalidade escolhida (atendimento presencial, coleta e entrega ou bancada), o tempo de
            testes e o prazo de reposição de peças. Peças e materiais são tratados à parte do serviço, conforme as
            regras publicadas na página de preços e políticas.
          </p>
          <p className="text-muted-foreground">
            Há cenários em que o reparo deixa de fazer sentido econômico — placa com dano extenso, peça escassa para o
            modelo ou custo próximo ao valor de mercado do aparelho. Nesses casos dizemos isso abertamente; o tema está
            detalhado em{" "}
            <Link to="/quando-nao-compensa" className="font-medium text-accent hover:underline">
              quando não compensa reparar
            </Link>
            .
          </p>
        </section>

        <section className="mb-12 rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="mb-3 text-2xl font-bold text-foreground">Precisa do serviço completo de notebook?</h2>
          <p className="mb-4 text-muted-foreground">
            Esta página trata especificamente do sintoma. Escopo de manutenção, componentes avaliados, modalidades de
            atendimento e garantia por tipo de serviço estão reunidos na página de serviço.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link
              to="/servicos/manutencao-de-notebook"
              className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
            >
              Manutenção de notebook em Curitiba <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/problemas/computador-lento"
              className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
            >
              Se ele liga mas está lento, veja computador lento <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/servicos/recuperacao-de-dados"
              className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
            >
              Precisa dos arquivos antes do reparo? Recuperação de dados <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>


        <ServicosCorrelatos
          itens={[
            {
              to: "/servicos/manutencao-de-notebook",
              titulo: "Manutenção de notebook",
              desc: "Diagnóstico de energia, imagem, aquecimento e substituição de componentes com aprovação prévia.",
            },
            {
              to: "/servicos/recuperacao-de-dados",
              titulo: "Recuperação de dados",
              desc: "Quando o equipamento não liga e os arquivos são a prioridade, o disco é avaliado primeiro.",
            },
            {
              to: "/servicos/upgrade-ssd-ram",
              titulo: "Upgrade de SSD e memória",
              desc: "Após o reparo, avaliação do que ainda faz sentido melhorar no equipamento.",
            },
            {
              to: "/guia-tecnico-informatica",
              titulo: "Guia técnico de informática",
              desc: "As famílias de falha, o checklist prévio e como funciona o diagnóstico do começo ao fim.",
            },
          ]}
        />

        <section id="faq" className="mb-12 scroll-mt-24">
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
          <h2 className="mb-3 text-2xl font-bold">Descreva o comportamento do seu notebook</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Conte o que acontece ao pressionar o botão de energia, se algum LED acende e se houve queda, líquido ou
            oscilação de energia. Com essas informações a triagem indica a modalidade e o próximo passo do diagnóstico.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("final")} data-cta-location="problema_final">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </section>
        <ProximosProblemas path={PATH} />
      </main>

      <Footer />
    </div>
  );
};

export default NotebookNaoLiga;
