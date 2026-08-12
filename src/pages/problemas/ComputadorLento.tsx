import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, Gauge, MessageCircle, ShieldCheck } from "lucide-react";
import { ChecklistPdfCard } from "@/components/problemas/ChecklistPdfCard";
import { DIAGNOSTICO_CHECKLISTS } from "@/lib/diagnosticoChecklists";
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

const PATH = "/problemas/computador-lento";
const TITLE = "Computador Lento? Diagnóstico Técnico em Curitiba";
const DESCRIPTION =
  "Computador ou notebook lento para ligar e abrir programas? Veja os sintomas, as causas possíveis, quando SSD ou memória resolvem, quando formatar e quando trocar o equipamento.";

const WA_MESSAGE =
  "Olá! Vim da página sobre computador lento. Meu equipamento está lento e preciso de diagnóstico.";

const SINTOMAS = [
  {
    titulo: "Demora muito para ligar e chegar à área de trabalho",
    desc: "Quando a inicialização passa de alguns minutos, o gargalo costuma estar no armazenamento mecânico, na quantidade de programas iniciando junto com o sistema ou na saúde do disco.",
  },
  {
    titulo: "Trava ao abrir navegador, planilha ou vários programas",
    desc: "Sintoma típico de memória insuficiente para o uso real. O sistema passa a usar o disco como memória auxiliar e a resposta cai bruscamente.",
  },
  {
    titulo: "Fica lento depois de alguns minutos de uso",
    desc: "Comportamento associado a aquecimento: com a temperatura alta, o próprio equipamento reduz o desempenho para se proteger. Poeira, pasta térmica ressecada e ventilação obstruída entram na investigação.",
  },
  {
    titulo: "Disco em 100% ou ruído constante de leitura",
    desc: "Pode indicar HD com setores defeituosos, processo em segundo plano consumindo o disco ou atualização em andamento. Disco com falha exige cuidado com os dados antes de qualquer intervenção.",
  },
  {
    titulo: "Anúncios, abas e programas abrindo sozinhos",
    desc: "Aqui a lentidão é consequência, não causa. Programas indesejados, extensões e sequestro de navegador consomem processamento e rede o tempo todo.",
  },
  {
    titulo: "Lentidão apenas na internet",
    desc: "Quando o equipamento responde bem localmente e só a navegação está lenta, a investigação muda de lado: sinal Wi-Fi, canal, roteador, cabeamento ou o próprio link.",
  },
];

const CAUSAS = [
  "HD mecânico como disco do sistema, hoje o gargalo mais comum",
  "Memória RAM insuficiente para o uso real do dia a dia",
  "Disco cheio, sem espaço livre para o sistema trabalhar",
  "Excesso de programas iniciando junto com o Windows",
  "Aquecimento por poeira, ventilação obstruída ou pasta térmica ressecada",
  "Armazenamento com setores defeituosos ou perda de saúde",
  "Programas indesejados, extensões e sequestro de navegador",
  "Sistema corrompido após atualização interrompida ou queda de energia",
  "Antivírus duplicado ou serviços redundantes em segundo plano",
  "Drivers desatualizados ou incompatíveis após atualização do sistema",
  "Perfil de energia configurado para economia em vez de desempenho",
  "Hardware realmente abaixo do exigido pelos programas usados",
];

const VERIFICACOES = [
  "Reiniciar o equipamento e observar se a lentidão aparece logo ou só depois de um tempo de uso.",
  "Conferir quanto espaço livre resta no disco do sistema.",
  "Observar se o cooler acelera muito e se a base do notebook esquenta acima do normal.",
  "Anotar quais programas estão abertos quando a lentidão piora.",
  "Verificar se a lentidão acontece também com a internet desligada.",
  "Registrar há quanto tempo o problema começou e se houve atualização, queda de energia ou instalação recente.",
];

