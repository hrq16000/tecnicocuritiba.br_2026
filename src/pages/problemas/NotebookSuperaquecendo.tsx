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
import { Button } from "@/components/ui/button";
import { SCHEMA_SLOTS, SLOT_PRIORITY, useJsonLdSlot } from "@/lib/jsonLdSlots";
import { whatsappLink, absoluteUrl } from "@/lib/siteConfig";
import { trackPageView, trackCTAClick } from "@/lib/analytics";
import ProximosProblemas from "@/components/problemas/ProximosProblemas";

const PATH = "/problemas/notebook-superaquecendo";
const TITLE = "Notebook Superaquecendo? Diagnóstico Técnico em Curitiba";
const DESCRIPTION =
  "Notebook esquentando, com cooler acelerado ou desligando sozinho: entenda o que é temperatura normal, quais causas são de poeira, pasta térmica, uso ou falha elétrica, e o que fazer antes do atendimento.";

const WA_MESSAGE =
  "Olá! Vim da página sobre notebook superaquecendo. Meu equipamento está esquentando muito e preciso de diagnóstico.";

const SINTOMAS = [
  {
    titulo: "Base quente e cooler acelerado em uso leve",
    desc: "Quando o equipamento esquenta só navegando ou com editor de texto aberto, a suspeita recai sobre obstrução de fluxo de ar, poeira acumulada no dissipador ou pasta térmica ressecada.",
  },
  {
    titulo: "Desempenho cai depois de alguns minutos ligado",
    desc: "Comportamento clássico de proteção térmica: ao chegar no limite, o próprio equipamento reduz a velocidade para evitar dano. Começa rápido e vai piorando conforme a temperatura sobe.",
  },
  {
    titulo: "Desligamento repentino sob esforço",
    desc: "Desligar sem aviso durante jogo, videochamada ou render aponta para proteção térmica atuando no limite — mas o mesmo comportamento aparece em carregador inadequado e bateria degradada.",
  },
  {
    titulo: "Cooler sempre no máximo, com ruído constante",
    desc: "Ventoinha em rotação alta o tempo todo indica que o sistema de refrigeração não está conseguindo dissipar. Pode ser sujeira, rolamento desgastado ou perfil de energia inadequado.",
  },
  {
    titulo: "Cooler silencioso demais e equipamento muito quente",
    desc: "Cenário mais preocupante que o anterior: pode significar ventoinha travada, cabo de alimentação da ventoinha solto ou sensor sem leitura correta.",
  },
  {
    titulo: "Cheiro de plástico aquecido, deformação ou bateria estufada",
    desc: "Aqui a orientação muda: desligue, retire da tomada e não volte a usar. Bateria estufada é risco físico e exige avaliação antes de qualquer tentativa de reparo.",
  },
];

const CAUSAS = [
  "Poeira acumulada no dissipador bloqueando a saída de ar",
  "Pasta térmica ressecada após anos de uso, perdendo a transferência de calor",
  "Ventoinha com rolamento desgastado, girando abaixo da rotação necessária",
  "Uso sobre cama, sofá ou almofada, obstruindo as entradas de ar da base",
  "Ambiente com ventilação ruim ou equipamento fechado em gaveta durante o uso",
  "Programas em segundo plano mantendo o processador em carga alta sem necessidade",
  "Perfil de energia configurado para desempenho máximo em uso cotidiano",
  "Carregador não original ou com potência abaixo da exigida pelo modelo",
  "Bateria degradada gerando calor adicional durante a carga",
];

const VERIFICACOES = [
  "Usar o notebook sobre superfície rígida e plana por alguns dias e observar se o comportamento muda.",
  "Notar se o calor concentra na base, no teclado ou perto da saída de ar.",
  "Observar se o cooler acelera antes do travamento ou se o desligamento é instantâneo.",
  "Anotar quais programas estão abertos quando o problema aparece.",
  "Verificar se a saída de ar está desobstruída e se sai fluxo perceptível de ar quente.",
  "Registrar há quanto tempo o equipamento não passa por limpeza interna.",
];

