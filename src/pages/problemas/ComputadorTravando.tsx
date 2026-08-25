import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, ShieldAlert, MessageCircle } from "lucide-react";
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

const PATH = "/problemas/computador-travando";
const TITLE = "Computador Travando: Causas e Conserto | Curitiba";
const DESCRIPTION =
  "Computador travando do nada, congelando a tela ou parando só em jogos e programas pesados? Veja como separar memória com defeito, superaquecimento, disco em falha e driver antes de trocar peça, com avaliação técnica em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre computador travando. Meu computador está congelando e quero avaliação do que está causando.";

const SINTOMAS = [
  {
    titulo: "Tela congela e só volta reiniciando no botão",
    desc: "Travamento completo, sem mouse e sem teclado, aponta para memória com defeito, superaquecimento do processador ou fonte entregando tensão instável sob carga.",
  },
  {
    titulo: "Trava por alguns segundos e volta sozinho",
    desc: "Pausas curtas e repetidas são a assinatura de disco em falha: o sistema fica esperando a releitura de um setor problemático antes de continuar.",
  },
  {
    titulo: "Só trava em jogos ou em programas pesados",
    desc: "Travar sob carga e nunca em uso leve costuma ser temperatura, fonte subdimensionada ou driver de vídeo, não defeito do sistema operacional.",
  },
  {
    titulo: "Congela sempre no mesmo programa",
    desc: "Quando o travamento tem hora marcada e programa marcado, o suspeito é software: instalação corrompida, versão incompatível ou conflito de driver.",
  },
  {
    titulo: "Trava e mostra tela azul depois",
    desc: "Aí existe um código de erro registrado, e ele estreita muito a investigação. Esse caminho está detalhado na página de tela azul do Windows.",
  },
  {
    titulo: "Trava minutos depois de ligar e piora com o tempo",
    desc: "Comportamento típico de acúmulo de poeira no dissipador, pasta térmica ressecada ou ventoinha parada. O aparelho funciona frio e falha quente.",
  },
];

const CAUSAS = [
  "Módulo de memória RAM com falha ou mal encaixado",
  "Superaquecimento do processador por dissipador obstruído e pasta térmica ressecada",
  "Disco de sistema com setores em falha provocando releituras constantes",
  "Fonte de alimentação entregando tensão instável sob carga",
  "Driver de vídeo corrompido ou incompatível após atualização",
  "Atualização do sistema interrompida deixando arquivos inconsistentes",
  "Infecção ou programa em segundo plano consumindo processador e memória",
  "Disco de sistema sem espaço livre para arquivos temporários",
];

const VERIFICACOES = [
  "Anote quando trava: em repouso, sob carga ou sempre no mesmo programa. Esse dado sozinho já separa hardware de software.",
  "Abra o gerenciador de tarefas e observe se algum recurso vai a 100% pouco antes do travamento.",
  "Confira o espaço livre do disco do sistema; abaixo de 10% o travamento é esperado.",
  "Rode o teste de memória do próprio Windows (diagnóstico de memória) e registre o resultado.",
  "Encoste na saída de ar sob carga: ar muito quente com pouca vazão indica dissipador obstruído.",
  "Ouça o disco: estalos ou cliques significam falha física em curso, e a prioridade passa a ser backup.",
  "Desinstale e reinstale o driver de vídeo pela versão oficial do fabricante antes de suspeitar da placa.",
  "Se travar já na tela inicial, antes de o sistema carregar, o problema é hardware e não adianta mexer em software.",
];

const OPCOES = [
  {
    titulo: "Diagnóstico de memória e componentes em bancada",
    desc: "Teste módulo a módulo, troca cruzada com memória conhecida e verificação de tensões da fonte sob carga. É o caminho quando o travamento é total e sem hora marcada.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Limpeza interna e troca de pasta térmica",
    desc: "Quando o travamento só aparece com o aparelho quente, o serviço é mecânico: dissipador limpo, ventoinhas verificadas, pasta renovada e teste de temperatura sob carga depois.",
    to: "/problemas/computador-desliga-sozinho",
    label: "Computador desligando sozinho",
  },
  {
    titulo: "Substituição do disco com preservação dos dados",
    desc: "Disco com setores em falha não se conserta: o caminho é copiar os dados enquanto ainda há leitura e migrar o sistema para uma unidade saudável.",
    to: "/servicos/upgrade-ssd-ram",
    label: "Upgrade de SSD e memória",
  },
  {
    titulo: "Reinstalação limpa quando a causa é software",
    desc: "Travamento sempre no mesmo programa, depois de atualização interrompida ou com infecção confirmada resolve em software, com backup antes e restauração depois.",
    to: "/servicos/formatacao",
    label: "Formatação com backup",
  },
];

