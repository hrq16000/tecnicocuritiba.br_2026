import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { AlertTriangle, ArrowRight, CheckCircle2, Gauge, MessageCircle, ShieldCheck } from "lucide-react";
import { PageSEO } from "@/components/PageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TrustStrip } from "@/components/TrustStrip";
import { PageTableOfContents } from "@/components/ui/PageTableOfContents";
import { RealImageSection } from "@/components/RealImageSection";
import { ServicosCorrelatos } from "@/components/informatica/ServicosCorrelatos";
import { ProximosPassos } from "@/components/informatica/ProximosPassos";
import ProximosProblemas from "@/components/problemas/ProximosProblemas";
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";

const PATH = "/problemas/tela-azul-windows";
const TITLE = "Tela Azul no Windows? Diagnóstico Técnico em Curitiba";
const DESCRIPTION =
  "Tela azul recorrente no Windows: o que o código de erro indica, quais causas são de memória, disco, driver ou temperatura, o que anotar antes do atendimento e quando formatar não resolve.";

const WA_MESSAGE =
  "Olá! Vim da página sobre tela azul no Windows. Meu equipamento está reiniciando com tela azul e preciso de diagnóstico.";

const SINTOMAS = [
  {
    titulo: "Tela azul em horários aleatórios, sem padrão de uso",
    desc: "Quando a falha aparece navegando, digitando ou com a máquina parada, a suspeita costuma recair sobre memória RAM instável ou driver carregado o tempo todo, não sobre o programa que estava aberto.",
  },
  {
    titulo: "Tela azul só sob esforço: jogo, render, vídeo",
    desc: "Falha que aparece apenas quando o processador ou a placa de vídeo trabalham no limite aponta para temperatura, alimentação insuficiente ou driver de vídeo — três caminhos de investigação diferentes.",
  },
  {
    titulo: "Tela azul durante o boot, antes da área de trabalho",
    desc: "Interrupção logo no carregamento aponta para arquivos de sistema corrompidos, atualização aplicada pela metade ou disco com setores ilegíveis justamente na área de inicialização.",
  },
  {
    titulo: "Tela azul logo após instalar programa, driver ou periférico",
    desc: "Aqui a ordem dos eventos vale mais que o código de erro. Instalações recentes entram como primeira hipótese e costumam ser confirmadas ou descartadas rapidamente.",
  },
  {
    titulo: "Reinício instantâneo sem tempo de ler o código",
    desc: "O Windows pode estar configurado para reiniciar automaticamente na falha. O registro do evento continua gravado no sistema, e é dele que a avaliação parte.",
  },
  {
    titulo: "Tela azul acompanhada de ruído, travamento longo ou arquivo corrompido",
    desc: "Combinação que muda a prioridade: antes de qualquer reinstalação, o cuidado passa a ser preservar o conteúdo do disco.",
  },
];

const CODIGOS = [
  {
    titulo: "MEMORY_MANAGEMENT / PAGE_FAULT_IN_NONPAGED_AREA",
    desc: "Grupo associado a memória. Pode ser módulo de RAM com defeito, contato oxidado, mistura de módulos incompatíveis ou frequência aplicada acima do suportado pela placa. Teste de memória em ciclos longos é o que separa os casos.",
  },
  {
    titulo: "CRITICAL_PROCESS_DIED / INACCESSIBLE_BOOT_DEVICE",
    desc: "Grupo associado a sistema e armazenamento. Aparece com arquivos de boot corrompidos, atualização interrompida, controlador de disco trocado no BIOS ou disco perdendo saúde.",
  },
  {
    titulo: "VIDEO_TDR_FAILURE / DPC_WATCHDOG_VIOLATION",
    desc: "Grupo associado a driver e resposta de dispositivo. Costuma envolver driver de vídeo, driver de armazenamento antigo ou periférico que não responde no tempo esperado pelo sistema.",
  },
  {
    titulo: "WHEA_UNCORRECTABLE_ERROR / CLOCK_WATCHDOG_TIMEOUT",
    desc: "Grupo associado a hardware e estabilidade elétrica. Entram temperatura alta, alimentação insuficiente, perfil de desempenho aplicado além do padrão de fábrica e desgaste de componentes.",
  },
];

