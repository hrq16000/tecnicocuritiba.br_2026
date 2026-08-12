import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, MessageCircle, MonitorSmartphone } from "lucide-react";
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

const PATH = "/problemas/tv-desligando-sozinha";
const TITLE = "TV Desligando Sozinha: Causas e Conserto | Curitiba";
const DESCRIPTION =
  "Televisor que desliga sozinho, reinicia ou entra em ciclo de LED piscando? Entenda como separar capacitor de fonte, proteção térmica, ajuste de economia e placa principal, com avaliação por coleta em Curitiba.";

const WA_MESSAGE =
  "Olá! Vim da página sobre TV desligando sozinha. Minha televisão está desligando sem eu mandar e preciso de avaliação.";

const SINTOMAS = [
  {
    titulo: "Desliga depois de alguns minutos ligada e não volta logo",
    desc: "Padrão clássico de componente da fonte que perde característica quando aquece. Costuma piorar com o tempo: começa em uma hora de uso e passa a acontecer em poucos minutos.",
  },
  {
    titulo: "Desliga e liga de novo sozinha, em ciclo",
    desc: "O aparelho tenta iniciar, detecta uma tensão fora da faixa e se protege. É um mecanismo de defesa da própria TV, e não uma falha aleatória do software.",
  },
  {
    titulo: "Apaga a imagem, mas o LED continua aceso",
    desc: "Se o som continua e só a imagem some, o quadro provavelmente é de iluminação da tela e não de desligamento — outro diagnóstico, com outro custo.",
  },
  {
    titulo: "Desliga sempre no mesmo intervalo de tempo",
    desc: "Regularidade quase cronométrica aponta para temporizador de desligamento ou modo de economia configurado no menu, algo que se resolve sem qualquer reparo.",
  },
  {
    titulo: "Desliga quando o volume sobe ou em cenas claras",
    desc: "Falha que aparece sob pico de consumo indica fonte incapaz de sustentar carga. Costuma vir acompanhada de estalos discretos ou aquecimento da traseira.",
  },
  {
    titulo: "Desliga só com um aparelho conectado",
    desc: "Receptor, console ou adaptador com defeito derruba a TV. Vale testar sem nada conectado antes de concluir que o problema é do televisor.",
  },
];

const CAUSAS = [
  "Capacitor da fonte com capacidade degradada, falhando ao aquecer",
  "Circuito de proteção atuando por tensão fora da faixa esperada",
  "Fonte incapaz de sustentar pico de consumo em cenas claras ou volume alto",
  "Solda fadigada em conexão de alta corrente da placa de alimentação",
  "Placa principal com falha intermitente no controle de energia",
  "Temporizador de desligamento ou modo de economia ativado no menu",
  "Atualização de firmware interrompida deixando o aparelho instável",
  "Aquecimento excessivo por ventilação obstruída atrás do televisor",
];

const VERIFICACOES = [
  "Abra o menu e desative temporizador, modo de economia e desligamento por ausência de sinal.",
  "Desconecte tudo — receptor, console, barra de som, adaptadores — e deixe a TV ligada só na tomada.",
  "Ligue o aparelho direto na tomada, sem extensão, filtro de linha ou estabilizador compartilhado.",
  "Anote em quanto tempo o desligamento acontece e se ele varia com a temperatura ambiente.",
  "Observe se o LED fica piscando em algum padrão depois de apagar — é uma informação diagnóstica.",
  "Confirme se há folga de ventilação atrás do televisor e se as grades estão limpas.",
  "Não abra a traseira: a fonte armazena carga perigosa mesmo com o aparelho desligado da tomada.",
  "Não insista em religar em sequência quando houver estalo, cheiro de queimado ou aquecimento anormal.",
];

const OPCOES = [
  {
    titulo: "Avaliação e reparo da fonte",
    desc: "Medimos as tensões da placa de alimentação sob carga, com o aparelho aquecido, porque falha térmica não aparece em teste rápido. A maior parte dos casos de desligamento se resolve aqui.",
    to: "/servicos/conserto-tv",
    label: "Conserto de TV",
  },
  {
    titulo: "Reparo em nível de componente",
    desc: "Capacitor degradado e solda fadigada são tratados pontualmente com estação de retrabalho, sem substituir a placa inteira. Depois do reparo, o televisor fica em teste prolongado antes de voltar.",
    to: "/servicos/conserto-placa",
    label: "Conserto de placa",
  },
  {
    titulo: "Quando o reparo não compensa",
    desc: "Se o custo se aproxima do valor de um aparelho equivalente, ou se a peça necessária não existe mais para o modelo, dizemos isso com o número na mão em vez de empurrar o serviço.",
    to: "/quando-nao-compensa",
    label: "Quando não compensa reparar",
  },
  {
    titulo: "Coleta e devolução no endereço",
    desc: "O televisor é retirado embalado no endereço informado, avaliado em bancada e devolvido no mesmo endereço. Nada é executado antes de você aprovar o valor apresentado.",
    to: "/coleta-e-entrega",
    label: "Como funciona a coleta",
  },
];