const FAQS = [
  {
    question: "Computador travando é sempre defeito de peça?",
    answer:
      "Não. Travamento tem duas famílias bem distintas. Quando é total, sem mouse e sem teclado, e acontece em qualquer situação, a suspeita principal é hardware: memória, temperatura ou fonte. Quando acontece sempre no mesmo programa ou depois de uma atualização específica, quase sempre é software. Separar as duas famílias antes de comprar qualquer peça é o que evita gasto errado.",
  },
  {
    question: "Como saber se a memória RAM é a culpada?",
    answer:
      "O teste de memória do próprio Windows já indica erro na maioria dos módulos defeituosos e é gratuito. Em bancada vamos além: testamos módulo a módulo em slots diferentes e cruzamos com memória conhecida. Isso responde tanto se o defeito é do módulo quanto se é do slot da placa-mãe, o que muda completamente o valor do reparo.",
  },
  {
    question: "Trava só quando jogo. É a placa de vídeo?",
    answer:
      "Pode ser, mas raramente é o primeiro suspeito. Travar apenas sob carga aponta antes para temperatura e para fonte de alimentação, porque é nesse momento que o consumo sobe. Driver de vídeo desatualizado ou corrompido é a terceira hipótese. A placa em si costuma ficar por último, e só entra na conta depois de teste cruzado.",
  },
  {
    question: "Travar e mostrar tela azul é o mesmo problema?",
    answer:
      "É o mesmo sintoma com uma vantagem: a tela azul deixa um código de erro registrado, e esse código aponta para o componente ou driver envolvido. Se o seu caso mostra tela azul, a investigação começa pelo código, e esse caminho está descrito na página específica de tela azul do Windows.",
  },
  {
    question: "Formatar resolve travamento?",
    answer:
      "Resolve quando a origem é software: sistema corrompido, atualização interrompida, driver conflitante ou infecção. Não resolve nada quando a origem é memória defeituosa, superaquecimento ou disco em falha, porque o hardware continua o mesmo depois da formatação. Por isso avaliamos antes e não vendemos formatação como solução universal.",
  },
  {
    question: "Meu computador trava e faz barulho. Preciso me preocupar?",
    answer:
      "Sim, quando o barulho é de estalo ou clique vindo do disco. Isso indica falha física em andamento e, nesse cenário, a prioridade deixa de ser o travamento e passa a ser salvar os dados enquanto o disco ainda responde. Barulho de ventoinha rasgada ou zumbido é outro caso, mecânico e menos urgente, tratado na página sobre computador fazendo barulho.",
  },
  {
    question: "Preciso levar o computador até vocês?",
    answer:
      "Não temos balcão de atendimento ao público. Casos de software podem ser resolvidos remotamente. Quando o diagnóstico exige teste de memória, fonte e temperatura, retiramos o equipamento no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado, com 90 dias de garantia sobre mão de obra e peça aplicada.",
  },
];

const ComputadorTravando = () => {
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
      name: "Computador travando: memória, temperatura, disco ou software",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-computador-travando-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Computador travando" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Computador travando: memória, temperatura, disco em falha ou software
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            O momento em que o travamento acontece diz mais do que qualquer teste. Esta página mostra como usar esse
            dado para separar peça defeituosa de problema de sistema antes de gastar.
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
        caption="Computador em teste de estabilidade com acompanhamento de temperatura e uso de memória"
        secondaryCaption="Bancada de diagnóstico usada para teste cruzado de memória, fonte e disco"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "quando-trava", label: "O momento do travamento" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="quando-trava" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">O momento do travamento é o melhor indício</h2>
          <p className="mb-3 text-muted-foreground">
            Um computador que congela não dá mensagem, mas dá contexto. Travar em repouso, travar sob carga e travar
            sempre no mesmo programa são três problemas diferentes com causas diferentes. Registrar em que situação
            acontece reduz o campo de investigação antes de qualquer teste técnico.
          </p>
          <p className="mb-3 text-muted-foreground">
            Travamento total, sem mouse e sem teclado, coloca memória, temperatura e fonte na frente da fila.
            Travamento curto e repetido aponta para disco. Travamento com hora marcada, em um programa específico,
            costuma ser software puro.
          </p>
          <p className="text-muted-foreground">
            Se junto com o congelamento aparece tela azul, comece pelo código de erro em{" "}
            <Link to="/problemas/tela-azul-windows" className="font-medium text-accent hover:underline">
              tela azul do Windows
            </Link>
            . Se o aparelho está apenas devagar, sem congelar, o caminho é{" "}
            <Link to="/problemas/computador-lento" className="font-medium text-accent hover:underline">
              computador lento
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
            Memória e temperatura respondem pela maior parte dos travamentos totais. Disco em falha domina os
            travamentos curtos e repetidos, e é o cenário com risco real de perda de dados.
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
            <ShieldAlert className="h-6 w-6 text-accent" /> Verificações antes de comprar qualquer peça
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. As primeiras observações são gratuitas e definem se o caso é de software, de temperatura ou
            de componente.
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
            O que não recomendamos: trocar memória por tentativa, instalar otimizadores e continuar usando um disco com
            estalos antes de salvar os arquivos.
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
            As condições completas de atendimento estão em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Teste antes da peça</h3>
              <p className="text-sm text-muted-foreground">
                Não trocamos memória, fonte ou disco por tentativa. Cada indicação vem de teste cruzado com componente
                conhecido, e o resultado é informado antes da aprovação.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Dados em primeiro lugar</h3>
              <p className="text-sm text-muted-foreground">
                Quando o disco apresenta falha física, o backup vem antes de qualquer reparo, e dizemos com clareza
                quando parte dos dados pode não ser recuperável.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e garantia</h3>
              <p className="text-sm text-muted-foreground">
                Sem balcão: retirada e devolução no endereço informado. Garantia de 90 dias sobre mão de obra e peça
                aplicada, limitada ao serviço executado.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: eliminar travamento sem identificar a origem, recuperação integral de dados em disco
            com falha física e prazo fixo antes de ver o equipamento.
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
          <h2 className="mb-3 text-2xl font-bold">Descreva quando o travamento acontece</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe se trava em repouso, sob carga ou sempre no mesmo programa, e se aparece tela azul. Com isso já
            indicamos se o caso é remoto ou de bancada.
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

export default ComputadorTravando;