const CAUSAS = [
  "Módulo de memória com falha, oxidado ou mal encaixado",
  "Driver de vídeo, rede ou armazenamento incompatível com a versão atual do Windows",
  "Atualização do Windows interrompida por queda de energia ou desligamento forçado",
  "Disco com setores defeituosos justamente nos arquivos de sistema",
  "Superaquecimento de processador ou placa de vídeo sob carga",
  "Fonte incapaz de sustentar o consumo real do equipamento em picos",
  "Perfil de desempenho aplicado acima do padrão de fábrica",
  "Programa de segurança duplicado interferindo em serviços do sistema",
  "Periférico ou adaptador USB com driver antigo travando o sistema",
];

const VERIFICACOES = [
  "Fotografar ou anotar o código de erro exibido na tela azul — ele orienta a primeira hipótese.",
  "Registrar o que estava sendo feito no momento da falha e se ela se repete na mesma situação.",
  "Lembrar se houve instalação de programa, driver, periférico ou atualização nos dias anteriores.",
  "Observar se a máquina esquenta ou se as ventoinhas aceleram antes do reinício.",
  "Verificar se o equipamento sofreu queda de energia ou desligamento forçado recentemente.",
  "Contar quantas vezes a falha ocorreu por dia — frequência crescente muda a urgência do atendimento.",
];

const OPCOES = [
  {
    titulo: "Teste de memória e revisão de módulos",
    desc: "Indicado quando o código aponta para o grupo de memória ou quando a falha é aleatória. Envolve teste em ciclos, revisão de contatos e conferência de compatibilidade entre módulos.",
    to: "/servicos/upgrade-ssd-ram",
    label: "Upgrade e substituição de memória",
  },
  {
    titulo: "Verificação de saúde do armazenamento",
    desc: "Quando há suspeita de disco, a leitura da saúde vem antes de qualquer reinstalação. Se houver perda de saúde, preservar os dados passa à frente do reparo.",
    to: "/servicos/recuperacao-de-dados",
    label: "Recuperação de dados",
  },
  {
    titulo: "Correção de drivers e sistema",
    desc: "Reversão de driver problemático, correção de arquivos de sistema e ajuste da atualização interrompida. Resolve boa parte dos casos de tela azul sem trocar peça alguma.",
    to: "/servicos/formatacao",
    label: "Formatação e reinstalação limpa",
  },
  {
    titulo: "Limpeza interna e controle de temperatura",
    desc: "Indicada quando a falha aparece apenas sob carga. Inclui remoção de poeira, revisão da ventilação e, quando necessário, troca de pasta térmica.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Remoção de programas indesejados e conflitos",
    desc: "Quando há mais de um antivírus, extensões instaladas sem consentimento ou serviços concorrentes, a limpeza direcionada costuma estabilizar o sistema.",
    to: "/servicos/remocao-de-virus",
    label: "Remoção de vírus",
  },
];

