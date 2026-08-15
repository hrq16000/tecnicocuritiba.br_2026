import { useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, MessageCircle, Volume2 } from "lucide-react";
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

const PATH = "/problemas/computador-fazendo-barulho";
const TITLE = "Computador Fazendo Barulho: Como Identificar a Origem | Curitiba";
const DESCRIPTION =
  "PC barulhento, ventoinha rugindo, estalo ou zumbido? Entenda como separar cooler, fonte, disco rígido e ruído elétrico antes de trocar peça, e como funciona a coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre computador fazendo barulho. Meu equipamento está com ruído e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Ruído constante que aumenta com o uso",
    desc: "Ventoinha girando mais alto porque a temperatura subiu. Nesse caso o barulho não é o defeito: é o sintoma de um sistema de refrigeração saturado por poeira, pasta térmica ressecada ou fluxo de ar obstruído.",
  },
  {
    titulo: "Chiado metálico ou rangido intermitente",
    desc: "Rolamento de ventoinha em fim de vida. Costuma piorar no frio e nos primeiros minutos após ligar, e some quando a hélice ganha rotação. É desgaste mecânico, não sujeira.",
  },
  {
    titulo: "Clique ritmado vindo do disco",
    desc: "Barulho repetitivo em disco rígido indica falha da cabeça de leitura. Aqui o ruído é urgência: cada nova tentativa de ligar reduz a chance de recuperar os arquivos.",
  },
  {
    titulo: "Zumbido grave que acompanha a carga",
    desc: "Ruído elétrico em bobina, comum em fonte e placa de vídeo sob esforço. Nem sempre significa defeito, mas em fonte genérica costuma vir junto de tensão instável.",
  },
  {
    titulo: "Batida seca ou pancada dentro do gabinete",
    desc: "Cabo encostando na hélice, presilha solta ou ventoinha desalinhada. É o tipo de causa que se resolve em minutos na bancada e que muita gente tenta resolver trocando peça boa.",
  },
  {
    titulo: "Estalo seguido de silêncio e desligamento",
    desc: "O único sintoma da lista que pede desligar imediatamente. Estalo com cheiro de queimado indica componente rompido, e insistir em ligar espalha o dano para outras placas.",
  },
];

const CAUSAS = [
  "Poeira acumulada em dissipador, filtro e pás da ventoinha",
  "Pasta térmica ressecada, elevando a temperatura e a rotação",
  "Rolamento de cooler desgastado após anos de uso contínuo",
  "Ventoinha da fonte travando por sujeira ou fim de vida",
  "Disco rígido mecânico com falha de cabeça ou motor",
  "Cabo interno encostando na hélice do cooler",
  "Bobina de fonte ou de placa de vídeo vibrando sob carga",
  "Gabinete apoiado em carpete ou móvel fechado, sem entrada de ar",
];

const VERIFICACOES = [
  "Identifique de onde vem o ruído com o gabinete aberto e a lateral livre — frente, traseira, fonte ou disco mudam completamente o diagnóstico.",
  "Se o barulho for clique ritmado no disco, desligue e não volte a ligar até avaliar: o dano é progressivo.",
  "Observe se o ruído acompanha a carga (jogo, edição, exportação) ou se aparece já na inicialização.",
  "Confira se o computador está apoiado em superfície rígida, com folga atrás e nas laterais.",
  "Grave um áudio curto do ruído — isso ajuda muito na triagem antes da coleta.",
  "Não lubrifique ventoinha com óleo doméstico: alivia por poucos dias e acelera o travamento.",
  "Não use aspirador diretamente na placa; a eletricidade estática gerada é um risco real.",
  "Não trave a hélice com o dedo para 'testar' — pode romper o eixo e o cabo de comando.",
];