const FAQS = [
  {
    question: "Minha TV desliga sozinha depois de alguns minutos. O que costuma ser?",
    answer:
      "O padrão mais comum é componente da fonte de alimentação que perde característica ao aquecer. Nos primeiros minutos tudo funciona; conforme a temperatura sobe, a tensão sai da faixa e o circuito de proteção desliga o aparelho para evitar dano maior. Antes de concluir isso, vale eliminar o óbvio: temporizador ativado no menu, modo de economia e aparelho externo com defeito derrubando a TV.",
  },
  {
    question: "A TV desliga e liga sozinha em ciclo. Isso danifica o aparelho?",
    answer:
      "O ciclo em si é a proteção funcionando, então ele existe justamente para evitar dano. O que agrava o quadro é insistir: cada tentativa de partida submete a fonte a um pico de corrente que acelera a degradação de componentes já comprometidos. Se o aparelho entrou em ciclo, o melhor caminho é deixá-lo desligado da tomada até a avaliação.",
  },
  {
    question: "Pode ser só uma configuração do menu?",
    answer:
      "Pode, e é a primeira coisa a verificar porque não custa nada. Temporizador de desligamento, modo de economia de energia e desligamento automático por ausência de sinal produzem exatamente o mesmo sintoma de uma falha de fonte. A diferença está na regularidade: configuração desliga sempre no mesmo intervalo, enquanto falha térmica varia conforme temperatura e tempo de uso.",
  },
  {
    question: "Vocês conseguem reparar sem trocar a placa inteira?",
    answer:
      "Na maior parte dos casos, sim. Capacitor degradado e solda fadigada são tratados em nível de componente, com estação de retrabalho, o que custa uma fração da substituição do conjunto. Quando o dano se espalha por trilhas ou atinge circuitos integrados sem reposição disponível, o reparo pontual deixa de ser viável — e nesse caso informamos em vez de tentar.",
  },
  {
    question: "Vale a pena consertar ou é melhor comprar outra?",
    answer:
      "O critério é objetivo: quando o custo do reparo se aproxima do valor de um televisor equivalente, não indicamos o serviço. Reparo de fonte costuma ficar bem abaixo desse limite e devolve anos de uso ao aparelho. Falha na placa principal de modelos com peça descontinuada é o cenário que mais se aproxima dele. Damos a orientação depois da avaliação, mesmo quando a resposta é não fazer.",
  },
  {
    question: "Preciso levar a TV até vocês?",
    answer:
      "Não, e nem recomendamos. Não temos balcão de atendimento ao público. Transportar televisor sem embalagem adequada é uma das principais causas de dano de painel — um problema muito pior que o desligamento original. Retiramos o aparelho embalado no endereço informado e devolvemos no mesmo endereço depois do serviço aprovado.",
  },
  {
    question: "A imagem some mas o som continua. É o mesmo problema?",
    answer:
      "Não. Se o som segue e o LED continua aceso, o televisor não desligou: é a iluminação da tela que parou de acender. O diagnóstico, o procedimento e o custo são outros, e esse quadro está descrito na página sobre TV com som e sem imagem. Descrever com precisão o que acontece com som e LED encurta bastante a triagem.",
  },
  {
    question: "Qual a garantia do reparo de fonte?",
    answer:
      "90 dias sobre a mão de obra e sobre a peça aplicada, limitada ao bloco reparado. Reparo na placa de alimentação cobre a placa de alimentação. Falha posterior em outro circuito é avaliada como caso novo. Descarga elétrica, raio e oscilação severa da rede depois da entrega caracterizam dano novo e não estão cobertos pela garantia.",
  },
];