const OPCOES = [
  {
    titulo: "Limpeza interna com troca de pasta térmica",
    desc: "É a intervenção com maior efeito na maioria dos casos com mais de dois anos sem manutenção. Envolve desmontagem, remoção de poeira do dissipador, revisão da ventoinha e reaplicação de pasta térmica.",
    to: "/servicos/manutencao-de-notebook",
    label: "Manutenção de notebook",
  },
  {
    titulo: "Substituição de ventoinha",
    desc: "Indicada quando o rolamento está desgastado, quando há ruído metálico ou quando a rotação está abaixo do esperado mesmo após a limpeza. Depende da disponibilidade da peça compatível com o modelo.",
    to: "/servicos/manutencao-de-notebook",
    label: "Ver reparo de refrigeração",
  },
  {
    titulo: "Revisão de carga de sistema e programas em segundo plano",
    desc: "Quando o processador fica em carga alta sem motivo, a temperatura sobe por consumo, não por refrigeração. A verificação identifica o que está em execução e o que pode ser removido com segurança.",
    to: "/servicos/remocao-de-virus",
    label: "Remoção de programas indesejados",
  },
  {
    titulo: "Avaliação de bateria e alimentação",
    desc: "Bateria degradada e carregador inadequado geram calor e desligamento sob esforço. A avaliação mede a saúde da bateria e confere a compatibilidade do carregador antes de recomendar troca.",
    to: "/servicos/manutencao-de-notebook",
    label: "Avaliação de bateria e carregador",
  },
  {
    titulo: "Reinstalação limpa quando o consumo vem do sistema",
    desc: "Faz sentido quando anos de instalações acumuladas mantêm processos pesados ativos. Não substitui limpeza física nem corrige pasta térmica ressecada.",
    to: "/servicos/formatacao",
    label: "Formatação de notebook",
  },
];

const FAQS = [
  {
    question: "Qual temperatura é considerada normal em um notebook?",
    answer:
      "Não existe um número único: o limite depende do processador, do modelo e do tipo de uso. O que orienta a avaliação é o comportamento — se o equipamento sustenta o esforço sem perder desempenho, sem desligar e sem ruído anormal, a refrigeração está cumprindo o papel. Quando o desempenho cai progressivamente ou há desligamento, o limite está sendo atingido.",
  },
  {
    question: "Base de refrigeração resolve superaquecimento?",
    answer:
      "Ajuda como paliativo, principalmente em uso prolongado sob carga, mas não corrige a causa. Se o dissipador está obstruído por poeira ou a pasta térmica está ressecada, o calor continua não sendo transferido para fora — a base apenas atenua o efeito percebido na superfície.",
  },
  {
    question: "De quanto em quanto tempo o notebook precisa de limpeza interna?",
    answer:
      "Depende do ambiente e do uso. Equipamento em ambiente com poeira, animais ou uso diário intenso costuma pedir revisão mais cedo do que um usado poucas horas por semana em ambiente limpo. O sinal prático é o comportamento: cooler acelerando em tarefas leves e base mais quente que o habitual indicam que a revisão está atrasada.",
  },
  {
    question: "Superaquecimento pode danificar o notebook de forma permanente?",
    answer:
      "Pode. O calor prolongado acelera o desgaste de componentes, resseca ainda mais a pasta térmica e afeta bateria e placa ao longo do tempo. O desligamento automático existe justamente para evitar dano imediato, mas conviver com ele por meses aumenta o risco de falha que já não se resolve com limpeza.",
  },
  {
    question: "Trocar a pasta térmica é arriscado?",
    answer:
      "É um procedimento comum, mas exige desmontagem correta e dosagem adequada — excesso de pasta atrapalha em vez de ajudar, e parafusos apertados fora de ordem podem danificar a placa. Boa parte dos atendimentos de agravamento que recebemos vem de tentativa própria com tutorial genérico.",
  },
  {
    question: "Notebook desligando sozinho é sempre superaquecimento?",
    answer:
      "Não. É a hipótese mais comum quando o desligamento acontece sob esforço e depois de alguns minutos, mas o mesmo comportamento aparece em bateria degradada, carregador inadequado e falha de alimentação na placa. O momento em que ocorre é o que separa os cenários, e essa informação é pedida já na triagem.",
  },
  {
    question: "Usar o notebook na cama estraga o equipamento?",
    answer:
      "Não estraga de imediato, mas obstrui as entradas de ar da base e faz o sistema trabalhar acima do necessário. Como hábito diário, acelera o acúmulo de poeira no dissipador e antecipa a necessidade de limpeza interna. Superfície rígida e plana é a recomendação prática mais simples.",
  },
  {
    question: "Preciso trocar a bateria se ela estiver estufada?",
    answer:
      "Bateria estufada não volta ao estado normal e representa risco físico, inclusive de deformar a carcaça e pressionar componentes internos. A orientação é interromper o uso e encaminhar para avaliação. A troca depende da disponibilidade de bateria compatível com o modelo e é aprovada por você antes da execução.",
  },
  {
    question: "Meus arquivos correm risco durante a limpeza interna?",
    answer:
      "Limpeza interna, troca de pasta térmica e substituição de ventoinha não envolvem apagar dados. Quando a avaliação identifica que o disco também apresenta perda de saúde, isso é informado antes, e preservar os arquivos passa à frente de qualquer outra etapa.",
  },
  {
    question: "O valor pode ser informado antes do diagnóstico?",
    answer:
      "Não com precisão. Modelos diferentes exigem desmontagens de complexidade bem distinta, e a necessidade de peça só é confirmada com o equipamento aberto. As condições comerciais vigentes estão publicadas na página de preços e políticas, e o valor do serviço é apresentado depois da avaliação, dependendo da sua autorização.",
  },
];