const OPCOES = [
  {
    titulo: "Limpeza técnica e troca de pasta térmica",
    desc: "Desmontagem, remoção da poeira compactada no dissipador e reaplicação de pasta. Resolve a maior parte dos casos de ruído por temperatura, e devolve rotação normal sem trocar nenhuma peça.",
    to: "/servicos/manutencao-de-computador",
    label: "Manutenção de computador",
  },
  {
    titulo: "Substituição de ventoinha ou cooler",
    desc: "Quando o rolamento já está gasto, limpeza não devolve o silêncio. A troca é por modelo de mesmo encaixe e vazão, com teste de rotação e temperatura sob carga antes de fechar.",
    to: "/servicos/manutencao-de-computador",
    label: "Avaliar troca de cooler",
  },
  {
    titulo: "Avaliação de fonte com ruído",
    desc: "Fonte barulhenta é medida sob carga com equipamento de referência. Se a tensão estiver fora da faixa, a troca deixa de ser conforto e passa a ser proteção do restante do hardware.",
    to: "/servicos/manutencao-de-computador",
    label: "Diagnóstico de fonte",
  },
  {
    titulo: "Disco com ruído mecânico",
    desc: "Ruído vindo do armazenamento muda a prioridade: primeiro preservar os arquivos, depois pensar em substituir a unidade. O trabalho é feito sobre cópia, nunca sobre o disco original.",
    to: "/servicos/recuperacao-de-dados",
    label: "Recuperação de dados",
  },
];

const FAQS = [
  {
    question: "Computador barulhento sempre significa defeito?",
    answer:
      "Não. Um equipamento com refrigeração exigida por jogo ou edição de vídeo eleva a rotação naturalmente, e isso é o sistema funcionando. O que indica problema é a mudança de padrão: ficar alto em tarefa leve, apresentar ruído metálico, estalo ou clique, ou passar a rugir logo na inicialização. Quando o barulho muda de caráter e não só de volume, existe algo mecânico ou térmico por trás.",
  },
  {
    question: "Como sei se o barulho é da ventoinha ou do disco?",
    answer:
      "O ruído de ventoinha é contínuo, varia com a carga e muda quando o cooler acelera. O de disco é ritmado, repetitivo e independe do esforço que a máquina está fazendo. Uma pista prática: em computador com SSD como unidade principal, ruído rítmico só pode vir de peça mecânica, o que reduz muito as possibilidades. Na dúvida, desligue — se o custo de errar for perder arquivos, a decisão prudente é não insistir.",
  },
  {
    question: "Limpar o computador resolve o ruído?",
    answer:
      "Resolve em boa parte dos casos, quando a origem é poeira compactada no dissipador ou fluxo de ar obstruído. Mas limpeza não recupera rolamento gasto nem corrige pasta térmica ressecada — por isso a limpeza técnica em bancada inclui a reaplicação da pasta e o teste de temperatura sob carga depois de fechar. Se o ruído voltar em poucas semanas, a causa não era sujeira.",
  },
  {
    question: "Posso usar o computador enquanto ele faz barulho?",
    answer:
      "Depende do ruído. Rugido por temperatura permite uso, ainda que com desgaste e perda de desempenho por redução automática de frequência. Chiado de rolamento também permite, mas caminha para o travamento da ventoinha, e cooler parado significa superaquecimento. Já clique de disco e estalo com cheiro de queimado pedem desligamento imediato: nesses dois casos, continuar usando aumenta o prejuízo.",
  },
  {
    question: "Quanto custa resolver ruído de computador?",
    answer:
      "A faixa depende da origem. Limpeza técnica com troca de pasta é o cenário mais comum e mais acessível. Substituição de ventoinha soma a peça. Fonte e disco envolvem valores maiores, porque não são apenas conforto acústico: mexem em confiabilidade e em dados. O valor fechado sai depois da inspeção, com sua aprovação antes de qualquer execução — as condições estão publicadas na página de preços e políticas.",
  },
  {
    question: "Trocar por ventoinha maior deixa mais silencioso?",
    answer:
      "Em geral sim, porque uma hélice maior move o mesmo volume de ar com menos rotação, e rotação é o que gera ruído. Mas só funciona quando o gabinete tem espaço e furação compatíveis e quando o problema real é térmico. Colocar cooler potente em máquina cheia de poeira apenas mascara a causa por algum tempo. Avaliamos a montagem antes de sugerir troca de peça.",
  },
  {
    question: "Vocês atendem em casa ou preciso levar o equipamento?",
    answer:
      "Não temos balcão de atendimento ao público. O contato começa pelo WhatsApp, com a descrição do ruído, e o equipamento é retirado no endereço informado por coleta, sendo devolvido no mesmo endereço depois do serviço. Casos simples podem ser resolvidos em visita técnica, conforme a agenda; casos que exigem bancada seguem por coleta.",
  },
  {
    question: "Existe garantia no serviço de limpeza e troca de cooler?",
    answer:
      "Sim, com escopo declarado: 90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco em que atuamos. Ruído que apareça em outro componente depois do atendimento é um caso novo e é tratado como tal, com avaliação própria. Não prometemos silêncio absoluto: informamos qual nível de ruído é esperado para o seu hardware antes de executar.",
  },
];