const OPCOES = [
  {
    titulo: "Instalação de SSD",
    desc: "É a intervenção com maior impacto percebido quando o sistema ainda roda em HD mecânico. Muda o tempo de inicialização, a abertura de programas e a resposta geral, sem trocar o equipamento.",
    to: "/servicos/upgrade-ssd-ram",
    label: "Upgrade de SSD e RAM",
  },
  {
    titulo: "Ampliação de memória RAM",
    desc: "Indicada quando a máquina trava com vários programas abertos ou com muitas abas. Depende do limite suportado pela placa e do padrão de memória compatível com o modelo.",
    to: "/servicos/upgrade-ssd-ram",
    label: "Ver limites de upgrade",
  },
  {
    titulo: "Limpeza interna e manutenção preventiva",
    desc: "Resolve a lentidão que aparece com o aquecimento. Envolve remoção de poeira, revisão da ventilação e, quando indicado, troca de pasta térmica.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Formatação com reinstalação limpa",
    desc: "Faz sentido quando o problema é de software: sistema corrompido, infecção persistente ou anos de instalações acumuladas. Não corrige HD lento nem falta de memória.",
    to: "/servicos/formatacao",
    label: "Formatação de computador",
  },
  {
    titulo: "Remoção de programas indesejados",
    desc: "Quando a lentidão vem acompanhada de anúncios, abas abrindo sozinhas e busca alterada, a limpeza direcionada costuma resolver sem reinstalar o sistema.",
    to: "/servicos/remocao-de-virus",
    label: "Remoção de vírus",
  },
];

const FAQS = [
  {
    question: "Por que o computador fica lento com o tempo?",
    answer:
      "Raramente por um motivo só. O disco vai enchendo e o sistema perde espaço de trabalho, programas se acumulam na inicialização, atualizações aumentam a exigência de memória e a poeira reduz a refrigeração. Cada fator sozinho seria discreto; somados, mudam a percepção de uso. Por isso a avaliação olha os quatro grupos antes de indicar qualquer intervenção.",
  },
  {
    question: "Vírus pode deixar o computador lento?",
    answer:
      "Pode, e é uma das origens possíveis. Programas indesejados, extensões de navegador e mineradores consomem processamento e rede continuamente. Quando a lentidão vem acompanhada de anúncios, abas abrindo sozinhas ou busca alterada, essa hipótese entra na frente — mas ela é confirmada na avaliação, não presumida.",
  },
  {
    question: "Travamentos podem indicar falha no HD ou no SSD?",
    answer:
      "Podem. Travamentos progressivos, arquivos que demoram a abrir, mensagens de erro de leitura e ruído de clique são sinais que pedem verificação da saúde do armazenamento. Não é conclusão automática: o mesmo comportamento aparece em problemas de memória ou de sistema. A diferença é que, havendo suspeita de disco, preservar os dados passa à frente de qualquer reparo.",
  },
  {
    question: "É seguro continuar usando o computador enquanto está lento?",
    answer:
      "Se a lentidão é estável e não há ruídos, erros de leitura nem travamentos progressivos, o uso normal costuma ser possível. Quando existem esses sinais ou arquivos importantes ainda sem cópia, insistir no uso aumenta o risco de perda de dados — nesse cenário o recomendado é fazer backup enquanto o sistema ainda abre e procurar avaliação, se necessário com apoio de recuperação de dados.",
  },

  {
    question: "Computador lento precisa sempre de formatação?",
    answer:
      "Não. Formatar resolve o que é software — sistema corrompido, infecção persistente ou acúmulo de instalações. Não resolve HD mecânico lento, memória insuficiente nem aquecimento. Formatar nesses casos devolve uma melhora curta, e a lentidão volta em poucos dias.",
  },
  {
    question: "Trocar o HD por SSD resolve mesmo?",
    answer:
      "Na maioria dos equipamentos que ainda usam HD mecânico como disco do sistema, é a mudança mais perceptível no dia a dia: inicialização, abertura de programas e resposta geral. Se a máquina já tem SSD e continua lenta, a causa é outra e o diagnóstico investiga memória, temperatura, software ou saúde do disco.",
  },
  {
    question: "Quanta memória RAM é suficiente?",
    answer:
      "Depende do uso real. Navegação com muitas abas, planilhas grandes e programas de trabalho simultâneos exigem mais do que uso básico. O que definimos na avaliação é o limite suportado pela placa, o padrão compatível e se a memória é de fato o gargalo — ampliar sem necessidade não traz ganho.",
  },
  {
    question: "Posso perder arquivos ao resolver a lentidão?",
    answer:
      "Instalação de SSD, ampliação de memória e limpeza interna não exigem apagar dados. Quando o caminho envolve reinstalação do sistema, a cópia dos arquivos é feita antes e você é avisado do que será preservado. Se o disco apresentar falha, preservar os dados vira prioridade sobre qualquer outra etapa.",
  },
  {
    question: "Quando vale mais trocar o computador do que investir nele?",
    answer:
      "Quando a placa não suporta mais memória, quando o processador limita o uso pretendido, quando a soma das peças se aproxima do valor de um equipamento equivalente ou quando há falha estrutural. Nesses casos explicamos o cenário e a alternativa, incluindo a migração dos seus dados para a máquina nova.",
  },
  {
    question: "O valor pode ser informado antes do diagnóstico?",
    answer:
      "Não com precisão. Lentidão é sintoma, não causa: o mesmo comportamento aparece em situações de complexidade bem diferente. As condições comerciais vigentes estão publicadas na página de preços e políticas, e o valor do serviço é apresentado depois da causa confirmada, dependendo da sua autorização.",
  },
];