const NotebookSuperaquecendo = () => {
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
      name: "Notebook superaquecendo: o que investigar antes de trocar qualquer peça",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-notebook-superaquecendo-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      {/* "Problemas" é nível taxonômico, não rota: fica sem link no visual e sem URL no BreadcrumbList. */}
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Notebook superaquecendo" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Notebook superaquecendo: o que investigar antes de trocar qualquer peça
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Notebook quente não é necessariamente notebook com defeito. O que importa é se ele sustenta o esforço sem
            perder desempenho e sem desligar. Esta página separa o aquecimento normal do sinal de problema, mostra o
            que é poeira, pasta térmica, ventoinha, uso ou alimentação, e explica o que você pode observar antes do
            atendimento — inclusive quando parar de usar o equipamento imediatamente.
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
        secondaryImageKey="ferramentas"
        layout="duo"
        caption="Notebook aberto para limpeza do dissipador e revisão da ventoinha"
        secondaryCaption="Ferramentas usadas na desmontagem e na reaplicação de pasta térmica"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "normal-ou-problema", label: "Quente ou superaquecendo?" },
            { id: "sintomas", label: "Sintomas que separam as causas" },
            { id: "causas", label: "Causas possíveis" },
            { id: "opcoes", label: "O que resolve cada causa" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="normal-ou-problema" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Quente ou superaquecendo? A diferença prática</h2>
          <p className="mb-3 text-muted-foreground">
            Todo notebook aquece: o espaço interno é reduzido e o calor precisa sair por um único caminho. Aquecer sob
            esforço, com cooler acelerando e voltando ao normal depois, é o funcionamento esperado. O problema começa
            quando a temperatura passa a limitar o uso.
          </p>
          <p className="mb-3 text-muted-foreground">
            Três sinais indicam que o limite está sendo atingido: o desempenho cai de forma progressiva conforme o
            tempo ligado, o equipamento desliga sem aviso sob carga, ou o cooler permanece no máximo mesmo em tarefas
            leves. Qualquer um deles significa que o sistema de refrigeração já não dá conta do calor gerado.
          </p>
          <p className="text-muted-foreground">
            A investigação separa dois lados: geração de calor (o que o equipamento está processando, como está
            alimentado, qual perfil de energia está ativo) e dissipação (poeira, pasta térmica, ventoinha, obstrução de
            ar). Tratar apenas um dos lados é o motivo mais comum de o problema voltar semanas depois.
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
            As origens abaixo são as mais frequentes nos atendimentos e costumam se somar: poeira acumulada e pasta
            térmica ressecada, juntas, produzem um aquecimento que nenhuma das duas explicaria isoladamente.
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

        <section id="quadro" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Quando o calor aparece: um quadro para localizar o seu caso
          </h2>
          <p className="mb-4 text-muted-foreground">
            O momento em que o aquecimento incomoda diz mais sobre a causa do que a temperatura em si. O quadro abaixo
            reúne as situações que mais chegam à triagem e o que costuma explicar cada uma. Ele orienta a conversa, não
            substitui a avaliação com o equipamento em bancada.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {["Quando acontece", "Causa mais provável", "Menos provável", "O que observar"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="border border-border bg-secondary px-3 py-2 text-left font-semibold text-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Esquenta e desliga depois de alguns minutos sob carga",
                    "Dissipação comprometida: poeira no radiador ou pasta térmica ressecada",
                    "Falha de placa",
                    "Se precisa esfriar antes de aceitar ligar de novo",
                  ],
                  [
                    "Esquenta muito só em jogos ou edição",
                    "Refrigeração no limite para o esforço exigido",
                    "Defeito",
                    "Se o desempenho cai progressivamente durante a sessão",
                  ],
                  [
                    "Esquenta em tarefas leves, com cooler sempre no máximo",
                    "Carga de processamento em segundo plano ou perfil de energia em desempenho máximo",
                    "Pasta térmica",
                    "Quais processos consomem processador em repouso",
                  ],
                  [
                    "Esquenta mais quando está carregando",
                    "Bateria degradada ou carregador inadequado gerando calor extra",
                    "Ventoinha",
                    "Se o calor concentra perto do conector de energia",
                  ],
                  [
                    "Base muito quente, saída de ar quase sem fluxo",
                    "Obstrução do dissipador ou ventoinha com rotação abaixo do esperado",
                    "Sistema",
                    "Se há ruído metálico ou chiado ao acelerar",
                  ],
                  [
                    "Desliga de forma aleatória, mesmo frio",
                    "Alimentação: bateria, carregador ou circuito de energia",
                    "Temperatura",
                    "Se ocorre também logo após ligar",
                  ],
                  [
                    "Esquenta usando sobre cama, sofá ou almofada",
                    "Entradas de ar da base obstruídas",
                    "Falha interna",
                    "Se o comportamento muda em superfície rígida e plana",
                  ],
                  [
                    "Passou a esquentar depois de uma manutenção recente",
                    "Montagem do dissipador ou dosagem de pasta térmica",
                    "Poeira",
                    "Há quanto tempo o serviço foi feito e o que foi trocado",
                  ],
                  [
                    "Carcaça deformada, bateria estufada ou cheiro de queimado",
                    "Risco físico — interromper o uso",
                    "—",
                    "Encaminhar para avaliação sem insistir em ligar",
                  ],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-border px-3 py-2 align-top text-muted-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Um ponto que gera confusão: a queda de desempenho sob calor é proteção, não defeito. Processadores reduzem a
            própria frequência quando a temperatura sobe demais, e o desligamento automático é o último recurso desse
            mecanismo — descrito na documentação técnica dos próprios fabricantes de processador. Ele evita dano
            imediato, mas conviver com ele por meses é o que desgasta o equipamento.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <Gauge className="h-6 w-6 text-accent" /> O que você pode observar antes do atendimento
          </h2>
          <p className="mb-4 text-muted-foreground">
            Nenhuma dessas verificações exige abrir o equipamento, e todas encurtam o diagnóstico.
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
            O que não recomendamos: soprar ar comprimido direto na ventoinha travando as pás, abrir o equipamento por
            tutorial genérico de outro modelo, aplicar pasta térmica em excesso e insistir no uso com bateria estufada
            ou cheiro de plástico aquecido.
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
            <li>• Bateria estufada, carcaça deformada ou touchpad empurrado para cima: risco físico, não estético.</li>
            <li>• Cheiro de plástico aquecido ou de queimado vindo da saída de ar.</li>
            <li>• Desligamento repetido em intervalos cada vez menores, mesmo em uso leve.</li>
            <li>
              • Travamentos junto com arquivos que somem: nesse caso a prioridade muda para{" "}
              <Link to="/servicos/recuperacao-de-dados" className="font-medium text-accent hover:underline">
                recuperação de dados
              </Link>{" "}
              antes de qualquer intervenção térmica.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
            <ShieldCheck className="h-6 w-6 text-accent" /> Como é feito o diagnóstico e o que influencia o valor
          </h2>
          <p className="mb-3 text-muted-foreground">
            A avaliação mede a temperatura sob carga, observa a rotação real da ventoinha, verifica o fluxo de ar,
            confere o que está em execução em segundo plano e checa a saúde da bateria e a compatibilidade do
            carregador. Só com esses dados é possível dizer se o caminho é limpeza, peça, sistema ou alimentação.
          </p>
          <p className="mb-3 text-muted-foreground">
            O esforço varia conforme o modelo — há equipamentos que exigem desmontagem completa para chegar ao
            dissipador. Peças e materiais são tratados à parte do serviço. Nada além do diagnóstico é executado sem a
            sua autorização — o fluxo completo está em{" "}
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
            Se além do calor o equipamento está lento o tempo todo, apresenta tela azul ou não dá sinal de energia, o
            diagnóstico começa por outro caminho.
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/problemas/computador-lento" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Computador lento <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link to="/problemas/tela-azul-windows" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Tela azul no Windows <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <Link to="/problemas/notebook-nao-liga" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                Notebook não liga <ArrowRight className="h-4 w-4" />
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
            Nada aqui depende de opinião: são as regras de atendimento que valem para qualquer caso de aquecimento, do
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
                Triagem pelo WhatsApp, medição de temperatura sob carga, verificação de ventoinha e fluxo de ar,
                apresentação da causa provável e execução só depois da sua autorização expressa. Nenhuma peça é
                trocada sem esse aceite.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Tempo estimado</h3>
              <p className="text-sm text-muted-foreground">
                Limpeza interna com troca de pasta térmica costuma ser resolvida no mesmo atendimento de bancada.
                Substituição de ventoinha ou bateria depende da disponibilidade da peça compatível, com prazo
                informado antes de começar.
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
            O que não prometemos: temperatura-alvo garantida por número, prazo fechado antes de ver o equipamento e
            reparo de carcaça deformada por bateria estufada. Quando algo está fora do que conseguimos assegurar,
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
              desc: "Limpeza interna, revisão de ventoinha e troca de pasta térmica com desmontagem específica do modelo.",
            },
            {
              to: "/servicos/manutencao-de-computador",
              titulo: "Manutenção de computador",
              desc: "Mesmo critério térmico aplicado a desktops, com revisão de fluxo de ar e refrigeração.",
            },
            {
              to: "/servicos/upgrade-ssd-ram",
              titulo: "Upgrade de SSD e memória",
              desc: "Quando a lentidão persiste depois de resolvido o aquecimento, o gargalo costuma estar em disco ou memória.",
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

        <ProximosPassos waHref={waHref} onCta={cta("proximos-passos")} ctaLocation="problema_proximos_passos" />

        <section className="rounded-xl bg-[hsl(var(--hero-bg))] p-8 text-center text-white">
          <h2 className="mb-3 text-2xl font-bold">Descreva quando o notebook esquenta</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Conte se o calor aparece em uso leve ou só sob esforço, se há desligamento, ruído de ventoinha ou queda de
            desempenho, e há quanto tempo o equipamento não passa por limpeza interna.
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

export default NotebookSuperaquecendo;
