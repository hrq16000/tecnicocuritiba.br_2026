import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { AlertTriangle, ArrowRight, BatteryCharging, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
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

const PATH = "/problemas/notebook-nao-carrega-bateria";
const TITLE = "Notebook Não Carrega a Bateria? Diagnóstico em Curitiba";
const DESCRIPTION =
  "Notebook conectado à tomada mas sem carregar, parado em uma porcentagem fixa ou funcionando só no cabo: entenda o que é bateria, carregador, conector de energia ou placa, e o que verificar antes do atendimento.";

const WA_MESSAGE =
  "Olá! Vim da página sobre notebook que não carrega a bateria. Meu equipamento está com problema de carga e preciso de diagnóstico.";

const SINTOMAS = [
  {
    titulo: "Mostra \"conectado, não carregando\"",
    desc: "O sistema reconhece a alimentação externa, mas a carga não avança. Esse par de informações é útil: significa que energia está chegando e o bloqueio está na etapa de carga, não no cabo inteiro.",
  },
  {
    titulo: "Só funciona com o carregador ligado",
    desc: "Ao retirar o cabo o equipamento desliga na hora, sem aviso e sem porcentagem. Comportamento típico de bateria que perdeu a capacidade de sustentar carga, mas também aparece em contato interno rompido.",
  },
  {
    titulo: "Carga travada em uma porcentagem fixa",
    desc: "Fica parado em 0%, 40% ou 80% independentemente do tempo na tomada. Alguns modelos têm limite de carga configurado de fábrica ou por aplicativo do fabricante — antes de trocar peça, essa hipótese precisa ser descartada.",
  },
  {
    titulo: "Carrega de forma intermitente ao mexer no cabo",
    desc: "Se a carga aparece e some conforme a posição do conector, a suspeita recai sobre o cabo, o pino de alimentação ou a solda do conector na placa, e não sobre a bateria.",
  },
  {
    titulo: "Carrega muito devagar ou aquece durante a carga",
    desc: "Carregador de potência abaixo da exigida pelo modelo alimenta o uso mas não dá conta de carregar. Aquecimento anormal na região da bateria durante a carga é motivo para avaliação antes de continuar.",
  },
  {
    titulo: "Carcaça deformada, touchpad empurrado ou bateria estufada",
    desc: "Aqui a orientação muda completamente: desligue, retire da tomada e não volte a usar até a avaliação. Não é questão estética nem de desempenho, é risco físico.",
  },
];

const CAUSAS = [
  "Bateria com ciclos esgotados, sem capacidade de reter carga",
  "Carregador com potência abaixo da exigida pelo modelo (comum em fonte universal)",
  "Cabo do carregador com rompimento interno próximo ao conector",
  "Conector de energia da placa com solda fria ou trilha rompida por esforço mecânico",
  "Circuito de carga da placa-mãe com componente danificado após oscilação elétrica",
  "Contato sujo ou oxidado entre a bateria e a placa",
  "Limite de carga ativado no aplicativo do fabricante ou na configuração de energia",
  "Driver ou controlador de bateria em estado inconsistente após atualização",
  "Sensor de temperatura interrompendo a carga por aquecimento",
];

const VERIFICACOES = [
  "Testar em outra tomada e sem extensão ou filtro de linha, eliminando problema da rede elétrica.",
  "Observar se o LED de carga do notebook acende, pisca ou permanece apagado com o cabo conectado.",
  "Anotar exatamente a mensagem exibida pelo sistema (\"conectado\", \"não carregando\", porcentagem fixa).",
  "Verificar se o cabo esquenta, se há dobra acentuada ou se a carga muda ao movimentar o conector.",
  "Checar se existe aplicativo do fabricante com limite de carga habilitado.",
  "Registrar se o equipamento desliga instantaneamente ao remover o cabo ou se ainda segura alguns minutos.",
];

const OPCOES = [
  {
    titulo: "Avaliação de saúde da bateria",
    desc: "Mede capacidade real contra a capacidade de projeto e conta os ciclos já consumidos. É o que separa bateria desgastada de bloqueio de carga por outro motivo — e evita trocar uma peça que ainda estava dentro do esperado.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Teste e substituição de carregador",
    desc: "Confere tensão, corrente e compatibilidade com o modelo. Fonte universal de potência inferior é uma das causas mais frequentes de carga lenta ou inexistente em notebooks mais novos.",
    to: "/servicos/manutencao-de-notebook",
    label: "Avaliação de alimentação",
  },
  {
    titulo: "Reparo do conector de energia",
    desc: "Indicado quando a carga só aparece em certas posições do cabo. Envolve desmontagem e ressolda do conector na placa, com teste de esforço mecânico depois — procedimento de bancada, não de balcão.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Diagnóstico do circuito de carga na placa",
    desc: "Quando bateria e carregador estão saudáveis e a carga continua bloqueada, a investigação passa para o circuito de carga da placa-mãe, com medição ponto a ponto antes de qualquer intervenção.",
    to: "/diagnostico-tecnico",
    label: "Diagnóstico técnico",
  },
  {
    titulo: "Revisão de configuração de energia e controlador",
    desc: "Cobre limite de carga do fabricante, perfil de energia e controlador em estado inconsistente. É a hipótese mais barata de descartar e por isso vem antes de qualquer troca de peça.",
    to: "/servicos/formatacao",
    label: "Revisão de sistema",
  },
];

const FAQS = [
  {
    question: "Notebook que só funciona na tomada tem conserto?",
    answer:
      "Na maioria dos casos sim, mas o caminho depende da causa. Se a bateria perdeu capacidade, a solução é substituição por peça compatível com o modelo. Se o problema está no conector de energia ou no circuito de carga, o reparo é feito na placa. A avaliação existe justamente para não trocar bateria quando o bloqueio está em outro ponto.",
  },
  {
    question: "Dá para saber se o problema é bateria ou carregador sem abrir o equipamento?",
    answer:
      "Boa parte da separação é feita por leitura de dados e teste de alimentação, sem desmontagem. A saúde da bateria pode ser lida pelo próprio sistema e a fonte pode ser medida externamente. A desmontagem só entra quando a suspeita recai sobre conector ou circuito interno.",
  },
  {
    question: "Quanto tempo dura a bateria de um notebook?",
    answer:
      "Bateria é peça de consumo e trabalha por ciclos, não por tempo de calendário. Uso diário em carga completa e descarga total consome ciclos mais rápido do que uso predominantemente na tomada com carga parcial. Quando a autonomia cai para poucos minutos, o desgaste normalmente já está no limite.",
  },
  {
    question: "Usar o notebook sempre na tomada estraga a bateria?",
    answer:
      "Nos modelos atuais o controlador interrompe a carga ao atingir o limite, então o risco não é o de \"sobrecarregar\". O que acelera o desgaste é o calor: manter o equipamento quente e conectado por muitas horas seguidas afeta a bateria ao longo do tempo. Vários fabricantes oferecem limite de carga justamente para esse cenário.",
  },
  {
    question: "Carregador universal serve no meu notebook?",
    answer:
      "Serve quando tensão, corrente e conector correspondem ao exigido pelo modelo. O problema mais comum é potência abaixo do necessário: o equipamento liga, funciona, mas não sobra energia para carregar a bateria. Nesses casos o sintoma aparece como carga travada ou extremamente lenta.",
  },
  {
    question: "Bateria estufada é perigosa?",
    answer:
      "Sim. Bateria estufada pressiona teclado, touchpad e carcaça, e não volta ao estado normal. A orientação é interromper o uso, desconectar da tomada e encaminhar para avaliação. O descarte é feito de forma adequada, e a troca depende da disponibilidade de peça compatível com o modelo.",
  },
  {
    question: "Meus arquivos correm risco na troca de bateria ou reparo do conector?",
    answer:
      "Nenhuma das duas intervenções envolve apagar dados. Se durante a avaliação for identificada perda de saúde no armazenamento, isso é informado antes de qualquer procedimento, e preservar os arquivos passa à frente do restante.",
  },
  {
    question: "Vocês têm bateria para qualquer modelo?",
    answer:
      "Não prometemos disponibilidade universal. Baterias são específicas por modelo e algumas linhas antigas já não têm peça nova de qualidade no mercado. Quando é esse o caso, dizemos abertamente em vez de instalar um componente genérico de procedência duvidosa.",
  },
  {
    question: "O valor pode ser informado antes da avaliação?",
    answer:
      "Não com precisão, porque trocar bateria, ressoldar conector e reparar circuito de carga são intervenções de complexidade muito diferente. As condições comerciais vigentes estão publicadas na página de preços e políticas, e o valor é apresentado depois do diagnóstico, dependendo da sua autorização.",
  },
  {
    question: "Preciso levar o notebook até algum endereço?",
    answer:
      "Não atendemos em balcão. O contato começa pelo WhatsApp, e o equipamento é retirado e devolvido no endereço combinado, com as condições de coleta descritas na página de coleta e entrega.",
  },
];

const NotebookNaoCarregaBateria = () => {
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
      name: "Notebook não carrega a bateria: como separar bateria, carregador e placa",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-notebook-nao-carrega-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Notebook não carrega a bateria" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Notebook não carrega a bateria: como separar bateria, carregador e placa
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Bateria que não carrega quase nunca é uma causa só. Entre a tomada e a célula existem cabo, fonte,
            conector, circuito de carga, controlador e configuração de energia — e cada um deles falha de um jeito
            diferente. Esta página mostra qual sintoma aponta para qual etapa, o que você pode verificar sem abrir o
            equipamento e em que situação o uso precisa parar imediatamente.
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
        secondaryImageKey="diagnostico"
        layout="duo"
        caption="Notebook aberto para acesso à bateria e ao conector de energia"
        secondaryCaption="Medição de tensão na entrada de alimentação antes de qualquer troca de peça"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "caminho-da-energia", label: "O caminho da energia" },
            { id: "sintomas", label: "Sintomas que separam as causas" },
            { id: "causas", label: "Causas possíveis" },
            { id: "opcoes", label: "O que resolve cada causa" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="caminho-da-energia" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">O caminho da energia até a bateria</h2>
          <p className="mb-3 text-muted-foreground">
            Antes de chegar à célula, a energia passa por cinco etapas: tomada e cabo, fonte externa, conector de
            alimentação na carcaça, circuito de carga na placa e, por fim, o controlador que decide quando carregar.
            Uma falha em qualquer uma delas produz o mesmo sintoma visível — a porcentagem que não sobe.
          </p>
          <p className="mb-3 text-muted-foreground">
            Por isso a pergunta certa não é "a bateria morreu?", e sim "em que etapa a energia parou?". Substituir a
            bateria com o conector rompido resolve nada, e trocar o carregador com o circuito de carga danificado
            também não. A ordem do diagnóstico segue exatamente esse caminho, do mais barato de descartar ao mais
            complexo.
          </p>
          <p className="text-muted-foreground">
            Um detalhe simples orienta bastante: se o equipamento funciona normalmente com o cabo conectado, energia
            está chegando e o problema está da etapa de carga em diante. Se ele nem liga com o cabo, a investigação
            começa antes disso — cenário tratado em{" "}
            <Link to="/problemas/notebook-nao-liga" className="font-medium text-accent hover:underline">
              notebook que não liga
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
            As origens abaixo são as mais recorrentes nos atendimentos de carga e frequentemente se combinam: uma
            fonte de potência inferior, por exemplo, acelera o desgaste de uma bateria que já estava no limite.
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
            <BatteryCharging className="h-6 w-6 text-accent" /> O que você pode verificar antes do atendimento
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhuma dessas verificações exige abrir o equipamento, e todas encurtam bastante o diagnóstico.
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
            O que não recomendamos: emendar cabo de carregador rompido com fita, usar fonte de outro modelo sem
            conferir tensão e corrente, congelar a bateria seguindo tutorial de vídeo e insistir na carga quando há
            deformação da carcaça ou aquecimento anormal.
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
            <AlertTriangle className="h-6 w-6 text-destructive" /> Quando parar de usar imediatamente
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Bateria estufada, carcaça aberta nas junções ou touchpad empurrado para cima.</li>
            <li>• Aquecimento anormal na região da bateria ou do conector durante a carga.</li>
            <li>• Cheiro de plástico aquecido, faísca ou estalo ao conectar o carregador.</li>
            <li>• Cabo com fio exposto, derretimento na capa ou conector com folga acentuada.</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Nesses casos, desconecte da tomada e encaminhe para avaliação antes de qualquer nova tentativa de carga.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <ShieldCheck className="h-6 w-6 text-accent" /> Como é feito o diagnóstico e o que influencia o valor
          </h2>
          <p className="mb-3 text-muted-foreground">
            A avaliação lê a capacidade real e os ciclos da bateria, mede a saída da fonte, testa o comportamento com
            e sem bateria instalada, verifica o conector sob esforço e, quando necessário, acompanha o circuito de
            carga na placa. Só com esse conjunto é possível dizer se o caminho é peça, solda ou configuração.
          </p>
          <p className="mb-3 text-muted-foreground">
            O esforço varia conforme o modelo: há equipamentos com bateria externa de encaixe rápido e outros que
            exigem desmontagem completa para acesso. Peças são tratadas à parte do serviço e nada é executado sem a
            sua autorização — o fluxo está em{" "}
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
            Quando a soma de bateria e reparo se aproxima do valor de um equipamento equivalente, dizemos isso
            abertamente. Esse critério está detalhado em{" "}
            <Link to="/quando-nao-compensa" className="font-medium text-accent hover:underline">
              quando não compensa reparar
            </Link>
            .
          </p>
        </section>

        <section className="mb-12 rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="mb-3 text-2xl font-bold text-foreground">Sintomas relacionados</h2>
          <p className="mb-4 text-muted-foreground">
            Se além da carga o equipamento não dá sinal de vida, esquenta demais ou apresenta instabilidade no
            sistema, o diagnóstico começa por outro caminho.
          </p>
          <ul className="space-y-2">
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
              <Link to="/problemas/tela-azul-windows" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Tela azul no Windows <ArrowRight className="h-4 w-4" />
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
            São as mesmas regras de atendimento aplicadas a qualquer caso de carga, do primeiro contato até a
            devolução. Estão publicadas na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Processo em etapas</h3>
              <p className="text-sm text-muted-foreground">
                Triagem pelo WhatsApp, leitura de saúde da bateria, medição da fonte, teste do conector sob esforço,
                apresentação da causa provável e execução apenas depois da sua autorização expressa.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Tempo estimado</h3>
              <p className="text-sm text-muted-foreground">
                Troca de bateria com peça disponível costuma ser resolvida no mesmo atendimento de bancada. Reparo de
                conector e de circuito de carga exige prazo maior, informado antes de começar.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia declarada</h3>
              <p className="text-sm text-muted-foreground">
                90 dias de garantia sobre a mão de obra do serviço executado, no mesmo defeito tratado. Baterias e
                fontes seguem a garantia do fornecedor, com a nota entregue junto ao equipamento.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: autonomia garantida por número de horas, disponibilidade de bateria para qualquer
            modelo antigo e recuperação de célula já degradada. Quando algo está fora do que conseguimos assegurar,
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
              to: "/servicos/manutencao-de-notebook",
              titulo: "Manutenção de notebook",
              desc: "Avaliação de bateria, alimentação e refrigeração com desmontagem específica do modelo.",
            },
            {
              to: "/servicos/conserto-placa",
              titulo: "Conserto de placa",
              desc: "Ressolda de conector de energia e reparo do circuito de carga em bancada, com medição ponto a ponto.",
            },
            {
              to: "/diagnostico-tecnico",
              titulo: "Diagnóstico técnico",
              desc: "Como a avaliação é conduzida e o que é medido antes de qualquer recomendação de peça.",
            },
            {
              to: "/guia-tecnico-informatica",
              titulo: "Guia técnico de informática",
              desc: "As famílias de falha e o checklist prévio que encurta qualquer atendimento.",
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
          <h2 className="mb-3 text-2xl font-bold">Descreva o comportamento da carga</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Conte o que aparece na tela ao conectar o cabo, se o LED acende, se a porcentagem trava em algum valor e
            se o equipamento desliga na hora ao remover o carregador.
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

export default NotebookNaoCarregaBateria;