const FAQS = [
  {
    question: "Tela azul no Windows sempre significa defeito de hardware?",
    answer:
      "Não. Metade dos casos que atendemos é software: driver incompatível, atualização aplicada pela metade ou arquivo de sistema corrompido. A outra metade envolve memória, disco, temperatura ou alimentação. O que separa os dois grupos é o padrão de repetição e o código registrado — por isso a avaliação começa lendo o histórico de falhas do sistema, e não trocando peça.",
  },
  {
    question: "Formatar resolve tela azul?",
    answer:
      "Resolve quando a origem é o sistema: arquivos corrompidos, driver problemático ou atualização interrompida. Não resolve memória com defeito, disco perdendo saúde, superaquecimento nem fonte insuficiente. Nesses casos a máquina volta a apresentar tela azul poucos dias depois da reinstalação, com o agravante de já ter perdido a configuração anterior.",
  },
  {
    question: "Preciso anotar o código de erro?",
    answer:
      "Ajuda bastante, mas não é obrigatório. O código encurta a investigação porque indica de qual família a falha veio. Se o equipamento reinicia rápido demais para você ler, o registro do evento continua gravado no Windows e é recuperado na avaliação.",
  },
  {
    question: "É seguro continuar usando o computador com tela azul recorrente?",
    answer:
      "Depende do que acompanha a falha. Tela azul isolada e esporádica permite uso enquanto o atendimento é agendado. Quando há ruído no disco, arquivos que somem, travamento longo antes da falha ou frequência crescente, o uso continuado aumenta o risco de perder dados. Nesse cenário a orientação é copiar o que for importante enquanto o sistema ainda abre.",
  },
  {
    question: "Tela azul pode ser causada por vírus?",
    answer:
      "Pode, embora não seja a causa mais comum. Programas indesejados que instalam drivers próprios, antivírus duplicados e ferramentas de \"otimização\" baixadas por anúncio interferem em serviços do sistema e geram instabilidade. Quando a tela azul começou logo depois de uma instalação desse tipo, essa hipótese entra na frente.",
  },
  {
    question: "Trocar a memória RAM resolve?",
    answer:
      "Resolve quando o teste confirma que o módulo está falhando. Trocar por suposição é o erro mais caro nesse tipo de atendimento: a falha continua e o gasto já foi feito. Por isso o teste de memória é executado em ciclos antes de qualquer recomendação de troca.",
  },
  {
    question: "Tela azul só quando jogo ou uso programa pesado indica o quê?",
    answer:
      "Falha que só aparece sob carga direciona a investigação para temperatura, alimentação e driver de vídeo. A avaliação mede a temperatura sob esforço, confere se a fonte sustenta o consumo real do equipamento e verifica a versão do driver antes de indicar qualquer intervenção.",
  },
  {
    question: "Meus arquivos correm risco durante o atendimento?",
    answer:
      "Teste de memória, limpeza interna e correção de driver não exigem apagar dados. Quando o caminho envolve reinstalação, a cópia é feita antes e você é informado do que será preservado. Havendo suspeita de disco com falha, preservar os dados vira prioridade sobre qualquer outra etapa.",
  },
  {
    question: "Quanto tempo leva para descobrir a causa?",
    answer:
      "Casos de driver e sistema costumam ser identificados no mesmo atendimento. Suspeita de memória exige teste em ciclos longos, que pode levar horas de bancada. Suspeita de disco é o cenário mais demorado, porque a leitura é feita em etapas para não agravar o problema. O prazo estimado é informado antes da execução.",
  },
  {
    question: "O valor pode ser informado antes do diagnóstico?",
    answer:
      "Não com precisão. Tela azul é sintoma de origens muito diferentes entre si, de um driver desatualizado a um disco em falha. As condições comerciais vigentes estão publicadas na página de preços e políticas, e o valor do serviço é apresentado depois da causa confirmada, dependendo da sua autorização.",
  },
];