const ComputadorLento = () => {
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
      name: "Computador lento: sintomas, causas possíveis e o que realmente resolve",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-computador-lento-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Computador lento" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Computador lento: sintomas, causas possíveis e o que realmente resolve
          </h1>
          {/* Texto integral preservado no HTML; no mobile o recorte visual mantém o CTA acima de 750 px. */}
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Lentidão quase nunca tem uma causa única. Um equipamento que demora para ligar, trava com poucos programas
            abertos ou piora depois de alguns minutos de uso pode estar limitado pelo armazenamento, pela memória, pela
            temperatura ou pelo próprio sistema. Esta página separa esses cenários, explica o que você pode observar
            antes de qualquer atendimento, quando SSD ou memória fazem diferença real, quando formatar resolve e em que
            momento investir no equipamento deixa de compensar.
          </p>
          <Button asChild size="lg" className="min-h-14">
            <a href={waHref} onClick={cta("hero")} data-cta-location="problema_hero">
              <MessageCircle className="mr-2 h-5 w-5" /> Iniciar diagnóstico
            </a>
          </Button>
        </div>
      </section>

      {/* Rodada 3P — piloto visual de sintoma: confiança + sumário da página. */}
      <TrustStrip />

      <RealImageSection
        imageKey="componentesSsd"
        secondaryImageKey="bancadaTecnica"
        layout="duo"
        caption="SSD e memória: peças avaliadas quando a lentidão é de hardware"
        secondaryCaption="Bancada usada para testes de disco, memória e temperatura"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "causas-familias", label: "Lentidão é sintoma, não diagnóstico" },
            { id: "sintomas", label: "Sintomas que separam as causas" },
            { id: "causas", label: "Causas possíveis" },
            { id: "opcoes", label: "O que resolve cada causa" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="causas-familias" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Lentidão é sintoma, não diagnóstico</h2>
          <p className="mb-3 text-muted-foreground">
            O erro mais comum é tratar toda lentidão como se fosse a mesma coisa e formatar por padrão. Na prática,
            existem quatro famílias de causa bem diferentes: armazenamento, memória, temperatura e software. Cada uma
            se manifesta de um jeito e exige uma solução distinta.
          </p>
          <p className="mb-3 text-muted-foreground">
            Um equipamento que demora para ligar e depois funciona razoavelmente costuma apontar para o disco. Um que
            responde bem sozinho e trava ao abrir vários programas aponta para memória. Um que começa rápido e piora
            com o tempo de uso aponta para aquecimento. E um que ficou lento de repente, depois de uma atualização ou
            de uma instalação, aponta para software.
          </p>
          <p className="text-muted-foreground">
            Por isso a triagem pergunta quando a lentidão aparece e o que está aberto no momento. Ela orienta a
            modalidade de atendimento, mas a causa só é confirmada com o equipamento avaliado.
          </p>
        </section>

        <div className="mb-12">
          <ChecklistPdfCard checklist={DIAGNOSTICO_CHECKLISTS["computador-lento"]} />
        </div>


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
            As origens abaixo aparecem com frequência nos atendimentos. Costumam se somar: um HD mecânico com pouco
            espaço livre e memória no limite produzem juntos uma lentidão que nenhuma das duas explicaria sozinha.
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
            <Gauge className="h-6 w-6 text-accent" /> O que você pode observar antes do atendimento
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhuma dessas verificações exige conhecimento técnico ou abrir o equipamento, e todas ajudam a encurtar o
            diagnóstico.
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
            O que não recomendamos: instalar "otimizadores" e limpadores de registro baixados por anúncio, acumular
            mais de um antivírus e desativar serviços do sistema por tutorial. Boa parte dos atendimentos de lentidão
            começa exatamente assim.
          </p>
        </section>

        <section id="opcoes" className="scroll-mt-24 mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Opções que resolvem cada tipo de causa</h2>
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
            <AlertTriangle className="h-6 w-6 text-destructive" /> Quando lentidão é sinal de alerta
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              • Ruído de clique no disco, travamentos longos e arquivos que somem: a prioridade deixa de ser desempenho
              e passa a ser preservar o conteúdo, com{" "}
              <Link to="/servicos/recuperacao-de-dados" className="font-medium text-accent hover:underline">
                recuperação de dados
              </Link>{" "}
              avaliada antes de qualquer tentativa de reparo no disco.
            </li>

            <li>• Desligamentos sozinho junto com a lentidão: pode envolver temperatura ou alimentação.</li>
            <li>• Telas azuis recorrentes: exigem investigação de memória, armazenamento e drivers, não formatação direta.</li>
            <li>• Lentidão surgida logo após queda de energia: o sistema ou o disco podem ter sido afetados.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <ShieldCheck className="h-6 w-6 text-accent" /> Como é feito o diagnóstico e o que influencia o valor
          </h2>
          <p className="mb-3 text-muted-foreground">
            A avaliação mede a saúde do armazenamento, o consumo real de memória, a temperatura sob uso e o que está
            sendo executado em segundo plano. Só com esses dados é possível dizer se o caminho é peça, limpeza,
            software ou combinação deles — e evitar gasto em algo que não é o gargalo.
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
            Quando o investimento deixa de fazer sentido diante do valor do equipamento, dizemos isso abertamente. Esse
            critério está detalhado em{" "}
            <Link to="/quando-nao-compensa" className="font-medium text-accent hover:underline">
              quando não compensa reparar
            </Link>
            .
          </p>
        </section>

        <section className="mb-12 rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="mb-3 text-2xl font-bold text-foreground">Sintomas relacionados</h2>
          <p className="mb-4 text-muted-foreground">
            Se além da lentidão o equipamento não dá sinal de energia ou não chega à área de trabalho, o cenário é
            outro e o diagnóstico começa por alimentação.
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/problemas/notebook-nao-liga" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Notebook não liga <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link to="/servicos/manutencao-de-notebook" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Manutenção de notebook <ArrowRight className="h-4 w-4" />
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
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Critérios objetivos antes de você decidir
          </h2>
          <p className="mb-5 text-muted-foreground">
            Nada aqui depende de opinião: são as regras de atendimento que valem para qualquer caso de lentidão, do
            primeiro contato até a entrega. Elas estão publicadas na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Processo em etapas</h3>
              <p className="text-sm text-muted-foreground">
                Triagem pelo WhatsApp, avaliação técnica com medição de disco, memória e temperatura, apresentação da
                causa provável e do serviço necessário e execução só depois da sua autorização expressa. Nenhuma peça é
                trocada e nenhum sistema é reinstalado sem esse aceite.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Tempo estimado</h3>
              <p className="text-sm text-muted-foreground">
                Casos de software e limpeza costumam ser resolvidos no mesmo atendimento. Troca de SSD ou memória
                depende da disponibilidade da peça compatível. Casos com suspeita de falha física exigem bancada e
                prazo informado antes de começar — se o prazo mudar, você é avisado.
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
            O que não prometemos: prazo fechado antes de ver o equipamento, valor definido por telefone e garantia de
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
              to: "/servicos/upgrade-ssd-ram",
              titulo: "Upgrade de SSD e memória",
              desc: "A intervenção de maior impacto quando o sistema ainda roda em HD mecânico ou falta memória.",
            },
            {
              to: "/servicos/manutencao-de-computador",
              titulo: "Manutenção de computador",
              desc: "Limpeza interna, pasta térmica e correção da lentidão causada por aquecimento.",
            },
            {
              to: "/servicos/formatacao",
              titulo: "Formatação com backup",
              desc: "Indicada quando a causa é software: sistema corrompido ou acúmulo de instalações.",
            },
            {
              to: "/guia-tecnico-informatica",
              titulo: "Guia técnico de informática",
              desc: "Como separar as famílias de falha, o checklist prévio e o que muda o desempenho de verdade.",
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
          <h2 className="mb-3 text-2xl font-bold">Descreva quando a lentidão aparece</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Conte se a demora é para ligar, ao abrir programas ou depois de um tempo de uso, e se houve atualização,
            queda de energia ou instalação recente. Com isso a triagem indica a modalidade e o próximo passo.
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

export default ComputadorLento;