const ComputadorFazendoBarulho = () => {
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
      name: "Computador fazendo barulho: origem do ruído e reparo",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-computador-fazendo-barulho-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "Computador fazendo barulho" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            Computador fazendo barulho: como descobrir a origem antes de trocar peça
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Ruído de computador não é um defeito só. Rugido por temperatura, chiado de rolamento, clique de disco e
            zumbido elétrico têm causas, urgências e custos completamente diferentes — e o erro mais caro é comprar
            cooler novo para um problema que era de pasta térmica, de cabo encostado ou de disco em falha.
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
        caption="Gabinete aberto em bancada para localizar a origem do ruído"
        secondaryCaption="Teste de rotação e temperatura sob carga antes de fechar o equipamento"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "tipos-de-ruido", label: "Cada ruído, uma causa" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="tipos-de-ruido" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Cada tipo de ruído aponta para um lugar diferente</h2>
          <p className="mb-3 text-muted-foreground">
            A primeira pergunta em bancada nunca é "qual peça trocar", e sim "que som é esse". Ruído de ar em volume
            alto é refrigeração respondendo a calor. Ruído metálico é peça mecânica gasta. Ruído ritmado é
            armazenamento. Ruído que acompanha a carga elétrica é bobina. São quatro famílias com desfechos que não se
            parecem em nada: uma termina em limpeza, outra em troca de cooler, outra em recuperação de arquivos.
          </p>
          <p className="mb-3 text-muted-foreground">
            É por isso que a substituição por achismo custa caro. Trocar a ventoinha de um computador cujo dissipador
            está entupido devolve silêncio por poucos dias, porque a temperatura continua alta e a nova peça também
            vai girar no máximo. E trocar peça em máquina cujo ruído vinha do disco desperdiça exatamente as horas em
            que os arquivos ainda poderiam ser copiados.
          </p>
          <p className="text-muted-foreground">
            Quando o ruído vem junto de lentidão ou desligamento, vale cruzar com{" "}
            <Link to="/problemas/computador-lento" className="font-medium text-accent hover:underline">
              computador lento
            </Link>{" "}
            e{" "}
            <Link to="/problemas/computador-desliga-sozinho" className="font-medium text-accent hover:underline">
              computador desliga sozinho
            </Link>
            , porque temperatura costuma ser o elo entre os três sintomas.
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
            Uma parte relevante dos atendimentos de ruído termina sem troca de peça nenhuma: poeira, pasta térmica e
            cabo encostado respondem por muitos casos. Só a inspeção define em qual grupo o seu está — descrição por
            mensagem serve para orientar a urgência, não para fechar diagnóstico.
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
            <Volume2 className="h-6 w-6 text-accent" /> O que verificar antes de comprar qualquer peça
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os dois primeiros itens separam o caso urgente do caso apenas incômodo.
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
            O que não recomendamos em nenhuma hipótese: aplicar óleo em rolamento, remover a ventoinha e usar o
            computador "só por enquanto" sem refrigeração, fechar o gabinete com cabo solto perto da hélice e insistir
            em ligar depois de estalo com cheiro de queimado.
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
            Valem para todo atendimento de ruído e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Causa antes da peça</h3>
              <p className="text-sm text-muted-foreground">
                Medimos temperatura e rotação antes e depois. Nenhum componente é substituído sem que o teste mostre
                que a troca resolve o ruído.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. Retiramos o equipamento no endereço informado e devolvemos no
                mesmo endereço depois do serviço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia com escopo</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado. Ruído novo em outro componente é
                avaliado como caso novo.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: computador silencioso independentemente do hardware, prazo fechado antes da
            inspeção e diagnóstico definitivo por áudio enviado no WhatsApp.
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
          <h2 className="mb-3 text-2xl font-bold">Descreva o ruído do seu computador</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe se o som é contínuo ou ritmado, de onde parece vir, se piora com o uso e há quanto tempo começou.
            Esses detalhes definem a urgência da coleta e evitam troca de peça desnecessária.
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

export default ComputadorFazendoBarulho;