const TelaAzulWindows = () => {
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
      name: "Tela azul no Windows: o que o código indica e como o diagnóstico é feito",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-tela-azul-windows-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Tela azul no Windows" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Tela azul no Windows: o que o código indica e como o diagnóstico é feito
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Tela azul não é um defeito: é o sistema interrompendo a execução para evitar dano maior. O que importa é o
            que provocou a interrupção — memória, disco, driver, temperatura ou alimentação. Esta página mostra como o
            padrão de repetição e o código de erro separam esses grupos, o que você pode anotar antes do atendimento e
            por que formatar por padrão costuma devolver o problema em poucos dias.
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
        caption="Medição em bancada durante investigação de instabilidade do sistema"
        secondaryCaption="Bancada usada para teste de memória em ciclos longos e leitura de saúde do disco"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "o-que-e", label: "O que a tela azul realmente informa" },
            { id: "sintomas", label: "Padrões que separam as causas" },
            { id: "codigos", label: "Grupos de código de erro" },
            { id: "causas", label: "Causas possíveis" },
            { id: "opcoes", label: "O que resolve cada causa" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="o-que-e" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">O que a tela azul realmente informa</h2>
          <p className="mb-3 text-muted-foreground">
            A tela azul aparece quando o Windows detecta uma operação que não pode continuar com segurança e encerra a
            execução para proteger dados e hardware. O código exibido não nomeia a peça defeituosa: ele indica em qual
            camada a operação falhou. É por isso que dois equipamentos com o mesmo código podem ter causas
            completamente diferentes.
          </p>
          <p className="mb-3 text-muted-foreground">
            O que dá direção ao diagnóstico é o padrão de repetição. Falha aleatória, falha só sob carga, falha durante
            o boot e falha logo após uma instalação apontam para grupos distintos. Cruzando esse padrão com o registro
            de eventos do sistema, a investigação começa pela hipótese mais provável em vez de percorrer todas.
          </p>
          <p className="text-muted-foreground">
            A triagem pelo WhatsApp pergunta exatamente isso: quando acontece, com que frequência e o que mudou antes.
            Essa informação orienta a modalidade de atendimento, mas a causa só é confirmada com o equipamento
            avaliado.
          </p>
        </section>

        <section id="sintomas" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Padrões que separam as causas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SINTOMAS.map((s) => (
              <div key={s.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">{s.titulo}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="codigos" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Grupos de código de erro e o que investigam</h2>
          <p className="mb-4 text-muted-foreground">
            Os códigos abaixo estão entre os mais frequentes nos atendimentos. Eles não fecham diagnóstico — apontam
            por onde a verificação começa.
          </p>
          <div className="space-y-4">
            {CODIGOS.map((c) => (
              <div key={c.titulo} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-mono text-sm font-semibold text-foreground">{c.titulo}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="causas" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Causas possíveis, sem afirmar diagnóstico</h2>
          <p className="mb-4 text-muted-foreground">
            As origens abaixo aparecem com frequência. Também se combinam: um disco perdendo saúde e uma atualização
            interrompida produzem juntos um comportamento que nenhum dos dois explicaria sozinho.
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
            <Gauge className="h-6 w-6 text-accent" /> O que você pode registrar antes do atendimento
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhum item exige conhecimento técnico ou abrir o equipamento, e todos encurtam a investigação.
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
            O que não recomendamos: reinstalar o Windows por conta própria com suspeita de disco, aplicar "correções de
            registro" baixadas por anúncio, desativar a memória virtual por tutorial e forçar atualização de BIOS sem
            confirmar o modelo exato da placa.
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
            <AlertTriangle className="h-6 w-6 text-destructive" /> Quando a tela azul é sinal de alerta
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              • Ruído de clique, arquivos que somem ou travamento longo antes da falha: preservar o conteúdo vem antes
              de qualquer reparo, com{" "}
              <Link to="/servicos/recuperacao-de-dados" className="font-medium text-accent hover:underline">
                recuperação de dados
              </Link>{" "}
              avaliada primeiro.
            </li>
            <li>• Frequência crescente — de uma vez por semana para várias por dia — indica agravamento progressivo.</li>
            <li>• Tela azul que impede concluir o boot deixa o equipamento sem acesso aos arquivos pelo caminho normal.</li>
            <li>• Falha surgida logo após queda de energia pode ter afetado o sistema, o disco ou a alimentação.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <ShieldCheck className="h-6 w-6 text-accent" /> Como é feito o diagnóstico e o que influencia o valor
          </h2>
          <p className="mb-3 text-muted-foreground">
            A avaliação lê o registro de eventos do sistema, testa a memória em ciclos, mede a saúde do armazenamento,
            confere versões de driver e observa a temperatura sob carga. Só com esses dados é possível dizer se o
            caminho é peça, sistema ou refrigeração — e evitar gasto no que não é a causa.
          </p>
          <p className="mb-3 text-muted-foreground">
            O esforço varia conforme o modelo, o estado do equipamento e a necessidade de bancada. Peças e materiais
            são tratados à parte do serviço. Nada além do diagnóstico é executado sem a sua autorização — o fluxo
            completo está em{" "}
            <Link to="/como-funciona" className="font-medium text-accent hover:underline">
              como funciona o atendimento
            </Link>{" "}
            e as condições em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas
            </Link>
            .
          </p>
          <p className="text-muted-foreground">
            Quando o investimento deixa de fazer sentido diante do valor do equipamento, dizemos isso abertamente, com
            o critério detalhado em{" "}
            <Link to="/quando-nao-compensa" className="font-medium text-accent hover:underline">
              quando não compensa reparar
            </Link>
            .
          </p>
        </section>

        <section className="mb-12 rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="mb-3 text-2xl font-bold text-foreground">Sintomas relacionados</h2>
          <p className="mb-4 text-muted-foreground">
            Se além da tela azul o equipamento demora para responder ou não dá sinal de energia, o cenário muda e a
            investigação começa em outro ponto.
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/problemas/computador-lento" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Computador lento <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link to="/problemas/notebook-nao-liga" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Notebook não liga <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link to="/problemas/notebook-superaquecendo" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Notebook superaquecendo <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link to="/diagnostico-tecnico" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Diagnóstico técnico <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-12 rounded-xl border border-accent/30 bg-accent/5 p-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Critérios objetivos antes de você decidir</h2>
          <p className="mb-5 text-muted-foreground">
            Nada aqui depende de opinião: são as regras de atendimento que valem para qualquer caso de instabilidade do
            sistema, do primeiro contato até a entrega. Elas estão publicadas na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Processo em etapas</h3>
              <p className="text-sm text-muted-foreground">
                Triagem pelo WhatsApp, leitura do registro de falhas, teste de memória e disco, apresentação da causa
                provável e execução só depois da sua autorização expressa. Nenhuma peça é trocada e nenhum sistema é
                reinstalado sem esse aceite.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Tempo estimado</h3>
              <p className="text-sm text-muted-foreground">
                Casos de driver e sistema costumam ser resolvidos no mesmo atendimento. Teste de memória em ciclos e
                leitura de disco exigem bancada, com prazo informado antes de começar — se o prazo mudar, você é
                avisado.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia declarada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias de garantia sobre a mão de obra do serviço executado, no mesmo defeito tratado. Peças e
                componentes seguem a garantia do fornecedor ou fabricante, com a nota entregue junto ao equipamento.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: causa definida por telefone, valor fechado antes de ver o equipamento e garantia de
            recuperação de arquivos em disco com falha física. Quando algo está fora do que conseguimos assegurar,
            dizemos antes — o mesmo critério de{" "}
            <Link to="/quando-nao-compensa" className="font-medium text-accent hover:underline">
              quando reparar deixa de compensar
            </Link>
            .
          </p>
        </section>

        <ServicosCorrelatos
          itens={[
            {
              to: "/servicos/formatacao",
              titulo: "Formatação com backup",
              desc: "Indicada quando a instabilidade vem de sistema corrompido, driver problemático ou atualização interrompida.",
            },
            {
              to: "/servicos/upgrade-ssd-ram",
              titulo: "Upgrade de SSD e memória",
              desc: "Substituição de módulo com falha confirmada em teste e troca de disco sem saúde para leitura.",
            },
            {
              to: "/servicos/recuperacao-de-dados",
              titulo: "Recuperação de dados",
              desc: "Quando a tela azul vem acompanhada de disco com falha, preservar o conteúdo vem antes do reparo.",
            },
            {
              to: "/guia-tecnico-informatica",
              titulo: "Guia técnico de informática",
              desc: "Como separar as famílias de falha e o checklist prévio que encurta qualquer diagnóstico.",
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

        <ProximosProblemas path="/problemas/tela-azul-windows" />

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Descreva quando a tela azul aparece</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Conte com que frequência ocorre, o que estava sendo feito no momento e se houve instalação, atualização ou
            queda de energia antes. Com isso a triagem indica a modalidade e o próximo passo.
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

export default TelaAzulWindows;