const TvDesligandoSozinha = () => {
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
      name: "TV desligando sozinha: causas, reparo e limites",
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

  const cta = (location: string) => () => trackCTAClick("whatsapp", `problema-tv-desligando-sozinha-${location}`);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO title={TITLE} description={DESCRIPTION} path={PATH} />
      <Header />
      <Breadcrumbs items={[{ label: "Problemas", href: "/problemas" }, { label: "TV desligando sozinha" }]} />

      <section className="bg-[hsl(var(--hero-bg))] text-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-on-dark sm:mb-3 sm:text-sm">
            Sintoma · Curitiba e região
          </p>
          <h1 className="mb-3 text-[1.7rem] font-bold leading-[1.12] sm:mb-4 sm:text-3xl md:text-4xl">
            TV desligando sozinha: proteção da fonte, ajuste do menu ou falha de placa
          </h1>
          <p className="mb-4 line-clamp-4 text-[0.95rem] leading-relaxed opacity-95 sm:mb-6 sm:line-clamp-none sm:text-base">
            Televisor que apaga sem comando quase nunca é defeito aleatório: na maioria dos casos é o próprio aparelho
            se protegendo de uma tensão fora da faixa. Esta página mostra como separar configuração de menu, falha
            térmica de fonte e problema de placa antes de qualquer orçamento.
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
        caption="Televisor em teste prolongado de estabilidade após avaliação da fonte"
        secondaryCaption="Reparo pontual de componente na placa de alimentação com estação de retrabalho"
      />

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <PageTableOfContents
          className="mb-12"
          items={[
            { id: "protecao", label: "Por que a TV se desliga" },
            { id: "sintomas", label: "Sintomas e o que indicam" },
            { id: "causas", label: "Causas mais comuns" },
            { id: "opcoes", label: "O que resolve cada cenário" },
            { id: "faq", label: "Perguntas frequentes" },
          ]}
        />

        <section id="protecao" className="scroll-mt-24 mb-12">
          <h2 className="mb-4 text-2xl font-bold text-foreground">A TV não "pifa" sozinha: ela se protege</h2>
          <p className="mb-3 text-muted-foreground">
            Todo televisor moderno monitora as próprias tensões. Quando um valor sai da faixa aceitável, o circuito de
            proteção corta a alimentação para evitar dano maior. É por isso que o desligamento repentino costuma ser
            sintoma de fonte comprometida, e não de "defeito de software".
          </p>
          <p className="mb-3 text-muted-foreground">
            Antes de falar em reparo, três verificações eliminam boa parte dos chamados: temporizador ativado no menu,
            modo de economia por ausência de sinal e aparelho conectado com defeito derrubando a TV. São gratuitas e
            levam poucos minutos.
          </p>
          <p className="text-muted-foreground">
            Se o aparelho não responde ao controle nem acende o LED, o quadro é outro e está descrito em{" "}
            <Link to="/problemas/tv-nao-liga" className="font-medium text-accent hover:underline">
              TV não liga
            </Link>
            . Se apenas a imagem some e o som continua, veja{" "}
            <Link to="/problemas/tv-com-som-sem-imagem" className="font-medium text-accent hover:underline">
              TV com som e sem imagem
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
            Aparelho com vários anos de uso, instalação em móvel fechado sem ventilação e rede elétrica instável são os
            três contextos que mais aparecem. Só a medição sob carga, com o televisor já aquecido, distingue fonte
            degradada de falha na placa principal.
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
            <MonitorSmartphone className="h-6 w-6 text-accent" /> Verificações que você pode fazer antes de acionar alguém
          </h2>
          <p className="mb-4 text-muted-foreground">
            Siga na ordem. Os três primeiros itens resolvem sozinhos uma parte real dos casos, sem nenhum custo.
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
            O que não recomendamos em nenhuma hipótese: abrir a traseira do televisor, tentar descarregar componentes da
            fonte, religar em sequência após estalo e transportar o aparelho sem proteção rígida nas bordas.
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
            Valem para todo atendimento de televisor e estão publicados na íntegra em{" "}
            <Link to="/precos-e-politicas" className="font-medium text-accent hover:underline">
              preços e políticas de atendimento
            </Link>
            .
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Limite declarado</h3>
              <p className="text-sm text-muted-foreground">
                Não trocamos painel de televisor. Se a avaliação apontar dano de painel, informamos e devolvemos o
                aparelho sem cobrar tentativa de reparo.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Coleta e entrega</h3>
              <p className="text-sm text-muted-foreground">
                Não há atendimento presencial em balcão. O televisor é retirado embalado no endereço informado e
                devolvido no mesmo endereço.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold text-foreground">Garantia com escopo</h3>
              <p className="text-sm text-muted-foreground">
                90 dias sobre mão de obra e peça aplicada, limitada ao bloco reparado. Descarga elétrica posterior é
                dano novo e não está coberta.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            O que não prometemos: fechar diagnóstico apenas pelo relato no WhatsApp, garantir peça de linha
            descontinuada e sustentar reparo em aparelho com dano por descarga elétrica generalizada.
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
          <h2 className="mb-3 text-2xl font-bold">Conte em quanto tempo a TV desliga</h2>
          <p className="mx-auto mb-6 max-w-2xl opacity-95">
            Informe o modelo, o intervalo até o desligamento e se o LED fica piscando depois. Com essas três
            informações já conseguimos orientar a expectativa antes da coleta.
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

export default TvDesligandoSozinha;
